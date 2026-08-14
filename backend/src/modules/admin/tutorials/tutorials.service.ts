import { prisma } from "../../../lib/prisma";
import { getIO } from "../../../lib/socket";
import { supabase } from "../../../lib/supabase";
import { WorkoutFilters } from "./tutorials.types";

const normalizeArray = (value: any) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return Array(value);
  return [];
};

export const uploadImageToSupabase = async (file: Express.Multer.File) => {
  const fileName = `${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("gym_images")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("gym_images")
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const getAllTutorialsService = async (filters: WorkoutFilters) => {
  const { search, level, category } = filters;
  
  const trimmedCategory = category?.trim();

  return await prisma.tutorials.findMany({
    where: {
      ...(level && { level }),

      ...(search && {
        name: {
          contains: search,
        },
      }),

      ...(category && { category: trimmedCategory })
    },
    select: {
      id: true,
      name: true,
      category: true,
      level: true,
      instructions: true,
      video_url: true,
      equipment: true,
      muscles_targeted: true,
      demo_images: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  
};

export const createTutorialService = async (
  body: any,
  files: Express.Multer.File[]
) => {
  // 1. upload images
  const urls = await Promise.all(
    files.map((file) => uploadImageToSupabase(file))
  );
  
  // 2. save to DB
  const tutorial = await prisma.tutorials.create({
    data: {
      name: body.name,
      category: body.category,
      level: body.level,
      instructions: body.instructions,
      video_url: body.video_url,

      equipment: JSON.stringify(normalizeArray(body.equipment)),
      muscles_targeted: JSON.stringify(normalizeArray(body.muscles_targeted)),

      demo_images: JSON.stringify(urls),
    }
  });

  // Socket events
  getIO().to("members-room").emit("tutorial:new", {
    tutorialId: tutorial.id,
  });
  
  return {
    success: true,
    message: "Tutorial created successfully",
    data: tutorial,
  };
};

export const updateTutorialService = async (
  id: number,
  body: any,
  files: Express.Multer.File[]
) => {

  const updateData: Record<string, any> = {};

  // Basic fields
  const fields = [
    "name",
    "category",
    "level",
    "instructions",
    "video_url"
  ];

  fields.forEach((field) => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });

  // Array fields
  if (body.equipment !== undefined) {
    updateData.equipment = JSON.stringify(
      normalizeArray(body.equipment)
    );
  }

  if (body.muscles_targeted !== undefined) {
    updateData.muscles_targeted = JSON.stringify(
      normalizeArray(body.muscles_targeted)
    );
  }

  // Images
  if (files && files.length > 0) {

    const existingTutorial = await prisma.tutorials.findUnique({
      where: {
        id,
      },
      select: {
        demo_images: true,
      },
    });


    if (!existingTutorial) {
      throw new Error("Tutorial not found");
    }


    const oldImages = normalizeArray(
      existingTutorial.demo_images
    );

    const uploadedImages = await Promise.all(
      files.map((file) =>
        uploadImageToSupabase(file)
      )
    );

    updateData.demo_images = JSON.stringify([
      ...oldImages,
      ...uploadedImages,
    ]);
  }

  // Nothing to update
  if (Object.keys(updateData).length === 0) {
    return {
      success: false,
      message: "No changes detected",
    };
  }

  const tutorial = await prisma.tutorials.update({
    where: {
      id,
    },
    data: updateData,
  });

  // Socket events
  getIO()
  .to("members-room")
  .emit(
    "tutorial:update",
    {
      tutorialId: tutorial.id
    }
  );

  return {
    success: true,
    message: "Tutorial updated successfully",
    data: tutorial,
  };
};

export const removeTutorialService = async (id: number) => {
  const result = await prisma.tutorials.delete({
    where: { id }
  }) 

  if (!result) throw new Error("Failed to delete tutorial");
  
  getIO()
  .to("members-room")
  .emit(
    "tutorial:delete",
    {
      tutorialId: result.id
    }
  );
  return {
    success: true,
    message: "Tutorial removed successfully!",
    data: result
  }
};
