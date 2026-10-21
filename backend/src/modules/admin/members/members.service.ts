import { prisma } from "../../../lib/prisma.js";
import { getIO } from "../../../lib/socket.js";
import { getEngagementStatus } from "../../../utils/engagementStatus.js";
import { sendMail } from "../../../utils/mailer.js";
import { generateOTP } from "../../../utils/otp-generator.js";
import { generateReferralCode } from "../../../utils/referralGenerator.js";
import { CreateMemberDTO, MemberFilters, PaymentHistoryFilters } from "./members.types.js";

function calculateDuration(duration_type: string, duration: number) {
	const startDate = new Date();
	const endDate = new Date(startDate);
 
	switch (duration_type) {
	  case "Day":
		 endDate.setDate(endDate.getDate() + duration);
		 break;
 
	  case "Week":
		 endDate.setDate(endDate.getDate() + duration * 7);
		 break;
 
	  case "Month":
		 endDate.setMonth(endDate.getMonth() + duration);
		 break;
 
	  default:
		 throw new Error(`Invalid duration type: ${duration_type}`);
	}

	return {
	  startDate,
	  endDate,
	};
 }

export const getMemberSummaryService = async () => {
	const now = new Date();

	const memberships = await prisma.member_memberships.findMany({
		where: {
			NOT: {
				status: "Cancelled"
			}
		},
		include: {
			members: {
			select: {
				attendance: {
					select: {
						morning_checkin_time: true,
						afternoon_checkin_time: true,
					},
				},
			},
			},
		},
		orderBy: [
			{ member_id: "asc" },
			{ created_at: "desc" },
		],
	});

	const latestMemberships = new Map<
		number,
		(typeof memberships)[number]
	>();

	for (const membership of memberships) {
		if (!latestMemberships.has(membership.member_id)) {
			latestMemberships.set(membership.member_id, membership);
		}
	}

	let active = 0;
	let expiringTomorrow = 0;
	let expired = 0;
	let inactiveMembers = 0;

	const startOfToday = new Date(now);
	startOfToday.setHours(0, 0, 0, 0);

	const startOfTomorrow = new Date(startOfToday);
	startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

	const startOfDayAfterTomorrow = new Date(startOfTomorrow);
	startOfDayAfterTomorrow.setDate(
		startOfDayAfterTomorrow.getDate() + 1,
	);

	const inactiveThreshold = new Date(now);
	inactiveThreshold.setDate(inactiveThreshold.getDate() - 15);

	for (const membership of latestMemberships.values()) {
		const isExpired =
			membership.status === "Expired" ||
			membership.end_date < now;

		const isActive =
			membership.status === "Active" &&
			membership.end_date >= now;

		if (isActive) {
			active++;

			if (
			membership.end_date >= startOfTomorrow &&
			membership.end_date < startOfDayAfterTomorrow
			) {
			expiringTomorrow++;
			}
		}

		if (isExpired) {
			expired++;
		}

		const checkInTimes = membership.members.attendance.flatMap(
			(attendance) => [
			attendance.morning_checkin_time,
			attendance.afternoon_checkin_time,
			],
		);

		const validCheckInTimes = checkInTimes.filter(
			(time): time is Date => time !== null,
		);

		if (validCheckInTimes.length === 0) {
			continue;
		}

		const latestAttendance = new Date(
			Math.max(
			...validCheckInTimes.map((time) => time.getTime()),
			),
		);

		if (latestAttendance <= inactiveThreshold) {
			inactiveMembers++;
		}
	}

	return {
		active,
		expiringTomorrow,
		expired,
		inactiveMembers,
	};
};

