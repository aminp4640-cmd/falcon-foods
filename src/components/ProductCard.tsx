import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Heart, 
  Eye, 
  Check, 
  Star, 
  Leaf
} from 'lucide-react';
import { Product } from '../data/groceryData';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200 hover:border-orange-400/80 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden">
      
      {/* Top Media Area */}
      <div className="relative aspect-4/3 sm:aspect-square bg-stone-50 overflow-hidden">
        
        {/* Badges / Indicators */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs ${product.badgeColor || 'bg-orange-600 text-white'}`}>
              {product.badge}
            </span>
          )}
          {product.organic && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 backdrop-blur-xs">
              <Leaf className="w-2.5 h-2.5" /> 100% Shuddh
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'bg-white/90 backdrop-blur-xs text-stone-400 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image or Fallback */}
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-orange-50/50 text-orange-900">
            <Leaf className="w-10 h-10 text-orange-600 mb-1" />
            <span className="text-xs font-semibold text-center">{product.name}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}

        {/* Quick View Hover Trigger */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-x-4 bottom-3 py-2 bg-white/95 backdrop-blur-md text-stone-900 text-xs font-bold rounded-xl shadow-md opacity-0 group-hover:opacity-100 hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Farm Origin / Location Metadata */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="truncate max-w-[170px] text-orange-800 font-semibold">
              {product.origin}
            </span>
            <div className="flex items-center gap-1 shrink-0 text-amber-600 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-outfit font-bold text-sm sm:text-base text-stone-900 group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          {/* Unit Spec */}
          <p className="text-xs text-stone-600 mt-0.5 font-medium">
            {product.unit}
          </p>
        </div>

        {/* Price & Action Area with INR Currency */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          
          {/* Price lockup in INR */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-stone-900 tabular-nums">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-[10px] font-bold text-emerald-700">
                Save ₹{product.originalPrice - product.price} ({(Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100))}% OFF)
              </span>
            )}
          </div>

          {/* Cart Stepper or Add Button */}
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-xl p-0.5">
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                className="w-7 h-7 rounded-lg bg-white text-stone-800 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors shadow-xs active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-stone-900 tabular-nums">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                className="w-7 h-7 rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center transition-colors shadow-xs active:scale-95"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 shrink-0 ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-md'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
