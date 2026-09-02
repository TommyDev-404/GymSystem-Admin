import { prisma } from "../../../lib/prisma";
import { getIO } from "../../../lib/socket";
import { sendMail } from "../../../utils/mailer";
import { generateOTP } from "../../../utils/otp-generator";
import { generateReferralCode } from "../../../utils/referralGenerator";
import { CreateMemberDTO, MemberFilters } from "./members.types";

function calculateDuration(duration_type: string, duration: number) {
	const startDate = new Date();
	const endDate = new Date();

	switch(duration_type){

		case "Day":
			endDate.setDate(endDate.getDate() + duration);
			break;

		case "Week":
			endDate.setDate(endDate.getDate() + (duration * 7));
			break;

		case "Month":
			endDate.setMonth(endDate.getMonth() + duration);
			break;
	}

	return {
		startDate, 
		endDate
	};
}


export const getMemberSummaryService = async () => {
	const now = new Date();

	// Start of today
	const startOfToday = new Date(now);
	startOfToday.setHours(0, 0, 0, 0);

	// Tomorrow
	const startOfTomorrow = new Date(startOfToday);
	startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

	const endOfTomorrow = new Date(startOfTomorrow);
	endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
	endOfTomorrow.setMilliseconds(-1);

	// End of day 3 days from today
	const endOf3Days = new Date(startOfToday);
	endOf3Days.setDate(endOf3Days.getDate() + 3);
	endOf3Days.setHours(23, 59, 59, 999);

	// End of day 7 days from today
	const endOf7Days = new Date(startOfToday);
	endOf7Days.setDate(endOf7Days.getDate() + 7);
	endOf7Days.setHours(23, 59, 59, 999);

	const [
		active,
		activeMale,
		activeFemale,

		expired,
		expiredMale,
		expiredFemale,

		expiringTomorrow,
		expiringWithin3Days,
		expiringWithin7Days,
	] = await prisma.$transaction([
		// ==========================================
		// ACTIVE MEMBERS
		// ==========================================

		prisma.member_memberships.count({
			where: {
				status: "Active",
				end_date: {
					gte: now,
				},
			},
		}),

		prisma.member_memberships.count({
			where: {
				status: "Active",
				end_date: {
					gte: now,
				},
				members: {
					gender: "Male",
				},
			},
		}),

		prisma.member_memberships.count({
			where: {
				status: "Active",
				end_date: {
					gte: now,
				},
				members: {
					gender: "Female",
				},
			},
		}),

		// ==========================================
		// EXPIRED MEMBERS
		// ==========================================

		prisma.member_memberships.count({
			where: {
				status: "Expired",
				end_date: {
					lt: now,
				},
			},
		}),

		prisma.member_memberships.count({
			where: {
				status: "Expired",
				end_date: {
					lt: now,
				},
				members: {
					gender: "Male",
				},
			},
		}),

		prisma.member_memberships.count({
			where: {
				status: "Expired",
				end_date: {
					lt: now,
				},
				members: {
					gender: "Female",
				},
			},
		}),

		// ==========================================
		// EXPIRING TOMORROW
		// ==========================================

		prisma.member_memberships.count({
			where: {
				status: "Active",
				end_date: {
					gte: startOfTomorrow,
					lte: endOfTomorrow,
				},
			},
		}),

		// ==========================================
		// EXPIRING IN 2–3 DAYS
		// ==========================================

		prisma.member_memberships.count({
			where: {
				status: "Active",
				end_date: {
					gt: endOfTomorrow,
					lte: endOf3Days,
				},
			},
		}),

		// ==========================================
		// EXPIRING IN 4–7 DAYS
		// ==========================================

		prisma.member_memberships.count({
			where: {
				status: "Active",
				end_date: {
					gt: endOf3Days,
					lte: endOf7Days,
				},
			},
		}),
	]);

	const expiringSoon = expiringTomorrow + expiringWithin3Days + expiringWithin7Days;

	return {
		active,
		activeMale,
		activeFemale,

		expiringSoon,
		expiringTomorrow,
		expiringWithin3Days,
		expiringWithin7Days,

		expired,
		expiredMale,
		expiredFemale,
	};
};

