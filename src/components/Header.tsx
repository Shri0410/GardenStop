import React from 'react';
import { Phone, Info, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CAFE_INFO } from '../data/menuData';
import { Logo } from './Logo';

export const Header: React.FC = React.memo(() => {
  const { totalCount, openCart, setIsInfoModalOpen, isStoreOpen, storeStatus } = useCart();
  const headerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!headerRef.current) return;
    const updateHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          '--header-height',
          `${headerRef.current.offsetHeight}px`
        );
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200/70 transition-all shadow-xs"
    >
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
        
        {/* Brand identity with aesthetic Logo */}
        <div className="flex items-center gap-2">
          <Logo id="navbar-brand-logo" size="md" variant="header" />
          {isStoreOpen ? (
            <span className="hidden md:inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/60 items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Open (11:30 AM - 11:30 PM)
            </span>
          ) : (
            <span className="hidden md:inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Closed (Opens 11:30 AM)
            </span>
          )}
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
      <div className={`${isStoreOpen ? 'bg-forest/[0.03]' : 'bg-rose-50/70 border-rose-100'} border-t border-stone-100 py-1 px-4 text-center transition-colors`}>
        <p className="text-[11px] text-stone-600 flex items-center justify-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-500' : 'bg-rose-500'} inline-block`}></span>
          <span className={`font-semibold ${isStoreOpen ? 'text-forest' : 'text-rose-800'}`}>
            {isStoreOpen ? 'Open Now • Accepting Orders (11:30 AM - 11:30 PM)' : 'Closed • Online Orders Open at 11:30 AM'}
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500">Free delivery over {CAFE_INFO.currency}{CAFE_INFO.freeDeliveryThreshold.toFixed(0)}</span>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <span className="text-emerald-700 font-semibold hidden sm:inline">WhatsApp: {CAFE_INFO.displayPhone}</span>
        </p>
      </div>
    </header>
  );
});
