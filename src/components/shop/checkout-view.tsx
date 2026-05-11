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

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Chandigarh', 'Puducherry',
];

export function CheckoutView() {
  const { cartItems, getCartTotal, setCurrentView, setSelectedOrderId, setLastOrderNumber, clearCart } = useShopStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getCartTotal();
  const totalSavings = cartItems.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const deliveryCharge = total >= 499 ? 0 : 49;
  const grandTotal = total + deliveryCharge;

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter valid 10-digit mobile number';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter valid 6-digit PIN code';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sessionId: `session_${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to place order');
        return;
      }

      clearCart();
      setLastOrderNumber(data.order.orderNumber);
      setSelectedOrderId(data.order.id);
      setCurrentView('order-success');
      toast.success('Order placed successfully! 🎉');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <CheckCircle2 className="h-24 w-24 mx-auto text-emerald-500 mb-6" />
        <h2 className="text-2xl font-bold mb-2">No items to checkout</h2>
        <p className="text-muted-foreground mb-6">Your cart is empty. Add some products first.</p>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setCurrentView('home')}>
          Go Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('cart')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-amber-500" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className={errors.customerName ? 'border-destructive' : ''}
                  />
                  {errors.customerName && <p className="text-xs text-destructive">{errors.customerName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <Input
                    id="phone"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="House no., Building, Street, Area"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <select
                    id="state"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className={`w-full h-9 rounded-md border px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
                      errors.state ? 'border-destructive' : 'border-input'
                    }`}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input
                    id="pincode"
                    placeholder="6-digit PIN"
                    maxLength={6}
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })}
                    className={errors.pincode ? 'border-destructive' : ''}
                  />
                  {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-500" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={form.paymentMethod}
                onValueChange={(value) => setForm({ ...form, paymentMethod: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors has-[data-state=checked]:border-amber-500 has-[data-state=checked]:bg-amber-50/50">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5 text-violet-600" />
                    <div>
                      <span className="font-medium">UPI</span>
                      <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm, BHIM UPI</p>
                    </div>
                  </Label>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Popular</span>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors has-[data-state=checked]:border-amber-500 has-[data-state=checked]:bg-amber-50/50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="font-medium">Credit / Debit Card</span>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors has-[data-state=checked]:border-amber-500 has-[data-state=checked]:bg-amber-50/50">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Building className="h-5 w-5 text-teal-600" />
                    <div>
                      <span className="font-medium">Net Banking</span>
                      <p className="text-xs text-muted-foreground">All major banks supported</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors has-[data-state=checked]:border-amber-500 has-[data-state=checked]:bg-amber-50/50">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Banknote className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-36">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Item List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 bg-muted/20">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatINR(total + totalSavings)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Discount</span>
                    <span className="text-emerald-600">−{formatINR(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-emerald-600 font-medium' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-amber-600">{formatINR(grandTotal)}</span>
                </div>
              </div>

              {totalSavings > 0 && (
                <p className="text-xs text-emerald-600 font-medium text-center bg-emerald-50 rounded-lg p-2">
                  🎉 You save {formatINR(totalSavings)} on this order!
                </p>
              )}

              <Button
                size="lg"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base h-12"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </div>
                ) : (
                  <>
                    Place Order · {formatINR(grandTotal)}
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                <span>Safe and Secure Payments</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
