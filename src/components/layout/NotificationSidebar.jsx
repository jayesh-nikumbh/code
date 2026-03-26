import { useState, useEffect, useRef } from "react";
import { X, Bell, CheckCircle2, Clock, AlertCircle, Info } from "lucide-react";

const notificationIcons = {
    assignment: { icon: Bell, color: "text-blue-600", bg: "bg-blue-100", darkBg: "dark:bg-blue-900/30", darkColor: "dark:text-blue-400" },
    grade: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100", darkBg: "dark:bg-green-900/30", darkColor: "dark:text-green-400" },
    deadline: { icon: Clock, color: "text-orange-500", bg: "bg-orange-100", darkBg: "dark:bg-orange-900/30", darkColor: "dark:text-orange-400" },
    cancelled: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-100", darkBg: "dark:bg-red-900/30", darkColor: "dark:text-red-400" },
    resource: { icon: Info, color: "text-blue-600", bg: "bg-blue-100", darkBg: "dark:bg-blue-900/30", darkColor: "dark:text-blue-400" },
};

export default function NotificationSidebar({ isOpen, onClose, notifications, markAsSeen }) {
    const [isVisible, setIsVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Small delay so CSS transition has a base to animate from
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimateIn(true));
            });
        } else {
            setAnimateIn(false);
            const timer = setTimeout(() => setIsVisible(false), 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-60 flex overflow-hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-400"
                style={{ opacity: animateIn ? 1 : 0 }}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-[#F5F7FA] dark:bg-[#0B1957] shadow-2xl flex flex-col"
                style={{
                    transform: animateIn ? "translateX(0)" : "translateX(100%)",
                    opacity: animateIn ? 1 : 0.6,
                    transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.3s ease",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-6"
                    style={{
                        opacity: animateIn ? 1 : 0,
                        transform: animateIn ? "translateY(0)" : "translateY(-12px)",
                        transition: "opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-[#14245C] dark:text-white">
                            Notifications
                        </h2>
                        {notifications.filter(n => !n.isSeen).length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {notifications.filter(n => !n.isSeen).length} New
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 hide-scrollbar">
                    {notifications.length > 0 ? (
                        notifications.map((notif, index) => {
                            const { icon: Icon, color, bg, darkBg, darkColor } = notificationIcons[notif.type];

                            return (
                                <div
                                    key={notif.id}
                                    onClick={() => markAsSeen(notif.id)}
                                    style={{
                                        opacity: animateIn ? 1 : 0,
                                        transform: animateIn ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
                                        transition: `opacity 0.35s ease ${0.12 + index * 0.06}s, transform 0.35s ease ${0.12 + index * 0.06}s`,
                                    }}
                                    className={`relative flex gap-4 p-4 rounded-2xl border transition-shadow duration-300 cursor-pointer ${notif.isSeen
                                        ? "bg-white dark:bg-[#152561]/50 border-gray-100 dark:border-white/5 opacity-70"
                                        : "bg-white dark:bg-[#152561] border-blue-100 dark:border-blue-500/20 shadow-sm hover:shadow-md ring-1 ring-blue-500/5"
                                        }`}
                                >
                                    {/* Unread Indicator Dot */}
                                    {!notif.isSeen && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                    )}

                                    <div
                                        className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-xl ${bg} ${darkBg} shadow-sm`}
                                    >
                                        <Icon className={`w-5 h-5 ${color} ${darkColor}`} />
                                    </div>

                                    <div className="flex-1 py-0 px-1">
                                        <p className={`text-[13.5px] leading-snug mb-0.5 ${notif.isSeen ? "text-gray-500 dark:text-gray-400 font-medium" : "text-[#14245C] dark:text-white font-bold"
                                            }`}>
                                            {notif.title}
                                        </p>
                                        <div className="flex items-center gap-1 text-gray-400 dark:text-gray-400">
                                            <Clock size={11} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{notif.time}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Bell size={48} className="mb-4 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

