import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Flame, Plus, Minus, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CAFE_INFO } from '../data/menuData';

export const FoodDetailModal: React.FC = () => {
  const {
    selectedDetailItem,
    setSelectedDetailItem,
    addToCart,
    updateQuantity,
    getItemQuantity,
    openCart,
  } = useCart();

  // Lock body scroll cleanly while detail modal is open
  useEffect(() => {
    if (selectedDetailItem) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [selectedDetailItem]);

  const handleGoToCart = () => {
    setSelectedDetailItem(null);
    openCart();
  };

  const item = selectedDetailItem;
  const quantity = item ? getItemQuantity(item.id) : 0;

  return (
    <AnimatePresence>
      {item && (
        <div
          key="food-detail-overlay-root"
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 select-none pointer-events-auto"
        >
          {/* 1. Backdrop */}
          <motion.div
            key="food-detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedDetailItem(null)}
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-md z-10"
          />

          {/* 2. Centered Modal Popup Card (Floating in exact center of mobile screen) */}
          <motion.div
            key="food-detail-card"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm sm:max-w-md bg-[#FBF9F5] rounded-[28px] sm:rounded-3xl shadow-2xl overflow-hidden z-20 max-h-[82dvh] sm:max-h-[86vh] flex flex-col border border-stone-200/90"
          >
            {/* Prominent High-Contrast Close Button */}
            <button
              type="button"
              onClick={() => setSelectedDetailItem(null)}
              className="absolute top-3 right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition shadow-lg active:scale-90"
              aria-label="Close product details"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>

            {/* Hero Product Image */}
            <div className="relative h-36 xs:h-40 sm:h-48 w-full bg-stone-100 overflow-hidden shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Badges on Hero Image */}
              <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <div className="bg-white/95 backdrop-blur-md p-1 rounded-md shadow-sm">
                    {item.isVeg ? (
                      <div className="w-3 h-3 rounded-[3px] border-[1.5px] border-emerald-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                      </div>
                    ) : (
                      <div className="w-3 h-3 rounded-[3px] border-[1.5px] border-rose-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-600"></div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-200 drop-shadow-sm">
                    {item.isVeg ? 'Vegetarian Dish' : 'Non-Vegetarian'}
                  </span>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-forest text-[10px] font-bold text-emerald-200 border border-emerald-400/30 shadow-sm">
                    {item.tags[0]}
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Content Details */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 min-h-0 overscroll-contain">
              
              {/* Title & Price Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-forest leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-stone-300">•</span>
                    <span className="text-[11px] text-stone-500 font-medium">{item.reviewsCount} verified reviews</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-widest block font-medium">Price</span>
                  <span className="font-bold text-lg sm:text-xl text-forest">
                    {CAFE_INFO.currency}{item.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {item.description}
              </p>

              {/* Micro Specs (Prep time, Calories, Spice level) */}
              <div className="grid grid-cols-3 gap-2 py-0.5">
                <div className="p-2 rounded-2xl bg-white border border-stone-200/80 text-center shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-forest mx-auto mb-1" />
                  <span className="text-[9px] text-stone-400 block uppercase font-bold">Prep Time</span>
                  <span className="text-[11px] font-semibold text-stone-800">{item.prepTime || '10-15 mins'}</span>
                </div>

                <div className="p-2 rounded-2xl bg-white border border-stone-200/80 text-center shadow-2xs">
                  <Flame className="w-3.5 h-3.5 text-terracotta mx-auto mb-1" />
                  <span className="text-[9px] text-stone-400 block uppercase font-bold">Calories</span>
                  <span className="text-[11px] font-semibold text-stone-800">{item.calories || 'Organic'}</span>
                </div>

                <div className="p-2 rounded-2xl bg-white border border-stone-200/80 text-center shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[9px] text-stone-400 block uppercase font-bold">Spice Level</span>
                  <span className="text-[11px] font-semibold text-stone-800">{item.spiceLevel || 'Mild'}</span>
                </div>
              </div>

              {/* Key Fresh Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                    Key Fresh Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {item.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-sage/15 text-forest text-[11px] font-medium border border-sage/25"
                      >
                        🌿 {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Botanical Freshness Guarantee */}
              <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 text-[10px] sm:text-[11px] text-emerald-800 flex items-center gap-2">
                <span className="text-sm">🍃</span>
                <span>Crafted freshly from farm ingredients upon WhatsApp order confirmation.</span>
              </div>

            </div>

            {/* Sticky Bottom Action Bar - Framed inside centered card */}
            <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200/90 flex items-center justify-between gap-3 shrink-0 shadow-sm rounded-b-[28px] sm:rounded-b-3xl">
              <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-stone-400">Total Price</span>
                <span className="font-bold text-base sm:text-lg text-forest">
                  {CAFE_INFO.currency}{(item.price * Math.max(1, quantity)).toFixed(2)}
                </span>
              </div>

              {quantity === 0 ? (
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="flex-1 max-w-[180px] sm:max-w-xs px-4 py-2.5 sm:py-3 rounded-2xl bg-forest hover:bg-forest-light active:scale-95 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4 text-emerald-300" />
                  <span>Add to Cart</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-2xl bg-forest text-white shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 hover:bg-forest-light text-white transition active:bg-forest-dark"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 font-bold text-xs sm:text-sm text-emerald-200 min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 hover:bg-forest-light text-white transition active:bg-forest-dark"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoToCart}
                    className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    aria-label="View Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-100" />
                    <span>View Cart</span>
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
