import React, { useState } from 'react';
import { CartItem, CustomerData, OrderType, PaymentMethod, Order } from '../types';
import { X, Check, MapPin, Phone, User, CreditCard, DollarSign, Smartphone, MessageSquare, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { BrandLogo, BrandEmblem } from './BrandLogo';
import { useStore } from '../context/StoreContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  appliedCoupon: string | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  appliedCoupon,
  onOrderSuccess,
}) => {
  const { settings, addWebOrder } = useStore();

  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [tableNumber, setTableNumber] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('yape');
  const [cashAmount, setCashAmount] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const FREE_DELIVERY_THRESHOLD = settings.freeDeliveryThreshold || 80;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  
  const baseDeliveryFee = settings.baseDeliveryFee || 6;
  const deliveryFee = orderType === 'delivery' ? (isFreeDelivery ? 0 : baseDeliveryFee) : 0;
  const discount = appliedCoupon === 'FACINEROSA10' ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMsg('Por favor ingresa un número de teléfono/WhatsApp válido.');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      setErrorMsg('Por favor ingresa tu dirección de entrega y distrito.');
      return;
    }

    const orderNumber = `LF-${Math.floor(1000 + Math.random() * 9000)}`;

    const customerData: CustomerData = {
      fullName,
      phone,
      orderType,
      tableNumber: orderType === 'mesa' ? tableNumber : undefined,
      address: orderType === 'delivery' ? address : undefined,
      reference: orderType === 'delivery' ? reference : undefined,
      paymentMethod,
      cashAmount: paymentMethod === 'efectivo' && cashAmount ? parseFloat(cashAmount) : undefined,
      couponCode: appliedCoupon || undefined,
      discountAmount: discount,
      deliveryFee,
    };

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      items,
      customer: customerData,
      subtotal,
      discount,
      deliveryFee,
      total,
      status: 'recibido',
    };

    // Save to global Store state so Admin panel sees it in real-time
    addWebOrder(newOrder);

    // Construct WhatsApp message
    let whatsappText = `¡Hola *${settings.businessName}*! 🌶️🐟\n`;
    whatsappText += `Deseo confirmar mi pedido web *#${orderNumber}*:\n\n`;
    whatsappText += `👤 *Cliente:* ${fullName}\n`;
    whatsappText += `📱 *Teléfono:* ${phone}\n`;
    whatsappText += `📍 *Modalidad:* ${
      orderType === 'delivery'
        ? `Delivery a domicilio: ${address} ${reference ? `(Ref: ${reference})` : ''}`
        : orderType === 'pickup'
        ? `Recojo en Local (${settings.address})`
        : `Consumo en Puesto / Mesa #${tableNumber} (${settings.address})`
    }\n\n`;
    whatsappText += `📋 *DETALLE DEL PEDIDO:*\n`;

    items.forEach((item, index) => {
      whatsappText += `${index + 1}. *${item.quantity}x ${item.product.name}* (S/ ${item.itemTotal.toFixed(2)})\n`;
      whatsappText += `   • Ají: ${item.spiceLevel === 'sin_aji' ? 'Sin ají' : item.spiceLevel === 'picante_bravo' ? 'Picante Bravo' : 'Toque Piurano'}\n`;
      if (item.selectedExtras.length > 0) {
        whatsappText += `   • Extras: ${item.selectedExtras.map(e => e.name).join(', ')}\n`;
      }
      if (item.specialInstructions) {
        whatsappText += `   • Nota: "${item.specialInstructions}"\n`;
      }
    });

    whatsappText += `\n💵 *RESUMEN:*\n`;
    whatsappText += `• Subtotal: S/ ${subtotal.toFixed(2)}\n`;
    if (discount > 0) whatsappText += `• Descuento (${appliedCoupon}): -S/ ${discount.toFixed(2)}\n`;
    if (orderType === 'delivery') whatsappText += `• Costo Envío: ${deliveryFee === 0 ? 'GRATIS' : `S/ ${deliveryFee.toFixed(2)}`}\n`;
    whatsappText += `• *TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n\n`;
    whatsappText += `💳 *Método de Pago:* ${
      paymentMethod === 'yape'
        ? 'Yape'
        : paymentMethod === 'plin'
        ? 'Plin'
        : paymentMethod === 'efectivo'
        ? `Efectivo (Paga con S/ ${cashAmount || total.toFixed(2)})`
        : 'Tarjeta / POS contra entrega'
    }\n\n`;
    whatsappText += `¡Quedo a la espera de su confirmación para comenzar la preparación en el Mercado 2 de Surquillo! 🔥`;

    const cleanPhone = settings.phone.replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    // Notify parent component to show order tracker
    onOrderSuccess(newOrder);
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#00167A]/20 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#00167A] text-[#FFF3C1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandEmblem size={28} color="#FFF3C1" />
            <div>
              <h2 className="font-teko text-2xl sm:text-3xl font-bold uppercase tracking-wider leading-none">
                Finalizar Pedido • La Facinerosa
              </h2>
              <p className="text-[11px] text-white/80">
                Completa tus datos para enviar la comanda directamente al fogón
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Customer Personal Details */}
          <div>
            <h3 className="font-teko text-xl font-bold uppercase text-[#00167A] mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>1. Datos de Contacto</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#2C2D2F] block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Carmen Zúñiga"
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00167A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C2D2F] block mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 969 823 145"
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00167A]"
                />
              </div>
            </div>
          </div>

          {/* Delivery or Pickup Details */}
          <div className="pt-2 border-t border-gray-100">
            <h3 className="font-teko text-xl font-bold uppercase text-[#00167A] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>
                2. {orderType === 'delivery' ? 'Dirección de Entrega' : orderType === 'pickup' ? 'Punto de Recojo' : 'Mesa de Atención'}
              </span>
            </h3>

            {orderType === 'delivery' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#2C2D2F] block mb-1">
                    Dirección exacta de entrega *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Av. Angamos Este 1234, Dpto 402 / Jr. Dante 350"
                    className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00167A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C2D2F] block mb-1">
                    Referencia de entrega
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ej: Frente al parque, reja negra, tocar timbre 2B"
                    className="w-full px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00167A]"
                  />
                </div>
              </div>
            ) : orderType === 'pickup' ? (
              <div className="p-4 bg-[#FFF3C1]/50 border border-amber-200 rounded-xl text-xs text-[#00167A] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Recoge tu pedido en nuestro local:
                </p>
                <p className="text-[#2C2D2F]">
                  📍 <strong>Mercado 2 de Surquillo, Puesto 651, Surquillo, Lima</strong>
                </p>
                <p className="text-gray-500 text-[11px]">
                  Tiempo estimado de preparación: 20-25 minutos. Te avisaremos por WhatsApp cuando esté listo.
                </p>
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-[#2C2D2F] block mb-1">
                  Número de Mesa / Puesto *
                </label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Ej: Mesa 4 / Barra puesto 651"
                  className="w-full sm:w-60 px-3.5 py-2.5 bg-[#F9F9F9] border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00167A]"
                />
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="pt-2 border-t border-gray-100">
            <h3 className="font-teko text-xl font-bold uppercase text-[#00167A] mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>3. Método de Pago</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'yape', label: 'YAPE', desc: '969 823 145', icon: Smartphone },
                { id: 'plin', label: 'PLIN', desc: '969 823 145', icon: Smartphone },
                { id: 'efectivo', label: 'Efectivo', desc: 'Contra entrega', icon: DollarSign },
                { id: 'pos', label: 'POS Tarjeta', desc: 'Visa / MC', icon: CreditCard },
              ].map((method) => {
                const isSelected = paymentMethod === method.id;
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#00167A] bg-[#00167A]/5 text-[#00167A] ring-2 ring-[#00167A]'
                        : 'border-gray-200 text-[#2C2D2F] hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#00167A]' : 'text-gray-500'}`} />
                    <div className="text-xs font-bold">{method.label}</div>
                    <div className="text-[10px] text-gray-500">{method.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Sub-options for payment */}
            {(paymentMethod === 'yape' || paymentMethod === 'plin') && (
              <div className="mt-3 p-3.5 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-purple-600 text-white rounded-lg font-bold text-xs">
                  {paymentMethod.toUpperCase()}
                </div>
                <div className="text-xs text-purple-950">
                  <p className="font-bold">Transferir al número: <strong>969 823 145</strong></p>
                  <p className="text-[11px] text-purple-800">Titular: <em>La Facinerosa Picantería E.I.R.L.</em></p>
                </div>
              </div>
            )}

            {paymentMethod === 'efectivo' && (
              <div className="mt-3 p-3 bg-[#F9F9F9] border border-gray-200 rounded-xl">
                <label className="text-xs font-semibold text-[#2C2D2F] block mb-1">
                  ¿Con cuánto efectivo vas a pagar? (Para llevarte vuelto exacto)
                </label>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder={`Ej: S/ ${(Math.ceil(total / 10) * 10).toFixed(2)}`}
                  className="w-full sm:w-64 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                />
              </div>
            )}
          </div>

          {/* Order Summary Box */}
          <div className="p-4 bg-[#F9F9F9] rounded-xl border border-gray-200 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{items.length} platos seleccionados</span>
              <span className="font-semibold text-[#2C2D2F]">S/ {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600">
                <span>Descuento cupón</span>
                <span>- S/ {discount.toFixed(2)}</span>
              </div>
            )}
            {orderType === 'delivery' && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Costo Delivery</span>
                <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-[#2C2D2F]'}>
                  {deliveryFee === 0 ? 'GRATIS' : `S/ ${deliveryFee.toFixed(2)}`}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline font-bold text-[#00167A]">
              <span className="text-sm uppercase">Total a Pagar</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs">S/</span>
                <span className="font-teko text-3xl leading-none">{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="space-y-2 pt-2">
            <button
              id="submit-order-whatsapp-btn"
              type="submit"
              className="w-full py-4 bg-[#00167A] hover:bg-[#00167A]/90 text-[#FFF3C1] font-bold rounded-xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Confirmar y Enviar Pedido por WhatsApp</span>
            </button>

            <p className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Atención inmediata en línea • Emisión de boleta o factura</span>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
