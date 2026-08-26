import React from 'react';
import { OrderType } from '../types';
import { X, MapPin, Check, Bike, ShoppingBag, Utensils, Sparkles, Navigation } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  orderType,
  onChangeOrderType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-[#00167A]/20 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#00167A] text-[#FFF3C1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#FFF3C1]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-teko text-2xl sm:text-3xl font-bold uppercase tracking-wider leading-none">
                ¿Cómo deseas tu pedido?
              </h2>
              <p className="text-[11px] text-white/80">
                Selecciona tu modalidad de atención
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Order Type Toggle */}
          <div>
            <label className="text-xs font-bold text-[#00167A] uppercase tracking-wider block mb-2">
              Modalidad de pedido
            </label>
            <div className="grid grid-cols-3 gap-2 bg-[#00167A]/5 p-1.5 rounded-2xl border border-[#00167A]/10">
              <button
                type="button"
                onClick={() => onChangeOrderType('delivery')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-[#00167A] text-[#FFF3C1] shadow-xs'
                    : 'text-[#2C2D2F] hover:text-[#00167A]'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeOrderType('pickup')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-[#00167A] text-[#FFF3C1] shadow-xs'
                    : 'text-[#2C2D2F] hover:text-[#00167A]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Para Llevar</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeOrderType('mesa')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  orderType === 'mesa'
                    ? 'bg-[#00167A] text-[#FFF3C1] shadow-xs'
                    : 'text-[#2C2D2F] hover:text-[#00167A]'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>En Mesa</span>
              </button>
            </div>
          </div>

          {/* Details based on selection */}
          {orderType === 'delivery' && (
            <div className="p-4 bg-gradient-to-br from-[#FFF3C1]/40 to-amber-50 border border-amber-200/80 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-[#00167A]">
                <div className="w-8 h-8 rounded-xl bg-[#00167A] text-[#FFF3C1] flex items-center justify-center">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#00167A]">Entrega por Delivery</h4>
                  <p className="text-[11px] text-[#2C2D2F]">Llegamos a tu domicilio o trabajo</p>
                </div>
              </div>

              <div className="text-xs text-[#2C2D2F] bg-white p-3 rounded-xl border border-amber-200/50 space-y-1.5">
                <p className="flex items-center gap-1.5 text-[#00167A] font-semibold">
                  <Navigation className="w-3.5 h-3.5" /> Ingreso de dirección directo:
                </p>
                <p className="text-[11px] text-gray-600">
                  Al completar tu pedido podrás escribir tu <strong>dirección exacta</strong> y una <strong>referencia</strong> (casa, dpto, reja, etc.) para que el repartidor llegue sin demoras.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-800 px-3 py-2 rounded-xl border border-emerald-200 font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Envío Gratis por compras &gt; S/ 80
                </span>
                <span className="font-bold">Tarifa Plana S/ 6.00</span>
              </div>
            </div>
          )}

          {orderType === 'pickup' && (
            <div className="p-4 bg-[#FFF3C1]/50 border border-amber-200 rounded-2xl text-xs text-[#00167A] space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#00167A]" /> Punto de Recojo Oficial:
              </p>
              <p className="text-[#2C2D2F] font-semibold">
                Mercado 2 de Surquillo, Puesto 651, Surquillo, Lima
              </p>
              <p className="text-gray-500 text-[11px]">
                Tiempo estimado de preparación: <strong>20-25 minutos</strong>. Te avisamos por WhatsApp para que lo recojas caliente.
              </p>
            </div>
          )}

          {orderType === 'mesa' && (
            <div className="p-4 bg-[#00167A]/5 border border-[#00167A]/15 rounded-2xl text-xs text-[#00167A] space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#00167A]" /> Consumo en Puesto / Salón:
              </p>
              <p className="text-[#2C2D2F]">
                ¡Pide desde tu lugar en el <strong>Mercado 2 de Surquillo (Puesto 651)</strong>! Al finalizar podrás indicar tu mesa o posición para entregártelo al instante.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#00167A] text-[#FFF3C1] font-bold text-xs rounded-xl shadow-xs hover:bg-[#00167A]/90 transition-all cursor-pointer"
          >
            Aceptar y Continuar
          </button>
        </div>

      </div>
    </div>
  );
};
