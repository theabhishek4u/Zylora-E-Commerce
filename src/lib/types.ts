export type ViewType = 'home' | 'product' | 'cart' | 'checkout' | 'orders' | 'order-detail' | 'order-success';

export interface CartItemType {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice: number | null;
  quantity: number;
  stock: number;
}

export interface OrderItemType {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  items: OrderItemType[];
  createdAt: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  categoryId: string;
  categoryName?: string;
  createdAt: string;
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string | null;
}
