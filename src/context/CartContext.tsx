import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FoodItem, CartItem, OrderType, CustomerInfo, PromoCode } from '../types';
import { CAFE_INFO, PROMO_CODES } from '../data/menuData';

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

  const updateCustomerField = <K extends keyof CustomerInfo>(field: K, value: CustomerInfo[K]) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const addToCart = (item: FoodItem) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
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
  };

  const setItemQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(ci => (ci.item.id === itemId ? { ...ci, quantity: qty } : ci))
    );
  };

  const getItemQuantity = (itemId: string): number => {
    const found = cartItems.find(ci => ci.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  // Calculations
  const totalCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const subtotal = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  // Delivery fee calculation
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    if (subtotal >= CAFE_INFO.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else if (appliedPromo?.freeDelivery) {
      deliveryFee = 0;
    } else {
      deliveryFee = CAFE_INFO.deliveryFee;
    }
  }

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo && appliedPromo.discountPercentage > 0) {
    discountAmount = (subtotal * appliedPromo.discountPercentage) / 100;
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  // Promo code handling
  const applyPromo = (codeStr: string) => {
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
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
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
