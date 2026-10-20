import cron from "node-cron";
import { createDailySessionService } from "../modules/admin/session/session.service.js";

export const startSessionScheduler = async () => {
  const runSessionCheck = async () => {
    try {
      await createDailySessionService();
    } catch (error) {
      console.error("Session scheduler error:", error);
    }
  };

  // Run once when the application starts.
  await runSessionCheck();

  // Check every minute using Philippine time.
  cron.schedule(
    "* * * * *",
    async () => {
      await runSessionCheck();
    },
    {
      timezone: "Asia/Manila",
    },
  );

  console.log("Session scheduler started. Checking every minute.");
};