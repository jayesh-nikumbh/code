import React from 'react';
import { Star, Award, Trophy, Medal, Flame } from "lucide-react";

export default function AchievementCard({
    icon,
    iconColorClass,
    iconBgClass,
    title,
    description,
    isEarned,
    dateEarned,
    progress,
}) {
    return (
        <div
            className={`p-5 rounded-xl border-2 transition-all  ${isEarned
                ? "bg-linear-to-br from-white to-[#F8F3EA] dark:from-[#152561] dark:to-[#1d3270] border-[#9ECCFA] dark:border-[#9ECCFA] shadow-md"
                : "bg-gray-50 dark:bg-[#1d3270]/50 border-gray-200 dark:border-white/10 opacity-75"
                }`}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                    className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl 
                                ${isEarned ? iconBgClass : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                >
                    <div className={`w-6 h-6 ${isEarned ? iconColorClass : 'text-gray-400 dark:text-gray-500'}`} >
                        {icon}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-[17px] mb-1 truncate ${isEarned ? 'text-[#1A237E] dark:text-white' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {title}
                    </h3>
                    <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-3 leading-snug">
                        {description}
                    </p>

                    {isEarned ? (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-[#E8F5E9] text-[#2E7D32] dark:bg-green-900/30 dark:text-green-400 rounded-full">
                            Earned {dateEarned}
                        </span>
                    ) : (
                        <div className="w-full mt-2">
                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mb-2 overflow-hidden">
                                <div
                                    className="bg-[#90CAF9] dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-[13px] text-gray-400 dark:text-gray-500">
                                {progress}% complete
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
