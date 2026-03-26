import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CustomToast from "../../common/CustomToast";
import { X, AlertCircle, Loader2 } from "lucide-react";
import adminService from "../../../api/services/admin";

export default function LowAttendanceStudents() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalStudent, setModalStudent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      setModalStudent(selectedStudent);
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setModalStudent(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedStudent]);

  useEffect(() => {
    const fetchLowAttendance = async () => {
      try {
        const data = await adminService.getLowAttendanceStudents();
        setList(data);
      } catch (error) {
        console.error("Failed to fetch low attendance students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLowAttendance();
  }, []);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await adminService.sendAttendanceWarning(modalStudent.id);
      CustomToast.success(`Warning sent to ${modalStudent.name} successfully! ✉️`);
      setSelectedStudent(null);
    } catch (error) {
      CustomToast.error("Failed to send warning");
    } finally {
      setIsProcessing(false);
    }
  };

  const modalContent = modalStudent && (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop - blocks all other interactions */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300 ${selectedStudent ? "animate-overlay-in" : "animate-overlay-out opacity-0"}`}
        onClick={() => !isProcessing && setSelectedStudent(null)}
      />

      {/* Modal - Centered with animation */}
      <div className={`relative bg-white dark:bg-[#1B2B6E] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-white/10 ${selectedStudent ? "animate-spring-in" : "animate-spring-out"}`}>
        
        {/* Close Button */}
        <button 
          onClick={() => setSelectedStudent(null)}
          disabled={isProcessing}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <h3 className="text-2xl font-bold text-[#0B1957] dark:text-white mb-3">
            Send Warning?
          </h3>

          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            This will send an importance attendance warning notification to <span className="text-[#0B1957] dark:text-white font-bold">{modalStudent.name}</span>. This action is tracked in records.
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={() => setSelectedStudent(null)}
              disabled={isProcessing}
              className="flex-1 py-3.5 rounded-2xl border-2 border-gray-100 dark:border-white/10 text-[#0B1957] dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Warning"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#152561] rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-sm">

      <h3 className="text-lg font-bold text-red-600 mb-6 px-1 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Students Below 75% Attendance
      </h3>

      <div className="space-y-3">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="w-8 h-8 text-[#9ECCFA] animate-spin" />
                <p className="text-xs text-gray-400 font-medium">Loading list...</p>
            </div>
        ) : list.length > 0 ? (
            list.map((student) => (
                <div
                    key={student.id}
                    className="flex items-center justify-between p-4 px-6 rounded-[24px] border border-red-100/50 dark:border-white/5 bg-[#FFF9F9] dark:bg-white/2 hover:shadow-md transition-all duration-300 group"
                >

                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#93C5FD] to-[#60A5FA] flex items-center justify-center text-[#1E3A8A] font-bold shadow-sm transition-transform group-hover:scale-110">
                        {student.initials || "S"}
                    </div>

                    <div>
                        <p className="font-bold text-[#0B1957] dark:text-white text-base">
                        {student.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <p className="text-red-500 text-[13px] font-bold uppercase tracking-wide">
                                {student.attendance}% Attendance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Open Modal */}
                <button
                onClick={() => setSelectedStudent(student)}
                className="px-6 py-2.5 rounded-xl border-2 border-red-500/20 text-red-600 dark:text-red-400 bg-white dark:bg-transparent hover:bg-red-500 hover:text-white dark:hover:bg-red-500/10 font-bold text-[13px] transition-all duration-300 shadow-sm"
                >
                Send Warning
                </button>

            </div>
            ))
        ) : (
            <div className="text-center py-10">
                <p className="text-sm text-gray-500 dark:text-gray-400">No students with low attendance.</p>
            </div>
        )}
      </div>

      {/* Portal for Modal */}
      {isVisible && createPortal(modalContent, document.body)}
    </div>
  );
}
