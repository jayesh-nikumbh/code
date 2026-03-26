export default function PointsBreakDownChart() {
    return (
      <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0B1957] dark:text-white mb-4">
          Points Breakdown
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Assignments
              </span>
            </div>
            <span className="font-semibold text-[#0B1957] dark:text-white">
              4,600
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Badges</span>
            </div>
            <span className="font-semibold text-[#0B1957] dark:text-white">600</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Streak</span>
            </div>
            <span className="font-semibold text-[#0B1957] dark:text-white">200</span>
          </div>
          <div className="pt-3 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#0B1957] dark:text-white">Total</span>
              <span className="text-lg font-bold text-[#0B1957] dark:text-white">
                5,400
              </span>
            </div>
          </div>
        </div>
      </div>
    );
}