'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { ArrowLeft, MapPin, CreditCard, Package, Phone, Mail, Truck, CheckCircle2, ClipboardCheck, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderType } from '@/lib/types';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Confirmed', icon: ClipboardCheck },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];
const PAYMENT_LABELS: Record<string, string> = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking', cod: 'Cash on Delivery' };

const STATUS_BADGE_MAP: Record<string, string> = {
  confirmed: 'from-blue-500/15 to-blue-600/10 text-blue-700 border-blue-200/60',
  processing: 'from-amber-500/15 to-amber-600/10 text-amber-700 border-amber-200/60',
  shipped: 'from-violet-500/15 to-violet-600/10 text-violet-700 border-violet-200/60',
  delivered: 'from-emerald-500/15 to-emerald-600/10 text-emerald-700 border-emerald-200/60',
  cancelled: 'from-red-500/15 to-red-600/10 text-red-700 border-red-200/60',
};

export function OrderDetailView() {
  const { selectedOrderId, setCurrentView } = useShopStore();
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    if (selectedOrderId) fetch(`/api/orders/${selectedOrderId}`).then((r) => r.json()).then((d) => { if (d.id) setOrder(d); }).catch(console.error);
  }, [selectedOrderId]);

  if (!order) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <p className="text-muted-foreground">Order not found</p>
      <Button onClick={() => setCurrentView('home')} className="mt-4">Go Home</Button>
    </div>
  );

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Back Button + Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-4 sm:mb-6"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView('orders')}
          className="shrink-0 relative group hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
          <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Order Details</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{order.orderNumber}</p>
        </div>
        <div className="ml-auto">
          <Badge className={`bg-gradient-to-r ${STATUS_BADGE_MAP[order.status] || STATUS_BADGE_MAP.confirmed} border font-semibold text-xs sm:text-sm px-3 py-1`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </motion.div>

      {/* Premium Status Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-premium rounded-xl overflow-hidden mb-4 sm:mb-6"
      >
        <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />
        <div className="p-4 sm:p-6">
          <h3 className="font-semibold text-base sm:text-lg font-heading mb-4 sm:mb-6">Order Status</h3>
          <div className="relative px-2 sm:px-4">
            {/* Connecting Lines */}
            <div className="absolute top-5 sm:top-6 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-[3px] bg-slate-200 dark:bg-slate-700 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 rounded-full"
              />
            </div>

            {/* Steps */}
            <div className="flex items-center justify-between relative">
              {STATUS_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isActive = idx <= currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 + idx * 0.1 }}
                      className={`
                        w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300
                        ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-emerald-500 text-white shadow-md shadow-emerald-500/25' : ''}
                        ${isCurrent ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' : ''}
                        ${!isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : ''}
                      `}
                    >
                      {isCurrent ? (
                        <div className="relative">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          {/* Pulse ring on current step */}
                          <div className="absolute inset-0 rounded-full animate-ping bg-blue-400/30" />
                        </div>
                      ) : (
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </motion.div>
                    <span className={`text-[10px] sm:text-xs mt-2 sm:mt-3 font-medium ${
                      isCurrent ? 'text-gradient-blue font-semibold' : isActive ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Address & Payment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-premium rounded-xl overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
          <div className="p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-semibold font-heading flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/15 to-cyan-500/15 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              Address
            </h3>
            <div className="space-y-1.5 ml-10">
              <p className="font-medium text-sm">{order.customerName}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{order.address}, {order.city}, {order.state} - {order.pincode}</p>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3 w-3" />{order.phone}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-premium rounded-xl overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-violet-500 to-blue-500" />
          <div className="p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-semibold font-heading flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/15 to-blue-500/15 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-violet-600" />
              </div>
              Payment
            </h3>
            <div className="space-y-2.5 ml-10">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs sm:text-sm">Total</span>
                <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/20">
                  {formatINR(order.totalAmount)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Items Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-premium rounded-xl overflow-hidden mt-3 sm:mt-6"
      >
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500" />
        <div className="p-4 sm:p-6">
          <h3 className="font-semibold text-base sm:text-lg font-heading mb-4">Items ({order.items.length})</h3>
          <div className="space-y-3 sm:space-y-4">
            {order.items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.08 }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100 shadow-sm">
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm line-clamp-1">{item.productName}</p>
                  <p className="text-[10px] sm:text-sm text-muted-foreground mt-0.5">{formatINR(item.price)} × {item.quantity}</p>
                </div>
                <p className="font-semibold text-xs sm:text-sm shrink-0">{formatINR(item.price * item.quantity)}</p>
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
      </motion.div>

      {/* Continue Shopping Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4 sm:mt-6 text-center"
      >
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 px-8"
          onClick={() => setCurrentView('home')}
        >
          Continue Shopping
        </Button>
      </motion.div>
    </div>
  );
}
