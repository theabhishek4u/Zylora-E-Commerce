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
import { useMemo, useState, useCallback } from 'react';

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

  // Visual haptic feedback state
  const [flashKey, setFlashKey] = useState(0);

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
    // Trigger visual haptic feedback
    setFlashKey(prev => prev + 1);

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
          <div className="relative">
            {/* Premium Glass Container */}
            <div className="relative bg-gradient-to-b from-white/90 via-white/85 to-blue-50/80 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-800/85 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-300/60 dark:via-blue-500/30 to-transparent" />

              {/* Subtle noise texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Haptic flash overlay */}
              <AnimatePresence>
                {flashKey > 0 && (
                  <motion.div
                    key={flashKey}
                    initial={{ opacity: 0.15 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute inset-0 bg-white pointer-events-none z-10 dark:bg-white/5"
                  />
                )}
              </AnimatePresence>

              <div className="relative flex items-center justify-around px-1 min-h-[64px] pb-[env(safe-area-inset-bottom)]">
                {navItems.map((item) => {
                  const isActive = getIsActive(item);
                  const Icon = item.icon;

                  return (
                    <motion.button
                      key={item.key}
                      onClick={() => handleNavClick(item)}
                      className={`relative flex flex-col items-center justify-center py-2 px-2 min-w-[56px] group ${
                        item.isSpecial ? '-mt-4' : ''
                      }`}
                      whileTap={{ scale: 0.85 }}
                      aria-label={item.label}
                    >
                      {/* Active indicator pill - wider gradient pill */}
                      <AnimatePresence>
                        {isActive && !item.isSpecial && (
                          <motion.div
                            layoutId="activeIndicator"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            className="absolute -top-0.5 h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
                            style={{ width: item.label.length > 6 ? 28 : 20, left: '50%', x: '-50%' }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Icon container */}
                      <div className="relative">
                        {item.isSpecial ? (
                          // Premium elevated search pill button
                          <motion.div
                            className="relative flex items-center justify-center w-12 h-12 -mt-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 ring-2 ring-white/50 shadow-[0_4px_20px_rgba(59,130,246,0.45)] dark:ring-white/20"
                            animate={!isActive ? {
                              boxShadow: [
                                '0 4px 20px rgba(59,130,246,0.35)',
                                '0 4px 28px rgba(59,130,246,0.55)',
                                '0 4px 20px rgba(59,130,246,0.35)',
                              ],
                            } : {}}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <motion.div
                              animate={isActive ? { rotate: 10 } : { rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            >
                              <Icon className="h-5 w-5 text-white drop-shadow-sm" />
                            </motion.div>
                          </motion.div>
                        ) : (
                          <motion.div
                            animate={isActive ? { scale: [0.85, 1.08, 1] } : { scale: 1 }}
                            transition={isActive ? {
                              type: 'spring',
                              stiffness: 400,
                              damping: 12,
                            } : { duration: 0.15 }}
                          >
                            <Icon
                              className={`h-5 w-5 transition-all duration-200 ${
                                isActive
                                  ? 'text-blue-600 dark:text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]'
                                  : 'text-slate-400/70 dark:text-slate-500/70 group-active:text-blue-600'
                              }`}
                            />
                          </motion.div>
                        )}

                        {/* Premium Badge */}
                        {item.badge !== undefined && item.badge > 0 && (
                          <motion.div
                            key={item.badge}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                            className="absolute -top-1.5 -right-2.5"
                          >
                            <Badge className="h-4 min-w-[16px] flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-[9px] font-bold shadow-[0_2px_8px_rgba(239,68,68,0.5)] border-0 px-1">
                              {item.badge > 99 ? '99+' : item.badge}
                            </Badge>
                          </motion.div>
                        )}
                      </div>

                      {/* Label */}
                      <span
                        className={`text-[10px] mt-0.5 transition-all duration-200 ${
                          item.isSpecial
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent font-semibold -mt-0.5'
                            : isActive
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent font-semibold'
                              : 'text-slate-400/80 dark:text-slate-500/80 font-medium group-active:text-blue-600'
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
