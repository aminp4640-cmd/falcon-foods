import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  Tag, 
  Check, 
  AlertCircle,
  Truck
} from 'lucide-react';
import { Product } from '../data/groceryData';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (cartDetails: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    tip: number;
    discount: number;
    total: number;
    timeSlot: string;
    promoApplied: string | null;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; discountRate: number; fixedDiscount: number } | null>({
    code: 'BHARUCH50',
    discountRate: 0,
    fixedDiscount: 50,
  });
  const [promoError, setPromoError] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<number>(20);
  const [selectedSlot, setSelectedSlot] = useState<string>('Today: 4:00 PM - 6:00 PM (Evening Slot)');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 399.0;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 39;
  
  let discount = 0;
  if (promoApplied) {
    if (promoApplied.fixedDiscount > 0) {
      discount = Math.min(subtotal, promoApplied.fixedDiscount);
    } else if (promoApplied.discountRate > 0) {
      discount = Math.round(subtotal * promoApplied.discountRate);
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const estimatedGst = Math.round(taxableAmount * 0.05); // 5% GST for packaged groceries
  const grandTotal = Math.max(0, taxableAmount + deliveryFee + estimatedGst + selectedTip);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const cleaned = promoInput.trim().toUpperCase();
    if (cleaned === 'BHARUCH50') {
      setPromoApplied({ code: 'BHARUCH50', discountRate: 0, fixedDiscount: 50 });
      setPromoInput('');
    } else if (cleaned === 'NARMADA15') {
      setPromoApplied({ code: 'NARMADA15', discountRate: 0.15, fixedDiscount: 0 });
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try BHARUCH50 or NARMADA15');
    }
  };

  const handleCheckoutClick = () => {
    onProceedToCheckout({
      subtotal,
      deliveryFee,
      tax: estimatedGst,
      tip: selectedTip,
      discount,
      total: grandTotal,
      timeSlot: selectedSlot,
      promoApplied: promoApplied ? promoApplied.code : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-orange-100 flex items-center justify-between bg-orange-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-lg text-stone-900 leading-none">
                  Your Bharuch Basket
                </h3>
                <span className="text-xs text-stone-500">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} fresh item(s) selected
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-orange-50 border-b border-orange-200/60 p-3.5">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-orange-950">
              <span className="flex items-center gap-1.5 font-bold">
                <Truck className="w-4 h-4 text-orange-600" />
                {amountToFreeShipping > 0 ? (
                  <>Add <span className="text-orange-700 font-extrabold">₹{amountToFreeShipping.toFixed(0)}</span> more for FREE delivery in Bharuch!</>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> You unlocked FREE Express Delivery!
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-orange-800 tabular-nums">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full bg-orange-200/70 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Body: Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">Your Basket is Empty</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore fresh Narmada desi sabzi, Gir cow A2 milk, and Bharuch khari sing to fill your basket.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                      {item.product.name}
                    </h5>
                    <span className="text-[11px] text-stone-500 block">
                      {item.product.unit} · ₹{item.product.price}
                    </span>
                    <span className="text-xs font-bold text-orange-700 block mt-0.5 tabular-nums">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-lg p-0.5 shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center transition-colors text-xs font-bold"
                      title="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-stone-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center transition-colors text-xs font-bold"
                      title="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Trash Icon */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-4">
              
              {/* Delivery Window Picker */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-600" /> Bharuch Delivery Slot:
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-hidden focus:border-orange-500 cursor-pointer"
                >
                  <option value="Today: 4:00 PM - 6:00 PM (Evening Slot)">Today: 4:00 PM - 6:00 PM (Next Slot)</option>
                  <option value="Today: 6:30 PM - 8:30 PM (Dinner Express)">Today: 6:30 PM - 8:30 PM (Dinner)</option>
                  <option value="Tomorrow: 7:00 AM - 9:00 AM (Fresh Morning Milk & Sabzi)">Tomorrow: 7:00 AM - 9:00 AM (Morning Fresh)</option>
                </select>
              </div>

              {/* Promo Code Input */}
              <div>
                {promoApplied ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-orange-50 border border-orange-200 text-xs">
                    <span className="font-semibold text-orange-950 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-orange-600" />
                      Code <strong>{promoApplied.code}</strong> applied (-₹{discount})
                    </span>
                    <button
                      onClick={() => setPromoApplied(null)}
                      className="text-stone-500 hover:text-stone-800 text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. BHARUCH50)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs uppercase font-medium placeholder-stone-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {promoError}
                  </p>
                )}
              </div>

              {/* Driver Tip */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">Delivery Partner Tip:</span>
                <div className="flex gap-1.5">
                  {[10, 20, 30, 0].map((tipVal) => (
                    <button
                      key={tipVal}
                      onClick={() => setSelectedTip(tipVal)}
                      className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
                        selectedTip === tipVal
                          ? 'bg-orange-600 text-white'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {tipVal === 0 ? 'None' : `₹${tipVal}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown in INR */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-orange-600 font-semibold">
                    <span>Special Savings ({promoApplied?.code})</span>
                    <span className="tabular-nums">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="tabular-nums font-semibold">
                    {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="tabular-nums font-semibold">₹{estimatedGst}</span>
                </div>
                {selectedTip > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Partner Tip</span>
                    <span className="tabular-nums font-semibold">₹{selectedTip}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-orange-700 font-outfit tabular-nums">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
