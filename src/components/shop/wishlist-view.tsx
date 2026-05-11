'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { Heart, ShoppingCart, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductType, CartItemType } from '@/lib/types';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WishlistView() {
  const { user, setCurrentView, addToCart, toggleWishlist, isInWishlist } = useShopStore();
  const [wishlistProducts, setWishlistProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/wishlist?userId=${user.id}`).then((r) => r.json()).then((items) => {
        if (Array.isArray(items)) setWishlistProducts(items.map((i: { product: ProductType }) => i.product));
      }).catch(console.error);
    }
  }, [user]);

  const handleAddToCart = (product: ProductType) => {
    const item: CartItemType = { id: `temp-${product.id}-${Date.now()}`, productId: product.id, productName: product.name, productImage: product.images?.[0] || '', price: product.price, originalPrice: product.originalPrice, quantity: 1, stock: product.stock };
    addToCart(item);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemove = (productId: string) => {
    toggleWishlist(productId);
    setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));
    if (user?.id) fetch('/api/wishlist', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, productId }) });
    toast.success('Removed from wishlist');
  };

  if (wishlistProducts.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6 sm:mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="h-24 w-24 sm:h-32 sm:w-32 text-transparent" strokeWidth={0} fill="url(#heartGradient)" />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2 sm:mb-3">Your wishlist is empty</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-xs mx-auto">Save items you love for later! Browse our collection and tap the heart icon.</p>
        <Button
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white font-bold px-8 h-12 shadow-xl shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.03] active:scale-[0.98]"
          onClick={() => setCurrentView('home')}
        >
          <Sparkles className="h-4 w-4 mr-2" /> Browse Products
        </Button>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-5 sm:mb-7">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')} className="shrink-0 hover:bg-slate-100">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Heart className="h-4 w-4 text-white fill-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">My Wishlist</h1>
        </div>
        <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold ml-auto sm:ml-2 px-2.5 shadow-sm">
          {wishlistProducts.length}
        </Badge>
      </div>

      {/* ── Wishlist Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        <AnimatePresence mode="popLayout">
          {wishlistProducts.map((product, i) => {
            const discount = calculateDiscount(product.price, product.originalPrice);
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
              >
                <Card className="overflow-hidden border-slate-200/60 bg-white/90 backdrop-blur-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:border-slate-300/60">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 cursor-pointer" onClick={() => useShopStore.getState().navigateToProduct(product.id)}>
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Remove button - Glassmorphism */}
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => { e.stopPropagation(); handleRemove(product.id); }}
                      className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/50 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </motion.button>

                    {/* Discount badge */}
                    {discount > 0 && (
                      <div className="absolute top-2.5 left-2.5">
                        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-[10px] px-1.5 py-0.5 shadow-md shadow-emerald-500/20">
                          {discount}% OFF
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-1 sm:mb-1.5 leading-snug min-h-[2rem] sm:min-h-[2.5rem]">{product.name}</h3>
                    <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-3.5">
                      <span className="font-extrabold text-sm sm:text-base">{formatINR(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-9 sm:h-10 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/15 transition-all hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] rounded-xl"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 sm:mr-1.5" />
                      <span className="sm:inline">Add to Cart</span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
