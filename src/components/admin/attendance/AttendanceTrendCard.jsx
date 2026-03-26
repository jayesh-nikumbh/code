import { useState, useEffect } from "react";
import AttendanceChart from "../../student/attendance/AttendanceChart";
import attendanceService from "../../../api/services/attendance";

export default function AttendanceTrendCard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrendData = async () => {
            try {
                const response = await attendanceService.getAttendanceTrend();
                setData(response);
            } catch (error) {
                console.error("Failed to fetch attendance trend:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendData();
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col h-full items-center justify-center min-h-[460px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1957] dark:border-white"></div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading trend...</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col h-full">
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#0B1957] dark:text-white mb-6">
                    Attendance Trend
                </h3>

                <div className="h-[300px] w-full relative mb-4">
                    <AttendanceChart data={data.trendData} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="bg-gray-50 dark:bg-[#1D2B6B] border border-gray-100 dark:border-white/10 p-3 rounded-xl text-center shadow-xs">
                    <p className="text-[15px] text-gray-500 font-medium mb-1">Present</p>
                    <p className="text-lg font-bold text-[#0B1957] dark:text-white">{data.summary.present}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#1D2B6B] border border-gray-100 dark:border-white/10 p-3 rounded-xl text-center shadow-xs">
                    <p className="text-[15px] text-gray-500 font-medium mb-1">Absent</p>
                    <p className="text-lg font-bold text-red-500">{data.summary.absent}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#1D2B6B] border border-gray-100 dark:border-white/10 p-3 rounded-xl text-center shadow-xs">
                    <p className="text-[15px] text-gray-500 font-medium mb-1">Overall</p>
                    <p className="text-lg font-bold text-[#4B739E]">{data.summary.overall}</p>
                </div>
            </div>
        </div>
    );
}
