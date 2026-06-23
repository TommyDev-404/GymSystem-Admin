import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler";
import { startSessionScheduler } from "./modules/admin/session/session.scheduler";

import adminAuthRoutes from "./modules/admin/auth/auth.routes";
import memberRoutes from "./modules/admin/members/members.route";
import sessionRoutes from "./modules/admin/session/session.routes";
import attendanceRoutes from "./modules/admin/attendance/attendance.routes";
import paymentRoutes from "./modules/admin/payments/payments.routes";
import plansRoutes from "./modules/admin/membership_plans/plan.routes";


import checkinRoutes from "./modules/users/checkin/checkin.routes";
import authRoutes from "./modules/users/auth/auth.routes";

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
app.use("/admin/members", memberRoutes);
app.use("/admin/session", sessionRoutes);
app.use("/admin/attendance", attendanceRoutes);
app.use("/admin/payments", paymentRoutes);
app.use("/admin/plans", plansRoutes);


// ==================== Users Routes ===================
app.use("/auth", authRoutes);
app.use("/check-in", checkinRoutes);


// ==================== 404 ====================
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ==================== Error Handler ====================
app.use(errorHandler);

export default app;