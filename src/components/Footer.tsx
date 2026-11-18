import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Heart,
  MessageCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Leaf,
  Store,
} from 'lucide-react';
import { CAFE_INFO } from '../data/menuData';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#0D1A13] via-[#09130D] to-[#050A07] text-stone-300 pt-12 pb-32 sm:pb-20 mt-14 border-t border-emerald-900/50 overflow-hidden">
      
      {/* Background Ambient Botanical Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-8">
        
        {/* 1. Header Row: Brand Identity & Instant WhatsApp Support Banner */}
        <div className="p-5 sm:p-6 rounded-[28px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl">
          <div className="space-y-2">
            <Logo size="lg" variant="dark" />
            <p className="text-xs sm:text-sm text-stone-400 max-w-md leading-relaxed mt-1">
              Farm-fresh sourdough burgers, wood-fired artisanal pizzas, and single-origin cold brews—crafted fresh on order and delivered to your doorstep.
            </p>
            
            {/* Value Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold border border-emerald-500/20">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Organic Flours</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 text-[11px] font-semibold border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Bio-Degradable Packaging</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 text-stone-300 text-[11px] font-semibold border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Instant Guest Checkout</span>
              </span>
            </div>
          </div>

          {/* Quick WhatsApp Connect Action Card */}
          <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 pt-2 md:pt-0">
            <a
              href={`https://wa.me/${CAFE_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-glow transition-all active:scale-95 group"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order / Chat on WhatsApp</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online • Typical reply in under 2 mins</span>
            </div>
          </div>
        </div>

        {/* 2. Bento Grid of Key Cafe Information (3 Modern Interactive Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          
          {/* Card 1: Sanctuary Address */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.07] transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Sanctuary Location
                </h4>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {CAFE_INFO.address}
                </p>
                <p className="text-[11px] text-stone-500 mt-1 italic">
                  {CAFE_INFO.landmark}
                </p>
              </div>
            </div>

            <a
              href={CAFE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 mt-3.5 transition group-hover:underline"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Kitchen Hours */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.07] transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Kitchen Hours
                </h4>
                <p className="text-xs text-stone-200 font-semibold mt-1">
                  Monday – Sunday
                </p>
                <p className="text-xs text-stone-300 mt-0.5">
                  9:00 AM – 11:00 PM (Daily)
                </p>
              </div>
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-semibold text-emerald-300">
                Kitchen Open & Delivering
              </span>
            </div>
          </div>

          {/* Card 3: Direct Phone & Hospitality */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.07] transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center text-terracotta">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Direct Line
                </h4>
                <p className="text-sm font-mono font-bold text-white mt-1">
                  {CAFE_INFO.displayPhone}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Orders dispatched directly via WhatsApp
                </p>
              </div>
            </div>

            <a
              href={`tel:${CAFE_INFO.whatsappNumber}`}
              className="mt-3.5 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>Call Cafe Directly</span>
            </a>
          </div>

        </div>

        {/* 3. Social Pills & Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium">Follow & Connect:</span>
            
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${CAFE_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 border border-white/10 transition"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Google Map Link */}
            <a
              href={CAFE_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition"
              aria-label="Location"
            >
              <Store className="w-4 h-4" />
            </a>
          </div>

          <div className="text-[11px] text-stone-500 text-center sm:text-right">
            <span>Free delivery on orders above {CAFE_INFO.currency}{CAFE_INFO.freeDeliveryThreshold.toFixed(0)}</span>
            <span className="mx-2">•</span>
            <span>Zero account registration required</span>
          </div>

        </div>

        {/* 4. Bottom Legal & Signature Line */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} {CAFE_INFO.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-stone-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta animate-pulse" />
            <span>for botanical coffee & sourdough lovers</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
