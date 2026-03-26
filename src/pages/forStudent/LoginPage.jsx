import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/common/LoadingScreen";
import authService from "../../api/services/auth";
import CustomToast from "../../components/common/CustomToast";


export default function LoginPage() {

  const [showPassword, setShowPassword] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [email, setEmail] = useState("");
  const [forgotUsername, setForgotUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();


  const openForgot = () => {
    setIsForgotOpen(true);
    setIsSuccess(false);
    setForgotUsername("");
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsForgotOpen(false);
      setIsClosing(false);
      setIsSuccess(false);
      setIsLoading(false);
    }, 300);
  };

  const handleSendReset = async (e) => {
    e.preventDefault();
    if (!forgotUsername.trim()) {
      CustomToast.error("Please enter your username");
      return;
    }
    setIsLoading(true);
    try {
      await authService.forgotPassword(forgotUsername);
      setIsLoading(false);
      setIsSuccess(true);
      CustomToast.success("Reset link sent to your registered email.");
    } catch (error) {
      setIsLoading(false);
      CustomToast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      CustomToast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setIsLoading(false);

      // On success, handle tokens or user data if necessary
      localStorage.setItem('user', JSON.stringify(data.user));

      CustomToast.success("Login successful! Welcome back 🎉");

      // Role-based redirect
      const destination =
        data.user?.role === "admin" || data.user?.role === "teacher"
          ? "/admin/dashboard"
          : "/dashboard";

      setTimeout(() => {
        setIsNavigating(true);
        setTimeout(() => navigate(destination), 1500);
      }, 800);

    } catch (error) {
      setIsLoading(false);
      console.error("Login Error:", error);
      const errorMessage = typeof error === 'string' ? error : (error.message || "Invalid credentials. Please try again.");
      CustomToast.error(errorMessage);
      setPassword("");
    }
  };

  return (
    <>
      {isNavigating && <LoadingScreen />}
      <div className="min-h-screen bg-[#F8F3EA] dark:bg-[#0B1957] flex items-center justify-center px-4 transition-colors duration-300 animate-[pageEnter_0.3s_ease-out_forwards]">

        <div className="w-full max-w-md">
          {/*Logo*/}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0B1957] dark:bg-[#9ECCFA] rounded-2xl mb-4 shadow-md hover:scale-105 transition-transform">
              <svg
                className="w-9 h-9 text-white dark:text-[#0B1957]"
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
            <h1 className="text-2xl font-semibold text-[#0B1957] dark:text-white mb-2">
              ICT Catalyst Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Login to access your dashboard
            </p>
          </div>

          {/*Login Card*/}
          <div className="bg-white dark:bg-[#152561] rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-white/10">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#0B1957] dark:text-white mb-2">
                  Username/Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username or email@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F3EA] dark:bg-[#0B1957] border border-gray-200 dark:border-white/10 text-[#0B1957] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9ECCFA] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0B1957] dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F8F3EA] dark:bg-[#0B1957] border border-gray-200 dark:border-white/10 text-[#0B1957] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9ECCFA] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0B1957] focus:ring-[#9ECCFA] accent-[#0B1957]"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={openForgot}
                  className="text-sm text-[#0B1957] dark:text-[#9ECCFA] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-[#0B1957] dark:bg-[#9ECCFA] text-white dark:text-[#0B1957] rounded-xl transition-all shadow-md font-medium flex items-center justify-center gap-2 hover:bg-[#152561] dark:hover:bg-[#b8dcfc] hover:shadow-lg ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-[#0B1957]/30 dark:border-t-[#0B1957] rounded-full animate-spin" />
                ) : null}
                {isLoading ? "Logging in..." : "Log in"}
              </button>

            </form>
          </div>
        </div>

        {/*Forgot Password Modal*/}
        {isForgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"
                }`}
              onClick={handleClose}
            />

            <div
              className={`relative bg-white dark:bg-[#152561] rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100 dark:border-white/10 transform transition-all duration-300 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                }`}
            >
              {!isSuccess ? (
                <form onSubmit={handleSendReset}>
                  <h2 className="text-xl font-semibold text-[#0B1957] dark:text-white mb-2">
                    Forgot your password? Don't worry.
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    Enter your username to receive a password reset link at your registered email.
                  </p>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#0B1957] dark:text-white mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F3EA] dark:bg-[#0B1957] border border-gray-200 dark:border-white/10 text-[#0B1957] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9ECCFA]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-white/20 text-[#0B1957] dark:text-white hover:bg-gray-50 dark:hover:bg-[#1d3270] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !forgotUsername.trim()}
                      className={`flex-1 py-3 px-4 rounded-xl text-white dark:text-[#0B1957] font-medium transition-all shadow-md ${forgotUsername.trim()
                        ? "bg-[#0B1957] dark:bg-[#9ECCFA] hover:opacity-90"
                        : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {isLoading ? "Sending..." : "Send Link"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-full text-2xl mb-4 inline-block">
                    ✓
                  </div>
                  <h2 className="text-xl font-semibold text-[#0B1957] dark:text-white mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    We've sent a password reset link to your email address.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full bg-[#0B1957] dark:bg-[#9ECCFA] text-white dark:text-[#0B1957] py-3 rounded-xl font-medium transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              )}

              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}