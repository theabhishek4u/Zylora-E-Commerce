'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { ArrowLeft, MapPin, CreditCard, Package, Phone, Mail, Truck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderType } from '@/lib/types';
import { useState, useEffect } from 'react';

const STATUS_STEPS = [{ key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 }, { key: 'processing', label: 'Processing', icon: Package }, { key: 'shipped', label: 'Shipped', icon: Truck }, { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }];
const PAYMENT_LABELS: Record<string, string> = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking', cod: 'Cash on Delivery' };

export function OrderDetailView() {
  const { selectedOrderId, setCurrentView } = useShopStore();
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    if (selectedOrderId) fetch(`/api/orders/${selectedOrderId}`).then((r) => r.json()).then((d) => { if (d.id) setOrder(d); }).catch(console.error);
  }, [selectedOrderId]);

  if (!order) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Order not found</p><Button onClick={() => setCurrentView('home')} className="mt-4">Go Home</Button></div>;

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6"><Button variant="ghost" size="icon" onClick={() => setCurrentView('orders')}><ArrowLeft className="h-5 w-5" /></Button><div><h1 className="text-2xl font-bold">Order Details</h1><p className="text-sm text-muted-foreground">{order.orderNumber}</p></div></div>

      <Card className="mb-6 border-border/30 bg-white/80 backdrop-blur-sm">
        <CardHeader><CardTitle className="text-lg">Order Status</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%` }} /></div>
            {STATUS_STEPS.map((step, idx) => { const Icon = step.icon; const isActive = idx <= currentStepIndex; return (<div key={step.key} className="flex flex-col items-center relative z-10"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'} ${idx === currentStepIndex ? 'ring-4 ring-emerald-500/20' : ''}`}><Icon className="h-5 w-5" /></div><span className={`text-xs mt-2 font-medium ${isActive ? 'text-emerald-600' : 'text-muted-foreground'}`}>{step.label}</span></div>); })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-amber-500" />Address</CardTitle></CardHeader>
          <CardContent><p className="font-medium">{order.customerName}</p><p className="text-sm text-muted-foreground">{order.address}, {order.city}, {order.state} - {order.pincode}</p><p className="text-sm text-muted-foreground">📞 {order.phone}</p></CardContent>
        </Card>
        <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-amber-500" />Payment</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Method</span><span className="font-medium">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-bold text-amber-600 text-lg">{formatINR(order.totalAmount)}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/30 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2"><CardTitle className="text-lg">Items ({order.items.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (<div key={item.id} className="flex items-center gap-4"><div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-50"><img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /></div><div className="flex-1 min-w-0"><p className="font-medium line-clamp-1">{item.productName}</p><p className="text-sm text-muted-foreground">{formatINR(item.price)} × {item.quantity}</p></div><p className="font-semibold">{formatINR(item.price * item.quantity)}</p></div>))}
          <Separator /><div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-amber-600">{formatINR(order.totalAmount)}</span></div>
        </CardContent>
      </Card>
      <div className="mt-6 text-center"><Button variant="outline" onClick={() => setCurrentView('home')}>Continue Shopping</Button></div>
    </div>
  );
}
