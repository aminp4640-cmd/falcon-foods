import React from 'react';
import { 
  X, 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  ShoppingBag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DbOrder, updateOrderStatus } from '../lib/firebase';
import { isSupabaseConfigured } from '../lib/supabase';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: DbOrder[];
  isAdmin?: boolean;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  isAdmin = false,
}) => {
  if (!isOpen) return null;

  const STATUS_STEPS = [
    { key: 'placed', label: 'Placed' },
    { key: 'shopping', label: 'Harvest Sorting' },
    { key: 'chilled_packing', label: 'Chilled Packing' },
    { key: 'out_for_delivery', label: 'Out on Van' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStepIndex = (status: DbOrder['status']) => {
    switch (status) {
      case 'placed': return 0;
      case 'shopping': return 1;
      case 'chilled_packing': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const handleNextStatus = async (orderId: string, currentStatus: DbOrder['status']) => {
    const nextMap: Record<DbOrder['status'], DbOrder['status']> = {
      placed: 'shopping',
      shopping: 'chilled_packing',
      chilled_packing: 'out_for_delivery',
      out_for_delivery: 'delivered',
      delivered: 'delivered',
      cancelled: 'cancelled',
    };
    await updateOrderStatus(orderId, nextMap[currentStatus]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-orange-100 z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-orange-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-outfit font-extrabold text-xl text-stone-900">
                Your Bharuch Orders ({orders.length})
              </h3>
              <p className="text-xs text-orange-700 font-semibold">
                Live Real-Time Status & Tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-orange-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400 mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-stone-900 text-base">No active orders yet</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Place your first fresh grocery order for Narmada sabzi, Gir cow A2 milk, or Bharuch khari sing to track live delivery here!
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const currentStep = getStepIndex(order.status);
              return (
                <div 
                  key={order.id || order.orderNumber}
                  className="bg-orange-50/40 rounded-2xl border border-orange-200/80 p-4 sm:p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-orange-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-orange-700 uppercase tracking-widest block">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-xs font-bold text-stone-900">
                        {order.storeHub || 'Falcon Foods Zadeshwar Mart'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-orange-700 tabular-nums">
                        ₹{order.total}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Status Progress Stepper */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase text-stone-500 mb-1">
                      {STATUS_STEPS.map((step, idx) => (
                        <span 
                          key={step.key} 
                          className={idx <= currentStep ? 'text-orange-700 font-extrabold' : 'text-stone-400'}
                        >
                          {step.label}
                        </span>
                      ))}
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-orange-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(10, ((currentStep + 1) / STATUS_STEPS.length) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Delivery & Items details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 pt-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                      <span className="truncate">{order.deliveryAddress}, {order.city} ({order.pincode})</span>
                    </div>
                    <div className="flex items-start gap-1.5 sm:justify-end">
                      <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                      <span>{order.timeSlot}</span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="pt-2 border-t border-orange-200/50 flex flex-wrap gap-2 items-center">
                    {order.items.slice(0, 4).map((it) => (
                      <span key={it.id} className="text-[11px] bg-white px-2 py-1 rounded-md border border-stone-200 text-stone-800 font-medium">
                        {it.name} (x{it.quantity})
                      </span>
                    ))}
                    {order.items.length > 4 && (
                      <span className="text-[11px] text-stone-500">
                        +{order.items.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Store Dispatch Simulator (Allows user / manager to advance status live) */}
                  {order.id && order.status !== 'delivered' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleNextStatus(order.id!, order.status)}
                        className="text-[11px] font-bold text-orange-700 hover:text-orange-900 bg-orange-100/80 hover:bg-orange-200 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>Simulate Rider Dispatch (Next Step)</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-orange-100 flex items-center justify-between">
          <span className="text-xs text-stone-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {isSupabaseConfigured 
              ? 'Real-time Supabase (PostgreSQL) Connected' 
              : 'Real-time Firestore Database Connected'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
