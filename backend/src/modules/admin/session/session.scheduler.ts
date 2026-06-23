import cron from "node-cron";
import { createDailySessionService } from "./session.service";

export const startSessionScheduler = async () => {
  try {
    // 🟢 RUN ON APP START (FOR TESTING)
    //console.log("Creating session on startup...");
    const session = await createDailySessionService();
    //console.log("Startup session ready:", session.id);
  } catch (error) {
    console.error("Startup session error:", error);
  }

  // 🕒 DAILY CRON JOB
  // create a daily session for qr code
  cron.schedule("0 6 * * *", async () => {
    try {
      console.log("Creating daily session...");

      const session = await createDailySessionService();

      console.log("Session ready:", session.id);
    } catch (error) {
      console.error("Session scheduler error:", error);
    }
  });

};