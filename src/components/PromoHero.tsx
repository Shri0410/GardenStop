import React, { useState, Suspense, lazy } from 'react';
import { Sparkles, CalendarHeart } from 'lucide-react';
import { CategoryId } from '../types';

const CelebrationBookingModal = lazy(() =>
  import('./CelebrationBookingModal').then(m => ({ default: m.CelebrationBookingModal }))
);

interface PromoHeroProps {
  onSelectCategory?: (cat: CategoryId) => void;
}

export const PromoHero: React.FC<PromoHeroProps> = React.memo(() => {
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 pt-2.5 pb-2">
        {/* Master Interactive Banner Container */}
        <div
          onClick={() => setIsCelebrationModalOpen(true)}
          className="relative overflow-hidden rounded-[22px] sm:rounded-3xl shadow-md hover:shadow-xl border border-stone-200/80 cursor-pointer group transition-all duration-300 hover:scale-[1.008] active:scale-[0.985] bg-[#0e1713] select-none"
          role="button"
          tabIndex={0}
          aria-label="Book Your Birthday Celebration at Garden Stop"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsCelebrationModalOpen(true);
            }
          }}
        >
          {/* Responsive Banner Image */}
          <div className="relative w-full aspect-[1024/384] overflow-hidden">
            <picture>
              <source srcSet="/images/banner-birthday.webp" type="image/webp" />
              <img
                src="/images/banner-birthday.jpg"
                alt="Garden Stop - Celebrate Your Birthday With Us! Delicious Food, Great Vibes, Unforgettable Moments. Book Your Celebration"
                width={1024}
                height={384}
                className="w-full h-full object-cover object-center select-none pointer-events-none transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable={false}
              />
            </picture>

            {/* Subtle Gradient Hover Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Floating Interactive Callout Pill on Bottom Right */}
            <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-bold shadow-lg group-hover:bg-amber-400 group-hover:text-stone-900 group-hover:border-amber-400 transition-all duration-300">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
                <span>Tap to Book Celebration</span>
                <CalendarHeart className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Birthday Celebration Booking Popup Form Modal - Lazy loaded on demand */}
      {isCelebrationModalOpen && (
        <Suspense fallback={null}>
          <CelebrationBookingModal
            isOpen={isCelebrationModalOpen}
            onClose={() => setIsCelebrationModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
});
