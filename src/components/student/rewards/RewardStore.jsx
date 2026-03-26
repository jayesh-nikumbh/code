import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Star } from 'lucide-react';
import CustomToast from '../../common/CustomToast';

const Sparkle = ({ x, y, delay, color, size }) => (
  <div
    className="absolute pointer-events-none animate-sparkle"
    style={{
      left: '50%',
      top: '50%',
      '--tw-translate-x': `${x}px`,
      '--tw-translate-y': `${y}px`,
      animationDelay: `${delay}ms`
    }}
  >
    <Star
      className={`fill-current ${color}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  </div>
);

const RewardCard = ({ image, title, points, canRedeem, isRedeemed: initialIsRedeemed, onRedeem }) => {
  const [isRedeemed, setIsRedeemed] = useState(initialIsRedeemed || false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    setIsRedeemed(initialIsRedeemed || false);
  }, [initialIsRedeemed]);

  const handleRedeem = async () => {
    if (isRedeemed || isRedeeming) return;

    setIsRedeeming(true);
    try {
      await onRedeem();
      
      const colors = [
        'text-yellow-400',
        'text-blue-400',
        'text-purple-400',
        'text-pink-400',
        'text-green-400'
      ];

      // Trigger more and more visible Sparkles
      const newSparkles = Array.from({ length: 24 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.cos(i * (360 / 24) * (Math.PI / 180)) * (80 + Math.random() * 60),
        y: Math.sin(i * (360 / 24) * (Math.PI / 180)) * (80 + Math.random() * 60),
        delay: Math.random() * 300,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 12
      }));

      setSparkles(newSparkles);
      setIsRedeemed(true);
      CustomToast.success(`Hurray! You've redeemed ${title} ✨`);
    } catch (error) {
      CustomToast.error("Redemption failed. Please try again.");
    } finally {
      setIsRedeeming(false);
    }
  };

  useEffect(() => {
    if (sparkles.length > 0) {
      const timer = setTimeout(() => setSparkles([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [sparkles]);

  return (
    <div className="bg-white dark:bg-[#152561] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm flex flex-col h-full group hover:shadow-md transition-shadow duration-300 relative">
      {/* Reward Image */}
      <div className="aspect-16/10 w-full overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Reward Content */}
      <div className="p-4 flex flex-col grow">
        <h3 className="text-[#0B1957] dark:text-white font-bold text-lg mb-1">{title}</h3>

        <div className="flex items-center gap-1.5 text-[#3b82f6] dark:text-blue-400 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-green-500 text-sm ">
            {points} <span className="text-gray-500 dark:text-gray-400 font-medium">points</span>
          </span>
        </div>

        <div className="mt-auto relative">
          {/* Sparkles celebration centered on button */}
          {sparkles.map(s => (
            <Sparkle key={s.id} x={s.x} y={s.y} delay={s.delay} color={s.color} size={s.size} />
          ))}

          <button
            onClick={handleRedeem}
            disabled={!canRedeem || isRedeemed}
            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${isRedeemed
              ? "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-white/5"
              : canRedeem
                ? "bg-[#0B1957] text-white hover:bg-[#1c2e7a] active:scale-95 cursor-pointer shadow-sm"
                : "bg-gray-400/50 text-white cursor-not-allowed opacity-80"
              }`}
          >
            {isRedeemed ? (
              "Reward Redeemed"
            ) : canRedeem ? (
              "Redeem"
            ) : (
              "Not Enough Points"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
