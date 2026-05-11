'use client';

import { Zap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-amber-500 rounded-lg p-1.5">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Z <span className="text-amber-400">Shop</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              India&apos;s favourite online shopping destination. Quality products at the best prices with fast delivery across the country.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">About Us</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Contact Us</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Careers</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Sell on Z Shop</span></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Return Policy</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Terms of Use</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-amber-400 cursor-pointer transition-colors">Shipping Info</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                support@zshop.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                1800-123-4567 (Toll Free)
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                Z Shop HQ, Bengaluru, Karnataka 560001
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700 text-center text-sm text-slate-500">
          <p>© 2025 Z Shop. All rights reserved. | Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
