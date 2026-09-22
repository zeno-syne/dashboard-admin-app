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
