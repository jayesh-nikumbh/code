import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, Bell, X, Eye, EyeOff, ScrollText, User, Menu } from "lucide-react";
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

  // Sync user from localStorage on mount and when storage changes
  useEffect(() => {
    const syncUser = async () => {
      const savedUserStr = sessionStorage.getItem("user");
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        
        try {
          // Fetch the latest role from users.json (Source of Truth)
          const { default: mockUsers } = await import('../../data/users.json');
          const latestUserData = mockUsers.find(u => u.email === savedUser.email);
          
          if (latestUserData) {
            setUser({ ...savedUser, role: latestUserData.role });
          } else {
            setUser(savedUser);
          }
        } catch (error) {
          console.error("Failed to sync user role from JSON:", error);
          setUser(savedUser);
        }
      } else {
        setUser(null);
      }
    };

    syncUser();

    // Listen for custom profile update events (same tab)
    window.addEventListener('profileUpdated', syncUser);
    
    // Handle manual state update (within the tab)
    const interval = setInterval(syncUser, 1500);

    return () => {
      window.removeEventListener('profileUpdated', syncUser);
      clearInterval(interval);
    };
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
  
  // ROBUST ROLE DETECTION
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full max-w-full h-18 bg-[#14245C] dark:bg-[#0B1957] border-b border-white/10 flex items-center justify-between px-2 md:px-10 sticky top-0 z-50 overflow-hidden">
      {/* Left Section*/}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden text-white hover:text-[#9ECCFA] transition shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="bg-[#A9C4FF] p-1.5 md:p-2 rounded-lg shadow-md transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer font-bold shrink-0 hover-glow"
          onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/dashboard")}>
          <svg
            className="w-6 h-6 md:w-7 md:h-7 text-[#0B1957]"
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
        <h1 className="text-white text-base md:text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-none">
          Sanyoj<span className="hidden sm:inline"> - ICT Catalyst Portal</span>
        </h1>
      </div>

      {/* Center Links */}
      <div className="hidden lg:flex flex-1 justify-center items-center gap-4 overflow-hidden">
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
      <div className="flex items-center justify-end gap-1.5 md:gap-4 shrink-0">

        {/* Premium Role Capsule (Moved to Left of Theme Toggle) */}
        <div className={`
          hidden sm:flex premium-role-capsule
          ${userRole === 'admin' ? 'capsule-admin' : userRole === 'teacher' ? 'capsule-teacher' : 'capsule-student'}
        `}>
           <span className="capitalize">{userRole}</span>
        </div>

        {/* Theme Toggle */}
        <div
          onClick={handleToggleTheme}
          className="w-10 h-10 bg-[#1E347F] rounded-lg flex items-center justify-center hover:bg-[#243C94] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-90 cursor-pointer group"
        >
          {isDark ? (
            <Sun className="text-white w-5 h-5 group-hover:rotate-12 transition-transform" />
          ) : (
            <Moon className="text-white w-5 h-5 group-hover:-rotate-12 transition-transform" />
          )}
        </div>

        {/* Notification */}
        <div
          onClick={() => {
            if (userRole === "admin" || userRole === "teacher") {
              const unseenIds = notifications.filter(n => !n.isSeen);
              if (unseenIds.length > 0) {
                setNotifications(prev => prev.map(n => ({ ...n, isSeen: true })));
              }
              navigate("/admin/notifications");
            } else {
              setShowNotifications(true);
            }
          }}
          className="relative w-10 h-10 bg-[#1E347F] rounded-lg flex items-center justify-center hover:bg-[#243C94] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-90 cursor-pointer group"
        >
          <Bell className="text-white w-5 h-5 group-hover:animate-swing transition-transform" />
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

        {/* User Profile & Role Aura */}
        <div className="relative group">
          <div className={`
            profile-aura-container transition-all duration-500
            ${userRole === 'admin' ? 'aura-admin scale-110' : userRole === 'teacher' ? 'aura-teacher' : 'aura-student'}
          `}>
            {/* Animated Ring */}
            <div className="aura-ring"></div>
            
            {/* Role Pulse (Student Only) */}
            {userRole === 'student' && <div className="aura-student-pulse"></div>}

            <div
              onClick={() => setShowProfileSidebar(true)}
              className="relative w-10 h-10 bg-[#A9C4FF] dark:bg-[#1E347F] text-[#14245C] dark:text-[#9ECCFA] font-black flex items-center justify-center rounded-full cursor-pointer hover:ring-2 hover:ring-white/30 transition-all shadow-inner z-10 overflow-hidden"
            >
              <span className="text-xs sm:text-sm tracking-tighter">
                {getInitials(user?.name)}
              </span>
              
              {/* Floating Role Indicator Orb */}
              <div className={`
                absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#14245C] dark:border-[#0B1957] shadow-sm
                ${userRole === 'admin' ? 'bg-amber-400' : userRole === 'teacher' ? 'bg-cyan-400' : 'bg-blue-400'}
              `}></div>
            </div>
          </div>

          {/* Tooltip on Hover */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none capitalize font-bold z-50">
            {userRole}
          </div>
        </div>

        {/* Profile Sidebar Component */}
        <ProfileSidebar
          isOpen={showProfileSidebar}
          onClose={() => setShowProfileSidebar(false)}
          user={user}
          setUser={setUser}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-100 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar */}
        <div className={`absolute left-0 top-0 w-64 bg-[#14245C] dark:bg-[#0B1957] h-full shadow-2xl flex flex-col pt-5 px-4 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-xl font-bold tracking-tight">Sanyoj</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-red-400 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {(() => {
              if (userRole === "admin") {
                return (
                  <>
                    <MobileNavItem to="/admin/dashboard" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to="/admin/attendance" label="Attendance" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to="/admin/rewards" label="Rewards" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to="/admin/activity-logs" label="Activity log" onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                );
              } else if (userRole === "teacher") {
                return (
                  <>
                    <MobileNavItem to="/admin/dashboard" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to="/admin/attendance" label="Attendance" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to="/admin/submissions" label="Assignments" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to="/admin/rewards" label="Rewards" onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                );
              } else {
                return (
                  <>
                    <MobileNavItem to="/dashboard" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to="/attendance" label="Attendance" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to="/submissions" label="My Submissions" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to="/rewards" label="Rewards" onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                );
              }
            })()}
          </div>
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
        `px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover-scale whitespace-nowrap ${isActive
          ? "bg-[#9ECCFA] text-[#0B1957] shadow-lg shadow-[#9ECCFA]/20 scale-105"
          : "text-white/80 hover:text-white hover:bg-white/15 hover:scale-105"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function MobileNavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-4 py-3 rounded-xl text-base font-bold transition whitespace-nowrap ${isActive
          ? "bg-[#9ECCFA] text-[#0B1957]"
          : "text-white/80 hover:text-white hover:bg-white/10"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
