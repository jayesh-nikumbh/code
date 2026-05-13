export default function StatCard({ title, value, subtitle, icon, iconBg }) {
  return (
    <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover-lift group h-full flex flex-col justify-between cursor-default">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title  */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {title}
          </p>

          {/* Value */}
          <p className="text-3xl font-semibold text-[#0B1957] dark:text-white mb-1">
            {value}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        <div className={`${iconBg} dark:bg-[#1d3270] rounded-xl p-3 group-hover:scale-110 transition-transform duration-300`}>
          <div className="w-6 h-6 flex  items-center justify-center text-[#0B1957] dark:text-[#9ECCFA]">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}