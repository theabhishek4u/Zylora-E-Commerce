import { create } from 'zustand';
import { ViewType, CartItemType, ProductType, CategoryType } from '@/lib/types';

interface ShopState {
  // Navigation
  currentView: ViewType;
  selectedProductId: string | null;
  selectedOrderId: string | null;
  lastOrderNumber: string | null;

  // Filters
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: string;

  // Data
  products: ProductType[];
  categories: CategoryType[];
  cartItems: CartItemType[];
  isLoading: boolean;

  // Actions
  setCurrentView: (view: ViewType) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedOrderId: (id: string | null) => void;
  setLastOrderNumber: (number: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sort: string) => void;
  setProducts: (products: ProductType[]) => void;
  setCategories: (categories: CategoryType[]) => void;
  setCartItems: (items: CartItemType[]) => void;
  setIsLoading: (loading: boolean) => void;
  addToCart: (item: CartItemType) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  navigateToProduct: (productId: string) => void;
  navigateToOrder: (orderId: string, orderNumber?: string) => void;
  goHome: () => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  currentView: 'home',
  selectedProductId: null,
  selectedOrderId: null,
  lastOrderNumber: null,
  searchQuery: '',
  selectedCategory: null,
  sortBy: 'featured',
  products: [],
  categories: [],
  cartItems: [],
  isLoading: false,

  setCurrentView: (view) => set({ currentView: view }),
  setSelectedProductId: (id) => set({ selectedProductId: id }),
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),
  setLastOrderNumber: (number) => set({ lastOrderNumber: number }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setCartItems: (items) => set({ cartItems: items }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  addToCart: (item) => {
    const { cartItems } = get();
    const existing = cartItems.find((i) => i.productId === item.productId);
    if (existing) {
      set({
        cartItems: cartItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
            : i
        ),
      });
    } else {
      set({ cartItems: [...cartItems, item] });
    }
  },

  updateCartItemQuantity: (id, quantity) => {
    const { cartItems } = get();
    if (quantity <= 0) {
      set({ cartItems: cartItems.filter((i) => i.id !== id) });
    } else {
      set({
        cartItems: cartItems.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
        ),
      });
    }
  },

  removeFromCart: (id) => {
    const { cartItems } = get();
    set({ cartItems: cartItems.filter((i) => i.id !== id) });
  },

  clearCart: () => set({ cartItems: [] }),

  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getCartCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  navigateToProduct: (productId) => {
    set({ selectedProductId: productId, currentView: 'product' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  navigateToOrder: (orderId, orderNumber) => {
    set({ selectedOrderId: orderId, lastOrderNumber: orderNumber || null, currentView: 'order-detail' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  goHome: () => {
    set({ currentView: 'home', selectedProductId: null, selectedCategory: null, searchQuery: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
}));
