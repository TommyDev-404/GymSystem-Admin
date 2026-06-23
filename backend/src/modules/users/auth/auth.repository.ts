import { prisma } from "../../../lib/prisma";

export const findActivationByCode = async (code: string) => {
  return prisma.member_activations.findFirst({
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
};

export const markActivationUsed = async (memberId: number) => {
  return prisma.member_activations.updateMany({
    where: { member_id: memberId },
    data: { is_used: true },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.users.findUnique({
    where: { email },
  });
};

export const findMemberByEmail = async (email: string) => {
   return prisma.members.findUnique({
     where: { email },
   });
};
 
export const createOtp = async (
   userId: number,
   code: string,
   purpose: any
 ) => {
   return prisma.otp_codes.create({
     data: {
       user_id: userId,
       code,
       purpose,
       expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
       used: false,
     },
   });
};
 
export const verifyOtp = async (email: string, code: string) => {
   const user = await prisma.users.findUnique({
     where: { email },
   });
 
   if (!user) return null;
 
   return prisma.otp_codes.findFirst({
     where: {
       user_id: user.id,
       code,
       used: false,
       expiresAt: {
         gt: new Date(),
       },
     },
   });
};

export const markOtpUsed = (otpId: number) => {
  return prisma.otp_codes.update({
    where: { id: otpId },
    data: { used: true },
  });
};