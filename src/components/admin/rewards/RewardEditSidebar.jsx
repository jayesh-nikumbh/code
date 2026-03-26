import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import CustomToast from "../../common/CustomToast";
import { createPortal } from "react-dom";

export default function RewardEditSidebar({ isOpen, onClose, reward, onSave, isSaving }) {
    const fileInputRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        points: "",
        image: "",
        description: ""
    });

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
            if (reward) {
                setFormData({
                    title: reward.title || "",
                    points: reward.points || "",
                    image: reward.image || "",
                    description: reward.description || ""
                });
            } else {
                setFormData({ title: "", points: "", image: "", description: "" });
            }
        } else {
            document.body.style.overflow = "unset";
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen, reward]);

    if (!isVisible && !isOpen) return null;

    const handleFileClick = () => {
        if (isSaving) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        if (isSaving) return;
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        if (!formData.title.trim() || !formData.points || !formData.image) {
            CustomToast.error("Name, points, and image are mandatory!");
            return;
        }

        onSave({ ...reward, ...formData });
        // Parent handles toast and onClose
    };

    const modalContent = (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isOpen ? "animate-overlay-in" : "animate-overlay-out opacity-0"}`}
                onClick={() => !isSaving && onClose()}
            />

            {/* Modal Card */}
            <div
                className={`relative bg-white dark:bg-[#152561] w-full max-w-[480px] rounded-[24px] overflow-hidden shadow-2xl p-7 ${isOpen ? "animate-spring-in" : "animate-spring-out"}`}
            >
                {/* Close Icon */}
                <button 
                  onClick={onClose} 
                  disabled={isSaving}
                  className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-50"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#14245C] dark:text-white mb-1.5 focus:outline-none">
                        {reward?.id ? "Edit Reward" : "Add New Reward"}
                    </h2>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        Create a new reward for students to redeem with their points.
                    </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    <ModalInput label={<>Reward Name <span className="text-red-500">*</span></>} name="title" value={formData.title} placeholder="Enter reward name" onChange={handleChange} disabled={isSaving} />
                    <ModalInput label={<>Reward Points <span className="text-red-500">*</span></>} name="points" type="number" value={formData.points} placeholder="Enter points required" onChange={handleChange} disabled={isSaving} />
                    
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[#14245C] dark:text-gray-200 ml-1">Description <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                        <textarea
                            name="description"
                            rows="2"
                            value={formData.description}
                            placeholder="Enter reward description"
                            onChange={handleChange}
                            disabled={isSaving}
                            className={`w-full px-4 py-3.5 rounded-2xl bg-[#F8F3EA] dark:bg-white/5 text-[#14245C] dark:text-white placeholder:text-gray-400 outline-none text-[14px] font-medium border-none shadow-xs transition-all resize-none ${isSaving ? 'opacity-50' : ''}`}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-[#14245C] dark:text-gray-200 ml-1">Upload Reward Image <span className="text-red-500">*</span></label>
                        <div className={`flex items-center justify-center w-full px-4 py-3.5 rounded-2xl bg-[#F8F3EA] dark:bg-white/5 border-none cursor-pointer group hover:bg-[#F2EADA] transition-colors relative shadow-xs ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input 
                                type="text" 
                                name="image" 
                                value={formData.image} 
                                onChange={handleChange} 
                                disabled={isSaving}
                                placeholder="Paste image URL here..."
                                className="w-full bg-transparent border-none outline-none text-[13px] text-[#14245C] dark:text-white"
                            />
                            
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            <div 
                                onClick={handleFileClick}
                                className={`flex items-center gap-2 absolute right-4 transition-opacity ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80'}`}
                            >
                                <Upload className="w-4 h-4 text-[#14245C] dark:text-white" />
                                <span className="text-[13px] font-bold text-[#14245C] dark:text-white uppercase tracking-tight">Choose Image</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium ml-1">Please upload an image or provide a URL for the reward.</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 bg-[#F8F3EA] hover:bg-[#F2EADA] text-[#14245C] font-bold py-3.5 rounded-2xl transition-all text-sm cursor-pointer border-none disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 bg-[#0B1957] hover:bg-[#152561] text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all text-sm cursor-pointer border-none disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {reward?.id ? "Save Changes" : "Add Reward"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return typeof window !== "undefined" ? createPortal(modalContent, document.body) : null;
}

function ModalInput({ label, ...props }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#14245C] dark:text-gray-200 ml-1">
                {label}
            </label>
            <input
                {...props}
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F3EA] dark:bg-white/5 text-[#14245C] dark:text-white placeholder:text-gray-400 outline-none text-[14px] font-bold border-none shadow-xs transition-all"
            />
        </div>
    );
}
