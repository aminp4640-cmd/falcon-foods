import React from 'react';
import { 
  Leaf, 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const FarmStorySection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-orange-100 aspect-4/3 sm:aspect-16/11 bg-orange-950">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
                alt="Falcon Foods local organic farmer in Bharuch Gujarat"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300 block mb-1">
                  Narmada River Valley Partner Farms
                </span>
                <p className="text-lg font-bold font-outfit leading-snug">
                  "Falcon Foods pays us upfront within 24 hours and brings our morning-plucked sabzi directly to Bharuch dining tables by noon."
                </p>
                <span className="text-xs text-orange-200 block mt-2 font-medium">
                  — Rameshbhai Patel, 3rd Generation Farmer, Shuklatirth, Bharuch
                </span>
              </div>
            </div>

            {/* Overlapping Trust Pill */}
            <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-gradient-to-br from-orange-600 to-orange-700 text-white p-4 rounded-2xl shadow-xl border border-orange-400/40 max-w-[240px] hidden sm:block">
              <div className="flex items-center gap-2 mb-1 text-amber-200">
                <HeartHandshake className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Farmer First</span>
              </div>
              <p className="text-xs text-orange-50 leading-snug">
                <strong>85%</strong> of every rupee spent goes directly to local Bharuch & Narmada growers.
              </p>
            </div>
          </div>

          {/* Right Column: Values & Commitments */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-bold uppercase tracking-wider border border-orange-200">
              <Leaf className="w-3.5 h-3.5 text-orange-600" />
              <span>Narmada River Basin Soil</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-stone-900 tracking-tight leading-tight">
              Why Falcon Foods Tastes Noticeably Fresher in Bharuch
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Wholesale mandis and old cold storages keep produce sitting in chemical chambers for days. Falcon Foods operates a direct 24-hour cycle: vegetables are hand-picked at dawn along the Narmada banks, sorted at our Zadeshwar hub, and delivered to your home before lunch.
            </p>

            {/* Value Highlights */}
            <div className="space-y-4 pt-2">
              
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-orange-50/50 hover:bg-orange-50 transition-colors border border-orange-100">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Chilled Delivery Across Bharuch & Ankleshwar</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Our electric delivery fleet covers Zadeshwar, Bholav, GNFC Township, Station Road, and Dahej Link Road in air-cooled boxes so your greens never wilt.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-orange-50/50 hover:bg-orange-50 transition-colors border border-orange-100">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">A2 Gir Cow Milk Glass Bottle Return Loop</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Leave your rinsed glass milk bottles on your doorstep. Our courier swaps them for a fresh batch and credits ₹10 back to your Falcon wallet. Zero plastic pouches!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-orange-50/50 hover:bg-orange-50 transition-colors border border-orange-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Instant UPI & Cash Fresh-or-Refund Guarantee</h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    If any tomato or fruit isn't perfectly ripe, tap 'Report Issue' or WhatsApp our Bharuch support desk for an immediate UPI refund.
                  </p>
                </div>
              </div>

            </div>

            {/* Certifications Row */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-6 text-stone-500">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Certified By:</span>
              <div className="flex items-center gap-4 text-xs font-semibold text-stone-700">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-orange-600" /> FSSAI Licensed</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-orange-600" /> Gujarat Organic Mission</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-orange-600" /> Jaivik Bharat</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
