'use client';

import { useShopStore } from '@/store/shop-store';
import { Header } from '@/components/shop/header';
import { Footer } from '@/components/shop/footer';
import { MobileBottomNav } from '@/components/shop/mobile-bottom-nav';
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
import { motion, AnimatePresence } from 'framer-motion';

const viewVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const viewTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
};

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

  // Hide footer on admin view and checkout for cleaner mobile UX
  const hideFooter = currentView === 'admin' || currentView === 'checkout';
  // Add bottom padding for mobile bottom nav (not on admin/checkout since bottom nav is hidden there too)
  const needsMobilePadding = currentView !== 'admin' && currentView !== 'checkout';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50/80 to-white">
      <Header />
      <main className={`flex-1 ${needsMobilePadding ? 'pb-20 md:pb-0' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={viewTransition}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
      <MobileBottomNav />
    </div>
  );
}

export default function ZyloraPage() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}
