export type CategoryId = string;

export interface Category {
  id: string;
  name: string;
  icon?: string;
  image: string;
  badge?: string;
  description?: string;
  sortOrder?: number;
}

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export type SpiceLevel = 'sin_aji' | 'medio' | 'picante_bravo';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  image: string;
  badge?: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  isHidden?: boolean;
  prepTime?: string;
  portions?: string;
  availableExtras?: ExtraOption[];
}

export interface CartItem {
  id: string; // unique item id (composite or uuid)
  product: Product;
  quantity: number;
  spiceLevel: SpiceLevel;
  selectedExtras: ExtraOption[];
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderType = 'delivery' | 'pickup' | 'mesa';

export type PaymentMethod = 'yape' | 'plin' | 'efectivo' | 'pos';

export interface CustomerData {
  fullName: string;
  phone: string;
  orderType: OrderType;
  tableNumber?: string;
  address?: string;
  reference?: string;
  district?: string;
  paymentMethod: PaymentMethod;
  cashAmount?: number;
  couponCode?: string;
  discountAmount?: number;
  deliveryFee: number;
}

export type OrderStatus = 'recibido' | 'en_cocina' | 'en_camino' | 'entregado' | 'cancelado';
export type OrderPaymentStatus = 'pendiente' | 'pagado';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  customer: CustomerData;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  paidAt?: string;
  notes?: string;
}

export type POSSaleType = 'mostrador' | 'llevar' | 'mesa';

export interface POSSale {
  id: string;
  saleNumber: string;
  createdAt: string;
  saleType: POSSaleType;
  tableNumber?: string;
  customerName?: string;
  customerDoc?: string; // DNI or RUC
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashGiven?: number;
  changeAmount?: number;
  cashierName: string;
  status: 'completada' | 'anulada';
  notes?: string;
}

export interface CashShift {
  id: string;
  isOpen: boolean;
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  cashierName: string;
  cashSales: number;
  yapeSales: number;
  plinSales: number;
  cardSales: number;
  totalSales: number;
  salesCount: number;
  finalCountedCash?: number;
  cashDifference?: number;
  notes?: string;
}

export interface AppSettings {
  businessName: string;
  businessTagline: string;
  address: string;
  locationReference: string;
  phone: string;
  whatsappNumber: string;
  openingHours: string;
  bannerNotice: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  socialInstagram: string;
  socialTiktok: string;
  socialFacebook: string;
  socialGoogleMaps: string;
  freeDeliveryThreshold: number;
  baseDeliveryFee: number;
  adminPin: string;
}

export type AdminTab = 'pos' | 'pedidos_web' | 'reportes' | 'productos' | 'categorias' | 'configuracion';

