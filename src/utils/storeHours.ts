export interface StoreStatus {
  isOpen: boolean;
  openTimeStr: string;
  closeTimeStr: string;
  timings: string;
  statusBadge: string;
  statusMessage: string;
  orderingDisabledMessage: string;
}

export const STORE_HOURS = {
  openHour: 11,
  openMinute: 30, // 11:30 AM
  closeHour: 22,
  closeMinute: 30, // 10:30 PM
  openTimeStr: '11:30 AM',
  closeTimeStr: '10:30 PM',
  timings: '11:30 AM - 10:30 PM (Daily)',
};

export function getStoreStatus(): StoreStatus {
  // Check for test simulation via URL param (?store=open or ?store=closed)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const storeParam = params.get('store');
    if (storeParam === 'open') {
      return {
        isOpen: true,
        openTimeStr: STORE_HOURS.openTimeStr,
        closeTimeStr: STORE_HOURS.closeTimeStr,
        timings: STORE_HOURS.timings,
        statusBadge: 'Open Now',
        statusMessage: 'Open Now • Accepting orders until 10:30 PM',
        orderingDisabledMessage: '',
      };
    }
    if (storeParam === 'closed') {
      return {
        isOpen: false,
        openTimeStr: STORE_HOURS.openTimeStr,
        closeTimeStr: STORE_HOURS.closeTimeStr,
        timings: STORE_HOURS.timings,
        statusBadge: 'Closed',
        statusMessage: 'Currently Closed • Ordering available 11:30 AM - 10:30 PM',
        orderingDisabledMessage: 'Garden Stop is currently closed. Online ordering is available daily from 11:30 AM to 10:30 PM.',
      };
    }
  }

  // Calculate based on Indian Standard Time (Asia/Kolkata)
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  try {
    const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const istDate = new Date(istString);
    if (!isNaN(istDate.getTime())) {
      hours = istDate.getHours();
      minutes = istDate.getMinutes();
    }
  } catch {
    // Fallback to local system time
  }

  const currentMinutes = hours * 60 + minutes;
  const openMinutes = STORE_HOURS.openHour * 60 + STORE_HOURS.openMinute; // 11:30 AM = 690 min
  const closeMinutes = STORE_HOURS.closeHour * 60 + STORE_HOURS.closeMinute; // 10:30 PM = 1350 min

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  return {
    isOpen,
    openTimeStr: STORE_HOURS.openTimeStr,
    closeTimeStr: STORE_HOURS.closeTimeStr,
    timings: STORE_HOURS.timings,
    statusBadge: isOpen ? 'Open' : 'Closed',
    statusMessage: isOpen
      ? 'Open Now • 100% Pure Veg • 11:30 AM - 10:30 PM'
      : 'Currently Closed • Ordering Opens at 11:30 AM',
    orderingDisabledMessage: isOpen
      ? ''
      : 'Garden Stop is currently closed. Online ordering is only available daily between 11:30 AM and 10:30 PM.',
  };
}
