import React from 'react';
import { Phone, Info, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CAFE_INFO } from '../data/menuData';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const { totalCount, openCart, setIsInfoModalOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200/70 transition-all shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
        
        {/* Brand identity with aesthetic Logo */}
        <div className="flex items-center gap-2">
          <Logo id="navbar-brand-logo" size="md" variant="header" />
          <span className="hidden md:inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/60 items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Open
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Direct WhatsApp / Call Button with Updated Number */}
          <a
            href={`tel:${CAFE_INFO.whatsappNumber}`}
            className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition border border-stone-200"
            title={`Call Cafe (${CAFE_INFO.displayPhone})`}
          >
            <Phone className="w-3.5 h-3.5 text-forest" />
            <span className="hidden sm:inline">Call Us</span>
          </a>

          {/* Cafe Info & Location Modal Trigger */}
          <button
            onClick={() => setIsInfoModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition border border-stone-200"
            title="Cafe Hours & Location"
            aria-label="Cafe information"
          >
            <Info className="w-4 h-4 text-forest" />
            <span className="hidden sm:inline">Cafe Info</span>
          </button>

          {/* Cart Header Button (Quick View) */}
          <button
            onClick={openCart}
            className="relative p-2 sm:px-3.5 sm:py-2 rounded-full bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline font-medium">Cart</span>
            {totalCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-terracotta text-white text-[11px] font-bold flex items-center justify-center animate-bounce">
                {totalCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Live Status Pill Sub-strip for mobile */}
      <div className="bg-forest/[0.03] border-t border-stone-100 py-1 px-4 text-center">
        <p className="text-[11px] text-stone-600 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span className="font-medium text-forest">{CAFE_INFO.statusText}</span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500">Free delivery over {CAFE_INFO.currency}{CAFE_INFO.freeDeliveryThreshold.toFixed(0)}</span>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <span className="text-emerald-700 font-semibold hidden sm:inline">WhatsApp: {CAFE_INFO.displayPhone}</span>
        </p>
      </div>
    </header>
  );
};
