import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler.js";

import adminAuthRoutes from "./modules/admin/auth/auth.routes.js";
import adminDashboardRoutes from "./modules/admin/dashboard/dashboard.routes.js";
import adminMemberRoutes from "./modules/admin/members/members.route.js";
import adminSessionRoutes from "./modules/admin/session/session.routes.js";
import adminAttendanceRoutes from "./modules/admin/attendance/attendance.routes.js";
import adminPaymentRoutes from "./modules/admin/payments/payments.routes.js";
import adminPlansRoutes from "./modules/admin/membership_plans/plan.routes.js";
import adminTutorialRoutes from "./modules/admin/tutorials/tutorials.routes.js";
import adminRewardsRoutes from "./modules/admin/rewards/rewards.routes.js";
import adminProfileRoutes from "./modules/admin/profile/profile.routes.js";
import adminNotificationRoutes from "./modules/admin/notifications/notif.routes.js";

import checkInRoutes from "./modules/users/checkin/checkin.routes.js";
import authRoutes from "./modules/users/auth/auth.routes.js";
import workoutRoutes from "./modules/users/workout/workout.routes.js";
import homeRoutes from "./modules/users/home/home.routes.js";
import communityRoutes from "./modules/users/community/community.routes.js";
import notificationRoutes from "./modules/users/notifications/notif.routes.js";
import userProfileRoutes from "./modules/users/profile/profile.routes.js";
import userPaymentRoutes from "./modules/users/payment-history/payment.routes.js";
import userRewardRoutes from "./modules/users/reward/reward.routes.js";
import userReferralRoutes from "./modules/users/referral-program/referral.routes.js";
import chatbotRoutes from "./modules/users/ai/ai.route.js";

import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

const app = express();

// ==================== Middleware ====================
/*
const allowedOrigins = [
  "https://jfitness-gym.tech",
  "https://www.jfitness-gym.tech",
  //"http://localhost:5173",
  //"http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
*/
app.use(cookieParser());
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
app.use("/chat", chatbotRoutes);

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