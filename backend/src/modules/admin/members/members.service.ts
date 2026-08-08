import { prisma } from "../../../lib/prisma";
import { sendMail } from "../../../utils/mailer";
import { generateOTP } from "../../../utils/otp-generator";
import { generateReferralCode } from "../../../utils/referralGenerator";
import { CreateMemberDTO, MemberFilters } from "./members.types";


export const createMember = async (data: CreateMemberDTO) => {
	const referralCode = generateReferralCode(data.fullname);
	const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

	const result = await prisma.$transaction(async (tx) => {
		// Find plan
		const plan = await tx.membership_plans.findUnique({
			where:{
				id:data.plan_id
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
				where:{
					referral_code: data.referral_code
				}
			});

			if(!referrer){
				throw new Error(
					"Invalid referral code"
				);
			}
		}

		// Create member
		const member = await tx.members.create({
			data:{
				fullname:data.fullname,
				email:data.email,
				age:data.age,
				gender:data.gender,
				plan_id:data.plan_id,
				points:0,
				referral_code: referralCode
			}
		});

		// Create referral record
		if(referrer){
			await tx.referrals.create({
				data:{
					referrer_id:referrer.id,
					referee_id:member.id,
					referrer_points: 100,
					referee_points: 50
				}
			});

			// Add 100 points to referrer
			await tx.members.update({
				where:{
					id:referrer.id
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
					id:member.id
				},
				data:{
					points:{
						increment:50
					}
				}
			});
		}

		// Activation
		await tx.member_activations.create({
			data:{
				member_id:member.id,
				activation_code:activationCode,
				expires_at:new Date(
					Date.now() + 24 * 60 * 60 * 1000
				),
				is_used:false
			}
		});

		// Membership dates
		const startDate = new Date();
		const endDate = new Date();

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

		const membership = await tx.member_memberships.create({
				data:{
					member_id:member.id,
					plan_id:plan.id,
					start_date:startDate,
					end_date:endDate
				}
			});

		await tx.payments.create({
			data:{
				member_id:member.id,
				membership_id:membership.id,
				amount:Number(plan.price),
				status:"Pending"
			}
		});

		return {
			...member,
			plan:plan.plan_name
		};

	});

	// Activity
	await prisma.activities.create({
		data:{
			recipient_id:Number(result.id),
			recipient_type:"ADMIN",
			type:"MEMBER",
			title:"New Member Added",
			description:
				`Admin added ${result.fullname} as a new member with ${result.plan} membership plan.`
		}
	});

	// Email
	await sendMail({
		to:data.email,
		subject:"Your Gym Activation Code",
		html:`
			<div style="font-family:Arial,sans-serif;">
				<h2>Hello ${data.fullname},</h2>

				<p>Welcome to the gym system!</p>

				<p>Your activation code is:</p>

				<h1 style="letter-spacing:4px;color:#16a34a;">
					${activationCode}
				</h1>

				<p>This code will expire in 24 hours.</p>
			</div>
		`
	});

	return {
		success:true,
		message:
			"Member created successfully. Activation code sent."
	};
};

export const updateMemberInfo = async (id: number, data: Partial<CreateMemberDTO>) => {
	const member = await prisma.members.findUnique({
		where: { id },
	});
		
	if (!member) throw new Error("Member not found");
		
	await prisma.$transaction(async (tx) => { 
		await tx.members.update({
			where: { id },
			data,
		});
	});

	// create recent activity
	await prisma.activities.create({
		data: {
			recipient_id: Number(member.id),
			recipient_type: 'ADMIN',
			type: 'MEMBER',
			title: 'Member Information Updated',
			description: `Admin updated ${member?.fullname}'s information.`
		}
	});
	
	return {
		success: true,
		message: "Member updated successfully",
	};
};

export const updateMemberStatus = async (id: number, data: {
	status: "Inactive" | "Active" | "Suspended";
 }) => {
	const member = await prisma.members.findUnique({
		where: { id },
	});
		
	if (!member) throw new Error("Member not found");
	
	await prisma.members.update({
		where: { id },
		data: {
			status: data.status,
		 },
	});

	return {
		success: true,
		message: "Status updated successfully",
	};
};

export const deleteMember = async (id: number) => {
	const member = await prisma.members.findUnique({
		where: { id },
	});

	if (!member) throw new Error("Member not found");

	await prisma.members.delete({
		where: { id },
	});
	  
	return {
		success: true,
		message: "Member removed successfully",
	};
};

export const getMembers = async (filters: MemberFilters) => {
	const { search, gender, status } = filters;

	return await prisma.members.findMany({
	  where: {
		 ...(status && { status }),
		 ...(gender && { gender }),
 
		 ...(search && {
			fullname: {
			  contains: search,
			},
		 }),
	  },
	  select: {
		 id: true,
		 fullname: true,
		 email: true,
		 age: true,
		 gender: true,
		 plan_id: true,
		 membership_plans: {
			select: { 
			  plan_name: true,
			  duration: true,
			  duration_type: true
			}
		 },
		 status: true,
		 join_date: true,
	  },
	  orderBy: {
		 join_date: "desc",
	  },
	});
};

export const getMemberById = async (id: number) => {
	const member = await prisma.members.findUnique({
	  where: { id },
	});
	 
	if (!member) throw new Error("Member not found");

	return member;
};

export const resendActivationCode = async (email: string) => {
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

export const renewMembershipService = async (data: {
	member_id: number;
	plan_id: number;
	payment_method: "GCash" | "Cash" | "Bank_Transfer";
}) => {

	return await prisma.$transaction(async (tx) => {
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

		// Create payment
		const payment = await tx.payments.create({
			data:{
				member_id:data.member_id,
				membership_id:membership.id,
				amount:Number(plan.price),
				payment_method:data.payment_method,
				status:"Paid",
				paid_at:new Date()
			}
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
				type:"MEMBER",
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
				type:"MEMBER",
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

};