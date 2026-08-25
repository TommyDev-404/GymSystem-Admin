import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./layout/RootLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Login } from "@/features/auth/page/LoginPage";
import { ForgotPassword } from "@/features/auth/page/ForgotPasswordPage";
import { DashboardPage } from "@/features/dashboard/page/DashboardPage";
import { MembersPage } from "@/features/members/page/MemberPage";
import { AttendancePage } from "@/features/attendance/page/AttendancePage";
import { PaymentsPage } from "@/features/payments/page/PaymentsPage";
import { RewardsPage } from "@/features/rewards/page/RewardsPage";
import { NotificationsPage } from "@/features/notifications/page/NotificationsPage";
import { SettingsPage } from "@/features/settings/page/SettingsPage";
import { ChangePassword } from "@/features/auth/page/ChangePasswordPage";
import { TutorialsPage } from "./features/tutorial/screen/TutorialPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}