import { useNavigate } from "react-router-dom";
import { X, Pencil, LogOut, Check, Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";
import CustomToast from "../common/CustomToast";
import profileService from "../../api/services/profile";
import { useState, useEffect, useCallback } from "react";

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
    const [isSaving, setIsSaving] = useState(false);
    const [editValues, setEditValues] = useState({
        name: "",
        email: "",
        mobile: "",
        course: ""
    });

    const [isVisible, setIsVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            const timer = requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimateIn(true));
            });
            return () => cancelAnimationFrame(timer);
        }
        setAnimateIn(false);
        const timer = setTimeout(() => setIsVisible(false), 400);
        return () => clearTimeout(timer);
    }, [isOpen]);

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

    const handleEditClick = () => {
        setEditValues({
            name: user?.name || "",
            email: user?.email || "",
            mobile: user?.mobile || "9788358754",
            course: user?.course || "TY BSc CS"
        });
        setIsEditing(true);
    };

    const validateProfile = (name, email, mobile) => {
        if (!name) return "Name cannot be empty";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) return "Please enter a valid 10-digit mobile number";
        return null;
    };

    const handleSave = async () => {
        const nameTrimmed = editValues.name.trim();
        const emailTrimmed = editValues.email.trim();
        const mobileTrimmed = editValues.mobile.trim();

        const error = validateProfile(nameTrimmed, emailTrimmed, mobileTrimmed);
        if (error) {
            CustomToast.error(error);
            return;
        }

        const hasChanges = nameTrimmed !== (user?.name || "") || 
                           mobileTrimmed !== (user?.mobile || "9788358754");

        if (!hasChanges) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            const updatedUser = { ...user, name: nameTrimmed, mobile: mobileTrimmed };
            await profileService.updateProfile(updatedUser);
            setUser(updatedUser);
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
            setIsEditing(false);
            CustomToast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Profile update error:", err);
            CustomToast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = useCallback(() => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        navigate("/");
    }, [navigate]);

    const handleKeyDown = (e, callback) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            callback();
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-60 flex overflow-hidden ${animateIn ? "pointer-events-auto" : "pointer-events-none"}`}>
            <button
                onClick={onClose}
                onKeyDown={(e) => handleKeyDown(e, onClose)}
                aria-label="Close sidebar"
                className={`absolute inset-0 w-full h-full bg-black/40 backdrop-blur-sm transition-all duration-300 ${animateIn ? "animate-overlay-in" : "animate-overlay-out opacity-0"} border-none cursor-default focus:outline-none`}
            />

            <div className={`absolute right-0 top-0 w-full max-w-[400px] h-full bg-[#F5F7FA] dark:bg-[#0B1957] shadow-2xl flex flex-col ${animateIn ? "animate-sidebar-in" : "animate-sidebar-out translate-x-full"}`}>
                <div className="p-6 flex items-center justify-between ">
                    <h2 className="text-2xl font-bold text-[#14245C] dark:text-white">Profile</h2>
                    <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 hide-scrollbar">
                    <AvatarSection user={user} animateIn={animateIn} />

                    <div
                        style={{
                            opacity: animateIn ? 1 : 0,
                            transform: animateIn ? "translateY(0)" : "translateY(16px)",
                            transition: "opacity 0.35s ease 0.18s, transform 0.35s ease 0.18s, background-color 0.5s ease, border-color 0.5s ease",
                        }}
                        className={`bg-white dark:bg-[#152561] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-500 ${isEditing ? "ring-1 ring-blue-500/20 bg-blue-50/10 dark:bg-blue-900/10" : ""}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-lg font-bold text-[#14245C] dark:text-white">Profile Details</h3>
                            {!isEditing && (
                                <button onClick={handleEditClick} className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 hover:scale-110 active:scale-95">
                                    <Pencil size={18} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-5">
                            <ProfileField
                                label="Full Name"
                                value={isEditing ? editValues.name : (user?.name || "")}
                                isEditing={isEditing}
                                onChange={(val) => setEditValues({ ...editValues, name: val })}
                                index={0}
                            />
                            <ProfileField label="Email" value={user?.email || ""} isEditing={false} index={1} />
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
                                    <p className="text-[#14245C] dark:text-white font-bold text-[15px]">{user?.course || "TY BSc CS"}</p>
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex gap-3 mt-8 animate-[modalEnter_0.3s_ease-out]">
                                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-[#0B1957] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold text-sm">
                                    Discard
                                </button>
                                <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 px-4 bg-[#0B1957] dark:bg-[#1E347F] text-white rounded-xl hover:bg-[#152561] dark:hover:bg-[#243C94] transition-all shadow-md font-bold text-sm flex items-center justify-center gap-2">
                                    {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={18} />}
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 pb-10 flex gap-3">
                    <button onClick={() => setShowChangePassword(true)} className="flex-1 py-3 px-4 rounded-[16px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#152561] text-[#0B1957] dark:text-white font-bold text-sm tracking-wide hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm">
                        Change Password
                    </button>
                    <button onClick={() => setShowLogoutModal(true)} className="flex-1 py-3 px-4 rounded-[16px] bg-[#0B1957] dark:bg-[#1E347F] text-white font-bold text-sm tracking-wide hover:bg-[#152561] dark:hover:bg-[#243C94] transition-all shadow-lg flex items-center justify-center gap-3">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <LogoutModal
                show={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onLogout={handleLogout}
                handleKeyDown={handleKeyDown}
            />

            <ChangePasswordModal
                show={showChangePassword}
                onClose={() => setShowChangePassword(false)}
                user={user}
                setUser={setUser}
                handleKeyDown={handleKeyDown}
            />
        </div>
    );
}

ProfileSidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object,
    setUser: PropTypes.func.isRequired
};

function AvatarSection({ user, animateIn }) {
    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
    };

    const getAuraClass = (role) => {
        const r = role?.toLowerCase();
        if (r === 'admin') return 'aura-admin';
        if (r === 'teacher') return 'aura-teacher';
        return 'aura-student';
    };

    const getRoleColorClass = (role) => {
        const r = role?.toLowerCase();
        if (r === 'admin') return 'bg-amber-400';
        if (r === 'teacher') return 'bg-cyan-400';
        return 'bg-blue-400';
    };

    return (
        <div
            style={{
                opacity: animateIn ? 1 : 0,
                transform: animateIn ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s",
            }}
            className="flex flex-col items-center py-8"
        >
            <div className="relative group">
                <div className={`profile-aura-container transition-all duration-500 scale-125 ${getAuraClass(user?.role)}`}>
                    <div className="aura-ring"></div>
                    {user?.role?.toLowerCase() === 'student' && <div className="aura-student-pulse"></div>}
                    <div className="relative w-28 h-28 rounded-full bg-[#D1E8FF] dark:bg-[#1E347F] flex items-center justify-center border-4 border-white dark:border-[#1E347F] shadow-lg z-10 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <span className="text-3xl font-black text-[#14245C] dark:text-[#9ECCFA] tracking-tighter">
                            {getInitials(user?.name)}
                        </span>
                        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-[#0B1957] shadow-sm ${getRoleColorClass(user?.role)}`} />
                    </div>
                </div>
            </div>
            <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                @{user?.email?.split('@')[0] || "user"}
            </p>
        </div>
    );
}

