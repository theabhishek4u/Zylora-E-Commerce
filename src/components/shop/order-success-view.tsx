'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderType } from '@/lib/types';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PAYMENT_LABELS: Record<string, string> = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking', cod: 'Cash on Delivery' };

export function OrderSuccessView() {
  const { selectedOrderId, lastOrderNumber, setCurrentView, goHome } = useShopStore();
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    if (selectedOrderId) fetch(`/api/orders/${selectedOrderId}`).then((r) => r.json()).then((d) => { if (d.id) setOrder(d); }).catch(console.error);
  }, [selectedOrderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4"><CheckCircle2 className="h-12 w-12 text-emerald-600" /></div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Order Placed! 🎉</h1>
        <p className="text-muted-foreground">Thank you for shopping with Z Shop.</p>
      </motion.div>
      {order && (
        <>
          <Card className="mb-4 border-border/30 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Order</span><span className="font-bold text-amber-600">{order.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Date</span><span className="text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Payment</span><span className="text-sm">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Status</span><Badge className="bg-blue-50 text-blue-700 border-blue-200 border font-medium">{order.status}</Badge></div>
            </CardContent>
          </Card>
          <Card className="mb-4 border-border/30 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2"><CardTitle className="text-lg">Items</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (<div key={item.id} className="flex items-center gap-3"><div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-slate-50"><img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /></div><div className="flex-1 min-w-0"><p className="text-sm line-clamp-1">{item.productName}</p><p className="text-xs text-muted-foreground">{item.quantity} × {formatINR(item.price)}</p></div><p className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</p></div>))}
              <Separator />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-amber-600">{formatINR(order.totalAmount)}</span></div>
            </CardContent>
          </Card>
        </>
      )}
      <div className="flex gap-3 justify-center">
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white" onClick={goHome}><ShoppingBag className="mr-2 h-5 w-5" />Continue Shopping</Button>
        <Button variant="outline" onClick={() => setCurrentView('orders')}>View All Orders</Button>
      </div>
    </div>
  );
}
