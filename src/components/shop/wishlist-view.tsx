'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <Heart className="h-24 w-24 mx-auto text-muted-foreground/20 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
      <p className="text-muted-foreground mb-6">Save items you love for later!</p>
      <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={() => setCurrentView('home')}>Browse Products</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6"><Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}><ArrowLeft className="h-5 w-5" /></Button><h1 className="text-2xl font-bold">My Wishlist</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {wishlistProducts.map((product, i) => (
            <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden border-border/30 bg-white/80 backdrop-blur-sm group">
                <div className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer" onClick={() => useShopStore.getState().navigateToProduct(product.id)}>
                  <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3"><span className="font-bold">{formatINR(product.price)}</span>{product.originalPrice && <span className="text-xs text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>}</div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => handleAddToCart(product)}><ShoppingCart className="h-3 w-3 mr-1" />Add to Cart</Button>
                    <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50" onClick={() => handleRemove(product.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
