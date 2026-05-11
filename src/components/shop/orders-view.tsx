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

const STATUS_COLORS: Record<string, string> = { confirmed: 'bg-blue-50 text-blue-700 border-blue-200', processing: 'bg-amber-50 text-amber-700 border-amber-200', shipped: 'bg-purple-50 text-purple-700 border-purple-200', delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200', cancelled: 'bg-red-50 text-red-700 border-red-200', pending: 'bg-slate-50 text-slate-700 border-slate-200' };

export function OrdersView() {
  const { setCurrentView, navigateToOrder } = useShopStore();
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6"><Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}><ArrowLeft className="h-5 w-5" /></Button><h1 className="text-2xl font-bold">My Orders</h1></div>
      <Card className="mb-8 border-border/30 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-3">Find your orders</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input type="email" placeholder="Enter email used while ordering" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
            <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white" disabled={loading}>{loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Search className="h-4 w-4 mr-2" />Find</>}</Button>
          </form>
        </CardContent>
      </Card>
      {searched && orders.length === 0 && (
        <div className="text-center py-12"><Package className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" /><h3 className="text-lg font-semibold mb-2">No orders found</h3><Button variant="outline" onClick={() => setCurrentView('home')}>Continue Shopping</Button></div>
      )}
      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden border-border/30 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="bg-slate-50 p-4 flex flex-wrap items-center gap-3 justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <div><p className="text-xs text-muted-foreground">Order</p><p className="font-semibold text-sm">{order.orderNumber}</p></div>
                      <div><p className="text-xs text-muted-foreground">Date</p><p className="font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
                      <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold text-sm text-amber-600">{formatINR(order.totalAmount)}</p></div>
                    </div>
                    <Badge className={`${STATUS_COLORS[order.status] || ''} border font-medium`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
                  </div>
                  <div className="p-4 flex items-center gap-3">
                    <div className="flex -space-x-2">{order.items.slice(0, 3).map((item) => (<div key={item.id} className="w-10 h-10 rounded-md overflow-hidden border-2 border-white bg-slate-50"><img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /></div>))}{order.items.length > 3 && <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-xs font-semibold text-muted-foreground border-2 border-white">+{order.items.length - 3}</div>}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{order.items[0]?.productName}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}</p></div>
                    <Button variant="ghost" size="sm" className="text-amber-600" onClick={() => navigateToOrder(order.id, order.orderNumber)}><Eye className="h-4 w-4 mr-1" />View</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
