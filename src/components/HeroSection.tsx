import React, { useState } from 'react';
import { 
  Truck, 
  Leaf, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Sparkles,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

interface HeroSectionProps {
  onShopProduce: () => void;
  onExploreDeals: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopProduce,
  onExploreDeals,
}) => {
  const [pincode, setPincode] = useState('392012');
  const [checkedDelivery, setCheckedDelivery] = useState(true);

  const BHARUCH_PINCODES = ['392001', '392002', '392011', '392012', '392020', '393001', '393002'];

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length >= 6) {
      setCheckedDelivery(true);
    }
  };

  const isDeliverable = BHARUCH_PINCODES.includes(pincode.trim()) || pincode.startsWith('392');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#C2410C] via-[#EA580C] to-[#9A3412] text-white">
      {/* Background Subtle Organic Warm Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="leaf-pattern-orange" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 5 C10 15 10 25 20 35 C30 25 30 15 20 5 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#leaf-pattern-orange)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Description & Interactive Pincode Delivery Checker */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-950/40 border border-orange-300/30 text-xs font-bold text-amber-200 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Narmada Valley Harvest In Today · Sourced Within 50 KM of Bharuch</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-outfit text-white leading-tight">
              Narmada Basin Fresh, <br className="hidden sm:inline" />
              <span className="text-amber-200 font-serif-display italic font-normal">
                Straight to Your Bharuch Kitchen.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-orange-50 max-w-xl font-normal leading-relaxed">
              Dew-fresh desi sabzi, pure Gir cow A2 milk in returnable glass bottles, stone-crushed Sing Tel, and authentic clay-roasted Bharuch Khari Sing. Delivered chilled to your doorstep in 45 to 90 minutes.
            </p>

            {/* Interactive Bharuch Pincode Delivery Window Checker */}
            <div className="bg-black/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 max-w-lg shadow-xl">
              <form onSubmit={handleCheckPincode} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-amber-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter Bharuch PIN (e.g. 392012, 392001)"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-stone-900 rounded-xl text-sm font-semibold placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-300 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
                >
                  <span>Check Slots</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {checkedDelivery && (
                <div className="mt-3 pt-3 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-orange-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isDeliverable ? 'bg-emerald-400' : 'bg-amber-300'} animate-pulse`}></span>
                    <span>
                      {isDeliverable ? (
                        <>Delivering to <strong className="text-white">{pincode} (Bharuch Metro Area)</strong></>
                      ) : (
                        <>Servicing Pincode <strong>{pincode}</strong> via Express van</>
                      )}
                    </span>
                  </div>
                  <span className="text-amber-200 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-300" /> Slot: <strong>Today 4:00 - 6:00 PM</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onShopProduce}
                className="px-6 py-3.5 bg-white text-orange-800 hover:bg-orange-50 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>Shop Fresh Sabzi & Fruits</span>
              </button>
              <button
                onClick={onExploreDeals}
                className="px-6 py-3.5 bg-orange-950/40 hover:bg-orange-950/60 text-white font-semibold text-sm rounded-xl border border-orange-300/40 transition-all flex items-center gap-2"
              >
                <span>Browse Bharuch Specials (Up to 30% Off)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-4/3 sm:aspect-16/10 bg-orange-950">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                  alt="Falcon Foods Bharuch organic fresh produce market"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300 block">
                      Narmada River Valley
                    </span>
                    <span className="text-sm font-bold">
                      Picked 05:30 AM · Shuklatirth & Zadeshwar Farms
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-mono text-amber-200">
                    Fresh Today
                  </span>
                </div>
              </div>

              {/* Floating Stat Card 1: 45-Min Express */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white text-stone-900 p-3.5 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3 animate-fade-in max-w-[220px]">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-stone-900 block leading-tight">45-90 Min Express</span>
                  <span className="text-[11px] text-stone-600 block leading-tight">Fast delivery across Zadeshwar, Bholav & Station Rd</span>
                </div>
              </div>

              {/* Floating Stat Card 2: 4.9 Stars */}
              <div className="absolute -top-4 -right-3 sm:-right-4 bg-white text-stone-900 py-2.5 px-3.5 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-2.5">
                <div className="flex text-amber-500 font-bold">
                  {'★'.repeat(5)}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block leading-tight text-stone-900">4.9 / 5.0</span>
                  <span className="text-[10px] text-stone-500 block">18,500+ Bharuch Homes</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Trust Pillars */}
        <div className="mt-14 pt-8 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Shuddh & Fresh</h4>
              <p className="text-xs text-orange-100">Chemical & carbide free</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Choose Delivery Slot</h4>
              <p className="text-xs text-orange-100">Morning & evening windows</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fresh-or-Refund</h4>
              <p className="text-xs text-orange-100">Instant UPI/Cash refund</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Local Gujarat Farmers</h4>
              <p className="text-xs text-orange-100">Fair price directly to farmers</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
