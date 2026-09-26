import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  MapPin
} from 'lucide-react';
import { Product } from '../data/groceryData';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-orange-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 text-stone-500 hover:text-stone-900 hover:bg-white shadow-md flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          
          {/* Left Media Image */}
          <div className="relative aspect-square sm:aspect-auto bg-stone-100 min-h-[260px] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className={`absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${product.badgeColor || 'bg-orange-600 text-white'}`}>
                {product.badge}
              </span>
            )}
          </div>

          {/* Right Product Details */}
          <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Origin & Category */}
              <div className="flex items-center gap-1.5 text-xs text-orange-700">
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="font-bold truncate">{product.origin}</span>
              </div>

              {/* Title */}
              <h3 className="font-outfit font-extrabold text-xl text-stone-900 leading-snug">
                {product.name}
              </h3>

              {/* Price & Rating in INR */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-stone-900 font-outfit tabular-nums">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 line-through tabular-nums">
                      ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-stone-500 font-medium">
                    / {product.unit}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Nutrition Snapshot */}
              <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block mb-1.5">
                  Nutritional Highlights
                </span>
                <div className="grid grid-cols-4 gap-1 text-center text-xs">
                  <div className="bg-white p-1 rounded-md border border-orange-100">
                    <span className="text-[9px] text-stone-500 block">Energy</span>
                    <strong className="text-stone-800 text-[11px]">{product.nutrition.calories}</strong>
                  </div>
                  <div className="bg-white p-1 rounded-md border border-orange-100">
                    <span className="text-[9px] text-stone-500 block">Protein</span>
                    <strong className="text-stone-800 text-[11px]">{product.nutrition.protein}</strong>
                  </div>
                  <div className="bg-white p-1 rounded-md border border-orange-100">
                    <span className="text-[9px] text-stone-500 block">Carbs</span>
                    <strong className="text-stone-800 text-[11px]">{product.nutrition.carbs}</strong>
                  </div>
                  <div className="bg-white p-1 rounded-md border border-orange-100">
                    <span className="text-[9px] text-stone-500 block">Fat</span>
                    <strong className="text-stone-800 text-[11px]">{product.nutrition.fat}</strong>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((t) => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100/70 text-orange-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Stepper & Add to Basket */}
            <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center transition-colors text-xs font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-stone-900 tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-7 h-7 rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center transition-colors text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added {qty} to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>Add to Basket · ₹{product.price * qty}</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
