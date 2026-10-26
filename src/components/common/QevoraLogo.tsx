import React from 'react';

export const QEVORA_LOGO_PATH = '/qevora-logo.png';
export const QEVORA_ATTACHMENT_PATH = '/public/assets/aistudio/file_0000000084c88208b64e9b8879e2bcb5_213696a2.png';

interface QevoraLogoProps {
  variant?: 'full' | 'icon' | 'header';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const QevoraLogo: React.FC<QevoraLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Dimension presets preserving original 1:1 squircle proportions
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28 sm:w-36 sm:h-36',
  };

  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={QEVORA_LOGO_PATH}
          alt="Qevora Symbol"
          referrerPolicy="no-referrer"
          className={`${sizeClasses[size]} object-contain rounded-xl shadow-xs transition-transform hover:scale-105`}
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
        <img
          src={QEVORA_LOGO_PATH}
          alt="Qevora Logo"
          referrerPolicy="no-referrer"
          className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-xl shadow-sm transition-transform hover:scale-105"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
        <div className="flex flex-col justify-center">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-none">
            Qevora
          </span>
          <span className="text-[9px] font-semibold text-blue-600 tracking-wider uppercase mt-0.5">
            Connect · Share · Be You
          </span>
        </div>
      </div>
    );
  }

  // Full variant displaying the complete official artwork preserving original proportions
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="relative group">
        <img
          src={QEVORA_LOGO_PATH}
          alt="Qevora - Connect · Share · Be You"
          referrerPolicy="no-referrer"
          className={`${sizeClasses[size]} object-contain rounded-3xl shadow-xl shadow-blue-500/10 transition-transform group-hover:scale-[1.02] duration-300`}
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </div>
    </div>
  );
};