export const getMembersService = async (filters: MemberFilters) => {
	const { search, engagementStatus, membershipStatus } = filters;

	const members = await prisma.members.findMany({
	  where: {
		 ...(search?.trim() && {
			fullname: {
			  contains: search.trim(),
			},
			})
	  },
	  select: {
		 id: true,
		 fullname: true,
		 email: true,
		 age: true,
		 gender: true,
		 join_date: true,
		  member_memberships: {
			where: {
				status: {
				  not: "Cancelled",
				},
			 },
			select: {
			  id: true,
			  start_date: true,
			  end_date: true,
			  status: true,
			  created_at: true,
			  membership_plans: {
				 select: {
					id: true,
					plan_name: true,
					duration_type: true,
					duration: true,
					daily_hours_limit: true,
					price: true,
				 },
			  },
			},
			orderBy: {
			  created_at: "desc",
			},
			take: 1,
		 },
		 attendance: {
			select: {
			  morning_checkin_time: true,
			  afternoon_checkin_time: true,
			},
		 },
	  },
	  orderBy: {
		 join_date: "desc",
	  },
	});
	
	const mappedMembers = members.map((member) => {
	  const membership = member.member_memberships[0] ?? null;
 
	  const checkInTimes = member.attendance.flatMap((attendance) => [
		 attendance.morning_checkin_time,
		 attendance.afternoon_checkin_time,
	  ]);
 
	  const validCheckInTimes = checkInTimes.filter(
		 (time): time is Date => time !== null,
	  );
 
	  const lastAttendance =
		 validCheckInTimes.length > 0
			? new Date(
				 Math.max(
					...validCheckInTimes.map((time) => time.getTime()),
				 ),
			  )
			: null;
 
	  return {
		 id: member.id,
		 fullname: member.fullname,
		 email: member.email,
		 age: member.age,
		 gender: member.gender,
		 join_date: member.join_date,
 
		 membership_id: membership?.id ?? null,
		 plan_id: membership?.membership_plans.id ?? null,
		 plan_name: membership?.membership_plans.plan_name ?? null,
		 plan_price: membership?.membership_plans.price ?? null,
		 membership_start: membership?.start_date ?? null,
		 membership_end: membership?.end_date ?? null,
		 duration_type: membership?.membership_plans.duration_type ?? null,
		 duration: membership?.membership_plans.duration ?? null,
		 daily_hours_limit:
			membership?.membership_plans.daily_hours_limit ?? null,
 
		 status: membership?.status ?? null,
		 last_attendance: lastAttendance,
		 engagement_status: getEngagementStatus(lastAttendance),
	  };
	});

	return mappedMembers.filter((member) => {
	  const matchesEngagement =
		 !engagementStatus ||
		 engagementStatus === "All" ||
		 member.engagement_status === engagementStatus;
 
	  const matchesMembership =
		 !membershipStatus ||
		 membershipStatus === "All" ||
		 member.status === membershipStatus;
 
	  return matchesEngagement && matchesMembership;
	});
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
					referrer_points: 25,
					referee_points: 10
				}
			});

			// Add 25 points to referrer
			await tx.members.update({
				where:{
					id: referrer.id
				},
				data:{
					points:{
						increment:25
					}
				}
			});

			// Add 10 points to the new member who used referral code
			await tx.members.update({
				where:{
					id: member.id
				},
				data:{
					points:{
						increment: 10
					}
				}
			});

			await tx.notifications.create({
				data: {
				  recipient_id: referrer.id,
				  recipient_type: "MEMBER",
				  category: "REWARD",
				  type: "REFERRAL_POINTS",
				  title: "Referral Points Earned",
				  description:
					 "You earned 25 points for referring a new member to JFitness.",
				},
			 });
		  
			 // Create notification for referee
			 await tx.notifications.create({
				data: {
				  recipient_id: member.id,
				  recipient_type: "MEMBER",
				  category: "REWARD",
				  type: "REFERRAL_POINTS",
				  title: "Welcome Bonus Earned",
				  description:
					 "You earned 10 points for joining JFitness using a referral code.",
				},
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
				payment_method: "Cash",
				payment_type: "Membership",
				status: "Paid",
				description: `Initial payment for ${plan.plan_name} membership`,
			},
		});

		if (plan.duration_type === "Month") {
			// Add 100 membership points
			await tx.members.update({
				where: {
					id: member.id
				},
				data: {
					points: {
						increment: 50,
					},
				}
			});

			// Create member notification for membership points
			await tx.notifications.create({
				data: {
					recipient_id: member.id,
					recipient_type: "MEMBER",
					category: "REWARD",
					type: "MEMBERSHIP_POINTS",
					title: "Membership Points Earned",
					description: `You earned 50 points from your ${plan.plan_name} membership payment of ₱${Number(
						payment.amount
					).toLocaleString("en-PH", {
						minimumFractionDigits: 2,
					})}.`,
				},
			});
		}

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
			plan:plan.plan_name,
			referrerId: referrer?.id ?? null,
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
	
	if (result.referrerId) {
		console.log("Referral event triggered...");
		// Socket events
		getIO().to("members-room").emit("referral:notif");
	}

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
				duration: true,
				duration_type: true
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
			"Selected membership plan must have a higher price",
		);
		}

		// Calculate 30% discount based on the current plan price
		const discountRate = 0.30;
		const discountAmount = currentPrice * discountRate;

		// Subtract the discount from the selected new plan price
		const finalAmount = Math.round(
		(newPrice - discountAmount) * 100,
		) / 100;

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
			  amount: finalAmount,
			  discount: discountAmount,
			  payment_method: data.payment_method ?? "Cash",
			  payment_type: "Upgrade",
			  status: "Paid",
			  description: `Upgrade from ${currentPlan.plan_name} to ${plan.plan_name} (30% discount)`,
			},
		});
		
		// add 50 points if monthly is being renewed
		if (plan.duration_type === "Month") {
			// Add 100 membership points
			await tx.members.update({
				where: {
					id: member?.id
				},
				data: {
					points: {
						increment: 50,
					},
				}
			});

			// Create member notification for membership points
			await tx.notifications.create({
				data: {
					recipient_id: member?.id,
					recipient_type: "MEMBER",
					category: "REWARD",
					type: "MEMBERSHIP_POINTS",
					title: "Membership Points Earned",
					description: `Congratulations! You've earned 50 points for upgrading to the ${plan.plan_name} (${plan.duration}-${plan.duration_type}) plan.`,
				},
			});
		}

		// Create member notification for membership upgrade
		await tx.notifications.create({
			data: {
				recipient_id: member.id,
				recipient_type: "MEMBER",
				category: "MEMBERSHIP",
				type: "MEMBERSHIP_UPGRADE",
				title: "Membership Upgraded",
				description: `Your membership has been upgraded from ${currentPlan.plan_name} (${currentPlan.duration}-${currentPlan.duration_type}) to ${plan.plan_name} (${plan.duration}-${plan.duration_type}). Your additional payment of ₱${finalAmount.toLocaleString("en-PH", {
					minimumFractionDigits: 2,
				 })} has been recorded after a 30% discount.`,
			},
		});

		// Create admin notification for membership upgrade
		await tx.notifications.create({
			data: {
				recipient_type: "ADMIN",
				category: "MEMBERSHIP",
				type: "MEMBERSHIP_UPGRADE",
				title: "Member Membership Upgraded",
				description: `${member.fullname}'s membership has been upgraded from ${currentPlan.plan_name} to ${plan.plan_name}. An additional payment of ₱${finalAmount.toLocaleString("en-PH", {
					minimumFractionDigits: 2,
				 })} has been recorded after a 30% discount.`,
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
				start_date: membership.start_date,
				end_date: membership.end_date,
			},
		};
	});
	
	// Socket events
	getIO().to("members-room").emit("membership:upgrade", {
		memberId: id
	});

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
				payment_method: data.payment_method ?? "Cash",
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
			select: {
				id: true,
				fullname:true
			}
		});

		// add 50 points if monthly is being renewed
		if (plan.duration_type === "Month") {
			// Add 100 membership points
			await tx.members.update({
				where: {
					id: member?.id
				},
				data: {
					points: {
						increment: 50,
					},
				}
			});

			// Create member notification for membership points
			await tx.notifications.create({
				data: {
					recipient_id: member?.id,
					recipient_type: "MEMBER",
					category: "REWARD",
					type: "MEMBERSHIP_POINTS",
					title: "Membership Points Earned",
					description: `Thank you for renewing your membership plan! You've earned 50 points as a monthly renewal reward.`,
				},
			});
		}

		// Member notification for membership renewal
		await tx.notifications.create({
			data: {
				recipient_id: data.member_id,
				recipient_type: "MEMBER",
				category: "MEMBERSHIP",
				type: "MEMBERSHIP_RENEWAL",
				title: "Membership Renewed",
				description: `Your membership has been renewed successfully with a plan of ${plan.plan_name} (${plan.duration}-${plan.duration_type}) for ₱${Number(
					plan.price,
				).toLocaleString("en-PH", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}. Your membership is valid until ${endDate.toLocaleDateString(
					"en-PH",
					{
					month: "short",
					day: "2-digit",
					year: "numeric",
					},
				)}.`,
			},
		});

		// Admin notification for membership renewal
		await tx.notifications.create({
		data: {
			recipient_type: "ADMIN",
			category: "MEMBERSHIP",
			type: "MEMBERSHIP_RENEWAL",
			title: "Membership Renewed",
			description: `${member?.fullname} renewed their membership  with a plan of ${plan.plan_name} (${plan.duration}-${plan.duration_type}) for ₱${Number(
				plan.price,
			).toLocaleString("en-PH", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}. The membership is valid until ${endDate.toLocaleDateString("en-PH", {
				month: "short",
				day: "2-digit",
				year: "numeric",
			})}.`,
		},
		});
	
		return {
			membership,
			payment
		};
	});
	
	// Socket events
	getIO().to("members-room").emit("membership:renew", {
		memberId: data.member_id
	});

	return result;
};
 
