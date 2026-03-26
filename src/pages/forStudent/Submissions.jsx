import { useState, useEffect } from "react";
import StatCard from "../../components/common/StatCard";
import {
  CircleCheck,
  FileText,
  Clock,
  ClipboardClock,
  Search
} from "lucide-react";
import SubmiisionsHistoryCard from "../../components/student/submissions/SubmiisionsHistoryCard";
import submissionsService from "../../api/services/submissions";

export default function Submissions() {
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    pending: 0,
    underReview: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await submissionsService.getSubmissionStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch submission stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <div className="max-w-400 mx-auto px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Submissions */}
          <StatCard
            title="Total Submissions"
            value={loading ? "..." : stats.total}
            subtitle="All time"
            icon={
              <FileText className="w-6 h-6 text-[#0B1957] dark:text-blue-600" />
            }
            iconBg="bg-[#D1E8FF]"
          />

          {/* Submitted */}
          <StatCard
            title="Submitted"
            value={loading ? "..." : stats.submitted}
            subtitle="Done"
            icon={<CircleCheck className="w-6 h-6 text-green-600 " />}
            iconBg="bg-green-100"
          />

          {/* Pending */}
          <StatCard
            title="Pending"
            value={loading ? "..." : stats.pending}
            subtitle="Remaining"
            icon={<ClipboardClock className="w-6 h-6 text-yellow-600 rounded-xl" />}
            iconBg="bg-yellow-100"
          />

          {/* Under Review */}
          <StatCard
            title="Under Review"
            value={loading ? "..." : stats.underReview}
            subtitle="Awaiting grades"
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            iconBg="bg-orange-100"
          />
        </div>

        {/* Submission History Section */}
        <div className="bg-white dark:bg-[#152561] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#0B1957] dark:text-white mb-2">
                Submission History
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                View all your submitted assignments and grades
              </p>
            </div>

            <div className="relative group max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#0B1957] transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search submissions..."
                className="block w-full pl-10 pr-3 py-2.5 bg-gray-50/50 dark:bg-[#0B1957]/50 border border-gray-100 dark:border-white/10 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B1957]/10 dark:focus:ring-white/10 focus:bg-white dark:focus:bg-[#0B1957] transition-all"
              />
            </div>
          </div>

          <SubmiisionsHistoryCard searchQuery={searchQuery} />
        </div>
      </div>
    </>
  );
}
