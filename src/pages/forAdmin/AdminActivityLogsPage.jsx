import { useState, useEffect } from "react";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";
import adminService from "../../api/services/admin";
import CustomToast from "../../components/common/CustomToast";

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getActivityLogs();
      setLogs(data);
    } catch (error) {
      CustomToast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  // Handle Search
  const filteredLogs = logs.filter(
    (log) =>
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle Sort
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...logs].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setLogs(sorted);
  };

  return (
    <div className="min-h-screen bg-[#F8F3EA] dark:bg-[#0B1957] px-8 py-10 animate-in fade-in duration-500 font-sans">
      <div className="max-w-350 mx-auto space-y-10">
        {/* Header Section */}
        <div className="px-1">
          <h1 className="text-2xl font-bold text-[#0B1957] dark:text-white mb-1">
            Activity Log
          </h1>
          <p className="text-gray-600 dark:text-blue-100/60">
            View all system activities and user actions 
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-[#0E1A4D] rounded-3xl border border-gray-100 dark:border-white/5 p-5 md:p-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
          <div className="space-y-5">
            {/* Inner Title */}
            <h2 className="text-xl font-bold text-[#0B1957] dark:text-white px-1">
              System Activity
            </h2>

            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#8cbcf5]" />
              <input
                type="text"
                placeholder="Search by username, IP, or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-[#152466]/40 dark:text-[#8cbcf5] border border-gray-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-base placeholder-gray-400 dark:placeholder-white/40"
              />
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <th className="p-0 text-left w-1/6 group">
                      <button
                        onClick={() => handleSort("ip")}
                        className="w-full flex items-center gap-2 px-4 py-6 text-sm font-bold text-[#0B1957] dark:text-white hover:bg-[#F1F8FF] dark:hover:bg-white/5 transition-colors text-left"
                      >
                        Device IP{" "}
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </th>
                    <th className="p-0 text-left w-1/5 group">
                      <button
                        onClick={() => handleSort("username")}
                        className="w-full flex items-center gap-2 px-4 py-6 text-sm font-bold text-[#0B1957] dark:text-white hover:bg-[#F1F8FF] dark:hover:bg-white/5 transition-colors text-left"
                      >
                        Username{" "}
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </th>
                    <th className="p-0 text-left w-1/4 group">
                      <button
                        onClick={() => handleSort("timestamp")}
                        className="w-full flex items-center gap-2 px-4 py-6 text-sm font-bold text-[#0B1957] dark:text-white hover:bg-[#F1F8FF] dark:hover:bg-white/5 transition-colors text-left"
                      >
                        Timestamp{" "}
                        <ArrowUpDown className="w-4 h-4 text-gray-400/50" />
                      </button>
                    </th>
                    <th className="p-0 text-left">
                      <div className="flex items-center gap-2 px-4 py-6 text-sm font-bold text-[#0B1957] dark:text-white">
                        Action
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-10 h-10 text-[#0B1957] dark:text-[#9ECCFA] animate-spin" />
                            <p className="text-sm text-gray-400 font-medium animate-pulse">Loading logs...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="group hover:bg-gray-50/40 dark:hover:bg-white/1 transition-colors"
                    >
                      <td className="py-6 px-4">
                        <span className="text-sm font-medium text-[#2563EB] dark:text-[#9ECCFA] tracking-tight">
                          {log.ip}
                        </span>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-base font-bold text-[#0B1957] dark:text-white tracking-tight">
                          {log.username}
                        </p>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-sm text-gray-500 dark:text-[#8cbcf5] font-normal">
                          {log.timestamp}
                        </p>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-sm text-[#0B1957] dark:text-gray-100 font-normal leading-relaxed">
                          {log.action}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && filteredLogs.length === 0 && (
                <div className="py-32 text-center">
                  <p className="text-gray-400 dark:text-white/20 text-lg font-medium">
                    No activity data available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
