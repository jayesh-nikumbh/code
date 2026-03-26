import { useNavigate } from "react-router-dom";
import { X, Pencil, LogOut, Check, Eye, EyeOff, User } from "lucide-react";
import CustomToast from "../common/CustomToast";
import profileService from "../../api/services/profile";
import { useState, useEffect } from "react";

export default function ProfileSidebar({
    isOpen,
    onClose,
    user,
    setUser
}) {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    
    // Modal Animation States
    const [logoutActive, setLogoutActive] = useState(false);
    const [logoutAnimate, setLogoutAnimate] = useState(false);
    const [passwordActive, setPasswordActive] = useState(false);
    const [passwordAnimate, setPasswordAnimate] = useState(false);

    // Logout Modal Animation Effect
    useEffect(() => {
        if (showLogoutModal) {
            setLogoutActive(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setLogoutAnimate(true));
            });
        } else if (logoutActive) {
            setLogoutAnimate(false);
            const timer = setTimeout(() => setLogoutActive(false), 400);
            return () => clearTimeout(timer);
        }
    }, [showLogoutModal]);

    // Change Password Modal Animation Effect
    useEffect(() => {
        if (showChangePassword) {
            setPasswordActive(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setPasswordAnimate(true));
            });
        } else if (passwordActive) {
            setPasswordAnimate(false);
            const timer = setTimeout(() => setPasswordActive(false), 400);
            return () => clearTimeout(timer);
        }
    }, [showChangePassword]);
    const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
    const [editValues, setEditValues] = useState({
        name: "",
        email: "",
        mobile: "",
        course: ""
    });

    useEffect(() => {
        if (isOpen && user) {
            setEditValues({
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile || "9788358754",
                course: user.course || "TY BSc CS"
            });
        }
    }, [isOpen, user]);

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    const handleEditClick = () => {
        setEditValues({
            name: user?.name || "",
            email: user?.email || "",
            mobile: user?.mobile || "9788358754",
            course: user?.course || "TY BSc CS"
        });
        setIsEditing(true);
    };

    const handleDiscard = () => {
        setIsEditing(false);
    };

    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleSave = async () => {
        const nameTrimmed = editValues.name.trim();
        const emailTrimmed = editValues.email.trim();
        const mobileTrimmed = editValues.mobile.trim();

        // 1. Basic validation - empty fields
        if (!nameTrimmed) {
            CustomToast.error("Name cannot be empty");
            return;
        }

        // 2. Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
            CustomToast.error("Please enter a valid email address");
            return;
        }

        // 3. Mobile validation (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobileTrimmed)) {
            CustomToast.error("Please enter a valid 10-digit mobile number");
            return;
        }

        // Check if any values have actually changed
        const hasChanges = 
            nameTrimmed !== (user?.name || "") ||
            emailTrimmed !== (user?.email || "") ||
            mobileTrimmed !== (user?.mobile || "9788358754");

        if (!hasChanges) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            const updatedUser = { 
                ...user, 
                name: nameTrimmed,
                mobile: mobileTrimmed
            };
            await profileService.updateProfile(updatedUser);

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setIsEditing(false);
            CustomToast.success("Profile updated successfully!");
        } catch (error) {
            CustomToast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        const currentTrimmed = passwords.current.trim();
        const newTrimmed = passwords.new.trim();
        const confirmTrimmed = passwords.confirm.trim();

        if (!currentTrimmed || !newTrimmed || !confirmTrimmed) {
            CustomToast.error("Please fill in all fields");
            return;
        }

        if (newTrimmed !== confirmTrimmed) {
            CustomToast.error("New passwords do not match");
            return;
        }

        if (newTrimmed.length < 6) {
            CustomToast.error("New password must be at least 6 characters long");
            return;
        }

        setIsChangingPassword(true);
        try {
            await profileService.changePassword(currentTrimmed, newTrimmed, user);

            // Logic to update password TEMPORARILY for the current session inline
            const updatedUser = { ...user, password: newTrimmed };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            CustomToast.success("Password updated successfully! 🎉");
            setShowChangePassword(false);
            setPasswords({ current: "", new: "", confirm: "" });
            setIsCurrentPasswordVerified(false);
        } catch (error) {
            CustomToast.error(error.message || "Failed to update password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleCurrentPasswordChange = async (val) => {
        setPasswords(prev => ({ ...prev, current: val }));
        
        if (val.trim() === "") {
            setIsCurrentPasswordVerified(false);
            return;
        }

        try {
            const { isValid } = await profileService.verifyCurrentPassword(val.trim(), user);
            setIsCurrentPasswordVerified(isValid);
        } catch (error) {
            setIsCurrentPasswordVerified(false);
        }
    };

    const [isVisible, setIsVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimateIn(true));
            });
        } else {
            setAnimateIn(false);
            const timer = setTimeout(() => setIsVisible(false), 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-60 flex overflow-hidden ${animateIn ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${animateIn ? "animate-overlay-in" : "animate-overlay-out opacity-0"}`}
            />

            {/* Sidebar */}
            <div
                className={`absolute right-0 top-0 w-full max-w-[400px] h-full bg-[#F5F7FA] dark:bg-[#0B1957] shadow-2xl flex flex-col ${animateIn ? "animate-sidebar-in" : "animate-sidebar-out translate-x-full"}`}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between ">
                    <h2 className="text-2xl font-bold text-[#14245C] dark:text-white">
                        Profile
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 hide-scrollbar">
                    {/* Avatar Section */}
                    <div
                        style={{
                            opacity: animateIn ? 1 : 0,
                            transform: animateIn ? "translateY(0)" : "translateY(16px)",
                            transition: "opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s",
                        }}
                        className="flex flex-col items-center py-8"
                    >
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full bg-[#D1E8FF] dark:bg-[#1E347F]/40 flex items-center justify-center border-4 border-white dark:border-[#1E347F] shadow-lg">
                                <User className="w-12 h-12 text-[#14245C] dark:text-[#9ECCFA]" />
                            </div>
                        </div>
                        <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                            @{user?.email?.split('@')[0] || "user"}
                        </p>
                    </div>

                    {/* Profile Details Card */}
                    <div
                        style={{
                            opacity: animateIn ? 1 : 0,
                            transform: animateIn ? "translateY(0)" : "translateY(16px)",
                            transition: "opacity 0.35s ease 0.18s, transform 0.35s ease 0.18s, background-color 0.5s ease, border-color 0.5s ease",
                        }}
                        className={`bg-white dark:bg-[#152561] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-500 ${isEditing ? "ring-1 ring-blue-500/20 bg-blue-50/10 dark:bg-blue-900/10" : ""}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-lg font-bold text-[#14245C] dark:text-white">
                                Profile Details
                            </h3>
                            <div className="relative">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEditClick}
                                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 hover:scale-110 active:scale-95 animate-[modalEnter_0.3s_ease-out]"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                ) : (
                                    <div className="w-10 h-10" /> 
                                )}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <ProfileField
                                label="Full Name"
                                value={isEditing ? editValues.name : (user?.name || "Aarav Purab Sharma")}
                                isEditing={isEditing}
                                onChange={(val) => setEditValues({ ...editValues, name: val })}
                                index={0}
                            />
                            <ProfileField
                                label="Email"
                                value={user?.email || "user@example.com"}
                                isEditing={false}
                                index={1}
                            />
                            <ProfileField
                                label="Mobile number"
                                value={isEditing ? editValues.mobile : (user?.mobile || "9788358754")}
                                isEditing={isEditing}
                                onChange={(val) => setEditValues({ ...editValues, mobile: val })}
                                index={2}
                            />
                            {user?.role?.toLowerCase() !== "admin" && user?.role?.toLowerCase() !== "teacher" && (
                                <div className="transition-all duration-300">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Course</p>
                                    <p className="text-[#14245C] dark:text-white font-bold text-[15px]">
                                        {user?.course || "TY BSc CS"}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div 
                            className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isEditing ? "max-h-32 opacity-100 mt-8" : "max-h-0 opacity-0 mt-0"}`}
                        >
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDiscard}
                                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-[#0B1957] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold text-sm hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 py-3 px-4 bg-[#0B1957] dark:bg-[#1E347F] text-white rounded-xl hover:bg-[#152561] dark:hover:bg-[#243C94] transition-all shadow-md font-bold text-sm disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Check size={18} />
                                    )}
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action Buttons - Fixed at bottom */}
                <div
                    style={{
                        opacity: animateIn ? 1 : 0,
                        transform: animateIn ? "translateY(0)" : "translateY(16px)",
                        transition: "opacity 0.35s ease 0.26s, transform 0.35s ease 0.26s",
                    }}
                    className="p-6 pb-10 flex gap-3"
                >
                    <button
                        onClick={() => setShowChangePassword(true)}
                        className="flex-1 py-3 px-4 rounded-[16px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#152561] text-[#0B1957] dark:text-white font-bold text-sm tracking-wide hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex-1 py-3 px-4 rounded-[16px] bg-[#0B1957] dark:bg-[#1E347F] text-white font-bold text-sm tracking-wide hover:bg-[#152561] dark:hover:bg-[#243C94] transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {logoutActive && (
                <div className={`fixed inset-0 z-80 flex items-center justify-center p-4 transition-all duration-300 ${logoutAnimate ? "pointer-events-auto" : "pointer-events-none"}`}>
                    <div
                        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${logoutAnimate ? "animate-overlay-in" : "animate-overlay-out opacity-0"}`}
                        onClick={() => setShowLogoutModal(false)}
                    />

                    <div 
                        className={`relative bg-white dark:bg-[#152561] rounded-[24px] shadow-xl border border-transparent dark:border-white/10 w-full max-w-[480px] p-8 ${logoutAnimate ? "animate-spring-in" : "animate-spring-out"}`}
                    >
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-[#0B1957] dark:text-white mb-2 ml-1">Confirm Logout</h2>
                            <p className="text-[#334155] dark:text-gray-400 font-medium ml-1">
                                Are you sure you want to logout?
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="py-2.5 px-6 rounded-xl border border-gray-200 dark:border-white/10 text-[#0B1957] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold text-sm bg-white dark:bg-transparent"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    localStorage.removeItem("user");
                                    navigate("/");
                                }}
                                className="py-2.5 px-6 bg-[#0B1957] dark:bg-[#1E347F] text-white rounded-xl hover:bg-[#152561] dark:hover:bg-[#243C94] transition-all shadow-md font-bold text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {passwordActive && (
                <div className={`fixed inset-0 z-70 flex items-center justify-center p-4 transition-all duration-300 ${passwordAnimate ? "pointer-events-auto" : "pointer-events-none"}`}>
                    {/* Darker Overlay for Modal */}
                    <div
                        onClick={() => setShowChangePassword(false)}
                        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${passwordAnimate ? "animate-overlay-in" : "animate-overlay-out opacity-0"}`}
                    />

                    {/* Modal Content */}
                    <div 
                        className={`relative w-full max-w-[600px] bg-[#F8FAFC] dark:bg-[#0B1957] rounded-[24px] shadow-2xl p-8 border border-gray-100 dark:border-white/5 ${passwordAnimate ? "animate-spring-in" : "animate-spring-out"}`}
                    >
                        <button
                            onClick={() => setShowChangePassword(false)}
                            className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-[22px] font-bold text-[#14245C] dark:text-white">
                                Change Password
                            </h3>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-3">
                                <PasswordField
                                    label="Current Password"
                                    value={passwords.current}
                                    show={showPasswords.current}
                                    onChange={handleCurrentPasswordChange}
                                    onToggleShow={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                    showStatus={true}
                                    isValid={isCurrentPasswordVerified}
                                />
                                <div className={!isCurrentPasswordVerified ? "opacity-50" : "opacity-100 transition-all duration-300"}>
                                    <PasswordField
                                        label="New Password"
                                        value={passwords.new}
                                        show={showPasswords.new}
                                        onChange={(val) => setPasswords(prev => ({ ...prev, new: val }))}
                                        onToggleShow={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                        disabled={!isCurrentPasswordVerified}
                                    />
                                </div>
                                <div className={!isCurrentPasswordVerified ? "opacity-50" : "opacity-100 transition-all duration-300"}>
                                    <PasswordField
                                        label="Confirm Password"
                                        value={passwords.confirm}
                                        show={showPasswords.confirm}
                                        onChange={(val) => setPasswords(prev => ({ ...prev, confirm: val }))}
                                        onToggleShow={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                        disabled={!isCurrentPasswordVerified}
                                        showStatus={passwords.confirm.length > 0}
                                        isValid={passwords.new === passwords.confirm && passwords.confirm.length > 0}
                                    />
                                    {passwords.confirm.length > 0 && passwords.new !== passwords.confirm && (
                                        <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">Passwords do not match</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-0">
                                <button
                                    type="button"
                                    onClick={() => setShowChangePassword(false)}
                                    className="py-3 px-8 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-[#0B1957] dark:text-gray-200 font-bold text-[15px] hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="py-3 px-8 rounded-xl bg-[#0B1957] dark:bg-[#1E347F] text-white font-bold text-[15px] hover:bg-[#152561] dark:hover:bg-[#243C94] transition-all shadow-md disabled:opacity-50"
                                >
                                    {isChangingPassword ? "Saving..." : "Change Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function PasswordField({ label, value, show, onChange, onToggleShow, disabled = false, showStatus = false, isValid = false }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 flex justify-between items-center">
                {label}
                {showStatus && value.length > 0 && (
                    <span className={`text-[10px] uppercase tracking-wider ${isValid ? "text-green-500" : "text-amber-500"}`}>
                        {isValid ? "Verified" : (label === "Current Password" ? "Incorrect" : "Mismatched")}
                    </span>
                )}
            </label>
            <div className="relative group">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={label}
                    disabled={disabled}
                    className={`w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#152561] border ${showStatus && value.length > 0 ? (isValid ? "border-green-500/50" : "border-red-500/50") : "border-gray-100 dark:border-white/5"} text-sm focus:outline-none focus:ring-2 ${isValid ? "focus:ring-green-500/20" : "focus:ring-[#A9C4FF]/50"} transition-all dark:text-white font-medium ${disabled ? "cursor-not-allowed opacity-75" : ""}`}
                    required
                />
                <button
                    type="button"
                    onClick={onToggleShow}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                    {showStatus && value.length > 0 && (
                        isValid ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />
                    )}
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}

function ProfileField({ label, value, isEditing, onChange, index }) {
    return (
        <div className="transition-all duration-500 ease-out">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</p>
            <div className="relative min-h-[38px] flex items-center">
                <div 
                    className={`w-full transition-all duration-400 absolute left-0 top-0 ${isEditing ? "opacity-0 -translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"}`}
                    style={{ transitionDelay: isEditing ? '0ms' : `${index * 40}ms` }}
                >
                    <p className="text-[#14245C] dark:text-white font-bold text-[15px]">
                        {value}
                    </p>
                </div>
                <div 
                    className={`w-full transition-all duration-500 ${isEditing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
                    style={{ transitionDelay: isEditing ? `${index * 40}ms` : '0ms' }}
                >
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0B1957] border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#A9C4FF]/30 dark:text-white font-medium shadow-sm transition-all"
                        placeholder={`Enter ${label}`}
                    />
                </div>
            </div>
        </div>
    );
}
