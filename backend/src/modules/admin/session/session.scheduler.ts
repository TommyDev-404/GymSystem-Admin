import cron from "node-cron";
import { createDailySessionService } from "./session.service";

export const startSessionScheduler = async () => {
  try {
    // 🟢 RUN ON APP START (FOR TESTING)  
    // remove this in production
    const session = await createDailySessionService();

  } catch (error) {
    console.error("Startup session error:", error);
  }

  // 🕒 DAILY CRON JOB
  // create a daily session for qr code every 6:00 AM
  cron.schedule("0 6 * * *", async () => {
    try {
      const session = await createDailySessionService();

    } catch (error) {
      console.error("Session scheduler error:", error);
    }
  });
};