'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  Send,
  Zap,
  ArrowRight,
} from 'lucide-react';

const shopLinks = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Books',
  'Beauty',
  'Sports',
];

const supportLinks = [
  'Help Center',
  'Track Order',
  'Returns',
  'Shipping Info',
  'Contact Us',
];

const companyLinks = ['About Us', 'Careers', 'Press', 'Blog', 'Sell on Zylora'];

const socialIcons = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Youtube, label: 'YouTube' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="mt-auto hidden md:block">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Stay in the Loop
              </h3>
              <p className="text-blue-100 text-sm sm:text-base max-w-md">
                Subscribe to get exclusive deals, new arrivals, and insider-only discounts delivered to your inbox.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubscribe}
              className="flex w-full md:w-auto max-w-md"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-l-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all text-sm sm:text-base"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 sm:px-7 py-3 sm:py-3.5 bg-white text-blue-700 font-semibold rounded-r-xl hover:bg-blue-50 transition-colors text-sm sm:text-base whitespace-nowrap flex items-center gap-2"
              >
                {subscribed ? (
                  'Subscribed!'
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Column 1: Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-2 shadow-lg shadow-blue-500/20">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  Zylora
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                The Future of Online Shopping. Discover premium products with unmatched quality and lightning-fast delivery.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {socialIcons.map(({ icon: Icon, label }) => (
                  <motion.a
                    key={label}
                    href="#"
                    aria-label={label}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all duration-300"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white bg-slate-700 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Column 2: Shop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
                Shop
              </h4>
              <ul className="space-y-3">
                {shopLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="group text-slate-400 text-sm hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <span className="inline-block w-0 group-hover:w-2 h-px bg-blue-400 transition-all duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
                Support
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="group text-slate-400 text-sm hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <span className="inline-block w-0 group-hover:w-2 h-px bg-blue-400 transition-all duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 4: Company + Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
                Company
              </h4>
              <ul className="space-y-3 mb-6">
                {companyLinks.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="group text-slate-400 text-sm hover:text-blue-400 transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <span className="inline-block w-0 group-hover:w-2 h-px bg-blue-400 transition-all duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="border-t border-slate-700/50 pt-5 space-y-3">
                <a
                  href="mailto:support@zylora.com"
                  className="flex items-center gap-2.5 text-slate-400 text-sm hover:text-blue-400 transition-colors duration-200 group"
                >
                  <Mail className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                  support@zylora.com
                </a>
                <a
                  href="tel:1800-ZYLORA-1"
                  className="flex items-center gap-2.5 text-slate-400 text-sm hover:text-blue-400 transition-colors duration-200 group"
                >
                  <Phone className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                  1800-ZYLORA-1
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm text-center md:text-left">
                &copy; 2025 Zylora. All rights reserved.
              </p>

              <div className="flex items-center gap-4 text-sm">
                <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors duration-200">
                  Privacy Policy
                </a>
                <span className="text-slate-700">&middot;</span>
                <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors duration-200">
                  Terms of Service
                </a>
                <span className="text-slate-700">&middot;</span>
                <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors duration-200">
                  Cookie Policy
                </a>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <span className="text-slate-500 text-xs tracking-wider uppercase">
                  UPI &middot; Visa &middot; Mastercard &middot; RuPay &middot; NetBanking &middot; COD
                </span>
                <span className="hidden sm:inline text-slate-700">&middot;</span>
                <span className="text-slate-500 text-xs">
                  Made with ❤️ in India
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
