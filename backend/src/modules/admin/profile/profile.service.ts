import { prisma } from "../../../lib/prisma";
import { UpdateAdminProfileDTO } from "./profile.types";

export const getAdminProfileService = async (adminId: number) => {
  const adminProfile = await prisma.users.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      username: true,
      email: true,
      contact: true,
    },
  });

  if (!adminProfile) {
    throw new Error("Admin profile not found");
  }

  return adminProfile;
};

export const updateAdminProfileService = async (adminId: number, data: Partial<UpdateAdminProfileDTO>) => {
  const updatedAdmin = await prisma.users.update({
    where: { id: adminId },
    data,
  });
   
  if (!updatedAdmin) {
    throw new Error("Admin profile not found");
  }
   
  return {
    id: updatedAdmin.id,
    username: updatedAdmin.username,
    email: updatedAdmin.email
   };
}

export const updateAdminPasswordService = async (adminId: number, newPassword: string) => {
  const updatedAdmin = await prisma.users.update({
    where: { id: adminId },
    data: { password: newPassword },
  });

  if (!updatedAdmin) {
    throw new Error("Admin profile not found");
  }

  return updatedAdmin;
}