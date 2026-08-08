import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT (backend only)
);

/*
const deleteBucket = async () => {
  const { data, error } = await supabase
    .storage
    .deleteBucket("demo_workout_images");

  if (error) {
    throw error;
  }

  console.log("Bucket deleted:", data);
};

deleteBucket();
*/