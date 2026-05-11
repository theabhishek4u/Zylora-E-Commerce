'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { User, Package, Heart, MapPin, ArrowLeft, LogOut, ShoppingBag, Clock, IndianRupee, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { OrderType } from '@/lib/types';
import { motion } from 'framer-motion';

const STATUS_BADGE_MAP: Record<string, string> = {
  confirmed: 'from-blue-500/15 to-blue-600/10 text-blue-700 border-blue-200/60',
  processing: 'from-amber-500/15 to-amber-600/10 text-amber-700 border-amber-200/60',
  shipped: 'from-violet-500/15 to-violet-600/10 text-violet-700 border-violet-200/60',
  delivered: 'from-emerald-500/15 to-emerald-600/10 text-emerald-700 border-emerald-200/60',
  cancelled: 'from-red-500/15 to-red-600/10 text-red-700 border-red-200/60',
};

export function UserDashboardView() {
  const { user, setCurrentView } = useShopStore();
  const [tab, setTab] = useState('overview');
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    if (user?.email) fetch(`/api/orders?email=${encodeURIComponent(user.email)}`).then((r) => r.json()).then(setOrders).catch(console.error);
  }, [user]);

  if (!user) return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
      <p className="text-sm sm:text-base text-muted-foreground">Please login first</p>
      <Button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25" onClick={() => setCurrentView('auth')}>Login</Button>
    </div>
  );

  const tabs = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'wishlist', label: 'Wishlist', icon: Heart },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);
  const wishlistCount = useShopStore.getState().wishlistIds.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-4 sm:mb-6"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView('home')}
          className="shrink-0 relative group hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
          <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold font-heading">My Dashboard</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="glass-premium rounded-xl overflow-hidden sticky top-4">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-600" />
            <div className="p-5">
              {/* User Avatar with Gradient Ring */}
              <div className="flex flex-col items-center mb-5">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-blue-600 p-[3px] shadow-lg shadow-blue-500/20">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                      <span className="text-xl font-bold text-gradient-blue">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-base">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                <Badge className="mt-2 text-[10px] bg-gradient-to-r from-blue-500/15 to-violet-500/15 text-blue-700 border-blue-200/60 border font-semibold">{user.role}</Badge>
              </div>

              <Separator className="mb-4" />

              {/* Nav Items */}
              <nav className="space-y-1.5">
                {tabs.map((t) => {
                  const isActive = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => { if (t.key === 'wishlist') setCurrentView('wishlist'); else setTab(t.key); }}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-blue-500/10 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-500/10 border border-blue-200/40 dark:border-blue-800/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                        }
                      `}
                    >
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                        isActive ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <t.icon className="h-3.5 w-3.5" />
                      </div>
                      {t.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Section */}
        <div className="lg:hidden col-span-full">
          {/* User info card with gradient avatar ring */}
          <div className="glass-premium rounded-xl overflow-hidden mb-3">
            <div className="h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-600" />
            <div className="p-3 flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-blue-600 p-[2px] shadow-md shadow-blue-500/20">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                    <span className="text-sm font-bold text-gradient-blue">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Badge className="text-[10px] bg-gradient-to-r from-blue-500/15 to-violet-500/15 text-blue-700 border-blue-200/60 border font-semibold">{user.role}</Badge>
            </div>
          </div>

          {/* Horizontal tabs - Premium pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
            {tabs.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => { if (t.key === 'wishlist') setCurrentView('wishlist'); else setTab(t.key); }}
                  className={`
                    flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap shrink-0
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'glass text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80'
                    }
                  `}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Overview Tab */}
          {tab === 'overview' && (
            <div className="space-y-3 sm:space-y-4">
              {/* Premium Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Orders', value: orders.length, color: 'from-blue-500 to-blue-600', icon: Package, shadowColor: 'shadow-blue-500/20' },
                  { label: 'Wishlist', value: wishlistCount, color: 'from-rose-500 to-pink-600', icon: Heart, shadowColor: 'shadow-rose-500/20' },
                  { label: 'Total Spent', value: formatINR(totalSpent), color: 'from-violet-500 to-blue-600', icon: IndianRupee, shadowColor: 'shadow-violet-500/20' },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-premium rounded-xl overflow-hidden card-hover"
                    >
                      <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
                          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md ${stat.shadowColor}`}>
                            <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" />
                          </div>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-premium rounded-xl overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500" />
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-base sm:text-lg font-heading">Recent Orders</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      onClick={() => setTab('orders')}
                    >
                      View All
                    </Button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-center py-6">
                      <Package className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {orders.slice(0, 5).map((o, idx) => (
                        <motion.div
                          key={o.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.08 }}
                          className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center">
                              <ShoppingBag className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-medium group-hover:text-blue-600 transition-colors">{o.orderNumber}</p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <p className="text-xs sm:text-sm font-semibold">{formatINR(o.totalAmount)}</p>
                              <Badge className={`bg-gradient-to-r ${STATUS_BADGE_MAP[o.status] || STATUS_BADGE_MAP.confirmed} border text-[10px]`}>
                                {o.status}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:bg-blue-50"
                              onClick={() => useShopStore.getState().navigateToOrder(o.id, o.orderNumber)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div className="space-y-2 sm:space-y-3">
              {orders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10 sm:py-16"
                >
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">No orders yet</p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 text-sm"
                    onClick={() => setCurrentView('home')}
                  >
                    Start Shopping
                  </Button>
                </motion.div>
              ) : (
                orders.map((o, idx) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="glass-premium rounded-xl overflow-hidden card-hover"
                  >
                    <div className={`h-0.5 bg-gradient-to-r ${
                      o.status === 'delivered' ? 'from-emerald-400 to-emerald-600' :
                      o.status === 'shipped' ? 'from-violet-400 to-violet-600' :
                      o.status === 'processing' ? 'from-amber-400 to-amber-600' :
                      'from-blue-400 to-blue-600'
                    }`} />
                    <div className="p-3 sm:p-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          o.status === 'delivered' ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10' :
                          o.status === 'shipped' ? 'bg-gradient-to-br from-violet-500/10 to-violet-600/10' :
                          o.status === 'processing' ? 'bg-gradient-to-br from-amber-500/10 to-amber-600/10' :
                          'bg-gradient-to-br from-blue-500/10 to-blue-600/10'
                        }`}>
                          <Package className={`h-4 w-4 ${
                            o.status === 'delivered' ? 'text-emerald-600' :
                            o.status === 'shipped' ? 'text-violet-600' :
                            o.status === 'processing' ? 'text-amber-600' :
                            'text-blue-600'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-xs sm:text-sm truncate">{o.orderNumber}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(o.createdAt).toLocaleDateString('en-IN')} · {o.items.length} items
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="font-semibold text-sm">{formatINR(o.totalAmount)}</p>
                          <Badge className={`bg-gradient-to-r ${STATUS_BADGE_MAP[o.status] || STATUS_BADGE_MAP.confirmed} border text-[10px] mt-0.5`}>
                            {o.status}
                          </Badge>
                        </div>
                        <span className="font-semibold text-xs sm:hidden">{formatINR(o.totalAmount)}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 sm:h-8 text-[10px] sm:text-xs border-blue-200 dark:border-blue-800 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 hover:border-blue-300 transition-all"
                          onClick={() => useShopStore.getState().navigateToOrder(o.id, o.orderNumber)}
                        >
                          <Eye className="h-3 w-3 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Addresses Tab - Coming Soon */}
          {tab === 'addresses' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-premium rounded-xl overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />
              <div className="p-6 sm:p-10 text-center">
                <div className="relative inline-flex items-center justify-center mb-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-emerald-500/10 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-blue-500/60" />
                  </div>
                  {/* Decorative dots */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-400/30 animate-bounce-subtle" />
                  <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 rounded-full bg-violet-400/30 animate-bounce-subtle stagger-3" />
                  <div className="absolute top-1 -left-3 w-2 h-2 rounded-full bg-emerald-400/30 animate-bounce-subtle stagger-5" />
                </div>
                <h3 className="font-semibold text-lg font-heading mb-2">Saved Addresses</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-5">
                  Address management is coming soon. You can add and save addresses during checkout for faster ordering.
                </p>
                <Button
                  variant="outline"
                  className="border-blue-200 dark:border-blue-800 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 transition-all"
                  onClick={() => setCurrentView('home')}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Start Shopping
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
