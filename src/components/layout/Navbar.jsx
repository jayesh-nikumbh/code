import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, Bell, X, Eye, EyeOff, ScrollText, User } from "lucide-react";
import ProfileSidebar from "./ProfileSidebar";
import NotificationSidebar from "./NotificationSidebar";
import notificationsService from "../../api/services/notifications";
import adminService from "../../api/services/admin";

export default function Navbar({ isAdmin = false }) {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const handleToggleTheme = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    if (newDarkState) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const [notifications, setNotifications] = useState([]);

  // Fetch notifications/activities from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = [];
        const currentRole = user?.role?.toLowerCase() || (isAdmin ? "admin" : "student");

        if (currentRole === "admin" || currentRole === "teacher") {
          data = await adminService.getRecentActivities();
        } else {
          data = await notificationsService.getNotifications();
        }
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notification data:", error);
      }
    };
    if (user || isAdmin) fetchData();

    // Listen for manual updates (from Notifications page)
    window.addEventListener('notificationsUpdated', fetchData);
    return () => window.removeEventListener('notificationsUpdated', fetchData);
  }, [user, isAdmin]);

  const unreadCount = notifications.filter(n => !n.isSeen).length;
  const userRole = user?.role?.toLowerCase() || (isAdmin ? "admin" : "student");

  const markAsSeen = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isSeen: true } : n));
    notificationsService.markAsSeen(id).catch(err => console.error("markAsSeen failed:", err));
  };

  // Auto-mark ALL unread notifications as seen when sidebar is closed
  const handleCloseNotifications = () => {
    const unseenIds = notifications.filter(n => !n.isSeen).map(n => n.id);
    if (unseenIds.length > 0) {
      setNotifications(prev => prev.map(n => ({ ...n, isSeen: true })));
      unseenIds.forEach(id =>
        notificationsService.markAsSeen(id).catch(err => console.error("markAsSeen failed:", err))
      );
    }
    setShowNotifications(false);
  };

  const [showNotifications, setShowNotifications] = useState(false);

  const handleChangePasswordClick = () => {
    // This is no longer needed but kept empty for safety or removed
  };

  return (
    <nav className="w-full h-18 bg-[#14245C] dark:bg-[#0B1957] border-b border-white/10 flex items-center justify-between px-10 sticky top-0 z-50">
      {/* Left Section*/}
      <div className="flex items-center gap-3">
        <div className="bg-[#A9C4FF] p-2.5 rounded-lg shadow-md transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 cursor-pointer"
          onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/dashboard")}>
          <svg

            className="w-6 h-6 text-[#0B1957]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h1 className="text-white text-lg font-semibold tracking-tight">
          Sanyoj
        </h1>
      </div>

      {/* Center Links */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {(() => {
          if (userRole === "admin") {
            return (
              <>
                <NavItem to="/admin/dashboard" label="Dashboard" />
                <NavItem to="/admin/attendance" label="Attendance" />
                <NavItem to="/admin/rewards" label="Rewards" />
                <NavItem to="/admin/activity-logs" label="Activity log" />
              </>
            );
          } else if (userRole === "teacher") {
            return (
              <>
                <NavItem to="/admin/dashboard" label="Dashboard" />
                <NavItem to="/admin/attendance" label="Attendance" />
                <NavItem to="/admin/submissions" label="Assignments" />
                <NavItem to="/admin/rewards" label="Rewards" />
              </>
            );
          } else {
            return (
              <>
                <NavItem to="/dashboard" label="Dashboard" />
                <NavItem to="/attendance" label="Attendance" />
                <NavItem to="/submissions" label="My Submissions" />
                <NavItem to="/rewards" label="Rewards" />
              </>
            );
          }
        })()}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* User Role Badge */}
        <div className="bg-[#9ECCFA] px-3 py-1 rounded-lg shadow-sm">
          <span className="text-[#14245C] text-xs font-bold capitalize whitespace-nowrap">
            {user?.role || (isAdmin ? "admin" : "student")}
          </span>
        </div>
        {/* Theme Toggle */}
        <div
          onClick={handleToggleTheme}
          className="w-10 h-10 bg-[#1E347F] rounded-lg flex items-center justify-center hover:bg-[#243C94] transition cursor-pointer"
        >
          {isDark ? (
            <Sun className="text-white w-5 h-5" />
          ) : (
            <Moon className="text-white w-5 h-5" />
          )}
        </div>

        {/* Notification */}
        <div
          onClick={() => {
            if (userRole === "admin" || userRole === "teacher") {
              // Mark all as seen for admin/teacher
              const unseenIds = notifications.filter(n => !n.isSeen);
              if (unseenIds.length > 0) {
                setNotifications(prev => prev.map(n => ({ ...n, isSeen: true })));
              }
              navigate("/admin/notifications");
            } else {
              setShowNotifications(true);
            }
          }}
          className="relative w-10 h-10 bg-[#1E347F] rounded-lg flex items-center justify-center hover:bg-[#243C94] transition cursor-pointer"
        >
          <Bell className="text-white w-5 h-5" />
          {unreadCount > 0 && (
            <span
              key={unreadCount}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#14245C] flex items-center justify-center"
              style={{ animation: "badgePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <NotificationSidebar
          isOpen={showNotifications}
          onClose={handleCloseNotifications}
          notifications={notifications}
          markAsSeen={markAsSeen}
        />





        {/* Profile with Dropdown Logic0*/}
        <div className="relative">
          <div
            onClick={() => setShowProfileSidebar(true)}
            className="w-10 h-10 bg-[#A9C4FF] text-[#14245C] font-bold flex items-center justify-center rounded-full cursor-pointer hover:ring-2 hover:ring-white/30 transition-all shadow-inner"
          >
            <User size={20} />
          </div>

          {/* Profile Sidebar Component */}
          <ProfileSidebar
            isOpen={showProfileSidebar}
            onClose={() => setShowProfileSidebar(false)}
            user={user}
            setUser={setUser}
          />
        </div>
      </div>

    </nav>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-5 py-2 rounded-xl text-sm font-bold transition ${isActive
          ? "bg-[#9ECCFA] text-[#0B1957]"
          : "text-white/80 hover:text-white hover:bg-white/10"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
