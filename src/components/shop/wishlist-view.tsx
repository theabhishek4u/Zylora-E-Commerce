'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
      <Heart className="h-20 w-20 sm:h-24 sm:w-24 mx-auto text-muted-foreground/20 mb-4 sm:mb-6" />
      <h2 className="text-xl sm:text-2xl font-bold font-heading mb-2">Your wishlist is empty</h2>
      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Save items you love for later!</p>
      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white" onClick={() => setCurrentView('home')}>Browse Products</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')} className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-xl sm:text-2xl font-bold font-heading">My Wishlist</h1>
        <Badge className="bg-blue-500 text-white text-xs ml-auto sm:ml-2">{wishlistProducts.length}</Badge>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <AnimatePresence>
          {wishlistProducts.map((product, i) => (
            <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden border-border/30 bg-white/80 backdrop-blur-sm group">
                <div className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onClick={() => useShopStore.getState().navigateToProduct(product.id)}>
                  <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {/* Mobile: Show remove button on image */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(product.id); }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-1.5 sm:mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="font-bold text-sm sm:text-base">{formatINR(product.price)}</span>
                    {product.originalPrice && <span className="text-[10px] sm:text-xs text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>}
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-9 text-xs sm:text-sm" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="h-3 w-3 sm:mr-1.5" />
                    <span className="sm:inline">Add to Cart</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
