import StatCard from "../../components/common/StatCard";
import Leaderboard from "../../components/common/Leaderboard";
import ManageStudents from "../../components/admin/dashboard/ManageStudents";
import { UserCheck, UserX, Users, UserMinus } from "lucide-react";
import AddUserSidebar from "../../components/admin/dashboard/AddUserSidebar";
import { useState, useEffect } from "react";
import DefineRolesSidebar from "../../components/admin/dashboard/DefineRolesSidebar";
import FacultyCard from "../../components/student/dashboard/FacultyCard";
import WelcomeCard from "../../components/common/WelcomeCard";
import adminService from "../../api/services/admin";

export default function AdminDashboardPage() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    removedUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isTeacher = user?.role?.toLowerCase() === "teacher";

  return (
    <div className="max-w-400 mx-auto px-8 py-8 space-y-6">
      {/* Welcome Header */}
      <WelcomeCard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={loading ? "..." : stats.totalUsers}
          subtitle=""
          icon={<Users className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-100 "
        />
        <StatCard
          title="Active Users"
          value={loading ? "..." : stats.activeUsers}
          subtitle=""
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Blocked Users"
          value={loading ? "..." : stats.blockedUsers}
          subtitle=""
          icon={<UserMinus className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-100"
        />
        <StatCard
          title="Removed Users"
          value={loading ? "..." : stats.removedUsers}
          subtitle=""
          icon={<UserX className="w-6 h-6 text-red-600" />}
          iconBg="bg-red-100"
        />
      </div>

      {/* Admin Action Cards - Hidden for Teacher */}
      {!isTeacher && (
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
          <div onClick={() => setShowAddUser(true)} className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-[#0B1957] dark:bg-[#9ECCFA] rounded-xl p-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-white dark:text-[#0B1957]" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#0B1957] dark:text-white">Add Users</p>
                <p className="text-sm text-gray-600 dark:text-[#9ECCFA]">Register new students</p>
              </div>
            </div>
          </div>

          <div onClick={() => setShowRoles(true)} className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-[#0B1957] dark:bg-[#9ECCFA] rounded-xl p-3 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white dark:text-[#0B1957]" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#0B1957] dark:text-white">Define Roles</p>
                <p className="text-sm text-gray-600 dark:text-[#9ECCFA]">Manage permissions</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Leaderboard />
          <FacultyCard />
        </div>

        <div className="lg:col-span-2">
          <ManageStudents />
        </div>
      </div>

      <AddUserSidebar
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
      />
      <DefineRolesSidebar
        isOpen={showRoles}
        onClose={() => setShowRoles(false)}
      />
    </div>
  );
}
