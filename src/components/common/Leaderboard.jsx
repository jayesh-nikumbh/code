import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, ChevronDown, ChevronUp } from 'lucide-react';
import leaderboardService from '../../api/services/leaderboard';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardExpanded, setLeaderboardExpanded] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await leaderboardService.getLeaderboard();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getInitials = (name) => {
        if (!name) return "F";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-orange-600" />;
    return null;
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    if (rank === 2) return 'bg-gray-50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700';
    if (rank === 3) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    return 'bg-white dark:bg-[#152561] border-gray-100 dark:border-white/10';
  };

  return (
    <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-[#0B1957] dark:text-white">
            Leaderboard
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Top performers this semester
        </p>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboardData.map((user, i) => {
              const isHidden = !leaderboardExpanded && i > 3;
              return (
                <div
                  key={user.rank}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isHidden
                      ? 'grid-rows-[0fr] opacity-0 overflow-hidden m-0 p-0 border-transparent'
                      : 'grid-rows-[1fr] opacity-100 my-2'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md ${getRankBg(user.rank)} ${isHidden ? 'border-transparent py-0 my-0' : ''}`}
                    >
                      <div className="flex items-center gap-2 min-w-6">
                        {getRankIcon(user.rank) || (
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            {user.rank}
                          </span>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#9ECCFA] to-[#D1E8FF] flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-[#0B1957]">
                          {getInitials(user?.name)}
                        </span>
                      </div>
                      <span className="flex-1 text-sm font-medium text-[#0B1957] dark:text-white truncate">
                        {user.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-[#0B1957] dark:text-white">
                          {user.points}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!loading && leaderboardData.length > 4 && (
        <button
          onClick={() => setLeaderboardExpanded(!leaderboardExpanded)}
          className="w-full mt-3 py-2 text-sm text-[#0B1957] dark:text-[#9ECCFA] hover:bg-[#F8F3EA] dark:hover:bg-[#1d3270] rounded-lg transition-all flex items-center justify-center gap-1"
        >
          {leaderboardExpanded ? (
            <>Show Less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>View More <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
}