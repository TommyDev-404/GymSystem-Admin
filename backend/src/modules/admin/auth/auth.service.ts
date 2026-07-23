import { comparePassword, hashPassword } from "../../../utils/password";
import { signToken } from "../../../utils/jwt";
import { generateOTP } from "../../../utils/otp-generator";
import { sendMail } from "../../../utils/mailer";
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
	await sendMail({
		to: email,
		subject: "Password Reset OTP",
		html: `
			<div style="
				font-family: Arial, Helvetica, sans-serif;
				background-color: #f8fafc;
				padding: 40px 20px;
			">
				<div style="
				max-width: 500px;
				margin: 0 auto;
				background-color: #ffffff;
				border-radius: 12px;
				padding: 32px;
				box-shadow: 0 4px 12px rgba(0,0,0,0.08);
				">
				<h2 style="
					color: #16a34a;
					margin-bottom: 16px;
					text-align: center;
				">
					Password Reset Request
				</h2>

				<p style="
					color: #334155;
					font-size: 15px;
					line-height: 1.6;
				">
					We received a request to reset your password.
					Use the verification code below to continue.
				</p>

				<div style="
					margin: 30px 0;
					text-align: center;
					background-color: #f0fdf4;
					border-radius: 10px;
					padding: 20px;
				">
					<span style="
						font-size: 32px;
						font-weight: 700;
						letter-spacing: 8px;
						color: #15803d;
					">
						${code}
					</span>
				</div>

				<p style="
					color: #64748b;
					font-size: 14px;
					line-height: 1.5;
				">
					This verification code will expire in 
					<strong>5 minutes</strong>.
					For your security, do not share this code with anyone.
				</p>

				<hr style="
					border: none;
					border-top: 1px solid #e2e8f0;
					margin: 24px 0;
				" />

				<p style="
					color: #94a3b8;
					font-size: 12px;
					text-align: center;
				">
					If you did not request a password reset, you can safely ignore this email.
				</p>

				<p style="
					color: #64748b;
					font-size: 13px;
					text-align: center;
					margin-top: 20px;
				">
					© JFitness Gym
				</p>
				</div>
			</div>
		`,
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