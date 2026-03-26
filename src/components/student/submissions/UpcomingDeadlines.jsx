import { FileText, Calendar } from 'lucide-react';

const upcomingDeadlines = [
  {
    id: 1,
    title: 'Algorithm Analysis Report',
    course: 'Computer Science 301',
    dueDate: 'Feb 28',
    daysLeft: 2,
    status: 'urgent',
  },
  {
    id: 2,
    title: 'Database Design Project',
    course: 'Information Systems 202',
    dueDate: 'Mar 01',
    daysLeft: 4,
    status: 'warning',
  },
  {
    id: 3,
    title: 'Web Development Final',
    course: 'Software Engineering 304',
    dueDate: 'Mar 02',
    daysLeft: 5,
    status: 'normal',
  },
];

export default function UpcomingDeadlines() {
  return (
    <div className="bg-white dark:bg-[#152561] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[#0B1957] dark:text-[#9ECCFA]" />
        <h2 className="text-lg font-semibold text-[#0B1957] dark:text-white">
          Upcoming Deadlines
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Stay on track with your submissions
      </p>

      <div className="space-y-3">
        {upcomingDeadlines.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md ${item.status === 'urgent'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : item.status === 'warning'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                  : 'bg-[#F8F3EA] dark:bg-[#1d3270] border-gray-200 dark:border-white/10'
              }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === 'urgent'
                    ? 'bg-red-100 dark:bg-red-900/40'
                    : item.status === 'warning'
                      ? 'bg-orange-100 dark:bg-orange-900/40'
                      : 'bg-[#9ECCFA] dark:bg-[#2a4891]'
                  }`}
              >
                <FileText
                  className={`w-5 h-5 ${item.status === 'urgent'
                      ? 'text-red-600 dark:text-red-400'
                      : item.status === 'warning'
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-[#0B1957] dark:text-[#9ECCFA]'
                    }`}
                />
              </div>
              <div>
                <h3 className="font-medium text-[#0B1957] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {item.course}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${item.status === 'urgent'
                    ? 'text-red-600 dark:text-red-400'
                    : item.status === 'warning'
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-[#0B1957] dark:text-[#9ECCFA]'
                  }`}
              >
                {item.daysLeft} days
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.dueDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}