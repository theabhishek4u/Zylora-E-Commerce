'use client';

import { useShopStore } from '@/store/shop-store';
import { formatINR } from '@/lib/format';
import { LayoutDashboard, Package, Users, Tag, ShoppingBag, TrendingUp, ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { AdminStatsType, ProductType, OrderType } from '@/lib/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ADMIN_TABS = [
  { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'orders', label: 'Orders', icon: ShoppingBag },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'coupons', label: 'Coupons', icon: Tag },
];

export function AdminView() {
  const { user, setCurrentView, adminTab, setAdminTab } = useShopStore();
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string; createdAt: string; _count: { orders: number } }[]>([]);
  const [coupons, setCoupons] = useState<{ id: string; code: string; type: string; value: number; active: boolean; usedCount: number; expiresAt: string | null }[]>([]);

  useEffect(() => { fetch('/api/admin/analytics').then((r) => r.json()).then(setStats).catch(console.error); }, []);
  useEffect(() => { if (adminTab === 'products') fetch('/api/admin/products').then((r) => r.json()).then((d) => setProducts(d.products || [])).catch(console.error); }, [adminTab]);
  useEffect(() => { if (adminTab === 'orders') fetch('/api/admin/orders').then((r) => r.json()).then((d) => setOrders(d.orders || [])).catch(console.error); }, [adminTab]);
  useEffect(() => { if (adminTab === 'users') fetch('/api/admin/users').then((r) => r.json()).then((d) => setUsers(d.users || [])).catch(console.error); }, [adminTab]);
  useEffect(() => { if (adminTab === 'coupons') fetch('/api/admin/coupons').then((r) => r.json()).then(setCoupons).catch(console.error); }, [adminTab]);

  if (!user || user.role !== 'admin') return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><p className="text-muted-foreground">Admin access required</p><Button className="mt-4 bg-blue-600 text-white" onClick={() => setCurrentView('auth')}>Login as Admin</Button></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-2xl font-bold font-heading">Admin Panel</h1><p className="text-sm text-muted-foreground">Manage your store</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3">
              <nav className="space-y-1">
                {ADMIN_TABS.map((t) => (<button key={t.key} onClick={() => setAdminTab(t.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${adminTab === t.key ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <t.icon className="h-4 w-4" />{t.label}
                </button>))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden col-span-full">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {ADMIN_TABS.map((t) => {
              const Icon = t.icon;
              const isActive = adminTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setAdminTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-4">
          {/* Overview */}
          {adminTab === 'overview' && stats && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'Revenue', value: formatINR(stats.revenue), icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
                  { label: 'Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, gradient: 'from-blue-500 to-indigo-500' },
                  { label: 'Users', value: stats.totalUsers.toString(), icon: Users, gradient: 'from-violet-500 to-purple-500' },
                  { label: 'Products', value: stats.totalProducts.toString(), icon: Package, gradient: 'from-blue-500 to-blue-600' },
                  { label: 'Pending', value: stats.pendingOrders.toString(), icon: ShoppingBag, gradient: 'from-red-500 to-rose-500' },
                  { label: 'Sales', value: stats.totalSales.toString(), icon: TrendingUp, gradient: 'from-cyan-500 to-blue-500' },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="border-border/30 overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${s.gradient}`} />
                      <CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div><div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${s.gradient} flex items-center justify-center`}><s.icon className="h-5 w-5 text-white" /></div></div></CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
                <CardHeader><CardTitle className="text-lg">Recent Orders</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b"><th className="text-left py-2 font-medium text-muted-foreground">Order</th><th className="text-left py-2 font-medium text-muted-foreground">Customer</th><th className="text-left py-2 font-medium text-muted-foreground">Amount</th><th className="text-left py-2 font-medium text-muted-foreground">Status</th></tr></thead>
                      <tbody>{stats.recentOrders.map((o) => (<tr key={o.id} className="border-b last:border-0"><td className="py-2 font-medium">{o.orderNumber}</td><td className="py-2">{o.customerName}</td><td className="py-2 font-semibold">{formatINR(o.totalAmount)}</td><td className="py-2"><Badge variant="secondary">{o.status}</Badge></td></tr>))}</tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {stats.topProducts.length > 0 && (
                <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
                  <CardHeader><CardTitle className="text-lg">Top Products</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">{stats.topProducts.map((p, i) => (<div key={i} className="flex items-center justify-between py-2 border-b last:border-0"><div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{i + 1}</span><span className="font-medium text-sm">{p.name}</span></div><div className="text-sm"><span className="text-muted-foreground">{p.sold} sold</span><span className="ml-3 font-semibold">{formatINR(p.revenue)}</span></div></div>))}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Products */}
          {adminTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Products ({products.length})</h2>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white" onClick={() => toast.info('Add product form coming soon!')}><Plus className="h-4 w-4 mr-1" />Add Product</Button>
              </div>
              <div className="grid gap-3">
                {products.map((p) => (
                  <Card key={p.id} className="border-border/30 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-50"><img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.categoryName} · Stock: {p.stock}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold">{formatINR(p.price)}</p>
                        <div className="flex gap-1 mt-1">
                          {p.featured && <Badge className="text-xs bg-blue-100 text-blue-700">Featured</Badge>}
                          {p.onSale && <Badge className="text-xs bg-red-100 text-red-700">Sale</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => { useShopStore.getState().navigateToProduct(p.id); }}><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={async () => { await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: p.id }) }); setProducts(products.filter((x) => x.id !== p.id)); toast.success('Product deleted'); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {adminTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Orders ({orders.length})</h2>
              <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b bg-slate-50"><th className="text-left p-3 font-medium">Order</th><th className="text-left p-3 font-medium">Customer</th><th className="text-left p-3 font-medium">Amount</th><th className="text-left p-3 font-medium">Payment</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Action</th></tr></thead>
                      <tbody>{orders.map((o) => (<tr key={o.id} className="border-b last:border-0 hover:bg-slate-50"><td className="p-3 font-medium">{o.orderNumber}<br /><span className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span></td><td className="p-3">{o.customerName}<br /><span className="text-xs text-muted-foreground">{o.email}</span></td><td className="p-3 font-semibold">{formatINR(o.totalAmount)}</td><td className="p-3"><Badge variant="secondary" className="text-xs">{o.paymentStatus}</Badge></td><td className="p-3"><Badge className={`text-xs ${o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : o.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>{o.status}</Badge></td>
                        <td className="p-3"><select className="text-xs border rounded px-2 py-1" value={o.status} onChange={async (e) => { await fetch('/api/admin/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: o.id, status: e.target.value }) }); setOrders(orders.map((x) => x.id === o.id ? { ...x, status: e.target.value } : x)); toast.success('Status updated'); }}>
                          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select></td></tr>))}</tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users */}
          {adminTab === 'users' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Users ({users.length})</h2>
              <Card className="border-border/30 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b bg-slate-50"><th className="text-left p-3 font-medium">Name</th><th className="text-left p-3 font-medium">Email</th><th className="text-left p-3 font-medium">Role</th><th className="text-left p-3 font-medium">Orders</th><th className="text-left p-3 font-medium">Action</th></tr></thead>
                      <tbody>{users.map((u) => (<tr key={u.id} className="border-b last:border-0 hover:bg-slate-50"><td className="p-3 font-medium">{u.name}</td><td className="p-3 text-muted-foreground">{u.email}</td><td className="p-3"><Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="text-xs">{u.role}</Badge></td><td className="p-3">{u._count.orders}</td>
                        <td className="p-3"><select className="text-xs border rounded px-2 py-1" value={u.role} onChange={async (e) => { await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, role: e.target.value }) }); setUsers(users.map((x) => x.id === u.id ? { ...x, role: e.target.value } : x)); toast.success('Role updated'); }}>
                          {['user', 'admin'].map((r) => <option key={r} value={r}>{r}</option>)}
                        </select></td></tr>))}</tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Coupons */}
          {adminTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Coupons ({coupons.length})</h2></div>
              <div className="grid gap-3">
                {coupons.map((c) => (
                  <Card key={c.id} className="border-border/30 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div><p className="font-bold text-lg font-mono">{c.code}</p><p className="text-sm text-muted-foreground">{c.type === 'percentage' ? `${c.value}% off` : `${formatINR(c.value)} off`} · Used {c.usedCount} times</p></div>
                      <div className="flex items-center gap-2"><Badge className={c.active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}>{c.active ? 'Active' : 'Inactive'}</Badge>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={async () => { await fetch('/api/admin/coupons', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id }) }); setCoupons(coupons.filter((x) => x.id !== c.id)); toast.success('Coupon deleted'); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
