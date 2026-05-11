'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { Star, ShoppingCart, Heart, Flame, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductType, CartItemType } from '@/lib/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

interface ProductCardProps {
  product: ProductType;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { navigateToProduct, addToCart, toggleWishlist, isInWishlist } = useShopStore();
  const discount = calculateDiscount(product.price, product.originalPrice);
  const mainImage = product.images?.[0] || '';
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isFreeDelivery = product.price >= 499;
  const [cartBounce, setCartBounce] = useState(false);
  const [wishBounce, setWishBounce] = useState(false);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const cartItem: CartItemType = {
      id: `temp-${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productImage: mainImage,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      stock: product.stock,
    };
    addToCart(cartItem);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
    toast.success(`${product.name} added to cart!`);
  }, [isOutOfStock, product, mainImage, addToCart]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    setWishBounce(true);
    setTimeout(() => setWishBounce(false), 500);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  }, [product.id, inWishlist, toggleWishlist]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300/40"
        onClick={() => navigateToProduct(product.id)}
      >
        {/* Animated gradient border effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 -z-10 blur-sm" />
        <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-blue-400/30 via-purple-400/20 to-pink-400/30 -z-10" />

        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/80">
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Inner shadow / vignette effect */}
          <div className="absolute inset-0 shadow-[inset_0_-40px_60px_-20px_rgba(0,0,0,0.15)] pointer-events-none" />

          {/* Gradient overlay from bottom for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          {/* Hover blue tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Badges - Top Left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Badge
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-lg shadow-lg shadow-emerald-500/30 border-0 backdrop-blur-sm bg-clip-padding"
                  style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.9), rgba(16,185,129,0.95))' }}
                >
                  {discount}% OFF
                </Badge>
              </motion.div>
            )}
            {product.newArrival && (
              <motion.div
                animate={{ y: [0, -2, 0], scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Badge
                  className="text-white font-bold text-[10px] px-2.5 py-0.5 rounded-lg shadow-lg shadow-blue-500/30 border-0"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(37,99,235,0.95))' }}
                >
                  NEW
                </Badge>
              </motion.div>
            )}
            {product.onSale && (
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Badge
                  className="text-white font-bold text-[10px] px-2.5 py-0.5 rounded-lg shadow-lg shadow-red-500/40 border-0"
                  style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(220,38,38,0.95))', boxShadow: '0 0 12px rgba(239,68,68,0.3)' }}
                >
                  SALE
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Wishlist Button - Top Right */}
          <motion.button
            whileTap={{ scale: 0.75 }}
            onClick={handleWishlist}
            className="absolute top-2.5 right-2.5 z-10"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <motion.div
              animate={wishBounce ? { scale: [1, 1.4, 0.9, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/8 border border-white/50 transition-all duration-300 hover:bg-white/95 hover:shadow-xl hover:scale-110"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={inWishlist ? 'filled' : 'outline'}
                  initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 15 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      inWishlist
                        ? 'fill-red-500 text-red-500'
                        : 'text-slate-400'
                    }`}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.button>

          {/* Low Stock Badge - Bottom Left */}
          {isLowStock && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute bottom-2.5 left-2.5 z-10"
            >
              <div
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.95), rgba(234,88,12,0.95))', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}
              >
                <Flame className="h-3 w-3" />
                Only {product.stock} left!
              </div>
            </motion.div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[6px] flex items-center justify-center z-20">
              <div
                className="px-6 py-2 rounded-xl shadow-2xl border border-white/30"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(241,245,249,0.9))', backdropFilter: 'blur(10px)' }}
              >
                <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">Out of Stock</span>
              </div>
            </div>
          )}

          {/* Quick Add to Cart */}
          <div className="absolute bottom-2.5 right-2.5 z-20">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              className="opacity-0 translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-400 ease-out sm:opacity-100 sm:translate-y-0"
            >
              <motion.button
                whileTap={{ scale: 0.85 }}
                animate={cartBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
                transition={{ duration: 0.4 }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-white/20"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          {/* Brand Name */}
          {product.brand && (
            <p className="text-[9px] sm:text-[10px] text-blue-500 font-bold uppercase tracking-[0.1em] sm:tracking-wider">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="flex items-center gap-0.5 text-white px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold shadow-md"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}
            >
              {product.rating}
              <Star className="h-2.5 w-2.5 fill-white ml-0.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              ({product.reviewCount.toLocaleString('en-IN')})
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                  {formatINR(product.originalPrice)}
                </span>
                <span
                  className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md text-emerald-700"
                  style={{ background: 'linear-gradient(135deg, rgba(167,243,208,0.6), rgba(110,231,183,0.5))' }}
                >
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {/* Free Delivery Badge */}
          {isFreeDelivery && !isOutOfStock && (
            <div className="flex items-center gap-1 pt-0.5">
              <Truck className="h-3 w-3 text-emerald-500" />
              <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600">Free Delivery</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
