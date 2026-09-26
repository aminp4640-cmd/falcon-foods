export interface Product {
  id: string;
  name: string;
  category: 'produce' | 'bakery' | 'meat-seafood' | 'dairy-eggs' | 'pantry' | 'beverages';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  origin: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  organic: boolean;
  inStock: boolean;
  stockCount: number;
  tags: string[];
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  price: number;
  image: string;
  included: boolean;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  phone: string;
  status: 'Open Now' | 'Closes Soon';
}

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'zadeshwar',
    name: 'Zadeshwar Road Flagship Mart',
    address: 'Near DPS School, Zadeshwar Road, Bharuch - 392012',
    distance: '0.8 km away',
    hours: 'Mon - Sun: 7:00 AM - 10:30 PM',
    phone: '02642-260192',
    status: 'Open Now',
  },
  {
    id: 'bholav',
    name: 'Bholav Green Hub & Superstore',
    address: 'Link Road, Near Bholav Circle, Bharuch - 392002',
    distance: '2.1 km away',
    hours: 'Mon - Sun: 7:00 AM - 10:00 PM',
    phone: '+91 98250 55522',
    status: 'Open Now',
  },
  {
    id: 'station-road',
    name: 'Station Road Central Supermarket',
    address: 'Opp. Bharuch Railway Station, Station Road, Bharuch - 392001',
    distance: '3.4 km away',
    hours: 'Mon - Sun: 6:30 AM - 10:00 PM',
    phone: '02642-264488',
    status: 'Open Now',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Narmada Valley Desi Farm Tomatoes',
    category: 'produce',
    categoryLabel: 'Fresh Produce',
    price: 38,
    originalPrice: 50,
    unit: '1 kg pack',
    rating: 4.9,
    reviewsCount: 312,
    origin: 'Narmada River Basin, Shuklatirth Farms',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    badge: 'NARMADA HARVEST',
    badgeColor: 'bg-orange-600 text-white',
    description: 'Juicy, naturally tangy heirloom desi tomatoes harvested daily from the fertile black soil of the Narmada river valley. Ideal for Gujarati dal, sev tameta sabzi, and curries.',
    nutrition: { calories: '22 kcal / 100g', protein: '1.1g', carbs: '4.8g', fat: '0.2g' },
    organic: true,
    inStock: true,
    stockCount: 120,
    tags: ['Organic', 'Narmada Basin', 'Desi', 'Daily Fresh'],
  },
  {
    id: 'prod-2',
    name: 'Famous Bharuch Roasted Salted Peanuts (Khari Sing)',
    category: 'pantry',
    categoryLabel: 'Bharuch Specialties',
    price: 180,
    originalPrice: 220,
    unit: '500g vacuum pack',
    rating: 5.0,
    reviewsCount: 640,
    origin: 'Traditional Clay Kiln Roasters, Old Bharuch',
    image: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&auto=format&fit=crop&q=80',
    badge: 'BHARUCH SPECIAL',
    badgeColor: 'bg-amber-600 text-white',
    description: 'The world-renowned GI-heritage specialty of Bharuch. Selected jumbo peanuts sand-roasted in traditional clay bhattis with natural sea salt. Super crunchy with signature roasted aroma.',
    nutrition: { calories: '567 kcal / 100g', protein: '25.8g', carbs: '16.1g', fat: '49.2g' },
    organic: true,
    inStock: true,
    stockCount: 85,
    tags: ['GI Heritage', 'Bharuch Pride', 'Clay Roasted', 'High Protein'],
  },
  {
    id: 'prod-3',
    name: 'Gir Cow Pure A2 Fresh Milk (In Glass Bottle)',
    category: 'dairy-eggs',
    categoryLabel: 'Dairy & Ghee',
    price: 75,
    unit: '1 Litre bottle',
    rating: 4.9,
    reviewsCount: 512,
    origin: 'Gir Gaushala Farm, Hansot Road, Bharuch',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    badge: '100% PURE A2',
    badgeColor: 'bg-orange-500 text-white',
    description: 'Untouched, unadulterated raw-chilled A2 beta-casein whole milk from indigenous free-grazing Gir cows. Delivered daily in sanitized glass bottles. ₹10 refundable bottle deposit.',
    nutrition: { calories: '64 kcal / 100ml', protein: '3.4g', carbs: '4.8g', fat: '4.1g' },
    organic: true,
    inStock: true,
    stockCount: 60,
    tags: ['A2 Gir Cow', 'Glass Bottle', 'Unadulterated', 'Vedic Dairy'],
  },
  {
    id: 'prod-4',
    name: 'Fresh Malai Paneer (Soft Artisan Block)',
    category: 'dairy-eggs',
    categoryLabel: 'Dairy & Ghee',
    price: 135,
    originalPrice: 155,
    unit: '250g pack',
    rating: 4.9,
    reviewsCount: 388,
    origin: 'Falcon Fresh Dairy Kitchen, Zadeshwar',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    badge: 'CHURNED TODAY',
    badgeColor: 'bg-amber-600 text-white',
    description: 'Melt-in-your-mouth soft cottage cheese made every morning from farm-fresh cow milk without starches or preservatives. Perfect for paneer bhurji, tikka, and palak paneer.',
    nutrition: { calories: '265 kcal / 100g', protein: '18.3g', carbs: '2.1g', fat: '20.8g' },
    organic: true,
    inStock: true,
    stockCount: 45,
    tags: ['Fresh Churned', 'No Preservatives', 'Rich Protein'],
  },
  {
    id: 'prod-5',
    name: 'Tender Fresh Surti Green Papdi (Valol / Lilva)',
    category: 'produce',
    categoryLabel: 'Fresh Produce',
    price: 65,
    originalPrice: 85,
    unit: '500g pack',
    rating: 4.8,
    reviewsCount: 220,
    origin: 'Jambusar Green Belt, Bharuch District',
    image: 'https://images.unsplash.com/photo-1515471204630-f2038a7f5642?w=600&auto=format&fit=crop&q=80',
    badge: 'GUJARAT HARVEST',
    badgeColor: 'bg-emerald-600 text-white',
    description: 'Crisp, sweet, and stringless green flat beans handpicked from local Gujarat farms. The star ingredient for traditional Undhiyu and winter kathiyawadi curries.',
    nutrition: { calories: '35 kcal / 100g', protein: '2.8g', carbs: '6.5g', fat: '0.3g' },
    organic: true,
    inStock: true,
    stockCount: 70,
    tags: ['Undhiyu Essential', 'Local Harvest', 'Fresh Beans'],
  },
  {
    id: 'prod-6',
    name: 'Cold-Pressed Kachi Ghani Groundnut Oil (Sing Tel)',
    category: 'pantry',
    categoryLabel: 'Cooking Oils & Grains',
    price: 320,
    originalPrice: 360,
    unit: '1 Litre bottle',
    rating: 5.0,
    reviewsCount: 410,
    origin: 'Falcon Wooden Kolhu Mill, Ankleshwar',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    badge: 'WOOD-PRESSED',
    badgeColor: 'bg-orange-700 text-white',
    description: '100% natural Saurashtra groundnuts slowly crushed at room temperature in traditional wooden churners (lakdi ghani). Unrefined, zero chemicals, preserving heart-healthy natural antioxidants.',
    nutrition: { calories: '884 kcal / 100ml', protein: '0g', carbs: '0g', fat: '100g' },
    organic: true,
    inStock: true,
    stockCount: 50,
    tags: ['Cold Pressed', 'Sing Tel', 'Unrefined', 'Heart Healthy'],
  },
  {
    id: 'prod-7',
    name: 'Fresh Crisp Desi Ladyfinger (Bhindi)',
    category: 'produce',
    categoryLabel: 'Fresh Produce',
    price: 45,
    originalPrice: 60,
    unit: '500g pack',
    rating: 4.8,
    reviewsCount: 295,
    origin: 'Ankleshwar Rural Farmers Collective',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80',
    badge: 'CRISP & TENDER',
    badgeColor: 'bg-emerald-700 text-white',
    description: 'Tender, snap-fresh green bhindi without hard seeds or pesticide residue. Harvested this morning from farms along the Narmada canal.',
    nutrition: { calories: '33 kcal / 100g', protein: '1.9g', carbs: '7.5g', fat: '0.2g' },
    organic: true,
    inStock: true,
    stockCount: 65,
    tags: ['Tender', 'Farm Fresh', 'Non-GMO'],
  },
  {
    id: 'prod-8',
    name: 'Traditional Bilona Cow Ghee (A2 Cultured)',
    category: 'dairy-eggs',
    categoryLabel: 'Dairy & Ghee',
    price: 680,
    originalPrice: 750,
    unit: '500ml glass jar',
    rating: 5.0,
    reviewsCount: 480,
    origin: 'Vedic Gaushala, Shuklatirth, Bharuch',
    image: 'https://images.unsplash.com/photo-1589927986086-3d10fb556641?w=600&auto=format&fit=crop&q=80',
    badge: 'BILONA METHOD',
    badgeColor: 'bg-amber-700 text-white',
    description: 'Golden, aromatic, granular (danedar) shuddh desi ghee made by the Vedic curd-churning method. Imparts royal aroma to rotlis, khichdi, and Gujarati sweets.',
    nutrition: { calories: '897 kcal / 100g', protein: '0g', carbs: '0g', fat: '99.7g' },
    organic: true,
    inStock: true,
    stockCount: 35,
    tags: ['Danedar Ghee', 'Vedic Bilona', 'Immunity Booster'],
  },
  {
    id: 'prod-9',
    name: 'Fresh Narmada Green Tender Coconut Water',
    category: 'beverages',
    categoryLabel: 'Chilled Drinks',
    price: 55,
    unit: '1 Fresh Coconut (450ml+ water)',
    rating: 4.9,
    reviewsCount: 340,
    origin: 'Coastal Coconut Groves, Dahej Belt',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    badge: 'ELECTROLYTE RICH',
    badgeColor: 'bg-teal-600 text-white',
    description: 'Chilled, sweet, electrolyte-packed tender green coconut with thick sweet malai inside. Cut fresh on order or delivered whole.',
    nutrition: { calories: '19 kcal / 100ml', protein: '0.7g', carbs: '3.7g', fat: '0.2g' },
    organic: true,
    inStock: true,
    stockCount: 90,
    tags: ['Natural Hydration', 'Zero Added Sugar', 'Dahej Harvest'],
  },
  {
    id: 'prod-10',
    name: 'Farm-Fresh Methi & Palak Bundles (2-in-1 Combo)',
    category: 'produce',
    categoryLabel: 'Fresh Produce',
    price: 35,
    originalPrice: 45,
    unit: 'Combo of 2 bunches',
    rating: 4.8,
    reviewsCount: 180,
    origin: 'Riverbank Organic Plots, Bholav Border',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    badge: 'MORNING CUT',
    badgeColor: 'bg-emerald-600 text-white',
    description: 'Dew-fresh small-leaf country methi (fenugreek) and tender spinach leaves. Hydro-washed and ready for crispy theplas, muthias, or palak sabzi.',
    nutrition: { calories: '23 kcal / 100g', protein: '2.9g', carbs: '3.6g', fat: '0.4g' },
    organic: true,
    inStock: true,
    stockCount: 80,
    tags: ['Iron Rich', 'Thepla Ready', 'Clean Washed'],
  },
  {
    id: 'prod-11',
    name: 'Soft Whole-Wheat Butter Pav (Ladi Pav - 6 Pcs)',
    category: 'bakery',
    categoryLabel: 'Bakery & Bread',
    price: 35,
    unit: 'Pack of 6',
    rating: 4.9,
    reviewsCount: 260,
    origin: 'Falcon In-House Hearth Bakery, Zadeshwar',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    badge: 'BAKED TODAY 6 AM',
    badgeColor: 'bg-amber-700 text-white',
    description: 'Pillow-soft, golden ladi pav baked with 100% whole wheat flour and Amul butter. No bromate, zero preservatives. Ideal for Pav Bhaji, Vada Pav, and Maska Pav.',
    nutrition: { calories: '180 kcal / 2 pav', protein: '5.2g', carbs: '32g', fat: '2.8g' },
    organic: false,
    inStock: true,
    stockCount: 50,
    tags: ['Baked Daily', 'Zero Preservatives', 'Whole Wheat'],
  },
  {
    id: 'prod-12',
    name: 'Chilled Masala Chaas (Spiced Buttermilk)',
    category: 'beverages',
    categoryLabel: 'Chilled Drinks',
    price: 25,
    unit: '500ml pouch',
    rating: 4.9,
    reviewsCount: 410,
    origin: 'Falcon Fresh Dairy Kitchen, Bharuch',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    badge: 'PROBIOTIC COOLER',
    badgeColor: 'bg-orange-600 text-white',
    description: 'Authentic Kathiyawadi buttermilk blended with roasted cumin (jeera), black salt, fresh ginger, mint, and green chilies. Refreshing probiotic digestive companion.',
    nutrition: { calories: '40 kcal / 200ml', protein: '2.2g', carbs: '3.1g', fat: '1.2g' },
    organic: true,
    inStock: true,
    stockCount: 100,
    tags: ['Probiotic', 'Kathiyawadi Recipe', 'Summer Cooler'],
  },
];

