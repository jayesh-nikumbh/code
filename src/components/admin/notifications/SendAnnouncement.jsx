import { useState } from "react";
import CustomToast from "../../common/CustomToast";
import { Loader2 } from "lucide-react";

export default function SendAnnouncement({ onSend }) {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) {
            CustomToast.error("Please enter a message");
            return;
        }

        if (onSend) {
            setSending(true);
            try {
                await onSend(message);
                CustomToast.success("Announcement sent successfully!");
                setMessage("");
            } catch (error) {
                // Error handled by parent toast usually, but just in case
            } finally {
                setSending(false);
            }
        }
    };

    const handleCancel = () => {
        if (sending) return;
        setMessage("");
    };

    return (
        <div className="bg-white dark:bg-[#152561] rounded-[32px] shadow-sm border border-gray-100 dark:border-white/5 p-8 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-[#0B1957] dark:text-white mb-3">
                Send Announcement
            </h2>

            <div className="space-y-2">
                <div>
                    <label className="text-sm font-semibold text-[#0B1957] dark:text-gray-200">
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={sending}
                        placeholder="Write a notification for teachers and students..."
                        className={`w-full mt-2 p-4 rounded-xl border-none bg-[#F5F1E9] dark:bg-white/10 text-[15px] outline-none min-h-[100px] resize-none text-gray-700 dark:text-gray-100 placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500/30 transition-all ${sending ? 'opacity-50' : ''}`}
                    />
                </div>

                <div className="flex gap-4 pt-0">
                    <button 
                        onClick={handleCancel}
                        disabled={sending}
                        className="flex-1 bg-[#F5F1E9] dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl py-3 text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button 
                        onClick={handleSend}
                        disabled={sending}
                        className="flex-1 bg-[#0B1957] hover:bg-[#14245C] text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Send Notification
                    </button>
                </div>
            </div>
        </div>
    );
}