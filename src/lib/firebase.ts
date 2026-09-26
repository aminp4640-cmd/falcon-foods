import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, PRODUCTS } from '../data/groceryData';
import { 
  isSupabaseConfigured, 
  createSupabaseOrder, 
  updateSupabaseOrderStatus, 
  seedSupabaseProductsIfEmpty,
  testSupabaseConnection 
} from './supabase';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with the provisioned database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Initialize Firebase Auth
export const auth = getAuth(app);

// Error Handling conformant with Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection verification test
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, 'test', 'connection');
    await getDocFromServer(testDocRef);
    console.log('[Firebase] Connection to Firestore established successfully.');
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline, checking cache.');
      return false;
    }
    // If permission or not found, it still proves reachability
    console.log('[Firebase] Reached Firestore server.');
    return true;
  }
}

// Data Interfaces
export interface DbUserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  role: 'customer' | 'admin';
  createdAt?: any;
}

export interface DbOrder {
  id?: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  pincode: string;
  notes?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: 'placed' | 'shopping' | 'chilled_packing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  timeSlot: string;
  storeHub: string;
  createdAt: any;
  updatedAt?: any;
}

export interface DbReview {
  id?: string;
  productId?: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  favoriteItem: string;
  verified: boolean;
  createdAt: any;
}

// ----------------------------------------------------
// AUTHENTICATION CRUD
// ----------------------------------------------------

export async function registerUser(email: string, password: string, name: string, phone: string, address: string, pincode: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  await updateProfile(user, { displayName: name });

  // Save profile to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    displayName: name,
    email,
    phone,
    address,
    city: 'Bharuch',
    pincode,
    role: 'customer',
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginAsGuest(name: string = 'Guest Shopper'): Promise<User> {
  const credential = await signInAnonymously(auth);
  const user = credential.user;
  
  // Set default profile
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    displayName: name,
    email: 'guest@falconfoods.in',
    phone: '+91 98250 55522',
    address: 'Near Zadeshwar Cross Road',
    city: 'Bharuch',
    pincode: '392012',
    role: 'customer',
    createdAt: serverTimestamp(),
  }, { merge: true });

  return user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<DbUserProfile | null> {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (docSnap.exists()) {
      return docSnap.data() as DbUserProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<DbUserProfile>): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ----------------------------------------------------
// ORDERS CRUD
// ----------------------------------------------------

export async function createOrderInDb(orderData: Omit<DbOrder, 'createdAt'>): Promise<string> {
  // If Supabase is configured, create order in Supabase
  if (isSupabaseConfigured) {
    try {
      await createSupabaseOrder(orderData);
      console.log('[Supabase] Order recorded in Supabase PostgreSQL.');
    } catch (err) {
      console.warn('[Supabase] Order sync warning:', err);
    }
  }

  // Also record in Firestore
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export function subscribeToUserOrders(userId: string, onUpdate: (orders: DbOrder[]) => void) {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const orders: DbOrder[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...(doc.data() as any) });
    });
    // Sort descending by date in memory if not indexed yet
    orders.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
    onUpdate(orders);
  });
}

export function subscribeToAllOrders(onUpdate: (orders: DbOrder[]) => void) {
  const colRef = collection(db, 'orders');
  return onSnapshot(colRef, (snapshot) => {
    const orders: DbOrder[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...(doc.data() as any) });
    });
    orders.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
    onUpdate(orders);
  });
}

export async function updateOrderStatus(orderId: string, newStatus: DbOrder['status']): Promise<void> {
  // If Supabase is configured, update in Supabase
  if (isSupabaseConfigured) {
    try {
      await updateSupabaseOrderStatus(orderId, newStatus);
    } catch (err) {
      console.warn('[Supabase] Status update note:', err);
    }
  }

  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}

// ----------------------------------------------------
// REVIEWS CRUD
// ----------------------------------------------------

export async function postReview(reviewData: Omit<DbReview, 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...reviewData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function subscribeToReviews(onUpdate: (reviews: DbReview[]) => void) {
  const colRef = collection(db, 'reviews');
  return onSnapshot(colRef, (snapshot) => {
    const reviews: DbReview[] = [];
    snapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...(doc.data() as any) });
    });
    onUpdate(reviews);
  });
}

// ----------------------------------------------------
// SEED INITIAL BHARUCH PRODUCTS & INITIAL TEST
// ----------------------------------------------------

export async function seedProductsIfEmpty(): Promise<void> {
  // If Supabase is configured, ensure it is also seeded
  if (isSupabaseConfigured) {
    seedSupabaseProductsIfEmpty();
  }

  const path = 'products';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      console.log('[Firebase] Seeding Bharuch grocery catalog to Firestore...');
      for (const prod of PRODUCTS) {
        await setDoc(doc(db, path, prod.id), prod);
      }
      console.log('[Firebase] Seeding completed.');
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('permission')) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } else {
      console.warn('[Firebase] Product catalog check completed:', error);
    }
  }
}
