import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  User, 
  ChevronDown, 
  Sparkles, 
  Phone, 
  X,
  Code2,
  Package
} from 'lucide-react';
import { StoreLocation } from '../data/groceryData';
import { User as FirebaseUser } from 'firebase/auth';
import { DbUserProfile } from '../lib/firebase';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  ordersCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenAuth: () => void;
  currentUser: FirebaseUser | null;
  userProfile: DbUserProfile | null;
  selectedStore: StoreLocation;
  onOpenStoreModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: any) => void;
  onOpenCodeExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  ordersCount,
  onOpenCart,
  onOpenOrders,
  onOpenAuth,
  currentUser,
  userProfile,
  selectedStore,
  onOpenStoreModal,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenCodeExport,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-orange-100">
      {/* Top Announcement Bar */}
      {!announcementDismissed && (
        <div className="bg-[#C2410C] text-orange-50 text-xs py-2 px-4 transition-all border-b border-orange-700/40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="bg-[#9A3412] text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> Bharuch Express
              </span>
              <p className="truncate">
                Free 2-Hour Delivery across Bharuch on orders over <strong className="text-white font-semibold">₹399</strong> · Order before <span className="font-semibold text-amber-200">5:00 PM</span> for dinner delivery!
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 shrink-0 text-orange-100">
              <button 
                onClick={onOpenCodeExport}
                className="hover:text-white transition-colors underline decoration-dotted text-xs flex items-center gap-1 text-amber-200 font-medium"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code Export (HTML)</span>
              </button>
              <span className="text-orange-400/60">|</span>
              <a href="tel:02642260192" className="hover:text-white transition-colors flex items-center gap-1 font-medium">
                <Phone className="w-3 h-3" /> 02642-260192
              </a>
              <span className="text-orange-400/60">|</span>
              <button 
                onClick={() => setAnnouncementDismissed(true)} 
                className="hover:text-white p-0.5 text-orange-200 hover:bg-[#9A3412] rounded transition-colors"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
          
          {/* Zone 1: Brand Wordmark & Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-all">
                {/* Stylized Falcon & Fresh Leaf mark */}
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-2xl tracking-tight text-stone-900 leading-none">
                  FALCON<span className="text-orange-600">FOODS</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-orange-700 mt-0.5 flex items-center gap-1">
                  <span>Bharuch Supermarket</span>
                  <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                  <span className="text-stone-500 font-medium">ભરૂચ</span>
                </span>
              </div>
            </a>
          </div>

          {/* Store Location Selector Pill for Bharuch */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={onOpenStoreModal}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50/60 hover:bg-orange-50 hover:border-orange-400 hover:shadow-xs text-left transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-xs">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col pr-1">
                <span className="text-[10px] uppercase font-bold text-orange-800 tracking-wider">Bharuch Hub</span>
                <span className="text-xs font-bold text-stone-800 group-hover:text-orange-700 truncate max-w-[140px]">
                  {selectedStore.name}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-orange-500 group-hover:text-orange-700" />
            </button>
          </div>

          {/* Zone 2: Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search fresh sabzi, A2 milk, Bharuch khari sing, paneer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-stone-100/90 border border-stone-200 rounded-xl text-sm placeholder-stone-400 focus:outline-hidden focus:bg-white focus:border-orange-500 focus:ring-3 focus:ring-orange-500/15 transition-all font-medium text-stone-800"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 text-stone-400 hover:text-stone-600 p-1 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button 
                onClick={() => {}}
                className="absolute right-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Search
              </button>
            </div>
          </div>

          {/* Zone 3: Actions (Wishlist, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wishlist */}
            <button 
              className="relative p-2.5 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors hidden sm:flex items-center justify-center"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Orders Tracking Button */}
            <button
              onClick={onOpenOrders}
              className="relative p-2.5 text-stone-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors hidden sm:flex items-center gap-1.5 font-semibold text-xs border border-stone-200"
              title="Track live orders"
            >
              <Package className="w-4 h-4 text-orange-600" />
              <span>Orders</span>
              {ordersCount > 0 && (
                <span className="w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {ordersCount}
                </span>
              )}
            </button>

            {/* Account Quick Link */}
            <div className="hidden sm:flex items-center">
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-xl transition-colors text-stone-700"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">
                  {currentUser ? (userProfile?.displayName?.[0] || 'U') : <User className="w-4 h-4" />}
                </div>
                <div className="text-left hidden xl:block">
                  <span className="text-[11px] text-stone-500 block leading-tight">
                    {currentUser ? 'Hi, ' + (userProfile?.displayName?.split(' ')[0] || 'Shopper') : 'Welcome to Bharuch'}
                  </span>
                  <span className="text-xs font-bold text-stone-900 block leading-tight">
                    {currentUser ? 'My Account' : 'Sign In / Join'}
                  </span>
                </div>
              </button>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white pl-3.5 pr-4 py-2.5 rounded-xl font-medium shadow-md shadow-orange-600/20 transition-all group active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-300 text-stone-900 text-[11px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-orange-200 uppercase tracking-wider font-semibold">Your Basket</span>
                <span className="text-xs font-bold text-white tabular-nums">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search sabzi, A2 milk, khari sing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 bg-stone-100 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-hidden focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Category Sub-Navbar */}
      <nav className="border-t border-orange-100 bg-orange-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 scrollbar-none">
            
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-stone-700 hover:text-orange-700 hover:bg-orange-100/60'
              }`}
            >
              <span>All Bharuch Aisles</span>
            </button>

            <button
              onClick={() => setSelectedCategory('produce')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === 'produce'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-700 hover:text-orange-700 hover:bg-orange-100/60'
              }`}
            >
              Fresh Farm Sabzi & Fruits
            </button>

            <button
              onClick={() => setSelectedCategory('dairy-eggs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === 'dairy-eggs'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-700 hover:text-orange-700 hover:bg-orange-100/60'
              }`}
            >
              Gir Cow A2 Milk & Paneer
            </button>

            <button
              onClick={() => setSelectedCategory('pantry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === 'pantry'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-700 hover:text-orange-700 hover:bg-orange-100/60'
              }`}
            >
              Bharuch Khari Sing & Sing Tel
            </button>

            <button
              onClick={() => setSelectedCategory('bakery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === 'bakery'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-700 hover:text-orange-700 hover:bg-orange-100/60'
              }`}
            >
              Fresh Pav & Khakhra Bakery
            </button>

            <button
              onClick={() => setSelectedCategory('beverages')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === 'beverages'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-700 hover:text-orange-700 hover:bg-orange-100/60'
              }`}
            >
              Tender Coconut & Masala Chaas
            </button>

            <div className="h-4 w-px bg-orange-200 shrink-0"></div>

            <a
              href="#recipe-basket"
              className="px-3 py-1.5 text-xs font-semibold text-orange-800 hover:text-orange-950 flex items-center gap-1 shrink-0 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors border border-orange-200"
            >
              <Sparkles className="w-3 h-3 text-orange-600" />
              <span>Dinner Meal Kit (Paneer Bhurji)</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};
