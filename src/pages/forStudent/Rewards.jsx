import { useState, useEffect } from "react";
import { Star, Award, Trophy, Medal, Flame, ChevronDown, ChevronUp } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Leaderboard from "../../components/common/Leaderboard";
import AchievementCard from "../../components/student/rewards/AchievementCard";
import PointsBreakDownChart from "../../components/student/rewards/PointsBreakDownChart";
import RewardStore from "../../components/student/rewards/RewardStore";
import rewardsService from "../../api/services/rewards";

const iconMap = {
  Star,
  Award,
  Trophy,
  Medal,
  Flame
};

export default function Rewards() {
  const [stats, setStats] = useState({
    totalPoints: 0,
    rank: 0,
    badgesEarned: 0,
    totalBadges: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const [achievements, setAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);

  const [storeItems, setStoreItems] = useState([]);
  const [loadingStore, setLoadingStore] = useState(true);

  const [activeFilter, setActiveFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [activeStoreFilter, setActiveStoreFilter] = useState("all");
  const [isStoreFilterOpen, setIsStoreFilterOpen] = useState(false);

  useEffect(() => {
    fetchStatsAndAchievements();
  }, []);

  const fetchStatsAndAchievements = async () => {
    try {
      const [statsData, achievementsData, storeItemsData] = await Promise.all([
        rewardsService.getRewardStats(),
        rewardsService.getAchievements(),
        rewardsService.getStoreItems()
      ]);
      setStats(statsData);
      setAchievements(achievementsData);
      setStoreItems(storeItemsData);
    } catch (error) {
      console.error("Failed to fetch reward data:", error);
    } finally {
      setLoadingStats(false);
      setLoadingAchievements(false);
      setLoadingStore(false);
    }
  };

  const handleRedeem = async (item) => {
    try {
      await rewardsService.redeemReward(item.id, item.points);
      // Update local state points
      setStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints - item.points
      }));
      setStoreItems(prev => prev.map(si => si.id === item.id ? { ...si, isRedeemed: true } : si));
    } catch (error) {
      console.error("Redemption failed:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="max-w-400 mx-auto p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Star */}
          <StatCard
            title="Total Points"
            value={loadingStats ? "..." : stats.totalPoints}
            subtitle={loadingStats ? "Loading..." : `Rank #${stats.rank}`}
            icon={<Star className="w-6 h-6 text-yellow-500" />}
            iconBg="bg-yellow-100"
          />

          {/* Total Classes */}
          <StatCard
            title="Badges Earned"
            value={loadingStats ? "..." : stats.badgesEarned}
            subtitle={loadingStats ? "Loading..." : `${stats.totalBadges} Total`}
            icon={<Award className="w-6 h-6 text-purple-500" />}
            iconBg="bg-purple-100"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements Card */}
            <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm relative min-h-[300px]">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-[#0B1957] dark:text-white">
                    Achievements & Badge
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    Collect badges by completing challenges and milestones
                  </p>
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#D1E8FF] dark:bg-[#1e3270] text-[#0B1957] dark:text-[#9ECCFA] rounded-full text-sm font-semibold transition-all hover:bg-[#B3D9FF] dark:hover:bg-[#2a4594] border border-transparent"
                  >
                    {activeFilter}
                    {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isFilterOpen && (
                    <>
                      {/* Backdrop to close on click outside */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsFilterOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-40 bg-[#FBF7F1] dark:bg-[#1e3270] rounded-2xl shadow-xl border border-white/20 dark:border-white/10 p-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                        {["All", "Earned", "Yet to Earn"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setActiveFilter(option);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              activeFilter === option
                                ? "bg-[#F3EDE2] dark:bg-[#2a4594] text-[#0B1957] dark:text-white"
                                : "text-gray-600 dark:text-gray-300 hover:bg-[#F3EDE2] dark:hover:bg-[#2a4594] hover:text-[#0B1957] dark:hover:text-white"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6 h-px w-full bg-linear-to-r from-gray-100 via-transparent to-transparent dark:from-white/5" />

              {loadingAchievements ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#4B739E] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 bg-transparent">
                  {achievements
                    .filter((ach) => {
                      if (activeFilter === "All") return true;
                      if (activeFilter === "Earned") return ach.isEarned;
                      if (activeFilter === "Yet to Earn") return !ach.isEarned;
                      return true;
                    })
                    .map((ach) => {
                      const IconComponent = iconMap[ach.icon] || Star;
                      return (
                        <AchievementCard
                          key={ach.id}
                          icon={<IconComponent />}
                          iconColorClass={ach.iconColorClass}
                          iconBgClass={ach.iconBgClass}
                          title={ach.title}
                          description={ach.description}
                          isEarned={ach.isEarned}
                          dateEarned={ach.dateEarned}
                          progress={ach.progress}
                        />
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>

        {/* Reward Store Section */}
        <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm mt-8 relative min-h-[300px]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-[#0B1957] dark:text-white">
              Reward Store
            </h2>

            {/* Store Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStoreFilterOpen(!isStoreFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#D1E8FF] dark:bg-[#1e3270] text-[#0B1957] dark:text-[#9ECCFA] rounded-full text-sm font-semibold transition-all hover:bg-[#B3D9FF] dark:hover:bg-[#2a4594] border border-transparent"
              >
                {activeStoreFilter}
                {isStoreFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isStoreFilterOpen && (
                <>
                  {/* Backdrop to close on click outside */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsStoreFilterOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-[#FBF7F1] dark:bg-[#1e3270] rounded-2xl shadow-xl border border-white/20 dark:border-white/10 p-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                    {["All", "Redeemed", "Yet to Redeem"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setActiveStoreFilter(option);
                          setIsStoreFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          activeStoreFilter === option
                            ? "bg-[#F3EDE2] dark:bg-[#2a4594] text-[#0B1957] dark:text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-[#F3EDE2] dark:hover:bg-[#2a4594] hover:text-[#0B1957] dark:hover:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mb-8 h-px w-full bg-linear-to-r from-gray-100 via-transparent to-transparent dark:from-white/5" />

          {loadingStore ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#4B739E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeItems
                .filter((item) => {
                  if (activeStoreFilter === "All") return true;
                  if (activeStoreFilter === "Redeemed") return item.isRedeemed;
                  if (activeStoreFilter === "Yet to Redeem") return !item.isRedeemed;
                  return true;
                })
                .map((item) => (
                  <RewardStore
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    points={item.points}
                    canRedeem={stats.totalPoints >= item.points && !item.isRedeemed}
                    isRedeemed={item.isRedeemed}
                    onRedeem={() => handleRedeem(item)}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
