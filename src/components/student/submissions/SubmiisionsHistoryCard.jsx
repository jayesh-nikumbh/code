import { Eye, ChevronDown, ChevronUp, MessageSquare, Search } from "lucide-react";
import { useState, useEffect } from "react";
import submissionsService from "../../../api/services/submissions";

export default function SubmissionsHistoryCard({ searchQuery = "" }) {
  const [openId, setOpenId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await submissionsService.getSubmissionHistory();
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submission history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredSubmissions = submissions.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 min-h-[300px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white dark:bg-[#152561] rounded-2xl border border-gray-100 dark:border-white/10">
          <div className="w-8 h-8 border-3 border-[#4B739E] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400 font-medium animate-pulse">Loading history...</p>
        </div>
      ) : filteredSubmissions.length > 0 ? (
        filteredSubmissions.map((item) => (
          <div
            key={item.id}
            className="bg-[#F8F3EA] dark:bg-[#152561] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-sm animate-[modalEnter_0.3s_ease-out]"
          >
            {/* Main Card Header */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-[#0B1957] dark:text-white font-bold text-lg">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 dark:text-gray-400 text-sm">
                    {item.date}
                  </p>

                  {/* Status Pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.status === 'Missed' ? (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-[#FFEDE4] text-[#E65F1B] border border-[#FFD9C6]/50">
                        Missed
                      </span>
                    ) : (
                      <>
                        <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-[#9ECCFA] text-[#0B1957]">
                          Submitted
                        </span>
                        <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-gray-100 dark:bg-[#1d3270] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                          {item.type}
                        </span>
                        <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-[#0a0f1d] dark:bg-black text-white">
                          Grade: {item.grade}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-3">
                  {item.status !== 'Missed' && (
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 group relative hover:scale-110 active:scale-90 transition-all duration-300">
                      <Eye className="w-5 h-5" />
                      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Preview
                      </span>
                    </button>
                  )}

                  {item.feedback && (
                    <button
                      onClick={() => setOpenId(openId === item.id ? null : item.id)}
                      className={`p-2 rounded-full transition-all ${openId === item.id
                        ? "bg-[#0B1957] text-white dark:bg-[#4B739E]"
                        : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400"
                        } hover:scale-110 active:scale-90`}
                    >
                      {openId === item.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Feedback Section */}
            {openId === item.id && item.feedback && (
              <div className="px-6 pb-6 pt-0 transform origin-top animate-[modalEnter_0.2s_ease-out_forwards]">
                <div className="mt-2 border-t border-gray-50 dark:border-white/5 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-[#4B739E]" />
                    <span className="text-sm font-bold text-[#0B1957] dark:text-white">Teacher Feedback</span>
                  </div>

                  <div className="bg-blue-50/50 dark:bg-[#1d3270]/50 rounded-2xl p-4 border border-blue-100/50 dark:border-[#4B739E]/10">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.feedback}
                    </p>
                  </div>

                  <div className="mt-4 px-1">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Grade: <span className={`${item.grade === 'A' ? 'text-green-600' : 'text-[#4B739E]'}`}>{item.grade}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-24 bg-white dark:bg-[#152561] rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center opacity-60">
          <Search className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm font-medium italic">
            {searchQuery ? `No results found for "${searchQuery}"` : "No submission history found."}
          </p>
        </div>
      )}
    </div>
  );
}
