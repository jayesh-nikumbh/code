import { X, Loader2 } from "lucide-react";
import CustomToast from "../../common/CustomToast";
import adminService from "../../../api/services/admin";
import { useState, useEffect } from "react";

export default function AddUserSidebar({ isOpen, onClose }) {

    const [isVisible, setIsVisible] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        mobile: "",
        course: "",
        role: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        // All fields mandatory check
        const { name, username, email, mobile, course, role } = formData;

        if (!name.trim() || !username.trim() || !email.trim() || !role) {
            CustomToast.error("Name, Username, Email and Role are mandatory!");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            CustomToast.error("Please enter a valid email address!");
            return;
        }

        // Mobile validation (if provided)
        if (mobile && mobile.trim() !== "") {
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(mobile)) {
                CustomToast.error("Please enter a valid 10-digit mobile number!");
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await adminService.addUser(formData);
            
            // Success Notification
            CustomToast.success(`${name} added successfully! ✨`);

            // Reset Form
            setFormData({
                name: "",
                username: "",
                email: "",
                mobile: "",
                course: "",
                role: ""
            });

            onClose();
        } catch (error) {
            CustomToast.error(error || "Failed to add user");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-60 flex ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>

            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isOpen ? "animate-overlay-in" : "animate-overlay-out opacity-0"}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-[420px] bg-[#F5F7FA] dark:bg-[#0B1957] shadow-2xl flex flex-col ${isOpen ? "animate-sidebar-in" : "animate-sidebar-out translate-x-full"}`}
            >

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
                    <h2 className="text-xl font-bold text-[#14245C] dark:text-white">
                        Add Users
                    </h2>

                    <button onClick={onClose}>
                        <X className="w-6 h-6 text-gray-500 hover:text-black dark:hover:text-white" />
                    </button>
                </div>

                {/* Form & Actions */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-hide">
                    <Input label={<>Full Name <span className="text-red-500 font-bold">*</span></>} name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} />
                    <Input label={<>Username <span className="text-red-500 font-bold">*</span></>} name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} />
                    <Input label={<>Email Address <span className="text-red-500 font-bold">*</span></>} name="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} />
                    <Input label={<>Mobile Number <span className="text-gray-400 font-normal ml-1">(Optional)</span></>} name="mobile" placeholder="Enter mobile number" value={formData.mobile} onChange={handleChange} />

                    {/* Course */}
                    <CustomSelect
                        label={<>Course <span className="text-gray-400 font-normal ml-1">(Optional)</span></>}
                        value={formData.course}
                        placeholder="Select course"
                        options={["SYBSC CS", "SYBSC IT", "TYBSC CS", "TYBSC IT", "SYBCA", "TYBCA", "MSC 1st yr", "MSC 2nd yr"]}
                        onChange={(val) => setFormData({ ...formData, course: val })}
                    />

                    {/* Role */}
                    <CustomSelect
                        label={<>Role <span className="text-red-500 font-bold">*</span></>}
                        value={formData.role}
                        placeholder="Select role"
                        options={["Student", "Teacher"]}
                        onChange={(val) => setFormData({ ...formData, role: val })}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 mt-4 border-t border-gray-100 dark:border-white/5">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[#BFD0E3] hover:bg-[#B1C3D6] text-[#14245C] font-bold py-3.5 rounded-lg transition-all text-sm shadow-sm"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 bg-[#0B1957] dark:bg-[#1E347F] hover:bg-[#152561] text-white font-bold py-3.5 rounded-lg shadow-md transition-all text-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Add User"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CustomSelect({ label, value, options, onChange, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-1.5 relative">
            <label className="text-[13px] font-semibold text-[#14245C] dark:text-gray-200 ml-1">
                {label}
            </label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 rounded-lg bg-[#E1EBF5] dark:bg-[#152561] text-[#14245C] dark:text-white text-sm font-medium border-2 transition-all cursor-pointer flex justify-between items-center ${isOpen ? "border-[#9ECCFA] ring-4 ring-[#9ECCFA]/10" : "border-transparent"}`}
            >
                <span className={!value ? "text-[#14245C]/40 dark:text-white/30" : ""}>
                    {value || placeholder}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-[#152561] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl py-2 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {options.map((opt) => (
                            <div
                                key={opt}
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${value === opt
                                    ? "bg-[#9ECCFA]/20 text-[#0B1957] dark:text-[#9ECCFA]"
                                    : "text-[#14245C] dark:text-gray-300 hover:bg-[#E1EBF5] dark:hover:bg-white/5"
                                    }`}
                            >
                                {opt}
                                {value === opt && (
                                    <svg className="w-4 h-4 text-[#0B1957] dark:text-[#9ECCFA]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#14245C] dark:text-gray-200 ml-1">
                {label}
            </label>
            <input
                {...props}
                className="w-full px-4 py-3 rounded-lg bg-[#E1EBF5] dark:bg-[#152561] text-[#14245C] dark:text-white placeholder:text-[#14245C]/40 dark:placeholder:white/30 outline-none text-sm font-medium border-2 border-transparent focus:border-[#9ECCFA] focus:ring-4 focus:ring-[#9ECCFA]/10 transition-all"
            />
        </div>
    );
}