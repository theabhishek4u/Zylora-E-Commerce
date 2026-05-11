'use client';

import { useShopStore } from '@/store/shop-store';
import { Search, ShoppingCart, Menu, X, Package, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';

export function Header() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    currentView,
    setCurrentView,
    getCartCount,
    goHome,
  } = useShopStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = getCartCount();

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">🚚 Free delivery on orders above ₹499</span>
            <span className="sm:hidden">🚚 Free delivery ₹499+</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('orders')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Package className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">My Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-white p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="p-4 border-b">
                  <h2 className="font-bold text-lg text-slate-900">Categories</h2>
                </div>
                <nav className="p-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentView('home');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                      !selectedCategory ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setCurrentView('home');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                        selectedCategory === cat.slug ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <button
              onClick={goHome}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="bg-amber-500 rounded-lg p-1.5">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:inline">
                Z <span className="text-amber-400">Shop</span>
              </span>
            </button>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative flex">
                <Input
                  type="text"
                  placeholder="Search products, brands and more..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full h-10 rounded-l-lg rounded-r-none border-0 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  className="h-10 rounded-l-none rounded-r-lg bg-amber-500 hover:bg-amber-600 px-4"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Cart button */}
            <Button
              variant="ghost"
              className="relative text-white hover:bg-slate-700 shrink-0"
              onClick={() => setCurrentView('cart')}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-amber-500 text-white text-xs font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </Badge>
              )}
              <span className="hidden sm:inline ml-2 text-sm font-medium">Cart</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Category navigation */}
      <div className="bg-slate-700 text-white overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-2 whitespace-nowrap">
            <button
              onClick={() => {
                setSelectedCategory(null);
                if (currentView !== 'home') setCurrentView('home');
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory ? 'bg-amber-500 text-white' : 'text-slate-200 hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  if (currentView !== 'home') setCurrentView('home');
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.slug ? 'bg-amber-500 text-white' : 'text-slate-200 hover:bg-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
