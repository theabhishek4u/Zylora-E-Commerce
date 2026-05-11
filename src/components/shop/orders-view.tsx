'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { Package, Search, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { OrderType } from '@/lib/types';
import { motion } from 'framer-motion';

const STATUS_CONFIG: Record<string, { gradient: string; bg: string; text: string; border: string; badge: string }> = {
  confirmed: {
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0',
  },
  processing: {
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badge: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0',
  },
  shipped: {
    gradient: 'from-purple-500 to-fuchsia-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-0',
  },
  delivered: {
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0',
  },
  cancelled: {
    gradient: 'from-red-500 to-rose-500',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    badge: 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-0',
  },
  pending: {
    gradient: 'from-slate-400 to-slate-500',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    badge: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0',
  },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
}

export function OrdersView() {
  const { setCurrentView, navigateToOrder } = useShopStore();
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setSearched(true);
    } catch { setOrders([]); setSearched(true); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 sm:mb-7">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')} className="shrink-0 hover:bg-slate-100 rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md shadow-blue-500/20">
            <Package className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading tracking-tight">My Orders</h1>
        </div>
      </div>

      {/* Search Card - Premium Glassmorphism */}
      <div className="relative mb-6 sm:mb-8">
        {/* Gradient top accent */}
        <div className="absolute -top-px left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
        <Card className="border-border/20 bg-white/70 backdrop-blur-xl shadow-lg shadow-slate-200/40 overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <h2 className="font-semibold font-heading mb-3 text-sm sm:text-base text-slate-700">Find your orders</h2>
            <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
              <div className={`flex-1 relative rounded-lg transition-all duration-300 ${inputFocused ? 'ring-2 ring-blue-400/40 shadow-md shadow-blue-500/10' : ''}`}>
                <Input
                  type="email"
                  placeholder="Enter email used while ordering"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="flex-1 text-sm h-10 border-border/30 bg-white/80 backdrop-blur-sm focus-visible:ring-blue-500/30 transition-all duration-300"
                />
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shrink-0 h-10 px-5 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Search className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Find</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {searched && orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center py-12 sm:py-16"
        >
          <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 mb-5">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Package className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text" style={{ color: 'transparent', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
            </motion.div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-heading mb-2 text-slate-800">No orders found</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">We couldn&apos;t find any orders associated with that email address.</p>
          <Button
            variant="outline"
            onClick={() => setCurrentView('home')}
            className="hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:text-white hover:border-transparent transition-all duration-300"
          >
            Continue Shopping
          </Button>
        </motion.div>
      )}

      {/* Orders List */}
      {orders.length > 0 && (
        <div className="space-y-4 sm:space-y-5">
          {orders.map((order, index) => {
            const statusCfg = getStatusConfig(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
              >
                <Card className="overflow-hidden border-border/20 bg-white/70 backdrop-blur-xl shadow-md shadow-slate-200/30 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 group">
                  <CardContent className="p-0">
                    {/* Gradient top border */}
                    <div className={`h-[2px] bg-gradient-to-r ${statusCfg.gradient}`} />

                    {/* Order header info */}
                    <div className="p-4 sm:p-5 flex flex-wrap items-center gap-2 sm:gap-3 justify-between">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                        <div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Order</p>
                          <p className="font-bold text-xs sm:text-sm tracking-tight">{order.orderNumber}</p>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-border/40" />
                        <div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Date</p>
                          <p className="font-semibold text-xs sm:text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="hidden sm:block w-px h-8 bg-border/40" />
                        <div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">Total</p>
                          <p className="font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{formatINR(order.totalAmount)}</p>
                        </div>
                      </div>
                      <Badge className={`${statusCfg.badge} font-semibold text-[10px] sm:text-xs px-2.5 py-0.5 shadow-sm`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="mx-4 sm:mx-5 border-t border-border/20" />

                    {/* Product items row */}
                    <div className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                      <div className="flex -space-x-2 sm:-space-x-2.5">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 border-white bg-slate-50 shadow-sm">
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] sm:text-xs font-bold text-slate-500 border-2 border-white shadow-sm relative">
                            <span>+{order.items.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold truncate text-slate-800">
                          {order.items[0]?.productName}
                          {order.items.length > 1 && (
                            <span className="text-muted-foreground font-normal"> + {order.items.length - 1} more</span>
                          )}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs sm:text-sm shrink-0 font-semibold hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 hover:text-white rounded-lg transition-all duration-300 px-3"
                        onClick={() => navigateToOrder(order.id, order.orderNumber)}
                      >
                        <Eye className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
