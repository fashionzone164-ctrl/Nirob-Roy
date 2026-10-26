import React, { useEffect, useState } from 'react';
import { QevoraLogo } from './QevoraLogo';

interface SplashScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  minDurationMs = 1200,
}) => {
  const [progress, setProgress] = useState(10);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 250);
          return 100;
        }
        return prev + 15;
      });
    }, minDurationMs / 7);

    return () => clearInterval(timer);
  }, [minDurationMs, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 transition-opacity duration-300"
      aria-label="Qevora loading screen"
    >
      <div className="flex flex-col items-center max-w-xs w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        {/* Official Qevora Logo with Crown and Q Symbol */}
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
          <QevoraLogo variant="full" size="xl" className="relative drop-shadow-2xl" />
        </div>

        {/* Loading status bar */}
        <div className="w-48 space-y-2">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-600 tracking-wider">
            Loading your experience...
          </p>
        </div>
      </div>
    </div>
  );
};
