import AttendanceTrendCard from "../../components/admin/attendance/AttendanceTrendCard";
import AttendanceCalendar from "../../components/student/attendance/AttendanceCalendar";
import AttendanceHistory from "../../components/student/attendance/AttendanceHistory";

export default function Attendance() {
  return (
    <div className="max-w-400 mx-auto px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-[#0B1957] dark:text-white">Attendance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trend and Integrated Stats */}
        <div className="lg:col-span-8">
          <AttendanceTrendCard />
        </div>

        {/* Right Column: Calendar */}
        <div className="lg:col-span-4">
          <AttendanceCalendar />
        </div>
      </div>

      {/* Attendance History Section with Filter */}
      <AttendanceHistory />
    </div>
  );
}