export const getMembersService = async (filters: MemberFilters) => {
	const { search, gender, status } = filters;

	const members =  await prisma.members.findMany({
		where: {
			...(gender && { gender }),

			...(search && {
				fullname: {
					contains: search,
				},
			}),

			...(status && {
				member_memberships: { 
					some: { status }
				}
			}),
		},

		select: {
			id: true,
			fullname: true,
			email: true,
			age: true,
			gender: true,
			join_date: true,
			member_memberships: {
				select: {
					id: true,
					start_date: true,
					end_date: true,
					status: true,

					membership_plans: {
						select: { 
							id: true,
							plan_name: true,
							duration_type: true,
							duration: true,
							price: true
						}
					}
				},
				orderBy: {
					created_at: "desc"
				}
			}
		},
		orderBy: {
			join_date: "desc",
		},
	});

	return members.map((m) => ({
		id: m.id,
		fullname: m.fullname,
		age: m.age,
		email: m.email,
		gender: m.gender,
		membership_id: m.member_memberships[0].id,
		plan_id: m.member_memberships[0].membership_plans.id,
		plan_name: m.member_memberships[0].membership_plans.plan_name,
		plan_price: m.member_memberships[0].membership_plans.price,
		membership_start: m.member_memberships[0].start_date,
		membership_end: m.member_memberships[0].end_date,
		duration_type: m.member_memberships[0].membership_plans.duration_type,
		duration: m.member_memberships[0].membership_plans.duration,
		status: m.member_memberships[0].status
	})) ?? [];
	
};

