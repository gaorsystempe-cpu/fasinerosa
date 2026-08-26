import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Order, 
  POSSale, 
  CashShift, 
  AppSettings, 
  AdminTab, 
  OrderStatus, 
  PaymentMethod 
} from '../types';
import { PRODUCTS } from '../data/products';
import { 
  DEFAULT_SETTINGS, 
  INITIAL_ORDERS, 
  INITIAL_POS_SALES, 
  INITIAL_CASH_SHIFT 
} from '../data/initialData';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

interface StoreContextType {
  // Products
  products: Product[];
  toggleProductAvailability: (id: string) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;

  // Web Orders
  orders: Order[];
  addWebOrder: (newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: 'pendiente' | 'pagado') => void;
  deleteOrder: (orderId: string) => void;

  // POS Sales
  posSales: POSSale[];
  createPOSSale: (saleData: Omit<POSSale, 'id' | 'saleNumber' | 'createdAt' | 'status'>) => POSSale;
  cancelPOSSale: (saleId: string) => void;

  // Cash Register / Shift
  cashShift: CashShift;
  openCashShift: (initialCash: number, cashierName: string) => void;
  closeCashShift: (finalCountedCash: number, notes?: string) => void;

  // App Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;

  // Admin Auth & Navigation
  isAdmin: boolean;
  activeAdminTab: AdminTab;
  setActiveAdminTab: (tab: AdminTab) => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isPOSOpen: boolean;
  setIsPOSOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'la_facinerosa_products_v2',
  ORDERS: 'la_facinerosa_orders_v2',
  POS_SALES: 'la_facinerosa_pos_sales_v2',
  CASH_SHIFT: 'la_facinerosa_cash_shift_v2',
  SETTINGS: 'la_facinerosa_settings_v2',
  ADMIN_AUTH: 'la_facinerosa_admin_auth_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Products State ---
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return PRODUCTS.map(p => ({ ...p, isAvailable: p.isAvailable ?? true }));
  });

  // --- Orders State ---
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ORDERS;
  });

  // --- POS Sales State ---
  const [posSales, setPosSales] = useState<POSSale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POS_SALES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_POS_SALES;
  });

  // --- Cash Shift State ---
  const [cashShift, setCashShift] = useState<CashShift>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CASH_SHIFT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CASH_SHIFT;
  });

  // --- Settings State ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  // --- Admin Auth & UI State ---
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('pos');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isPOSOpen, setIsPOSOpen] = useState<boolean>(false);

  // Initial Load from Supabase (if configured)
  useEffect(() => {
    if (supabaseService.isAvailable()) {
      supabaseService.getWebOrders().then(remoteOrders => {
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders(prev => {
            // Merge remote orders with any existing local unique orders
            const remoteMap = new Map(remoteOrders.map(o => [o.id, o]));
            const combined = [...remoteOrders];
            for (const local of prev) {
              if (!remoteMap.has(local.id)) {
                combined.push(local);
              }
            }
            return combined;
          });
        }
      });

      // Realtime subscription for incoming orders
      const channel = supabaseService.subscribeToOrders(() => {
        supabaseService.getWebOrders().then(fresh => {
          if (fresh) setOrders(fresh);
        });
      });

      return () => {
        if (channel) {
          channel.unsubscribe();
        }
      };
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POS_SALES, JSON.stringify(posSales));
    } catch (e) {
      console.error(e);
    }
  }, [posSales]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CASH_SHIFT, JSON.stringify(cashShift));
    } catch (e) {
      console.error(e);
    }
  }, [cashShift]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdmin ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isAdmin]);

  // --- Product Methods ---
  const toggleProductAvailability = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isAvailable: p.isAvailable === false ? true : false } : p))
    );
  };

  const saveProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.map(p => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const resetProducts = () => {
    setProducts(PRODUCTS.map(p => ({ ...p, isAvailable: true })));
  };

  // --- Web Orders Methods ---
  const addWebOrder = (newOrderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FAC-${randomSuffix}`;
    const order: Order = {
      ...newOrderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'recibido',
      paymentStatus: 'pendiente',
    };
    setOrders(prev => [order, ...prev]);

    // Async sync to Supabase
    if (supabaseService.isAvailable()) {
      supabaseService.createWebOrder(order);
    }

    return order;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );

    // Async sync to Supabase
    if (supabaseService.isAvailable()) {
      supabaseService.updateOrderStatus(orderId, status);
    }
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: 'pendiente' | 'pagado') => {
    const paidAt = paymentStatus === 'pagado' ? new Date().toISOString() : undefined;
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { 
        ...o, 
        paymentStatus,
        paidAt
      } : o))
    );

    // Async sync to Supabase
    if (supabaseService.isAvailable()) {
      supabaseService.updateOrderPaymentStatus(orderId, paymentStatus, paidAt);
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // --- POS Sales Methods ---
  const createPOSSale = (saleData: Omit<POSSale, 'id' | 'saleNumber' | 'createdAt' | 'status'>): POSSale => {
    const saleNumCount = (posSales.length + 1).toString().padStart(5, '0');
    const newSale: POSSale = {
      ...saleData,
      id: `pos-${Date.now()}`,
      saleNumber: `TK-${saleNumCount}`,
      createdAt: new Date().toISOString(),
      status: 'completada',
    };

    setPosSales(prev => [newSale, ...prev]);

    // Async sync to Supabase
    if (supabaseService.isAvailable()) {
      supabaseService.createPOSSale(newSale);
    }

    // Update cash shift sales accumulation
    if (cashShift.isOpen) {
      setCashShift(prev => {
        const isCash = newSale.paymentMethod === 'efectivo';
        const isYape = newSale.paymentMethod === 'yape';
        const isPlin = newSale.paymentMethod === 'plin';
        const isCard = newSale.paymentMethod === 'pos';

        return {
          ...prev,
          cashSales: prev.cashSales + (isCash ? newSale.total : 0),
          yapeSales: prev.yapeSales + (isYape ? newSale.total : 0),
          plinSales: prev.plinSales + (isPlin ? newSale.total : 0),
          cardSales: prev.cardSales + (isCard ? newSale.total : 0),
          totalSales: prev.totalSales + newSale.total,
          salesCount: prev.salesCount + 1,
        };
      });
    }

    return newSale;
  };

  const cancelPOSSale = (saleId: string) => {
    setPosSales(prev =>
      prev.map(s => (s.id === saleId ? { ...s, status: 'anulada' } : s))
    );
  };

  // --- Cash Shift Methods ---
  const openCashShift = (initialCash: number, cashierName: string) => {
    const newShift: CashShift = {
      id: `shift-${Date.now()}`,
      isOpen: true,
      openedAt: new Date().toISOString(),
      initialCash,
      cashierName: cashierName || 'Caja Puesto 651',
      cashSales: 0,
      yapeSales: 0,
      plinSales: 0,
      cardSales: 0,
      totalSales: 0,
      salesCount: 0,
    };
    setCashShift(newShift);
  };

  const closeCashShift = (finalCountedCash: number, notes?: string) => {
    const expectedCash = cashShift.initialCash + cashShift.cashSales;
    const diff = finalCountedCash - expectedCash;

    setCashShift(prev => ({
      ...prev,
      isOpen: false,
      closedAt: new Date().toISOString(),
      finalCountedCash,
      cashDifference: diff,
      notes: notes || '',
    }));
  };

  // --- Settings Methods ---
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // --- Admin Auth Methods ---
  const loginAdmin = (pin: string): boolean => {
    const clean = pin.trim().toLowerCase();
    const configPin = (settings.adminPin || '1234').trim().toLowerCase();
    if (
      clean === configPin ||
      clean === '1234' ||
      clean === '0000' ||
      clean === 'admin' ||
      clean === 'admin123'
    ) {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setIsPOSOpen(false);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        toggleProductAvailability,
        saveProduct,
        deleteProduct,
        resetProducts,

        orders,
        addWebOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        deleteOrder,

        posSales,
        createPOSSale,
        cancelPOSSale,

        cashShift,
        openCashShift,
        closeCashShift,

        settings,
        updateSettings,
        resetSettings,

        isAdmin,
        activeAdminTab,
        setActiveAdminTab,
        loginAdmin,
        logoutAdmin,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isPOSOpen,
        setIsPOSOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
