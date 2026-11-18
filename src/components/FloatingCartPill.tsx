import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CAFE_INFO } from '../data/menuData';

export const FloatingCartPill: React.FC = () => {
  const { totalCount, subtotal, openCart, isCartOpen } = useCart();

  // Don't show floating pill if cart is open or empty
  if (totalCount === 0 || isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none flex justify-center pb-safe">
        <motion.button
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCart}
          className="pointer-events-auto w-full max-w-md bg-forest/95 backdrop-blur-xl text-white rounded-3xl p-3.5 sm:p-4 shadow-cart border border-emerald-500/20 flex items-center justify-between gap-3 cursor-pointer group"
          aria-label="View shopping cart"
        >
          {/* Left: Items count & Subtotal */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/10 shadow-inner">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-terracotta text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
                {totalCount}
              </span>
            </div>
            
            <div className="text-left">
              <p className="text-[11px] font-semibold text-emerald-200/90 tracking-wide uppercase">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} in basket
              </p>
              <p className="font-bold text-base sm:text-lg text-white leading-tight">
                {CAFE_INFO.currency}{subtotal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Right: View Cart CTA */}
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500/20 group-hover:bg-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-bold border border-emerald-400/20 transition">
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>
      </div>
    </AnimatePresence>
  );
};
