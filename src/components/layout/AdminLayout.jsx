import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AdminLayout() {
    return (
        <div className="bg-[#F8F3EA] dark:bg-[#0B1957] min-h-screen transition-colors duration-300">
            <Navbar isAdmin={true} />
            <div className="animate-[pageEnter_0.3s_ease-out_forwards]">
                <Outlet />
            </div>
        </div>
    );
}