export const RECIPE_BASKET: {
  title: string;
  subtitle: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  calories: string;
  chefQuote: string;
  chefName: string;
  ingredients: RecipeIngredient[];
} = {
  title: 'Royal Bharuch Paneer Bhurji & Methi Thepla Meal Kit',
  subtitle: 'With farm-fresh A2 malai paneer, Narmada desi tomatoes, fresh methi greens, and cold-pressed sing tel.',
  servings: 4,
  prepTime: '15 min',
  cookTime: '20 min',
  calories: '380 kcal / serving',
  chefQuote: 'The quintessential Gujarat dinner. Soft crumbled A2 malai paneer simmered with sweet Narmada tomatoes and paired with fragrant fresh methi theplas.',
  chefName: 'Chef Hasmukh Joshi, Regional Culinary Lead',
  ingredients: [
    {
      id: 'ing-1',
      name: 'Fresh Malai Paneer (250g soft block)',
      amount: '1 Pack (250g)',
      price: 135,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&auto=format&fit=crop&q=80',
      included: true,
    },
    {
      id: 'ing-2',
      name: 'Narmada Valley Desi Farm Tomatoes (500g)',
      amount: '500g Pack',
      price: 20,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
      included: true,
    },
    {
      id: 'ing-3',
      name: 'Fresh Country Methi Bundle (Wash & Cut)',
      amount: '1 Bundle',
      price: 18,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&auto=format&fit=crop&q=80',
      included: true,
    },
    {
      id: 'ing-4',
      name: 'Cold-Pressed Groundnut Oil (Sing Tel - 200ml)',
      amount: '200ml Mini Jar',
      price: 65,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80',
      included: true,
    },
    {
      id: 'ing-5',
      name: 'Kathiyawadi Masala & Cumin Tadka Pack',
      amount: '1 Spices Pouch',
      price: 25,
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&auto=format&fit=crop&q=80',
      included: true,
    },
  ],
};

