import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { FoodItem, CartItem, OrderType, CustomerInfo, PromoCode } from '../types';
import { CAFE_INFO, PROMO_CODES } from '../data/menuData';
import { StoreStatus, getStoreStatus } from '../utils/storeHours';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  setItemQuantity: (itemId: string, qty: number) => void;
  getItemQuantity: (itemId: string) => number;
  clearCart: () => void;
  
  totalCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  grandTotal: number;

  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  orderType: OrderType;
  setOrderType: (type: OrderType) => void;

  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  updateCustomerField: <K extends keyof CustomerInfo>(field: K, value: CustomerInfo[K]) => void;

  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;

  selectedDetailItem: FoodItem | null;
  setSelectedDetailItem: (item: FoodItem | null) => void;

  isInfoModalOpen: boolean;
  setIsInfoModalOpen: (open: boolean) => void;

  orderSuccessData: { message: string; waLink: string; total: number; orderType: OrderType } | null;
  setOrderSuccessData: (data: { message: string; waLink: string; total: number; orderType: OrderType } | null) => void;

  storeStatus: StoreStatus;
  isStoreOpen: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'garden_stop_cart_v1';
const USER_STORAGE_KEY = 'garden_stop_user_info_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Cart items state with localStorage initialization
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // UI Drawer / Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<FoodItem | null>(null);
  const [orderSuccessData, setOrderSuccessData] = useState<{
    message: string;
    waLink: string;
    total: number;
    orderType: OrderType;
  } | null>(null);

  // Store Hours & Ordering Status (11:30 AM to 10:30 PM)
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(() => getStoreStatus());

  useEffect(() => {
    const checkStatus = () => setStoreStatus(getStoreStatus());
    const interval = setInterval(checkStatus, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Order type
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Customer Form with localStorage persistence for convenience
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return {
          name: parsed.name || '',
          phone: parsed.phone || '',
          address: parsed.address || '',
          landmark: parsed.landmark || '',
          notes: '',
          orderType: 'delivery',
          paymentMethod: 'cod',
          locationUrl: parsed.locationUrl || '',
        };
      }
    } catch {
      // ignore
    }
    return {
      name: '',
      phone: '',
      address: '',
      landmark: '',
      notes: '',
      orderType: 'delivery',
      paymentMethod: 'cod',
      locationUrl: '',
    };
  });

  // Promo code state
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Keep customerInfo.orderType in sync
  useEffect(() => {
    setCustomerInfo(prev => ({ ...prev, orderType }));
  }, [orderType]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // storage unavailable
    }
  }, [cartItems]);

  // Save customer info to localStorage (excluding notes)
  useEffect(() => {
    try {
      const toSave = {
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        landmark: customerInfo.landmark,
        paymentMethod: customerInfo.paymentMethod,
        locationUrl: customerInfo.locationUrl,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // ignore
    }
  }, [customerInfo.name, customerInfo.phone, customerInfo.address, customerInfo.landmark, customerInfo.paymentMethod, customerInfo.locationUrl]);

  const updateCustomerField = useCallback(<K extends keyof CustomerInfo>(field: K, value: CustomerInfo[K]) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const addToCart = useCallback((item: FoodItem) => {
    if (!storeStatus.isOpen) {
      alert(storeStatus.orderingDisabledMessage || 'Garden Stop is currently closed. Orders accepted between 11:30 AM and 10:30 PM.');
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, [storeStatus.isOpen, storeStatus.orderingDisabledMessage]);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(ci => ci.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    if (delta > 0 && !storeStatus.isOpen) {
      alert(storeStatus.orderingDisabledMessage || 'Garden Stop is currently closed. Orders accepted between 11:30 AM and 10:30 PM.');
      return;
    }
    setCartItems(prev => {
      return prev
        .map(ci => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null);
    });
  }, [storeStatus.isOpen, storeStatus.orderingDisabledMessage]);

  const setItemQuantity = useCallback((itemId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems(prev => prev.filter(ci => ci.item.id !== itemId));
      return;
    }
    setCartItems(prev =>
      prev.map(ci => (ci.item.id === itemId ? { ...ci, quantity: qty } : ci))
    );
  }, []);

  const getItemQuantity = useCallback((itemId: string): number => {
    const found = cartItems.find(ci => ci.item.id === itemId);
    return found ? found.quantity : 0;
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedPromo(null);
  }, []);

  // Memoized Calculations
  const totalCount = useMemo(() => cartItems.reduce((sum, ci) => sum + ci.quantity, 0), [cartItems]);
  const subtotal = useMemo(() => cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0), [cartItems]);

  // Delivery fee calculation
  const deliveryFee = useMemo(() => {
    if (orderType === 'delivery') {
      if (subtotal >= CAFE_INFO.freeDeliveryThreshold) {
        return 0;
      } else if (appliedPromo?.freeDelivery) {
        return 0;
      } else {
        return CAFE_INFO.deliveryFee;
      }
    }
    return 0;
  }, [orderType, subtotal, appliedPromo]);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (appliedPromo && appliedPromo.discountPercentage > 0) {
      return (subtotal * appliedPromo.discountPercentage) / 100;
    }
    return 0;
  }, [appliedPromo, subtotal]);

  const grandTotal = useMemo(() => Math.max(0, subtotal - discountAmount + deliveryFee), [subtotal, discountAmount, deliveryFee]);

  // Promo code handling
  const applyPromo = useCallback((codeStr: string) => {
    const clean = codeStr.trim().toUpperCase();
    const promo = PROMO_CODES.find(p => p.code === clean);

    if (!promo) {
      return { success: false, message: 'Invalid coupon code' };
    }

    if (promo.minOrder && subtotal < promo.minOrder) {
      return {
        success: false,
        message: `Min order of ${CAFE_INFO.currency}${promo.minOrder.toFixed(2)} required for ${promo.code}`,
      };
    }

    setAppliedPromo(promo);
    return {
      success: true,
      message: promo.freeDelivery
        ? 'Free Delivery applied!'
        : `${promo.discountPercentage}% discount applied!`,
    };
  }, [subtotal]);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const contextValue = useMemo<CartContextType>(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    setItemQuantity,
    getItemQuantity,
    clearCart,
    totalCount,
    subtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    isCartOpen,
    openCart,
    closeCart,
    orderType,
    setOrderType,
    customerInfo,
    setCustomerInfo,
    updateCustomerField,
    appliedPromo,
    applyPromo,
    removePromo,
    selectedDetailItem,
    setSelectedDetailItem,
    isInfoModalOpen,
    setIsInfoModalOpen,
    orderSuccessData,
    setOrderSuccessData,
    storeStatus,
    isStoreOpen: storeStatus.isOpen,
  }), [
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    setItemQuantity,
    getItemQuantity,
    clearCart,
    totalCount,
    subtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    isCartOpen,
    openCart,
    closeCart,
    orderType,
    customerInfo,
    updateCustomerField,
    appliedPromo,
    applyPromo,
    removePromo,
    selectedDetailItem,
    isInfoModalOpen,
    orderSuccessData,
    storeStatus,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
