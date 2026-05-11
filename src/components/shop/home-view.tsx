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
  Clock,
  Package,
  Users,
  Eye,
  ChevronRight,
  ShoppingBag,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState, useEffect, useRef } from 'react';
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

/* ─── Animated counter hook ────────────────────────────────── */
function useAnimatedCounter(end: number, duration = 2000, startOnMount = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!startOnMount) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, startOnMount]);
  return count;
}

/* ─── Fake countdown timer ─────────────────────────────────── */
function useCountdown() {
  const [time, setTime] = useState({ hours: 5, minutes: 47, seconds: 32 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

/* ─── Section header component ─────────────────────────────── */
function SectionHeader({
  icon: Icon,
  title,
  color = 'blue',
  onviewall,
}: {
  icon: React.ElementType;
  title: string;
  color?: string;
  onviewall?: () => void;
}) {
  const colorMap: Record<string, { bg: string; text: string; underline: string; hover: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', underline: 'from-blue-500 to-blue-400', hover: 'hover:text-blue-600' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', underline: 'from-violet-500 to-violet-400', hover: 'hover:text-violet-600' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', underline: 'from-amber-500 to-amber-400', hover: 'hover:text-amber-600' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', underline: 'from-emerald-500 to-emerald-400', hover: 'hover:text-emerald-600' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <motion.div
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl ${c.bg}`}
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${c.text}`} />
          </motion.div>
          <div>
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              {title}
            </h2>
            <div className={`h-1 w-12 sm:w-16 rounded-full bg-gradient-to-r ${c.underline} mt-1`} />
          </div>
        </div>
        {onviewall && (
          <Button
            variant="ghost"
            className={`${c.hover} text-muted-foreground rounded-xl gap-1 text-sm font-medium`}
            onClick={onviewall}
          >
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Category color map ───────────────────────────────────── */
const categoryGradients = [
  'from-blue-500/10 to-cyan-500/10',
  'from-violet-500/10 to-pink-500/10',
  'from-amber-500/10 to-orange-500/10',
  'from-emerald-500/10 to-teal-500/10',
  'from-rose-500/10 to-red-500/10',
  'from-indigo-500/10 to-sky-500/10',
];

/* ────────────────────────────────────────────────────────────── */

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
  const sortRef = useRef<HTMLDivElement>(null);

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

  // Animated counters
  const productsCount = useAnimatedCounter(10000, 2000);
  const customersCount = useAnimatedCounter(50000, 2500);
  const discountPercent = useAnimatedCounter(70, 1800);

  // Countdown timer for flash sale
  const countdown = useCountdown();

  // Featured product for hero showcase
  const heroFeaturedProduct = useMemo(() => {
    if (featuredProducts.length > 0) return featuredProducts[0];
    if (products.length > 0) return products[0];
    return null;
  }, [featuredProducts, products]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const marqueeText = '🔥 Flash Sale Live Now · ⚡ Up to 70% OFF · 🚚 Free Delivery ₹499+ · ⭐ 50K+ Happy Customers · 💳 Secure Payments · 🎁 New Arrivals Daily · ✨ Best Prices Guaranteed';

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Premium animated gradient with floating orbs
      ═══════════════════════════════════════════════════════════ */}
      {showHero && (
        <section className="relative overflow-hidden gradient-shift bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
          {/* Floating decorative orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="float-orb absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />
            <div className="float-orb-delay absolute top-1/4 right-0 h-64 w-64 rounded-full bg-indigo-400/15 blur-[90px]" />
            <div className="float-orb-slow absolute -bottom-16 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />
            <div className="float-orb absolute top-1/2 left-1/2 h-48 w-48 rounded-full bg-violet-400/8 blur-[80px]" />
            {/* Small sparkle dots */}
            <div className="absolute top-[15%] left-[20%] h-1.5 w-1.5 rounded-full bg-blue-400/60 animate-pulse" />
            <div className="absolute top-[35%] right-[15%] h-1 w-1 rounded-full bg-cyan-400/50 animate-pulse delay-700" />
            <div className="absolute top-[60%] left-[10%] h-1.5 w-1.5 rounded-full bg-indigo-400/40 animate-pulse delay-1000" />
            <div className="absolute top-[25%] right-[35%] h-1 w-1 rounded-full bg-blue-300/50 animate-pulse delay-500" />
            <div className="absolute top-[75%] right-[25%] h-1.5 w-1.5 rounded-full bg-violet-400/40 animate-pulse delay-300" />
          </div>

          {/* Background image overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=600&fit=crop')] bg-cover bg-center opacity-[0.05]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-28 lg:py-32">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              {/* Left side: Text content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="flex-1 max-w-2xl text-center lg:text-left"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="flex justify-center lg:justify-start"
                >
                  <Badge className="mb-4 sm:mb-6 bg-blue-500/15 text-blue-300 border border-blue-400/25 backdrop-blur-md px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    New Collection 2025
                  </Badge>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-4 sm:mb-6 leading-[1.08] tracking-tight"
                >
                  Shop Smarter{' '}
                  <span className="gradient-text">with Zylora</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-slate-300 text-sm sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                >
                  Premium shopping experience. Up to 70% off on electronics, fashion, home &amp; more.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
                >
                  <Button
                    size="lg"
                    onClick={() => setSelectedCategory(null)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 rounded-xl px-7 sm:px-9 h-12 sm:h-13 text-sm sm:text-base group"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setSortBy('rating')}
                    className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl px-7 sm:px-9 h-12 sm:h-13 text-sm sm:text-base group"
                  >
                    Explore Deals
                    <Star className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </Button>
                </motion.div>

                {/* Animated counter stats */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex items-center gap-6 sm:gap-10 mt-8 sm:mt-10 justify-center lg:justify-start"
                >
                  {[
                    { value: productsCount.toLocaleString() + '+', label: 'Products', icon: Package },
                    { value: (customersCount / 1000).toFixed(0) + 'K+', label: 'Customers', icon: Users },
                    { value: discountPercent + '%', label: 'Max Off', icon: Percent },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold count-shimmer">{stat.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 justify-center">
                        <stat.icon className="h-3 w-3" />
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right side: Featured Product showcase card (desktop) */}
              {heroFeaturedProduct && (
                <motion.div
                  initial={{ opacity: 0, x: 60, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.9, ease: 'easeOut' }}
                  className="hidden lg:block relative flex-shrink-0"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    onClick={() => navigateToProduct(heroFeaturedProduct.id)}
                    className="cursor-pointer relative w-72 xl:w-80 rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-blue-900/30 group"
                  >
                    {/* Product image */}
                    <div className="relative h-64 xl:h-72 overflow-hidden">
                      <img
                        src={heroFeaturedProduct.images?.[0]}
                        alt={heroFeaturedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Glassmorphism overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                      {/* Featured badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-500/90 text-white backdrop-blur-md border-blue-400/30 px-3 py-1 text-xs font-bold shadow-lg shadow-blue-500/25">
                          <Award className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>
                    {/* Product info on glass */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/10 backdrop-blur-xl border-t border-white/10">
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">
                        {heroFeaturedProduct.brand || 'Premium'}
                      </p>
                      <h3 className="text-white font-bold text-lg leading-snug line-clamp-1 mb-2">
                        {heroFeaturedProduct.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-xl">
                          {formatINR(heroFeaturedProduct.price)}
                        </span>
                        {heroFeaturedProduct.originalPrice && (
                          <span className="text-white/50 text-sm line-through">
                            {formatINR(heroFeaturedProduct.originalPrice)}
                          </span>
                        )}
                        {heroFeaturedProduct.originalPrice && (
                          <Badge className="bg-emerald-500/90 text-white text-[10px] px-1.5 py-0.5 border-0 ml-auto">
                            {calculateDiscount(heroFeaturedProduct.price, heroFeaturedProduct.originalPrice)}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          DEAL TICKER / MARQUEE
      ═══════════════════════════════════════════════════════════ */}
      {showHero && (
        <section className="relative bg-slate-900 border-y border-blue-500/20 overflow-hidden">
          <div className="py-2.5 sm:py-3 flex">
            <div className="marquee-scroll flex items-center whitespace-nowrap">
              {[0, 1].map((copy) => (
                <span key={copy} className="flex items-center text-sm sm:text-base font-medium text-blue-300 mr-8">
                  {marqueeText}
                  <span className="ml-8 text-blue-500/30">●</span>
                </span>
              ))}
            </div>
          </div>
          {/* Left/right fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10" />
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TRUST BADGES BAR — Enhanced with pulse glow
      ═══════════════════════════════════════════════════════════ */}
      {showHero && (
        <section className="bg-gradient-to-b from-slate-50 to-background dark:from-slate-800/30 dark:to-background border-b border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="grid grid-cols-4 gap-3 sm:gap-8">
              {[
                { icon: Truck, text: 'Free Delivery', subtext: 'Orders ₹499+', color: 'bg-blue-500/10 text-blue-600' },
                { icon: Shield, text: 'Secure', subtext: 'Payments', color: 'bg-emerald-500/10 text-emerald-600' },
                { icon: Percent, text: 'Best', subtext: 'Prices', color: 'bg-amber-500/10 text-amber-600' },
                { icon: RotateCcw, text: '7-Day', subtext: 'Returns', color: 'bg-violet-500/10 text-violet-600' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left"
                >
                  <div className={`pulse-glow flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                    <item.icon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold block leading-tight text-foreground">{item.text}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight block">{item.subtext}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SHOP BY CATEGORY — Premium cards with glassmorphism
      ═══════════════════════════════════════════════════════════ */}
      {/* Mobile Category Chips — horizontal scrollable */}
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

      {/* Desktop Category Grid — Premium cards */}
      {showHero && categories.length > 0 && (
        <section className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <SectionHeader icon={ShoppingBag} title="Shop by Category" color="blue" />

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                variants={staggerItem}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`group relative overflow-hidden flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl border border-border/30 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br ${categoryGradients[i % categoryGradients.length]}`}
              >
                {/* Glassmorphism overlay on hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/60 dark:group-hover:bg-white/5 backdrop-blur-sm transition-all duration-300 rounded-2xl" />

                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <span className="relative text-sm font-semibold text-center group-hover:text-blue-600 transition-colors">
                  {cat.icon && <span className="mr-1">{cat.icon}</span>}
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          FLASH SALE — Dramatic gradient with countdown
      ═══════════════════════════════════════════════════════════ */}
      {showHero && saleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-6 sm:p-8 lg:p-10">
            {/* Particle effect dots */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-blue-400/20 blur-[80px] float-orb" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-300/15 blur-[70px] float-orb-delay" />
              <div className="absolute top-1/3 left-1/4 h-2 w-2 rounded-full bg-white/40 animate-pulse" />
              <div className="absolute top-1/2 right-1/3 h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse delay-500" />
              <div className="absolute bottom-1/4 left-1/2 h-2 w-2 rounded-full bg-white/20 animate-pulse delay-1000" />
            </div>

            <div className="relative">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4 text-white">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Zap className="h-7 w-7 sm:h-8 sm:w-8" />
                  </motion.div>
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold">Flash Sale</h2>
                    <p className="text-blue-200 text-xs sm:text-sm">Grab deals before they&apos;re gone!</p>
                  </div>
                  <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/10 hidden sm:inline-flex">
                    Limited Time
                  </Badge>
                </div>

                {/* Countdown timer */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 text-white">
                    <Clock className="h-4 w-4 text-blue-200" />
                    <span className="text-xs text-blue-200 font-medium">Ends in</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {[
                      { val: countdown.hours, label: 'H' },
                      { val: countdown.minutes, label: 'M' },
                      { val: countdown.seconds, label: 'S' },
                    ].map((unit, i) => (
                      <div key={i} className="flex items-center gap-1 sm:gap-1.5">
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border border-white/10 min-w-[40px] sm:min-w-[48px] text-center">
                          <span className="text-white font-bold text-base sm:text-xl font-mono">
                            {String(unit.val).padStart(2, '0')}
                          </span>
                          <span className="block text-[8px] sm:text-[10px] text-blue-200 uppercase tracking-wider">
                            {unit.label}
                          </span>
                        </div>
                        {i < 2 && (
                          <span className="text-white/50 font-bold text-lg sm:text-xl animate-pulse">:</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product grid - horizontal scroll on mobile, grid on desktop */}
              <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0 pb-2 lg:pb-0">
                {saleProducts.slice(0, 4).map((product, i) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    onClick={() => navigateToProduct(product.id)}
                    className="flex-shrink-0 w-56 lg:w-auto flex items-center lg:flex-col lg:items-stretch gap-3 sm:gap-0 bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 hover:bg-white/20 transition-colors text-left text-white border border-white/10 group"
                  >
                    <div className="w-14 h-14 sm:w-full sm:h-32 sm:mb-3 rounded-xl overflow-hidden shrink-0 bg-white/20">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs sm:text-sm line-clamp-1 mb-1">{product.name}</p>
                      <div className="flex items-baseline gap-1.5 sm:gap-2">
                        <span className="font-bold text-sm sm:text-base">{formatINR(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] sm:text-xs line-through opacity-50">
                            {formatINR(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <Badge className="mt-1.5 bg-emerald-500/80 text-white text-[9px] sm:text-xs border-0 px-1.5 sm:px-2">
                          {calculateDiscount(product.price, product.originalPrice)}% OFF
                        </Badge>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* View all link */}
              <div className="mt-5 text-center">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/15 rounded-xl gap-2"
                  onClick={() => {
                    setSelectedCategory(null);
                    useShopStore.getState().setSearchQuery('');
                  }}
                >
                  View All Deals <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TRENDING NOW
      ═══════════════════════════════════════════════════════════ */}
      {showHero && featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <SectionHeader
            icon={TrendingUp}
            title="Trending Now"
            color="blue"
            onviewall={() => {
              setSelectedCategory(null);
              useShopStore.getState().setSearchQuery('');
            }}
          />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-30px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <SectionHeader
            icon={Sparkles}
            title="New Arrivals"
            color="violet"
            onviewall={() => {
              setSelectedCategory(null);
              useShopStore.getState().setSearchQuery('');
            }}
          />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-30px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <SectionHeader
            icon={Star}
            title="Top Rated"
            color="amber"
            onviewall={() => {
              setSelectedCategory(null);
              useShopStore.getState().setSearchQuery('');
            }}
          />
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-30px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
          >
            {topRated.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          ALL PRODUCTS / FILTERED SECTION — Sticky sort bar
      ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Sticky Sort Bar */}
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-background/80 backdrop-blur-xl border-b border-border/30 -mt-3 sm:-mt-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h2 className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : currentCategory
                    ? currentCategory.name
                    : 'All Products'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <Button
                variant="outline"
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 rounded-xl px-4 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
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
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 sm:py-24"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 mb-6">
              <Search className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm sm:text-base">
              Try adjusting your search or browse a different category
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                useShopStore.getState().setSearchQuery('');
              }}
              className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
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
