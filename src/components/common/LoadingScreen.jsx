import React, { useMemo } from "react";
const LoadingScreen = () => {

    const particles = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 5}s`,
            size: `${Math.random() * 4 + 2}px`,
        }));
    }, []);

    return (
        <div className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-[#F8F3EA] dark:bg-[#0B1957] transition-colors duration-700 overflow-hidden">
            {/* Background Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute bg-[#9ECCFA] rounded-full opacity-0 animate-[particle-up_4s_infinite_linear]"
                        style={{
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                            animationDelay: p.delay,
                        }}
                    />
                ))}
            </div>

            <div className="relative flex flex-col items-center animate-float">
                {/* Advanced 3D Rotating Glow */}
                <div className="absolute -inset-16 bg-linear-to-tr from-[#0B1957]/20 via-[#9ECCFA]/30 to-[#0B1957]/20 rounded-full blur-3xl animate-rotating-glow" />

                {/* Premium Icon Container with Glassmorphism */}
                <div className="relative mb-10 group cursor-none">
                    <div className="absolute -inset-2 bg-linear-to-r from-[#0B1957] via-[#9ECCFA] to-[#0B1957] rounded-[2.5rem] blur opacity-40 animate-pulse"></div>

                    <div className="relative inline-flex items-center justify-center w-28 h-28 bg-[#0B1957] dark:bg-[#9ECCFA] rounded-4xl shadow-[0_20px_50px_rgba(11,25,87,0.3)] dark:shadow-[0_20px_50px_rgba(158,204,250,0.2)] animate-bounce-slow overflow-hidden">
                        {/* Inner Shine Effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shine_2s_infinite]" />

                        <svg
                            className="w-14 h-14 text-white dark:text-[#0B1957] drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                </div>

                {/* Text Animation: ICT Catalyst with Premium Hover/Wave */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-1.5 px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-inner">
                        {["I", "C", "T", "\u00A0", "C", "A", "T", "A", "L", "Y", "S", "T"].map((char, index) => (
                            <span
                                key={index}
                                className="text-4xl font-black text-[#0B1957] dark:text-white inline-block animate-[wave_2s_infinite_ease-in-out] select-none pointer-events-none tracking-tighter"
                                style={{
                                    animationDelay: `${index * 0.12}s`,
                                    textShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 animate-pulse">
                        <span className="h-px w-8 bg-linear-to-r from-transparent to-[#0B1957]/30 dark:to-[#9ECCFA]/30" />
                        <p className="text-[#0B1957]/80 dark:text-[#9ECCFA]/90 text-xs font-bold tracking-[0.4em] uppercase">
                            Sanyoj System
                        </p>
                        <span className="h-px w-8 bg-linear-to-l from-transparent to-[#0B1957]/30 dark:to-[#9ECCFA]/30" />
                    </div>
                </div>


                <div className="mt-14 relative group">
                    <div className="absolute -inset-1 bg-[#9ECCFA]/30 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-64 h-2 bg-gray-200/50 dark:bg-white/10 rounded-full overflow-hidden backdrop-blur-xl border border-white/5">
                        <div className="h-full bg-linear-to-r from-[#0B1957] via-[#9ECCFA] to-[#0B1957] rounded-full w-full animate-[loadingLine_1.5s_infinite_linear] bg-size-[200%_100%] shadow-[0_0_15px_rgba(158,204,250,0.5)]" />
                    </div>

                    <div className="mt-3 flex justify-between px-1">
                        <span className="text-[10px] font-bold text-[#0B1957]/40 dark:text-white/40 tracking-widest uppercase">Initializing</span>
                        <span className="text-[10px] font-bold text-[#0B1957]/40 dark:text-white/40 tracking-widest uppercase animate-pulse">Please wait</span>
                    </div>
                </div>
            </div>


            <div className="fixed top-0 left-0 w-32 h-32 bg-linear-to-br from-[#0B1957]/5 to-transparent rounded-br-full pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-[#9ECCFA]/10 to-transparent rounded-tl-full pointer-events-none" />
        </div>
    );
};

export default LoadingScreen;
