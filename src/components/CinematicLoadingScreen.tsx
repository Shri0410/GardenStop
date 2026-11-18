import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Logo } from './Logo';

interface CinematicLoadingScreenProps {
  onComplete?: () => void;
  websiteContentId?: string;
}

const PHRASES = [
  { threshold: 0, text: '🌱 Steeping single-origin Ethiopian cold brews...' },
  { threshold: 28, text: '🔥 Firing artisan sourdough Margherita & truffle crusts...' },
  { threshold: 62, text: '🌿 Harvesting fresh organic herbs & microgreens...' },
  { threshold: 88, text: '✨ Setting your table at Garden Stop...' },
];

export const CinematicLoadingScreen: React.FC<CinematicLoadingScreenProps> = ({
  onComplete,
  websiteContentId = 'main-website-content',
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(PHRASES[0].text);
  const [isFinished, setIsFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const progressControlsRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);

  // 1. Lock body scrolling while loading screen is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 2. Realistic, buttery smooth progress counter (0 -> 100%)
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const increment = current < 35 ? 4 : current < 75 ? 3 : current < 92 ? 2 : 1;
      current = Math.min(100, current + increment);
      setProgress(current);

      for (let i = PHRASES.length - 1; i >= 0; i--) {
        if (current >= PHRASES[i].threshold) {
          setStatusText(PHRASES[i].text);
          break;
        }
      }

      if (current >= 100) {
        clearInterval(interval);
      }
    }, 28); // ~1.5s total time

    return () => clearInterval(interval);
  }, []);

  // 3. Trigger Logo Flight Animation when 100% reached
  useEffect(() => {
    if (progress < 100) return;

    const timeout = setTimeout(() => {
      executeLogoFlight();
    }, 140);

    return () => clearTimeout(timeout);
  }, [progress]);

  const executeLogoFlight = () => {
    const navLogo = document.getElementById('navbar-brand-logo');
    const flightLogo = logoWrapperRef.current;
    const progressEl = progressControlsRef.current;
    const backdropEl = backdropRef.current;
    const glowRingEl = glowRingRef.current;
    const websiteEl = document.getElementById(websiteContentId);

    if (!flightLogo || !navLogo) {
      if (websiteEl) websiteEl.style.opacity = '1';
      setIsFinished(true);
      document.body.style.overflow = '';
      if (onComplete) onComplete();
      return;
    }

    // Measure target and source rectangles dynamically
    const targetRect = navLogo.getBoundingClientRect();
    const sourceRect = flightLogo.getBoundingClientRect();

    // Hide target logo while flight is in motion
    navLogo.style.opacity = '0';

    // Calculate exact displacement deltas
    const deltaX = targetRect.left - sourceRect.left;
    const deltaY = targetRect.top - sourceRect.top;
    const scale = targetRect.width / sourceRect.width;

    // Master cinematic GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        navLogo.style.opacity = '1';
        if (websiteEl) {
          websiteEl.style.transform = '';
          websiteEl.style.opacity = '1';
        }
        setIsFinished(true);
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      },
    });

    // Step 1: Smoothly fade out progress controls and ambient aura
    if (progressEl) {
      tl.to(progressEl, {
        opacity: 0,
        y: 15,
        duration: 0.3,
        ease: 'power2.out',
      }, 0);
    }

    if (glowRingEl) {
      tl.to(glowRingEl, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.out',
      }, 0);
    }

    // Step 2: Signature flight of logo directly toward navbar position
    tl.to(flightLogo, {
      x: deltaX,
      y: deltaY,
      scale: scale,
      duration: 1.15,
      ease: 'power4.inOut',
      transformOrigin: 'top left',
    }, 0.08);

    // Step 3: Seamless crossfade handoff as flight touches destination
    tl.to(navLogo, {
      opacity: 1,
      duration: 0.22,
      ease: 'power2.out',
    }, 0.95);

    tl.to(flightLogo, {
      opacity: 0,
      duration: 0.18,
      ease: 'power2.out',
    }, 1.05);

    // Step 4: Dissolve the dark backdrop curtain smoothly
    if (backdropEl) {
      tl.to(backdropEl, {
        opacity: 0,
        duration: 0.85,
        ease: 'power2.inOut',
      }, 0.25);
    }

    // Step 5: Gracefully lift and reveal website content
    if (websiteEl) {
      tl.fromTo(
        websiteEl,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', clearProps: 'transform' },
        0.35
      );
    }
  };

  if (isFinished) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{ pointerEvents: progress < 100 ? 'auto' : 'none' }}
    >
      {/* 1. Luxurious Dark Forest Botanical Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-gradient-to-b from-[#0C1912] via-[#14271D] to-[#1E3A2B]"
      >
        {/* Soft Ambient Radial Lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-amber-400/10 blur-[90px] pointer-events-none" />
        
        {/* Subtle Organic Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      </div>

      {/* 2. Central Logo Container (The signature flying element) */}
      <div className="relative z-20 flex flex-col items-center">
        
        {/* Decorative Golden Aura Ring */}
        <div
          ref={glowRingRef}
          className="absolute -inset-10 rounded-full border border-amber-400/20 border-dashed animate-[spin_20s_linear_infinite] pointer-events-none"
        />

        {/* The Flying Logo Element */}
        <div
          ref={logoWrapperRef}
          className="will-change-transform flex items-center justify-center"
        >
          <Logo
            size="lg"
            variant="dark"
            className="drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* 3. Progress Indicator & Status Bar */}
        <div
          ref={progressControlsRef}
          className="mt-8 flex flex-col items-center w-64 sm:w-80 text-center"
        >
          {/* Progress Bar Track */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative shadow-inner p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-500 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(52,211,153,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Numerical Counter & Status */}
          <div className="w-full flex items-center justify-between mt-2.5 px-0.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300/80">
              Loading
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-amber-300 tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Micro Status Text */}
          <p className="text-[11px] sm:text-xs text-stone-300/90 mt-2 font-medium tracking-wide h-4 transition-all duration-200">
            {statusText}
          </p>

          {/* Botanical Leaf Motif */}
          <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-400/60 font-semibold tracking-wider uppercase">
            <span>🌿</span>
            <span>Handcrafted Botanical Experience</span>
            <span>🌿</span>
          </div>
        </div>

      </div>

    </div>
  );
};
