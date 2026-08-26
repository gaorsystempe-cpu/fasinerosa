import React from 'react';
import { POSSale, Order } from '../../types';
import { X, Printer, CheckCircle, Share2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ThermalTicketModalProps {
  sale?: POSSale;
  order?: Order;
  isOpen: boolean;
  onClose: () => void;
  ticketType?: 'cliente' | 'cocina';
}

export const ThermalTicketModal: React.FC<ThermalTicketModalProps> = ({
  sale,
  order,
  isOpen,
  onClose,
  ticketType = 'cliente',
}) => {
  const { settings } = useStore();

  if (!isOpen || (!sale && !order)) return null;

  const isPOS = !!sale;
  const number = isPOS ? sale.saleNumber : order?.orderNumber;
  const date = new Date(isPOS ? sale.createdAt : order?.createdAt || Date.now()).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const items = isPOS ? sale.items : order?.items || [];
  const subtotal = isPOS ? sale.subtotal : order?.subtotal || 0;
  const discount = isPOS ? sale.discount : order?.discount || 0;
  const deliveryFee = !isPOS ? order?.deliveryFee || 0 : 0;
  const total = isPOS ? sale.total : order?.total || 0;
  const paymentMethod = isPOS ? sale.paymentMethod : order?.customer.paymentMethod || 'efectivo';
  
  const customerName = isPOS ? (sale.customerName || 'Cliente Mostrador') : order?.customer.fullName;
  const saleTypeLabel = isPOS 
    ? (sale.saleType === 'mesa' ? `Mesa: ${sale.tableNumber || '1'}` : sale.saleType === 'llevar' ? 'Para Llevar' : 'Mostrador Puesto 651')
    : (order?.customer.orderType === 'delivery' ? 'Delivery a Domicilio' : order?.customer.orderType === 'pickup' ? 'Recojo en Local' : `Mesa: ${order?.customer.tableNumber}`);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in print:bg-white print:p-0">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-w-none print:shadow-none print:w-full">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-3 bg-gray-900 text-white flex items-center justify-between print:hidden">
          <span className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
            <Printer className="w-3.5 h-3.5" />
            {ticketType === 'cocina' ? 'Comanda de Cocina' : 'Ticket de Venta / Consumo'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3 h-3" /> Imprimir
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Paper */}
        <div className="p-5 bg-white overflow-y-auto font-mono text-xs text-gray-800 space-y-3 leading-tight select-text">
          {/* Header */}
          <div className="text-center pb-2 border-b border-dashed border-gray-400 space-y-1">
            <h3 className="font-bold text-sm uppercase tracking-wider text-black">
              {settings.businessName}
            </h3>
            <p className="text-[10px] text-gray-600">{settings.businessTagline}</p>
            <p className="text-[10px] text-gray-600">{settings.address}</p>
            <p className="text-[10px] text-gray-600">WhatsApp: {settings.phone}</p>
            <div className="pt-1 font-bold text-xs uppercase bg-gray-100 py-0.5 rounded text-black">
              {ticketType === 'cocina' ? '*** COMANDA DE COCINA ***' : '*** TICKET DE CONSUMO ***'}
            </div>
          </div>

          {/* Metadata */}
          <div className="text-[11px] space-y-0.5 pb-2 border-b border-dashed border-gray-400">
            <div className="flex justify-between">
              <span>Nro Ticket:</span>
              <strong className="text-black">{number}</strong>
            </div>
            <div className="flex justify-between">
              <span>Fecha:</span>
              <span>{date}</span>
            </div>
            <div className="flex justify-between">
              <span>Atención:</span>
              <strong className="text-black">{saleTypeLabel}</strong>
            </div>
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span>{customerName}</span>
            </div>
            {!isPOS && order?.customer.phone && (
              <div className="flex justify-between">
                <span>Teléfono:</span>
                <span>{order.customer.phone}</span>
              </div>
            )}
            {!isPOS && order?.customer.address && (
              <div className="pt-1 text-[10px] text-gray-700">
                <span>📍 Dirección: {order.customer.address}</span>
                {order.customer.reference && <span> (Ref: {order.customer.reference})</span>}
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="py-1 border-b border-dashed border-gray-400 space-y-2">
            <div className="flex justify-between font-bold text-[10px] text-gray-600 pb-1 border-b border-gray-200">
              <span>CANT. PLATO / DETALLE</span>
              <span>TOTAL</span>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between font-semibold text-black">
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span>S/ {item.itemTotal.toFixed(2)}</span>
                </div>
                
                {/* Spice & Extras */}
                <div className="text-[10px] text-gray-500 pl-3">
                  {item.spiceLevel === 'picante_bravo' && <div className="text-red-600 font-bold">🌶️ PICANTE BRAVO</div>}
                  {item.spiceLevel === 'medio' && <div>🌶️ Picante medio</div>}
                  {item.spiceLevel === 'sin_aji' && <div>🚫 Sin ají</div>}
                  
                  {item.selectedExtras?.map(ex => (
                    <div key={ex.id}>+ {ex.name} (S/ {ex.price})</div>
                  ))}

                  {item.specialInstructions && (
                    <div className="italic text-amber-800 bg-amber-50 px-1 py-0.5 rounded mt-0.5">
                      Nota: {item.specialInstructions}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals (if not only kitchen comanda) */}
          {ticketType !== 'cocina' && (
            <div className="space-y-1 text-xs pt-1 pb-2 border-b border-dashed border-gray-400">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Descuento:</span>
                  <span>- S/ {discount.toFixed(2)}</span>
                </div>
              )}
              {deliveryFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery:</span>
                  <span>S/ {deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-black pt-1 border-t border-gray-300">
                <span>TOTAL A PAGAR:</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-600 pt-1">
                <span>Medio de Pago:</span>
                <span className="uppercase font-bold text-black">{paymentMethod}</span>
              </div>
              {isPOS && sale.cashGiven && (
                <>
                  <div className="flex justify-between text-[11px] text-gray-600">
                    <span>Efectivo recibido:</span>
                    <span>S/ {sale.cashGiven.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-800 font-bold">
                    <span>Vuelto:</span>
                    <span>S/ {(sale.changeAmount || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-2 space-y-1 text-[10px] text-gray-500">
            <p className="font-bold text-gray-800">¡GRACIAS POR SU PREFERENCIA!</p>
            <p>Comprobante de consumo interno</p>
            <p>La Facinerosa Picantería - Mercado 2 Surquillo</p>
          </div>
        </div>
      </div>
    </div>
  );
};
