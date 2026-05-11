'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { CheckCircle2, ArrowLeft, ShoppingBag, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderType } from '@/lib/types';
import { useState, useEffect } from 'react';

export function OrderSuccessView() {
  const { selectedOrderId, lastOrderNumber, setCurrentView, goHome } = useShopStore();
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    if (selectedOrderId) {
      fetch(`/api/orders/${selectedOrderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) setOrder(data);
        })
        .catch(console.error);
    }
  }, [selectedOrderId]);

  const PAYMENT_LABELS: Record<string, string> = {
    upi: 'UPI (GPay / PhonePe / Paytm)',
    card: 'Credit / Debit Card',
    netbanking: 'Net Banking',
    cod: 'Cash on Delivery',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Order Placed Successfully! 🎉</h1>
        <p className="text-muted-foreground">
          Thank you for shopping with Z Shop. Your order has been confirmed.
        </p>
      </div>

      {/* Order Info */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Order Number</span>
            <span className="font-bold text-amber-600">{order?.orderNumber || lastOrderNumber || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Order Date</span>
            <span className="font-medium text-sm">
              {order
                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 border font-medium">
              {order?.status || 'Confirmed'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Payment</span>
            <span className="font-medium text-sm">{PAYMENT_LABELS[order?.paymentMethod || 'upi'] || order?.paymentMethod || 'UPI'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      {order && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-500" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">
              {order.address}, {order.city}, {order.state} - {order.pincode}
            </p>
            <p className="text-sm text-muted-foreground">📞 {order.phone}</p>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      {order && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Items Ordered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 bg-muted/20">
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatINR(item.price)}</p>
                </div>
                <p className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-amber-600">{formatINR(order.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          size="lg"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
          onClick={goHome}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Continue Shopping
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => setCurrentView('orders')}
        >
          View All Orders
        </Button>
      </div>
    </div>
  );
}