export const getMemberPaymentHistory = async (
	member_id: number,
	filters?: PaymentHistoryFilters,
) => {
	const { month, year } = filters ?? {};

	const payments = await prisma.payments.findMany({
	where: {
		member_id,
		...(month && year
			? {
				paid_at: {
					gte: new Date(Date.UTC(year, month - 1, 1)),
					lt: new Date(Date.UTC(year, month, 1)),
				},
			}
			: year
			? {
					paid_at: {
					gte: new Date(Date.UTC(year, 0, 1)),
					lt: new Date(Date.UTC(year + 1, 0, 1)),
					},
				}
			: {}),
	},
	include: {
		member_memberships: {
			include: {
			membership_plans: {
				select: {
					plan_name: true,
					duration: true,
					duration_type: true,
						price: true
				},
			},
			},
		},
	},
		orderBy: {
			paid_at: "desc",
		},
	});

	return payments.map((payment) => ({
		id: payment.id,
		amount: Number(payment.amount),
		discount: Number(payment.discount),
			paymentMethod: payment.payment_method,
		startDate: payment.member_memberships.start_date,
		endDate: payment.member_memberships.end_date,
		type: payment.payment_type,
		status: payment.status,
			paidAt: payment.paid_at,
		duration: payment.member_memberships.membership_plans.duration,
		duration_type: payment.member_memberships.membership_plans.duration_type,
		plan:
			payment.member_memberships?.membership_plans?.plan_name ??
			"Unknown Plan",
		plan_price: payment.member_memberships.membership_plans.price ?? 0
	}));
};