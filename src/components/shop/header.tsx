'use client';

import { useShopStore } from '@/store/shop-store';
import { Search, ShoppingCart, Menu, Package, Heart, User, ChevronDown, Bell, X, LayoutDashboard, LogIn, LogOut, Settings, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Image from 'next/image';

export function Header() {
  const {
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    categories, currentView, setCurrentView, getCartCount, goHome,
    user, wishlistIds, sortBy, setSortBy,
  } = useShopStore();
  const { data: session } = useSession();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = getCartCount();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLocalSearch(searchQuery); }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Listen for mobile bottom nav search focus event
  useEffect(() => {
    const handleSearchFocus = () => {
      setShowSearch(true);
      setTimeout(() => searchInputRef.current?.focus(), 150);
    };
    window.addEventListener('zylora-focus-search', handleSearchFocus);
    return () => window.removeEventListener('zylora-focus-search', handleSearchFocus);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (currentView !== 'home') setCurrentView('home');
    setShowSearch(false);
    if (searchInputRef.current) searchInputRef.current?.blur();
  }, [localSearch, setSearchQuery, currentView, setCurrentView]);

  const handleSignOut = useCallback(async () => {
    try {
      useShopStore.getState().setUser(null);
      setShowUserMenu(false);
      setCurrentView('home');
      await signOut({ redirect: false });
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  }, [setCurrentView]);

  const currentUser = user || (session?.user ? {
    id: (session.user as { id: string }).id,
    name: session.user.name || '',
    email: session.user.email || '',
    role: (session.user as { role: string }).role || 'user',
  } : null);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-50">
      {/* ── Top Announcement Bar ── */}
      <div className="bg-[#0F172A] text-white overflow-hidden relative">
        <div className="shimmer-overlay" />
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs relative z-10">
          <div className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline font-medium tracking-wide">
              Free delivery on orders above <span className="text-blue-300 font-semibold">₹499</span>
            </span>
            <span className="sm:hidden font-medium tracking-wide">
              Free delivery <span className="text-blue-300 font-semibold">₹499+</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('orders')}
              className="hover:text-blue-300 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Package className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">My Orders</span>
            </button>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className={`glass-strong transition-all duration-300 ${scrolled ? 'shadow-lg shadow-black/[0.04]' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            {/* Mobile Hamburger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="shrink-0 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                  <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 glass-strong border-r-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                {/* Mobile Menu Header */}
                <div className="p-5 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-brand">
                      <Image src="/zylora-logo.png" alt="Zylora" fill className="object-contain p-1" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-lg gradient-text">Zylora</h2>
                      <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Premium Store</p>
                    </div>
                  </div>
                </div>

                {/* Mobile User Info */}
                {currentUser && (
                  <div className="p-4 border-b border-border/50 bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-brand">
                        {currentUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Categories */}
                <div className="p-3">
                  <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Categories</p>
                  <button
                    onClick={() => { setSelectedCategory(null); setCurrentView('home'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                      !selectedCategory
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-brand'
                        : 'hover:bg-blue-50 dark:hover:bg-blue-950/30 text-foreground'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" /> All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.slug); setCurrentView('home'); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                        selectedCategory === cat.slug
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-brand'
                          : 'hover:bg-blue-50 dark:hover:bg-blue-950/30 text-foreground'
                      }`}
                    >
                      {cat.icon && <span className="text-base">{cat.icon}</span>}
                      {cat.name}
                    </button>
                  ))}
                </div>

                <Separator className="mx-3" />

                {/* Mobile Quick Links */}
                <div className="p-3 space-y-1">
                  <p className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Quick Links</p>
                  <button
                    onClick={() => { setCurrentView('wishlist'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-3 transition-all"
                  >
                    <Heart className="h-4 w-4 text-blue-600" /> Wishlist
                    {wishlistIds.length > 0 && (
                      <Badge className="ml-auto bg-blue-500 text-white text-xs h-5 min-w-[20px] flex items-center justify-center">
                        {wishlistIds.length}
                      </Badge>
                    )}
                  </button>
                  <button
                    onClick={() => { setCurrentView('orders'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-3 transition-all"
                  >
                    <Package className="h-4 w-4 text-blue-600" /> My Orders
                  </button>
                  {currentUser && (
                    <button
                      onClick={() => { setCurrentView('user-dashboard'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-3 transition-all"
                    >
                      <Settings className="h-4 w-4 text-blue-600" /> My Dashboard
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-3 transition-all"
                    >
                      <LayoutDashboard className="h-4 w-4 text-blue-600" /> Admin Panel
                    </button>
                  )}
                </div>

                {/* Mobile Auth */}
                <div className="mt-auto p-4 border-t border-border/50">
                  {currentUser ? (
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                  ) : (
                    <Button
                      onClick={() => { setCurrentView('auth'); setMobileMenuOpen(false); }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-brand"
                    >
                      <LogIn className="h-4 w-4 mr-2" /> Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <motion.button
              onClick={goHome}
              className="flex items-center gap-2.5 shrink-0 group"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-shadow duration-300">
                <Image src="/zylora-logo.png" alt="Zylora" fill className="object-contain p-1.5" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight hidden sm:inline">
                <span className="gradient-text">Zylora</span>
              </span>
            </motion.button>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
              <motion.div
                className="relative flex w-full"
                animate={searchFocused ? { scale: 1.01 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className={`relative flex w-full rounded-xl transition-all duration-300 ${
                  searchFocused
                    ? 'ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'ring-1 ring-slate-200 dark:ring-slate-700'
                }`}>
                  <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                    searchFocused ? 'text-blue-600' : 'text-slate-400'
                  }`} />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products, brands and more..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full h-10 pl-10 pr-4 rounded-l-xl rounded-r-none border-0 bg-white/80 dark:bg-slate-800/80 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                  />
                  <Button
                    type="submit"
                    className="h-10 rounded-l-none rounded-r-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 shadow-none border-0 transition-all duration-200"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </form>

            {/* Search - Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              onClick={() => {
                setShowSearch(!showSearch);
                if (!showSearch) {
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }
              }}
            >
              <Search className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </Button>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 shrink-0">
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex relative hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                onClick={() => setCurrentView('wishlist')}
              >
                <Heart className="h-5 w-5 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors" />
                {wishlistIds.length > 0 && (
                  <motion.div
                    key={wishlistIds.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    <Badge className="absolute -top-1 -right-1 h-4.5 w-4.5 flex items-center justify-center p-0 bg-blue-500 text-white text-[10px] font-bold shadow-sm min-w-[18px]">
                      {wishlistIds.length}
                    </Badge>
                  </motion.div>
                )}
              </Button>

              {/* Notifications */}
              <div className="relative hidden sm:block" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </Button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-xl shadow-xl border border-white/20 dark:border-white/10 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-border/50">
                        <h3 className="font-heading font-semibold text-sm">Notifications</h3>
                      </div>
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mx-auto mb-3">
                          <Bell className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-sm text-muted-foreground">No new notifications</p>
                        <p className="text-xs text-muted-foreground mt-1">We&apos;ll let you know when something arrives</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Button
                variant="ghost"
                className="relative shrink-0 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors gap-1.5"
                onClick={() => setCurrentView('cart')}
              >
                <ShoppingCart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                {cartCount > 0 && (
                  <motion.div
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 bg-blue-500 text-white text-xs font-bold shadow-sm">
                      {cartCount > 99 ? '99+' : cartCount}
                    </Badge>
                  </motion.div>
                )}
                <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">Cart</span>
              </Button>

              {/* User */}
              <div className="relative" ref={userMenuRef}>
                {currentUser ? (
                  <Button
                    variant="ghost"
                    className="gap-1.5 shrink-0 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-brand">
                      {currentUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 hidden sm:inline ${showUserMenu ? 'rotate-180' : ''}`} />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="gap-1.5 shrink-0 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    onClick={() => setCurrentView('auth')}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">Login</span>
                  </Button>
                )}

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && currentUser && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-xl shadow-xl border border-white/20 dark:border-white/10 overflow-hidden z-50"
                    >
                      {/* User Info Header */}
                      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-blue-600/5 to-blue-700/5 dark:from-blue-600/10 dark:to-blue-700/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-brand">
                            {currentUser.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{currentUser.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-1.5">
                        <button
                          onClick={() => { setCurrentView('user-dashboard'); setShowUserMenu(false); }}
                          className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-3 transition-colors group"
                        >
                          <Settings className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          <span>My Dashboard</span>
                        </button>
                        <button
                          onClick={() => { setCurrentView('orders'); setShowUserMenu(false); }}
                          className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-3 transition-colors group"
                        >
                          <Package className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          <span>My Orders</span>
                        </button>
                        <button
                          onClick={() => { setCurrentView('wishlist'); setShowUserMenu(false); }}
                          className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-3 transition-colors group"
                        >
                          <Heart className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          <span>Wishlist</span>
                          {wishlistIds.length > 0 && (
                            <Badge className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs h-5">
                              {wishlistIds.length}
                            </Badge>
                          )}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => { setCurrentView('admin'); setShowUserMenu(false); }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-3 transition-colors group"
                          >
                            <LayoutDashboard className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            <span>Admin Panel</span>
                          </button>
                        )}
                      </div>

                      <Separator className="mx-2" />

                      {/* Sign Out */}
                      <div className="p-1.5">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center gap-3 transition-colors group"
                        >
                          <LogOut className="h-4 w-4 group-hover:text-red-600 transition-colors" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                onSubmit={handleSearch}
                className="md:hidden overflow-hidden"
              >
                <div className="pb-3 flex">
                  <div className={`relative flex w-full rounded-xl transition-all duration-300 ring-1 ${
                    searchFocused ? 'ring-blue-500/40' : 'ring-slate-200 dark:ring-slate-700'
                  }`}>
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="flex-1 h-10 pl-10 pr-4 rounded-l-xl rounded-r-none border-0 bg-white/80 dark:bg-slate-800/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      className="h-10 rounded-l-none rounded-r-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 shadow-none border-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Category Navigation Bar (hidden on mobile, shown on md+) ── */}
      <div className="hidden md:block glass overflow-x-auto scrollbar-hide border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1.5 py-2.5 whitespace-nowrap">
            <motion.button
              onClick={() => { setSelectedCategory(null); if (currentView !== 'home') setCurrentView('home'); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); if (currentView !== 'home') setCurrentView('home'); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.slug
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
