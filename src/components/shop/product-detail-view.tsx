'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Minus, Plus, Check, Share2, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductType, CartItemType, ReviewType } from '@/lib/types';
import { toast } from 'sonner';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './product-card';

export function ProductDetailView() {
  const { selectedProductId, products, categories, setCurrentView, addToCart, toggleWishlist, isInWishlist } = useShopStore();
  return <ProductDetailInner key={selectedProductId} selectedProductId={selectedProductId} products={products} categories={categories} setCurrentView={setCurrentView} addToCart={addToCart} toggleWishlist={toggleWishlist} isInWishlist={isInWishlist} />;
}

function ProductDetailInner({ selectedProductId, products, categories, setCurrentView, addToCart, toggleWishlist, isInWishlist }: {
  selectedProductId: string | null; products: ProductType[]; categories: { id: string; name: string; slug: string }[];
  setCurrentView: (v: string) => void; addToCart: (item: CartItemType) => void; toggleWishlist: (id: string) => void; isInWishlist: (id: string) => boolean;
}) {
  const foundProduct = useMemo(() => products.find((p) => p.id === selectedProductId) || null, [products, selectedProductId]);
  const [fetchedProduct, setFetchedProduct] = useState<ProductType | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const product = foundProduct || fetchedProduct;

  useEffect(() => {
    if (selectedProductId && !foundProduct) {
      fetch(`/api/products/${selectedProductId}`).then((r) => r.json()).then((d) => { if (d.id) setFetchedProduct(d); }).catch(console.error);
    }
  }, [selectedProductId, foundProduct]);

  useEffect(() => {
    if (selectedProductId) fetch(`/api/reviews?productId=${selectedProductId}`).then((r) => r.json()).then(setReviews).catch(console.error);
  }, [selectedProductId]);

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Product not found</p><Button onClick={() => setCurrentView('home')} className="mt-4">Go Home</Button></div>;

  const discount = calculateDiscount(product.price, product.originalPrice);
  const category = categories.find((c) => c.id === product.categoryId);
  const inWishlist = isInWishlist(product.id);
  const mainImage = product.images?.[selectedImage] || product.images?.[0] || '';

  const handleAddToCart = () => {
    const cartItem: CartItemType = { id: `temp-${product.id}-${Date.now()}`, productId: product.id, productName: product.name, productImage: mainImage, price: product.price, originalPrice: product.originalPrice, quantity, stock: product.stock };
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`, { action: { label: 'View Cart', onClick: () => setCurrentView('cart') } });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const relatedProducts = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 pb-28 sm:pb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
        <button onClick={() => setCurrentView('home')} className="hover:text-foreground transition-colors">Home</button>
        <span>/</span>
        {category && <><button onClick={() => { useShopStore.getState().setSelectedCategory(category.slug); setCurrentView('home'); }} className="hover:text-foreground">{category.name}</button><span>/</span></>}
        <span className="text-foreground truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Images */}
        <div className="space-y-3 sm:space-y-4">
          <motion.div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border cursor-crosshair relative"
            onMouseMove={handleMouseMove} onMouseEnter={() => setIsZooming(true)} onMouseLeave={() => setIsZooming(false)}>
            <img src={mainImage} alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 hidden sm:block ${isZooming ? 'scale-150' : ''}`}
              style={isZooming ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}} />
            {/* Mobile: no zoom, just full image */}
            <img src={mainImage} alt={product.name}
              className="w-full h-full object-cover sm:hidden" />
          </motion.div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === idx ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-border hover:border-blue-400'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4 sm:space-y-5">
          <div>
            {product.brand && <p className="text-xs sm:text-sm text-blue-700 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">{product.brand}</p>}
            {category && <Badge variant="secondary" className="mb-1.5 sm:mb-2 text-xs">{category.name}</Badge>}
            <h1 className="text-xl sm:text-3xl font-bold font-heading leading-tight">{product.name}</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 sm:px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-bold">{product.rating} <Star className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-white" /></div>
            <span className="text-xs sm:text-sm text-muted-foreground">{product.reviewCount.toLocaleString('en-IN')} ratings & {reviews.length} reviews</span>
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2 border border-blue-100/50">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold">{formatINR(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (<><span className="text-sm sm:text-lg text-muted-foreground line-through">{formatINR(product.originalPrice)}</span><Badge className="bg-emerald-500 text-white font-semibold text-xs">{discount}% OFF</Badge></>)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && <p className="text-xs sm:text-sm text-emerald-600 font-medium">You save {formatINR(product.originalPrice - product.price)}</p>}
            <p className="text-[10px] sm:text-xs text-muted-foreground">Inclusive of all taxes</p>
          </div>

          <div>
            {product.stock > 10 ? <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border text-xs"><Check className="h-3 w-3 mr-1" />In Stock</Badge>
              : product.stock > 0 ? <Badge className="bg-blue-50 text-blue-700 border-blue-200 border text-xs">Only {product.stock} left!</Badge>
              : <Badge variant="destructive" className="text-xs">Out of Stock</Badge>}
          </div>

          {/* Quantity - Hidden on mobile, shown in sticky bar instead */}
          {product.stock > 0 && (
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-sm font-medium">Qty:</span>
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex gap-3">
            <Button size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-12 shadow-lg shadow-blue-500/20" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="h-5 w-5 mr-2" />Add to Cart
            </Button>
            <Button size="lg" className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold h-12" onClick={() => { handleAddToCart(); setCurrentView('cart'); }} disabled={product.stock === 0}>
              Buy Now
            </Button>
            <Button size="lg" variant="outline" className="h-12 shrink-0" onClick={() => { toggleWishlist(product.id); toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️'); }}>
              <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button size="lg" variant="outline" className="h-12 shrink-0" onClick={() => toast.success('Link copied!')}><Share2 className="h-5 w-5" /></Button>
          </div>

          <Separator />
          <div className="space-y-2 sm:space-y-3">
            {[{ icon: Truck, t: 'Free Delivery', d: ' on orders above ₹499' }, { icon: Shield, t: 'Secure Payment', d: ' · UPI, Cards, COD' }, { icon: RotateCcw, t: '7-Day Returns', d: ' · Easy returns' }].map((item, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"><item.icon className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600 shrink-0" /><div><span className="font-medium">{item.t}</span><span className="text-muted-foreground">{item.d}</span></div></div>
            ))}
          </div>

          <Separator />
          <div>
            <h3 className="font-semibold text-base sm:text-lg font-heading mb-2 sm:mb-3">Description</h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {/* Reviews */}
          <Separator />
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-base sm:text-lg font-heading flex items-center gap-2"><MessageSquare className="h-4 sm:h-5 w-4 sm:w-5" />Reviews ({reviews.length})</h3>
            </div>
            {reviews.length === 0 ? <p className="text-sm text-muted-foreground">No reviews yet.</p> : (
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {reviews.map((review) => (
                  <div key={review.id} className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">{review.userName?.charAt(0)}</div>
                        <div><p className="text-xs sm:text-sm font-medium">{review.userName}</p>{review.verified && <p className="text-[10px] sm:text-xs text-emerald-600">✓ Verified Purchase</p>}</div>
                      </div>
                      <div className="flex items-center gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`h-3 sm:h-3.5 w-3 sm:w-3.5 ${i < review.rating ? 'fill-blue-500 text-blue-500' : 'text-gray-200'}`} />)}</div>
                    </div>
                    {review.title && <p className="font-semibold text-xs sm:text-sm mb-1">{review.title}</p>}
                    <p className="text-xs sm:text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="mt-8 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-bold font-heading mb-4 sm:mb-6">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">{relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MOBILE STICKY BOTTOM CTA
      ═══════════════════════════════════════════════════════════ */}
      {product.stock > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-border/40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom">
          <div className="px-4 py-3 flex items-center gap-3">
            {/* Quantity on mobile */}
            <div className="flex items-center border rounded-lg bg-slate-50 dark:bg-slate-800">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center text-slate-600 disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-9 h-9 flex items-center justify-center text-slate-600 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Price */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold">{formatINR(product.price * quantity)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-muted-foreground line-through">{formatINR(product.originalPrice * quantity)}</span>
                )}
              </div>
              {discount > 0 && <p className="text-[10px] text-emerald-600 font-medium">{discount}% OFF</p>}
            </div>

            {/* Add to Cart */}
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-11 px-4 shadow-lg shadow-blue-500/20 shrink-0"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 sm:mr-2" />
              <span className="hidden xs:inline ml-1">Add</span>
            </Button>

            {/* Buy Now */}
            <Button
              className="bg-blue-800 hover:bg-blue-900 text-white font-semibold h-11 px-4 shrink-0"
              onClick={() => { handleAddToCart(); setCurrentView('cart'); }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
