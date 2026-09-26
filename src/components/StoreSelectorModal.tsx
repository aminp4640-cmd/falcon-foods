import React from 'react';
import { X, MapPin, Check, Clock, Phone } from 'lucide-react';
import { STORE_LOCATIONS, StoreLocation } from '../data/groceryData';

interface StoreSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStore: StoreLocation;
  onSelectStore: (store: StoreLocation) => void;
}

export const StoreSelectorModal: React.FC<StoreSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedStore,
  onSelectStore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-orange-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-orange-100">
          <div>
            <h3 className="font-outfit font-extrabold text-xl text-stone-900">
              Select Your Falcon Foods Bharuch Hub
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Choose your nearest fulfillment store for live inventory and 45-min home delivery.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-orange-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {STORE_LOCATIONS.map((store) => {
            const isSelected = selectedStore.id === store.id;
            return (
              <div
                key={store.id}
                onClick={() => {
                  onSelectStore(store);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-xs'
                    : 'border-stone-200 hover:border-orange-400 hover:bg-orange-50/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-orange-600 text-white shadow-xs' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-stone-900 font-outfit">
                          {store.name}
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {store.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">{store.address}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-500" />
                          {store.hours}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-stone-700">
                          <Phone className="w-3 h-3 text-orange-500" />
                          {store.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Confirm Store
          </button>
        </div>
      </div>
    </div>
  );
};
