-- ================================================================
-- FALCON FOODS SUPERMARKET - SUPABASE POSTGRESQL SCHEMA
-- File: schema.sql
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ================================================================

-- 1. DROP EXISTING TABLES IF NEEDED (Optional, clean slate)
-- DROP TABLE IF EXISTS public.reviews CASCADE;
-- DROP TABLE IF EXISTS public.orders CASCADE;
-- DROP TABLE IF EXISTS public.products CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. ENABLE UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. USER PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Bharuch',
  pincode TEXT DEFAULT '392012',
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'store_manager', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on Supabase auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Falcon Customer'), 
    NEW.email, 
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. PRODUCTS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  unit TEXT NOT NULL,
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  origin TEXT NOT NULL,
  image TEXT NOT NULL,
  badge TEXT,
  description TEXT,
  organic BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  stock_count INT DEFAULT 100,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE (With Realtime enabled)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Bharuch',
  pincode TEXT NOT NULL DEFAULT '392012',
  notes TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  tip NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'shopping', 'chilled_packing', 'out_for_delivery', 'delivered', 'cancelled')),
  time_slot TEXT NOT NULL,
  store_hub TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMER REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  location TEXT DEFAULT 'Bharuch',
  rating INT CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  favorite_item TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 8. POLICIES: PRODUCTS
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow write products" ON public.products;
CREATE POLICY "Allow write products" ON public.products FOR ALL USING (true);

-- 9. POLICIES: ORDERS
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow order insert" ON public.orders;
CREATE POLICY "Allow order insert" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow order update" ON public.orders;
CREATE POLICY "Allow order update" ON public.orders FOR UPDATE USING (true);

-- 10. POLICIES: PROFILES
DROP POLICY IF EXISTS "Users can read all profiles" ON public.profiles;
CREATE POLICY "Users can read all profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 11. POLICIES: REVIEWS
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert reviews" ON public.reviews;
CREATE POLICY "Allow insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- 12. ENABLE REALTIME PUBLICATION FOR ORDERS TABLE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;

-- 13. SEED INITIAL BHARUCH GROCERY PRODUCTS
INSERT INTO public.products (id, name, category, category_label, price, original_price, unit, rating, reviews_count, origin, image, badge, description, organic, in_stock, stock_count)
VALUES
  ('bh-1', 'Fresh Desi Narmada Tamatar (Hybrid Red)', 'produce', 'Fresh Harvest', 38.00, 48.00, '1 kg', 4.9, 142, 'Zadeshwar Farm Direct', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80', 'Mandi Fresh Today', 'Juicy farm-picked desi red tomatoes from farms along the Narmada river bank. Naturally vine-ripened, ideal for Gujarati dal and curries.', true, true, 85),
  ('bh-2', 'Shuddh Malai Paneer Block (Daily Fresh)', 'dairy', 'Dairy & Paneer', 115.00, 130.00, '250 g', 4.95, 218, 'Bharuch Falcon Chilled Hub', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80', 'Crafted This Morning', 'Soft and creamy block made from 100% pure fresh cow and buffalo whole milk. Vacuum packed at 4°C with zero preservatives.', true, true, 42),
  ('bh-3', 'Gir Cow Vedic A2 Bilona Cow Milk', 'dairy', 'Dairy & Paneer', 82.00, 95.00, '1 L Pouch', 5.0, 98, 'Jambusar Gaushala', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80', 'A2 Pure Grass-fed', 'Single-origin pure A2 raw whole milk from indigenous Gir cows grazing natural pastures near Jambusar. Non-homogenized.', true, true, 30),
  ('bh-4', 'Original Bharuch Khari Sing (Salted Peanuts)', 'snacks', 'Bharuch Specialties', 145.00, 170.00, '500 g', 4.98, 480, 'Old Station Road, Bharuch', 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=800&auto=format&fit=crop&q=80', 'GI Certified Heritage', 'The world-famous Bharuch Khari Sing, dry-roasted in traditional hot sand pits using authentic methods since 1948. Perfectly crisp with skin on.', false, true, 110),
  ('bh-5', 'Ankleshwar Green Okra (Bhindi)', 'produce', 'Fresh Harvest', 42.00, 52.00, '500 g', 4.8, 64, 'Ankleshwar River Basin', 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=800&auto=format&fit=crop&q=80', 'Tender & Slender', 'Tender, bright green farm-fresh ladyfinger. Inspected for tenderness, flawless for Bhindi Masala or Sambhariya.', true, true, 60),
  ('bh-6', 'Surti Papdi Fresh Pods (Undhiyu Special)', 'produce', 'Fresh Harvest', 65.00, 80.00, '500 g', 4.9, 120, 'Surat-Bharuch Belt', 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=800&auto=format&fit=crop&q=80', 'Winter Essential', 'Special tender flat green beans with plump seeds, the soul of authentic Kathiyawadi and Surti Undhiyu dishes.', true, true, 55)
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  in_stock = EXCLUDED.in_stock,
  stock_count = EXCLUDED.stock_count;

-- Finished! All tables, policies, triggers, and seed records ready.
