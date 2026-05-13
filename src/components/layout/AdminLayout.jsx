import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function AdminLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const syncUser = () => {
            const user = JSON.parse(sessionStorage.getItem("user") || "{}");
            const role = user?.role?.toLowerCase();
            
            // If logged in as student but trying to access admin routes, kick back to student dashboard
            if (role === "student") {
                navigate("/dashboard");
            } 
            // If not logged in at all, kick to login
            else if (!role) {
                navigate("/");
            }
        };

        syncUser();

        // Handle manual state update
        const interval = setInterval(syncUser, 1500);

        return () => {
            clearInterval(interval);
        };
    }, [navigate]);

    return (
        <div className="bg-[#F8F3EA] dark:bg-[#0B1957] min-h-screen transition-colors duration-300">
            <Navbar isAdmin={true} />
            <div className="animate-[pageEnter_0.3s_ease-out_forwards]">
                <Outlet />
            </div>
        </div>
    );
}
