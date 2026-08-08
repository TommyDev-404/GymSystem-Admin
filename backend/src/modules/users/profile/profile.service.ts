import { prisma } from "../../../lib/prisma";
import { uploadImageToSupabase } from "../../admin/tutorials/tutorials.service";

export const updateProfileInfoService = async (
   userId: number,
   data: {
		username?: string;
		email?: string;
	}
) => {

	const user = await prisma.users.findUnique({
		where: {
			id: userId,
		},
		include: {
			members: true,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	const result = await prisma.$transaction(async (tx) => {

		// Update username in users table
		const updatedUser = await tx.users.update({
			where: {
				id: userId,
			},
			data
		});


		// Update email in members table
		if (data.email && user.members) {
			await tx.members.update({
				where: {
					id: user.members.id,
				},
				data: {
					email: data.email,
				},
			});
		}

		return updatedUser;
	});

	return {
		success: true,
		message: "Profile updated successfully",
		user: {
			id: result.id,
			username: result.username,
			email: data.email ?? user.members?.email,
		},
	};
};

export const updateProfileImageService = async (
	userId: number,
	file: Express.Multer.File
 ) => {
	if (!file) {
	  throw new Error("Profile image is required");
	}
 
	// Upload image to Supabase
	const imageUrl = await uploadImageToSupabase(file);
 
	// Save URL to users table
	const updatedUser = await prisma.users.update({
	  where: {
		 id: userId,
	  },
	  data: {
		 profile: imageUrl,
	  }
	});
 
 
	return {
	  success: true,
	  message: "Profile image updated successfully",
	  image: imageUrl
	};
};
 
