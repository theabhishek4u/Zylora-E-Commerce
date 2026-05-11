export type ViewType =
  | 'home' | 'product' | 'cart' | 'checkout' | 'orders' | 'order-detail' | 'order-success'
  | 'auth' | 'wishlist' | 'search'
  | 'user-dashboard'
  | 'admin' | 'admin-products' | 'admin-add-product' | 'admin-orders' | 'admin-users' | 'admin-coupons';

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
  userId: string | null;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  totalAmount: number;
  discount: number;
  couponCode: string | null;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItemType[];
  createdAt: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  sku: string | null;
  price: number;
  originalPrice: number | null;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  onSale: boolean;
  newArrival: boolean;
  categoryId: string;
  categoryName?: string;
  tags: string[] | null;
  createdAt: string;
  userReview?: ReviewType;
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string | null;
  icon: string | null;
}

export interface ReviewType {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string;
  verified: boolean;
  helpful: number;
  userName: string;
  createdAt: string;
}

export interface AddressType {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: string;
}

export interface CouponType {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
}

export interface NotificationType {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface AuthUserType {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

export interface UserDashboardTab {
  key: string;
  label: string;
}

export interface AdminStatsType {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  revenue: number;
  recentOrders: OrderType[];
  topProducts: { name: string; sold: number; revenue: number }[];
}
