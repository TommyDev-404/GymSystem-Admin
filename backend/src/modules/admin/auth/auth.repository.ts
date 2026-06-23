import { prisma } from "../../../lib/prisma";

// ==================== USER QUERIES ====================

// Find admin username
export const findAdminByUsername = (username: string) => {
  return prisma.users.findFirst({
    where: {
      username,
      role: "ADMIN",
    },
  });
};

// Find user by email
export const findUserByEmail = (email: string) => {
  return prisma.users.findUnique({
    where: { email },
  });
};

// Find user by ID
export const findUserById = (id: number) => {
  return prisma.users.findUnique({
    where: { id },
  });
};

// Update password
export const updatePassword = (id: number, password: string, hash: string) => {
  console.log("New pass: ", password)
  return prisma.users.update({
    where: { id },
    data: { password, hash_pass: hash },
  });
};

// ==================== OTP QUERIES ====================

// Create OTP
export const createOtp = (data: {
  user_id: number;
  code: string;
  purpose: "LOGIN" | "RESET_PASSWORD" | "VERIFY_EMAIL";
  expiresAt: Date;
}) => {
  return prisma.otp_codes.create({
    data,
  });
};

// Find valid OTP
export const findValidOtp = (
  user_id: number,
  code: string,
  purpose: "LOGIN" | "RESET_PASSWORD" | "VERIFY_EMAIL"
) => {
  return prisma.otp_codes.findFirst({
    where: {
      user_id,
      code,
      purpose,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
};

// Mark OTP as used
export const markOtpUsed = (otpId: number) => {
  return prisma.otp_codes.update({
    where: { id: otpId },
    data: { used: true },
  });
};

// Delete expired OTPs (optional cleanup)
export const deleteExpiredOtps = () => {
  return prisma.otp_codes.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
};