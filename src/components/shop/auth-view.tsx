'use client';

import { useShopStore } from '@/store/shop-store';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';

export function AuthView() {
  const { setCurrentView, setUser } = useShopStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);

    if (isLogin) {
      const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      if (result?.error) { toast.error('Invalid email or password'); setLoading(false); return; }
      // Also set local user
      setUser({ id: 'session', name: form.email.split('@')[0], email: form.email, role: 'user' });
      toast.success('Welcome back! 👋');
      setCurrentView('home');
    } else {
      if (!form.name) { toast.error('Name is required'); setLoading(false); return; }
      if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); setLoading(false); return; }
      try {
        const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error); setLoading(false); return; }
        await signIn('credentials', { email: form.email, password: form.password, redirect: false });
        setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
        toast.success('Account created! Welcome to Z Shop 🎉');
        setCurrentView('home');
      } catch { toast.error('Registration failed'); }
    }
    setLoading(false);
  };

  const quickLogin = async (email: string, password: string) => {
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) { toast.error('Login failed'); setLoading(false); return; }
    setUser({ id: 'demo', name: email.split('@')[0], email, role: email.includes('admin') ? 'admin' : 'user' });
    toast.success('Welcome! 👋');
    setCurrentView('home');
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-2"><Zap className="h-6 w-6 text-white" /></div>
            <span className="text-2xl font-bold">Z <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Shop</span></span>
          </div>
          <h1 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-muted-foreground text-sm mt-1">{isLogin ? 'Sign in to your account' : 'Join Z Shop today'}</p>
        </div>

        <Card className="border-border/30 bg-white/80 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1">
                    <Label>Full Name</Label>
                    <div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-1">
                <Label>Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9 pr-9" type={showPassword ? 'text' : 'password'} placeholder="••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  <button type="button" className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold h-11 shadow-lg shadow-amber-500/20" disabled={loading}>
                {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button className="text-sm text-amber-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>

            <div className="mt-4">
              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">Quick Demo Login</span></div></div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => quickLogin('admin@zshop.in', 'Admin@123')} className="text-xs">👑 Admin</Button>
                <Button variant="outline" size="sm" onClick={() => quickLogin('priya@zshop.in', 'User@123')} className="text-xs">👤 User</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
