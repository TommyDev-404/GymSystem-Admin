import { prisma } from "../../../lib/prisma";
export const getAdminProfileService = async (adminId) => {
    const adminProfile = await prisma.users.findUnique({
        where: { id: adminId },
        select: {
            id: true,
            username: true,
            email: true
        },
    });
    if (!adminProfile) {
        throw new Error("Admin profile not found");
    }
    return adminProfile;
};
export const updateAdminProfileService = async (adminId, data) => {
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
};
export const updateAdminPasswordService = async (adminId, newPassword) => {
    const updatedAdmin = await prisma.users.update({
        where: { id: adminId },
        data: { password: newPassword },
    });
    if (!updatedAdmin) {
        throw new Error("Admin profile not found");
    }
    return updatedAdmin;
};
