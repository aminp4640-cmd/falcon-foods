import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { CartItem } from './CartDrawer';
import { createOrderInDb, DbUserProfile } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartDetails: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    tip: number;
    discount: number;
    total: number;
    timeSlot: string;
    promoApplied: string | null;
  } | null;
  items: CartItem[];
  currentUser: FirebaseUser | null;
  userProfile: DbUserProfile | null;
  storeName: string;
  onOrderSuccess: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartDetails,
  items,
  currentUser,
  userProfile,
  storeName,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Priya Patel',
    phone: '+91 98250 88219',
    address: 'B-402, Gokul Heights, Zadeshwar Road',
    city: 'Bharuch',
    zip: '392012',
    notes: 'Please ring bell 402 or leave with building security.',
    paymentMethod: 'upi',
  });
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        fullName: userProfile.displayName || prev.fullName,
        phone: userProfile.phone || prev.phone,
        address: userProfile.address || prev.address,
        zip: userProfile.pincode || prev.zip,
      }));
    }
  }, [userProfile]);

  if (!isOpen || !cartDetails) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const generatedOrderNumber = `FC-BH-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrderNumber);

    try {
      await createOrderInDb({
        orderNumber: generatedOrderNumber,
        userId: currentUser ? currentUser.uid : 'guest-shopper',
        customerName: formData.fullName,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        city: formData.city,
        pincode: formData.zip,
        notes: formData.notes,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          unit: i.product.unit,
          image: i.product.image,
        })),
        subtotal: cartDetails.subtotal,
        deliveryFee: cartDetails.deliveryFee,
        tax: cartDetails.tax,
        tip: cartDetails.tip,
        discount: cartDetails.discount,
        total: cartDetails.total,
        paymentMethod: formData.paymentMethod,
        status: 'placed',
        timeSlot: cartDetails.timeSlot,
        storeHub: storeName,
      });
      setStep('success');
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
      // Still show success to user even if offline
      setStep('success');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    onOrderSuccess(orderNumber);
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        onClick={step === 'form' ? onClose : undefined} 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-orange-100 z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {step === 'form' ? (
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-orange-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-outfit font-extrabold text-xl text-stone-900">
                    Express Checkout · Bharuch
                  </h3>
                  <span className="text-xs text-orange-700 font-semibold">
                    Slot: {cartDetails.timeSlot}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-orange-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              
              {/* Recipient Details */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block">
                  1. Delivery Destination in Bharuch
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Mobile (for Rider WhatsApp/SMS)</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Flat / House No. & Street / Society</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">City / Town</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">PIN Code (Bharuch)</label>
                    <input
                      type="text"
                      required
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Rider Instructions (Landmark)</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Payment Method in India */}
              <div className="pt-3 border-t border-stone-200">
                <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block mb-2">
                  2. Select Payment Method
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      formData.paymentMethod === 'upi'
                        ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-orange-600" />
                    <span>UPI (GPay/PhonePe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    <span>RuPay / Cards</span>
                  </button>
                </div>
              </div>

              {/* Order Final Summary in INR */}
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200/80 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{items.reduce((acc, i) => acc + i.quantity, 0)} Items Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">₹{cartDetails.subtotal}</span>
                </div>
                {cartDetails.discount > 0 && (
                  <div className="flex justify-between text-orange-700 font-bold">
                    <span>Special Savings</span>
                    <span className="tabular-nums">-₹{cartDetails.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Express 45-Min Bharuch Delivery</span>
                  <span className="font-semibold tabular-nums">
                    {cartDetails.deliveryFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : `₹${cartDetails.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>GST (5%) & Partner Tip</span>
                  <span className="font-semibold tabular-nums">₹{cartDetails.tax + cartDetails.tip}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-orange-200">
                  <span>Grand Total to Pay</span>
                  <span className="text-orange-700 font-outfit tabular-nums">₹{cartDetails.total}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Place Bharuch Order · ₹{cartDetails.total}</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Shuddh & Fresh Guarantee · Cash or UPI on Arrival</span>
              </div>
            </form>
          </div>
        ) : (
          /* Order Confirmation View */
          <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold text-orange-800 uppercase tracking-widest block mb-1">
                Order Confirmed
              </span>
              <h3 className="font-outfit font-extrabold text-2xl text-stone-900">
                Your Fresh Groceries Are Packed!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
                Order <strong>#{orderNumber}</strong> has been allocated to our personal shopper at <strong>Falcon Foods Zadeshwar Mart, Bharuch</strong>.
              </p>
            </div>

            {/* Tracking Status Card */}
            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200 text-left space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Scheduled Arrival:</span>
                <span className="font-bold text-orange-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {cartDetails.timeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Delivery Address:</span>
                <span className="font-semibold text-stone-800 text-right truncate max-w-[200px]">{formData.address}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Total Payable:</span>
                <span className="font-bold text-orange-700 font-outfit tabular-nums">₹{cartDetails.total}</span>
              </div>

              {/* Progress Steps */}
              <div className="pt-2 border-t border-orange-200">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-stone-500 mb-1">
                  <span className="text-orange-700">1. Fresh Harvest Sorting</span>
                  <span className="text-stone-400">2. Chilled Packing</span>
                  <span className="text-stone-400">3. Out on E-Van</span>
                </div>
                <div className="w-full bg-orange-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-600 h-full rounded-full w-1/3 animate-pulse"></div>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="px-8 py-3 bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-orange-700 transition-colors shadow-md"
            >
              Continue Browsing Falcon Foods Bharuch
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