export const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Dr. Priya Patel',
    location: 'Zadeshwar Road, Bharuch',
    verified: true,
    rating: 5,
    date: 'Yesterday',
    text: 'Falcon Foods has transformed our daily grocery routine in Bharuch! The Narmada valley tomatoes and fresh methi arrived crisp and dew-fresh within 45 minutes of ordering.',
    favoriteItem: 'Narmada Valley Desi Tomatoes',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'rev-2',
    author: 'Rajeshbhai Shah',
    location: 'GNFC Township, Bharuch',
    verified: true,
    rating: 5,
    date: '2 days ago',
    text: 'Being a native of Bharuch, I am very picky about Khari Sing. Falcon’s traditional clay-roasted peanuts are unbeatable. Plus, paying via UPI at the doorstep is super convenient.',
    favoriteItem: 'Famous Bharuch Roasted Salted Peanuts',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'rev-3',
    author: 'Ananya Mehta',
    location: 'Bholav, Bharuch',
    verified: true,
    rating: 5,
    date: '3 days ago',
    text: 'The Gir Cow A2 milk in returnable glass bottles reminds me of my grandmother’s village. The malai paneer melts like butter in the sabzi. Highly recommended for every Bharuch household!',
    favoriteItem: 'Gir Cow Pure A2 Fresh Milk',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
  },
];
