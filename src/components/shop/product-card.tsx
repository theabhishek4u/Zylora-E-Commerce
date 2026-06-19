'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { Star, ShoppingCart, Heart, Truck } from 'lucide-react';
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
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/60 bg-white dark:bg-slate-900 dark:border-slate-700/60 transition-all duration-300 hover:border-blue-200/80 dark:hover:border-blue-500/40 hover:scale-[1.02]"
        onClick={() => navigateToProduct(product.id)}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-800">
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Badges - Top Left - Static, no animation */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <Badge className="bg-emerald-500 dark:bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md border-0">
                {discount}% OFF
              </Badge>
            )}
            {product.newArrival && (
              <Badge className="bg-blue-500 dark:bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md border-0">
                NEW
              </Badge>
            )}
            {product.onSale && (
              <Badge className="bg-red-500 dark:bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md border-0">
                SALE
              </Badge>
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
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center border border-slate-200/50 dark:border-slate-600/50 transition-all duration-200 hover:bg-white hover:scale-110"
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
                    className={`h-3.5 w-3.5 transition-colors ${
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
            <div className="absolute bottom-2.5 left-2.5 z-10">
              <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md text-white bg-amber-500 dark:bg-amber-900/50 dark:text-amber-400">
                Only {product.stock} left
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[3px] flex items-center justify-center z-20">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider bg-white/90 dark:bg-slate-800/90 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Add to Cart */}
          <div className="absolute bottom-2.5 right-2.5 z-20">
            <div className="opacity-0 translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out sm:opacity-100 sm:translate-y-0">
              <motion.button
                whileTap={{ scale: 0.85 }}
                animate={cartBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
                transition={{ duration: 0.4 }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          {/* Brand Name */}
          {product.brand && (
            <p className="text-[9px] sm:text-[10px] text-blue-500 dark:text-blue-400 font-bold uppercase tracking-[0.1em] sm:tracking-wider">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-0.5 bg-blue-600 dark:bg-blue-500 text-white px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold">
              {product.rating}
              <Star className="h-2.5 w-2.5 fill-white ml-0.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              ({product.reviewCount.toLocaleString('en-IN')})
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 line-through font-medium">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded-md">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {/* Free Delivery Badge */}
          {isFreeDelivery && !isOutOfStock && (
            <div className="flex items-center gap-1 pt-0.5">
              <Truck className="h-3 w-3 text-emerald-500" />
              <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Free Delivery</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
