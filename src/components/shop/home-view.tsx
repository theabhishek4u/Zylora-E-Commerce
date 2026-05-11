'use client';

import { useShopStore } from '@/store/shop-store';
import { ProductCard } from './product-card';
import { formatINR, calculateDiscount } from '@/lib/format';
import {
  ArrowRight,
  TrendingUp,
  Truck,
  Shield,
  Percent,
  Zap,
  Sparkles,
  RotateCcw,
  Star,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function HomeView() {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    sortBy,
    setSortBy,
    navigateToProduct,
    wishlistIds,
    isInWishlist,
    toggleWishlist,
  } = useShopStore();

  const [sortOpen, setSortOpen] = useState(false);

  const featuredProducts = useMemo(() => products.filter((p) => p.featured), [products]);
  const saleProducts = useMemo(() => products.filter((p) => p.onSale), [products]);
  const newArrivals = useMemo(() => products.filter((p) => p.newArrival), [products]);
  const topRated = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedCategory)
      filtered = filtered.filter(
        (p) => categories.find((c) => c.id === p.categoryId)?.slug === selectedCategory
      );
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        filtered.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating
        );
    }
    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy, categories]);

  const currentCategory = categories.find((c) => c.slug === selectedCategory);

  const showHero = !searchQuery && !selectedCategory;

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest' },
  ];

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      {showHero && (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
          {/* Decorative glow orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
            <div className="absolute top-1/3 right-0 h-72 w-72 rounded-full bg-blue-400/15 blur-[100px]" />
            <div className="absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-[110px]" />
          </div>

          {/* Background image overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=600&fit=crop')] bg-cover bg-center opacity-[0.07]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-28">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <Badge className="mb-4 sm:mb-6 bg-blue-500/15 text-blue-300 border border-blue-400/25 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium">
                  ✨ New Collection 2025
                </Badge>
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="font-heading text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-3 sm:mb-5 leading-[1.1] tracking-tight"
              >
                Shop Smarter{' '}
                <span className="gradient-text">with Zylora</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-slate-300 text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-lg leading-relaxed"
              >
                Premium shopping experience. Up to 70% off on electronics, fashion, home &amp; more.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex flex-wrap gap-3 sm:gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => setSelectedCategory(null)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/25 rounded-xl px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setSortBy('rating')}
                  className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base"
                >
                  Explore Deals
                  <Star className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Parallax-like floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
              className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2"
            >
              <div className="glass rounded-2xl p-6 w-56 space-y-4 border-white/10">
                <div className="text-center">
                  <p className="text-3xl font-bold gradient-text">10K+</p>
                  <p className="text-xs text-slate-400 mt-1">Products</p>
                </div>
                <div className="h-px bg-white/10" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">50K+</p>
                  <p className="text-xs text-slate-400 mt-1">Happy Customers</p>
                </div>
                <div className="h-px bg-white/10" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">70%</p>
                  <p className="text-xs text-slate-400 mt-1">Max Discount</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TRUST BADGES BAR
      ═══════════════════════════════════════════════════════════ */}
      {showHero && (
        <section className="glass border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
            <div className="grid grid-cols-4 gap-2 sm:gap-6">
              {[
                { icon: Truck, text: 'Free Delivery', subtext: '₹499+' },
                { icon: Shield, text: 'Secure', subtext: 'Payments' },
                { icon: Percent, text: 'Best', subtext: 'Prices' },
                { icon: RotateCcw, text: '7-Day', subtext: 'Returns' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left sm:text-sm"
                >
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                    <item.icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600" />
                  </div>
                  <div className="sm:hidden">
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight block">{item.text}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight block">{item.subtext}</span>
                  </div>
                  <span className="hidden sm:inline text-muted-foreground font-medium">{item.text} {item.subtext}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SHOP BY CATEGORY
      ═══════════════════════════════════════════════════════════ */}
      {/* Mobile Category Chips - visible only on mobile */}
      {showHero && categories.length > 0 && (
        <section className="md:hidden">
          <div className="overflow-x-auto scrollbar-hide px-4 py-3">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <motion.button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0 ${
                  !selectedCategory
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                All
              </motion.button>
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0 ${
                    selectedCategory === cat.slug
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25'
                      : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat.icon && <span className="mr-1">{cat.icon}</span>}
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Desktop Category Grid */}
      {showHero && categories.length > 0 && (
        <section className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
          >
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8">
              Shop by Category
            </h2>
          </motion.div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                variants={staggerItem}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedCategory(cat.slug)}
                className="group glass flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-2xl border border-border/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-center group-hover:text-blue-600 transition-colors">
                  {cat.icon} {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          FLASH SALE
      ═══════════════════════════════════════════════════════════ */}
      {showHero && saleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8">
            {/* Decorative orb */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-blue-400/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-300/15 blur-[70px]" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-white">
                  <Zap className="h-6 w-6" />
                  <h2 className="font-heading text-xl sm:text-2xl font-bold">Flash Sale</h2>
                  <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/10">
                    Limited Time
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/15 rounded-xl"
                  onClick={() => {
                    setSelectedCategory(null);
                    useShopStore.getState().setSearchQuery('');
                  }}
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {saleProducts.slice(0, 4).map((product, i) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigateToProduct(product.id)}
                    className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 hover:bg-white/20 transition-colors text-left text-white border border-white/10"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-white/20">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs sm:text-sm line-clamp-1">{product.name}</p>
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                        <span className="font-bold text-xs sm:text-sm">{formatINR(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] sm:text-sm line-through opacity-60">
                            {formatINR(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <Badge className="mt-0.5 sm:mt-1 bg-white/20 text-white text-[9px] sm:text-xs border-white/10 px-1 sm:px-2">
                          {calculateDiscount(product.price, product.originalPrice)}% OFF
                        </Badge>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TRENDING NOW
      ═══════════════════════════════════════════════════════════ */}
      {showHero && featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold">
                Trending Now
              </h2>
            </div>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-30px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {featuredProducts.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          NEW ARRIVALS
      ═══════════════════════════════════════════════════════════ */}
      {showHero && newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                <Sparkles className="h-4.5 w-4.5 text-violet-500" />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold">
                New Arrivals
              </h2>
            </div>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-30px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {newArrivals.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TOP RATED
      ═══════════════════════════════════════════════════════════ */}
      {showHero && topRated.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Star className="h-4.5 w-4.5 text-blue-600 fill-blue-600" />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold">
                Top Rated
              </h2>
            </div>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-30px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {topRated.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          ALL PRODUCTS / FILTERED SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : currentCategory
                  ? currentCategory.name
                  : 'All Products'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/20"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm">
                {sortOptions.find((o) => o.value === sortBy)?.label || 'Featured'}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`}
              />
            </Button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-50 min-w-[200px] rounded-xl bg-white dark:bg-slate-800 border border-border/50 shadow-xl overflow-hidden"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value
                          ? 'bg-blue-500/10 text-blue-600 font-medium'
                          : 'text-foreground hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 mb-5">
              <Search className="h-9 w-9 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Try adjusting your search or browse a different category
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                useShopStore.getState().setSearchQuery('');
              }}
              className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {filteredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
