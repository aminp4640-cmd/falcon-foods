import React, { useState } from 'react';
import { 
  Phone, 
  Clock, 
  Check, 
  Sparkles,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOrEmail.length >= 5) {
      setSubscribed(true);
      setPhoneOrEmail('');
    }
  };

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-12 border-t border-orange-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Newsletter & Promo Banner in Orange */}
        <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-800 rounded-3xl p-8 sm:p-10 border border-orange-500/30 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-amber-200 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to Falcon Foods Bharuch
            </span>
            <h3 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white">
              Get ₹100 Off Your First Fresh Grocery Order
            </h3>
            <p className="text-orange-50 text-xs sm:text-sm">
              Subscribe to Bharuch's weekly morning mandi update for fresh arrivals from Narmada farms, festival sweets, and exclusive member discounts.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="Enter WhatsApp mobile or email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white placeholder-orange-100 text-sm focus:outline-hidden focus:bg-white/20 focus:border-amber-300 font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-300 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>₹100 Coupon Sent!</span>
                  </>
                ) : (
                  <>
                    <span>Claim ₹100</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 4 Column Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pt-4">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md">
                F
              </div>
              <span className="font-outfit font-extrabold text-2xl tracking-tight text-white">
                FALCON<span className="text-orange-500">FOODS</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Serving the historic city of Bharuch and Ankleshwar with 100% genuine farm-fresh vegetables, Gir cow dairy, wood-pressed oils, and authentic clay-roasted Bharuch Khari Sing.
            </p>
            <div className="space-y-1.5 text-xs text-stone-400 pt-2">
              <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-orange-500" /> <span>02642-260192 / +91 98250 55522</span></div>
              <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-orange-500" /> <span>7:00 AM - 10:30 PM (Daily Fresh Deliveries)</span></div>
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-orange-500" /> <span>Zadeshwar Road & Station Road, Bharuch, Gujarat 392012</span></div>
            </div>
          </div>

          {/* Column: Departments */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 font-outfit uppercase tracking-wider">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Narmada Basin Desi Sabzi</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Gir Cow A2 Fresh Milk</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Bharuch Salted Khari Sing</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Kachi Ghani Sing Tel</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Artisanal Malai Paneer</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Whole Wheat Pav & Khakhra</a></li>
            </ul>
          </div>

          {/* Column: Customer Support */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 font-outfit uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Track Active Delivery</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Bharuch Delivery Pincodes</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">A2 Glass Bottle Refund Hub</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Instant UPI Refund Policy</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Falcon Fresh+ Bharuch Pass</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Bulk & Society Orders</a></li>
            </ul>
          </div>

          {/* Column: Sustainability */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 font-outfit uppercase tracking-wider">
              Our Soil Promise
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#" className="hover:text-orange-400 transition-colors">45+ Narmada River Farms</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">100% Carbide & Chemical Free</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Electric 2-Hour Delivery Van</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Zero Single-Use Plastic Bags</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">FSSAI License #10723024000189</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Falcon Foods Supermarket Bharuch, Gujarat. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-orange-400 transition-colors">FSSAI Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
