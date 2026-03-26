import { Bell, CheckCircle2, Clock, AlertCircle, Info } from 'lucide-react';

// Define the icons based on types
const notificationIcons = {
    assignment: {
        icon: Bell,
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/30'
    },
    grade: { icon: CheckCircle2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    deadline: { icon: Clock, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    achievement: { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    cancelled: { icon: AlertCircle, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
    resource: { icon: Info, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    confirmed: { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    leaderboard: { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    attendance: { icon: Info, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    upcoming: { icon: Clock, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
};

const notifications = [
    {
        id: 1,
        type: 'assignment',
        title: 'New Assignment Posted',
        description: 'Algorithm Analysis Report has been posted for Computer Science 301. Due date: Feb 28, 2026',
        time: '2 hours ago',
        isNew: true,
    },
    {
        id: 2,
        type: 'grade',
        title: 'Grade Updated',
        description: 'Your Database Design Project has been graded. You scored an A-. Great work!',
        time: '5 hours ago',
    },
    {
        id: 3,
        type: 'deadline',
        title: 'Deadline Reminder',
        description: "Algorithm Analysis Report is due in 2 days. Don't forget to submit!",
        time: '1 day ago',
    },
    {
        id: 4,
        type: 'achievement',
        title: 'Achievement Unlocked',
        description: 'Congratulations! You\'ve earned the "Perfect Attendance" badge for attending all classes this month.',
        time: '2 days ago',
    },
    {
        id: 5,
        type: 'cancelled',
        title: 'Class Cancelled',
        description: 'Information Systems 202 class scheduled for Feb 27 has been cancelled.',
        time: '2 days ago',
    },
    {
        id: 6,
        type: 'resource',
        title: 'New Resource Available',
        description: 'Study materials for Database Management have been uploaded to the portal.',
        time: '3 days ago',
    },
    {
        id: 7,
        type: 'confirmed',
        title: 'Assignment Submission Confirmed',
        description: 'Your submission for Web Development Final has been received successfully.',
        time: '4 days ago',
    },
    {
        id: 8,
        type: 'leaderboard',
        title: 'Leaderboard Update',
        description: 'You\'ve moved up to Rank #1 on the leaderboard! Keep up the great work!',
        time: '5 days ago',
    },
    {
        id: 9,
        type: 'attendance',
        title: 'Attendance Marked',
        description: 'Your attendance for Computer Science 301 on Feb 24 has been marked as present.',
        time: '5 days ago',
    },
    {
        id: 10,
        type: 'upcoming',
        title: 'Upcoming Deadline',
        description: 'Database Design Project is due in 4 days. Start working on it if you haven\'t already.',
        time: '1 week ago',
    },
];

export default function Notifications() {
    return (
        <>
            <div className="max-w-262.5 mx-auto px-6 py-10 pb-16">
                <div className="flex items-center gap-4 mb-2 justify-between">
                    <h1 className="text-2xl font-bold text-[#14235F] dark:text-white">
                        Notifications
                    </h1>
                    <span className="bg-red-100  text-red-600 dark:bg-red-900/40 dark:text-red-400 px-3 py-1 rounded-full text-[13px] font-bold">
                        1 new
                    </span>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-300 mb-8">
                    Stay updated with all your academic activities
                </p>

                <div className="space-y-4">
                    {notifications.map((notif) => {
                        const { icon: Icon, color, bg } = notificationIcons[notif.type];
                        return (
                            <div
                                key={notif.id}
                                className={`flex gap-5 p-5 rounded-2xl border transition-all hover:shadow-md ${notif.isNew
                                    ? 'bg-white dark:bg-[#152561] border-blue-300 dark:border-[#9eccfa]'
                                    : 'bg-white dark:bg-[#152561] border-gray-200 dark:border-[#2a4891]'
                                    }`}
                            >
                                {/* Icon */}
                                <div className="shrink-0 mt-1">
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-full ${bg}`}>
                                        <Icon className={`w-6 h-6 ${color}`} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-[#14235F] dark:text-white text-[16px]">
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs font-medium text-gray-400 dark:text-gray-400 whitespace-nowrap ml-4">
                                            {notif.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-1.5 leading-relaxed">
                                        {notif.description}
                                    </p>
                                    {notif.isNew && (
                                        <span className="inline-block mt-3 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-md">
                                            New
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Load More Button */}
                <div className="flex justify-center mt-12">
                    <button className="bg-[#14245C] dark:bg-[#9ECCFA] text-white dark:text-[#14245C] font-semibold px-8 py-3 rounded-xl hover:bg-[#1E347F] dark:hover:bg-[#b8dcfc] transition-colors shadow-md">
                        Load More Notifications
                    </button>
                </div>
            </div>
        </>
    );
}
