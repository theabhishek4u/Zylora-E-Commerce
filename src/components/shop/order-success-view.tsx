'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { CheckCircle2, ShoppingBag, Hash, CalendarDays, CreditCard, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderType } from '@/lib/types';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PAYMENT_LABELS: Record<string, string> = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking', cod: 'Cash on Delivery' };

/* Confetti-like dot positions around the success icon */
const CONFETTI_DOTS = [
  { x: -40, y: -30, size: 6, delay: 0, color: 'bg-blue-400' },
  { x: 38, y: -28, size: 5, delay: 0.15, color: 'bg-emerald-400' },
  { x: -48, y: 10, size: 4, delay: 0.3, color: 'bg-amber-400' },
  { x: 46, y: 14, size: 6, delay: 0.1, color: 'bg-rose-400' },
  { x: -30, y: 40, size: 5, delay: 0.25, color: 'bg-violet-400' },
  { x: 34, y: 38, size: 4, delay: 0.35, color: 'bg-cyan-400' },
  { x: 0, y: -48, size: 5, delay: 0.2, color: 'bg-orange-400' },
  { x: -52, y: -8, size: 4, delay: 0.4, color: 'bg-teal-400' },
];

export function OrderSuccessView() {
  const { selectedOrderId, lastOrderNumber, setCurrentView, goHome } = useShopStore();
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    if (selectedOrderId) fetch(`/api/orders/${selectedOrderId}`).then((r) => r.json()).then((d) => { if (d.id) setOrder(d); }).catch(console.error);
  }, [selectedOrderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Success Icon with Animated Gradient Circle + Confetti Dots */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 0.6 }}
        className="text-center mb-8 sm:mb-10"
      >
        <div className="relative inline-flex items-center justify-center mb-6">
          {/* Animated gradient ring */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.1 }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-500 via-emerald-400 to-blue-600 p-[3px] shadow-lg shadow-blue-500/25"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.35 }}
              >
                <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 text-emerald-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Confetti-like dots */}
          {CONFETTI_DOTS.map((dot, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0, 1, 0.6] }}
              transition={{ delay: 0.5 + dot.delay, duration: 0.6, ease: 'easeOut' }}
              className={`absolute rounded-full ${dot.color}`}
              style={{
                left: `calc(50% + ${dot.x}px)`,
                top: `calc(50% + ${dot.y}px)`,
                width: dot.size,
                height: dot.size,
              }}
            />
          ))}
        </div>

        {/* Gradient heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl sm:text-3xl font-bold font-heading text-gradient-blue mb-2"
        >
          Order Placed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-sm sm:text-base"
        >
          Thank you for shopping with Zylora. Your order is being processed.
        </motion.p>
      </motion.div>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {/* Order Details Card - Glassmorphism with Gradient Top Border */}
          <div className="glass-premium rounded-xl overflow-hidden mb-4 sm:mb-6">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-600" />
            <div className="p-4 sm:p-6 space-y-3">
              <h3 className="font-semibold text-base sm:text-lg font-heading mb-3">Order Details</h3>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><Hash className="h-3.5 w-3.5" />Order</span>
                <span className="font-bold text-gradient-blue text-sm sm:text-base">{order.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />Date</span>
                <span className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><CreditCard className="h-3.5 w-3.5" />Payment</span>
                <span className="text-sm font-medium">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><Package className="h-3.5 w-3.5" />Status</span>
                <Badge className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 text-blue-700 border-blue-200/60 border font-semibold text-xs">{order.status}</Badge>
              </div>
            </div>
          </div>

          {/* Items Card - Glassmorphism with Gradient Top Border */}
          <div className="glass-premium rounded-xl overflow-hidden mb-6 sm:mb-8">
            <div className="h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500" />
            <div className="p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg font-heading mb-4">Items ({order.items.length})</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.08 }}
                    className="flex items-center gap-3 sm:gap-4"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100 shadow-sm">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.quantity} × {formatINR(item.price)}</p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">{formatINR(item.price * item.quantity)}</p>
                  </motion.div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-base sm:text-lg">Total</span>
                <div className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-base sm:text-lg shadow-md shadow-blue-500/20">
                  {formatINR(order.totalAmount)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 px-6"
          onClick={goHome}
        >
          <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          className="text-sm sm:text-base border-slate-300 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 px-6"
          onClick={() => setCurrentView('orders')}
        >
          View All Orders
        </Button>
      </motion.div>
    </div>
  );
}
