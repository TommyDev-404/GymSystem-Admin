import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler";
import { startSessionScheduler } from "./modules/admin/session/session.scheduler";

import adminAuthRoutes from "./modules/admin/auth/auth.routes";
import dashboardRoutes from "./modules/admin/dashboard/dashboard.routes";
import memberRoutes from "./modules/admin/members/members.route";
import sessionRoutes from "./modules/admin/session/session.routes";
import attendanceRoutes from "./modules/admin/attendance/attendance.routes";
import paymentRoutes from "./modules/admin/payments/payments.routes";
import plansRoutes from "./modules/admin/membership_plans/plan.routes";
import tutorialRoutes from "./modules/admin/tutorials/tutorials.routes";
import rewardsRoutes from "./modules/admin/rewards/rewards.routes";
import profileRoutes from "./modules/admin/profile/profile.routes";
import notifRoutes from "./modules/admin/notifications/notif.routes";

import checkinRoutes from "./modules/users/checkin/checkin.routes";
import authRoutes from "./modules/users/auth/auth.routes";
import workoutRoutes from "./modules/users/workout/workout.routes";
import homeRoutes from "./modules/users/home/home.routes";
import notif2Routes from "./modules/users/notifications/notif.routes";

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

// ==================== Session Scheduler ================
startSessionScheduler();

// ==================== Admin Routes ===================
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/dashboard", dashboardRoutes);
app.use("/admin/members", memberRoutes);
app.use("/admin/session", sessionRoutes);
app.use("/admin/attendance", attendanceRoutes);
app.use("/admin/payments", paymentRoutes);
app.use("/admin/plans", plansRoutes);
app.use("/admin/tutorial", tutorialRoutes);
app.use("/admin/reward", rewardsRoutes);
app.use("/admin/profile", profileRoutes);
app.use("/admin/notifications", notifRoutes);

// ==================== Users Routes ===================
app.use("/auth", authRoutes);
app.use("/check-in", checkinRoutes);
app.use("/workout", workoutRoutes);
app.use("/home", homeRoutes);
app.use("/notifications", notif2Routes);

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