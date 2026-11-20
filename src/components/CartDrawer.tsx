import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Bike,
  Store,
  MapPin,
  Phone,
  User,
  CreditCard,
  QrCode,
  Banknote,
  Send,
  Tag,
  AlertCircle,
  Sparkles,
  ChevronDown,
  LocateFixed,
  Loader2,
  CheckCircle2,
  Compass,
  Clock,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { CAFE_INFO } from "../data/menuData";
import {
  generateWhatsAppLink,
  buildWhatsAppOrderMessage,
} from "../utils/whatsapp";
import confetti from "canvas-confetti";

const QUICK_NOTES = [
  "Make fries extra crispy 🍟",
  "Less spicy please 🌶️",
  "No onions in burger 🧅",
  "Less ice in drinks 🧊",
  "Please pack cutlery 🍴",
];

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    subtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    orderType,
    setOrderType,
    customerInfo,
    updateCustomerField,
    appliedPromo,
    applyPromo,
    removePromo,
    setOrderSuccessData,
    isStoreOpen,
    storeStatus,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Locating your GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const gmapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        updateCustomerField("locationUrl", gmapsLink);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en",
              },
            },
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const cleanParts = [
              addr.road || addr.suburb || addr.neighbourhood,
              addr.city_district || addr.suburb,
              addr.city || addr.town || addr.village,
              addr.postcode,
            ].filter(Boolean);

            const resolvedAddress =
              cleanParts.length > 0 ? cleanParts.join(", ") : data.display_name;
            updateCustomerField("address", resolvedAddress);
            if (addr.neighbourhood || addr.suburb || addr.city_district) {
              updateCustomerField(
                "landmark",
                `Near ${addr.neighbourhood || addr.suburb || addr.city_district}`,
              );
            }
            setLocationStatus(`📍 Detected: ${resolvedAddress}`);
          } else {
            updateCustomerField(
              "address",
              `GPS Pin: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            );
            setLocationStatus(
              `📍 GPS Pin: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            );
          }
        } catch {
          updateCustomerField(
            "address",
            `GPS Pin: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          );
          setLocationStatus(
            `📍 GPS Pin: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          );
        } finally {
          setIsLocating(false);
          if (validationErrors.address) {
            setValidationErrors((prev) => ({ ...prev, address: "" }));
          }
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setLocationStatus(
            "⚠️ Location permission denied. Please type address.",
          );
        } else {
          setLocationStatus(
            "⚠️ GPS signal weak. Please enter address manually.",
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  // Lock body scroll when cart is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;

    const result = applyPromo(promoInput);
    if (!result.success) {
      setPromoError(result.message);
    } else {
      setPromoInput("");
    }
  };

  const handleQuickNote = (note: string) => {
    const current = customerInfo.notes || "";
    if (current.includes(note)) return;
    const updated = current ? `${current}, ${note}` : note;
    updateCustomerField("notes", updated);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerInfo.name.trim()) {
      errors.name = "Please enter your full name";
    }

    const cleanPhone = customerInfo.phone.replace(/[^0-9]/g, "");
    if (!customerInfo.phone.trim() || cleanPhone.length < 8) {
      errors.phone = "Please enter a valid phone or WhatsApp number";
    }

    if (orderType === "delivery") {
      if (!customerInfo.address.trim()) {
        errors.address = "Please provide complete delivery address";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrderViaWhatsApp = () => {
    if (!isStoreOpen) {
      alert(storeStatus.orderingDisabledMessage || 'Garden Stop is currently closed. We accept orders daily between 11:30 AM and 11:30 PM.');
      return;
    }
    if (cartItems.length === 0) return;

    if (!validateForm()) {
      // Scroll to first error on mobile
      const errorField = document.querySelector('[data-error="true"]');
      errorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    const params = {
      cartItems,
      customer: customerInfo,
      subtotal,
      deliveryFee,
      discount: discountAmount,
      grandTotal,
    };

    const waLink = generateWhatsAppLink(CAFE_INFO.whatsappNumber, params);
    const message = buildWhatsAppOrderMessage(params);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#1E3A2B", "#E07A5F", "#D97706", "#2D5A43"],
      });
    } catch {
      // ignore
    }

    // Set order success data for preview & re-open
    setOrderSuccessData({
      message,
      waLink,
      total: grandTotal,
      orderType,
    });

    // Close the cart sheet
    closeCart();

    // Open WhatsApp in a new window/tab
    setTimeout(() => {
      window.open(waLink, "_blank", "noopener,noreferrer");
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          key="cart-drawer-root"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-10"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md sm:max-w-xl bg-[#FBF9F5] rounded-[28px] sm:rounded-3xl shadow-2xl border border-stone-200 z-20 max-h-[85dvh] sm:max-h-[88vh] flex flex-col overflow-hidden"
          >
            {/* Sheet Header */}
            <div className="py-3 px-4 sm:px-6 border-b border-stone-200/60 bg-white/80 backdrop-blur-md shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-forest/10 flex items-center justify-center text-forest shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-forest leading-tight">
                    Your Order Cart
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {totalCount} {totalCount === 1 ? "item" : "items"} • Garden Stop Botanical Cafe
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition active:scale-95"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Store Closed Warning Banner */}
              {!isStoreOpen && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 shadow-xs">
                  <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-900">Online Ordering Currently Closed</h4>
                    <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                      Garden Stop accepts online orders daily between <strong>11:30 AM</strong> and <strong>11:30 PM</strong>. Orders cannot be dispatched right now.
                    </p>
                  </div>
                </div>
              )}

              {/* 1. ORDER TYPE SWITCHER TOGGLE */}
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Step 1: Choose Order Type
                </label>
                <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-stone-200/70 border border-stone-300/40">
                  <button
                    type="button"
                    onClick={() => setOrderType("delivery")}
                    className={`relative py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      orderType === "delivery"
                        ? "bg-forest text-white shadow-md"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span>🛵 Home Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType("pickup")}
                    className={`relative py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      orderType === "pickup"
                        ? "bg-forest text-white shadow-md"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>🛍️ Takeaway / Pickup</span>
                  </button>
                </div>

                {/* Delivery / Pickup Info Pill */}
                <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between px-1">
                  {orderType === "delivery" ? (
                    <span>
                      🚀 Delivered in ~25-35 mins •{" "}
                      {subtotal >= CAFE_INFO.freeDeliveryThreshold ? (
                        <span className="text-emerald-700 font-semibold">
                          Free Delivery Unlocked!
                        </span>
                      ) : (
                        <span>
                          Add {CAFE_INFO.currency}
                          {(CAFE_INFO.freeDeliveryThreshold - subtotal).toFixed(
                            2,
                          )}{" "}
                          more for Free Delivery
                        </span>
                      )}
                    </span>
                  ) : (
                    <span>
                      🛍️ Ready for pickup at cafe counter in ~15-20 mins • No
                      delivery fee
                    </span>
                  )}
                </div>
              </div>

              {/* 2. ITEM SUMMARY LIST */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Step 2: Review Items ({totalCount})
                  </label>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8 px-4 rounded-3xl bg-white border border-stone-100 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-2">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-stone-700">
                      Your basket is empty
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Add some delicious sourdough pizzas or truffle burgers!
                    </p>
                    <button
                      onClick={closeCart}
                      className="mt-3 px-4 py-2 rounded-xl bg-forest text-white text-xs font-semibold"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cartItems.map((ci) => (
                      <div
                        key={ci.item.id}
                        className="p-3 rounded-2xl bg-white border border-stone-100 shadow-sm flex items-center justify-between gap-3"
                      >
                        {/* Thumbnail & Title */}
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={ci.item.image}
                            alt={ci.item.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-stone-100"
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs sm:text-sm text-stone-black truncate">
                              {ci.item.name}
                            </h4>
                            <p className="text-xs text-forest font-bold">
                              {CAFE_INFO.currency}
                              {ci.item.price.toFixed(2)}
                              <span className="text-[11px] text-stone-400 font-normal">
                                {" "}
                                / each
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity Modifier & Line Total */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center rounded-xl bg-stone-100 border border-stone-200">
                            <button
                              onClick={() => updateQuantity(ci.item.id, -1)}
                              className="p-1.5 text-stone-600 hover:text-stone-900 transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-forest min-w-[20px] text-center">
                              {ci.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(ci.item.id, 1)}
                              className="p-1.5 text-stone-600 hover:text-stone-900 transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right min-w-[55px]">
                            <span className="font-bold text-xs sm:text-sm text-stone-black">
                              {CAFE_INFO.currency}
                              {(ci.item.price * ci.quantity).toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => removeFromCart(ci.item.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. ORDER NOTES INPUT & QUICK CHIPS */}
              {cartItems.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Special Cooking Request (Optional)
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) =>
                      updateCustomerField("notes", e.target.value)
                    }
                    placeholder="e.g. Please make fries extra crispy, no onions, extra spicy ketchup..."
                    rows={2}
                    className="w-full p-3 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest shadow-sm resize-none"
                  />

                  {/* Quick selection chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {QUICK_NOTES.map((note, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickNote(note)}
                        className="text-[11px] px-2.5 py-1 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 transition"
                      >
                        + {note}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. CUSTOMER INFORMATION FORM (PREMIUM GUEST CHECKOUT) */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/80 shadow-soft space-y-4">
                  {/* Header with Step indicator */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                        <User className="w-4 h-4 text-forest" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-forest tracking-tight">
                          Delivery & Contact Details
                        </h4>
                        <p className="text-[10px] text-stone-400">
                          Guest Checkout • Direct to WhatsApp
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      No Sign-in Needed
                    </span>
                  </div>

                  {/* Full Name */}
                  <div
                    data-error={!!validationErrors.name}
                    className="space-y-1"
                  >
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>Full Name</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => {
                          updateCustomerField("name", e.target.value);
                          if (validationErrors.name) {
                            setValidationErrors((prev) => ({
                              ...prev,
                              name: "",
                            }));
                          }
                        }}
                        placeholder="Full Name"
                        className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-stone-50/80 border ${
                          validationErrors.name
                            ? "border-rose-400 ring-2 ring-rose-200 bg-rose-50/30"
                            : "border-stone-200 focus:border-forest focus:ring-2 focus:ring-forest/15 focus:bg-white"
                        } text-stone-black placeholder:text-stone-400 focus:outline-none transition shadow-2xs`}
                      />
                    </div>
                    {validationErrors.name && (
                      <p className="text-[11px] text-rose-500 flex items-center gap-1 pt-0.5 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp Phone */}
                  <div
                    data-error={!!validationErrors.phone}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>WhatsApp / Contact Number</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50/80 px-2 py-0.5 rounded-md">
                        📱 Live Updates
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-stone-700 text-xs font-bold border-r border-stone-200 pr-2.5 whitespace-nowrap shrink-0 select-none">
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
                        <span className="text-stone-600 font-semibold text-[11px]">IN</span>
                        <span className="text-stone-300 font-normal">|</span>
                        <span className="text-stone-800 font-bold">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          updateCustomerField("phone", val);
                          if (validationErrors.phone) {
                            setValidationErrors((prev) => ({
                              ...prev,
                              phone: "",
                            }));
                          }
                        }}
                        maxLength={10}
                        placeholder="Contact Number"
                        className={`w-full pl-[98px] pr-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-stone-50/80 border ${
                          validationErrors.phone
                            ? "border-rose-400 ring-2 ring-rose-200 bg-rose-50/30"
                            : "border-stone-200 focus:border-forest focus:ring-2 focus:ring-forest/15 focus:bg-white"
                        } text-stone-black placeholder:text-stone-400 focus:outline-none transition shadow-2xs font-mono`}
                      />
                    </div>
                    {validationErrors.phone && (
                      <p className="text-[11px] text-rose-500 flex items-center gap-1 pt-0.5 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Delivery Address & Location Auto-detect (only when Delivery is selected) */}
                  {orderType === "delivery" ? (
                    <div
                      className="space-y-3.5 pt-1"
                      data-error={!!validationErrors.address}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            <span>Complete Delivery Address</span>
                            <span className="text-rose-500">*</span>
                          </label>

                          {/* Detect My Current Location Button */}
                          <button
                            type="button"
                            onClick={handleDetectLocation}
                            disabled={isLocating}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 text-[11px] font-bold border border-emerald-300 transition-all shadow-2xs shrink-0 disabled:opacity-60 cursor-pointer"
                            title="Automatically fill address from GPS"
                          >
                            {isLocating ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                                <span>Detecting GPS...</span>
                              </>
                            ) : (
                              <>
                                <LocateFixed className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                                <span>Detect Location</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="relative">
                          <textarea
                            value={customerInfo.address}
                            onChange={(e) => {
                              updateCustomerField("address", e.target.value);
                              if (validationErrors.address) {
                                setValidationErrors((prev) => ({
                                  ...prev,
                                  address: "",
                                }));
                              }
                            }}
                            placeholder=""
                            rows={2}
                            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-stone-50/80 border ${
                              validationErrors.address
                                ? "border-rose-400 ring-2 ring-rose-200 bg-rose-50/30"
                                : "border-stone-200 focus:border-forest focus:ring-2 focus:ring-forest/15 focus:bg-white"
                            } text-stone-black placeholder:text-stone-400 focus:outline-none resize-none transition shadow-2xs`}
                          />
                        </div>

                        {/* Location Status Chip */}
                        {locationStatus && (
                          <div className="text-[11px] text-emerald-800 bg-emerald-50/90 border border-emerald-200/90 px-3 py-1.5 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                              <span className="truncate">{locationStatus}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {customerInfo.locationUrl && (
                                <a
                                  href={customerInfo.locationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-700 underline font-semibold hover:text-emerald-900"
                                >
                                  View Pin
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setLocationStatus(null);
                                  updateCustomerField("locationUrl", "");
                                }}
                                className="text-[10px] text-stone-400 hover:text-stone-600 font-bold shrink-0 ml-0.5"
                                title="Clear location"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        )}

                        {validationErrors.address && (
                          <p className="text-[11px] text-rose-500 flex items-center gap-1 pt-0.5 font-medium">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {validationErrors.address}
                          </p>
                        )}
                      </div>

                      {/* Nearby Landmark */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-stone-400" />
                          <span>Nearby Landmark (Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={customerInfo.landmark}
                          onChange={(e) =>
                            updateCustomerField("landmark", e.target.value)
                          }
                          placeholder=""
                          className="w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-stone-50/80 border border-stone-200 focus:border-forest focus:ring-2 focus:ring-forest/15 focus:bg-white text-stone-black placeholder:text-stone-400 focus:outline-none transition shadow-2xs"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Takeaway Counter Pickup Card */
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 space-y-1.5 shadow-2xs">
                      <p className="font-bold flex items-center gap-1.5 text-amber-950">
                        <Store className="w-4 h-4 text-amber-700" />
                        <span>Takeaway Counter Pickup</span>
                      </p>
                      <p className="text-[11px] text-amber-900/90 leading-relaxed">
                        Collect your warm, freshly packaged order at:
                        <br />
                        <strong className="text-amber-950 font-semibold">
                          {CAFE_INFO.address}
                        </strong>
                      </p>
                    </div>
                  )}

                  {/* Payment Mode (100% Cash on Delivery) */}
                  <div className="pt-1">
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                          <Banknote className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-amber-950 flex items-center gap-1.5 leading-tight">
                            <span>Payment Mode:</span>
                            <span className="text-forest font-extrabold">
                              {orderType === "delivery"
                                ? "Cash on Delivery (COD)"
                                : "Cash at Counter"}
                            </span>
                          </p>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            {orderType === "delivery"
                              ? "Pay cash directly to delivery partner upon arrival"
                              : "Pay cash directly at cafe counter"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full shrink-0 border border-emerald-200">
                        Cash Only
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. COUPON / PROMO CODE INPUT */}
              {cartItems.length > 0 && (
                <div className="p-4 rounded-3xl bg-white border border-stone-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-forest" />
                      <span>Have a Promo Code?</span>
                    </label>
                    {appliedPromo && (
                      <button
                        onClick={removePromo}
                        className="text-[11px] font-semibold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {appliedPromo ? (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          Code '{appliedPromo.code}' Applied!
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          {appliedPromo.description}
                        </p>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-800">
                        -{CAFE_INFO.currency}
                        {discountAmount.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError(null);
                        }}
                        placeholder=""
                        className="flex-1 px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm uppercase font-mono tracking-wider focus:outline-none focus:border-forest"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-2xl bg-forest hover:bg-forest-light text-white text-xs font-bold transition shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {promoError && (
                    <p className="text-[11px] text-rose-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {promoError}
                    </p>
                  )}
                </div>
              )}

              {/* 6. PRICE BREAKDOWN */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-100 shadow-sm space-y-2.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-semibold text-stone-800">
                      {CAFE_INFO.currency}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span>
                        -{CAFE_INFO.currency}
                        {discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>
                      Delivery Partner Fee{" "}
                      {orderType === "pickup" && "(Self Pickup)"}
                    </span>
                    <span className="font-semibold text-stone-800">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase text-[11px]">
                          Free
                        </span>
                      ) : (
                        `${CAFE_INFO.currency}${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-500">
                    <span>Eco-friendly Botanical Bag</span>
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">
                      Free
                    </span>
                  </div>

                  <div className="border-t border-dashed border-stone-200 pt-2.5 mt-2 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm sm:text-base font-extrabold text-forest block">
                        To Pay
                      </span>
                      <span className="text-[10px] text-stone-400">
                        All taxes included
                      </span>
                    </div>
                    <span className="font-sans font-extrabold text-xl sm:text-2xl text-forest tracking-tight">
                      {CAFE_INFO.currency}
                      {grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Drawer Footer CTA */}
            {cartItems.length > 0 && (
              <div className="p-4 bg-white/95 backdrop-blur-md border-t border-stone-200 shrink-0 pb-safe shadow-lg">
                <button
                  type="button"
                  onClick={handleOrderViaWhatsApp}
                  disabled={isSubmitting || !isStoreOpen}
                  className={`w-full py-4 px-6 rounded-2xl text-white text-sm sm:text-base font-bold shadow-glow transition-all flex items-center justify-between gap-3 group ${
                    !isStoreOpen
                      ? 'bg-stone-500 cursor-not-allowed opacity-90 shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      {!isStoreOpen ? <Clock className="w-4 h-4 text-white" /> : <Send className="w-4 h-4 text-white" />}
                    </div>
                    <span className="tracking-wide">
                      {!isStoreOpen ? 'Closed • Orders Open at 11:30 AM' : 'Order via WhatsApp'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-white/20 px-2.5 py-1 rounded-xl text-xs sm:text-sm">
                      {CAFE_INFO.currency}
                      {grandTotal.toFixed(2)}
                    </span>
                    {isStoreOpen && (
                      <span className="text-lg leading-none transition-transform group-hover:translate-x-1">
                        ➔
                      </span>
                    )}
                  </div>
                </button>

                <p className="text-[11px] text-stone-400 text-center mt-2 flex items-center justify-center gap-1.5">
                  <span>🔒</span>
                  <span>
                    {!isStoreOpen
                      ? 'Online ordering is currently closed. Kitchen operates daily 11:30 AM to 11:30 PM.'
                      : 'Directly messages cafe owner. No sign-up or card payment required.'}
                  </span>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
