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
		throw new Error("Invalid username or password");
	}

	const isMatch = await bcrypt.compare(
		password,
		user.hash_pass
	);

	if (!isMatch) {
		throw new Error("Invalid username or password");
	}

	let memberId: number | null = null;
	let email: string | null = null;

	// MEMBER-specific validation
	if (user.role === "MEMBER") {
		const member = user.members;

		if (!member) {
			throw new Error("Member profile not found");
		}

		if (!member.is_activated) {
			throw new Error("Account not activated");
		}

		memberId = member.id;
		email = member.email;
	}

	const token = jwt.sign(
		{
			id: user.id,
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
		message: "Login successful",
		token,

		user: {
			id: user.id,
			memberId,
			username: user.username,
			email,
			profile: user.profile,
			pass_last_changed: user.updatedAt,
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

	if (!activation) {
		throw new Error("Invalid or expired activation code");
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
		memberId: activation.member_id,
		username: activation.members.fullname,
	};
};

export const completeRegistration = async (member_id: number, username: string, password: string) => {
	const member = await prisma.members.findUnique({
		where: {
			id: member_id,
		},
	});

	if (!member) {
		throw new Error("Member not found");
	}

	if (member.is_activated) {
		throw new Error("Account already activated");
	}

	const existingUsername = await prisma.users.findUnique({
		where: {
			username,
		},
	});

	if (existingUsername) {
		throw new Error("Username is already taken");
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

		return user;
	});

	const token = jwt.sign(
		{
			id: result.id,
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
			id: result.id,
			memberId: member.id,
			username: result.username,
			email: member.email,
			profile: result.profile,
			pass_last_changed: result.updatedAt,
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
		throw new Error("Email not found");
	}

	if (!member.user_id) {
		throw new Error("Member account is not activated");
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
		throw new Error("Account not found");
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
		throw new Error("Invalid or expired OTP");
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
		throw new Error("User account not found");
	}

	const hashedPassword = await bcrypt.hash(
		newPassword,
		10
	);

	const result = await prisma.$transaction(async (tx) => {
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
		message: "Password reset successful",
		data: {
			updated_at: result.updatedAt,
		},
	};
};