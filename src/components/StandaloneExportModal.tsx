import React, { useState } from 'react';
import { X, Copy, Check, Code2 } from 'lucide-react';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Falcon Foods Supermarket Bharuch - Fresh Sabzi, A2 Dairy & Daily Groceries</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,500;0,700;1,500&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            orange: {
              50: '#FFF7ED',
              100: '#FFEDD5',
              200: '#FED7AA',
              500: '#F97316',
              600: '#EA580C',
              700: '#C2410C',
              800: '#9A3412',
              900: '#7C2D12',
              950: '#431407'
            }
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            outfit: ['Outfit', 'sans-serif'],
            serif: ['Fraunces', 'serif']
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#F8F9FA] text-[#1E293B] antialiased">
  <!-- Top Utility Bar -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100">
    <div class="bg-[#C2410C] text-orange-50 text-xs py-2 px-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <p class="truncate">
          ✨ Free 2-Hour Delivery across Bharuch on orders over <strong class="text-white">₹399</strong> · Narmada Valley Fresh Sourcing
        </p>
        <div class="flex items-center gap-4 text-orange-100">
          <span>Call 02642-260192</span>
        </div>
      </div>
    </div>
    <!-- Main Nav -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
      <a href="#" class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
          F
        </div>
        <div class="flex flex-col">
          <span class="font-outfit font-extrabold text-2xl tracking-tight text-stone-900 leading-none">FALCON<span class="text-orange-600">FOODS</span></span>
          <span class="text-[10px] uppercase font-bold text-orange-700 tracking-wider">Bharuch Supermarket · ભરૂચ</span>
        </div>
      </a>
      <div class="flex-1 max-w-lg hidden md:block">
        <input type="text" placeholder="Search Narmada desi tamatar, Gir cow A2 milk, Bharuch khari sing..." class="w-full px-4 py-2 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-500">
      </div>
      <div class="flex items-center gap-4">
        <button id="cartBtn" class="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md">
          <span>Basket (<span id="cartCount">0</span>)</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="bg-gradient-to-b from-[#C2410C] via-[#EA580C] to-[#9A3412] text-white py-16 px-4">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div class="space-y-6">
        <span class="bg-orange-950/40 text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase">Narmada Valley Harvest In Today</span>
        <h1 class="text-4xl sm:text-5xl font-extrabold font-outfit leading-tight">Fresh From Narmada Soil, <br><span class="font-serif italic text-amber-200 font-normal">Straight to Your Bharuch Kitchen.</span></h1>
        <p class="text-orange-100 text-sm sm:text-base">Handpicked desi sabzi, pure Gir cow A2 milk in returnable glass bottles, stone-crushed Sing Tel, and authentic clay-roasted Bharuch Khari Sing.</p>
        <button class="px-6 py-3 bg-amber-300 text-stone-950 font-bold rounded-xl shadow-lg">Shop Bharuch Harvest</button>
      </div>
      <div class="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-video bg-orange-950">
        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&fit=crop" alt="Bharuch Fresh Groceries" class="w-full h-full object-cover">
      </div>
    </div>
  </section>

  <!-- Product Catalog -->
  <main class="max-w-7xl mx-auto px-4 py-12">
    <h2 class="text-2xl font-bold font-outfit text-stone-900 mb-6">Bharuch Specials & Daily Sabzi</h2>
    <div id="productGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
  </main>

  <script>
    const products = [
      { id: '1', name: 'Narmada Valley Desi Tomatoes', price: 38, unit: '1 kg pack', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500' },
      { id: '2', name: 'Bharuch Salted Peanuts (Khari Sing)', price: 180, unit: '500g pack', image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=500' },
      { id: '3', name: 'Gir Cow Pure A2 Fresh Milk', price: 75, unit: '1 Litre bottle', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500' },
      { id: '4', name: 'Fresh Malai Paneer Block', price: 135, unit: '250g pack', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500' }
    ];

    let cartCount = 0;
    const grid = document.getElementById('productGrid');
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between';
      card.innerHTML = \`
        <div class="aspect-square bg-stone-100 overflow-hidden">
          <img src="\${p.image}" class="w-full h-full object-cover hover:scale-105 transition-all">
        </div>
        <div class="p-4 flex flex-col justify-between flex-1 space-y-3">
          <div>
            <h3 class="font-bold text-sm text-stone-900">\${p.name}</h3>
            <span class="text-xs text-stone-600">\${p.unit}</span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-stone-100">
            <span class="font-extrabold text-stone-900">₹\${p.price}</span>
            <button onclick="addToCart()" class="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700">Add</button>
          </div>
        </div>
      \`;
      grid.appendChild(card);
    });

    function addToCart() {
      cartCount++;
      document.getElementById('cartCount').textContent = cartCount;
    }
  </script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-orange-100 z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-orange-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center">
              <Code2 className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-outfit font-extrabold text-xl text-stone-900">
                Single Standalone Code Export (Bharuch Edition)
              </h3>
              <p className="text-xs text-stone-500">
                Self-contained HTML5 + Tailwind + Vanilla JS with Orange branding & INR currency.
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

        <div className="flex items-center justify-between py-3">
          <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">
            index.html (Bharuch & Orange Palette)
          </span>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-200" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Single Block Code</span>
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-stone-950 text-stone-300 p-4 rounded-2xl font-mono text-xs leading-relaxed border border-stone-800">
          <pre>{standaloneHtmlCode}</pre>
        </div>
      </div>
    </div>
  );
};
