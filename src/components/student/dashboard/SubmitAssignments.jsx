import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Upload, FileText } from "lucide-react";
import CustomToast from "../../common/CustomToast";
import submissionsService from "../../../api/services/submissions";

function ConfirmModal({ isOpen, onConfirm, onCancel }) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
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
  }, [isOpen]);

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isOpen ? "animate-overlay-in" : "animate-overlay-out"}`}
        onClick={onCancel}
      />
      <div className={`relative bg-white dark:bg-[#0B1957] rounded-xl shadow-2xl w-full max-w-[450px] p-6 pt-7 border border-gray-100 dark:border-white/5 ${isOpen ? "animate-spring-in" : "animate-spring-out"}`}>
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:text-gray-200 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-[20px] font-bold text-[#14245C] dark:text-white mb-3">
          Are you sure you want to submit the files?
        </h3>

        <p className="text-[15px] font-medium text-gray-500 dark:text-gray-400 mb-8">
          Changes cannot be made later.
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="py-2.5 px-6 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-black dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 px-6 rounded-lg bg-[#14245C] dark:bg-[#1E347F] text-white font-bold text-sm hover:bg-[#0f1b45] dark:hover:bg-[#243C94] transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


export default function SubmitAssignments() {
  const fileInputRef = useRef(null);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const data = await submissionsService.getPendingAssignments();
        setAssignmentsList(data);
      } catch (error) {
        console.error("Failed to fetch pending assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);
  const [assignmentFiles, setAssignmentFiles] = useState({});
  const [assignmentUrls, setAssignmentUrls] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubmitConfirmId, setShowSubmitConfirmId] = useState(null);

  const handleFileUpload = (assignmentId, file) => {
    if (!file) return;
    setAssignmentFiles((prev) => ({
      ...prev,
      [assignmentId]: {
        name: file.name,
        submitted: false,
      },
    }));
    setUploadingId(null);
  };

  const handleUrlAdd = (assignmentId, url) => {
    if (!url) return;
    setAssignmentUrls((prev) => ({
      ...prev,
      [assignmentId]: url,
    }));
  };

  const handleRemove = (assignmentId, type = "file") => {
    if (type === "file") {
      setAssignmentFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[assignmentId];
        return newFiles;
      });
    } else {
      setAssignmentUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[assignmentId];
        return newUrls;
      });
    }
  };

  const confirmSubmit = async (assignmentId) => {
    const file = assignmentFiles[assignmentId];
    const url = assignmentUrls[assignmentId];

    try {
      // Mock logic for FormData or JSON
      const payload = { file, url };
      await submissionsService.submitAssignment(assignmentId, payload);

      setAssignmentsList((prev) => prev.filter((a) => a.id !== assignmentId));
      setAssignmentFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[assignmentId];
        return newFiles;
      });
      setAssignmentUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[assignmentId];
        return newUrls;
      });
      setShowSubmitConfirmId(null);
      CustomToast.success("Assignment submitted successfully 🎉");
    } catch (error) {
      CustomToast.error("Failed to submit assignment. Please try again.");
    }
  };

  const filteredAssignments = assignmentsList.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lock body scroll when modal is open


  return (
    <div className="bg-white dark:bg-[#152561] rounded-[24px] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          handleFileUpload(uploadingId, e.target.files[0]);
          e.target.value = "";
        }}
      />

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[22px] font-bold text-[#14245C] dark:text-white">
          Submit Assignments
        </h2>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-gray-50/50 dark:bg-[#0B1957] border border-gray-100 dark:border-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A9C4FF]/30 transition-all dark:text-white"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const file = assignmentFiles[assignment.id];
          const url = assignmentUrls[assignment.id];
          const isAnythingAttached = !!file || !!url;

          return (
            <div
              key={assignment.id}
              className="p-6 bg-[#F8F3EA] dark:bg-[#111e4f] rounded-[24px] border border-gray-100 dark:border-white/5 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[17px] font-bold text-[#14245C] dark:text-white">
                      {assignment.title}
                    </h3>
                    {!file && (
                      <button
                        onClick={() => {
                          setUploadingId(assignment.id);
                          fileInputRef.current.click();
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                      >
                        <Upload className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[12px] font-medium text-gray-400 dark:text-gray-400 mb-4">
                    Due: {assignment.dueDate}
                  </p>

                  <div className="space-y-3">
                    {file && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0B1957] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-[#14245C] dark:text-white truncate max-w-[200px]">
                              {file.name}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[9px] font-bold rounded-full uppercase tracking-wider">
                              Draft
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(assignment.id, "file")}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="relative group/url">
                      <input
                        type="text"
                        placeholder="Attach URL"
                        value={url || ""}
                        onChange={(e) => handleUrlAdd(assignment.id, e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-[#0B1957] rounded-xl border border-gray-100 dark:border-white/5 text-[13px] text-center font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                      />
                      {url && (
                        <button
                          onClick={() => handleRemove(assignment.id, "url")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isAnythingAttached && (
                    <button
                      onClick={() => setShowSubmitConfirmId(assignment.id)}
                      className="mt-5 px-6 py-2 bg-[#0B1957] dark:bg-[#1E347F] text-white rounded-xl font-bold text-[14px] hover:bg-[#152561] dark:hover:bg-[#243C94] transition-all shadow-md active:scale-95"
                    >
                      Submitl
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 font-medium">No assignments found</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!showSubmitConfirmId}
        onConfirm={() => confirmSubmit(showSubmitConfirmId)}
        onCancel={() => setShowSubmitConfirmId(null)}
      />
    </div>
  );
}