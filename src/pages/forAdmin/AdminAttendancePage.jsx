import OverAllAttendanceChart from "../../components/admin/attendance/OverAllAttendanceChart";
import LowAttendanceStudents from "../../components/admin/attendance/LowAttendanceStudents";
import AdminAttendanceRecord from "../../components/admin/attendance/AdminAttendanceRecord";

export default function AdminAttendancePage() {
  return (
    <div className="max-w-400 mx-auto px-8 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-[#0B1957] dark:text-[#8cbcf5] mb-1">
        Attendance Management
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Track and manage student attendance
      </p>
      
      <OverAllAttendanceChart />
      
      <div className="grid grid-cols-1 gap-6">
        <AdminAttendanceRecord />
        <LowAttendanceStudents />
      </div>
    </div>
  );
}
