import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  User,
  Phone,
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { CAFE_INFO } from "../data/menuData";
import {
  CelebrationBookingParams,
  generateCelebrationWhatsAppLink,
} from "../utils/whatsapp";

interface CelebrationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CelebrationBookingModal: React.FC<
  CelebrationBookingModalProps
> = ({ isOpen, onClose }) => {
  // Format today's date as YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState("Evening Party (6:00 PM - 9:00 PM)");
  const [guestCount, setGuestCount] = useState("5 - 10 Guests");
  const [specialRequests, setSpecialRequests] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const TIME_SLOTS = [
    "Afternoon (1:00 PM - 4:00 PM)",
    "Evening Party (6:00 PM - 9:00 PM)",
    "Night Celebration (8:30 PM - 11:00 PM)",
    "Custom Timing",
  ];

  const GUEST_OPTIONS = [
    "2 - 4 Guests",
    "5 - 10 Guests",
    "10 - 20 Guests",
    "20+ Guests (Party)",
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = "Please enter your full name";
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = "Please enter a valid 10-digit WhatsApp number";
    }
    if (!date) {
      errs.date = "Please select the celebration date";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const params: CelebrationBookingParams = {
      name: name.trim(),
      phone: phone.trim(),
      date,
      timeSlot,
      guestCount,
      specialRequests: specialRequests.trim() || undefined,
    };

    const link = generateCelebrationWhatsAppLink(
      CAFE_INFO.whatsappNumber,
      params,
    );

    // Open WhatsApp in a new tab
    window.open(link, "_blank");

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative w-full max-w-lg bg-[#FAF8F5] rounded-[28px] sm:rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden z-10 my-auto"
        >
          {/* Header Banner Header */}
          <div className="relative bg-gradient-to-br from-[#12241b] via-[#1a382b] to-[#0f1d16] text-white p-5 sm:p-6 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold tracking-wide uppercase mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Party & Celebration Booking
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  Celebrate Your Birthday With Us! 🎉
                </h3>
                <p className="text-xs text-stone-300/90 mt-1 leading-relaxed">
                  Reserve your special table, party vibes & delicious pure-veg
                  food at Garden Stop.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-stone-200 hover:text-white flex items-center justify-center transition shrink-0 ml-2 border border-white/15"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          {isSubmitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-xl font-bold text-stone-800">
                Opening WhatsApp...
              </h4>
              <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                Your celebration details have been formatted and WhatsApp is
                opening now to message the cafe owner directly!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar"
            >
              {/* 1. Name Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-forest" />
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="Full Name"
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition shadow-2xs ${
                    errors.name
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-stone-200 focus:ring-forest/20 focus:border-forest"
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* 2. WhatsApp Number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-forest" />
                  WhatsApp / Contact Number{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-stretch">
                  <span className="inline-flex items-center justify-center gap-1.5 px-3 rounded-l-2xl border border-r-0 border-stone-200 bg-stone-100 text-stone-700 text-xs font-bold whitespace-nowrap shrink-0 select-none">
                    <svg
                      className="w-4 h-2.5 rounded-[2px] shadow-2xs shrink-0 overflow-hidden"
                      viewBox="0 0 640 480"
                      aria-hidden="true"
                    >
                      <path fill="#FF9933" d="M0 0h640v160H0z" />
                      <path fill="#FFFFFF" d="M0 160h640v160H0z" />
                      <path fill="#128807" d="M0 320h640v160H0z" />
                      <circle
                        cx="320"
                        cy="240"
                        r="40"
                        fill="none"
                        stroke="#000080"
                        strokeWidth="6"
                      />
                      <circle cx="320" cy="240" r="8" fill="#000080" />
                    </svg>
                    <span>IN</span>
                    <span className="text-stone-300 font-normal">|</span>
                    <span>+91</span>
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setPhone(val);
                      if (errors.phone)
                        setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    maxLength={10}
                    placeholder="Contact number"
                    className={`w-full min-w-0 px-3.5 py-2.5 rounded-r-2xl bg-white border text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition shadow-2xs ${
                      errors.phone
                        ? "border-rose-400 focus:ring-rose-200"
                        : "border-stone-200 focus:ring-forest/20 focus:border-forest"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* 3. Celebration Date */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-forest" />
                  Celebration Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date)
                      setErrors((prev) => ({ ...prev, date: "" }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border text-sm text-stone-800 focus:outline-none focus:ring-2 transition shadow-2xs ${
                    errors.date
                      ? "border-rose-400 focus:ring-rose-200"
                      : "border-stone-200 focus:ring-forest/20 focus:border-forest"
                  }`}
                />
                {errors.date && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.date}
                  </p>
                )}
              </div>

              {/* 4. Preferred Time Slot */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-forest" />
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`px-2.5 py-2 rounded-xl text-[11px] font-semibold text-left transition border ${
                          isSelected
                            ? "bg-forest text-white border-forest shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:border-forest/40"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Number of Guests */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-forest" />
                  Estimated Number of Guests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GUEST_OPTIONS.map((opt) => {
                    const isSelected = guestCount === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setGuestCount(opt)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-center transition border ${
                          isSelected
                            ? "bg-forest text-white border-forest shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:border-forest/40"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Special Requests / Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-forest" />
                  Cake, Decor & Special Requests{" "}
                  <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Need balloon decoration, Choco Lava Cake, favorite background music..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-white border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition shadow-2xs resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Booking on WhatsApp</span>
                </button>
                <p className="text-[11px] text-stone-500 text-center mt-2 flex items-center justify-center gap-1">
                  🔒 Directly sends your inquiry to WhatsApp (
                  <span className="font-semibold text-stone-700">
                    +91 90499 25719
                  </span>
                  )
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
