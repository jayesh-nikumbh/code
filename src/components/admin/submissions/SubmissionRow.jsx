import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Check } from "lucide-react";

const grades = ["A", "B", "C", "D"];

const SubmissionRow = ({ submission, index, onGrade }) => {

    const [isGradeOpen, setIsGradeOpen] = useState(false);
    const [grade, setGrade] = useState(submission.grade || null);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedback, setFeedback] = useState(submission.feedback || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsGradeOpen(false);
            }
        };

        if (isGradeOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isGradeOpen]);

    const handleGradeSelect = async (g) => {
        setGrade(g);
        setIsGradeOpen(false);
        setIsSubmitting(true);
        await onGrade(submission.id, { grade: g, feedback });
        setIsSubmitting(false);
    };

    const handleSendFeedback = async () => {
        if (!feedback.trim()) return;
        setIsSubmitting(true);
        await onGrade(submission.id, { grade, feedback });
        setIsSubmitting(false);
        setIsFeedbackOpen(false);
    };

    return (
        <>
            <div className="relative flex items-center justify-between p-4 border border-[#F3EFE7] dark:border-white/5 rounded-2xl hover:bg-[#F1F8FF] dark:hover:bg-white/2 transition-colors">

                <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-gray-400 min-w-[20px]">
                        {index + 1}
                    </span>

                    <div className="w-10 h-10 rounded-full bg-[#93C5FD] dark:bg-blue-500/20 flex items-center justify-center text-[#1E3A8A] dark:text-[#8cbcf5] font-bold text-xs shadow-sm">
                        {submission.initials}
                    </div>

                    <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-[#0B1957] dark:text-white">
                            {submission.name}
                        </h4>

                        <button className="text-[12px] font-medium text-gray-400 dark:text-blue-100/40 hover:underline">
                            {submission.fileName}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-10">

                    <span className="text-xs font-medium text-gray-400 dark:text-blue-100/40">
                        {submission.time}
                    </span>

                    <div className="flex items-center gap-3">

                        {/* Grade Button */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsGradeOpen(!isGradeOpen)}
                                className="flex items-center gap-3 px-3 py-2.5 bg-[#F3EFE7] dark:bg-[#152466]/40 text-[#0B1957] dark:text-white rounded-xl font-bold text-sm hover:opacity-80 transition-all border border-transparent dark:border-white/5 min-w-[100px] justify-between"
                            >
                                {grade ? grade : "Grade"}
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>

                            {isGradeOpen && (
                                <div className="absolute left-0 mt-1 w-33 bg-white dark:bg-[#152466] rounded-[12px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-white/10 z-20 p-1.5 animate-in fade-in zoom-in-95 duration-200">
                                    {grades.map((g) => (
                                        <div
                                            key={g}
                                            onClick={() => handleGradeSelect(g)}
                                            className={`flex items-center justify-between px-3.5 py-2 w-full cursor-pointer text-sm font-bold rounded-[8px] transition-all mb-0.5 last:mb-0 ${grade === g
                                                ? "bg-blue-200 text-[#0B1957] dark:bg-blue-500/20 dark:text-blue-100"
                                                : "hover:bg-blue-200 dark:hover:bg-white/5 text-gray-700 dark:text-blue-100/70"
                                                }`}
                                        >
                                            <span>{g}</span>
                                            {grade === g && <Check size={14} className="text-[#0B1957] dark:text-blue-400" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Feedback Button */}
                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="px-4 py-2.5 bg-[#F3EFE7] dark:bg-[#152466]/40 text-[#0B1957] dark:text-white rounded-xl font-bold text-sm hover:opacity-80 transition-all border border-transparent dark:border-white/5"
                        >
                            Feedback
                        </button>

                    </div>
                </div>
            </div>


            {/* Feedback Modal */}

            {isFeedbackOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[4px] z-50 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0E1A4D] rounded-[20px] p-6 w-lg max-w-[520px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/5 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-[20px] text-[#0B1957] dark:text-white leading-none">
                                    Send Feedback
                                </h3>
                                <p className="text-[13px] font-medium text-gray-600 dark:text-blue-100/40">
                                    Write feedback for <span className="text-[#0B1957] dark:text-white font-semibold">{submission.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsFeedbackOpen(false)}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Write your feedback here..."
                            className="w-full h-36 bg-[#FAF7F0] dark:bg-[#152466]/40 border-2 border-[#1E3A8A]/10 dark:border-white/10 rounded-[20px] p-5 outline-none focus:border-[#0B1957] dark:focus:border-[#C2E0FF] text-[#0B1957] dark:text-white placeholder-gray-400 transition-all resize-none font-medium text-sm"
                        />

                        <div className="grid grid-cols-2 gap-4 mt-3">
                            <button
                                onClick={() => setIsFeedbackOpen(false)}
                                className="py-3.5 bg-[#FAF7F0] hover:bg-[#F3EFE7] dark:bg-[#152466]/40 text-[#0B1957] dark:text-white rounded-xl font-bold text-sm transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendFeedback}
                                disabled={isSubmitting}
                                className="py-3.5 bg-[#0B1957] hover:bg-[#152561] dark:bg-[#C2E0FF] text-white dark:text-[#0B1957] rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SubmissionRow;