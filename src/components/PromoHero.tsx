import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tag, Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CategoryId } from '../types';

interface PromoSlide {
  id: string;
  category: CategoryId;
  tag: string;
  discountBadge: string;
  title: string;
  highlightWord: string;
  subtitle: string;
  code: string;
  image: string;
  accentBg: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'slide-pizza',
    category: 'pizzas',
    tag: 'Artisan Wood-Fired',
    discountBadge: 'FLAT 30% OFF',
    title: 'Stone-Baked',
    highlightWord: 'Sourdough Pizza',
    subtitle: 'San Marzano passata & buffalo mozzarella',
    code: 'PIZZA30',
    image: '/images/banner-pizza.jpg',
    accentBg: 'bg-terracotta',
  },
  {
    id: 'slide-burger',
    category: 'burgers',
    tag: 'Prime Smash Special',
    discountBadge: 'FLAT 20% OFF',
    title: 'Caramelized',
    highlightWord: 'Smash Burgers',
    subtitle: 'Toasted brioche & portobello truffle aioli',
    code: 'BURGER20',
    image: '/images/banner-burger.jpg',
    accentBg: 'bg-emerald-600',
  },
  {
    id: 'slide-fries',
    category: 'starters',
    tag: 'Signature Crunch',
    discountBadge: 'FLAT 25% OFF',
    title: 'Hand-Cut Crispy',
    highlightWord: 'Peri-Peri Fries',
    subtitle: 'Golden Yukon gold with house herb aioli dip',
    code: 'FRIES50',
    image: '/images/banner-fries.jpg',
    accentBg: 'bg-amber-600',
  },
];

interface PromoHeroProps {
  onSelectCategory?: (cat: CategoryId) => void;
}

export const PromoHero: React.FC<PromoHeroProps> = ({ onSelectCategory }) => {
  const { applyPromo } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Exact unified background hex color for seamless zero-line fade
  const CARD_BG = '#111814';

  // Auto-slide every 4.2 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 4200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleApply = (e: React.MouseEvent, code: string, category: CategoryId) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    applyPromo(code);
    setAppliedCode(code);

    if (onSelectCategory) {
      onSelectCategory(category);
    }

    setTimeout(() => {
      setAppliedCode(null);
    }, 2500);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-2.5 pb-2">
      
      {/* 1. Master Slider Container (Unified single background color) */}
      <div
        className="relative overflow-hidden rounded-[26px] sm:rounded-3xl shadow-elevated border border-stone-800/40 select-none"
        style={{ backgroundColor: CARD_BG }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Buttery Smooth Horizontal Carousel Track */}
        <motion.div
          className="flex w-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {PROMO_SLIDES.map((slide) => (
            <div
              key={slide.id}
              onClick={(e) => handleApply(e, slide.code, slide.category)}
              className="relative w-full shrink-0 min-h-[148px] sm:min-h-[162px] text-white flex items-center justify-between overflow-hidden p-4 sm:p-5 cursor-pointer group"
              style={{ backgroundColor: CARD_BG }}
            >
              {/* Right Side: Product Image with Smooth Left Fade */}
              <div className="absolute right-0 top-0 bottom-0 w-[58%] sm:w-[50%] overflow-hidden pointer-events-none">
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading="eager"
                  draggable={false}
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700 select-none"
                />

                {/* Smooth Gradient Overlay: Fades seamlessly from CARD_BG on the left to transparent on the right */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${CARD_BG} 0%, rgba(17, 24, 20, 0.8) 25%, rgba(17, 24, 20, 0.25) 55%, transparent 85%)`,
                  }}
                />
              </div>

              {/* Left Side: Modern Luxury Typography & Deal CTA */}
              <div className="relative z-10 max-w-[62%] sm:max-w-[55%] flex flex-col justify-center space-y-1 sm:space-y-1.5">
                
                {/* Badges Row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-stone-200 border border-white/15 shadow-sm">
                    {slide.tag}
                  </span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-sm tracking-wide ${slide.accentBg}`}>
                    {slide.discountBadge}
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight">
                  <span className="text-stone-300 block text-xs sm:text-sm font-normal">
                    {slide.title}
                  </span>
                  <span className="text-amber-300 font-extrabold">
                    {slide.highlightWord}
                  </span>
                </h2>

                {/* Appetizing Subtitle */}
                <p className="text-[11px] sm:text-xs text-stone-300/90 line-clamp-1 leading-snug">
                  {slide.subtitle}
                </p>

                {/* Action Coupon Pill */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleApply(e, slide.code, slide.category)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/25 text-white text-[11px] font-bold transition shadow-sm"
                  >
                    {appliedCode === slide.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-semibold">Code Applied!</span>
                      </>
                    ) : (
                      <>
                        <Tag className="w-3 h-3 text-amber-300" />
                        <span className="font-mono tracking-wider font-extrabold">{slide.code}</span>
                        <ArrowRight className="w-3 h-3 text-stone-300" />
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-stone-400 font-medium hidden xs:inline">
                    Tap to apply
                  </span>
                </div>

              </div>
            </div>
          ))}
        </motion.div>

        {/* Desktop Subtle Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-1.5 absolute right-4 bottom-4 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center border border-white/15 transition shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center border border-white/15 transition shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. Sleek Indicators (Placed OUTSIDE below the banner card) */}
      <div className="mt-2.5 flex items-center justify-center gap-1.5">
        {PROMO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-7 bg-forest shadow-sm'
                  : 'w-2 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to ${slide.title} offer`}
            />
          );
        })}
      </div>

    </div>
  );
};
