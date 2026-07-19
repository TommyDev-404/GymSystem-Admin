import { comparePassword, hashPassword } from "../../../utils/password";
import { signToken } from "../../../utils/jwt";
import { generateOTP } from "../../../utils/otp-generator";
import { transporter } from "../../../utils/mailer";
import { prisma } from "../../../lib/prisma";

export const login = async (username: string, password: string) => {
	const user = await prisma.users.findFirst({
		where: {
		  username,
		  role: "ADMIN",
		},
		select: {
		  id: true,
		  username: true,
		  email: true,
		  contact: true,
		  role: true,
		  hash_pass: true,
		},
	});

	if (!user) throw new Error("User not found");

	if (user.role !== "ADMIN") {
		throw new Error("Not authorized");
	}

	const isValid = await comparePassword(password, user.hash_pass);

	if (!isValid) {
		throw new Error("Invalid password");
	}

	const token = signToken({
		id: user.id,
		role: user.role,
	});

	return {
		token,
		user: {
			id: user.id,
			username: user.username,
			email: user.email,
			contact: user.contact,
		}
	};
};

export const sendResetOTP = async (email: string) => {
	const user = await prisma.users.findUnique({
		where: { email },
	});

	if (!user) throw new Error("User not found");

	const code = generateOTP();

	// create otp
	await prisma.otp_codes.create({
		data: {
			user_id: user.id,
			code,
			purpose: "RESET_PASSWORD",
			expiresAt: new Date(Date.now() + 5 * 60 * 1000),
		},
	});

	// send email
	await transporter.sendMail({
		to: email,
		subject: "Password Reset OTP",
		text: `Your OTP is ${code}. It expires in 5 minutes.`,
	});

	return true;
};

export const verifyOTP = async (email: string, code: string) => {
	const user = await prisma.users.findUnique({
		where: { email },
	});

	if (!user) throw new Error("User not found");

	const otp = await prisma.otp_codes.findFirst({
		where: {
		  user_id: user.id,
		  code,
		  purpose: "RESET_PASSWORD",
		  expiresAt: {
			 gt: new Date(),
		  },
		},
	 });

	if (!otp) throw new Error("Invalid or expired OTP");

	await prisma.otp_codes.update({
		where: { id: otp.id},
		data: { used: true },
	});

	return true;
};

export const resetPassword = async (email: string, newPassword: string) => {
	const user = await prisma.users.findUnique({
		where: { email },
	});

	if (!user) throw new Error("User not found");

	const hashed = await hashPassword(newPassword);

	// update the password
	await prisma.users.update({
		where: { id: user.id },
		data: {
			password: newPassword,
			hash_pass: hashed
		},
	 });

	return true;
};