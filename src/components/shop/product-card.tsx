'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProductType, CartItemType } from '@/lib/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleAddToCart = (e: React.MouseEvent) => {
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
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/8 hover:-translate-y-0.5 hover:border-blue-200/50"
        onClick={() => navigateToProduct(product.id)}
      >
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/80">
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Blue gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges - Top Left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {discount > 0 && (
              <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-md shadow-emerald-500/20 border-0">
                {discount}% OFF
              </Badge>
            )}
            {product.newArrival && (
              <Badge className="bg-blue-500 hover:bg-blue-500 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-md shadow-blue-500/20 border-0">
                NEW
              </Badge>
            )}
            {product.onSale && (
              <Badge className="bg-red-500 hover:bg-red-500 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-md shadow-red-500/20 border-0">
                SALE
              </Badge>
            )}
          </div>

          {/* Wishlist Button - Top Right */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleWishlist}
            className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/5 transition-all duration-200 hover:bg-white hover:shadow-xl hover:scale-105"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={inWishlist ? 'filled' : 'outline'}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    inWishlist
                      ? 'fill-red-500 text-red-500'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                />
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Low Stock Badge - Bottom Left */}
          {isLowStock && (
            <Badge
              variant="destructive"
              className="absolute bottom-2.5 left-2.5 text-[10px] px-2 py-0.5 rounded-md shadow-md border-0"
            >
              Only {product.stock} left!
            </Badge>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] flex items-center justify-center z-10">
              <Badge
                variant="destructive"
                className="text-sm font-semibold px-5 py-1.5 rounded-lg shadow-lg border-0"
              >
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick Add to Cart - Bottom Right */}
          <div className="absolute bottom-2.5 right-2.5 z-20">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              className="opacity-0 translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 ease-out sm:opacity-100 sm:translate-y-0"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4">
          {/* Brand Name */}
          {product.brand && (
            <p className="text-[10px] sm:text-[11px] text-blue-600 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-medium text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-1.5 sm:mb-2 text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2.5">
            <div className="flex items-center gap-0.5 bg-blue-500 text-white px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold">
              {product.rating}
              <Star className="h-2 sm:h-2.5 w-2 sm:w-2.5 fill-white ml-0.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              ({product.reviewCount.toLocaleString('en-IN')})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-bold text-slate-900">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
