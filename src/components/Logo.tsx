import React, { forwardRef } from 'react';

export interface LogoProps {
  id?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'light' | 'dark' | 'header';
  withSubtitle?: boolean;
  style?: React.CSSProperties;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(({
  id,
  className = '',
  size = 'md',
  variant = 'header',
  withSubtitle = true,
  style,
}, ref) => {
  // Size map for the emblem icon
  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
    '2xl': 'text-4xl sm:text-5xl',
  };

  const isDark = variant === 'dark';

  return (
    <div
      id={id}
      ref={ref}
      style={style}
      className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}
    >
      {/* Botanical Crest Emblem */}
      <div className={`relative ${emblemSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-600 via-amber-500/30 to-emerald-400 blur-sm opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Outer Artisan Badge */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#1E3A2B] via-[#162C20] to-[#0F1E16] p-[1.5px] shadow-lg shadow-forest/20 ring-1 ring-amber-400/30">
          <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#1E3A2B] to-[#12241A] flex items-center justify-center overflow-hidden relative">
            
            {/* Subtle background rays */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-transparent pointer-events-none" />

            {/* Custom Aesthetic Botanical SVG Icon */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[72%] h-[72%] text-amber-300 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            >
              {/* Botanical Arch Rim */}
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="url(#goldGradient)"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                opacity="0.8"
              />
              <circle
                cx="50"
                cy="50"
                r="39"
                stroke="#2D5A43"
                strokeWidth="1.2"
                opacity="0.6"
              />

              {/* Central Coffee Cup with Steam that curls into organic leaves */}
              <path
                d="M32 50 C32 66, 40 72, 50 72 C60 72, 68 66, 68 50 Z"
                fill="url(#sageGradient)"
                stroke="url(#goldGradient)"
                strokeWidth="2"
              />
              {/* Cup handle */}
              <path
                d="M68 53 C74 53, 76 58, 76 61 C76 65, 72 68, 66 67"
                stroke="url(#goldGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Cup saucer line */}
              <path
                d="M26 74 Q50 78 74 74"
                stroke="url(#goldGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Botanical Leaves blossoming from the cup */}
              {/* Left Leaf */}
              <path
                d="M50 48 C42 42, 33 42, 31 32 C37 32, 45 38, 50 48 Z"
                fill="#4E8767"
                stroke="#A7F3D0"
                strokeWidth="1.2"
              />
              {/* Center Tall Leaf */}
              <path
                d="M50 48 C46 36, 48 24, 50 18 C52 24, 54 36, 50 48 Z"
                fill="url(#leafGradient)"
                stroke="#FDE68A"
                strokeWidth="1.2"
              />
              {/* Right Leaf */}
              <path
                d="M50 48 C58 42, 67 42, 69 32 C63 32, 55 38, 50 48 Z"
                fill="#4E8767"
                stroke="#A7F3D0"
                strokeWidth="1.2"
              />

              {/* Golden Sunburst Sparkles */}
              <path
                d="M50 11 L51 14 L54 15 L51 16 L50 19 L49 16 L46 15 L49 14 Z"
                fill="#FDE68A"
              />
              <circle cx="28" cy="24" r="1.5" fill="#FDE68A" />
              <circle cx="72" cy="24" r="1.5" fill="#FDE68A" />

              {/* Gradients */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
                <linearGradient id="sageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2D5A43" />
                  <stop offset="100%" stopColor="#1E3A2B" />
                </linearGradient>
                <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#15803D" />
                </linearGradient>
              </defs>
            </svg>

          </div>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-serif font-black tracking-tight ${titleSizes[size]} ${
              isDark ? 'text-white' : 'text-forest'
            }`}
          >
            Garden
          </span>
          <span
            className={`font-serif font-bold italic tracking-tight ${titleSizes[size]} text-amber-600`}
          >
            Stop
          </span>
          {/* Delicate small botanical leaf glyph */}
          <span className="text-emerald-600 text-xs sm:text-sm -mt-2">🌿</span>
        </div>

        {withSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase ${
                isDark ? 'text-emerald-300/80' : 'text-stone-500'
              }`}
            >
              Botanical Kitchen & Cafe
            </span>
          </div>
        )}
      </div>

    </div>
  );
});

Logo.displayName = 'Logo';
