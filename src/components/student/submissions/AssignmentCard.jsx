import React from 'react';
import { FileText, Calendar } from 'lucide-react';

const AssignmentCard = ({ assignment, onClick }) => {
    return (
        <div
            onClick={() => onClick(assignment)}
            className="group flex items-start justify-between p-5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-blue-50 dark:hover:bg-white/5 transition-all cursor-pointer shadow-sm"
        >
            <div className="flex gap-5">
                {/* Icon Box */}
                <div className="bg-gray-200 dark:bg-[#152466]/60 p-3 h-12 rounded-xl text-gray-700 dark:text-[#8cbcf5] transition-colors">
                    <FileText size={22} />
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-md font-semibold text-[#0B1957] dark:text-white mb-1 tracking-tight">
                        {assignment.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-blue-100/60 mb-2">
                        {assignment.desc}
                    </p>
                    <div className="flex gap-4 text-sm font-normal">
                        <span className="text-green-600 dark:text-[#10B981]">
                            Submitted: {assignment.submitted}/{assignment.total}
                        </span>
                        <span className="text-orange-500 dark:text-[#F59E0B]">
                            Remaining: {assignment.remaining}
                        </span>
                    </div>
                </div>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-blue-100/40 text-sm font-normal pt-1">
                <Calendar size={16} />
                <span>{assignment.date}</span>
            </div>
        </div>
    );
};

export default AssignmentCard;
