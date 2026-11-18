import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Minus, Clock, Flame } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { CAFE_INFO } from '../data/menuData';

interface FoodCardProps {
  item: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart, updateQuantity, getItemQuantity, setSelectedDetailItem } = useCart();
  const quantity = getItemQuantity(item.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      onClick={() => setSelectedDetailItem(item)}
      className="group relative flex flex-col justify-between bg-white rounded-3xl border border-stone-100 shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden cursor-pointer select-none"
    >
      {/* Clickable Image & Info Zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`View details for ${item.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedDetailItem(item);
          }
        }}
      >
        {/* Food Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient Overlay for bottom text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Top Badges Row */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {/* Veg / Non-Veg Indicator */}
            <div className="bg-white/95 backdrop-blur-md p-1 rounded-md shadow-sm border border-stone-200/80">
              {item.isVeg ? (
                <div className="w-3.5 h-3.5 rounded-[3px] border-[1.5px] border-emerald-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-[3px] border-[1.5px] border-rose-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div>
                </div>
              )}
            </div>

            {/* Special Tag if available */}
            {item.tags && item.tags.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-forest/90 backdrop-blur-md text-[10px] font-bold text-emerald-200 border border-emerald-400/20 shadow-sm">
                {item.tags[0]}
              </span>
            )}
          </div>

          {/* Rating Badge Overlay at bottom-left of image */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-semibold">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{item.rating.toFixed(1)}</span>
            <span className="text-stone-400 text-[10px]">({item.reviewsCount})</span>
          </div>

          {/* Prep time badge bottom-right */}
          {item.prepTime && (
            <div className="absolute bottom-2.5 right-2.5 hidden xs:flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 text-[10px]">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{item.prepTime}</span>
            </div>
          )}
        </div>

        {/* Item Content Details */}
        <div className="p-3 sm:p-4 pb-2">
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-semibold text-xs sm:text-sm text-stone-black leading-snug line-clamp-1 group-hover:text-forest transition">
              {item.name}
            </h3>
          </div>

          <p className="text-[11px] sm:text-xs text-stone-muted line-clamp-2 leading-relaxed h-[32px] sm:h-[34px]">
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Animated Quantity Selector */}
      <div className="p-3 sm:p-4 pt-1 sm:pt-2 flex items-center justify-between border-t border-stone-50 mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Price</span>
          <span className="font-bold text-sm sm:text-base text-forest">
            {CAFE_INFO.currency}{item.price.toFixed(2)}
          </span>
        </div>

        {/* Quantity Controller Pill */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {quantity === 0 ? (
              <motion.button
                key="add-btn"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                whileTap={{ scale: 0.92 }}
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item);
                }}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-forest hover:bg-forest-light text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:shadow-none"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-300" />
                <span>Add</span>
              </motion.button>
            ) : (
              <motion.div
                key="qty-stepper"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center rounded-2xl bg-forest text-white shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item.id, -1);
                  }}
                  className="p-1.5 sm:p-2 hover:bg-forest-light text-white transition active:bg-forest-dark"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-bold text-xs sm:text-sm text-emerald-200 min-w-[20px] text-center select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item.id, 1);
                  }}
                  className="p-1.5 sm:p-2 hover:bg-forest-light text-white transition active:bg-forest-dark"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