AvatarSection.propTypes = {
    user: PropTypes.object,
    animateIn: PropTypes.bool.isRequired
};

function LogoutModal({ show, onClose, onLogout, handleKeyDown }) {
    const [active, setActive] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (show) {
            setActive(true);
            const timer = requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimate(true));
            });
            return () => cancelAnimationFrame(timer);
        }
        setAnimate(false);
        const timer = setTimeout(() => setActive(false), 400);
        return () => clearTimeout(timer);
    }, [show]);

    if (!active) return null;

    return (
        <div className={`fixed inset-0 z-80 flex items-center justify-center p-4 transition-all duration-300 ${animate ? "pointer-events-auto" : "pointer-events-none"}`}>
            <button
                className={`absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm transition-all duration-300 ${animate ? "animate-overlay-in" : "animate-overlay-out opacity-0"} border-none cursor-default focus:outline-none`}
                onClick={onClose}
                onKeyDown={(e) => handleKeyDown(e, onClose)}
                aria-label="Close modal"
            />
            <div className={`relative bg-white dark:bg-[#152561] rounded-[24px] shadow-xl border border-transparent dark:border-white/10 w-full max-w-[480px] p-8 ${animate ? "animate-spring-in" : "animate-spring-out"}`}>
                <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <X size={18} />
                </button>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#0B1957] dark:text-white mb-2 ml-1">Confirm Logout</h2>
                    <p className="text-[#334155] dark:text-gray-400 font-medium ml-1">Are you sure you want to logout?</p>
                </div>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="py-2.5 px-6 rounded-xl border border-gray-200 dark:border-white/10 text-[#0B1957] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold text-sm bg-white dark:bg-transparent">
                        Cancel
                    </button>
                    <button onClick={onLogout} className="py-2.5 px-6 bg-[#0B1957] dark:bg-[#1E347F] text-white rounded-xl hover:bg-[#152561] dark:hover:bg-[#243C94] transition-all shadow-md font-bold text-sm">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

LogoutModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired
};

