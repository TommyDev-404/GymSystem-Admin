import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { sendMail } from "../../../utils/mailer";
import jwt from "jsonwebtoken";

export const loginUser = async (
	email: string,
	password: string
 ) => {
	const user = await prisma.users.findUnique({
	  where: { email },
	});
 
	if (!user) {
	  throw new Error("Invalid email or password");
	}
 
	const isMatch = await bcrypt.compare(
	  password,
	  user.hash_pass
	);
 
	if (!isMatch) {
	  throw new Error("Invalid email or password");
	}
 
	let memberId: number | null = null;
 
	// Check activation for members
	if (user.role === "MEMBER") {
	  const member = await prisma.members.findUnique({
		 where: {
			email: user.email,
		 },
		 select: {
			id: true,
			is_activated: true,
		 },
	  });
 
 
	  if (!member) {
		 throw new Error("Member profile not found");
	  }
 
 
	  if (!member.is_activated) {
		 throw new Error("Account not activated");
	  }
 
 
	  memberId = member.id;
	}
 
 
	const token = jwt.sign(
	  {
		 id: user.id,
		 email: user.email,
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
		 email: user.email,
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

export const completeRegistration = async (
  member_id: number,
  password: string
) => {
  const member = await prisma.members.findUnique({
    where: {
      id: member_id,
    },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      username: member.fullname,
      email: member.email,
		password: password,
      contact: "",
      hash_pass: hashedPassword,
      role: "MEMBER",
    },
  });

  await prisma.members.update({
    where: {
      id: member_id,
    },
    data: {
      user_id: user.id,
      is_activated: true,
      status: "Active",
    },
  });

  await prisma.member_activations.updateMany({
    where: {
      member_id,
    },
    data: {
      is_used: true,
    },
  });


  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
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
		 id: user.id,
		 memberId: member.id,
      username: user.username,
      email: user.email,
    },
  };
};

export const sendForgotPasswordOtp = async (email: string) => {
	const member = await prisma.users.findUnique({
		where: { email },
	});

	if (!member) {
		throw new Error("Email not found");
	}

	const code = Math.floor(100000 + Math.random() * 900000).toString();

	// Create OTP inside transaction
	await prisma.$transaction(async (tx) => {
		await tx.otp_codes.create({
			data: {
				user_id: member.id,
				code,
				purpose: "RESET_PASSWORD",
				expiresAt: new Date(Date.now() + 10 * 60 * 1000),
				used: false,
			},
		});
	});

	// Send email after transaction succeeds
	await sendMail({
		to: email,
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
	const user = await prisma.users.findUnique({
		where: { email },
	});

	if (!user) return null;

	// validate otp
	const otp = await prisma.otp_codes.findFirst({
		where: {
			user_id: user.id,
			code,
			used: false,
			expiresAt: {
				gt: new Date(),
			},
		},
	});

	if (!otp || otp.used === true) {
		throw new Error("Invalid or expired OTP");
	}
		
	// mark otp as used
	await prisma.otp_codes.update({
		where: { id: otp.id },
		data: { used: true },
	});
 
	return {
		success: true,
		message: "OTP verified",
	};
};

export const resetPassword = async (email: string, newPassword: string) => {
	const user = await prisma.users.findUnique({
		where: { email },
	});

	if (!user) {
		throw new Error("User not found");
	}

	const hashed = await bcrypt.hash(newPassword, 10);

	await prisma.users.update({
		where: { email },
		data: {
			password: newPassword,
			hash_pass: hashed,
		},
	});

	// mark OTP as used
	await prisma.otp_codes.updateMany({
		where: {
			user_id: user.id,
			used: false,
		},
		data: {
			used: true,
		},
	});

	return {
		success: true,
		message: "Password reset successful",
	};
};