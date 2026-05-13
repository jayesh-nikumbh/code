export default function WelcomeCard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const name = user?.name || "User";
  const role = user?.role?.toLowerCase();

  const getWelcomeMessage = () => {
    switch (role) {
      case 'admin':
        return "Ready to manage the system today";
      case 'teacher':
        return "Ready to manage the class today";
      default:
        return "Ready to make progress today?";
    }
  };

  return (
    <div className="bg-linear-to-r from-[#9ECCFA]/20 to-[#D1E8FF]/20 dark:from-[#152561] dark:to-[#1d3270] rounded-2xl p-6 border border-[#9ECCFA]/30 dark:border-white/10 animate-[pageEnter_0.5s_ease-out] hover-lift hover:shadow-lg transition-all duration-500 cursor-default">
      <h1 className="text-2xl font-bold text-[#0B1957] dark:text-white mb-1">
        Welcome back, {name}
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        {getWelcomeMessage()}
      </p>
    </div>
  );
}
