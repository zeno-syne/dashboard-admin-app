export type PaymentStatus = 'Lunas' | 'Menunggu' | 'Diproses' | 'Dibatalkan';

export interface OrderItem {
  shoeName: string;
  brand: string;
  size: number;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'QRIS' | 'BCA Virtual Account' | 'Mandiri VA' | 'COD' | 'Kartu Kredit';
  paymentStatus: PaymentStatus;
  shippingCourier: string;
  trackingNumber: string;
}

export interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  iconName: 'dollar' | 'shoppingBag' | 'alertTriangle' | 'users';
}

export interface LowStockShoe {
  id: string;
  name: string;
  brand: string;
  sku: string;
  size: number;
  stockLeft: number;
  threshold: number;
  category: 'Sneakers' | 'Formal' | 'Running' | 'Casual';
  price: number;
}

export type ShoeCategory = 'Sneakers' | 'Running' | 'Casual' | 'Basketball' | 'Formal';

export interface ShoeProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: ShoeCategory;
  price: number; // Harga jual
  costPrice: number; // Harga modal
  color: string;
  sizes: Record<number, number>; // Size EUR -> stok, misal { 38: 4, 39: 5, ... }
  totalStock: number;
  threshold: number;
  image?: string;
  createdAt: string;
}

export interface PosCartItem {
  productId: string;
  name: string;
  brand: string;
  sku: string;
  size: number;
  color: string;
  price: number;
  quantity: number;
  availableStock: number;
  image?: string;
}

export interface PosTransaction {
  id: string;
  customerName: string;
  customerPhone?: string;
  cashierName: string;
  branchName: string;
  date: string;
  items: PosCartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Debit BCA' | 'Kartu Kredit';
  cashAmountPaid?: number;
  changeDue?: number;
}

export type CustomerTier = 'Sneakerhead VIP' | 'Gold Vault' | 'Silver Collector' | 'Bronze Member';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  tier: CustomerTier;
  points: number;
  totalSpent: number; // LTV (Lifetime Value)
  totalOrders: number;
  preferredSize: number; // EUR
  favoriteBrand: string;
  joinedDate: string;
  lastPurchaseDate: string;
  notes?: string;
}

