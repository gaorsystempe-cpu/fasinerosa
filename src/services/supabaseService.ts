import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order, POSSale, OrderStatus, OrderPaymentStatus, Product, CashShift, AppSettings, ExtraOption, Category } from '../types';

export const supabaseService = {
  isAvailable: () => isSupabaseConfigured && !!supabase,

  // --- HEALTH & TEST CONNECTION ---
  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (!this.isAvailable() || !supabase) {
      return { ok: false, message: 'Variables de Supabase no configuradas o incompletas' };
    }
    try {
      const { data, error } = await supabase.from('app_settings').select('id').limit(1);
      if (error) {
        return { ok: false, message: `Error en schema la_facinerosa: ${error.message}` };
      }
      return { ok: true, message: 'Conectado exitosamente con Supabase y schema la_facinerosa' };
    } catch (e: any) {
      return { ok: false, message: `Excepción de red: ${e?.message || 'Desconocido'}` };
    }
  },

  // --- ORDERS ---
  async getWebOrders(): Promise<Order[] | null> {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('web_orders')
        .select(`
          *,
          web_order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching orders from Supabase:', error.message);
        return null;
      }

      if (!data) return [];

      return data.map((row: any) => ({
        id: row.id,
        orderNumber: row.order_number,
        createdAt: row.created_at,
        customer: {
          fullName: row.full_name,
          phone: row.phone,
          orderType: row.order_type,
          tableNumber: row.table_number,
          address: row.address,
          reference: row.reference,
          district: row.district,
          paymentMethod: row.payment_method,
          cashAmount: row.cash_amount ? Number(row.cash_amount) : undefined,
          couponCode: row.coupon_code,
          deliveryFee: Number(row.delivery_fee || 0),
          discountAmount: Number(row.discount_amount || 0),
        },
        items: (row.web_order_items || []).map((item: any, idx: number) => ({
          id: item.id || `item-${idx}`,
          product: {
            id: item.product_id || '',
            name: item.product_name,
            price: Number(item.unit_price),
            description: '',
            category: 'especiales',
            image: '',
          },
          quantity: item.quantity,
          spiceLevel: item.spice_level,
          selectedExtras: item.selected_extras || [],
          specialInstructions: item.special_instructions,
          itemTotal: Number(item.item_total),
        })),
        subtotal: Number(row.subtotal),
        discount: Number(row.discount_amount || 0),
        deliveryFee: Number(row.delivery_fee || 0),
        total: Number(row.total),
        status: row.status as OrderStatus,
        paymentStatus: row.payment_status as OrderPaymentStatus,
        paidAt: row.paid_at,
        notes: row.notes,
      }));
    } catch (e) {
      console.warn('Supabase getWebOrders error:', e);
      return null;
    }
  },

  async createWebOrder(order: Order): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error: orderError } = await supabase.from('web_orders').insert({
        id: order.id,
        order_number: order.orderNumber,
        full_name: order.customer.fullName,
        phone: order.customer.phone,
        order_type: order.customer.orderType,
        table_number: order.customer.tableNumber || null,
        address: order.customer.address || null,
        reference: order.customer.reference || null,
        district: order.customer.district || null,
        payment_method: order.customer.paymentMethod,
        cash_amount: order.customer.cashAmount || null,
        coupon_code: order.customer.couponCode || null,
        discount_amount: order.discount || 0,
        delivery_fee: order.deliveryFee || 0,
        subtotal: order.subtotal,
        total: order.total,
        status: order.status,
        payment_status: order.paymentStatus || 'pendiente',
        paid_at: order.paidAt || null,
        notes: order.notes || null,
        created_at: order.createdAt,
      });

      if (orderError) {
        console.warn('Error inserting web_order in Supabase:', orderError.message);
        return false;
      }

      if (order.items && order.items.length > 0) {
        const itemsToInsert = order.items.map(item => ({
          order_id: order.id,
          product_id: item.product.id || null,
          product_name: item.product.name,
          unit_price: item.product.price,
          quantity: item.quantity,
          spice_level: item.spiceLevel || 'medio',
          selected_extras: item.selectedExtras || [],
          special_instructions: item.specialInstructions || null,
          item_total: item.itemTotal,
        }));

        const { error: itemsError } = await supabase.from('web_order_items').insert(itemsToInsert);
        if (itemsError) {
          console.warn('Error inserting web_order_items in Supabase:', itemsError.message);
        }
      }

      return true;
    } catch (e) {
      console.warn('Supabase createWebOrder exception:', e);
      return false;
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('web_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      return !error;
    } catch (e) {
      console.warn('Supabase updateOrderStatus error:', e);
      return false;
    }
  },

  async updateOrderPaymentStatus(orderId: string, paymentStatus: OrderPaymentStatus, paidAt?: string): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('web_orders')
        .update({ 
          payment_status: paymentStatus, 
          paid_at: paidAt || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);
      return !error;
    } catch (e) {
      console.warn('Supabase updateOrderPaymentStatus error:', e);
      return false;
    }
  },

  // --- POS SALES ---
  async getPOSSales(): Promise<POSSale[] | null> {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('pos_sales')
        .select(`
          *,
          pos_sale_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching POS sales from Supabase:', error.message);
        return null;
      }

      if (!data) return [];

      return data.map((row: any) => ({
        id: row.id,
        saleNumber: row.sale_number,
        saleType: row.sale_type,
        tableNumber: row.table_number,
        cashierName: row.cashier_name,
        customerName: row.customer_name,
        customerDoc: row.customer_doc,
        paymentMethod: row.payment_method,
        cashGiven: row.cash_given ? Number(row.cash_given) : (row.amount_tendered ? Number(row.amount_tendered) : undefined),
        changeAmount: Number(row.change_amount || row.change_due || 0),
        subtotal: Number(row.subtotal),
        discount: Number(row.discount || row.discount_amount || 0),
        total: Number(row.total),
        status: row.status,
        createdAt: row.created_at,
        items: (row.pos_sale_items || []).map((item: any, idx: number) => ({
          id: item.id || `pos-item-${idx}`,
          product: {
            id: item.product_id || '',
            name: item.product_name,
            price: Number(item.unit_price),
            description: '',
            category: 'especiales',
            image: '',
          },
          quantity: item.quantity,
          spiceLevel: item.spice_level,
          selectedExtras: item.selected_extras || [],
          itemTotal: Number(item.item_total),
        })),
      }));
    } catch (e) {
      console.warn('Supabase getPOSSales error:', e);
      return null;
    }
  },

  async createPOSSale(sale: POSSale): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error: saleError } = await supabase.from('pos_sales').insert({
        id: sale.id,
        sale_number: sale.saleNumber,
        sale_type: sale.saleType,
        table_number: sale.tableNumber || null,
        cashier_name: sale.cashierName,
        customer_name: sale.customerName || null,
        customer_doc: sale.customerDoc || null,
        payment_method: sale.paymentMethod,
        cash_given: sale.cashGiven || null,
        change_amount: sale.changeAmount || 0,
        subtotal: sale.subtotal,
        discount: sale.discount || 0,
        total: sale.total,
        status: sale.status,
        created_at: sale.createdAt,
      });

      if (saleError) {
        console.warn('Error inserting pos_sale in Supabase:', saleError.message);
        return false;
      }

      if (sale.items && sale.items.length > 0) {
        const itemsToInsert = sale.items.map(item => ({
          sale_id: sale.id,
          product_id: item.product.id || null,
          product_name: item.product.name,
          unit_price: item.product.price,
          quantity: item.quantity,
          spice_level: item.spiceLevel || 'medio',
          selected_extras: item.selectedExtras || [],
          item_total: item.itemTotal,
        }));

        await supabase.from('pos_sale_items').insert(itemsToInsert);
      }

      return true;
    } catch (e) {
      console.warn('Supabase createPOSSale exception:', e);
      return false;
    }
  },

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[] | null> {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_extras (*)
        `)
        .order('display_order', { ascending: true });

      if (error || !data) {
        console.warn('Error fetching products from Supabase:', error?.message);
        return null;
      }

      if (data.length === 0) {
        return [];
      }

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: Number(row.price),
        category: row.category_code,
        image: row.image_url,
        badge: row.badge,
        isPopular: Boolean(row.is_popular),
        isSpicy: Boolean(row.is_spicy),
        isAvailable: row.is_available ?? true,
        prepTime: row.prep_time,
        portions: row.portions,
        availableExtras: row.product_extras && row.product_extras.length > 0
          ? row.product_extras.map((ex: any) => ({
              id: ex.id,
              name: ex.name,
              price: Number(ex.price || 0),
            }))
          : undefined,
      }));
    } catch (e) {
      console.warn('Supabase getProducts error:', e);
      return null;
    }
  },

  async saveProduct(product: Product): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const categoryCode = product.category || 'insignias';

      const { error } = await supabase.from('products').upsert({
        id: product.id,
        category_code: categoryCode,
        name: product.name,
        description: product.description || '',
        price: Number(product.price),
        image_url: product.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        badge: product.badge || null,
        is_popular: Boolean(product.isPopular),
        is_spicy: Boolean(product.isSpicy),
        is_available: product.isAvailable !== false,
        prep_time: product.prepTime || '15-20 min',
        portions: product.portions || '1-2 personas',
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error saving product in Supabase:', error.message);
        return false;
      }

      // 2. Save available extras if provided
      if (product.availableExtras && product.availableExtras.length > 0) {
        const extrasToUpsert = product.availableExtras.map((ex, idx) => ({
          id: ex.id ? `${product.id}-${ex.id}` : `${product.id}-ex-${idx}`,
          product_id: product.id,
          name: ex.name,
          price: Number(ex.price || 0),
          is_available: true,
        }));

        await supabase.from('product_extras').upsert(extrasToUpsert);
      }

      return true;
    } catch (e) {
      console.error('Supabase saveProduct exception:', e);
      return false;
    }
  },

  async deleteProduct(productId: string): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        console.warn('Error deleting product in Supabase:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  async seedDefaultProducts(defaultProducts: Product[]): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      for (const p of defaultProducts) {
        await this.saveProduct(p);
      }
      return true;
    } catch (e) {
      console.warn('Error seeding products:', e);
      return false;
    }
  },

  async updateProductAvailability(productId: string, isAvailable: boolean): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
        .eq('id', productId);
      return !error;
    } catch (e) {
      return false;
    }
  },

  // --- CATEGORIES CRUD ---
  async getCategories(): Promise<Category[] | null> {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Supabase getCategories error:', error.message);
        return null;
      }

      if (!data || data.length === 0) return [];

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        icon: row.icon || 'Utensils',
        image: row.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        badge: row.badge || undefined,
        description: row.description || undefined,
        sortOrder: row.sort_order ?? 0,
      }));
    } catch (e) {
      console.warn('Supabase getCategories exception:', e);
      return null;
    }
  },

  async saveCategory(category: Category): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error } = await supabase.from('categories').upsert({
        id: category.id,
        name: category.name,
        icon: category.icon || 'Utensils',
        image_url: category.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        badge: category.badge || null,
        description: category.description || null,
        sort_order: category.sortOrder ?? 0,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error saving category in Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Exception saving category:', e);
      return false;
    }
  },

  async deleteCategory(categoryId: string): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (error) {
        console.warn('Error deleting category in Supabase:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  async seedDefaultCategories(defaultCategories: Category[]): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      for (const cat of defaultCategories) {
        await this.saveCategory(cat);
      }
      return true;
    } catch (e) {
      console.warn('Error seeding categories in Supabase:', e);
      return false;
    }
  },

  // --- CASH SHIFT ---
  async getActiveCashShift(): Promise<CashShift | null> {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('cash_shifts')
        .select('*')
        .eq('is_open', true)
        .order('opened_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        isOpen: data.is_open,
        openedAt: data.opened_at,
        closedAt: data.closed_at,
        initialCash: Number(data.initial_cash || 0),
        cashierName: data.cashier_name || 'Cajero Principal',
        cashSales: Number(data.cash_sales || 0),
        yapeSales: Number(data.yape_sales || 0),
        plinSales: Number(data.plin_sales || 0),
        cardSales: Number(data.card_sales || 0),
        totalSales: Number(data.total_sales || 0),
        salesCount: Number(data.sales_count || 0),
        finalCountedCash: data.final_counted_cash ? Number(data.final_counted_cash) : undefined,
        cashDifference: data.cash_difference ? Number(data.cash_difference) : undefined,
        notes: data.notes || '',
      };
    } catch {
      return null;
    }
  },

  async saveCashShift(shift: CashShift): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error } = await supabase.from('cash_shifts').upsert({
        id: shift.id,
        is_open: shift.isOpen,
        opened_at: shift.openedAt,
        closed_at: shift.closedAt || null,
        initial_cash: shift.initialCash,
        cashier_name: shift.cashierName,
        cash_sales: shift.cashSales,
        yape_sales: shift.yapeSales,
        plin_sales: shift.plinSales,
        card_sales: shift.cardSales,
        total_sales: shift.totalSales,
        sales_count: shift.salesCount,
        final_counted_cash: shift.finalCountedCash || null,
        cash_difference: shift.cashDifference || null,
        notes: shift.notes || null,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch {
      return false;
    }
  },

  // --- APP SETTINGS ---
  async getAppSettings(): Promise<AppSettings | null> {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (error || !data) return null;

      return {
        businessName: data.business_name,
        businessTagline: data.business_tagline,
        address: data.address,
        locationReference: data.location_reference,
        phone: data.phone,
        whatsappNumber: data.whatsapp_number,
        openingHours: data.opening_hours,
        bannerNotice: data.banner_notice,
        heroBadge: data.hero_badge,
        heroTitle: data.hero_title,
        heroSubtitle: data.hero_subtitle,
        heroImage: data.hero_image,
        socialInstagram: data.social_instagram,
        socialTiktok: data.social_tiktok,
        socialFacebook: data.social_facebook,
        socialGoogleMaps: data.social_google_maps,
        freeDeliveryThreshold: Number(data.free_delivery_threshold || 80),
        baseDeliveryFee: Number(data.base_delivery_fee || 6),
        adminPin: data.admin_pin || '1982',
      };
    } catch {
      return null;
    }
  },

  async saveAppSettings(settings: AppSettings): Promise<boolean> {
    if (!this.isAvailable() || !supabase) return false;
    try {
      const { error } = await supabase.from('app_settings').upsert({
        id: 'default',
        business_name: settings.businessName,
        business_tagline: settings.businessTagline,
        address: settings.address,
        location_reference: settings.locationReference,
        phone: settings.phone,
        whatsapp_number: settings.whatsappNumber,
        opening_hours: settings.openingHours,
        banner_notice: settings.bannerNotice,
        hero_badge: settings.heroBadge,
        hero_title: settings.heroTitle,
        hero_subtitle: settings.heroSubtitle,
        hero_image: settings.heroImage,
        social_instagram: settings.socialInstagram,
        social_tiktok: settings.socialTiktok,
        social_facebook: settings.socialFacebook,
        social_google_maps: settings.socialGoogleMaps,
        free_delivery_threshold: settings.freeDeliveryThreshold,
        base_delivery_fee: settings.baseDeliveryFee,
        admin_pin: settings.adminPin,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch {
      return false;
    }
  },

  // --- STORAGE / IMAGES UPLOAD ---
  async uploadImage(file: File, folder: string = 'dishes'): Promise<{ url: string | null; error?: string }> {
    if (!this.isAvailable() || !supabase) {
      // Fallback: Read as base64 data URL if offline/unconfigured
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ url: reader.result as string });
        };
        reader.onerror = () => {
          resolve({ url: null, error: 'Error leyendo archivo local' });
        };
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('la_facinerosa_images')
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.warn('Supabase storage upload error:', error.message);
        // If bucket doesn't exist or policy blocked, convert to optimized data URL so user isn't stuck
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ url: reader.result as string, error: error.message });
          };
          reader.readAsDataURL(file);
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from('la_facinerosa_images')
        .getPublicUrl(cleanFileName);

      return { url: publicUrlData.publicUrl };
    } catch (e: any) {
      console.warn('Exception in uploadImage:', e);
      return { url: null, error: e?.message || 'Error al subir imagen' };
    }
  },

  // --- REALTIME SUBSCRIPTIONS ---
  subscribeToOrders(onNewOrUpdatedOrder: (payload: any) => void) {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const channel = supabase
        .channel('web_orders_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'la_facinerosa', table: 'web_orders' },
          (payload) => {
            onNewOrUpdatedOrder(payload);
          }
        )
        .subscribe();

      return channel;
    } catch (e) {
      console.warn('Failed to subscribe to Supabase web_orders realtime:', e);
      return null;
    }
  },

  subscribeToPOSSales(onNewOrUpdatedSale: (payload: any) => void) {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const channel = supabase
        .channel('pos_sales_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'la_facinerosa', table: 'pos_sales' },
          (payload) => {
            onNewOrUpdatedSale(payload);
          }
        )
        .subscribe();

      return channel;
    } catch (e) {
      console.warn('Failed to subscribe to Supabase pos_sales realtime:', e);
      return null;
    }
  },

  subscribeToProducts(onProductsChange: (payload: any) => void) {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const channel = supabase
        .channel('products_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'la_facinerosa', table: 'products' },
          (payload) => {
            onProductsChange(payload);
          }
        )
        .subscribe();

      return channel;
    } catch (e) {
      console.warn('Failed to subscribe to Supabase products realtime:', e);
      return null;
    }
  },

  subscribeToCategories(onCategoriesChange: (payload: any) => void) {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const channel = supabase
        .channel('categories_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'la_facinerosa', table: 'categories' },
          (payload) => {
            onCategoriesChange(payload);
          }
        )
        .subscribe();

      return channel;
    } catch (e) {
      console.warn('Failed to subscribe to Supabase categories realtime:', e);
      return null;
    }
  },

  subscribeToSettings(onSettingsChange: (payload: any) => void) {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const channel = supabase
        .channel('settings_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'la_facinerosa', table: 'app_settings' },
          (payload) => {
            onSettingsChange(payload);
          }
        )
        .subscribe();

      return channel;
    } catch (e) {
      console.warn('Failed to subscribe to Supabase settings realtime:', e);
      return null;
    }
  },

  subscribeToCashShifts(onShiftChange: (payload: any) => void) {
    if (!this.isAvailable() || !supabase) return null;
    try {
      const channel = supabase
        .channel('cash_shifts_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'la_facinerosa', table: 'cash_shifts' },
          (payload) => {
            onShiftChange(payload);
          }
        )
        .subscribe();

      return channel;
    } catch (e) {
      console.warn('Failed to subscribe to Supabase cash_shifts realtime:', e);
      return null;
    }
  },
};
