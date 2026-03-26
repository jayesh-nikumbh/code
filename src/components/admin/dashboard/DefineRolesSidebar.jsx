import { useState, useEffect } from "react";
import { X, Search, AlertCircle, Loader2 } from "lucide-react";
import CustomToast from "../../common/CustomToast";
import adminService from "../../../api/services/admin";

import { createPortal } from "react-dom";

export default function DefineRolesSidebar({ isOpen, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [search, setSearch] = useState("");
    const [confirmData, setConfirmData] = useState(null); // { userId, role, userName }

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            fetchUsers();
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getUsersForRoles();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            CustomToast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible && !isOpen) return null;

    const handleRoleChangeRequest = (user, role) => {
        if (user.role === role) return;
        setConfirmData({ userId: user.id, role, userName: user.name });
    };

    const handleConfirmChange = async () => {
        const { userId, role, userName } = confirmData;
        setIsUpdating(true);
        try {
            await adminService.updateRole(userId, role);
            
            setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
            CustomToast.success(`Role for ${userName} updated to ${role} successfully!`);
            setConfirmData(null);
        } catch (error) {
            CustomToast.error("Failed to update role");
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    const confirmModalContent = confirmData && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <div 
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${confirmData ? "animate-overlay-in" : "animate-overlay-out opacity-0"}`} 
                onClick={() => setConfirmData(null)} 
            />

            <div className={`relative bg-white dark:bg-[#152561] w-full max-w-[480px] rounded-[24px] p-7 shadow-2xl border border-gray-100 dark:border-white/5 ${confirmData ? "animate-spring-in" : "animate-spring-out"}`}>
                <button 
                  onClick={() => setConfirmData(null)}
                  className="absolute right-4 top-4 p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>

                <h3 className="text-[20px] font-bold text-[#14245C] dark:text-white mb-2">
                    Confirm Role Change
                </h3>

                <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                    Are you sure you want to update the selected user's role to <span className="text-[#14245C] dark:text-white font-bold">{confirmData.role}</span>? The user will get all the rights of {confirmData.role}.
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => setConfirmData(null)}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-black dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirmChange}
                        disabled={isUpdating}
                        className="px-6 py-2.5 rounded-xl bg-[#0B1957] hover:bg-[#152561] text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Define Role
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div
                className={`fixed inset-0 z-60 flex ${isOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
            >
                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isOpen ? "animate-overlay-in" : "animate-overlay-out opacity-0"
                        }`}
                    onClick={onClose}
                />

                {/* Sidebar */}
                <div
                    className={`absolute right-0 top-0 h-full w-full max-w-[420px] bg-[#F5F7FA] dark:bg-[#0B1957] shadow-2xl flex flex-col ${isOpen ? "animate-sidebar-in" : "animate-sidebar-out translate-x-full"
                        }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-[#14245C] dark:text-white">
                                    Define Roles
                                </h2>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                                    Manage user permissions and access levels
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="p-6 pb-4">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/50 group-focus-within:text-[#9ECCFA] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search users by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#E1EBF5] dark:bg-[#152561] text-[#14245C] dark:text-white/50 text-base font-medium border-2 border-transparent focus:border-[#9ECCFA] focus:ring-4 focus:ring-[#9ECCFA]/10 outline-none transition-all placeholder:text-[#14245C]/40 dark:placeholder:white/20"
                            />
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
                        <div className="bg-white dark:bg-[#152561]/40 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                            {/* Table Header */}
                            <div className="grid grid-cols-[40px_1fr_120px] text-[13px] uppercase tracking-wider font-bold text-[#14245C]/60 dark:text-white/50 bg-[#E1EBF5] dark:bg-[#1B2B6E] px-4 py-3">
                                <span>#</span>
                                <span>Name</span>
                                <span className="text-right">Role</span>
                            </div>

                            <div className="divide-y divide-gray-100 dark:divide-white/5 min-h-[200px] flex flex-col">
                                {loading ? (
                                    <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3">
                                        <Loader2 className="w-8 h-8 text-[#9ECCFA] animate-spin" />
                                        <p className="text-xs text-gray-400 font-medium animate-pulse">Loading users...</p>
                                    </div>
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <div
                                            key={user.id}
                                            className="grid grid-cols-[40px_1fr_120px] items-center px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <span className="text-sm font-bold text-gray-400">{index + 1}</span>

                                            <span className="text-base font-semibold text-[#14245C] dark:text-white truncate pr-2">
                                                {user.name}
                                            </span>

                                            <div className="flex justify-end">
                                                <RowSelect
                                                    value={user.role}
                                                    options={["Student", "Teacher", "Admin"]}
                                                    onChange={(val) => handleRoleChangeRequest(user, val)}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center py-12">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                            No users found
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {confirmData && typeof window !== "undefined" && createPortal(confirmModalContent, document.body)}
        </>
    );
}

function RowSelect({ value, options, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold cursor-pointer transition-all border-2 ${isOpen
                    ? "bg-[#9ECCFA] text-[#0B1957] border-[#9ECCFA]"
                    : "bg-[#E1EBF5] dark:bg-[#1B2B6E] text-[#14245C] dark:text-gray-300 border-transparent hover:border-[#9ECCFA]/30"
                    }`}
            >
                {value}
                <svg
                    className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-[#1B2B6E] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 py-1.5 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
                        {options.map((opt) => (
                            <div
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2 text-[13px] font-bold cursor-pointer transition-colors flex items-center justify-between ${value === opt
                                    ? "text-[#0B1957] bg-[#9ECCFA] dark:text-[#9ECCFA] dark:bg-white/10"
                                    : "text-[#14245C] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                {opt}
                                {value === opt && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#0B1957] dark:bg-[#9ECCFA]" />
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}