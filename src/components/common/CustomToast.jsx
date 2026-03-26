import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

/**
 * CustomToast component with high-performance CSS animations.
 * Provides a premium, smooth slide-down effect.
 */
const CustomToast = {
    success: (message) => {
        toast.custom(
            (t) => (
                <div
                    className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-exit'
                        } flex items-center gap-3 bg-white dark:bg-[#152561] text-[#0B1957] dark:text-white px-5 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-white/10 min-w-[320px]`}
                >
                    <div className="shrink-0 w-7 h-7 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 text-white dark:text-black" strokeWidth={3} />
                    </div>
                    <div className="font-bold text-[15px] tracking-tight">{message}</div>
                </div>
            ),
            { duration: 3500, position: "top-right" }
        );
    },
    error: (message) => {
        toast.custom(
            (t) => (
                <div
                    className={`${t.visible ? 'animate-toast-enter' : 'animate-toast-exit'
                        } flex items-center gap-3 bg-white dark:bg-[#152561] text-[#0B1957] dark:text-white px-5 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-white/10 min-w-[320px]`}
                >
                    <div className="shrink-0 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                        <X className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <div className="font-bold text-[15px] tracking-tight">{message}</div>
                </div>
            ),
            { duration: 3500, position: "top-right" }
        );
    },
};

export default CustomToast;
