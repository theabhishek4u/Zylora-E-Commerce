'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { User, Package, Heart, MapPin, Settings, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { OrderType } from '@/lib/types';
import { motion } from 'framer-motion';

export function UserDashboardView() {
  const { user, setCurrentView } = useShopStore();
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    if (user?.email) fetch(`/api/orders?email=${encodeURIComponent(user.email)}`).then((r) => r.json()).then(setOrders).catch(console.error);
  }, [user]);

  if (!user) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><p>Please login first</p><Button className="mt-4 bg-amber-500 text-white" onClick={() => setCurrentView('auth')}>Login</Button></div>;

  const tabs = [{ key: 'overview', label: 'Overview', icon: User }, { key: 'orders', label: 'Orders', icon: Package }, { key: 'wishlist', label: 'Wishlist', icon: Heart }, { key: 'addresses', label: 'Addresses', icon: MapPin }];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                <div><p className="font-semibold">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p><Badge className="mt-1 text-xs">{user.role}</Badge></div>
              </div>
              <nav className="space-y-1">
                {tabs.map((t) => (<button key={t.key} onClick={() => { if (t.key === 'wishlist') setCurrentView('wishlist'); else setTab(t.key); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-amber-50 text-amber-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <t.icon className="h-4 w-4" />{t.label}
                </button>))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Orders', value: orders.length, color: 'from-blue-500 to-blue-600' },
                  { label: 'Wishlist', value: useShopStore.getState().wishlistIds.length, color: 'from-red-500 to-red-600' },
                  { label: 'Total Spent', value: formatINR(orders.reduce((s, o) => s + o.totalAmount, 0)), color: 'from-amber-500 to-orange-500' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="border-border/30 bg-white/80 backdrop-blur-sm overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
                      <CardContent className="p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p><p className="text-2xl font-bold mt-1">{stat.value}</p></CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
                <CardHeader><CardTitle className="text-lg">Recent Orders</CardTitle></CardHeader>
                <CardContent>{orders.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet</p> :
                  <div className="space-y-3">{orders.slice(0, 5).map((o) => (<div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-sm font-medium">{o.orderNumber}</p><p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p></div>
                    <div className="text-right"><p className="text-sm font-semibold">{formatINR(o.totalAmount)}</p><Badge variant="secondary" className="text-xs">{o.status}</Badge></div>
                  </div>))}</div>
                }</CardContent>
              </Card>
            </div>
          )}
          {tab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? <p className="text-center text-muted-foreground py-12">No orders yet</p> :
                orders.map((o) => (
                  <Card key={o.id} className="border-border/30 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div><p className="font-medium">{o.orderNumber}</p><p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('en-IN')} · {o.items.length} items</p></div>
                      <div className="flex items-center gap-3"><span className="font-semibold">{formatINR(o.totalAmount)}</span><Badge variant="secondary">{o.status}</Badge>
                        <Button size="sm" variant="outline" onClick={() => useShopStore.getState().navigateToOrder(o.id, o.orderNumber)}>View</Button></div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          )}
          {tab === 'addresses' && (
            <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-lg">Saved Addresses</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground text-sm">Address management coming soon. Add addresses during checkout.</p></CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
