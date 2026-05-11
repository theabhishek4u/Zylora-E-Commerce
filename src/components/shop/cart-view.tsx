'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShoppingBag, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function CartView() {
  const { cartItems, updateCartItemQuantity, removeFromCart, getCartTotal, couponDiscount, appliedCoupon, setCouponDiscount, setAppliedCoupon, setCurrentView } = useShopStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const total = getCartTotal();
  const totalSavings = cartItems.reduce((s, i) => i.originalPrice && i.originalPrice > i.price ? s + (i.originalPrice - i.price) * i.quantity : s, 0);
  const deliveryCharge = total >= 499 ? 0 : 49;
  const grandTotal = total - couponDiscount + deliveryCharge;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: couponInput.toUpperCase(), orderTotal: total }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      setCouponDiscount(data.discount);
      setAppliedCoupon(couponInput.toUpperCase());
      toast.success(`Coupon applied! You save ${formatINR(data.discount)}`);
    } catch { toast.error('Failed to apply coupon'); }
    finally { setCouponLoading(false); }
  };

  const handleRemoveCoupon = () => { setCouponDiscount(0); setAppliedCoupon(null); setCouponInput(''); toast.info('Coupon removed'); };

  if (cartItems.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20 text-center">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mx-auto mb-6 sm:mb-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-blue-100 via-blue-50 to-sky-100 flex items-center justify-center shadow-lg shadow-blue-100/50"
      >
        <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500" strokeWidth={1.5} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Your cart is empty</h2>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-xs mx-auto">Looks like you haven&apos;t added anything yet. Start shopping to find amazing deals!</p>
      <Button
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-12 px-8 shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-[1.02]"
        onClick={() => setCurrentView('home')}
      >
        <Sparkles className="mr-2 h-5 w-5" />
        Continue Shopping
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 pb-32 sm:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')} className="shrink-0 hover:bg-slate-100 rounded-xl"><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => {
              const disc = calculateDiscount(item.price, item.originalPrice);
              return (
                <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}>
                  <div className="group relative rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    {/* Subtle gradient shimmer on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/40 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="relative p-3 sm:p-5">
                      <div className="flex gap-3 sm:gap-5">
                        {/* Product Image */}
                        <div
                          className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 shrink-0 cursor-pointer ring-1 ring-black/5 group/img"
                          onClick={() => useShopStore.getState().navigateToProduct(item.productId)}
                        >
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-sm sm:text-base line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => useShopStore.getState().navigateToProduct(item.productId)}
                          >
                            {item.productName}
                          </h3>

                          {/* Price Section */}
                          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                            <span className="font-bold text-base sm:text-lg">{formatINR(item.price)}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <>
                                <span className="text-xs sm:text-sm text-muted-foreground line-through">{formatINR(item.originalPrice)}</span>
                                <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{disc}% OFF</span>
                              </>
                            )}
                          </div>

                          {/* Quantity & Remove */}
                          <div className="flex items-center justify-between mt-3 sm:mt-4">
                            {/* Quantity Controls - Pill Shape */}
                            <div className="flex items-center rounded-full bg-slate-50/80 ring-1 ring-slate-200/60 p-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 p-0"
                                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 sm:w-10 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 p-0"
                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm rounded-full transition-all duration-200"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1 transition-colors" />
                              <span className="hidden sm:inline">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Desktop Order Summary */}
        <div className="hidden lg:block">
          <div className="sticky top-36">
            <div className="relative rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg overflow-hidden">
              {/* Gradient Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500" />

              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-bold font-heading mb-4">Order Summary</h3>

                {/* Coupon Section */}
                <div className="mb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-700">{appliedCoupon}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="text-xs h-auto p-1 text-emerald-500 hover:text-red-500 rounded-full hover:bg-red-50">✕</Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="text-sm h-10 rounded-xl border-slate-200/80 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      />
                      <Button
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl h-10 px-4 shadow-sm hover:shadow-md transition-all"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{formatINR(total + totalSavings)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600 font-medium">Discount</span>
                      <span className="text-emerald-600 font-semibold">−{formatINR(totalSavings)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600 font-medium">Coupon ({appliedCoupon})</span>
                      <span className="text-emerald-600 font-semibold">−{formatINR(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-emerald-600 font-semibold' : ''}>{deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Total */}
                <div className="flex justify-between font-bold text-xl mb-2">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 bg-clip-text text-transparent">{formatINR(grandTotal)}</span>
                </div>

                {/* Savings Highlight */}
                {(totalSavings > 0 || couponDiscount > 0) && (
                  <div className="text-sm text-emerald-700 font-semibold text-center bg-gradient-to-r from-emerald-50 to-emerald-50/60 rounded-xl p-3 mb-4 ring-1 ring-emerald-200/50">
                    🎉 You save <span className="text-emerald-600 text-base">{formatINR(totalSavings + couponDiscount)}</span>!
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold h-12 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.01]"
                  onClick={() => setCurrentView('checkout')}
                >
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full mt-2 text-muted-foreground hover:text-foreground rounded-xl"
                  onClick={() => setCurrentView('home')}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom - Cart Summary */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/80 backdrop-blur-2xl border-t border-white/30 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] safe-area-bottom">
        <div className="px-4 py-3">
          {/* Savings Badge */}
          {(totalSavings > 0 || couponDiscount > 0) && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full">🎉 Save {formatINR(totalSavings + couponDiscount)}</span>
              {deliveryCharge === 0 && <span className="text-xs text-emerald-600 font-semibold">Free Delivery</span>}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{cartItems.reduce((s, i) => s + i.quantity, 0)} items</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 bg-clip-text text-transparent">{formatINR(grandTotal)}</span>
                {deliveryCharge > 0 && <span className="text-[10px] text-muted-foreground">+{formatINR(deliveryCharge)} del.</span>}
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold h-12 px-6 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              onClick={() => setCurrentView('checkout')}
            >
              Checkout <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
