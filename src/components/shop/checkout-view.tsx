'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { ArrowLeft, CreditCard, Building, Smartphone, Banknote, Shield, CheckCircle2 } from 'lucide-react';
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
    { value: 'upi', label: 'UPI', desc: 'GPay, PhonePe, Paytm', icon: Smartphone, color: 'text-violet-600', badge: 'Popular' },
    { value: 'card', label: 'Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard, color: 'text-blue-600' },
    { value: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: Building, color: 'text-teal-600' },
    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay on delivery', icon: Banknote, color: 'text-emerald-600' },
  ];

  if (cartItems.length === 0) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><CheckCircle2 className="h-24 w-24 mx-auto text-emerald-500 mb-6" /><h2 className="text-2xl font-bold mb-2">No items to checkout</h2><Button className="bg-amber-500 text-white mt-4" onClick={() => setCurrentView('home')}>Go Shopping</Button></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('cart')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[{ n: 1, t: 'Address' }, { n: 2, t: 'Payment' }, { n: 3, t: 'Confirm' }].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.n ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>{s.n}</div>
            <span className={`text-sm font-medium hidden sm:inline ${step >= s.n ? 'text-foreground' : 'text-muted-foreground'}`}>{s.t}</span>
            {i < 2 && <div className={`flex-1 h-0.5 rounded ${step > s.n ? 'bg-amber-500' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building className="h-5 w-5 text-amber-500" />Delivery Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Full Name *</Label><Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className={errors.customerName ? 'border-red-400' : ''} />{errors.customerName && <p className="text-xs text-red-500">{errors.customerName}</p>}</div>
                <div className="space-y-1"><Label>Mobile *</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={errors.phone ? 'border-red-400' : ''} />{errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}</div>
              </div>
              <div className="space-y-1"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={errors.email ? 'border-red-400' : ''} />{errors.email && <p className="text-xs text-red-500">{errors.email}</p>}</div>
              <div className="space-y-1"><Label>Address *</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={errors.address ? 'border-red-400' : ''} />{errors.address && <p className="text-xs text-red-500">{errors.address}</p>}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1"><Label>City *</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={errors.city ? 'border-red-400' : ''} />{errors.city && <p className="text-xs text-red-500">{errors.city}</p>}</div>
                <div className="space-y-1"><Label>State *</Label><select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={`w-full h-9 rounded-md border px-3 text-sm bg-background ${errors.state ? 'border-red-400' : 'border-input'}`}><option value="">Select</option>{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select>{errors.state && <p className="text-xs text-red-500">{errors.state}</p>}</div>
                <div className="space-y-1"><Label>PIN Code *</Label><Input maxLength={6} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })} className={errors.pincode ? 'border-red-400' : ''} />{errors.pincode && <p className="text-xs text-red-500">{errors.pincode}</p>}</div>
              </div>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white h-11" onClick={() => { if (validate()) setStep(2); }}>Continue to Payment</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-amber-500" />Payment Method</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={form.paymentMethod} onValueChange={(v) => setForm({ ...form, paymentMethod: v })} className="space-y-3">
                {PAYMENT_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-3 border rounded-xl p-4 cursor-pointer hover:bg-slate-50 transition-colors has-[data-state=checked]:border-amber-400 has-[data-state=checked]:bg-amber-50/50">
                    <RadioGroupItem value={opt.value} id={opt.value} />
                    <Label htmlFor={opt.value} className="flex items-center gap-3 cursor-pointer flex-1">
                      <opt.icon className={`h-5 w-5 ${opt.color}`} />
                      <div><span className="font-medium">{opt.label}</span><p className="text-xs text-muted-foreground">{opt.desc}</p></div>
                    </Label>
                    {opt.badge && <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{opt.badge}</span>}
                  </div>
                ))}
              </RadioGroup>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white h-11" onClick={() => setStep(3)}>Review Order</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-lg">Order Review</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Delivery To</p><p className="font-medium">{form.customerName}</p><p className="text-sm text-muted-foreground">{form.address}, {form.city}, {form.state} - {form.pincode}</p></div>
              <Separator />
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Payment</p><p className="font-medium">{PAYMENT_OPTIONS.find((o) => o.value === form.paymentMethod)?.label}</p></div>
              <Separator />
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Items ({cartItems.length})</p>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-1"><div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-slate-50"><img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /></div><div className="flex-1 min-w-0"><p className="text-sm line-clamp-1">{item.productName}</p><p className="text-xs text-muted-foreground">{item.quantity} × {formatINR(item.price)}</p></div><p className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</p></div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{formatINR(grandTotal)}</span></div>
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
            <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white h-12 font-semibold shadow-lg shadow-amber-500/20" onClick={handleSubmit} disabled={isProcessing}>
              {isProcessing ? <div className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Processing...</div> : `Place Order · ${formatINR(grandTotal)}`}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><Shield className="h-3.5 w-3.5" /><span>Safe & Secure Payments</span></div>
        </motion.div>
      )}
    </div>
  );
}
