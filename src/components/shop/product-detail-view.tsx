'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Minus, Plus, Check, Share2, MessageSquare, ArrowLeft, ChevronRight, Zap, Award, ShieldCheck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
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
  const [wishlistAnimating, setWishlistAnimating] = useState(false);

  const product = foundProduct || fetchedProduct;

  useEffect(() => {
    if (selectedProductId && !foundProduct) {
      fetch(`/api/products/${selectedProductId}`).then((r) => r.json()).then((d) => { if (d.id) setFetchedProduct(d); }).catch(console.error);
    }
  }, [selectedProductId, foundProduct]);

  useEffect(() => {
    if (selectedProductId) fetch(`/api/reviews?productId=${selectedProductId}`).then((r) => r.json()).then(setReviews).catch(console.error);
  }, [selectedProductId]);

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground text-lg mb-4">Product not found</p>
        <Button onClick={() => setCurrentView('home')} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">Go Home</Button>
      </motion.div>
    </div>
  );

  const discount = calculateDiscount(product.price, product.originalPrice);
  const category = categories.find((c) => c.id === product.categoryId);
  const inWishlist = isInWishlist(product.id);
  const mainImage = product.images?.[selectedImage] || product.images?.[0] || '';
  const emiAmount = Math.ceil(product.price / 12);

  const handleAddToCart = () => {
    const cartItem: CartItemType = { id: `temp-${product.id}-${Date.now()}`, productId: product.id, productName: product.name, productImage: mainImage, price: product.price, originalPrice: product.originalPrice, quantity, stock: product.stock };
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`, { action: { label: 'View Cart', onClick: () => setCurrentView('cart') } });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const handleToggleWishlist = () => {
    setWishlistAnimating(true);
    toggleWishlist(product.id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    setTimeout(() => setWishlistAnimating(false), 400);
  };

  const relatedProducts = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 pb-28 sm:pb-6">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-xs sm:text-sm mb-5 sm:mb-7" aria-label="Breadcrumb">
        <button onClick={() => setCurrentView('home')} className="text-muted-foreground hover:text-blue-600 transition-colors font-medium">Home</button>
        <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
        {category && (
          <>
            <button onClick={() => { useShopStore.getState().setSelectedCategory(category.slug); setCurrentView('home'); }} className="text-muted-foreground hover:text-blue-600 transition-colors font-medium">{category.name}</button>
            <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
          </>
        )}
        <span className="text-blue-600 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        {/* ── Image Gallery ── */}
        <div className="space-y-3 sm:space-y-4">
          <motion.div
            className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 cursor-crosshair relative shadow-sm"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src={mainImage} alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out hidden sm:block ${isZooming ? 'scale-175' : ''}`}
              style={isZooming ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}} />
            <img src={mainImage} alt={product.name}
              className="w-full h-full object-cover sm:hidden" />
            {/* Discount badge overlay */}
            {discount > 0 && (
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs sm:text-sm px-2.5 py-1 shadow-lg shadow-emerald-500/30">
                  {discount}% OFF
                </Badge>
              </div>
            )}
          </motion.div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 transition-all duration-300 ${
                    selectedImage === idx
                      ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg shadow-blue-500/20 scale-[1.05]'
                      : 'border border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {selectedImage === idx && (
                    <div className="absolute inset-0 bg-blue-500/10 ring-1 ring-inset ring-blue-500/30" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="space-y-4 sm:space-y-5">
          {/* Brand & Name */}
          <div>
            {product.brand && (
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] mb-1 sm:mb-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {product.brand}
              </p>
            )}
            {category && <Badge variant="secondary" className="mb-2 text-[10px] sm:text-xs bg-slate-100 text-slate-600 border-0">{category.name}</Badge>}
            <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-extrabold font-heading leading-tight tracking-tight">{product.name}</h1>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20">
              {product.rating} <Star className="h-3 w-3 fill-white" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              {product.reviewCount.toLocaleString('en-IN')} ratings & {reviews.length} reviews
            </span>
          </div>

          {/* ── Price Card ── */}
          <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-2.5 border border-blue-100/60 shadow-sm">
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{formatINR(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base sm:text-lg text-muted-foreground line-through decoration-red-400/60">{formatINR(product.originalPrice)}</span>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs px-2 py-0.5 shadow-sm">
                    {discount}% OFF
                  </Badge>
                </>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> You save {formatINR(product.originalPrice - product.price)}
              </p>
            )}
            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
            <div className="pt-1">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                EMI from <span className="font-bold text-blue-600">{formatINR(emiAmount)}/month</span>
              </p>
            </div>
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 10 ? (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1">
                <Check className="h-3.5 w-3.5 mr-1.5" /> In Stock
              </Badge>
            ) : product.stock > 0 ? (
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1 animate-pulse">
                <Zap className="h-3.5 w-3.5 mr-1.5" /> Only {product.stock} left!
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs font-semibold px-3 py-1">Out of Stock</Badge>
            )}
          </div>

          {/* Quantity - Hidden on mobile, shown in sticky bar instead */}
          {product.stock > 0 && (
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-sm font-semibold text-muted-foreground">Qty:</span>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full overflow-hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-200/60" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-bold text-sm tabular-nums">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-200/60" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Desktop Action Buttons ── */}
          <div className="hidden sm:flex gap-3">
            <Button size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold h-13 text-base shadow-xl shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="h-5 w-5 mr-2" />Add to Cart
            </Button>
            <Button size="lg" className="flex-1 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 text-white font-bold h-13 text-base shadow-xl shadow-blue-800/20 transition-all hover:shadow-blue-800/35 hover:scale-[1.02] active:scale-[0.98]" onClick={() => { handleAddToCart(); setCurrentView('cart'); }} disabled={product.stock === 0}>
              <Zap className="h-5 w-5 mr-2" />Buy Now
            </Button>
            <motion.div whileTap={{ scale: 0.85 }} animate={wishlistAnimating ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
              <Button size="lg" variant="outline" className="h-13 w-13 shrink-0 border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors" onClick={handleToggleWishlist}>
                <Heart className={`h-5 w-5 transition-all ${inWishlist ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
              </Button>
            </motion.div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant="outline" className="h-13 w-13 shrink-0 border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors" onClick={() => toast.success('Link copied!')}>
                  <Share2 className="h-5 w-5 text-slate-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share this product</TooltipContent>
            </Tooltip>
          </div>

          <Separator className="bg-slate-100" />

          {/* ── Trust Badges ── */}
          <div className="space-y-2.5 sm:space-y-3">
            {[
              { icon: Truck, t: 'Free Delivery', d: ' on orders above ₹499', bg: 'bg-blue-50', iconColor: 'text-blue-600', border: 'border-blue-100' },
              { icon: Shield, t: 'Secure Payment', d: ' · UPI, Cards, COD', bg: 'bg-emerald-50', iconColor: 'text-emerald-600', border: 'border-emerald-100' },
              { icon: RotateCcw, t: '7-Day Returns', d: ' · Easy returns', bg: 'bg-amber-50', iconColor: 'text-amber-600', border: 'border-amber-100' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 text-xs sm:text-sm p-2.5 sm:p-3 rounded-xl ${item.bg} border ${item.border}`}>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${item.bg} border ${item.border} flex items-center justify-center shrink-0`}>
                  <item.icon className={`h-4 sm:h-5 w-4 sm:w-5 ${item.iconColor}`} />
                </div>
                <div>
                  <span className="font-semibold">{item.t}</span>
                  <span className="text-muted-foreground">{item.d}</span>
                </div>
              </div>
            ))}
          </div>

          <Separator className="bg-slate-100" />

          {/* ── Description ── */}
          <div className="bg-slate-50/60 rounded-2xl p-4 sm:p-5 border border-slate-100">
            <h3 className="font-bold text-base sm:text-lg font-heading mb-2 sm:mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" /> Description
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {/* ── Reviews ── */}
          <Separator className="bg-slate-100" />
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-bold text-base sm:text-lg font-heading flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" /> Reviews ({reviews.length})
              </h3>
            </div>
            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/60 rounded-2xl border border-slate-100">
                <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/20 mb-2" />
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-1">
                {reviews.map((review) => (
                  <div key={review.id} className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20">
                          {review.userName?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold">{review.userName}</p>
                          {review.verified && (
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-1.5 py-0 h-4 mt-0.5">
                              <ShieldCheck className="h-2.5 w-2.5 mr-0.5" /> Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {review.title && <p className="font-semibold text-xs sm:text-sm mb-1">{review.title}</p>}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 sm:mt-14">
          <div className="flex items-center gap-3 mb-5 sm:mb-7">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <h2 className="text-lg sm:text-xl font-bold font-heading flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
              Related Products
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">{relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MOBILE STICKY BOTTOM CTA
      ═══════════════════════════════════════════════════════════ */}
      {product.stock > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] safe-area-bottom">
          <div className="px-4 py-3 flex items-center gap-3">
            {/* Quantity - pill shape */}
            <div className="flex items-center bg-slate-100 rounded-full border border-slate-200/60">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center text-slate-500 disabled:opacity-40 hover:text-blue-600 transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center text-sm font-bold tabular-nums">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-9 h-9 flex items-center justify-center text-slate-500 disabled:opacity-40 hover:text-blue-600 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Price */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{formatINR(product.price * quantity)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[10px] text-muted-foreground line-through">{formatINR(product.originalPrice * quantity)}</span>
                )}
              </div>
              {discount > 0 && <p className="text-[10px] text-emerald-600 font-bold">{discount}% OFF</p>}
            </div>

            {/* Add to Cart */}
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold h-11 px-4 shadow-lg shadow-blue-500/25 shrink-0 rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="ml-1.5">Add</span>
            </Button>

            {/* Buy Now */}
            <Button
              className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 text-white font-bold h-11 px-4 shadow-lg shadow-blue-800/20 shrink-0 rounded-xl"
              onClick={() => { handleAddToCart(); setCurrentView('cart'); }}
            >
              <Zap className="h-4 w-4" />
              <span className="ml-1">Buy</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
