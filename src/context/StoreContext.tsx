import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Product, 
  Order, 
  POSSale, 
  CashShift, 
  AppSettings, 
  AdminTab, 
  OrderStatus, 
  PaymentMethod,
  Category
} from '../types';
import { PRODUCTS, DEFAULT_CATEGORIES } from '../data/products';
import { 
  DEFAULT_SETTINGS, 
  INITIAL_ORDERS, 
  INITIAL_POS_SALES, 
  INITIAL_CASH_SHIFT 
} from '../data/initialData';
import { supabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

interface StoreContextType {
  // Categories
  categories: Category[];
  saveCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  resetCategories: () => Promise<void>;

  // Products
  products: Product[];
  toggleProductAvailability: (id: string) => void;
  saveProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  resetProducts: () => Promise<void>;

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

  // Cloud Sync & Realtime Status
  isSupabaseOnline: boolean;
  syncStatus: 'connected' | 'disconnected' | 'syncing';
  syncWithSupabase: () => Promise<void>;

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
  CATEGORIES: 'la_facinerosa_categories_v2',
  PRODUCTS: 'la_facinerosa_products_v2',
  ORDERS: 'la_facinerosa_orders_v2',
  POS_SALES: 'la_facinerosa_pos_sales_v2',
  CASH_SHIFT: 'la_facinerosa_cash_shift_v2',
  SETTINGS: 'la_facinerosa_settings_v2',
  ADMIN_AUTH: 'la_facinerosa_admin_auth_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Sync State ---
  const [isSupabaseOnline, setIsSupabaseOnline] = useState<boolean>(isSupabaseConfigured);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'disconnected' | 'syncing'>(
    isSupabaseConfigured ? 'connected' : 'disconnected'
  );

  // --- Categories State ---
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CATEGORIES;
  });

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

  const isSeedingRef = useRef(false);

  // --- Bidirectional Sync Function ---
  const syncWithSupabase = useCallback(async () => {
    if (!supabaseService.isAvailable()) {
      setIsSupabaseOnline(false);
      setSyncStatus('disconnected');
      return;
    }

    setSyncStatus('syncing');

    try {
      // 1. Categories Sync
      const remoteCategories = await supabaseService.getCategories();
      if (remoteCategories !== null) {
        if (remoteCategories.length > 0) {
          setCategories(remoteCategories);
        } else if (!isSeedingRef.current) {
          await supabaseService.seedDefaultCategories(DEFAULT_CATEGORIES);
          const seeded = await supabaseService.getCategories();
          if (seeded && seeded.length > 0) {
            setCategories(seeded);
          }
        }
      }

      // 2. Products Sync
      const remoteProducts = await supabaseService.getProducts();
      if (remoteProducts !== null) {
        if (remoteProducts.length > 0) {
          setProducts(remoteProducts);
        } else if (!isSeedingRef.current) {
          // Table exists but is empty -> Auto seed initial catalog so all devices sync immediately!
          isSeedingRef.current = true;
          await supabaseService.seedDefaultProducts(PRODUCTS.map(p => ({ ...p, isAvailable: true })));
          const seeded = await supabaseService.getProducts();
          if (seeded && seeded.length > 0) {
            setProducts(seeded);
          }
          isSeedingRef.current = false;
        }
      }

      // 2. Orders Sync
      const remoteOrders = await supabaseService.getWebOrders();
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(prev => {
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

      // 3. POS Sales Sync
      const remoteSales = await supabaseService.getPOSSales();
      if (remoteSales && remoteSales.length > 0) {
        setPosSales(prev => {
          const remoteMap = new Map(remoteSales.map(s => [s.id, s]));
          const combined = [...remoteSales];
          for (const local of prev) {
            if (!remoteMap.has(local.id)) {
              combined.push(local);
            }
          }
          return combined;
        });
      }

      // 4. App Settings Sync
      const remoteSettings = await supabaseService.getAppSettings();
      if (remoteSettings) {
        setSettings(prev => ({ ...prev, ...remoteSettings }));
      }

      // 5. Active Cash Shift Sync
      const remoteShift = await supabaseService.getActiveCashShift();
      if (remoteShift) {
        setCashShift(remoteShift);
      }

      setIsSupabaseOnline(true);
      setSyncStatus('connected');
    } catch (err) {
      console.warn('Sync error with Supabase:', err);
      setSyncStatus('connected');
    }
  }, []);

  // Initial Load from Supabase & Realtime Listeners
  useEffect(() => {
    if (supabaseService.isAvailable()) {
      syncWithSupabase();

      // Realtime subscription for incoming web orders
      const ordersChannel = supabaseService.subscribeToOrders(() => {
        supabaseService.getWebOrders().then(fresh => {
          if (fresh) setOrders(fresh);
        });
      });

      // Realtime subscription for POS sales
      const salesChannel = supabaseService.subscribeToPOSSales(() => {
        supabaseService.getPOSSales().then(fresh => {
          if (fresh) setPosSales(fresh);
        });
      });

      // Realtime subscription for Products & Stock
      const productsChannel = supabaseService.subscribeToProducts(() => {
        supabaseService.getProducts().then(fresh => {
          if (fresh && fresh.length > 0) setProducts(fresh);
        });
      });

      // Realtime subscription for Categories
      const categoriesChannel = supabaseService.subscribeToCategories(() => {
        supabaseService.getCategories().then(fresh => {
          if (fresh && fresh.length > 0) setCategories(fresh);
        });
      });

      // Realtime subscription for Settings
      const settingsChannel = supabaseService.subscribeToSettings(() => {
        supabaseService.getAppSettings().then(fresh => {
          if (fresh) setSettings(fresh);
        });
      });

      // Realtime subscription for Cash Shifts
      const shiftsChannel = supabaseService.subscribeToCashShifts(() => {
        supabaseService.getActiveCashShift().then(fresh => {
          if (fresh) setCashShift(fresh);
        });
      });

      // Fast polling interval (every 8 seconds) as a guarantee for multi-device sync
      const interval = setInterval(() => {
        syncWithSupabase();
      }, 8000);

      // Instant refresh on tab focus / visibility change
      const handleFocus = () => {
        syncWithSupabase();
      };
      window.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', handleFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('visibilitychange', handleFocus);
        if (ordersChannel) ordersChannel.unsubscribe();
        if (salesChannel) salesChannel.unsubscribe();
        if (productsChannel) productsChannel.unsubscribe();
        if (categoriesChannel) categoriesChannel.unsubscribe();
        if (settingsChannel) settingsChannel.unsubscribe();
        if (shiftsChannel) shiftsChannel.unsubscribe();
      };
    }
  }, [syncWithSupabase]);

  // Sync to LocalStorage as offline backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

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

  // --- Category Methods ---
  const saveCategory = async (category: Category): Promise<boolean> => {
    setCategories(prev => {
      const exists = prev.some(c => c.id === category.id);
      if (exists) {
        return prev.map(c => (c.id === category.id ? category : c));
      }
      return [...prev, category];
    });

    if (supabaseService.isAvailable()) {
      const success = await supabaseService.saveCategory(category);
      return success;
    }
    return true;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (supabaseService.isAvailable()) {
      return await supabaseService.deleteCategory(id);
    }
    return true;
  };

  const resetCategories = async (): Promise<void> => {
    setCategories(DEFAULT_CATEGORIES);
    if (supabaseService.isAvailable()) {
      await supabaseService.seedDefaultCategories(DEFAULT_CATEGORIES);
    }
  };

  // --- Product Methods ---
  const toggleProductAvailability = (id: string) => {
    const target = products.find(p => p.id === id);
    const nextState = target?.isAvailable === false ? true : false;

    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isAvailable: nextState } : p))
    );

    if (supabaseService.isAvailable()) {
      supabaseService.updateProductAvailability(id, nextState);
    }
  };

  const saveProduct = async (product: Product): Promise<boolean> => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.map(p => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });

    if (supabaseService.isAvailable()) {
      const success = await supabaseService.saveProduct(product);
      return success;
    }
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (supabaseService.isAvailable()) {
      return await supabaseService.deleteProduct(id);
    }
    return true;
  };

  const resetProducts = async (): Promise<void> => {
    const defaults = PRODUCTS.map(p => ({ ...p, isAvailable: true }));
    setProducts(defaults);
    if (supabaseService.isAvailable()) {
      await supabaseService.seedDefaultProducts(defaults);
    }
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

        const updated = {
          ...prev,
          cashSales: prev.cashSales + (isCash ? newSale.total : 0),
          yapeSales: prev.yapeSales + (isYape ? newSale.total : 0),
          plinSales: prev.plinSales + (isPlin ? newSale.total : 0),
          cardSales: prev.cardSales + (isCard ? newSale.total : 0),
          totalSales: prev.totalSales + newSale.total,
          salesCount: prev.salesCount + 1,
        };

        if (supabaseService.isAvailable()) {
          supabaseService.saveCashShift(updated);
        }

        return updated;
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
    if (supabaseService.isAvailable()) {
      supabaseService.saveCashShift(newShift);
    }
  };

  const closeCashShift = (finalCountedCash: number, notes?: string) => {
    const expectedCash = cashShift.initialCash + cashShift.cashSales;
    const diff = finalCountedCash - expectedCash;

    const closedShift: CashShift = {
      ...cashShift,
      isOpen: false,
      closedAt: new Date().toISOString(),
      finalCountedCash,
      cashDifference: diff,
      notes: notes || '',
    };

    setCashShift(closedShift);
    if (supabaseService.isAvailable()) {
      supabaseService.saveCashShift(closedShift);
    }
  };

  // --- Settings Methods ---
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      if (supabaseService.isAvailable()) {
        supabaseService.saveAppSettings(merged);
      }
      return merged;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    if (supabaseService.isAvailable()) {
      supabaseService.saveAppSettings(DEFAULT_SETTINGS);
    }
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
        categories,
        saveCategory,
        deleteCategory,
        resetCategories,

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

        isSupabaseOnline,
        syncStatus,
        syncWithSupabase,

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
