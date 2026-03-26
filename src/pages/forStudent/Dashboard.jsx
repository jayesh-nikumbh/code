import { useState, useEffect } from "react";
import WelcomeCard from "../../components/common/WelcomeCard";
import StatCard from "../../components/common/StatCard";
import Leaderboard from "../../components/common/Leaderboard";
import SubmitAssignments from "../../components/student/dashboard/SubmitAssignments";
import PerformanceChart from "../../components/student/dashboard/PerformanceChart";
import { FileText, CircleCheck, Users } from "lucide-react";
import CustomToast from "../../components/common/CustomToast";
import MarkAttendanceCard from "../../components/student/dashboard/MarkAttendanceCard";
import attendanceService from "../../api/services/attendance";
import dashboardService from "../../api/services/dashboard";
import FacultyCard from "../../components/student/dashboard/FacultyCard";

export default function Dashboard() {
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [isAttendanceClosing, setIsAttendanceClosing] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [allowedLocation, setAllowedLocation] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [status, dashboardStats] = await Promise.all([
          attendanceService.getAttendanceStatus(),
          dashboardService.getStats()
        ]);

        setHasActiveSession(status.hasActiveSession);
        setIsAttendanceMarked(status.isMarked);
        if (status.sessionName) setSessionName(status.sessionName);
        if (status.allowedLocation) setAllowedLocation(status.allowedLocation);

        setStats(dashboardStats);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleMarkAttendance = async () => {
    try {
      await attendanceService.markAttendance();
      setIsAttendanceClosing(true);
      CustomToast.success("Attendance marked successfully! 🎉");
      setTimeout(() => {
        setIsAttendanceMarked(true);
        setIsAttendanceClosing(false);
      }, 500);
    } catch (error) {
      CustomToast.error(error?.message || "Failed to mark attendance.");
    }
  };

  return (
    <div className="max-w-400 mx-auto px-8 py-8 space-y-6">
      <WelcomeCard />

      <div className={`grid grid-cols-1 md:grid-cols-2 ${(!hasActiveSession || isAttendanceMarked) ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 transition-all duration-500 ease-in-out auto-rows-[1fr]`}>

        {!loading && hasActiveSession && !isAttendanceMarked && (
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden flex flex-col h-full ${
              isAttendanceClosing ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100'
            }`}
          >
            <MarkAttendanceCard
              onMark={handleMarkAttendance}
              lectureName={sessionName}
              allowedLocation={allowedLocation}
            />
          </div>
        )}

        <div className="h-full transition-all duration-500 ease-in-out">
          <StatCard
            title="Total Assignments"
            value={stats ? stats.totalAssignments : "--"}
            subtitle="Across all courses"
            icon={<FileText className="w-6 h-6 text-[#0B1957] dark:text-blue-600" />}
            iconBg="bg-[#D1E8FF]"
          />
        </div>

        <div className="h-full transition-all duration-500 ease-in-out">
          <StatCard
            title="Completed"
            value={stats ? stats.completedAssignments : "--"}
            subtitle={stats ? `${stats.completionRate} completion rate` : "--"}
            icon={<CircleCheck className="w-6 h-6 text-green-600" />}
            iconBg="bg-green-100"
          />
        </div>

        <div className="h-full transition-all duration-500 ease-in-out">
          <StatCard
            title="Attendance"
            value={stats ? stats.attendancePercentage : "--"}
            subtitle="This semester"
            icon={<Users className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-100 "
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SubmitAssignments />
          <PerformanceChart />
        </div>

        <div className="space-y-6">
          <Leaderboard />
          <FacultyCard />
        </div>
      </div>
    </div>
  );
}