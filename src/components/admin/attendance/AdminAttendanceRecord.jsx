import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import attendanceService from "../../../api/services/attendance";

export default function AdminAttendanceRecord() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const data = await attendanceService.getAdminAttendanceRecords();
        setRecords(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch attendance records:", err);
        setError("Failed to load attendance records");
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const months = [
    "All", "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = selectedMonth === "All" || record.timestamp.toLowerCase().includes(selectedMonth.toLowerCase());
    return matchesSearch && matchesMonth;
  });

  return (
    <div className="bg-white dark:bg-[#152561] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-[#0B1957] dark:text-white">
          Attendance Record
        </h3>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#D1E8FF]/30 dark:bg-white/5 text-[#0B1957] dark:text-white text-sm pl-9 pr-4 py-2 rounded-lg w-64 outline-none border border-transparent focus:border-[#0B1957]/20 transition-all placeholder:text-gray-500"
            />
          </div>

          {/* Month Selector */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#D1E8FF]/50 dark:bg-white/10 text-[#0B1957] dark:text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all min-w-[120px] justify-between"
            >
              <span>{selectedMonth}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-[#1B2B6E] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-50 py-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => {
                      setSelectedMonth(month);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedMonth === month 
                        ? "bg-[#0B1957] text-white" 
                        : "text-[#0B1957] dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EBF5FF] dark:bg-[#1B2B6E] text-[#0B1957]/70 dark:text-white/70 text-sm font-bold">
              <th className="px-6 py-4 rounded-l-xl w-16">#</th>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                  Loading records...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <tr key={record.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#0B1957] dark:text-white">
                    {record.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {record.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      record.status === "Present" 
                        ? "bg-green-100 text-green-600 dark:bg-green-500/10" 
                        : "bg-red-100 text-red-500 dark:bg-red-500/10"
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
