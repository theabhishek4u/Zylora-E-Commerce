'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR, calculateDiscount } from '@/lib/format';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/20 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6">Start shopping to find amazing deals!</p>
      <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={() => setCurrentView('home')}><ShoppingCart className="mr-2 h-5 w-5" />Start Shopping</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-2xl font-bold">Shopping Cart</h1><p className="text-sm text-muted-foreground">{cartItems.length} items</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cartItems.map((item) => {
              const disc = calculateDiscount(item.price, item.originalPrice);
              return (
                <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card className="overflow-hidden border-border/30 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-50 shrink-0 cursor-pointer" onClick={() => useShopStore.getState().navigateToProduct(item.productId)}>
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{item.productName}</h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-bold">{formatINR(item.price)}</span>
                            {item.originalPrice && item.originalPrice > item.price && <><span className="text-xs text-muted-foreground line-through">{formatINR(item.originalPrice)}</span><span className="text-xs text-emerald-600 font-semibold">{disc}% OFF</span></>}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border rounded-lg">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}><Plus className="h-3 w-3" /></Button>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}><Trash2 className="h-4 w-4 mr-1" />Remove</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div>
          <Card className="sticky top-36 border-border/30 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {/* Coupon */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-emerald-600" /><span className="text-sm font-medium text-emerald-700">{appliedCoupon}</span></div>
                    <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="text-xs h-auto p-1">✕</Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input placeholder="Coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} className="text-sm h-9" />
                    <Button size="sm" onClick={handleApplyCoupon} disabled={couponLoading} className="bg-amber-500 hover:bg-amber-600 text-white">Apply</Button>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Price ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span><span>{formatINR(total + totalSavings)}</span></div>
              {totalSavings > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-600">Discount</span><span className="text-emerald-600">−{formatINR(totalSavings)}</span></div>}
              {couponDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-600">Coupon ({appliedCoupon})</span><span className="text-emerald-600">−{formatINR(couponDiscount)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className={deliveryCharge === 0 ? 'text-emerald-600 font-medium' : ''}>{deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{formatINR(grandTotal)}</span></div>
              {(totalSavings > 0 || couponDiscount > 0) && <p className="text-xs text-emerald-600 font-medium text-center bg-emerald-50 rounded-lg p-2">🎉 You save {formatINR(totalSavings + couponDiscount)}!</p>}
              <Button size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold h-12 shadow-lg shadow-amber-500/20" onClick={() => setCurrentView('checkout')}>Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button variant="outline" className="w-full" onClick={() => setCurrentView('home')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
