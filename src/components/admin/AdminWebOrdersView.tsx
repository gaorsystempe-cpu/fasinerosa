import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { 
  Bike, 
  ShoppingBag, 
  Utensils, 
  Printer, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Check, 
  MapPin, 
  Search, 
  AlertCircle,
  CreditCard,
  Banknote,
  SendHorizontal
} from 'lucide-react';
import { ThermalTicketModal } from './ThermalTicketModal';

export const AdminWebOrdersView: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderPaymentStatus, settings } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ticket Modal State
  const [selectedOrderForTicket, setSelectedOrderForTicket] = useState<Order | null>(null);
  const [ticketType, setTicketType] = useState<'cliente' | 'cocina'>('cliente');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const isPaid = order.paymentStatus === 'pagado';
      let matchStatus = true;
      if (statusFilter === 'pendientes') {
        matchStatus = order.status !== 'entregado' && order.status !== 'cancelado';
      } else if (statusFilter === 'por_pagar') {
        matchStatus = !isPaid && order.status !== 'entregado' && order.status !== 'cancelado';
      } else if (statusFilter === 'pagados') {
        matchStatus = isPaid && order.status !== 'entregado' && order.status !== 'cancelado';
      } else if (statusFilter === 'entregado') {
        matchStatus = order.status === 'entregado';
      }

      const matchSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customer.phone.includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pendientes: orders.filter(o => o.status !== 'entregado' && o.status !== 'cancelado').length,
      por_pagar: orders.filter(o => o.paymentStatus !== 'pagado' && o.status !== 'entregado' && o.status !== 'cancelado').length,
      pagados: orders.filter(o => o.paymentStatus === 'pagado' && o.status !== 'entregado' && o.status !== 'cancelado').length,
      entregados: orders.filter(o => o.status === 'entregado').length,
    };
  }, [orders]);

  // WhatsApp generator - Confirmación directa de despacho y envío
  const sendWhatsAppNotification = (order: Order) => {
    const isDelivery = order.customer.orderType === 'delivery';
    const isPickup = order.customer.orderType === 'pickup';
    const isPaid = order.paymentStatus === 'pagado';

    let msg = `Hola *${order.customer.fullName}*, te saludamos de *${settings.businessName}* (Puesto 651 - Mercado 2 de Surquillo).%0A%0A`;
    
    if (order.status === 'entregado') {
      msg += `🎉 Tu pedido *${order.orderNumber}* ha sido completado. ¡Muchas gracias por tu preferencia y buen provecho!`;
    } else if (order.status === 'en_camino') {
      if (isDelivery) {
        msg += `🛵 *¡CONFIRMACIÓN DE ENVÍO!*%0A`;
        msg += `Tu pedido *${order.orderNumber}* ya fue despachado y va en camino a tu dirección:%0A📍 *${order.customer.address || ''}*%0A%0A`;
        msg += `💰 *Estado de Pago:* ${isPaid ? '✅ PAGADO' : `Pendiente contraentrega (S/ ${order.total.toFixed(2)})`}%0A`;
        msg += `¡El motorizado llegará en breve!`;
      } else if (isPickup) {
        msg += `📍 *¡PEDIDO LISTO PARA RECOJO!*%0A`;
        msg += `Tu pedido *${order.orderNumber}* ya está empacado y listo para retirar en *Puesto 651 del Mercado 2 de Surquillo*.`;
      } else {
        msg += `🍽️ *¡PEDIDO LISTO!*%0A`;
        msg += `Tu pedido *${order.orderNumber}* para la *Mesa ${order.customer.tableNumber || '1'}* ya está saliendo caliente a tu mesa.`;
      }
    } else {
      // Estado inicial / recién pagado
      msg += `✅ Confirmamos tu pedido *${order.orderNumber}* por un total de *S/ ${order.total.toFixed(2)}*.%0A`;
      msg += `Estado del pago: *${isPaid ? 'PAGADO CONFORME' : 'Pendiente de confirmación'}*.%0A`;
      msg += `Ya está en marcha y te avisaremos al momento exacto del despacho.`;
    }

    const cleanPhone = order.customer.phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('51') ? cleanPhone : `51${cleanPhone}`;
    const url = `https://wa.me/${fullPhone}?text=${msg}`;
    window.open(url, '_blank');
  };

  const handlePrintTicket = (order: Order, type: 'cliente' | 'cocina') => {
    setSelectedOrderForTicket(order);
    setTicketType(type);
    setIsTicketModalOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* Top Header & Compact Status Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-teko text-2xl font-bold uppercase tracking-wider text-[#00167A] leading-none">
                Central de Pedidos Web
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-[#00167A]/10 text-[#00167A] text-[11px] font-bold">
                {counts.pendientes} activos
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Registra el pago, despacha el pedido y confirma el envío al cliente por WhatsApp.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pedido, cliente o cel..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#00167A] focus:outline-none"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              statusFilter === 'todos' ? 'bg-[#00167A] text-[#FFF3C1] shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>Todos</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{counts.all}</span>
          </button>

          <button
            onClick={() => setStatusFilter('pendientes')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              statusFilter === 'pendientes' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Por Despachar</span>
            {counts.pendientes > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] animate-pulse">
                {counts.pendientes}
              </span>
            )}
          </button>

          <button
            onClick={() => setStatusFilter('por_pagar')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              statusFilter === 'por_pagar' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Pendientes de Pago</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">{counts.por_pagar}</span>
          </button>

          <button
            onClick={() => setStatusFilter('pagados')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              statusFilter === 'pagados' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pagados (Listos)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{counts.pagados}</span>
          </button>

          <button
            onClick={() => setStatusFilter('entregado')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              statusFilter === 'entregado' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Entregados</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{counts.entregados}</span>
          </button>
        </div>
      </div>

      {/* Orders Grid - Compact 2-column or 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredOrders.map(order => {
          const isDelivery = order.customer.orderType === 'delivery';
          const isPickup = order.customer.orderType === 'pickup';
          const isPaid = order.paymentStatus === 'pagado';
          const isDispatched = order.status === 'en_camino';
          const isDelivered = order.status === 'entregado';

          return (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between shadow-2xs overflow-hidden ${
                isDelivered
                  ? 'border-gray-200 opacity-80'
                  : !isPaid
                  ? 'border-amber-300 ring-1 ring-amber-300/40'
                  : 'border-blue-200'
              }`}
            >
              {/* Order Card Compact Header */}
              <div className="px-3.5 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white shrink-0 ${
                    isDelivery ? 'bg-[#00167A]' : isPickup ? 'bg-amber-600' : 'bg-emerald-700'
                  }`}>
                    {isDelivery ? <Bike className="w-3.5 h-3.5" /> : isPickup ? <ShoppingBag className="w-3.5 h-3.5" /> : <Utensils className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-teko text-lg font-bold text-[#00167A] leading-none">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 truncate block font-medium">
                      {isDelivery ? 'Delivery' : isPickup ? 'Recojo en local' : `Mesa ${order.customer.tableNumber || '1'}`}
                    </span>
                  </div>
                </div>

                {/* Badges: Payment & Delivery Status */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                    isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isPaid ? 'Pagado' : 'Por Cobrar'}
                  </span>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                    isDelivered
                      ? 'bg-gray-100 text-gray-700'
                      : isDispatched
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isDelivered ? 'Entregado' : isDispatched ? 'En Camino' : 'En Cola'}
                  </span>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="p-3 space-y-2 flex-1 text-xs">
                {/* Client Info Line */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800 truncate max-w-[170px]">
                    {order.customer.fullName}
                  </span>
                  <span className="text-gray-500 font-mono text-[11px] font-semibold">
                    {order.customer.phone}
                  </span>
                </div>

                {/* Delivery Address Line (if delivery) */}
                {isDelivery && order.customer.address && (
                  <div className="p-2 bg-amber-50/60 border border-amber-200/50 rounded-lg text-gray-700">
                    <p className="font-medium text-[#00167A] flex items-center gap-1 text-[11px] leading-tight">
                      <MapPin className="w-3 h-3 shrink-0 text-amber-600" />
                      <span className="truncate">{order.customer.address}</span>
                    </p>
                    {order.customer.reference && (
                      <p className="text-[10px] text-gray-500 pl-4 truncate">
                        Ref: {order.customer.reference}
                      </p>
                    )}
                  </div>
                )}

                {/* Items preview - Compact List */}
                <div className="space-y-1 pt-1.5 border-t border-gray-100">
                  <div className="space-y-0.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-[11px] leading-tight">
                        <div className="truncate pr-2">
                          <span className="font-bold text-[#00167A]">{item.quantity}x</span>{' '}
                          <span className="text-gray-800">{item.product.name}</span>
                          {item.spiceLevel === 'picante_bravo' && (
                            <span className="text-red-600 font-bold ml-1 text-[9px]">🌶️ Bravo</span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-700 shrink-0">
                          S/ {item.itemTotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals & Payment Method */}
                <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span>Método:</span>
                    <strong className="text-gray-800 uppercase font-bold bg-gray-100 px-1.5 py-0.2 rounded">
                      {order.customer.paymentMethod}
                    </strong>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] font-bold text-gray-400">Total:</span>
                    <span className="font-teko text-xl font-bold text-[#00167A] leading-none">
                      S/ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: 1. Pago -> 2. Despachar/Entregar -> 3. WhatsApp */}
              <div className="p-2.5 bg-gray-50/90 border-t border-gray-100 space-y-1.5">
                {/* Main Operations Flow */}
                <div className="grid grid-cols-2 gap-1.5">
                  {/* Toggle Payment */}
                  <button
                    onClick={() => updateOrderPaymentStatus(order.id, isPaid ? 'pendiente' : 'pagado')}
                    className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                    }`}
                    title={isPaid ? 'Click para cambiar a pendiente' : 'Registrar pago verificado'}
                  >
                    {isPaid ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Pago Listo</span>
                      </>
                    ) : (
                      <>
                        <Banknote className="w-3.5 h-3.5" />
                        <span>Confirmar Pago</span>
                      </>
                    )}
                  </button>

                  {/* Dispatch / Deliver */}
                  {!isDispatched && !isDelivered && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'en_camino')}
                      className="py-1.5 px-2 bg-[#00167A] hover:bg-[#0D2594] text-[#FFF3C1] rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isDelivery ? 'Despachar' : 'Listo'}</span>
                    </button>
                  )}

                  {isDispatched && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'entregado')}
                      className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Entregar</span>
                    </button>
                  )}

                  {isDelivered && (
                    <div className="py-1.5 px-2 bg-gray-200 text-gray-600 rounded-lg font-bold text-xs flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completado</span>
                    </div>
                  )}
                </div>

                {/* WhatsApp Confirm & Ticket Action Bar */}
                <div className="flex gap-1.5 pt-0.5">
                  <button
                    onClick={() => sendWhatsAppNotification(order)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                    <span>Confirmar Envío WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handlePrintTicket(order, 'cliente')}
                    className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-all shrink-0"
                    title="Imprimir Ticket"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400 space-y-1.5">
          <AlertCircle className="w-7 h-7 mx-auto text-gray-300" />
          <p className="text-xs font-semibold">No se encontraron pedidos con los criterios actuales.</p>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedOrderForTicket && (
        <ThermalTicketModal
          order={selectedOrderForTicket}
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          ticketType={ticketType}
        />
      )}
    </div>
  );
};