export const createMemberService = async (data: CreateMemberDTO) => {
	const referralCode = generateReferralCode(data.fullname);
	const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

	const result = await prisma.$transaction(async (tx) => {
		// Find plan
		const plan = await tx.membership_plans.findUnique({
			where:{
				id: data.plan_id
			}
		});

		if(!plan){
			throw new Error(
				"Membership plan not found"
			);
		}

		// Check referral code if provided
		let referrer = null;

		if(data.referral_code){
			referrer = await tx.members.findUnique({
				where: {
					referral_code: data.referral_code
				}
			});

			if(!referrer){
				throw new Error(
					"Invalid referral code"
				);
			}
		}

		const existingMember = await tx.members.findUnique({
			where: {
				email: data.email,
			},
			select: {
				id: true,
				fullname: true,
				is_activated: true,
			},
		});
		
		if (existingMember) {
			throw new Error("A member with this email already exists");
		}

		// Create member
		const member = await tx.members.create({
			data:{
				fullname: data.fullname,
				email: data.email,
				age: data.age,
				gender: data.gender,
				points: 0,
				referral_code: referralCode
			}
		});

		// Create referral record
		if(referrer){
			await tx.referrals.create({
				data:{
					referrer_id: referrer.id,
					referee_id: member.id,
					referrer_points: 100,
					referee_points: 50
				}
			});

			// Add 100 points to referrer
			await tx.members.update({
				where:{
					id: referrer.id
				},
				data:{
					points:{
						increment:100
					}
				}
			});

			// Add 50 points to the new member who used referral code
			await tx.members.update({
				where:{
					id: member.id
				},
				data:{
					points:{
						increment: 50
					}
				}
			});
		}

		// Create membership record
		const { startDate, endDate } = calculateDuration(plan.duration_type, plan.duration);
		const membership = await tx.member_memberships.create({
			data:{
				member_id: member.id,
				plan_id: plan.id,
				start_date: startDate,
				end_date: endDate
			}
		});
		
		// Activation
		await tx.member_activations.create({
			data:{
				member_id: member.id,
				activation_code: activationCode,
				expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
				is_used:false
			}
		});

		// Create payment record
		const payment = await tx.payments.create({
			data: {
				membership_id: membership.id,
				member_id: member.id,
				amount: plan.price,
				payment_method: data.payment_method,
				payment_type: "Membership",
				status: "Paid",
				description: `Initial payment for ${plan.plan_name} membership`,
			},
		});

		// Create admin notification
		await tx.notifications.create({
			data: {
				recipient_id: payment.member_id,
				recipient_type: "ADMIN",
				category: "MEMBER",
				type: "MEMBER_ADDED",
				title: "New Member Added",
				description: `${member.fullname} was added as a new member with a ${plan.plan_name} membership.`
			}
		});
 
		// Create member notification
		await tx.notifications.create({
			data: {
				recipient_id: payment.member_id,
				recipient_type: 'MEMBER',
				category: "PAYMENT",
				type: "PAYMENT_RECORDED",
				title: "Payment Recorded",
				description: `Your payment of ₱${Number(payment.amount).toLocaleString(
					"en-PH",
					{
						minimumFractionDigits: 2,
					}
				)} for ${plan.plan_name} membership has been successfully recorded.`,
			}
		});
		
		// Admin activity
		await tx.activities.create({
			data:{
				recipient_id: Number(member.id),
				recipient_type: "ADMIN",
				category: "MEMBER",
				title: "Member Added",
				description: `Admin added ${member.fullname} as a new member.`
			}
		});

		await tx.activities.create({
			data: {
				recipient_id: member.id,
				recipient_type: "ADMIN",
				category: "PAYMENT",
				title: "Payment Received",
				description: `Payment of ₱${Number(payment.amount).toLocaleString(
					"en-PH",
					{
						minimumFractionDigits: 2,
					}
				)} received from ${member.fullname} for ${plan.plan_name} membership.`,
			},
		});

		return {
			...member,
			plan:plan.plan_name
		};

	});
	
	// Email
	await sendMail({
		to: result.email,
		subject: "Your Gym Activation Code",
		html: `
			<div style="margin:0;padding:40px 16px;background-color:#f5f6f8;font-family:Arial,Helvetica,sans-serif;color:#17181a;">
				<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
	
					<div style="background:#8B1E2D;padding:28px 32px;text-align:center;">
						<h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
							Gym Membership
						</h1>
						<p style="margin:6px 0 0;color:#F9DFE3;font-size:13px;">
							Account Activation
						</p>
					</div>
	
					<div style="padding:36px 32px;">
						<p style="margin:0 0 8px;color:#4B5563;font-size:15px;">
							Hello <strong style="color:#17181A;">${result.fullname}</strong>,
						</p>
	
						<h2 style="margin:0 0 16px;color:#17181A;font-size:25px;">
							Welcome to the gym!
						</h2>
	
						<p style="margin:0 0 24px;color:#4B5563;font-size:15px;line-height:1.7;">
							Your membership account has been created successfully. Use the activation code below to activate your account and get started.
						</p>
	
						<div style="margin-bottom:24px;padding:24px;background:#FAF6F7;border:1px solid #E8C7CC;border-radius:12px;text-align:center;">
							<p style="margin:0 0 10px;color:#6B7280;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
								Activation Code
							</p>
	
							<div style="color:#8B1E2D;font-size:32px;font-weight:700;letter-spacing:7px;">
								${activationCode}
							</div>
						</div>
	
						<div style="margin-bottom:24px;padding:14px 16px;background:#F5F6F8;border-radius:10px;">
							<p style="margin:0;color:#6B7280;font-size:13px;line-height:1.6;">
								<strong style="color:#4B5563;">Important:</strong>
								This activation code will expire in <strong style="color:#17181A;">24 hours</strong>.
							</p>
						</div>
	
						<p style="margin:0;color:#4B5563;font-size:14px;line-height:1.6;">
							If you did not expect to receive this email, you can safely ignore it.
						</p>
	
						<p style="margin:28px 0 0;color:#4B5563;font-size:14px;line-height:1.6;">
							Stay strong,<br>
							<strong style="color:#8B1E2D;">The Gym Team</strong>
						</p>
					</div>
	
					<div style="padding:20px 32px;background:#FAFAFA;border-top:1px solid #E5E7EB;text-align:center;">
						<p style="margin:0;color:#9CA3AF;font-size:12px;">
							This is an automated message. Please do not reply to this email.
						</p>
					</div>
	
				</div>
			</div>
		`,
	});

	return {
		success: true,
		message: "Member created successfully. Activation code sent."
	};
};

