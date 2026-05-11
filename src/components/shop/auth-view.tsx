'use client';

import { useShopStore } from '@/store/shop-store';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff, Crown, UserCircle, Star, Quote, Sparkles, ShoppingBag, Users } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';

// Floating orb component for the left panel
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [0.8, 1.1, 0.8],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

// Animated grid pattern
function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

// Stat badge component
function StatBadge({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 text-white/80">
      <Icon className="h-4 w-4 text-blue-300" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

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
        toast.success('Account created! Welcome to Zylora 🎉');
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
    <div className="min-h-[80vh] flex flex-col lg:flex-row lg:min-h-[90vh]">
      {/* ====== LEFT PANEL (Desktop Only) ====== */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#2563EB] items-center justify-center p-12">
        <GridPattern />

        {/* Floating orbs */}
        <FloatingOrb
          className="absolute top-[15%] left-[20%] w-32 h-32 rounded-full bg-blue-400/20 blur-2xl"
          delay={0}
        />
        <FloatingOrb
          className="absolute top-[60%] left-[10%] w-24 h-24 rounded-full bg-white/10 blur-xl"
          delay={1.5}
        />
        <FloatingOrb
          className="absolute top-[30%] right-[15%] w-20 h-20 rounded-full bg-blue-300/20 blur-xl"
          delay={3}
        />
        <FloatingOrb
          className="absolute bottom-[25%] right-[25%] w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"
          delay={2}
        />
        <FloatingOrb
          className="absolute top-[5%] right-[40%] w-16 h-16 rounded-full bg-white/15 blur-lg"
          delay={4}
        />

        {/* Content */}
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-10"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
                <Zap className="h-8 w-8 text-blue-300" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">Zylora</span>
            </div>

            {/* Tagline */}
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              The Future of<br />
              <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                Online Shopping
              </span>
            </h2>
            <p className="text-blue-200/70 text-lg leading-relaxed">
              Discover amazing products, unbeatable prices, and a seamless shopping experience tailored just for you.
            </p>
          </motion.div>

          {/* Testimonial Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
          >
            <Quote className="h-5 w-5 text-blue-300/60 mb-2 rotate-180" />
            <p className="text-white/90 text-sm leading-relaxed mb-4">
              &ldquo;Zylora made shopping so easy! Great deals every day.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                H
              </div>
              <div>
                <p className="text-white text-sm font-medium">Happy Customer</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center gap-6 flex-wrap"
          >
            <StatBadge icon={ShoppingBag} label="10K+ Products" />
            <div className="w-px h-4 bg-white/20" />
            <StatBadge icon={Users} label="50K+ Customers" />
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 text-white/80">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.8 Rating</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ====== RIGHT PANEL / MOBILE ====== */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile gradient header */}
        <div className="lg:hidden relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#2563EB] px-6 pt-12 pb-16">
          <GridPattern />
          <FloatingOrb
            className="absolute top-[20%] right-[10%] w-28 h-28 rounded-full bg-blue-400/20 blur-2xl"
            delay={0}
          />
          <FloatingOrb
            className="absolute bottom-[10%] left-[5%] w-20 h-20 rounded-full bg-white/10 blur-xl"
            delay={2}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2">
                <Zap className="h-5 w-5 text-blue-300" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Zylora</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-blue-200/60 text-sm mt-1">
              {isLogin ? 'Sign in to continue shopping' : 'Join the future of online shopping'}
            </p>
          </motion.div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-6 lg:px-12 lg:py-12 bg-gradient-to-b from-slate-50 to-white lg:from-white lg:to-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {/* Desktop heading */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isLogin ? 'Sign in to access your account' : 'Start your journey with Zylora'}
              </p>
            </div>

            {/* Form Card - on mobile overlaps the header */}
            <div className="bg-white rounded-2xl lg:rounded-2xl shadow-xl shadow-slate-200/50 lg:shadow-lg lg:shadow-slate-200/80 border border-slate-100 p-6 sm:p-8 -mt-8 lg:mt-0 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name-field"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          className="pl-11 h-12 text-base bg-slate-50/80 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all placeholder:text-slate-400"
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      className="pl-11 h-12 text-base bg-slate-50/80 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all placeholder:text-slate-400"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      className="pl-11 pr-11 h-12 text-base bg-slate-50/80 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all placeholder:text-slate-400"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 rounded-xl transition-all duration-200 mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Please wait...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="h-[18px] w-[18px]" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Toggle login/signup */}
              <div className="mt-5 text-center">
                <p className="text-sm text-slate-500">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              {/* Quick Demo Login Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => quickLogin('admin@zshop.in', 'Admin@123')}
                    disabled={loading}
                    className="h-11 rounded-xl border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200 group"
                  >
                    <Crown className="h-4 w-4 mr-2 text-amber-500 group-hover:text-amber-600" />
                    <span className="text-sm font-medium">Admin</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => quickLogin('priya@zshop.in', 'User@123')}
                    disabled={loading}
                    className="h-11 rounded-xl border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group"
                  >
                    <UserCircle className="h-4 w-4 mr-2 text-blue-500 group-hover:text-blue-600" />
                    <span className="text-sm font-medium">User</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sparkle decoration - mobile */}
            <div className="lg:hidden flex justify-center mt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex items-center gap-1.5 text-slate-300"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs">Powered by Zylora</span>
                <Sparkles className="h-3.5 w-3.5" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
