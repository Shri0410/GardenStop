import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface DeveloperCreditProps {
  className?: string;
}

export const DeveloperCredit: React.FC<DeveloperCreditProps> = ({ className = '' }) => {
  return (
    <motion.a
      href="https://shrinivasw.netlify.app/"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      aria-label="Designed & Developed by SHRI - Opens portfolio in a new tab"
      className={`group/shri relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-amber-400/40 backdrop-blur-md shadow-xs hover:shadow-[0_0_22px_rgba(251,191,36,0.22)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:ring-offset-2 focus:ring-offset-[#050A07] cursor-pointer select-none ${className}`}
    >
      {/* Subtle Ambient Shimmer Highlight */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 group-hover/shri:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Sparkle Accent */}
      <span className="relative flex items-center justify-center">
        <Sparkles className="w-3.5 h-3.5 text-amber-400/80 group-hover/shri:text-amber-300 group-hover/shri:rotate-12 transition-all duration-300" />
      </span>

      {/* "Designed & Developed by" text */}
      <span className="text-[11px] sm:text-xs text-stone-400 group-hover/shri:text-stone-200 transition-colors duration-200 font-medium tracking-normal">
        Designed &amp; Developed by
      </span>

      {/* Signature Name: SHRI with Gradient, Glow & Underline */}
      <span className="relative inline-flex items-center font-black tracking-widest text-xs sm:text-sm">
        {/* Glow behind text */}
        <span className="absolute -inset-1 rounded-full bg-amber-400/15 blur-sm opacity-0 group-hover/shri:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Text */}
        <span className="relative bg-gradient-to-r from-amber-200 via-emerald-200 to-amber-300 group-hover/shri:from-amber-300 group-hover/shri:via-white group-hover/shri:to-amber-200 bg-clip-text text-transparent transition-all duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          SHRI
        </span>

        {/* Animated Underline */}
        <span className="absolute left-0 -bottom-0.5 w-full h-[1.5px] bg-gradient-to-r from-amber-400 via-emerald-300 to-amber-300 scale-x-0 group-hover/shri:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
      </span>

      {/* Interactive Arrow ↗ */}
      <span className="relative flex items-center">
        <ArrowUpRight className="w-3.5 h-3.5 text-amber-300 group-hover/shri:text-amber-200 group-hover/shri:translate-x-0.5 group-hover/shri:-translate-y-0.5 transition-transform duration-300 ease-out" />
      </span>
    </motion.a>
  );
};