function ChangePasswordModal({ show, onClose, user, setUser, handleKeyDown }) {
    const [active, setActive] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

    useEffect(() => {
        if (show) {
            setActive(true);
            const timer = requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimate(true));
            });
            return () => cancelAnimationFrame(timer);
        }
        setAnimate(false);
        const timer = setTimeout(() => {
            setActive(false);
            setPasswords({ current: "", new: "", confirm: "" });
            setIsVerified(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [show]);

    const handleVerify = async (val) => {
        setPasswords(prev => ({ ...prev, current: val }));
        if (!val.trim()) {
            setIsVerified(false);
            return;
        }
        try {
            const { isValid } = await profileService.verifyCurrentPassword(val.trim(), user);
            setIsVerified(isValid);
        } catch (err) {
            console.error("Password verification error:", err);
            setIsVerified(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { current, new: newP, confirm } = passwords;
        if (!current || !newP || !confirm) return CustomToast.error("Please fill in all fields");
        if (newP !== confirm) return CustomToast.error("New passwords do not match");
        if (newP.length < 6) return CustomToast.error("New password must be at least 6 characters long");

        setIsChanging(true);
        try {
            await profileService.changePassword(current.trim(), newP.trim(), user);
            const updatedUser = { ...user, password: newP.trim() };
            setUser(updatedUser);
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
            CustomToast.success("Password updated successfully! 🎉");
            onClose();
        } catch (err) {
            CustomToast.error(err.message || "Failed to update password");
        } finally {
            setIsChanging(false);
        }
    };

    if (!active) return null;

    return (
        <div className={`fixed inset-0 z-70 flex items-center justify-center p-4 transition-all duration-300 ${animate ? "pointer-events-auto" : "pointer-events-none"}`}>
            <button
                onClick={onClose}
                onKeyDown={(e) => handleKeyDown(e, onClose)}
                aria-label="Close modal"
                className={`absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm transition-all duration-300 ${animate ? "animate-overlay-in" : "animate-overlay-out opacity-0"} border-none cursor-default focus:outline-none`}
            />
            <div className={`relative w-full max-w-[600px] bg-[#F8FAFC] dark:bg-[#0B1957] rounded-[24px] shadow-2xl p-8 border border-gray-100 dark:border-white/5 ${animate ? "animate-spring-in" : "animate-spring-out"}`}>
                <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={20} />
                </button>
                <div className="mb-6">
                    <h3 className="text-[22px] font-bold text-[#14245C] dark:text-white">Change Password</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <PasswordField
                            label="Current Password"
                            value={passwords.current}
                            show={showPass.current}
                            onChange={handleVerify}
                            onToggleShow={() => setShowPass(prev => ({ ...prev, current: !prev.current }))}
                            showStatus={true}
                            isValid={isVerified}
                        />
                        <div className={isVerified ? "opacity-100 transition-all duration-300" : "opacity-50"}>
                            <PasswordField
                                label="New Password"
                                value={passwords.new}
                                show={showPass.new}
                                onChange={(val) => setPasswords(prev => ({ ...prev, new: val }))}
                                onToggleShow={() => setShowPass(prev => ({ ...prev, new: !prev.new }))}
                                disabled={!isVerified}
                            />
                        </div>
                        <div className={isVerified ? "opacity-100 transition-all duration-300" : "opacity-50"}>
                            <PasswordField
                                label="Confirm Password"
                                value={passwords.confirm}
                                show={showPass.confirm}
                                onChange={(val) => setPasswords(prev => ({ ...prev, confirm: val }))}
                                onToggleShow={() => setShowPass(prev => ({ ...prev, confirm: !prev.confirm }))}
                                disabled={!isVerified}
                                showStatus={passwords.confirm.length > 0}
                                isValid={passwords.new === passwords.confirm && passwords.confirm.length > 0}
                            />
                            {passwords.confirm.length > 0 && passwords.new !== passwords.confirm && (
                                <p className="text-[11px] text-red-500 font-bold ml-1 mt-1">Passwords do not match</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-0">
                        <button type="button" onClick={onClose} className="py-3 px-8 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent text-[#0B1957] dark:text-gray-200 font-bold text-[15px]">
                            Cancel
                        </button>
                        <button type="submit" disabled={isChanging} className="py-3 px-8 rounded-xl bg-[#0B1957] dark:bg-[#1E347F] text-white font-bold text-[15px] shadow-md disabled:opacity-50">
                            {isChanging ? "Saving..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

ChangePasswordModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object,
    setUser: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired
};

function PasswordField({ label, value, show, onChange, onToggleShow, disabled = false, showStatus = false, isValid = false }) {
    const getStatusLabel = () => {
        if (!showStatus || value.length === 0) return "";
        if (isValid) return "Verified";
        return label === "Current Password" ? "Incorrect" : "Mismatched";
    };

    const getBorderClass = () => {
        if (showStatus && value.length > 0) {
            return isValid ? "border-green-500/50" : "border-red-500/50";
        }
        return "border-gray-100 dark:border-white/5";
    };

    const getRingClass = () => {
        return isValid ? "focus:ring-green-500/20" : "focus:ring-[#A9C4FF]/50";
    };

    const statusLabel = getStatusLabel();

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 flex justify-between items-center">
                {label}
                {statusLabel && (
                    <span className={`text-[10px] uppercase tracking-wider ${isValid ? "text-green-500" : "text-amber-500"}`}>
                        {statusLabel}
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
                    className={`w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#152561] border ${getBorderClass()} text-sm focus:outline-none focus:ring-2 ${getRingClass()} transition-all dark:text-white font-medium ${disabled ? "cursor-not-allowed opacity-75" : ""}`}
                    required
                />
                <button type="button" onClick={onToggleShow} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors flex items-center gap-2">
                    {showStatus && value.length > 0 && (isValid ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-red-500" />)}
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        </div>
    );
}

PasswordField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onToggleShow: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    showStatus: PropTypes.bool,
    isValid: PropTypes.bool
};

function ProfileField({ label, value, isEditing, onChange, index }) {
    return (
        <div className="transition-all duration-500 ease-out">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</p>
            <div className="relative min-h-[38px] flex items-center">
                <div className={`w-full transition-all duration-400 absolute left-0 top-0 ${isEditing ? "opacity-0 -translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"}`} style={{ transitionDelay: isEditing ? '0ms' : `${index * 40}ms` }}>
                    <p className="text-[#14245C] dark:text-white font-bold text-[15px]">{value}</p>
                </div>
                <div className={`w-full transition-all duration-500 ${isEditing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`} style={{ transitionDelay: isEditing ? `${index * 40}ms` : '0ms' }}>
                    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0B1957] border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#A9C4FF]/30 dark:text-white font-medium shadow-sm transition-all" placeholder={`Enter ${label}`} />
                </div>
            </div>
        </div>
    );
}

ProfileField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    index: PropTypes.number.isRequired
};
