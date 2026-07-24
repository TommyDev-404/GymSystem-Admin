import { prisma } from "../../../lib/prisma";
import { sendMail } from "../../../utils/mailer";
import { generateOTP } from "../../../utils/otp-generator";
import { CreateMemberDTO, MemberFilters } from "./members.types";

export const createMember = async (data: CreateMemberDTO) => {
	const activationCode = Math.floor(
		100000 + Math.random() * 900000
	).toString();

	const result = await prisma.$transaction(async (tx) => {
		const member = await tx.members.create({
			data: {
				fullname: data.fullname,
				email: data.email,
				age: data.age,
				gender: data.gender,
				plan_id: data.plan_id,
				points: 0
			},
		});
		
		// Create activation record
		await tx.member_activations.create({
			data: {
				member_id: member.id,
				activation_code: activationCode,
				expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
				is_used: false,
			},
		});

		// Create billing record
		const plan = await tx.membership_plans.findFirst({
			where: { id: data.plan_id }
		});

		const dueDate = new Date();

		switch (plan?.duration_type) {
			case "Day":
				dueDate.setDate(dueDate.getDate() + plan?.duration);
				break;

			case "Week":
				dueDate.setDate(dueDate.getDate() + (plan?.duration * 7));
				break;

			case "Month":
				dueDate.setMonth(dueDate.getMonth() + plan?.duration);
				break;
		}

		// added automatically the bills
		await tx.member_bills.create({
			data: {
				member_id: member.id,
				amount_due: Number(plan?.price), // or map from plan later
				due_date: dueDate, // or +30 days logic
				status: "Pending",
			},
		});

		// create recent activity
		await tx.activities.create({
			data: {
				member_id: Number(member.id),
				recepient_type: 'ADMIN',
				type: 'MEMBER_ADDED',
				title: 'New Member Added',
				description: `Admin added ${member?.fullname} as a new member and assigned the ${plan?.plan_name} membership plan.`
			}
		});

		return member;
	});

	// 4. Send email OUTSIDE transaction (important)
	
	await sendMail({
		to: data.email,
		subject: "Your Gym Activation Code",
		html: `
			<div style="font-family: Arial, sans-serif;">
				<h2>Hello ${data.fullname},</h2>

				<p>Welcome to the gym system!</p>

				<p>Your activation code is:</p>

				<h1 style="letter-spacing: 4px; color: #16a34a;">
				${activationCode}
				</h1>

				<p>This code will expire in 24 hours.</p>

				<hr />
				<small>If you did not request this, ignore this email.</small>
			</div>
		`,
	});
	
	return {
		success: true,
		message: "Member created successfully. Activation code sent.",
		data: {
			memberId: result.id,
			email: result.email,
		},
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
	
		// create recent activity
		await tx.activities.create({
			data: {
			  member_id: Number(member.id),
			  recepient_type: 'ADMIN',
			  type: 'MEMBER_UPDATED',
			  title: 'Member Information Updated',
			  description: `Admin updated ${member?.fullname}'s information.`
			}
		});
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

	return prisma.members.findMany({
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
			  plan_name: true
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

	return { message: "Activation code sent successfully" };
};