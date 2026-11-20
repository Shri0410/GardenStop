import React from 'react';
import { motion } from 'framer-motion';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/menuData';

interface CategoryNavProps {
  activeCategory: CategoryId;
  setActiveCategory: (cat: CategoryId) => void;
  categoryCounts?: Record<CategoryId, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <div className="sticky top-[61px] sm:top-[65px] z-20 bg-[#FBF9F5]/95 backdrop-blur-md py-2.5 border-b border-stone-200/50 shadow-xs">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                whileTap={{ scale: 0.92 }}
                title={cat.name}
                aria-label={cat.name}
                aria-pressed={isActive}
                className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'ring-2.5 ring-forest ring-offset-2 ring-offset-[#FBF9F5] shadow-md scale-105'
                    : 'border border-stone-200/90 shadow-2xs opacity-80 hover:opacity-100 hover:scale-[1.02]'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute inset-0 border-2 border-forest rounded-2xl pointer-events-none"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
