import { CartItem, CustomerInfo } from '../types';
import { CAFE_INFO } from '../data/menuData';

interface BuildWhatsAppMessageParams {
  cartItems: CartItem[];
  customer: CustomerInfo;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
}

export function buildWhatsAppOrderMessage({
  cartItems,
  customer,
  subtotal,
  deliveryFee,
  discount,
  grandTotal,
}: BuildWhatsAppMessageParams): string {
  const isDelivery = customer.orderType === 'delivery';
  const orderTypeLabel = isDelivery ? '🛵 Home Delivery' : '🛍️ Takeaway / Pickup';

  const addressText = isDelivery
    ? `${customer.address}${customer.landmark ? ` (Near ${customer.landmark})` : ''}`
    : 'In-store Pickup at Garden Stop Counter';

  const paymentLabel = isDelivery ? '💵 Cash on Delivery (COD)' : '💵 Cash at Counter';

  // Format order items
  const itemsText = cartItems
    .map(
      (ci) =>
        `• ${ci.quantity}x ${ci.item.name} (${CAFE_INFO.currency}${(ci.item.price * ci.quantity).toFixed(2)})`
    )
    .join('\n');

  // Build the message strictly following the requested markdown format
  let message = `🌿 *NEW ORDER - GARDEN STOP* 🌿\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Order Type:* ${orderTypeLabel}\n`;
  message += `*Customer:* ${customer.name}\n`;
  message += `*Phone:* ${customer.phone}\n`;
  if (isDelivery) {
    message += `*Address:* ${addressText}\n`;
    if (customer.locationUrl && customer.locationUrl.trim()) {
      message += `📍 *Location Link:* ${customer.locationUrl.trim()}\n`;
    } else if (customer.address && customer.address.trim()) {
      const queryAddress = `${customer.address.trim()}${customer.landmark ? ', ' + customer.landmark.trim() : ''}`;
      message += `📍 *Location Link:* https://maps.google.com/?q=${encodeURIComponent(queryAddress)}\n`;
    }
    message += `📲 _(Customer can also share Live Location in this chat)_\n`;
  } else {
    message += `*Pickup At:* ${CAFE_INFO.name} (${CAFE_INFO.address}, ${CAFE_INFO.landmark})\n`;
  }

  message += `\n📋 *ORDER ITEMS:*\n${itemsText}\n`;

  if (customer.notes && customer.notes.trim()) {
    message += `\n📝 *Note:* ${customer.notes.trim()}\n`;
  }

  message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Subtotal:* ${CAFE_INFO.currency}${subtotal.toFixed(2)}\n`;
  if (discount > 0) {
    message += `*Discount:* -${CAFE_INFO.currency}${discount.toFixed(2)}\n`;
  }
  message += `*Delivery:* ${CAFE_INFO.currency}${deliveryFee.toFixed(2)}\n`;
  message += `*Grand Total:* *${CAFE_INFO.currency}${grandTotal.toFixed(2)}*\n`;
  message += `*Payment Mode:* ${paymentLabel}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Thank you for ordering with Garden Stop!`;

  return message;
}

export function generateWhatsAppLink(
  phoneNumber: string,
  params: BuildWhatsAppMessageParams
): string {
  const message = buildWhatsAppOrderMessage(params);
  // Clean phone number (remove +, spaces, hyphens)
  let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  // If 10 digits provided (e.g. 9764146195), prepend India country code 91
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export interface CelebrationBookingParams {
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  guestCount: string;
  specialRequests?: string;
}

export function buildCelebrationBookingMessage(params: CelebrationBookingParams): string {
  let message = `🎉 *BIRTHDAY CELEBRATION BOOKING* 🎉\n`;
  message += `*Garden Stop • Pure Veg Kitchen & Cafe*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `👤 *Name:* ${params.name}\n`;
  message += `📞 *WhatsApp:* ${params.phone}\n`;
  message += `📅 *Event Date:* ${params.date}\n`;
  if (params.timeSlot) {
    message += `⏰ *Time Slot:* ${params.timeSlot}\n`;
  }
  message += `👥 *Guests Count:* ${params.guestCount}\n`;
  if (params.specialRequests && params.specialRequests.trim()) {
    message += `🎂 *Special Requests / Notes:*\n${params.specialRequests.trim()}\n`;
  }
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `✨ Please confirm availability & celebration arrangements. Thank you!`;

  return message;
}

export function generateCelebrationWhatsAppLink(
  phoneNumber: string,
  params: CelebrationBookingParams
): string {
  const message = buildCelebrationBookingMessage(params);
  let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
