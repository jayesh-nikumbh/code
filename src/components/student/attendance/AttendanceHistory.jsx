import React, { useState, useEffect } from "react";
import { CircleCheck, XCircle, ChevronDown } from "lucide-react";
import attendanceService from "../../../api/services/attendance";
const months = ["All Months", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AttendanceHistory() {
    const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth() + 1]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await attendanceService.getAttendanceHistory();
                setRecords(data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredRecords = selectedMonth === "All Months"
        ? records
        : records.filter(r => r.month === selectedMonth);

    return (
        <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm min-h-[400px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-lg font-bold text-[#0B1957] dark:text-white mb-1">
                        Recent Attendance Records
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">Complete record of your classes</p>
                </div>

                {/* Custom Styled Dropdown Filter */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-40 px-4 py-2 bg-gray-50 dark:bg-[#1d3270] border border-gray-100 dark:border-white/10 rounded-xl text-sm font-medium text-[#0B1957] dark:text-white hover:bg-gray-100 transition-all"
                    >
                        {selectedMonth}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#152561] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                            {months.map((month) => (
                                <button
                                    key={month}
                                    onClick={() => {
                                        setSelectedMonth(month);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedMonth === month
                                        ? "bg-[#D1E8FF] text-[#0B1957] font-bold"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-8 h-8 border-3 border-[#4B739E] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-400 font-medium animate-pulse">Loading records...</p>
                    </div>
                ) : filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                        <div key={record.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#1a2c6d] rounded-xl border border-gray-100 dark:border-white/5 transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${record.status === "Present" ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                                    {record.status === "Present" ? <CircleCheck className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#0B1957] dark:text-white">{record.name}</h4>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{record.time}</p>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 text-[11px] font-bold rounded-lg ${record.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {record.status}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-sm italic">No records found for {selectedMonth}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
