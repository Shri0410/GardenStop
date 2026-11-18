import React from 'react';
import { motion } from 'framer-motion';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/menuData';

interface CategoryNavProps {
  activeCategory: CategoryId;
  setActiveCategory: (cat: CategoryId) => void;
  categoryCounts: Record<CategoryId, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  setActiveCategory,
  categoryCounts,
}) => {
  return (
    <div className="sticky top-[69px] sm:top-[74px] z-20 bg-[#FBF9F5]/95 backdrop-blur-md py-2.5 border-b border-stone-200/50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] ?? 0;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-stone-700 bg-white/80 hover:bg-white hover:text-stone-900 border border-stone-200/80 shadow-xs'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-forest rounded-full shadow-md -z-0"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                  />
                )}
                <span className="relative z-10 text-sm leading-none">{cat.icon}</span>
                <span className="relative z-10">{cat.name}</span>
                <span
                  className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                    isActive
                      ? 'bg-emerald-700 text-emerald-100'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