export const upgradeMembershipPlanService = async (
	id: number,
	data: {
		plan_id: number;
		membership_id: number;
		payment_method: "Cash" | "GCash";
		amount: number;
	}
) => {

	const result = await prisma.$transaction(async (tx) => {
		// Get member
		const member = await tx.members.findUnique({
			where: { id },
			select: {
				id: true,
				fullname: true,
			},
		});

		if (!member) {
			throw new Error("Member not found");
		}

		// Get current membership
		const membership = await tx.member_memberships.findFirst({
			where: {
				id: data.membership_id,
				member_id: id,
			},
			select: {
				id: true,
				plan_id: true,
				start_date: true,
				end_date: true,
			},
		});

		if (!membership) {
			throw new Error("Member membership not found");
		}

		// Get current plan
		const currentPlan = await tx.membership_plans.findUnique({
			where: {
				id: membership.plan_id,
			},
			select: {
				id: true,
				plan_name: true,
				price: true,
			},
		});

		if (!currentPlan) {
			throw new Error("Current membership plan not found");
		}

		// Get new plan
		const plan = await tx.membership_plans.findUnique({
			where: {
				id: data.plan_id,
			},
			select: {
				id: true,
				plan_name: true,
				duration_type: true,
				duration: true,
				price: true,
			},
		});

		if (!plan) {
			throw new Error("Membership plan not found");
		}

		// Prevent same plan
		if (membership.plan_id === data.plan_id) {
			throw new Error(
				"Member is already using this membership plan"
			);
		}

		const currentPrice = Number(currentPlan.price);
		const newPrice = Number(plan.price);

		// Only allow upgrades
		if (newPrice <= currentPrice) {
			throw new Error(
				"Selected membership plan must have a higher price"
			);
		}

		// Calculate additional amount
		const additionalAmount = newPrice - currentPrice;

		// Calculate new membership dates based on the upgraded plan
		const { endDate } = calculateDuration(plan.duration_type, plan.duration);

		// Cancel previous membership
		await tx.member_memberships.update({
			where: {
				id: membership.id,
			},
			data: {
				status: "Cancelled",
			},
		});

		// Create new upgraded membership
		const newMembership = await tx.member_memberships.create({
			data: {
				member_id: member.id,
				plan_id: plan.id,
				start_date: new Date(),
				end_date: endDate,
				status: "Active",
			},
		});

		// Create upgrade payment
		await tx.payments.create({
			data: {
			  membership_id: newMembership.id,
			  member_id: member.id,
			  amount: additionalAmount,
			  payment_method: data.payment_method,
			  payment_type: "Upgrade",
			  status: "Paid",
			  description: `Upgrade from ${currentPlan.plan_name} to ${plan.plan_name}`,
			},
		 });

		// Admin activity
		await tx.activities.create({
			data: {
				recipient_id: member.id,
				recipient_type: "ADMIN",
				category: "MEMBER",
				title: "Membership Upgraded",
				description: `Admin upgraded ${member.fullname}'s membership from ${currentPlan.plan_name} to ${plan.plan_name}. Additional payment: ₱${additionalAmount.toFixed(2)}.`,
			},
		});

		// Member activity
		await tx.activities.create({
			data: {
				recipient_id: member.id,
				recipient_type: "MEMBER",
				category: "MEMBER",
				title: "Membership Upgraded",
				description: `You upgrade your membership from ${currentPlan.plan_name} to ${plan.plan_name}. Additional payment: ₱${additionalAmount.toFixed(2)}.`,
			},
		});

		// Create member notification for membership upgrade
		await tx.notifications.create({
			data: {
				recipient_id: member.id,
				recipient_type: "MEMBER",
				category: "MEMBERSHIP",
				type: "MEMBERSHIP_UPGRADE",
				title: "Membership Upgraded",
				description: `Your membership has been upgraded from ${currentPlan.plan_name} to ${plan.plan_name}. An additional payment of ₱${additionalAmount.toLocaleString(
					"en-PH",
					{
						minimumFractionDigits: 2,
					}
				)} has been successfully recorded.`,
			},
		});

		return {
			success: true,
			message: "Membership upgraded successfully",
			membership: {
				id: membership.id,
				previous_plan_id: currentPlan.id,
				previous_plan_name: currentPlan.plan_name,
				plan_id: plan.id,
				plan_name: plan.plan_name,
				current_price: currentPrice,
				new_price: newPrice,
				additional_amount: additionalAmount,
				start_date: membership.start_date,
				end_date: membership.end_date,
			},
		};
	});
	
	getIO()
	.to(`member-${id}`)
	.emit("membership:upgrade", { memberId: id });

	return result;
};

