import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MessageCircle, Copy, Check, ArrowRight, Clock, MapPin, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CAFE_INFO } from '../data/menuData';

export const OrderSuccessModal: React.FC = () => {
  const { orderSuccessData, setOrderSuccessData, clearCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [showRawMsg, setShowRawMsg] = useState(false);

  const handleCopy = () => {
    if (orderSuccessData?.message) {
      navigator.clipboard?.writeText(orderSuccessData.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDone = () => {
    clearCart();
    setOrderSuccessData(null);
  };

  return (
    <AnimatePresence>
      {orderSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDone}
          className="fixed inset-0 bg-stone-900/70 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col"
        >
          {/* Top celebratory header */}
          <div className="bg-gradient-to-br from-forest via-forest to-sage p-6 text-white text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-300 animate-bounce" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 bg-white/10 px-3 py-1 rounded-full">
              WhatsApp Order Prepared
            </span>

            <h3 className="font-serif text-2xl font-bold mt-2">
              Order Dispatched!
            </h3>

            <p className="text-xs text-stone-200 mt-1 max-w-xs mx-auto">
              Your order details have been formatted and redirected to <strong>{CAFE_INFO.name}</strong> on WhatsApp.
            </p>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-4">
            
            {/* Quick Status Pill */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-forest shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Est. Time</span>
                  <span className="text-xs font-bold text-stone-800">
                    {orderSuccessData.orderType === 'delivery' ? '25 - 35 mins' : '15 - 20 mins'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-2.5">
                {orderSuccessData.orderType === 'delivery' ? (
                  <MapPin className="w-5 h-5 text-terracotta shrink-0" />
                ) : (
                  <Store className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Fulfillment</span>
                  <span className="text-xs font-bold text-stone-800">
                    {orderSuccessData.orderType === 'delivery' ? 'Home Delivery' : 'Cafe Pickup'}
                  </span>
                </div>
              </div>
            </div>

            {/* Re-open WhatsApp CTA */}
            <div className="space-y-2">
              <a
                href={orderSuccessData.waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Re-open WhatsApp Chat</span>
              </a>

              <p className="text-[11px] text-stone-400 text-center">
                Didn't open automatically? Click the button above to launch WhatsApp.
              </p>
            </div>

            {/* Expandable message preview */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowRawMsg(!showRawMsg)}
                className="w-full px-4 py-2.5 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 flex items-center justify-between transition"
              >
                <span>View Formatted WhatsApp Message</span>
                <span className="text-stone-400 text-[10px]">
                  {showRawMsg ? 'Hide ▲' : 'Show ▼'}
                </span>
              </button>

              {showRawMsg && (
                <div className="p-3 bg-stone-900 text-emerald-300 font-mono text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                  {orderSuccessData.message}
                </div>
              )}
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Message Text</span>
                </>
              )}
            </button>

          </div>

          {/* Footer Action */}
          <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
            <button
              onClick={handleDone}
              className="w-full py-2.5 rounded-2xl bg-forest hover:bg-forest-light text-white text-xs font-bold transition"
            >
              Start New Order
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
