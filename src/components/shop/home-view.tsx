'use client';

import { useShopStore } from '@/store/shop-store';
import { ProductCard } from './product-card';
import { formatINR, calculateDiscount } from '@/lib/format';
import { ArrowRight, TrendingUp, Clock, Percent, Truck, Shield, Zap, Flame, Sparkles, RotateCcw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

export function HomeView() {
  const { products, categories, selectedCategory, setSelectedCategory, searchQuery, sortBy, setSortBy, navigateToProduct } = useShopStore();

  const featuredProducts = useMemo(() => products.filter((p) => p.featured), [products]);
  const saleProducts = useMemo(() => products.filter((p) => p.onSale), [products]);
  const newArrivals = useMemo(() => products.filter((p) => p.newArrival), [products]);
  const topRated = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8), [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedCategory) filtered = filtered.filter((p) => categories.find((c) => c.id === p.categoryId)?.slug === selectedCategory);
    if (searchQuery) { const q = searchQuery.toLowerCase(); filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)); }
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
    }
    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy, categories]);

  const currentCategory = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {!searchQuery && !selectedCategory && (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=500&fit=crop')] bg-cover bg-center opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 py-14 sm:py-20">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30 backdrop-blur-sm">
                  <Flame className="h-3 w-3 mr-1" /> Great Indian Sale is Live!
                </Badge>
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                Shop the Best <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Deals</span> in India
              </h1>
              <p className="text-slate-300 text-lg mb-8 max-w-lg">Up to 70% off on electronics, fashion, home essentials and more.</p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => setSelectedCategory('electronics')} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setSortBy('rating')} className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                  Top Rated <Star className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      {!searchQuery && !selectedCategory && (
        <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Truck, text: 'Free Delivery ₹499+' },
                { icon: Shield, text: 'Secure Payments' },
                { icon: Percent, text: 'Best Prices' },
                { icon: RotateCcw, text: '7-Day Returns' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <item.icon className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {!searchQuery && !selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((cat, i) => (
              <motion.button key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedCategory(cat.slug)}
                className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-border/30 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-center group-hover:text-amber-600 transition-colors">{cat.icon} {cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Flash Sale */}
      {!searchQuery && !selectedCategory && saleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-white">
                <Zap className="h-6 w-6" />
                <h2 className="text-xl sm:text-2xl font-bold">Flash Sale</h2>
                <Badge className="bg-white/20 text-white backdrop-blur-sm">Limited Time</Badge>
              </div>
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => { setSelectedCategory(null); useShopStore.getState().setSearchQuery(''); }}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {saleProducts.slice(0, 4).map((product) => (
                <motion.button key={product.id} whileHover={{ scale: 1.02 }} onClick={() => navigateToProduct(product.id)}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/20 transition-colors text-left text-white">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/20">
                    <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bold">{formatINR(product.price)}</span>
                      {product.originalPrice && <span className="text-sm line-through opacity-60">{formatINR(product.originalPrice)}</span>}
                    </div>
                    {product.originalPrice && <Badge className="mt-1 bg-white/20 text-white text-xs">{calculateDiscount(product.price, product.originalPrice)}% OFF</Badge>}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending / Featured */}
      {!searchQuery && !selectedCategory && featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-amber-500" /><h2 className="text-xl sm:text-2xl font-bold">Trending Now</h2></div>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </motion.div>
        </section>
      )}

      {/* New Arrivals */}
      {!searchQuery && !selectedCategory && newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-violet-500" /><h2 className="text-xl sm:text-2xl font-bold">New Arrivals</h2></div>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {newArrivals.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </motion.div>
        </section>
      )}

      {/* Top Rated */}
      {!searchQuery && !selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-500 fill-amber-500" /><h2 className="text-xl sm:text-2xl font-bold">Top Rated</h2></div>
          </div>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {topRated.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </motion.div>
        </section>
      )}

      {/* All Products / Filtered */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {searchQuery ? `Results for "${searchQuery}"` : currentCategory ? currentCategory.name : 'All Products'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{filteredProducts.length} products found</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500/20 focus:outline-none">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter</p>
            <Button variant="outline" onClick={() => { setSelectedCategory(null); useShopStore.getState().setSearchQuery(''); }}>Clear Filters</Button>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </motion.div>
        )}
      </section>
    </div>
  );
}
