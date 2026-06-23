import bcrypt from "bcrypt";

import {
   findActivationByCode,
   markActivationUsed,
   verifyOtp,
   findUserByEmail,
   createOtp,
   markOtpUsed,
} from "./auth.repository";
import { prisma } from "../../../lib/prisma";
import { transporter } from "../../../utils/mailer";

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.hash_pass);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // optional: check if activated
  if (user.role === "MEMBER") {
    const member = await prisma.members.findUnique({
      where: { email: user.email },
    });

    if (member && !member.is_activated) {
      throw new Error("Account not activated");
    }
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  };
};

export const verifyActivationCode = async (code: string) => {
  const activation = await findActivationByCode(code);

  if (!activation) {
    throw new Error("Invalid or expired activation code");
  }

  return {
    memberId: activation.member_id,
    username: activation.members.fullname,
  };
};

export const completeRegistration = async (
  member_id: number,
  password: string
) => {
  // 1. Get member info for the creation of account
  const member = await prisma.members.findUnique({
    where: { id: member_id },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create USER account
  await prisma.users.create({
    data: {
      username: member.fullname,
      email: member.email,
      password: password,
      contact: "", // optional if you add later
      hash_pass: hashedPassword,
      role: "MEMBER",
    },
  });

  // 4. Update member as activated
  await prisma.members.update({
    where: { id: member_id },
    data: {
      is_activated: true,
      status: "Active",
    },
  });

  // 5. Mark activation as used
  await markActivationUsed(member_id);

  return {
    success: true,
    message: "Account created successfully",
  };
};

export const sendForgotPasswordOtp = async (email: string) => {
  const member = await findUserByEmail(email);

  if (!member) {
    throw new Error("Email not found");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await createOtp(member.id, code, "RESET_PASSWORD");

  await transporter.sendMail({
    from: `"Gym System" <no-reply@gym.com>`,
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

export const verifyForgotPasswordOtp = async (
   email: string,
   code: string
) => {
   const otp = await verifyOtp(email, code);
 
   if (!otp || otp.used === true) {
     throw new Error("Invalid or expired OTP");
   }
   
   await markOtpUsed(otp.id);
 
   return {
     success: true,
     message: "OTP verified",
   };
};

export const resetPassword = async (
  email: string,
  newPassword: string
) => {
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