import LoginPage from "./pages/forStudent/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/forStudent/Dashboard";
import Attendance from "./pages/forStudent/Attendance";
import Submissions from "./pages/forStudent/Submissions";
import Rewards from "./pages/forStudent/Rewards";
import Notifications from "./pages/forStudent/Notifications";
import { Toaster } from "react-hot-toast";

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Admin Pages
import AdminDashboardPage from "./pages/forAdmin/AdminDashboardPage";
import AdminAttendancePage from "./pages/forAdmin/AdminAttendancePage";
import AdminSubmissionsPage from "./pages/forAdmin/AdminSubmissionsPage";
import AdminRewardsPage from "./pages/forAdmin/AdminRewardsPage";
import AdminNotificationsPage from "./pages/forAdmin/AdminNotificationsPage";
import AdminActivityLogsPage from "./pages/forAdmin/AdminActivityLogsPage";

const App = () => {
  return (
    <>
      <Toaster position="top-right" containerStyle={{ zIndex: 99999 }} />
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<LoginPage />} />

          {/* Student Routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/attendance" element={<AdminAttendancePage />} />
            <Route path="/admin/submissions" element={<AdminSubmissionsPage />} />
            <Route path="/admin/rewards" element={<AdminRewardsPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/activity-logs" element={<AdminActivityLogsPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;