import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowUpDown, 
  Search, 
  Leaf, 
  Check, 
  Star, 
  ArrowRight,
  Package,
  User as UserIcon
} from 'lucide-react';
import { 
  PRODUCTS, 
  Product, 
  STORE_LOCATIONS, 
  StoreLocation, 
  CUSTOMER_REVIEWS, 
  RecipeIngredient 
} from './data/groceryData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { RecipeBasketSection } from './components/RecipeBasketSection';
import { FarmStorySection } from './components/FarmStorySection';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { StoreSelectorModal } from './components/StoreSelectorModal';
import { CheckoutModal } from './components/CheckoutModal';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { AuthModal } from './components/AuthModal';
import { OrdersModal } from './components/OrdersModal';
import { Footer } from './components/Footer';
import { 
  auth, 
  testFirebaseConnection, 
  seedProductsIfEmpty, 
  getUserProfile, 
  subscribeToAllOrders, 
  DbOrder, 
  DbUserProfile 
} from './lib/firebase';
import { 
  isSupabaseConfigured, 
  testSupabaseConnection, 
  subscribeToSupabaseOrders 
} from './lib/supabase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  // Navigation & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [dealsOnly, setDealsOnly] = useState<boolean>(false);

  // Store selection
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORE_LOCATIONS[0]);
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-2']);

  // Cart State (Initialized with authentic Bharuch staples)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 2 }, // Desi Tomatoes
    { product: PRODUCTS[1], quantity: 1 }, // Bharuch Salted Peanuts
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Backend Firebase Auth & Orders State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<DbUserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<DbOrder[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState<any>(null);
  const [isCodeExportOpen, setIsCodeExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initialize and verify backend database connection on boot
  useEffect(() => {
    testFirebaseConnection();
    if (isSupabaseConfigured) {
      testSupabaseConnection().then((res) => {
        console.log('[Supabase Connection]', res.message);
        if (res.connected) {
          showToast('⚡ Connected to Supabase PostgreSQL database');
        }
      });
    }
    seedProductsIfEmpty();
  }, []);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronization for orders (Supabase when configured, otherwise Firestore)
  useEffect(() => {
    if (isSupabaseConfigured) {
      const unsubSupabase = subscribeToSupabaseOrders((supabaseOrders) => {
        if (supabaseOrders && supabaseOrders.length > 0) {
          setUserOrders(supabaseOrders);
        }
      });
      // Also listen to Firestore as fallback
      const unsubFirestore = subscribeToAllOrders((allOrders) => {
        if (!userOrders.length) {
          setUserOrders(allOrders);
        }
      });
      return () => {
        unsubSupabase();
        unsubFirestore();
      };
    } else {
      const unsubscribe = subscribeToAllOrders((allOrders) => {
        setUserOrders(allOrders);
      });
      return () => unsubscribe();
    }
  }, []);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x ${product.name} to basket`);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Item removed from saved list');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved item to your favorites');
        return [...prev, productId];
      }
    });
  };

  // Add Recipe Basket Ingredients to Cart
  const handleAddRecipeIngredients = (ingredients: RecipeIngredient[]) => {
    ingredients.forEach((ing) => {
      const existingProd = PRODUCTS.find((p) => p.name.includes(ing.name.split(' ')[0])) || {
        id: `recipe-${ing.id}`,
        name: ing.name,
        category: 'produce' as const,
        categoryLabel: 'Fresh Harvest',
        price: ing.price,
        unit: ing.amount,
        rating: 5.0,
        reviewsCount: 42,
        origin: 'Falcon Fresh Bharuch Kit',
        image: ing.image,
        description: 'Fresh ingredient component of Chef Paneer Bhurji Recipe',
        nutrition: { calories: '80 kcal', protein: '2g', carbs: '5g', fat: '1g' },
        organic: true,
        inStock: true,
        stockCount: 50,
        tags: ['Recipe Kit'],
      };
      handleAddToCart(existingProd, 1);
    });
    setIsCartOpen(true);
  };

  const handleProceedToCheckout = (details: any) => {
    setCheckoutDetails(details);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderNumber: string) => {
    setCartItems([]);
    showToast(`Order #${orderNumber} placed! Live tracking active.`);
    setIsOrdersOpen(true);
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (organicOnly && !p.organic) {
        return false;
      }
      if (dealsOnly && !p.originalPrice) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesOrigin = p.origin.toLowerCase().includes(query);
        const matchesCategory = p.categoryLabel.toLowerCase().includes(query);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(query));
        return matchesName || matchesOrigin || matchesCategory || matchesTags;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'featured' order
    });
  }, [selectedCategory, searchQuery, sortBy, organicOnly, dealsOnly]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E293B]">
      
      {/* Toast Notification in Orange Theme */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C2410C] text-white px-4 py-3 rounded-2xl shadow-2xl border border-orange-500/40 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-5 h-5 rounded-full bg-amber-300 text-stone-900 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        ordersCount={userOrders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        userProfile={userProfile}
        selectedStore={selectedStore}
        onOpenStoreModal={() => setStoreModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenCodeExport={() => setIsCodeExportOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        onShopProduce={() => {
          setSelectedCategory('produce');
          const element = document.getElementById('catalog-section');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreDeals={() => {
          setDealsOnly(true);
          const element = document.getElementById('catalog-section');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Category Navigation Showcase */}
      <CategoryNav
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const element = document.getElementById('catalog-section');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog & Deals Section */}
      <main id="catalog-section" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        
        {/* Controls Bar: Category Title, Filter Chips, Sort Dropdown */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-orange-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-widest">
              <span>{filteredProducts.length} Items Available</span>
              <span>·</span>
              <span>Hub: {selectedStore.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-stone-900 mt-1 capitalize">
              {selectedCategory === 'all'
                ? 'Bharuch Daily Mandi Specials & Fresh Arrivals'
                : `${selectedCategory.replace('-', ' ')} in Bharuch`}
            </h2>
          </div>

          {/* Filter Pills and Sort Bar in Orange Theme */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Organic filter toggle */}
            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                organicOnly
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-orange-50'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>100% Shuddh</span>
            </button>

            {/* Deals filter toggle */}
            <button
              onClick={() => setDealsOnly(!dealsOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                dealsOnly
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-orange-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Weekly Specials</span>
            </button>

            {/* Reset Filters if Active */}
            {(organicOnly || dealsOnly || searchQuery) && (
              <button
                onClick={() => {
                  setOrganicOnly(false);
                  setDealsOnly(false);
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-orange-600 hover:text-orange-800 underline px-1 font-semibold"
              >
                Reset Filters
              </button>
            )}

            {/* Sort selector */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="font-semibold text-stone-700 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-orange-100 p-8 space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400 mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-outfit font-bold text-lg text-stone-900">
              No matching groceries found
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              We couldn't find items matching "{searchQuery}". Try searching for tamatar, paneer, A2 milk, khari sing, or clear active filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOrganicOnly(false);
                setDealsOnly(false);
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 shadow-xs"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const inCart = cartItems.find((i) => i.product.id === product.id)?.quantity || 0;
              const isWish = wishlist.includes(product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={inCart}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  isWishlisted={isWish}
                  onToggleWishlist={handleToggleWishlist}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Chef's Weekly Recipe Basket Meal Kit Feature */}
      <RecipeBasketSection onAddIngredientsToCart={handleAddRecipeIngredients} />

      {/* Farm Sourcing & Values Section */}
      <FarmStorySection />

      {/* Customer Community Reviews Section for Bharuch */}
      <section className="py-16 bg-orange-50/40 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>4.9 / 5.0 Average Customer Rating</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-stone-900 tracking-tight">
              Loved by 18,500+ Bharuch & Ankleshwar Homes
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              See what your neighbors in Zadeshwar, Bholav, GNFC Township, and Station Road say about our 45-min fresh deliveries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <span className="text-[11px] text-stone-400">{rev.date}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-orange-200"
                  />
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                      {rev.author}
                    </h5>
                    <span className="text-[11px] text-stone-500 block leading-tight">
                      {rev.location} · <span className="text-orange-700 font-semibold">Verified Resident</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Falcon Fresh+ Membership Promo Banner */}
      <section className="py-12 bg-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-800 rounded-3xl p-8 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 max-w-xl text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-300 text-stone-950 text-xs font-extrabold uppercase tracking-wider">
                Falcon Fresh+ Bharuch Pass
              </span>
              <h3 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                Never Pay for Grocery Delivery in Bharuch Again
              </h3>
              <p className="text-orange-50 text-xs sm:text-sm leading-relaxed">
                Unlimited free 45-min express deliveries on orders over ₹249, 5% cashback on all organic produce, and priority slots during Diwali, Uttarayan & festival seasons.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => showToast('Falcon Fresh+ 30-Day Free Trial activated for Bharuch!')}
                className="px-6 py-3.5 bg-amber-300 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Start 30-Day Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-orange-200">
                Then ₹99/month · Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Quick View Product Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Store Selector Modal */}
      <StoreSelectorModal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        selectedStore={selectedStore}
        onSelectStore={(store) => {
          setSelectedStore(store);
          showToast(`Bharuch store updated to ${store.name}`);
        }}
      />

      {/* Checkout Modal with Live Backend Persistence */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartDetails={checkoutDetails}
        items={cartItems}
        currentUser={currentUser}
        userProfile={userProfile}
        storeName={selectedStore.name}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Standalone Code Export Modal */}
      <StandaloneExportModal
        isOpen={isCodeExportOpen}
        onClose={() => setIsCodeExportOpen(false)}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        userProfile={userProfile}
        onAuthSuccess={(msg) => showToast(msg)}
      />

      {/* Real-time Orders Tracking Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={userOrders}
        isAdmin={userProfile?.role === 'admin'}
      />

    </div>
  );
}
