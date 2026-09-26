import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Users, 
  Flame, 
  ShoppingBag, 
  Check
} from 'lucide-react';
import { RECIPE_BASKET, RecipeIngredient } from '../data/groceryData';

interface RecipeBasketSectionProps {
  onAddIngredientsToCart: (ingredients: RecipeIngredient[]) => void;
}

export const RecipeBasketSection: React.FC<RecipeBasketSectionProps> = ({
  onAddIngredientsToCart,
}) => {
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(RECIPE_BASKET.ingredients);
  const [basketAdded, setBasketAdded] = useState(false);

  const toggleIngredient = (id: string) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, included: !ing.included } : ing))
    );
  };

  const selectedIngredients = ingredients.filter((ing) => ing.included);
  const rawTotal = selectedIngredients.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscount = selectedIngredients.length >= 4 ? Math.round(rawTotal * 0.12) : 0;
  const finalPrice = rawTotal - bundleDiscount;

  const handleAddAll = () => {
    if (selectedIngredients.length === 0) return;
    onAddIngredientsToCart(selectedIngredients);
    setBasketAdded(true);
    setTimeout(() => setBasketAdded(false), 2000);
  };

  return (
    <section id="recipe-basket" className="py-16 bg-[#FFF7ED] border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Chef's Weekly Bharuch Recipe Basket</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-outfit text-stone-900 tracking-tight">
            Dinner Done in 20 Minutes
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            One-click Gujarati dinner kit. Farm-fresh Narmada basin ingredients bundled together with chef's recipe card, saving you 12% on the complete kit.
          </p>
        </div>

        {/* Recipe Main Container */}
        <div className="bg-white rounded-3xl border border-orange-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Hero Card / Meal Preview */}
          <div className="lg:col-span-5 relative bg-stone-900 overflow-hidden flex flex-col justify-end p-6 sm:p-8 text-white min-h-[340px]">
            <img
              src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80"
              alt="Royal Bharuch Paneer Bhurji & Methi Thepla Meal Kit"
              className="absolute inset-0 w-full h-full object-cover opacity-75 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-orange-600/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Bharuch Favorite
                </span>
                <span className="bg-white/20 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  100% Pure Vegetarian
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white leading-tight">
                {RECIPE_BASKET.title}
              </h3>

              {/* Recipe Meta Stats */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/20 text-center">
                <div>
                  <span className="text-stone-300 text-[10px] uppercase font-bold block flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" /> Total
                  </span>
                  <span className="text-sm font-bold text-white">20 Min</span>
                </div>
                <div>
                  <span className="text-stone-300 text-[10px] uppercase font-bold block flex items-center justify-center gap-1">
                    <Users className="w-3 h-3" /> Serves
                  </span>
                  <span className="text-sm font-bold text-white">{RECIPE_BASKET.servings} People</span>
                </div>
                <div>
                  <span className="text-stone-300 text-[10px] uppercase font-bold block flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3" /> Calories
                  </span>
                  <span className="text-sm font-bold text-white">380 kcal</span>
                </div>
              </div>

              {/* Chef Quote */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-xs text-stone-200">
                <p className="italic font-serif-display">
                  "{RECIPE_BASKET.chefQuote}"
                </p>
                <span className="block mt-1 font-bold text-amber-300 text-[11px]">
                  — {RECIPE_BASKET.chefName}
                </span>
              </div>
            </div>
          </div>

          {/* Right Ingredient Checklist & Add-to-Cart Bundle */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h4 className="font-outfit font-bold text-lg text-stone-900">
                  Select Kit Ingredients ({selectedIngredients.length}/{ingredients.length})
                </h4>
                <button
                  onClick={() =>
                    setIngredients((prev) =>
                      prev.map((i) => ({ ...i, included: true }))
                    )
                  }
                  className="text-xs font-semibold text-orange-600 hover:text-orange-800 underline"
                >
                  Select All
                </button>
              </div>

              {/* Ingredients List */}
              <div className="divide-y divide-stone-100 mt-2 space-y-1">
                {ingredients.map((ing) => (
                  <label
                    key={ing.id}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                      ing.included ? 'bg-orange-50/70 hover:bg-orange-50' : 'bg-stone-50/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={ing.included}
                        onChange={() => toggleIngredient(ing.id)}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-stone-300 cursor-pointer"
                      />
                      <img
                        src={ing.image}
                        alt={ing.name}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200"
                      />
                      <div>
                        <span className="font-semibold text-sm text-stone-900 block leading-snug">
                          {ing.name}
                        </span>
                        <span className="text-xs text-stone-500">
                          Portion: {ing.amount}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-stone-900 tabular-nums">
                      ₹{ing.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bundle Checkout Bar */}
            <div className="pt-4 border-t border-stone-200 bg-orange-50/60 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-stone-900 font-outfit tabular-nums">
                    ₹{finalPrice}
                  </span>
                  {bundleDiscount > 0 && (
                    <span className="text-sm text-stone-400 line-through tabular-nums">
                      ₹{rawTotal}
                    </span>
                  )}
                  {bundleDiscount > 0 && (
                    <span className="text-xs font-bold text-orange-800 bg-orange-200 px-2 py-0.5 rounded-full">
                      Save ₹{bundleDiscount} (12% Meal Bundle Discount)
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-500">
                  {selectedIngredients.length} fresh items ready for 45-min Bharuch delivery
                </span>
              </div>

              <button
                onClick={handleAddAll}
                disabled={selectedIngredients.length === 0}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                  basketAdded
                    ? 'bg-emerald-600 text-white'
                    : selectedIngredients.length === 0
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg'
                }`}
              >
                {basketAdded ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added {selectedIngredients.length} Items to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add All {selectedIngredients.length} Ingredients</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
