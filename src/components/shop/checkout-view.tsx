'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { ArrowLeft, CreditCard, Building, Smartphone, Banknote, Shield, CheckCircle2, MapPin, Lock, ChevronRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry'];

export function CheckoutView() {
  const { cartItems, getCartTotal, couponDiscount, setCurrentView, setSelectedOrderId, setLastOrderNumber, clearCart, user, addresses, setAddresses } = useShopStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const total = getCartTotal();
  const deliveryCharge = total >= 499 ? 0 : 49;
  const grandTotal = total - couponDiscount + deliveryCharge;

  const [form, setForm] = useState({ customerName: user?.name || '', email: user?.email || '', phone: '', address: '', city: '', state: '', pincode: '', paymentMethod: 'upi' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Required';
    if (!form.email.trim()) e.email = 'Required'; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Required'; else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Invalid mobile';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.state) e.state = 'Required';
    if (!form.pincode.trim()) e.pincode = 'Required'; else if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Invalid PIN';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) { toast.error('Please fill all fields correctly'); return; }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, userId: user?.id || null, couponCode: useShopStore.getState().appliedCoupon, items: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity })) }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      clearCart(); setLastOrderNumber(data.order.orderNumber); setSelectedOrderId(data.order.id); setCurrentView('order-success'); toast.success('Order placed! 🎉');
    } catch { toast.error('Something went wrong'); }
    finally { setIsProcessing(false); }
  };

  const PAYMENT_OPTIONS = [
    { value: 'upi', label: 'UPI', desc: 'GPay, PhonePe, Paytm', icon: Smartphone, color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-400', badge: 'Popular' },
    { value: 'card', label: 'Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-400' },
    { value: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: Building, color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-400' },
    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay on delivery', icon: Banknote, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-400' },
  ];

  const steps = [{ n: 1, t: 'Address', icon: MapPin }, { n: 2, t: 'Payment', icon: CreditCard }, { n: 3, t: 'Confirm', icon: CheckCircle2 }];

  if (cartItems.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20 text-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="mx-auto mb-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center"
      >
        <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 text-emerald-500" strokeWidth={1.5} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2">No items to checkout</h2>
      <p className="text-sm text-muted-foreground mb-6">Your cart seems empty. Add some items first!</p>
      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-11 px-6 shadow-lg shadow-blue-500/20" onClick={() => setCurrentView('home')}>Go Shopping</Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 sm:mb-8">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('cart')} className="shrink-0 hover:bg-slate-100 rounded-xl"><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-xl sm:text-2xl font-bold font-heading">Checkout</h1>
      </div>

      {/* Premium Step Indicator */}
      <div className="flex items-start gap-0 mb-8 sm:mb-10">
        {steps.map((s, i) => {
          const isCompleted = step > s.n;
          const isActive = step === s.n;
          return (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 relative ${
                    isCompleted
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : isActive
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                  animate={isActive ? { scale: [1, 1.05, 1] } : isCompleted ? { scale: [1, 1.15, 1] } : {}}
                  transition={isActive ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : isCompleted ? { duration: 0.4 } : {}}
                >
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </motion.div>
                <span className={`text-[10px] sm:text-xs font-semibold transition-colors duration-300 ${isCompleted ? 'text-emerald-600' : isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  {s.t}
                </span>
              </div>
              {i < 2 && (
                <div className="flex-1 mx-2 sm:mx-3 mt-3">
                  <div className="h-[2px] rounded-full bg-slate-100 overflow-hidden relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <div className="relative rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg overflow-hidden">
            {/* Gradient Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500" />

            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold font-heading flex items-center gap-2 mb-4 sm:mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><MapPin className="h-4 w-4 text-blue-600" /></div>
                Delivery Address
              </h3>

              <div className="space-y-4">
                {/* Row 1: Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-medium">Full Name *</Label>
                    <Input
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      className={`h-11 text-sm rounded-xl border-slate-200/80 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.customerName ? 'border-red-400 focus:ring-red-500/20' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.customerName && <p className="text-[10px] sm:text-xs text-red-500 mt-0.5">{errors.customerName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-medium">Mobile *</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`h-11 text-sm rounded-xl border-slate-200/80 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.phone ? 'border-red-400 focus:ring-red-500/20' : ''}`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <p className="text-[10px] sm:text-xs text-red-500 mt-0.5">{errors.phone}</p>}
                  </div>
                </div>

                {/* Row 2: Email */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm font-medium">Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`h-11 text-sm rounded-xl border-slate-200/80 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.email ? 'border-red-400 focus:ring-red-500/20' : ''}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-[10px] sm:text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Row 3: Address */}
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm font-medium">Address *</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={`h-11 text-sm rounded-xl border-slate-200/80 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.address ? 'border-red-400 focus:ring-red-500/20' : ''}`}
                    placeholder="House no., Street, Locality"
                  />
                  {errors.address && <p className="text-[10px] sm:text-xs text-red-500 mt-0.5">{errors.address}</p>}
                </div>

                {/* Row 4: City, State, PIN */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-medium">City *</Label>
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={`h-11 text-sm rounded-xl border-slate-200/80 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.city ? 'border-red-400 focus:ring-red-500/20' : ''}`}
                      placeholder="City"
                    />
                    {errors.city && <p className="text-[10px] sm:text-xs text-red-500 mt-0.5">{errors.city}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-medium">State *</Label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className={`w-full h-11 rounded-xl border px-3 text-sm bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none ${errors.state ? 'border-red-400' : 'border-slate-200/80'}`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-[10px] sm:text-xs text-red-500 mt-0.5">{errors.state}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-medium">PIN Code *</Label>
                    <Input
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })}
                      className={`h-11 text-sm rounded-xl border-slate-200/80 bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.pincode ? 'border-red-400 focus:ring-red-500/20' : ''}`}
                      placeholder="6-digit PIN"
                    />
                    {errors.pincode && <p className="text-[10px] sm:text-xs text-red-500 mt-0.5">{errors.pincode}</p>}
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white h-12 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-300 mt-2"
                  onClick={() => { if (validate()) setStep(2); }}
                >
                  Continue to Payment <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <div className="relative rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg overflow-hidden">
            {/* Gradient Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500" />

            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold font-heading flex items-center gap-2 mb-4 sm:mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><CreditCard className="h-4 w-4 text-blue-600" /></div>
                Payment Method
              </h3>

              <RadioGroup value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })} className="space-y-3">
                {PAYMENT_OPTIONS.map((opt) => {
                  const isSelected = form.paymentMethod === opt.value;
                  return (
                    <div
                      key={opt.value}
                      className={`relative flex items-center gap-3 sm:gap-4 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-300 overflow-hidden border ${
                        isSelected
                          ? 'border-blue-400/60 bg-blue-50/40 shadow-md shadow-blue-500/10'
                          : 'border-slate-200/60 bg-white/60 hover:bg-slate-50/80 hover:border-slate-300/60'
                      }`}
                    >
                      {/* Gradient Left Border when Selected */}
                      {isSelected && (
                        <motion.div
                          layoutId="paymentIndicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-700 rounded-r-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}

                      <RadioGroupItem value={opt.value} id={opt.value} className="shrink-0" />

                      <Label htmlFor={opt.value} className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${opt.bgColor} flex items-center justify-center shrink-0 transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-400/30' : ''}`}>
                          <opt.icon className={`h-5 w-5 sm:h-5.5 sm:w-5.5 ${opt.color}`} />
                        </div>
                        <div>
                          <span className="font-semibold text-sm sm:text-base">{opt.label}</span>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">{opt.desc}</p>
                        </div>
                      </Label>

                      {opt.badge && (
                        <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold shrink-0">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </RadioGroup>

              <div className="flex gap-3 mt-5 sm:mt-6">
                <Button variant="outline" className="flex-1 h-11 text-sm rounded-xl" onClick={() => setStep(1)}>Back</Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white h-11 text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-300"
                  onClick={() => setStep(3)}
                >
                  Review Order <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          {/* Order Review Card */}
          <div className="relative rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500" />

            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold font-heading flex items-center gap-2 mb-4 sm:mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-blue-600" /></div>
                Order Review
              </h3>

              <div className="space-y-4">
                {/* Delivery Info */}
                <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Truck className="h-3.5 w-3.5 text-blue-600" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Delivery To</p>
                  </div>
                  <p className="font-semibold text-sm">{form.customerName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{form.address}, {form.city}, {form.state} - {form.pincode}</p>
                </div>

                {/* Payment Info */}
                <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">Payment</p>
                  </div>
                  <p className="font-semibold text-sm">{PAYMENT_OPTIONS.find((o) => o.value === form.paymentMethod)?.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{PAYMENT_OPTIONS.find((o) => o.value === form.paymentMethod)?.desc}</p>
                </div>

                <Separator />

                {/* Items */}
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Items ({cartItems.length})</p>
                  <div className="space-y-2.5">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-colors">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-slate-50 ring-1 ring-black/5">
                          <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium line-clamp-1">{item.productName}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">{item.quantity} × {formatINR(item.price)}</p>
                        </div>
                        <p className="text-xs sm:text-sm font-bold">{formatINR(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between font-bold text-lg sm:text-xl">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 bg-clip-text text-transparent">{formatINR(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 text-sm rounded-xl" onClick={() => setStep(2)}>Back</Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white h-12 sm:h-13 font-bold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 text-sm rounded-xl transition-all duration-300 hover:scale-[1.01]"
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {!isProcessing && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.3)', '0 0 0 8px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </div>
              ) : `Place Order · ${formatINR(grandTotal)}`}
            </Button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 py-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-full px-4 py-2 ring-1 ring-slate-200/60">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-600">Safe & Secure Payments</span>
              <Lock className="h-3 w-3 text-slate-400" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
