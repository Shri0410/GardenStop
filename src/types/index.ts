export type CategoryId = 'all' | 'pizzas' | 'sandwiches' | 'burgers' | 'coffee' | 'fries' | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  image: string;
  count?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: Exclude<CategoryId, 'all'>;
  price: number;
  image: string;
  isVeg: boolean;
  rating: number;
  reviewsCount: number;
  description: string;
  tags?: string[];
  calories?: string;
  prepTime?: string;
  ingredients?: string[];
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'None';
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export type OrderType = 'delivery' | 'pickup';

export type PaymentMethod = 'cod' | 'upi' | 'counter';

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  landmark: string;
  notes: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  locationUrl?: string;
}

export interface PromoCode {
  code: string;
  description: string;
  discountPercentage: number;
  minOrder?: number;
  freeDelivery?: boolean;
}
