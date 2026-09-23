import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { sendMail } from "../../../utils/mailer";
import jwt from "jsonwebtoken";


export const loginUser = async (username: string, password: string) => {
	const user = await prisma.users.findUnique({
		where: { username },
		include: {
			members: true,
		},
	});

	if (!user) {
		return {
			success: false,
			message: "Invalid username or password"
		};
	}

	const isMatch = await bcrypt.compare(
		password,
		user.hash_pass
	);

	if (!isMatch) {
		return {
			success: false,
			message: "Invalid username or password"
		};
	}

	let memberId: number | null = null;
	let email: string | null = null;

	// MEMBER-specific validation
	if (user.role === "MEMBER") {
		const member = user.members;

		if (!member) {
			return {
				success: false,
				message: "Member profile not found"
			};
		}

		if (!member.is_activated) {
			return {
				success: false,
				message: "Account not activated"
			};
		}

		memberId = member.id;
		email = member.email;
	}

	const token = jwt.sign(
		{
			user_id: user.id,
			memberId,
			username: user.username,
			role: user.role,
		},
		process.env.JWT_SECRET!,
		{
			expiresIn: "7d",
		}
	);

	return {
		success: true,
		message: "Login successful",
		token,

		user: {
			user_id: user.id,
			member_id: memberId
		},
	};
};
 
export const verifyActivationCode = async (code: string) => {
	const activation = await prisma.member_activations.findFirst({
		where: {
			activation_code: code,
			is_used: false,
			expires_at: {
				gt: new Date(),
			},
		},
		include: {
			members: true,
		},
	});

	console.log("Activation: ", activation);
	
	if (!activation) {
		return {
			success: false,
			message: "Invalid or expired activation code"
		};
	}

	await prisma.member_activations.update({
		where: {
			id: activation.id,
		},
		data: {
			is_used: true,
		},
	});

	return {
		success: true,
		memberId: activation.member_id,
		username: activation.members.fullname,
	};
};

export const completeRegistration = async (member_id: number, username: string, password: string) => {
	const member = await prisma.members.findUnique({
		where: {
			id: member_id,
		},
		select: {
			id: true,
			user_id: true,
			is_activated: true,
			fullname: true,

			member_memberships: {
				select: {
					membership_plans: {
						select: {
							plan_name: true,
							price: true
						}
					}
				}
			}
		}
	});

	if (!member) {
		return {
			success: false,
			message: "Member not found"
		};
	}

	if (member.is_activated) {
		return {
			success: false,
			message: "Account already activated"
		};
	}

	const existingUsername = await prisma.users.findUnique({
		where: {
			username,
		},
	});

	if (existingUsername) {
		return {
			success: false,
			message: "Username already taken"
		};
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.users.create({
			data: {
				username,
				password,
				hash_pass: hashedPassword,
				role: "MEMBER",
			},
		});

		await tx.members.update({
			where: {
				id: member_id,
			},
			data: {
				user_id: user.id,
				is_activated: true,
			},
		});

		await tx.member_activations.updateMany({
			where: {
				member_id,
			},
			data: {
				is_used: true,
			},
		});

		// Create user notification
		await tx.notifications.create({
			data: {
				recipient_id: member_id,
				recipient_type: "MEMBER",
				category: "MEMBER",
				type: "MEMBER_ADDED",
				title: "Welcome to JFitness!",
				description: `Welcome, ${username}! You’ve been added as a JFitness member with the ${member.member_memberships[0].membership_plans.plan_name} membership for ₱${Number(member.member_memberships[0].membership_plans.price).toLocaleString("en-PH", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}. We’re excited to have you with us!`
			}
		});

		return user;
	});

	const token = jwt.sign(
		{
			user_id: result.id,
			memberId: member.id,
			username: result.username,
			role: result.role,
		},
		process.env.JWT_SECRET!,
		{
			expiresIn: "7d",
		}
	);

	return {
		success: true,
		message: "Account created successfully",
		token,
		user: {
			user_id: result.id,
			member_id: member_id
		},
	};
};

export const sendForgotPasswordOtp = async (email: string) => {
	const member = await prisma.members.findUnique({
		where: {
			email,
		},
		select: {
			id: true,
			email: true,
			user_id: true,
			is_activated: true,
		},
	});

	if (!member) {
		return {
			success: false,
			message: "Email not found"
		};
	}

	if (!member.user_id) {
		return {
			success: false,
			message: "Member account not activated"
		};
	}

	const code = Math.floor(100000 + Math.random() * 900000).toString();

	await prisma.otp_codes.create({
		data: {
			user_id: member.user_id,
			code,
			purpose: "RESET_PASSWORD",
			expiresAt: new Date(
				Date.now() + 10 * 60 * 1000
			),
			used: false,
		},
	});

	await sendMail({
		to: member.email,
		subject: "Password Reset Code",
		html: `
			<h2>Password Reset</h2>
			<p>Your OTP code is:</p>
			<h1 style="letter-spacing:4px">${code}</h1>
			<p>This code expires in 10 minutes.</p>
		`,
	});

	return {
		success: true,
		message: "OTP sent to email",
	};
};

export const verifyForgotPasswordOtp = async (email: string, code: string) => {
	const member = await prisma.members.findUnique({
		where: {
			email,
		},
		select: {
			user_id: true,
		},
	});

	if (!member?.user_id) {
		return {
			success: false,
			message: "Account not found"
		};
	}

	const otp = await prisma.otp_codes.findFirst({
		where: {
			user_id: member.user_id,
			code,
			purpose: "RESET_PASSWORD",
			used: false,
			expiresAt: {
				gt: new Date(),
			},
		},
	});

	if (!otp) {
		return {
			success: false,
			message: "Invalid or expired code"
		};
	}

	await prisma.otp_codes.update({
		where: {
			id: otp.id,
		},
		data: {
			used: true,
		},
	});

	return {
		success: true,
		message: "OTP verified",
	};
};

export const resetPassword = async (email: string, newPassword: string) => {
	const member = await prisma.members.findUnique({
		where: {
			email,
		},
		select: {
			user_id: true,
		},
	});

	if (!member?.user_id) {
		return {
			success: false,
			message: "Account not found"
		};
	}

	const hashedPassword = await bcrypt.hash(
		newPassword,
		10
	);

	await prisma.$transaction(async (tx) => {
		const user = await tx.users.update({
			where: {
				id: member.user_id!,
			},
			data: {
				hash_pass: hashedPassword,
			},
		});

		await tx.otp_codes.updateMany({
			where: {
				user_id: member.user_id!,
				purpose: "RESET_PASSWORD",
				used: false,
			},
			data: {
				used: true,
			},
		});

		return user;
	});

	return {
		success: true,
		message: "Password reset successful"
	};
};