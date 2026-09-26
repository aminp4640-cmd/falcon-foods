import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  itemCount: string;
  image: string;
  categoryKey: 'produce' | 'bakery' | 'meat-seafood' | 'dairy-eggs' | 'pantry' | 'beverages';
  accentColor: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-produce',
    name: 'Fresh Farm Sabzi',
    description: 'Narmada desi tomatoes, crisp bhindi, surti papdi & greens',
    itemCount: '120+ Items',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&auto=format&fit=crop&q=80',
    categoryKey: 'produce',
    accentColor: 'from-orange-950/80 to-orange-900/90',
  },
  {
    id: 'cat-dairy',
    name: 'A2 Gir Dairy & Ghee',
    description: 'Pure Gir cow milk in glass bottles, soft malai paneer, bilona ghee',
    itemCount: '45+ Items',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=400&auto=format&fit=crop&q=80',
    categoryKey: 'dairy-eggs',
    accentColor: 'from-amber-950/80 to-amber-900/90',
  },
  {
    id: 'cat-pantry',
    name: 'Bharuch Khari Sing',
    description: 'Clay-roasted salted peanuts, wood-pressed kachi ghani sing tel',
    itemCount: '65+ Items',
    image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=400&auto=format&fit=crop&q=80',
    categoryKey: 'pantry',
    accentColor: 'from-orange-950/85 to-red-950/90',
  },
  {
    id: 'cat-bakery',
    name: 'Fresh Pav & Bakery',
    description: 'Whole wheat pav, roasted khakhra, maska buns baked daily at 6 AM',
    itemCount: '40+ Items',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
    categoryKey: 'bakery',
    accentColor: 'from-amber-950/80 to-yellow-950/90',
  },
  {
    id: 'cat-drinks',
    name: 'Coconut & Chaas',
    description: 'Fresh Narmada tender coconut, Kathiyawadi masala chaas, fresh juices',
    itemCount: '30+ Items',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80',
    categoryKey: 'beverages',
    accentColor: 'from-orange-950/80 to-teal-950/90',
  },
  {
    id: 'cat-meat',
    name: 'Poultry & River Catch',
    description: 'Farm fresh eggs, desi country chicken & Narmada river catch',
    itemCount: '25+ Items',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
    categoryKey: 'meat-seafood',
    accentColor: 'from-stone-950/80 to-orange-950/90',
  },
];

interface CategoryNavProps {
  onSelectCategory: (category: any) => void;
  activeCategory: string;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <section className="py-12 bg-white border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-widest">
              <span>Bharuch Department Aisles</span>
              <span>·</span>
              <span>Fresh Daily Stock</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-stone-900 mt-1">
              Shop by Fresh Category
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Aisles (350+ Items)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6-Column Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.categoryKey;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.categoryKey)}
                className={`group relative flex flex-col text-left rounded-2xl overflow-hidden border transition-all duration-200 ${
                  isSelected
                    ? 'border-orange-500 ring-2 ring-orange-500 shadow-md scale-[1.02]'
                    : 'border-stone-200 hover:border-orange-400 hover:shadow-md'
                }`}
              >
                {/* Image container with aspect ratio */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.accentColor} opacity-75 group-hover:opacity-65 transition-opacity`} />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-amber-200 block">
                      {cat.itemCount}
                    </span>
                    <h3 className="text-sm font-bold text-white font-outfit leading-tight drop-shadow-xs">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Subtext info */}
                <div className="p-2.5 bg-white flex-1 flex flex-col justify-between">
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-orange-600 group-hover:text-orange-700">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
