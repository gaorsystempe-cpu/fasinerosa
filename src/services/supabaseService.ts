import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order, POSSale, OrderStatus, OrderPaymentStatus } from '../types';

export const supabaseService = {
  isAvailable: () => isSupabaseConfigured && !!supabase,

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
        amount_tendered: sale.cashGiven || null,
        change_due: sale.changeAmount || 0,
        subtotal: sale.subtotal,
        discount_amount: sale.discount || 0,
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
      console.warn('Failed to subscribe to Supabase realtime:', e);
      return null;
    }
  },
};
