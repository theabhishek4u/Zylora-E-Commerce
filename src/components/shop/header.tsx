'use client';

import { useShopStore } from '@/store/shop-store';
import { Search, ShoppingCart, Menu, Package, Heart, User, ChevronDown, Bell, X, Zap, LayoutDashboard, LogIn, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';

export function Header() {
  const {
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    categories, currentView, setCurrentView, getCartCount, goHome,
    user, wishlistIds,
  } = useShopStore();
  const { data: session } = useSession();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const cartCount = getCartCount();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocalSearch(searchQuery); }, [searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (currentView !== 'home') setCurrentView('home');
    setShowSearch(false);
  };

  const currentUser = user || (session?.user ? { id: (session.user as { id: string }).id, name: session.user.name || '', email: session.user.email || '', role: (session.user as { role: string }).role || 'user' } : null);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between text-xs">
          <span className="hidden sm:inline">🚚 Free delivery on orders above ₹499</span>
          <span className="sm:hidden">🚚 Free delivery ₹499+</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('orders')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Package className="h-3 w-3" /> <span className="hidden sm:inline">My Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="shrink-0"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="p-4 border-b"><h2 className="font-bold text-lg">Categories</h2></div>
                <nav className="p-2">
                  <button onClick={() => { setSelectedCategory(null); setCurrentView('home'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium ${!selectedCategory ? 'bg-amber-50 text-amber-700' : 'hover:bg-slate-100'}`}>
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => { setSelectedCategory(cat.slug); setCurrentView('home'); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium ${selectedCategory === cat.slug ? 'bg-amber-50 text-amber-700' : 'hover:bg-slate-100'}`}>
                      {cat.icon && <span className="mr-2">{cat.icon}</span>}{cat.name}
                    </button>
                  ))}
                  <div className="border-t mt-2 pt-2">
                    <button onClick={() => { setCurrentView('wishlist'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg font-medium hover:bg-slate-100 flex items-center gap-2">
                      <Heart className="h-4 w-4" /> Wishlist {wishlistIds.length > 0 && <Badge className="ml-auto bg-amber-500 text-white text-xs">{wishlistIds.length}</Badge>}
                    </button>
                    {isAdmin && (
                      <button onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg font-medium hover:bg-slate-100 flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Admin Panel
                      </button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <motion.button onClick={goHome} className="flex items-center gap-2 shrink-0" whileTap={{ scale: 0.95 }}>
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-1.5 shadow-lg shadow-amber-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:inline">
                Z <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Shop</span>
              </span>
            </motion.button>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl">
              <div className="relative flex w-full">
                <Input type="text" placeholder="Search products, brands and more..." value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full h-10 rounded-l-xl rounded-r-none border-amber-200 focus-visible:ring-amber-500/30 focus-visible:border-amber-400 bg-white dark:bg-slate-800" />
                <Button type="submit" className="h-10 rounded-l-none rounded-r-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-5">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Search - Mobile toggle */}
            <Button variant="ghost" size="icon" className="sm:hidden shrink-0" onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Right Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="hidden sm:flex relative" onClick={() => setCurrentView('wishlist')}>
                <Heart className="h-5 w-5" />
                {wishlistIds.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-amber-500 text-white text-[10px]">{wishlistIds.length}</Badge>
                )}
              </Button>

              {/* Notifications */}
              <div className="relative hidden sm:block" ref={notifRef}>
                <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell className="h-5 w-5" />
                </Button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border overflow-hidden z-50">
                      <div className="p-3 border-b font-semibold text-sm">Notifications</div>
                      <div className="p-3 text-sm text-muted-foreground text-center">No new notifications</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Button variant="ghost" className="relative shrink-0" onClick={() => setCurrentView('cart')}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-amber-500 text-white text-xs font-bold">{cartCount > 99 ? '99+' : cartCount}</Badge>
                  </motion.div>
                )}
                <span className="hidden sm:inline ml-1 text-sm font-medium">Cart</span>
              </Button>

              {/* User */}
              <div className="relative" ref={userMenuRef}>
                {currentUser ? (
                  <Button variant="ghost" className="gap-1 shrink-0" onClick={() => setShowUserMenu(!showUserMenu)}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      {currentUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="h-3 w-3 hidden sm:inline" />
                  </Button>
                ) : (
                  <Button variant="ghost" className="gap-1 shrink-0" onClick={() => setCurrentView('auth')}>
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline text-sm">Login</span>
                  </Button>
                )}
                <AnimatePresence>
                  {showUserMenu && currentUser && (
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border overflow-hidden z-50">
                      <div className="p-3 border-b">
                        <p className="font-semibold text-sm">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                      </div>
                      <div className="p-1">
                        <button onClick={() => { setCurrentView('user-dashboard'); setShowUserMenu(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                          <Settings className="h-4 w-4" /> My Dashboard
                        </button>
                        <button onClick={() => { setCurrentView('orders'); setShowUserMenu(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                          <Package className="h-4 w-4" /> My Orders
                        </button>
                        <button onClick={() => { setCurrentView('wishlist'); setShowUserMenu(false); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                          <Heart className="h-4 w-4" /> Wishlist
                        </button>
                        {isAdmin && (
                          <button onClick={() => { setCurrentView('admin'); setShowUserMenu(false); }}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" /> Admin Panel
                          </button>
                        )}
                        <div className="border-t my-1" />
                        <button onClick={() => { useShopStore.getState().setUser(null); setShowUserMenu(false); setCurrentView('home'); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <AnimatePresence>
            {showSearch && (
              <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                onSubmit={handleSearch} className="sm:hidden overflow-hidden mt-3">
                <div className="flex">
                  <Input type="text" placeholder="Search..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
                    className="flex-1 h-10 rounded-l-xl rounded-r-none" autoFocus />
                  <Button type="submit" className="h-10 rounded-l-none rounded-r-xl bg-amber-500 px-4"><Search className="h-4 w-4" /></Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Category Nav */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border-b border-border/30 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-2 whitespace-nowrap">
            <button onClick={() => { setSelectedCategory(null); if (currentView !== 'home') setCurrentView('home'); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedCategory ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 hover:bg-slate-100'}`}>
              All
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => { setSelectedCategory(cat.slug); if (currentView !== 'home') setCurrentView('home'); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.slug ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 hover:bg-slate-100'}`}>
                {cat.icon && <span className="mr-1">{cat.icon}</span>}{cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
