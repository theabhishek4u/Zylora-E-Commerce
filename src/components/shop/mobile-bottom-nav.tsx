'use client';

import { useShopStore } from '@/store/shop-store';
import {
  Home,
  Search,
  ShoppingCart,
  Heart,
  User,
  Grid3X3,
  Package,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  view: string;
  badge?: number;
  isSpecial?: boolean;
}

export function MobileBottomNav() {
  const {
    currentView,
    setCurrentView,
    getCartCount,
    wishlistIds,
    user,
  } = useShopStore();
  const { data: session } = useSession();

  const cartCount = getCartCount();
  const wishlistCount = wishlistIds.length;

  const currentUser = user || (session?.user ? {
    id: (session.user as { id: string }).id,
    name: session.user.name || '',
    email: session.user.email || '',
    role: (session.user as { role: string }).role || 'user',
  } : null);

  const navItems: NavItem[] = useMemo(() => [
    {
      key: 'home',
      label: 'Home',
      icon: Home,
      view: 'home',
    },
    {
      key: 'categories',
      label: 'Categories',
      icon: Grid3X3,
      view: 'home', // Will toggle category sidebar
    },
    {
      key: 'search',
      label: 'Search',
      icon: Search,
      view: 'home', // Will focus search
      isSpecial: true,
    },
    {
      key: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      view: 'cart',
      badge: cartCount,
    },
    {
      key: 'account',
      label: currentUser ? 'Account' : 'Login',
      icon: currentUser ? User : User,
      view: currentUser ? 'user-dashboard' : 'auth',
    },
  ], [cartCount, currentUser]);

  const getIsActive = (item: NavItem) => {
    if (item.key === 'home') {
      return currentView === 'home' && !useShopStore.getState().selectedCategory;
    }
    if (item.key === 'categories') {
      return currentView === 'home' && !!useShopStore.getState().selectedCategory;
    }
    if (item.key === 'cart') return currentView === 'cart';
    if (item.key === 'account') {
      return currentView === 'user-dashboard' || currentView === 'auth' || currentView === 'orders' || currentView === 'wishlist';
    }
    return false;
  };

  const handleNavClick = (item: NavItem) => {
    if (item.key === 'categories') {
      const { selectedCategory, categories } = useShopStore.getState();
      if (selectedCategory) {
        // Already on categories - toggle off
        useShopStore.getState().setSelectedCategory(null);
      } else if (categories.length > 0) {
        // Select first category
        useShopStore.getState().setSelectedCategory(categories[0].slug);
      }
      if (currentView !== 'home') setCurrentView('home');
    } else if (item.key === 'search') {
      // Navigate to home and trigger search focus
      if (currentView !== 'home') setCurrentView('home');
      // We'll dispatch a custom event that the header listens to
      window.dispatchEvent(new CustomEvent('zylora-focus-search'));
    } else if (item.key === 'account' && currentUser) {
      // Show account menu - navigate to user dashboard
      setCurrentView(item.view as any);
    } else {
      setCurrentView(item.view as any);
    }
  };

  // Don't show bottom nav on admin view or checkout flow
  const hideBottomNav = currentView === 'admin' || currentView === 'checkout';

  return (
    <AnimatePresence>
      {!hideBottomNav && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Safe area spacer for iOS */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-t border-border/40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
              {navItems.map((item) => {
                const isActive = getIsActive(item);
                const Icon = item.icon;

                return (
                  <motion.button
                    key={item.key}
                    onClick={() => handleNavClick(item)}
                    className="relative flex flex-col items-center justify-center py-2 px-3 min-w-[56px] group"
                    whileTap={{ scale: 0.9 }}
                    aria-label={item.label}
                  >
                    {/* Active indicator dot */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          className="absolute -top-0.5 w-5 h-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-700"
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon container */}
                    <div className="relative">
                      {item.isSpecial ? (
                        // Special search button with elevated design
                        <div className="flex items-center justify-center w-11 h-11 -mt-5 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 group-active:shadow-blue-500/50 transition-shadow">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <Icon
                          className={`h-5 w-5 transition-colors duration-200 ${
                            isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-400 dark:text-slate-500 group-active:text-blue-600'
                          }`}
                        />
                      )}

                      {/* Badge */}
                      {item.badge !== undefined && item.badge > 0 && (
                        <motion.div
                          key={item.badge}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          className="absolute -top-1.5 -right-2"
                        >
                          <Badge className="h-4 min-w-[16px] flex items-center justify-center p-0 bg-blue-500 text-white text-[9px] font-bold shadow-sm border-0 px-1">
                            {item.badge > 99 ? '99+' : item.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-[10px] mt-0.5 font-medium transition-colors duration-200 ${
                        item.isSpecial
                          ? 'text-blue-600 dark:text-blue-400 -mt-0.5'
                          : isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-400 dark:text-slate-500 group-active:text-blue-600'
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
