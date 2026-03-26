import React, { useState } from 'react';
import { Plus, Upload, X, CheckCircle, ChevronLeft, MessageSquare } from 'lucide-react';
import AssignmentCard from '../../components/student/submissions/AssignmentCard';
import SubmissionRow from '../../components/admin/submissions/SubmissionRow';
import toast from 'react-hot-toast';
import adminService from '../../api/services/admin';
import CustomToast from '../../components/common/CustomToast';
import { Loader2 } from 'lucide-react';


const AdminSubmissionsPage = () => {
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch assignments on mount
  React.useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAssignments();
      setAssignments(data);
    } catch (error) {
      CustomToast.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  };

  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Fetch submissions when an assignment is selected
  React.useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment.id);
    }
  }, [selectedAssignment]);

  const fetchSubmissions = async (assignmentId) => {
    setLoadingSubmissions(true);
    try {
      const data = await adminService.getSubmissions(assignmentId);
      setSubmissions(data);
    } catch (error) {
      CustomToast.error("Failed to fetch submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleGradeSubmit = async (submissionId, gradeData) => {
    try {
      await adminService.submitGrade(submissionId, gradeData);
      CustomToast.success("Grade submitted successfully!");
      // Optionally refresh submissions or update local state
    } catch (error) {
      CustomToast.error("Failed to submit grade");
    }
  };


  // Form States
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleAddAssignment = async () => {
    let newErrors = {};
    if (!newTitle) newErrors.title = "Assignment name is required";
    if (!newDate) newErrors.date = "Deadline is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setIsSaving(true);
    try {
      const assignmentData = {
        title: newTitle,
        desc: newDesc,
        submitted: 0,
        total: 32,
        remaining: 32,
        date: new Date(newDate).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }),
      };

      const response = await adminService.saveAssignment(assignmentData);
      setAssignments([response.assignment || { ...assignmentData, id: Date.now() }, ...assignments]);

      // Reset form and close
      setNewTitle("");
      setNewDesc("");
      setNewDate("");
      setNewFile(null);
      setErrors({});
      setIsAddingAssignment(false);

      CustomToast.success("Assignment Created Successfully! 🎉");
    } catch (error) {
      CustomToast.error("Failed to create assignment");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3EA] dark:bg-[#0B1957] px-8 py-10 animate-in fade-in duration-500 font-sans">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center px-1 h-14">
          <div className="flex items-center gap-4">
            {selectedAssignment && (
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-2 transition-colors text-gray-400 hover:text-[#0B1957] dark:hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-[#0B1957] dark:text-white leading-tight">
                {selectedAssignment ? selectedAssignment.title : "Assignments"}
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-blue-100/60">
                {selectedAssignment ? selectedAssignment.desc : "Manage and track student assignments"}
              </p>
            </div>
          </div>

          {!selectedAssignment && (
            <button
              onClick={() => {
                setIsAddingAssignment(!isAddingAssignment);
                setErrors({});
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${isAddingAssignment
                ? "bg-[#0B1957] text-white dark:text-[#0B1957] hover:bg-[#152466] dark:bg-[#C2E0FF]"
                : "bg-[#0B1957] dark:bg-[#C2E0FF] text-white dark:text-[#0B1957] hover:opacity-90"
                }`}
            >
              {isAddingAssignment ? 'Cancel' : (
                <>
                  <Plus size={18} /> Add Assignment
                </>
              )}
            </button>
          )}
        </div>

        {/* Create Assignment Form */}
        {isAddingAssignment && (
          <div className="bg-white dark:bg-[#0E1A4D] rounded-3xl border border-gray-100 dark:border-white/5 p-10 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] animate-in slide-in-from-top-4 duration-300">
            <h2 className="text-blue-900 dark:text-white font-bold text-lg mb-8">
              Create New Assignment
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {/* Assignment Name */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-blue-900 dark:text-blue-100/90 block">
                      Assignment Name <span className="text-red-500">*</span>
                    </label>
                    {errors.title && <span className="text-xs font-bold text-red-500 animate-pulse">Required *</span>}
                  </div>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (errors.title) setErrors({ ...errors, title: "" });
                    }}
                    placeholder="Enter assignment name"
                    className={`w-full px-5 py-4 bg-[#F3EFE7] dark:bg-[#152466]/30 border rounded-xl text-[#0B1957] dark:text-white placeholder-gray-400 dark:placeholder-white/10 outline-none transition-all ${errors.title ? 'border-red-500 ring-2 ring-red-500/10' : 'border-transparent dark:border-white/5 focus:ring-2 focus:ring-[#0B1957]/10'}`}
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-blue-900 dark:text-blue-100/90 block">
                      Description <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                    </label>
                  </div>
                  <textarea
                    rows={4}
                    value={newDesc}
                    onChange={(e) => {
                      setNewDesc(e.target.value);
                      if (errors.desc) setErrors({ ...errors, desc: "" });
                    }}
                    placeholder="Enter assignment description"
                    className={`w-full px-5 py-4 bg-[#F3EFE7] dark:bg-[#152466]/30 border rounded-xl text-[#0B1957] dark:text-white placeholder-gray-400 dark:placeholder-white/10 outline-none transition-all resize-none ${errors.desc ? 'border-red-500 ring-2 ring-red-500/10' : 'border-transparent dark:border-white/5 focus:ring-2 focus:ring-[#0B1957]/10'}`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Deadline */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-blue-900 dark:text-blue-100/90 block">
                        Deadline <span className="text-red-500">*</span>
                      </label>
                      {errors.date && <span className="text-xs font-bold text-red-500 animate-pulse">Required *</span>}
                    </div>
                    <input
                      type="date"
                      value={newDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setNewDate(e.target.value);
                        if (errors.date) setErrors({ ...errors, date: "" });
                      }}
                      className={`w-full px-5 py-4 bg-[#F3EFE7] dark:bg-[#152466]/30 border rounded-xl text-[#0B1957] dark:text-white outline-none transition-all ${errors.date ? 'border-red-500 ring-2 ring-red-500/10' : 'border-transparent dark:border-white/5 focus:ring-2 focus:ring-[#0B1957]/10'}`}
                    />
                  </div>

                  {/* Attach Files */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-blue-900 dark:text-blue-100/90 block">
                      Attach Files <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <input
                      type="file"
                      id="teacher-file-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setNewFile(e.target.files[0]);
                        }
                      }}
                    />
                    {!newFile ? (
                      <button 
                        onClick={() => document.getElementById('teacher-file-upload').click()}
                        className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-[#F3EFE7] dark:bg-transparent border border-transparent dark:border-white/10 rounded-xl text-gray-600 dark:text-blue-100/70 transition-colors hover:bg-[#EDE9E0] dark:hover:bg-white/5"
                      >
                        <Upload size={18} />
                        <span className="text-sm font-medium">Choose Files</span>
                      </button>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex items-center justify-between px-4 py-3 bg-[#F3EFE7] dark:bg-[#152466]/40 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-[13px] font-bold text-[#14245C] dark:text-white truncate max-w-[200px]">
                            {newFile.name}
                          </span>
                        </div>
                        <button
                          onClick={() => setNewFile(null)}
                          className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-[#0E1A4D] rounded-full p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsAddingAssignment(false);
                    setNewFile(null);
                    setErrors({});
                  }}
                  className="px-8 py-2.5 bg-[#F3EFE7] dark:bg-[#152466]/30 border border-transparent dark:border-white/10 text-[#0B1957] dark:text-white rounded-xl font-bold text-sm hover:opacity-80 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAssignment}
                  disabled={isSaving}
                  className="px-8 py-2.5 bg-[#0B1957] dark:bg-[#C2E0FF] text-white dark:text-[#0B1957] rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  {isSaving ? 'Creating...' : 'Add Assignment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Card / Submissions View */}
        <div className="bg-white dark:bg-[#0E1A4D] rounded-3xl border border-gray-100 dark:border-white/5 p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
          {selectedAssignment ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              {/* Submission List Table Header */}
              <div className="px-2">
                <h3 className="text-lg font-bold text-[#0B1957] dark:text-white mb-1">
                  Submission List
                </h3>
                <p className="text-sm text-gray-500 dark:text-blue-100/60">
                  Sorted by submission time (earliest first)
                </p>
              </div>

              {/* Submission Items */}
              <div className="space-y-3">
                {loadingSubmissions ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#0B1957] dark:text-[#C2E0FF] animate-spin mb-4" />
                    <p className="text-sm text-gray-500 dark:text-blue-100/40">Loading submissions...</p>
                  </div>
                ) : submissions.length > 0 ? (
                  submissions.map((sub, index) => (
                    <SubmissionRow 
                      key={sub.id} 
                      submission={sub} 
                      index={index} 
                      onGrade={handleGradeSubmit}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-gray-50 dark:bg-white/1 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                    <p className="text-gray-500 dark:text-blue-100/30 font-medium">No submissions yet for this assignment.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Inner Title */}
              <h2 className="text-base font-bold text-[#0B1957] dark:text-white px-1">
                All Assignments
              </h2>

              {/* Assignments List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-[#0B1957] dark:text-[#C2E0FF] animate-spin mb-4" />
                    <p className="text-gray-500 dark:text-blue-100/60 font-medium">Loading assignments...</p>
                  </div>
                ) : assignments.length > 0 ? (
                  assignments.map((item) => (
                    <AssignmentCard
                      key={item.id}
                      assignment={item}
                      onClick={setSelectedAssignment}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-gray-50 dark:bg-white/1 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                    <p className="text-gray-500 dark:text-blue-100/30 font-medium">No assignments found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissionsPage;