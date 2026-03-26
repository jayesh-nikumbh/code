import { useState, useEffect } from "react";
import SessionCalendar from "../../components/admin/notifications/SessionCalendar";
import RecentActivity from "../../components/admin/notifications/RecentActivity";
import SendAnnouncement from "../../components/admin/notifications/SendAnnouncement";
import { FileText, UserCheck, Bell, AlertCircle, Loader2 } from "lucide-react";
import adminService from "../../api/services/admin";
import CustomToast from "../../components/common/CustomToast";

export default function AdminNotificationsPage() {
    const [activities, setActivities] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [calendarData, activityData] = await Promise.all([
                adminService.getCalendarData(),
                adminService.getRecentActivities()
            ]);

            // Map activities to include icons and styles
            const processedActivities = activityData.map(act => ({
                ...act,
                icon: getIcon(act.type),
                iconBg: getIconBg(act.type),
                iconColor: getIconColor(act.type)
            }));
            
            setActivities(processedActivities);
            setMarkedDates(calendarData.markedDates);
        } catch (error) {
            CustomToast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "holiday": return <AlertCircle size={20} />;
            case "assignment": return <FileText size={20} />;
            case "attendance": return <UserCheck size={20} />;
            case "session": return <UserCheck size={20} />;
            default: return <Bell size={20} />;
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case "holiday": return "text-orange-500";
            case "assignment": return "text-blue-500";
            case "attendance": return "text-emerald-500";
            case "session": return "text-indigo-500";
            default: return "text-purple-500";
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case "holiday": return "bg-orange-500/10";
            case "assignment": return "bg-blue-500/10";
            case "attendance": return "bg-emerald-500/10";
            case "session": return "bg-indigo-500/10";
            default: return "bg-purple-500/10";
        }
    };

    const addActivity = async (message, type = "announcement", date = null) => {
        try {
            // Post to API
            if (type === "announcement") {
                await adminService.sendAnnouncement(message);
            } else {
                await adminService.declareCalendarEvent({ message, type, date });
            }
            
            if (type === "holiday" && date) {
                setMarkedDates(prev => ({ ...prev, [date]: "holiday" }));
            } else if (type === "session" && date) {
                setMarkedDates(prev => ({ ...prev, [date]: "session" }));
            }

            const newActivity = {
                id: Date.now(),
                type: type,
                icon: getIcon(type),
                text: message,
                time: new Date().toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric', 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                }),
                iconColor: getIconColor(type),
                iconBg: getIconBg(type),
                isSeen: true
            };
            setActivities(prev => [newActivity, ...prev]);
            // Dispatch event for Navbar sync
            window.dispatchEvent(new CustomEvent('notificationsUpdated'));
        } catch (error) {
            CustomToast.error("Failed to post activity");
        }
    };

    const markAsSeen = (id) => {
        setActivities(prev => {
            const updated = prev.map(act => 
                act.id === id ? { ...act, isSeen: true } : act
            );
            // Dispatch event for Navbar sync
            window.dispatchEvent(new CustomEvent('notificationsUpdated'));
            return updated;
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F3EA] dark:bg-[#0B1957] gap-4">
                <Loader2 className="w-12 h-12 text-[#0B1957] dark:text-[#9ECCFA] animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse">Loading Dashboard Data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F3EA] dark:bg-[#0B1957] p-8 space-y-6 animate-in fade-in duration-500 font-sans">
            <div>
                <h1 className="text-2xl font-bold text-[#0B1957] dark:text-white">
                    Notifications & Session Calendar
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Manage session days, holidays, and important announcements.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side */}
                <div className="space-y-6">
                    <SessionCalendar 
                        onDeclare={addActivity} 
                        markedDates={markedDates}
                    />
                    <SendAnnouncement onSend={addActivity} />
                </div>

                {/* Right Side */}
                <RecentActivity 
                    activities={activities} 
                    onMarkAsSeen={markAsSeen}
                />
            </div>
        </div>
    );
}