import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, ExternalLink, Leaf, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CAFE_INFO } from '../data/menuData';
import { Logo } from './Logo';

export const CafeInfoModal: React.FC = () => {
  const { isInfoModalOpen, setIsInfoModalOpen } = useCart();

  return (
    <AnimatePresence>
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsInfoModalOpen(false)}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#FBF9F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Top Header with botanical banner */}
          <div className="bg-forest px-6 py-6 text-white relative">
            <button
              onClick={() => setIsInfoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-start gap-2">
              <Logo size="lg" variant="dark" />
              <p className="text-emerald-100/90 text-xs mt-1">
                {CAFE_INFO.subtitle}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-stone-black">
            
            {/* Story */}
            <div className="p-4 rounded-2xl bg-white border border-stone-100 shadow-sm">
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {CAFE_INFO.aboutText}
              </p>
            </div>

            {/* Quick Details List */}
            <div className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-stone-100">
                <div className="w-9 h-9 rounded-xl bg-sage/10 text-forest flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-forest" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-forest uppercase tracking-wider">Address & Location</h4>
                  <p className="text-xs text-stone-700 mt-0.5 leading-snug">
                    {CAFE_INFO.address}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5 italic">
                    {CAFE_INFO.landmark}
                  </p>
                  <a
                    href={CAFE_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta hover:text-terracotta-dark mt-2"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-stone-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-forest uppercase tracking-wider">Kitchen Timings</h4>
                  <p className="text-xs text-stone-700 mt-0.5 font-medium">
                    {CAFE_INFO.timings}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    ● Currently Accepting Orders
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-forest uppercase tracking-wider">Phone / WhatsApp</h4>
                    <p className="text-xs text-stone-700 mt-0.5 font-semibold">
                      {CAFE_INFO.displayPhone}
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${CAFE_INFO.whatsappNumber}`}
                  className="px-3.5 py-1.5 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold transition"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px]">100% Organic Flours</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-900 text-xs">
                <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium text-[11px]">Biodegradable Packaging</span>
              </div>
            </div>

          </div>

          {/* Footer CTA */}
          <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
            <button
              onClick={() => setIsInfoModalOpen(false)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-forest hover:bg-forest-light text-white text-xs font-bold transition shadow-sm"
            >
              Back to Menu
            </button>
          </div>

        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
