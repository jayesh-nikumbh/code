import { Clock } from "lucide-react";

export default function RecentActivity({ activities = [], onMarkAsSeen }) {
    return (
        <div className="bg-white dark:bg-[#152561] rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 p-8 h-fit transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0B1957] dark:text-white">
                    Recent Activity
                </h2>
                {activities.filter(a => !a.isSeen).length > 0 && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        {activities.filter(a => !a.isSeen).length} New
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {activities.map((a, i) => (
                    <div
                        key={a.id || i}
                        onClick={() => !a.isSeen && onMarkAsSeen(a.id)}
                        className={`relative flex items-center gap-5 p-5 rounded-3xl border transition-all duration-300 group cursor-pointer ${
                            !a.isSeen 
                            ? "bg-white dark:bg-[#152561] border-blue-200 dark:border-blue-500/30 shadow-[0_8px_20px_-8px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/5" 
                            : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 opacity-75 grayscale-[0.3]"
                        } hover:shadow-lg hover:-translate-y-0.5`}
                    >
                        {/* Status Dot */}
                        {!a.isSeen && (
                            <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse" />
                        )}

                        <div className={`${a.iconBg} ${a.iconColor} p-3 rounded-2xl transition-all duration-300 w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-110`}>
                            {a.icon}
                        </div>

                        <div className="flex-1">
                            <p className={`text-[15px] transition-colors leading-snug ${
                                !a.isSeen 
                                ? "font-bold text-[#0B1957] dark:text-white" 
                                : "font-medium text-gray-600 dark:text-gray-400"
                            }`}>
                                {a.text}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 text-gray-400 dark:text-gray-500">
                                <Clock size={12} />
                                <span className="text-[12px] font-medium tracking-wide lowercase italic">
                                    {a.time}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {activities.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <p className="text-sm">No activities yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}