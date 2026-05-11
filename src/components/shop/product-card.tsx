'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductType, CartItemType } from '@/lib/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: ProductType;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { navigateToProduct, addToCart, getCartCount, toggleWishlist, isInWishlist } = useShopStore();
  const discount = calculateDiscount(product.price, product.originalPrice);
  const mainImage = product.images?.[0] || '';
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="group cursor-pointer overflow-hidden border-border/30 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-amber-200/50 dark:bg-slate-900/80"
        onClick={() => navigateToProduct(product.id)}
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850">
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-lg">
                {discount}% OFF
              </Badge>
            )}
            {product.newArrival && (
              <Badge className="bg-violet-500 hover:bg-violet-600 text-white font-semibold text-xs shadow-lg">
                NEW
              </Badge>
            )}
            {product.onSale && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs shadow-lg">
                SALE
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all hover:bg-white hover:scale-110"
          >
            <Heart className={`h-4 w-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </motion.button>

          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="destructive" className="absolute bottom-2 left-2 text-xs shadow-lg">
              Only {product.stock} left!
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <Badge variant="destructive" className="text-base px-4 py-1.5">Out of Stock</Badge>
            </div>
          )}

          {/* Quick Add */}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        <CardContent className="p-3 sm:p-4">
          {product.brand && (
            <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
          )}
          <h3 className="font-semibold text-sm line-clamp-2 mb-1.5 min-h-[2.5rem] group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5 bg-emerald-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
              {product.rating} <Star className="h-2.5 w-2.5 fill-white" />
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString('en-IN')})</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatINR(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
