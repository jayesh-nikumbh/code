import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AlertCircle, LogOut } from "lucide-react";
import Navbar from "./Navbar";

export default function Layout() {
    const [isBlocked, setIsBlocked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                
                // Mock dynamic check from users.json
                try {
                    const { default: mockUsers } = await import('../../data/users.json');
                    const currentUser = mockUsers.find(u => u.email === user.email);
                    
                    if (currentUser && currentUser.status === "blocked") {
                        setIsBlocked(true);
                    } else {
                        setIsBlocked(false);
                    }
                } catch (error) {
                    console.error("Failed to check user status:", error);
                }
            }
        };

        checkStatus();
        
        // Optional: In a real app, you might poll this or use a socket
    }, []);

    const handleRedirectToLogin = () => {
        localStorage.removeItem('user'); // Clear data
        navigate('/');
    };

    return (
        <div className="bg-[#F8F3EA] dark:bg-[#0B1957] min-h-screen transition-colors duration-300">
            {isBlocked && (
                <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-[#0B1957]/60 backdrop-blur-md" />
                    
                    {/* Modal Card */}
                    <div className="relative bg-[#F8F3EA] dark:bg-[#152561] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-md p-8 text-center transform transition-all animate-spring-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-6">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-[#0B1957] dark:text-white mb-3">
                            Account Blocked
                        </h2>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Oops! It seems like your account has been blocked by the administrator. You can no longer access the academic portal features.
                        </p>
                        
                        <button
                            onClick={handleRedirectToLogin}
                            className="w-full py-3.5 bg-[#0B1957] dark:bg-[#9ECCFA] text-white dark:text-[#0B1957] rounded-xl font-bold transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            OK
                        </button>
                    </div>
                </div>
            )}
            
            <Navbar />
            <div className="animate-[pageEnter_0.3s_ease-out_forwards]">
                <Outlet />
            </div>
        </div>
    );
}
