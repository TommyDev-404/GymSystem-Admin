import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler";

import adminAuthRoutes from "./modules/admin/auth/auth.routes";
import adminDashboardRoutes from "./modules/admin/dashboard/dashboard.routes";
import adminMemberRoutes from "./modules/admin/members/members.route";
import adminSessionRoutes from "./modules/admin/session/session.routes";
import adminAttendanceRoutes from "./modules/admin/attendance/attendance.routes";
import adminPaymentRoutes from "./modules/admin/payments/payments.routes";
import adminPlansRoutes from "./modules/admin/membership_plans/plan.routes";
import adminTutorialRoutes from "./modules/admin/tutorials/tutorials.routes";
import adminRewardsRoutes from "./modules/admin/rewards/rewards.routes";
import adminProfileRoutes from "./modules/admin/profile/profile.routes";
import adminNotificationRoutes from "./modules/admin/notifications/notif.routes";

import checkInRoutes from "./modules/users/checkin/checkin.routes";
import authRoutes from "./modules/users/auth/auth.routes";
import workoutRoutes from "./modules/users/workout/workout.routes";
import homeRoutes from "./modules/users/home/home.routes";
import communityRoutes from "./modules/users/community/community.routes";
import notificationRoutes from "./modules/users/notifications/notif.routes";
import userProfileRoutes from "./modules/users/profile/profile.routes";
import userPaymentRoutes from "./modules/users/payment-history/payment.routes";
import userRewardRoutes from "./modules/users/reward/reward.routes";
import userReferralRoutes from "./modules/users/referral-program/referral.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// ==================== Middleware ====================
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
      ];

      // allow mobile apps (no origin header)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

// ==================== Admin Routes ===================
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/dashboard", adminDashboardRoutes);
app.use("/admin/members", adminMemberRoutes);
app.use("/admin/session", adminSessionRoutes);
app.use("/admin/attendance", adminAttendanceRoutes);
app.use("/admin/payments", adminPaymentRoutes);
app.use("/admin/plans", adminPlansRoutes);
app.use("/admin/tutorial", adminTutorialRoutes);
app.use("/admin/reward", adminRewardsRoutes);
app.use("/admin/profile", adminProfileRoutes);
app.use("/admin/notifications", adminNotificationRoutes);

// ==================== Users Routes ===================
app.use("/auth", authRoutes);
app.use("/check-in", checkInRoutes);
app.use("/payments", userPaymentRoutes);
app.use("/workout", workoutRoutes);
app.use("/home", homeRoutes);
app.use("/community", communityRoutes);
app.use("/notifications", notificationRoutes);
app.use("/profile", userProfileRoutes);
app.use("/reward", userRewardRoutes);
app.use("/referral", userReferralRoutes);

// ==================== Health Check ====================
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Gym API is running",
  });
});

// ==================== 404 ====================
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ==================== Error Handler ====================
app.use(errorHandler);

export default app;