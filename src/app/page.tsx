'use client';

import { useShopStore } from '@/store/shop-store';
import { Header } from '@/components/shop/header';
import { Footer } from '@/components/shop/footer';
import { HomeView } from '@/components/shop/home-view';
import { ProductDetailView } from '@/components/shop/product-detail-view';
import { CartView } from '@/components/shop/cart-view';
import { CheckoutView } from '@/components/shop/checkout-view';
import { OrdersView } from '@/components/shop/orders-view';
import { OrderDetailView } from '@/components/shop/order-detail-view';
import { OrderSuccessView } from '@/components/shop/order-success-view';
import { AuthView } from '@/components/shop/auth-view';
import { WishlistView } from '@/components/shop/wishlist-view';
import { UserDashboardView } from '@/components/shop/user-dashboard-view';
import { AdminView } from '@/components/shop/admin-view';
import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

function AppContent() {
  const { currentView, setProducts, setCategories, setIsLoading } = useShopStore();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData.products || Array.isArray(productsData) ? productsData.products || productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [setProducts, setCategories, setIsLoading]);

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'product': return <ProductDetailView />;
      case 'cart': return <CartView />;
      case 'checkout': return <CheckoutView />;
      case 'orders': return <OrdersView />;
      case 'order-detail': return <OrderDetailView />;
      case 'order-success': return <OrderSuccessView />;
      case 'auth': return <AuthView />;
      case 'wishlist': return <WishlistView />;
      case 'user-dashboard': return <UserDashboardView />;
      case 'admin': return <AdminView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="flex-1">{renderView()}</main>
      <Footer />
    </div>
  );
}

export default function ZShopPage() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}
