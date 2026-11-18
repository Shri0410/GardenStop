import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CAFE_INFO } from '../data/menuData';
import { generateWhatsAppLink, buildWhatsAppOrderMessage } from '../utils/whatsapp';
import confetti from 'canvas-confetti';

const QUICK_NOTES = [
  'Make fries extra crispy 🍟',
  'Less spicy please 🌶️',
  'No onions in burger 🧅',
  'Less ice in drinks 🧊',
  'Please pack cutlery 🍴',
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
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock body scroll when cart is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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
      setPromoInput('');
    }
  };

  const handleQuickNote = (note: string) => {
    const current = customerInfo.notes || '';
    if (current.includes(note)) return;
    const updated = current ? `${current}, ${note}` : note;
    updateCustomerField('notes', updated);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerInfo.name.trim()) {
      errors.name = 'Please enter your full name';
    }

    const cleanPhone = customerInfo.phone.replace(/[^0-9]/g, '');
    if (!customerInfo.phone.trim() || cleanPhone.length < 8) {
      errors.phone = 'Please enter a valid phone or WhatsApp number';
    }

    if (orderType === 'delivery') {
      if (!customerInfo.address.trim()) {
        errors.address = 'Please provide complete delivery address';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrderViaWhatsApp = () => {
    if (cartItems.length === 0) return;

    if (!validateForm()) {
      // Scroll to first error on mobile
      const errorField = document.querySelector('[data-error="true"]');
      errorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        colors: ['#1E3A2B', '#E07A5F', '#D97706', '#2D5A43'],
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
      window.open(waLink, '_blank', 'noopener,noreferrer');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div key="cart-drawer-root" className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-full max-w-xl bg-[#FBF9F5] rounded-t-[2.2rem] shadow-2xl border-t border-stone-200 z-10 max-h-[92vh] flex flex-col overflow-hidden"
          >
          {/* Top Pull Bar & Sheet Header */}
          <div className="pt-3 pb-2 px-6 border-b border-stone-200/60 bg-white/70 backdrop-blur-md shrink-0 flex flex-col items-center">
            {/* Grab / Drag handle */}
            <div className="w-12 h-1.5 rounded-full bg-stone-300 mb-2" />

            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest">
                    Your Order Cart
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {totalCount} {totalCount === 1 ? 'item' : 'items'} • Garden Stop Botanical Cafe
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
                  className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Drawer Body Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* 1. ORDER TYPE SWITCHER TOGGLE */}
            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Step 1: Choose Order Type
              </label>
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-stone-200/70 border border-stone-300/40">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`relative py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    orderType === 'delivery'
                      ? 'bg-forest text-white shadow-md'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>🛵 Home Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`relative py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    orderType === 'pickup'
                      ? 'bg-forest text-white shadow-md'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>🛍️ Takeaway / Pickup</span>
                </button>
              </div>

              {/* Delivery / Pickup Info Pill */}
              <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between px-1">
                {orderType === 'delivery' ? (
                  <span>
                    🚀 Delivered in ~25-35 mins • {subtotal >= CAFE_INFO.freeDeliveryThreshold ? (
                      <span className="text-emerald-700 font-semibold">Free Delivery Unlocked!</span>
                    ) : (
                      <span>Add {CAFE_INFO.currency}{(CAFE_INFO.freeDeliveryThreshold - subtotal).toFixed(2)} more for Free Delivery</span>
                    )}
                  </span>
                ) : (
                  <span>
                    🛍️ Ready for pickup at cafe counter in ~15-20 mins • No delivery fee
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
                  <p className="text-sm font-bold text-stone-700">Your basket is empty</p>
                  <p className="text-xs text-stone-400 mt-1">Add some delicious sourdough pizzas or truffle burgers!</p>
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
                            {CAFE_INFO.currency}{ci.item.price.toFixed(2)}
                            <span className="text-[11px] text-stone-400 font-normal"> / each</span>
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
                            {CAFE_INFO.currency}{(ci.item.price * ci.quantity).toFixed(2)}
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
                  onChange={(e) => updateCustomerField('notes', e.target.value)}
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

            {/* 4. CUSTOMER INFORMATION FORM (NO LOGIN REQUIRED) */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-forest" />
                    <h4 className="text-xs font-bold text-forest uppercase tracking-wider">
                      Step 3: Customer Details (Guest Checkout)
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    No Sign-in Needed
                  </span>
                </div>

                {/* Name */}
                <div data-error={!!validationErrors.name}>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => {
                        updateCustomerField('name', e.target.value);
                        if (validationErrors.name) {
                          setValidationErrors(prev => ({ ...prev, name: '' }));
                        }
                      }}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-stone-50 border ${
                        validationErrors.name
                          ? 'border-rose-400 ring-2 ring-rose-200'
                          : 'border-stone-200 focus:border-forest focus:ring-2 focus:ring-forest/20'
                      } text-stone-black focus:outline-none transition`}
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* WhatsApp Phone */}
                <div data-error={!!validationErrors.phone}>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    WhatsApp / Contact Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => {
                        updateCustomerField('phone', e.target.value);
                        if (validationErrors.phone) {
                          setValidationErrors(prev => ({ ...prev, phone: '' }));
                        }
                      }}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-stone-50 border ${
                        validationErrors.phone
                          ? 'border-rose-400 ring-2 ring-rose-200'
                          : 'border-stone-200 focus:border-forest focus:ring-2 focus:ring-forest/20'
                      } text-stone-black focus:outline-none transition`}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validationErrors.phone}
                    </p>
                  )}
                </div>

                {/* Delivery Address (only when Delivery is selected) */}
                {orderType === 'delivery' ? (
                  <div className="space-y-3 pt-1" data-error={!!validationErrors.address}>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Complete Delivery Address <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        value={customerInfo.address}
                        onChange={(e) => {
                          updateCustomerField('address', e.target.value);
                          if (validationErrors.address) {
                            setValidationErrors(prev => ({ ...prev, address: '' }));
                          }
                        }}
                        placeholder="e.g. Flat 402, Green Valley Apts, MG Road, Indiranagar"
                        rows={2}
                        className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-stone-50 border ${
                          validationErrors.address
                            ? 'border-rose-400 ring-2 ring-rose-200'
                            : 'border-stone-200 focus:border-forest focus:ring-2 focus:ring-forest/20'
                        } text-stone-black focus:outline-none resize-none transition`}
                      />
                      {validationErrors.address && (
                        <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={customerInfo.landmark}
                        onChange={(e) => updateCustomerField('landmark', e.target.value)}
                        placeholder="e.g. Near City Park / Opposite HDFC Bank"
                        className="w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm bg-stone-50 border border-stone-200 focus:border-forest focus:ring-2 focus:ring-forest/20 text-stone-black focus:outline-none transition"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-amber-700" />
                      <span>Takeaway Counter Pickup</span>
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      You can collect your warm, freshly packaged order directly at:
                      <br />
                      <strong>{CAFE_INFO.address}</strong>
                    </p>
                  </div>
                )}

                {/* Preferred Payment Method */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-2">
                    Preferred Payment Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateCustomerField('paymentMethod', 'upi')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                        customerInfo.paymentMethod === 'upi'
                          ? 'bg-forest/5 border-forest text-forest ring-1 ring-forest'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>UPI / QR Scan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateCustomerField('paymentMethod', 'cod')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                        customerInfo.paymentMethod === 'cod'
                          ? 'bg-forest/5 border-forest text-forest ring-1 ring-forest'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-amber-600" />
                      <span>{orderType === 'delivery' ? 'Cash on Delivery' : 'Cash at Counter'}</span>
                    </button>
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
                      <p className="text-[11px] text-emerald-700">{appliedPromo.description}</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-800">
                      -{CAFE_INFO.currency}{discountAmount.toFixed(2)}
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
                      placeholder="e.g. GARDEN20"
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
                    {CAFE_INFO.currency}{subtotal.toFixed(2)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-{CAFE_INFO.currency}{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>
                    Delivery Partner Fee {orderType === 'pickup' && '(Self Pickup)'}
                  </span>
                  <span className="font-semibold text-stone-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                    ) : (
                      `${CAFE_INFO.currency}${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-stone-500">
                  <span>Eco-friendly Botanical Bag</span>
                  <span className="text-emerald-700 font-bold uppercase text-[11px]">Free</span>
                </div>

                <div className="border-t border-dashed border-stone-200 pt-2.5 mt-2 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm sm:text-base font-extrabold text-forest block">
                      To Pay
                    </span>
                    <span className="text-[10px] text-stone-400">All taxes included</span>
                  </div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-forest">
                    {CAFE_INFO.currency}{grandTotal.toFixed(2)}
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
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm sm:text-base font-bold shadow-glow transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </div>
                  <span className="tracking-wide">Order via WhatsApp</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-white/20 px-2.5 py-1 rounded-xl text-xs sm:text-sm">
                    {CAFE_INFO.currency}{grandTotal.toFixed(2)}
                  </span>
                  <span className="text-lg leading-none transition-transform group-hover:translate-x-1">
                    ➔
                  </span>
                </div>
              </button>

              <p className="text-[11px] text-stone-400 text-center mt-2 flex items-center justify-center gap-1.5">
                <span>🔒</span>
                <span>Directly messages cafe owner. No sign-up or card payment required.</span>
              </p>
            </div>
          )}

        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
