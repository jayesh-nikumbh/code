import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import CustomToast from "../../common/CustomToast";

export default function SessionCalendar({ onDeclare, markedDates = {} }) {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // Starting with March 2026 as per user requirement
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalType, setModalType] = useState(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const prevMonthDays = getDaysInMonth(year, month - 1);

        const calendar = [];

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            calendar.push({
                day: prevMonthDays - i,
                month: month - 1,
                year: year,
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            calendar.push({
                day: i,
                month: month,
                year: year,
                isCurrentMonth: true
            });
        }

        // Next month days
        const remaining = 42 - calendar.length;
        for (let i = 1; i <= remaining; i++) {
            calendar.push({
                day: i,
                month: month + 1,
                year: year,
                isCurrentMonth: false
            });
        }

        return calendar;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const formatDateString = (dateObj) => {
        const d = new Date(dateObj.year, dateObj.month, dateObj.day);
        return d.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const handleDateClick = (dateObj) => {
        const date = new Date(dateObj.year, dateObj.month, dateObj.day);
        if (date < today) return; // Prevent clicking past dates
        setSelectedDate(dateObj);
    };

    const handleConfirm = () => {
        if (!selectedDate || !modalType) return;

        const dateStr = formatDateString(selectedDate);
        if (modalType === 'session') {
            onDeclare(`Admin declared ${dateStr} as Session Day`, "session", dateStr);
            CustomToast.success(`Session declared for ${dateStr}`);
        } else {
            onDeclare(`Admin declared ${dateStr} as Holiday`, "holiday", dateStr);
            CustomToast.success(`Holiday declared for ${dateStr}`);
        }
        setModalType(null);
    };

    const calendarDays = generateCalendar();
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <>
            <div className="bg-white dark:bg-[#152561] rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 p-8 flex flex-col items-center min-h-[500px] transition-colors duration-300">
                <h2 className="w-full text-left font-semibold text-[#0B1957] dark:text-white mb-8">
                    Session & Holiday Scheduler
                </h2>

                <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 w-full max-w-[340px] shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <button 
                            onClick={handlePrevMonth}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="font-bold text-[#0B1957] dark:text-gray-200 text-sm">
                            {monthYear}
                        </span>
                        <button 
                            onClick={handleNextMonth}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-[10px] font-bold text-gray-400 mb-4">
                        {days.map((d) => (
                            <div key={d} className="text-center">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1.5 text-xs">
                        {calendarDays.map((item, i) => {
                            const date = new Date(item.year, item.month, item.day);
                            const formatted = formatDateString(item);
                            const isPast = date < today;
                            const isSelected = selectedDate && formatDateString(selectedDate) === formatted;
                            const markType = markedDates[formatted];
                            
                            let style = "text-gray-600 dark:text-gray-400";
                            if (isPast) {
                                style = "text-gray-200 dark:text-white/10 cursor-not-allowed";
                            } else if (!item.isCurrentMonth) {
                                style = "text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-white/5";
                            } else {
                                style = "hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer";
                            }

                            if (markType === "current" || date.toDateString() === today.toDateString()) {
                                style = "bg-[#D9E6FF] dark:bg-blue-500/20 text-[#0B1957] dark:text-[#9ECCFA] font-bold rounded-full";
                            } else if (markType === "holiday") {
                                style = "bg-[#FFEDED] dark:bg-red-500/20 text-[#EF4444] dark:text-red-400 font-bold rounded-full";
                            } else if (markType === "session") {
                                style = "bg-[#E0E7FF] dark:bg-indigo-500/20 text-[#4338CA] dark:text-indigo-300 font-bold rounded-full";
                            }

                            if (isSelected) {
                                style = "bg-[#0B1957] dark:bg-[#3B82F6] text-white font-bold rounded-full scale-105 shadow-md";
                            }

                            return (
                                <div
                                    key={i}
                                    onClick={() => !isPast && handleDateClick(item)}
                                    className={`w-9 h-9 flex items-center justify-center transition-all ${style}`}
                                >
                                    {item.day}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Legend Section */}
                <div className="w-full mt-6 grid grid-cols-3 gap-2 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#D9E6FF] dark:bg-blue-500/30 rounded-full border border-blue-100 dark:border-blue-500/20"></div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Present Day</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#E0E7FF] dark:bg-indigo-500/30 rounded-full border border-indigo-100 dark:border-indigo-500/20"></div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Session Day</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#FFEDED] dark:bg-red-500/30 rounded-full border border-red-100 dark:border-red-500/20"></div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Holiday</span>
                    </div>
                </div>

                {selectedDate && (
                    <div className="w-full mt-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Selected: <span className="font-semibold text-[#0B1957] dark:text-[#9ECCFA]">{formatDateString(selectedDate)}</span>
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setModalType('session')}
                                className="flex-1 bg-[#0B1957] dark:bg-[#3B82F6] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#14245C] dark:hover:bg-[#2563EB] transition-all active:scale-95 shadow-md"
                            >
                                Declare Session
                            </button>
                            <button 
                                onClick={() => setModalType('holiday')}
                                className="flex-1 bg-white dark:bg-white/5 text-[#EF4444] dark:text-red-400 py-4 rounded-xl font-bold text-sm border border-[#FEE2E2] dark:border-red-500/20 hover:bg-[#FFF5F5] dark:hover:bg-red-500/10 transition-all active:scale-95 shadow-sm"
                            >
                                Declare Holiday
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {modalType && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center px-4">
                    <div 
                        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${modalType ? "animate-overlay-in" : "animate-overlay-out opacity-0"}`}
                        onClick={() => setModalType(null)}
                    ></div>
                    <div className={`relative bg-white dark:bg-[#152561] rounded-[24px] shadow-2xl w-full max-w-[360px] p-7 ${modalType ? "animate-spring-in" : "animate-spring-out"}`}>
                        <button 
                            onClick={() => setModalType(null)}
                            className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <h3 className="text-lg font-bold text-[#0B1957] dark:text-white mb-1">
                            {modalType === 'session' ? 'Declare Session Day' : 'Declare Holiday'}
                        </h3>
                        <p className="text-gray-400 dark:text-gray-400 text-[13px] mb-4">
                            {modalType === 'session' 
                                ? 'Declare this date as a session day?' 
                                : 'Declare this day as a holiday?'}
                        </p>

                        <p className="font-bold text-[#0B1957] dark:text-[#9ECCFA] text-sm mb-6 bg-gray-50 dark:bg-white/10 p-3 rounded-xl border border-gray-100 dark:border-white/10">
                            {formatDateString(selectedDate)}
                        </p>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setModalType(null)}
                                className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className={`flex-1 py-2.5 px-4 text-white rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md ${
                                    modalType === 'session' 
                                        ? 'bg-[#0B1957] dark:bg-[#3B82F6] hover:bg-[#14245C] dark:hover:bg-[#2563EB]' 
                                        : 'bg-red-500 hover:bg-red-600'
                                }`}
                            >
                                {modalType === 'session' ? 'Confirm Session' : 'Confirm Holiday'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}