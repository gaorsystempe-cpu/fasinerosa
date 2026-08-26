import React, { useState } from 'react';
import { CartItem, OrderType } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { BrandLogo, BrandEmblem } from './BrandLogo';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderType,
  onChangeOrderType,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const FREE_DELIVERY_THRESHOLD = 80;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = orderType === 'delivery' ? (isFreeDelivery ? 0 : 6) : 0;
  const discount = appliedCoupon === 'FACINEROSA10' ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponSuccess('¡Cupón del 10% aplicado con éxito!');
      setCouponInput('');
    } else {
      setCouponError('Cupón inválido. Prueba con: FACINEROSA10');
    }
  };

  const getSpiceLabel = (level: string) => {
    switch (level) {
      case 'sin_aji':
        return 'Sin Ají';
      case 'picante_bravo':
        return '🌶️ Picante Bravo';
      case 'medio':
      default:
        return '🌶️ Toque Piurano';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-end sm:items-stretch sm:justify-end animate-in fade-in duration-200">
      
      {/* Mobile pull / slide sheet on small screens, right drawer on desktop */}
      <div className="relative w-full sm:max-w-md bg-[#F9F9F9] h-[92vh] sm:h-full rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col justify-between overflow-hidden border-t sm:border-t-0 sm:border-l border-[#00167A]/20 animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
        
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-full flex justify-center pt-2 pb-1 bg-[#00167A]">
          <div className="w-12 h-1 rounded-full bg-white/40" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#00167A] text-[#FFF3C1] flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#FFF3C1]" />
            <div>
              <h2 className="font-teko text-2xl sm:text-3xl font-bold uppercase tracking-wider leading-none">
                Tu Canasta Picantera
              </h2>
              <span className="text-[11px] text-white/80 font-medium">
                {items.length} {items.length === 1 ? 'plato' : 'platos'} en lista
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                title="Vaciar pedido"
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-xs transition-colors"
              >
                Vaciar
              </button>
            )}
            <button
              id="cart-drawer-close-btn"
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Mode selector in Cart */}
        <div className="p-2.5 sm:p-3 bg-white border-b border-gray-200 shrink-0">
          <div className="grid grid-cols-3 gap-1 bg-[#00167A]/5 p-1 rounded-xl">
            <button
              onClick={() => onChangeOrderType('delivery')}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                orderType === 'delivery' ? 'bg-[#00167A] text-[#FFF3C1] shadow-2xs' : 'text-[#2C2D2F]'
              }`}
            >
              🛵 Delivery
            </button>
            <button
              onClick={() => onChangeOrderType('pickup')}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                orderType === 'pickup' ? 'bg-[#00167A] text-[#FFF3C1] shadow-2xs' : 'text-[#2C2D2F]'
              }`}
            >
              🥡 Para Llevar
            </button>
            <button
              onClick={() => onChangeOrderType('mesa')}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                orderType === 'mesa' ? 'bg-[#00167A] text-[#FFF3C1] shadow-2xs' : 'text-[#2C2D2F]'
              }`}
            >
              🍽️ En Salón
            </button>
          </div>
        </div>

        {/* Free delivery tracker */}
        {orderType === 'delivery' && (
          <div className="px-4 py-2 bg-[#FFF3C1] border-b border-amber-200 text-[#00167A] text-xs font-medium flex items-center justify-between gap-2 shrink-0">
            {isFreeDelivery ? (
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                ¡Felicidades! Tienes Delivery GRATIS
              </span>
            ) : (
              <span>
                Agrega <strong className="font-bold">S/ {(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)}</strong> más para <strong className="underline">Delivery Gratis</strong>
              </span>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#00167A]/10 text-[#00167A] mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-teko text-2xl font-bold uppercase text-[#00167A]">
                  Tu canasta está vacía
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                  Revisa nuestra carta con lo mejor de la gastronomía piurana y agrega tus platos favoritos.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#00167A] text-[#FFF3C1] rounded-xl text-xs font-bold shadow-xs hover:bg-[#00167A]/90 transition-all"
              >
                Explorar Carta
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2"
              >
                <div className="flex gap-2.5 sm:gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-teko text-lg sm:text-xl font-bold uppercase text-[#00167A] leading-tight truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Eliminar plato"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-gray-500 flex flex-wrap gap-1 mt-0.5">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                        {getSpiceLabel(item.spiceLevel)}
                      </span>
                      {item.selectedExtras.map((e) => (
                        <span key={e.id} className="bg-[#FFF3C1] text-[#00167A] px-1.5 py-0.5 rounded font-medium">
                          +{e.name}
                        </span>
                      ))}
                    </div>

                    {item.specialInstructions && (
                      <p className="text-[10px] text-gray-500 italic mt-0.5 line-clamp-1">
                        Nota: "{item.specialInstructions}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  {/* Quantity */}
                  <div className="flex items-center bg-[#F9F9F9] border border-gray-200 rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#00167A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#00167A]">
                      S/ {item.itemTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary and Action */}
        {items.length > 0 && (
          <div className="p-3.5 sm:p-5 bg-white border-t border-gray-200 space-y-3 shrink-0">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    Cupón <strong>{appliedCoupon}</strong> (-10%)
                  </span>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-xs text-emerald-600 hover:underline font-bold"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código de cupón (FACINEROSA10)"
                    className="flex-1 px-3 py-1.5 bg-[#F9F9F9] border border-gray-300 rounded-lg text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00167A]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#00167A] text-[#FFF3C1] text-xs font-bold rounded-lg hover:bg-[#00167A]/90 transition-all"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponError && <p className="text-[10px] text-red-500 mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-600 mt-1">{couponSuccess}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-gray-600 pt-0.5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2C2D2F]">S/ {subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Descuento cupón</span>
                  <span>- S/ {discount.toFixed(2)}</span>
                </div>
              )}

              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Costo de Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-[#2C2D2F]'}>
                    {deliveryFee === 0 ? '¡GRATIS!' : `S/ ${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-[#00167A] pt-1.5 border-t border-gray-100">
                <span className="uppercase">Total a Pagar</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs">S/</span>
                  <span className="font-teko text-2xl leading-none">{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3 bg-[#00167A] hover:bg-[#00167A]/90 text-[#FFF3C1] rounded-xl font-bold text-xs sm:text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continuar con el Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
