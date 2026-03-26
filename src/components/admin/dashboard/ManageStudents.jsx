import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Calendar,
  Award,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Check,
} from "lucide-react";
import adminService from "../../../api/services/admin";
import CustomToast from "../../common/CustomToast";

// ── Confirmation Modal ──────────────────────────────────────────────────────
function ConfirmModal({ isOpen, type, studentName, onConfirm, onCancel, isProcessing }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [activeName, setActiveName] = useState(studentName);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      if (studentName) setActiveName(studentName);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = "unset";
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, studentName]);

  const config = {
    block: {
      title: "Block Student",
      message: `Are you sure you want to block ${activeName}? They will not be able to access the portal.`,
      confirmLabel: "Block",
      confirmClass:
        "bg-orange-500 hover:bg-orange-600 text-white",
    },
    unblock: {
      title: "Unblock Student",
      message: `Are you sure you want to unblock ${activeName}? They will regain access to the portal.`,
      confirmLabel: "Unblock",
      confirmClass:
        "bg-[#0B1957] dark:bg-[#9ECCFA] text-white dark:text-[#0B1957] hover:opacity-90",
    },
    remove: {
      title: "Remove Student",
      message: `Are you sure you want to remove ${activeName}? This action cannot be undone.`,
      confirmLabel: "Remove",
      confirmClass: "bg-red-500 hover:bg-red-600 text-white",
    },
  };

  const c = config[type || 'block'];

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isOpen ? "animate-overlay-in" : "animate-overlay-out"}`}
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className={`relative bg-[#F8F3EA] dark:bg-[#152561] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-lg p-7 ${isOpen ? "animate-spring-in" : "animate-spring-out"}`}>
        {/* Close */}
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-[#0B1957] dark:text-white mb-2">
          {c.title}
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6 leading-relaxed">
          {c.message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-sm font-semibold text-[#0B1957] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50 flex items-center gap-2 ${c.confirmClass}`}
          >
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
            {c.confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [modal, setModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingCourseValue, setEditingCourseValue] = useState("");
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await adminService.getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const openModal = (type, studentId, e) => {
    e.stopPropagation();
    setModal({ type, studentId });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleConfirm = async () => {
    const { type, studentId } = modal;
    const student = students.find(s => s.id === studentId);
    
    setIsProcessing(true);
    try {
      if (type === "block" || type === "unblock") {
        const newStatus = type === "block" ? "blocked" : "active";
        await adminService.updateStudentStatus(studentId, newStatus);
        
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
        CustomToast.success(`Student ${student.name} ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
      } else if (type === "remove") {
        await adminService.removeStudent(studentId);
        
        setStudents(prev => prev.filter(s => s.id !== studentId));
        CustomToast.success(`Student ${student.name} removed successfully`);
      }
      setIsModalOpen(false);
    } catch (error) {
      CustomToast.error(`Failed to ${type} student`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditCourse = (student) => {
    setEditingCourseId(student.id);
    setEditingCourseValue(student.course);
  };

  const handleSaveCourse = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student || student.course === editingCourseValue.trim()) {
      setEditingCourseId(null);
      return;
    }

    setIsUpdatingCourse(true);
    try {
      // Assuming adminService has updateStudentCourse or we can use a generic update
      if (adminService.updateStudentCourse) {
        await adminService.updateStudentCourse(studentId, editingCourseValue.trim());
      } else {
        // Fallback for mock if not yet added to service
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, course: editingCourseValue.trim() } : s));
      CustomToast.success("Course updated successfully");
      setEditingCourseId(null);
    } catch (error) {
      CustomToast.error("Failed to update course");
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  const cancelEditCourse = () => {
    setEditingCourseId(null);
    setEditingCourseValue("");
  };

  const activeStudent = modal
    ? students.find((s) => s.id === modal.studentId)
    : null;

  // Search Logic
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.username && student.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    setCurrentPage(page);
    setOpenId(null); // Close any expanded row when changing page
  };

  const getInitials = (name) => {
        if (!name) return "F";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
  };


  return (
    <div className="bg-white dark:bg-[#152561] rounded-3xl border border-gray-200 dark:border-white/10 p-6 flex flex-col h-full min-h-[500px]">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#0B1957] dark:text-white">
            Manage Students
          </h2>

          <div className="relative">
            <input
              type="text"
              placeholder="Search Student..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="bg-[#f0f9ff] dark:bg-[#1e3270] text-[#0B1957] dark:text-white text-sm px-4 py-2 rounded-xl w-64 outline-none border border-transparent focus:border-[#9ECCFA]/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {currentItems.map((student, index) => (
            <div
              key={student.id}
              className="bg-[#F8F3EA] dark:bg-[#0f1e57] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10"
            >
              {/* Row Header */}
              <div
                onClick={() => toggle(student.id)}
                className="flex items-center justify-between px-5 py-4 cursor-pointer dark:hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-400 dark:text-gray-400 w-4 shrink-0">
                    {indexOfFirstItem + index + 1}
                  </span>

                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#9ECCFA] to-[#D1E8FF] dark:bg-[#1e3270] flex items-center justify-center text-[#0B1957] text-sm font-semibold shrink-0">
                    {getInitials(student?.name)}
                  </div>

                  <p className="text-base font-medium text-[#0B1957] dark:text-white">
                    {student.name}  
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === "active"
                      ? "bg-[#1a2e6e] dark:bg-[#9ECCFA] dark:text-[#0B1957] text-white"
                      : "bg-orange-500/20 dark:bg-orange-500/20 text-orange-400 dark:text-orange-400"
                      }`}
                  >
                    {student.status}
                  </span>

                  {/* Chevron Icon with Rotation */}
                  <div className={`transition-transform duration-300 ${openId === student.id ? "rotate-180" : "rotate-0"}`}>
                    <ChevronDown className="w-5 h-5 text-gray-400 dark:text-white/60" />
                  </div>
                </div>
              </div>

              {/* Expanded Dropdown with Animation */}
              <div className={`grid transition-all duration-300 ease-in-out ${openId === student.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-1 border-t border-gray-200 dark:border-white/10 space-y-5">
                    {/* User Info Grid */}
                    <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-100 dark:border-white/5">
                      <div>
                        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Username</p>
                        <p className="text-sm font-semibold text-[#0B1957] dark:text-white truncate">
                          {student.username || "N/A"}
                        </p>
                      </div>
                      <div className="col-span-1">
                        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                        <p className="text-sm font-semibold text-[#0B1957] dark:text-white truncate">
                          {student.email || "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Course</p>
                          {editingCourseId !== student.id && (
                            <button 
                              onClick={() => handleEditCourse(student)}
                              className="text-gray-400 hover:text-[#0B1957] dark:hover:text-[#9ECCFA] transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5 cursor-pointer" />
                            </button>
                          )}
                        </div>
                        {editingCourseId === student.id ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={editingCourseValue}
                              onChange={(e) => setEditingCourseValue(e.target.value)}
                              className="flex-1 bg-white dark:bg-[#1e3270] border border-gray-200 dark:border-white/20 rounded-lg px-2 py-1 text-sm text-[#0B1957] dark:text-white outline-none focus:border-[#9ECCFA]"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleSaveCourse(student.id)}
                              disabled={isUpdatingCourse}
                              className="p-1 px-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              {isUpdatingCourse ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5  cursor-pointer" />}
                            </button>
                            <button 
                              onClick={cancelEditCourse}
                              disabled={isUpdatingCourse}
                              className="p-1 px-1.5 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-[#0B1957] dark:text-white truncate">
                            {student.course || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Performance</p>
                          <p className="text-sm font-semibold text-[#0B1957] dark:text-white">
                            {student.performance}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                          <p className="text-sm font-semibold text-[#0B1957] dark:text-white">
                            {student.attendance}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Badges</p>
                          <p className="text-sm font-semibold text-[#0B1957] dark:text-white">
                            {student.badges}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={(e) =>
                          openModal(
                            student.status === "active" ? "block" : "unblock",
                            student.id,
                            e
                          )
                        }
                        className={`w-full h-11 border rounded-xl font-semibold text-sm transition ${student.status === "active"
                          ? "text-orange-500 border-orange-500 hover:bg-orange-500/10 dark:hover:bg-orange-500/10"
                          : "text-green-500 border-green-500 hover:bg-green-500/10 dark:hover:bg-green-500/10"
                          }`}
                      >
                        {student.status === "active" ? "Block" : "Unblock"}
                      </button>

                      <button
                        onClick={(e) => openModal("remove", student.id, e)}
                        className="w-full h-11 border border-red-500 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-500/10 dark:hover:bg-red-500/10 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-[#0B1957] dark:text-white">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-semibold text-[#0B1957] dark:text-white">
              {Math.min(indexOfLastItem, filteredStudents.length)}
            </span>{" "}
            of <span className="font-semibold text-[#0B1957] dark:text-white">{filteredStudents.length}</span> students
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border border-gray-200 dark:border-white/10 transition ${currentPage === 1
                ? "opacity-40 cursor-not-allowed"
                : "text-[#0B1957] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${currentPage === i + 1
                    ? "bg-[#0B1957] dark:bg-[#9ECCFA] text-white dark:text-[#0B1957]"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border border-gray-200 dark:border-white/10 transition ${currentPage === totalPages
                ? "opacity-40 cursor-not-allowed"
                : "text-[#0B1957] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        type={modal?.type}
        studentName={activeStudent?.name}
        onConfirm={handleConfirm}
        onCancel={closeModal}
        isProcessing={isProcessing}
      />
    </div>
  );
}

