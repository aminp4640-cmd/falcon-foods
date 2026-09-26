import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { Product, PRODUCTS } from '../data/groceryData';

// Read from Vite environment variables
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl.startsWith('http')
);

// Initialize Supabase client if configured, otherwise null
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Connection test
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not yet configured in environment.',
    };
  }

  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      // Table might not be populated or RLS applied, but reachability is confirmed if error is returned from PostgREST
      console.warn('[Supabase] Connected to project, query result:', error.message);
      return { connected: true, message: `Connected to Supabase (${error.message})` };
    }
    return { connected: true, message: 'Successfully connected to Supabase PostgreSQL database!' };
  } catch (err: any) {
    console.error('[Supabase] Connection failed:', err);
    return { connected: false, message: err?.message || 'Connection failed' };
  }
}

// ----------------------------------------------------
// SUPABASE PRODUCTS CRUD
// ----------------------------------------------------

export async function fetchSupabaseProducts(): Promise<Product[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) {
      console.warn('[Supabase] Products query error:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        categoryLabel: item.category_label || item.categoryLabel,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        unit: item.unit,
        rating: Number(item.rating || 5.0),
        reviewsCount: Number(item.reviews_count || 0),
        origin: item.origin || 'Bharuch, Gujarat',
        image: item.image,
        badge: item.badge,
        description: item.description,
        organic: Boolean(item.organic),
        inStock: item.in_stock !== false,
        stockCount: Number(item.stock_count || 50),
        tags: item.tags || [item.category_label || 'Fresh'],
        nutrition: item.nutrition || { calories: '120 kcal', protein: '4g', carbs: '18g', fat: '2g' }
      }));
    }
    return null;
  } catch (err) {
    console.error('[Supabase] Failed to fetch products:', err);
    return null;
  }
}

export async function seedSupabaseProductsIfEmpty(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (!error && (count === 0 || count === null)) {
      console.log('[Supabase] Seeding initial grocery products to Supabase...');
      const records = PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        category_label: p.categoryLabel,
        price: p.price,
        original_price: p.originalPrice || null,
        unit: p.unit,
        rating: p.rating,
        reviews_count: p.reviewsCount,
        origin: p.origin,
        image: p.image,
        badge: p.badge || null,
        description: p.description,
        organic: p.organic,
        in_stock: p.inStock,
        stock_count: p.stockCount
      }));

      await supabase.from('products').upsert(records, { onConflict: 'id' });
      console.log('[Supabase] Seeding completed.');
    }
  } catch (err) {
    console.warn('[Supabase] Seeding note:', err);
  }
}

// ----------------------------------------------------
// SUPABASE ORDERS CRUD
// ----------------------------------------------------

export async function createSupabaseOrder(orderData: any): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const record = {
      order_number: orderData.orderNumber,
      user_id: orderData.userId || null,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      delivery_address: orderData.deliveryAddress,
      city: orderData.city || 'Bharuch',
      pincode: orderData.pincode || '392012',
      notes: orderData.notes || '',
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee,
      tax: orderData.tax,
      tip: orderData.tip,
      discount: orderData.discount,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      status: orderData.status || 'placed',
      time_slot: orderData.timeSlot,
      store_hub: orderData.storeHub,
      items: orderData.items,
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(record)
      .select('id')
      .single();

    if (error) {
      console.error('[Supabase] Error creating order:', error.message);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('[Supabase] Order creation failed:', err);
    return null;
  }
}

export function subscribeToSupabaseOrders(onUpdate: (orders: any[]) => void) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  // Fetch initial orders
  supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      if (data) {
        onUpdate(data.map(mapDbOrder));
      }
    });

  // Listen to realtime changes
  const channel = supabase
    .channel('realtime:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      async () => {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) {
          onUpdate(data.map(mapDbOrder));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

function mapDbOrder(item: any) {
  return {
    id: item.id,
    orderNumber: item.order_number || item.orderNumber,
    userId: item.user_id || item.userId,
    customerName: item.customer_name || item.customerName,
    customerPhone: item.customer_phone || item.customerPhone,
    deliveryAddress: item.delivery_address || item.deliveryAddress,
    city: item.city || 'Bharuch',
    pincode: item.pincode || '392012',
    notes: item.notes,
    items: item.items || [],
    subtotal: Number(item.subtotal || 0),
    deliveryFee: Number(item.delivery_fee || 0),
    tax: Number(item.tax || 0),
    tip: Number(item.tip || 0),
    discount: Number(item.discount || 0),
    total: Number(item.total || 0),
    paymentMethod: item.payment_method || 'cod',
    status: item.status,
    timeSlot: item.time_slot || item.timeSlot,
    storeHub: item.store_hub || item.storeHub,
    createdAt: item.created_at ? { seconds: new Date(item.created_at).getTime() / 1000 } : null,
  };
}

export async function updateSupabaseOrderStatus(orderId: string, status: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    return !error;
  } catch (err) {
    console.error('[Supabase] Failed to update order status:', err);
    return false;
  }
}

// ----------------------------------------------------
// SUPABASE AUTH HELPERS
// ----------------------------------------------------

export async function signUpWithSupabase(email: string, password: string, name: string, phone: string, address: string, pincode: string) {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone,
        address,
        pincode,
        city: 'Bharuch',
      },
    },
  });

  if (error) throw error;
  return data.user;
}

export async function signInWithSupabase(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
}

export async function signOutSupabase() {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.auth.signOut();
}
