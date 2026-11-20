import React from 'react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/menuData';

interface CategoryNavProps {
  activeCategory: CategoryId;
  setActiveCategory: (cat: CategoryId) => void;
  categoryCounts?: Record<CategoryId, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = React.memo(({
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <div
      className="sticky z-20 bg-white/95 backdrop-blur-md border-b border-stone-200/60 shadow-2xs"
      style={{ top: 'var(--header-height, 86px)' }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth pt-2 pb-1.5 px-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                title={cat.name}
                aria-label={cat.name}
                aria-pressed={isActive}
                className="group flex flex-col items-center shrink-0 cursor-pointer focus:outline-none select-none transition-transform duration-200"
              >
                {/* 1. Food PNG Image with Transparent Background */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  <picture>
                    <source srcSet={cat.image.replace(/\.(png|jpg)$/, '.webp')} type="image/webp" />
                    <img
                      src={cat.image}
                      alt={cat.name}
                      width={80}
                      height={80}
                      decoding="async"
                      className={`w-full h-full object-contain pointer-events-none drop-shadow-sm transition-transform duration-200 ease-out ${
                        isActive
                          ? 'scale-105 -translate-y-0.5 group-hover:scale-110'
                          : 'group-hover:scale-110 group-hover:-translate-y-0.5'
                      }`}
                      loading="eager"
                    />
                  </picture>
                </div>

                {/* 2. Category Name Text */}
                <span
                  className={`mt-1 text-xs sm:text-sm tracking-tight text-center whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'font-extrabold text-stone-900'
                      : 'font-medium text-stone-500 group-hover:text-stone-800'
                  }`}
                >
                  {cat.name}
                </span>

                {/* 3. Red Active Indicator Line */}
                <div className="relative w-full h-[3px] mt-1.5 flex justify-center">
                  {isActive ? (
                    <div className="absolute inset-x-0 h-[3px] bg-[#E23744] rounded-full transition-all" />
                  ) : (
                    <div className="h-[3px] w-full bg-transparent" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
