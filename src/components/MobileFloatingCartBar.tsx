import React from 'react';
import { ShoppingBag, ArrowRight, Sparkles, Bike } from 'lucide-react';

interface MobileFloatingCartBarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const MobileFloatingCartBar: React.FC<MobileFloatingCartBarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  if (cartCount === 0) return null;

  const FREE_DELIVERY_THRESHOLD = 80;
  const isFreeDelivery = cartTotal >= FREE_DELIVERY_THRESHOLD;
  const amountNeeded = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div className="fixed bottom-15 left-0 right-0 z-30 p-2.5 max-w-lg mx-auto md:hidden animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#00167A] text-[#FFF3C1] rounded-2xl shadow-xl border border-[#FFF3C1]/20 overflow-hidden">
        
        {/* Free Delivery mini tracker bar on top */}
        <div className="bg-[#FFF3C1] text-[#00167A] px-3 py-1 text-[10px] font-bold flex items-center justify-between">
          {isFreeDelivery ? (
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              ¡Felicidades! Tienes Delivery GRATIS
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Bike className="w-3 h-3" />
              Faltan <strong>S/ {amountNeeded.toFixed(2)}</strong> para Envío Gratis
            </span>
          )}
          <span className="font-mono text-[9px]">({progressPercent.toFixed(0)}%)</span>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenCart}
          className="w-full px-4 py-3 flex items-center justify-between active:bg-[#00167A]/90 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[#FFF3C1] text-[#00167A] font-extrabold text-xs flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
            <div className="text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FFF3C1]">
                Ver Mi Canasta
              </div>
              <div className="text-[10px] text-white/70">
                {cartCount === 1 ? '1 plato seleccionado' : `${cartCount} platos seleccionados`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-teko text-2xl font-bold leading-none text-white">
              S/ {cartTotal.toFixed(2)}
            </span>
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#FFF3C1]">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

      </div>
    </div>
  );
};
