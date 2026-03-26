import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import attendanceService from "../../../api/services/attendance";

export default function AttendanceCalendar() {
    const today = new Date();
    const [displayMonth, setDisplayMonth] = useState(today.getMonth());
    const [displayYear, setDisplayYear] = useState(today.getFullYear());
    const [calendarData, setCalendarData] = useState({ attendedDates: [], scheduledDates: [] });
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(null); // 'prev' or 'next'

    useEffect(() => {
        const fetchCalendarData = async () => {
            setLoading(true);
            try {
                // Pass the requested month and year to service
                const data = await attendanceService.getCalendarData(displayMonth + 1, displayYear);
                
                // For demonstration: If it's a future month or passed month, scramble mock data?
                // We will rely on whatever the service returns (mock JSON for now)
                setCalendarData(data);
            } catch (error) {
                console.error("Failed to fetch calendar data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCalendarData();
    }, [displayMonth, displayYear]);

    const handlePrevMonth = () => {
        setDirection('prev');
        if (displayMonth === 0) {
            setDisplayMonth(11);
            setDisplayYear(displayYear - 1);
        } else {
            setDisplayMonth(displayMonth - 1);
        }
    };

    const handleNextMonth = () => {
        setDirection('next');
        if (displayMonth === 11) {
            setDisplayMonth(0);
            setDisplayYear(displayYear + 1);
        } else {
            setDisplayMonth(displayMonth + 1);
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        // We always want to render the skeleton if data is not yet there,
        // but to avoid "baju wala div" shifting, we should maintain the structure.

        const totalDays = daysInMonth(displayMonth, displayYear);
        const startDay = firstDayOfMonth(displayMonth, displayYear);

        const days = [];
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-7 w-7"></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const isAttended = calendarData.attendedDates?.includes(d) || false;
            const isScheduled = calendarData.scheduledDates?.includes(d) || false;
            
            const isToday = d === today.getDate() && displayMonth === today.getMonth() && displayYear === today.getFullYear();

            let dayElement;

            if (isToday) {
                dayElement = <div className="h-9 w-9 flex items-center justify-center text-[13px] font-bold rounded-full transition-all bg-red-500 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-200 dark:ring-red-900/50 scale-110 z-10">{d}</div>;
            } else if (isAttended) {
                dayElement = <div className="h-9 w-9 flex items-center justify-center text-[13px] font-semibold rounded-full transition-all bg-[#4B739E] text-white shadow-md">{d}</div>;
            } else if (isScheduled) {
                dayElement = <div className="h-9 w-9 flex items-center justify-center text-[13px] font-semibold rounded-full transition-all bg-[#D1E8FF] text-[#0B1957]">{d}</div>;
            } else {
                dayElement = <div className="h-9 w-9 flex items-center justify-center text-[13px] font-medium rounded-full transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">{d}</div>;
            }

            days.push(
                <div key={d} className="flex items-center justify-center h-10 w-full relative">
                    {dayElement}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col h-full">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0B1957] dark:text-white mb-8">
                    Calendar
                </h3>

                <div className="flex items-center justify-between mb-8 px-2">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <p key={`${displayMonth}-${displayYear}`} className={`text-base font-bold text-gray-800 dark:text-gray-100 ${direction === 'next' ? 'animate-slide-right' : direction === 'prev' ? 'animate-slide-left' : ''}`}>
                        {monthNames[displayMonth]} {displayYear}
                    </p>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-y-2 mb-8 relative min-h-[260px]">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-center text-[11px] text-gray-400 font-bold uppercase tracking-wider pb-4">
                            {day}
                        </div>
                    ))}
                    
                    <div key={`${displayMonth}-${displayYear}`} className={`col-span-7 grid grid-cols-7 gap-y-2 ${direction === 'next' ? 'animate-slide-right' : direction === 'prev' ? 'animate-slide-left' : 'animate-fade-in'}`}>
                        {renderCalendar()}
                    </div>

                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-[#152561]/40 backdrop-blur-[2px] z-20 rounded-xl transition-all duration-300">
                            <div className="w-8 h-8 border-3 border-[#4B739E] border-t-transparent rounded-full animate-spin shadow-sm"></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 mt-auto pt-8 border-t border-gray-50 dark:border-white/5">
                <div className="flex items-center gap-4 px-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm shadow-red-500/30"></div>
                    <span className="text-[13px] text-gray-600 dark:text-gray-400 font-semibold italic">Today</span>
                </div>
                <div className="flex items-center gap-4 px-2">
                    <div className="w-4 h-4 rounded-full bg-[#4B739E] shadow-sm"></div>
                    <span className="text-[13px] text-gray-600 dark:text-gray-400 font-semibold italic">Attended Sessions</span>
                </div>
                <div className="flex items-center gap-4 px-2">
                    <div className="w-4 h-4 rounded-full bg-[#D1E8FF] shadow-sm"></div>
                    <span className="text-[13px] text-gray-600 dark:text-gray-400 font-semibold italic">Scheduled Sessions</span>
                </div>
            </div>
        </div>
    );
}
