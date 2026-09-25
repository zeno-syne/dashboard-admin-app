export type PaymentStatus = 'Paid' | 'Pending' | 'Processing' | 'Cancelled';

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
  paymentMethod: 'Apple Pay' | 'Credit Card' | 'Cash' | 'Stripe Terminal' | 'Bank Transfer';
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
  sparklineData?: number[];
  secondaryMetric?: string;
}

export type ShoeCategory = 'Sneakers' | 'Running' | 'Casual' | 'Basketball' | 'Formal';

export interface LowStockShoe {
  id: string;
  name: string;
  brand: string;
  sku: string;
  size: number;
  stockLeft: number;
  threshold: number;
  category: ShoeCategory;
  price: number;
}

export interface ShoeProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: ShoeCategory;
  price: number; // Retail price ($)
  costPrice: number; // Cost of Goods Sold / Wholesale cost ($)
  color: string;
  sizes: Record<number, number>; // Size EUR -> stock, e.g. { 38: 4, 39: 5, ... }
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

export type PaymentMethod = 'Cash' | 'Apple Pay' | 'Credit Card' | 'Stripe Terminal';

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
  paymentMethod: PaymentMethod;
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
  totalSpent: number; // LTV (Lifetime Value in $)
  totalOrders: number;
  preferredSize: number; // EUR
  favoriteBrand: string;
  joinedDate: string;
  lastPurchaseDate: string;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  branchName: string;
  address: string;
  phone: string;
  instagram: string;
  website: string;
  paperSize: '58mm' | '80mm';
  returnPolicyDays: number;
  customFooterText: string;
  currencySymbol: string;
  taxPercentage: number;
  showLogoOnReceipt: boolean;
}

export type DropStatus = 'Raffle Open' | 'Upcoming Drop' | 'Live Queue' | 'Draw Completed';
export type DropMechanism = 'Digital Raffle' | 'In-Store Balloting' | 'VIP Priority Draw' | 'FCFS Speed Drop';

export interface RaffleWinner {
  ticketNumber: string;
  customerName: string;
  size: number;
  claimed: boolean;
  drawnAt: string;
}

export interface SneakerDrop {
  id: string;
  name: string;
  brand: string;
  colorway: string;
  sku: string;
  retailPrice: number;
  projectedResale: number;
  releaseDate: string;
  launchTimestamp: number;
  status: DropStatus;
  mechanism: DropMechanism;
  targetBranch: string;
  totalAllocatedPairs: number;
  raffleEntriesCount: number;
  sizeAllocation: Record<number, number>;
  image?: string;
  description: string;
  winnersDrawn?: RaffleWinner[];
}

export interface StockTransfer {
  id: string;
  date: string;
  fromBranch: string;
  toBranch: string;
  productName: string;
  sku: string;
  size: number;
  quantity: number;
  status: 'In Transit' | 'Dispatched' | 'Received';
  carrier: string;
  trackingNumber: string;
}