export const resendActivationCodeService = async (email: string) => {
	const member = await prisma.members.findUnique({
		where: { email },
	});

	if (!member) {
		throw new Error("Member not found");
	}
  
	const code = generateOTP();
	const today = new Date();
	today.setHours(23, 59, 59, 999);

	await prisma.$transaction(async (tx) => {
		const activation = await tx.member_activations.findFirst({
			where: { member_id: member.id },
			select: { id: true },
		});
		
		if (!activation) {
			throw new Error("Activation record not found");
		}
		
		await tx.member_activations.update({
			where: {
				id: activation.id,
			},
			data: {
				activation_code: code,
				expires_at: today
			},
		});

		return true;
	});
	
	// Send email 
	await sendMail({
		to: email,
		subject: "Your Activation Code",
		html: `
			<h2>Activation Code</h2>
			<p>Your new activation code is:</p>
			<h1>${code}</h1>
			<p>This code will expire in 5 minutes.</p>
		`,
	});

	return {
		success: true,
		message: "Activation code sent successfully"
	};
};

export const renewMembershipServiceService = async (data: {
	member_id: number;
	plan_id: number;
	payment_method: "GCash" | "Cash" | "Bank_Transfer";
}) => {

	const result = await prisma.$transaction(async (tx) => {
		// Get plan
		const plan = await tx.membership_plans.findUnique({
			where:{
				id:data.plan_id
			}
		});

		if(!plan){
			throw new Error("Membership plan not found");
		}

		// Calculate dates
		const startDate = new Date();
		const endDate = new Date(startDate);

		switch(plan.duration_type){
			case "Day":
				endDate.setDate(
					endDate.getDate() + plan.duration
				);
				break;

			case "Week":
				endDate.setDate(
					endDate.getDate() + (plan.duration * 7)
				);
				break;

			case "Month":
				endDate.setMonth(
					endDate.getMonth() + plan.duration
				);
				break;
		}

		// Expire previous membership
		await tx.member_memberships.updateMany({
			where:{
				member_id:data.member_id,
				status:"Active"
			},
			data:{
				status:"Expired"
			}
		});

		// Create new membership
		const membership = await tx.member_memberships.create({
			data:{
				member_id:data.member_id,
				plan_id:plan.id,
				start_date:startDate,
				end_date:endDate,
				status:"Active"
			}
		});

		// Create renewal payment
		const payment = await tx.payments.create({
			data: {
				member_id: data.member_id,
				membership_id: membership.id,
				amount: Number(plan.price),
				payment_method: data.payment_method,
				payment_type: "Renewal",
				status: "Paid",
				description: `Renewal payment for ${plan.plan_name} membership`,
				paid_at: new Date(),
			},
		});

		// Get member info for messages
		const member = await tx.members.findUnique({
			where:{
				id:data.member_id
			},
			select:{
				fullname:true
			}
		});

		// Member Recent activity
		await tx.activities.create({
			data:{
				recipient_id: data.member_id,
				recipient_type: 'ADMIN',
				category:"MEMBER",
				title:"Membership Renewed",
				description:
					`Your ${plan.plan_name} membership has been renewed until ${endDate.toLocaleDateString(
						"en-PH",
						{
							month:"short",
							day:"2-digit",
							year:"numeric"
						}
					)}.`
			}
		});

		// ADMIN ACTIVITY
		await tx.activities.create({
			data:{
				recipient_id:data.member_id,
				recipient_type:"ADMIN",
				category:"MEMBER",
				title:"Membership Renewed",
				description:
					`${member?.fullname} renewed their ${plan.plan_name} membership for ₱${plan.price}.`
			}
		});
	
		return {
			membership,
			payment
		};
	});
	
	// Socket events
	getIO()
	.to(`member-${data.member_id}`)
	.emit(
		"membership:renew",
		{
			membershipId: result.membership.id
		}
	);

	return result;
};