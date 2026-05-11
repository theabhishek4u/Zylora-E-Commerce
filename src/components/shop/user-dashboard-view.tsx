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

  if (!user) return <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center"><p className="text-sm sm:text-base text-muted-foreground">Please login first</p><Button className="mt-4 bg-blue-600 text-white" onClick={() => setCurrentView('auth')}>Login</Button></div>;

  const tabs = [{ key: 'overview', label: 'Overview', icon: User }, { key: 'orders', label: 'Orders', icon: Package }, { key: 'wishlist', label: 'Wishlist', icon: Heart }, { key: 'addresses', label: 'Addresses', icon: MapPin }];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')} className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-xl sm:text-2xl font-bold font-heading">My Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                <div><p className="font-semibold">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p><Badge className="mt-1 text-xs">{user.role}</Badge></div>
              </div>
              <nav className="space-y-1">
                {tabs.map((t) => (<button key={t.key} onClick={() => { if (t.key === 'wishlist') setCurrentView('wishlist'); else setTab(t.key); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <t.icon className="h-4 w-4" />{t.label}
                </button>))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden col-span-full">
          {/* User info card */}
          <Card className="border-border/30 bg-white/80 backdrop-blur-sm mb-3">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{user.name}</p><p className="text-xs text-muted-foreground truncate">{user.email}</p></div>
                <Badge className="text-[10px]">{user.role}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Horizontal tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { if (t.key === 'wishlist') setCurrentView('wishlist'); else setTab(t.key); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  tab === t.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-3">
          {tab === 'overview' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Orders', value: orders.length, color: 'from-blue-500 to-blue-600' },
                  { label: 'Wishlist', value: useShopStore.getState().wishlistIds.length, color: 'from-red-500 to-red-600' },
                  { label: 'Total Spent', value: formatINR(orders.reduce((s, o) => s + o.totalAmount, 0)), color: 'from-blue-600 to-blue-700' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="border-border/30 bg-white/80 backdrop-blur-sm overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
                      <CardContent className="p-3 sm:p-4"><p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p><p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1">{stat.value}</p></CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2 sm:pb-3"><CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle></CardHeader>
                <CardContent>{orders.length === 0 ? <p className="text-xs sm:text-sm text-muted-foreground">No orders yet</p> :
                  <div className="space-y-2 sm:space-y-3">{orders.slice(0, 5).map((o) => (<div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div><p className="text-xs sm:text-sm font-medium">{o.orderNumber}</p><p className="text-[10px] sm:text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p></div>
                    <div className="text-right"><p className="text-xs sm:text-sm font-semibold">{formatINR(o.totalAmount)}</p><Badge variant="secondary" className="text-[10px] sm:text-xs">{o.status}</Badge></div>
                  </div>))}</div>
                }</CardContent>
              </Card>
            </div>
          )}
          {tab === 'orders' && (
            <div className="space-y-2 sm:space-y-3">
              {orders.length === 0 ? <p className="text-center text-muted-foreground py-10 sm:py-12 text-sm">No orders yet</p> :
                orders.map((o) => (
                  <Card key={o.id} className="border-border/30 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-2">
                      <div className="min-w-0"><p className="font-medium text-xs sm:text-sm truncate">{o.orderNumber}</p><p className="text-[10px] sm:text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('en-IN')} · {o.items.length} items</p></div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0"><span className="font-semibold text-xs sm:text-sm">{formatINR(o.totalAmount)}</span><Badge variant="secondary" className="text-[10px] sm:text-xs hidden sm:inline-flex">{o.status}</Badge>
                        <Button size="sm" variant="outline" className="h-7 sm:h-8 text-[10px] sm:text-xs" onClick={() => useShopStore.getState().navigateToOrder(o.id, o.orderNumber)}>View</Button></div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          )}
          {tab === 'addresses' && (
            <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base sm:text-lg">Saved Addresses</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground text-xs sm:text-sm">Address management coming soon. Add addresses during checkout.</p></CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
