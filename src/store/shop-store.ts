import { create } from 'zustand';
import { ViewType, CartItemType, ProductType, CategoryType, AuthUserType, AddressType, ReviewType, AdminStatsType } from '@/lib/types';

interface ShopState {
  currentView: ViewType;
  selectedProductId: string | null;
  selectedOrderId: string | null;
  lastOrderNumber: string | null;

  // Auth
  user: AuthUserType | null;
  setUser: (user: AuthUserType | null) => void;

  // Filters
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: string;

  // Data
  products: ProductType[];
  categories: CategoryType[];
  cartItems: CartItemType[];
  wishlistIds: string[];
  addresses: AddressType[];
  recentlyViewed: string[];
  isLoading: boolean;
  couponDiscount: number;
  appliedCoupon: string | null;

  // Admin
  adminStats: AdminStatsType | null;
  adminTab: string;
  setAdminTab: (tab: string) => void;

  // Actions
  setCurrentView: (view: ViewType) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedOrderId: (id: string | null) => void;
  setLastOrderNumber: (n: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string | null) => void;
  setSortBy: (s: string) => void;
  setProducts: (p: ProductType[]) => void;
  setCategories: (c: CategoryType[]) => void;
  setCartItems: (items: CartItemType[]) => void;
  setWishlistIds: (ids: string[]) => void;
  setAddresses: (a: AddressType[]) => void;
  setRecentlyViewed: (ids: string[]) => void;
  setIsLoading: (l: boolean) => void;
  setCouponDiscount: (d: number) => void;
  setAppliedCoupon: (c: string | null) => void;
  setAdminStats: (s: AdminStatsType | null) => void;
  addToCart: (item: CartItemType) => void;
  updateCartItemQuantity: (id: string, q: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  navigateToProduct: (id: string) => void;
  navigateToOrder: (id: string, orderNumber?: string) => void;
  goHome: () => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  currentView: 'home',
  selectedProductId: null,
  selectedOrderId: null,
  lastOrderNumber: null,
  user: null,
  searchQuery: '',
  selectedCategory: null,
  sortBy: 'featured',
  products: [],
  categories: [],
  cartItems: [],
  wishlistIds: [],
  addresses: [],
  recentlyViewed: [],
  isLoading: false,
  couponDiscount: 0,
  appliedCoupon: null,
  adminStats: null,
  adminTab: 'overview',

  setUser: (user) => set({ user }),
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedProductId: (id) => set({ selectedProductId: id }),
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
  setLastOrderNumber: (n) => set({ lastOrderNumber: n }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCategory: (c) => set({ selectedCategory: c }),
  setSortBy: (s) => set({ sortBy: s }),
  setProducts: (p) => set({ products: p }),
  setCategories: (c) => set({ categories: c }),
  setCartItems: (items) => set({ cartItems: items }),
  setWishlistIds: (ids) => set({ wishlistIds: ids }),
  setAddresses: (a) => set({ addresses: a }),
  setRecentlyViewed: (ids) => set({ recentlyViewed: ids }),
  setIsLoading: (l) => set({ isLoading: l }),
  setCouponDiscount: (d) => set({ couponDiscount: d }),
  setAppliedCoupon: (c) => set({ appliedCoupon: c }),
  setAdminStats: (s) => set({ adminStats: s }),
  setAdminTab: (tab) => set({ adminTab: tab }),

  addToCart: (item) => {
    const { cartItems } = get();
    const existing = cartItems.find((i) => i.productId === item.productId);
    if (existing) {
      set({ cartItems: cartItems.map((i) => i.productId === item.productId ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) } : i) });
    } else {
      set({ cartItems: [...cartItems, item] });
    }
  },
  updateCartItemQuantity: (id, q) => {
    const { cartItems } = get();
    if (q <= 0) { set({ cartItems: cartItems.filter((i) => i.id !== id) }); }
    else { set({ cartItems: cartItems.map((i) => i.id === id ? { ...i, quantity: Math.min(q, i.stock) } : i) }); }
  },
  removeFromCart: (id) => set({ cartItems: get().cartItems.filter((i) => i.id !== id) }),
  clearCart: () => set({ cartItems: [], couponDiscount: 0, appliedCoupon: null }),
  getCartTotal: () => get().cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
  getCartCount: () => get().cartItems.reduce((s, i) => s + i.quantity, 0),
  toggleWishlist: (productId) => {
    const { wishlistIds } = get();
    if (wishlistIds.includes(productId)) {
      set({ wishlistIds: wishlistIds.filter((id) => id !== productId) });
    } else {
      set({ wishlistIds: [...wishlistIds, productId] });
    }
  },
  isInWishlist: (productId) => get().wishlistIds.includes(productId),
  navigateToProduct: (id) => {
    set({ selectedProductId: id, currentView: 'product' });
    // Track recently viewed
    const { recentlyViewed } = get();
    const updated = [id, ...recentlyViewed.filter((rid) => rid !== id)].slice(0, 20);
    set({ recentlyViewed: updated });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  navigateToOrder: (id, orderNumber) => {
    set({ selectedOrderId: id, lastOrderNumber: orderNumber || null, currentView: 'order-detail' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  goHome: () => {
    set({ currentView: 'home', selectedProductId: null, selectedCategory: null, searchQuery: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
}));
