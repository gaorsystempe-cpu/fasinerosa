import React, { useState, useEffect } from 'react';
import { Sparkles, Bike, Tag, Flame, ArrowRight, Copy, Check } from 'lucide-react';

interface MobilePromoCarouselProps {
  onApplyCouponCode: (code: string) => void;
  onExploreCategory: (cat: string) => void;
  onOpenBrandStory: () => void;
}

export const MobilePromoCarousel: React.FC<MobilePromoCarouselProps> = ({
  onApplyCouponCode,
  onExploreCategory,
  onOpenBrandStory,
}) => {
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const promos = [
    {
      id: 'promo-coupon',
      tag: '10% DE DESCUENTO',
      tagBg: 'bg-red-500 text-white',
      title: '¡Bienvenido a La Facinerosa!',
      subtitle: 'Usa el cupón en tu pedido',
      code: 'FACINEROSA10',
      actionText: 'Copiar Cupón',
      bgGradient: 'from-[#00167A] via-[#09228c] to-[#001057]',
      textColor: 'text-[#FFF3C1]',
      icon: Tag,
    },
    {
      id: 'promo-delivery',
      tag: 'ENVÍO GRATIS',
      tagBg: 'bg-emerald-500 text-white',
      title: 'Delivery GRATIS en Piura',
      subtitle: 'En compras desde S/ 80 a Castilla y Catacaos',
      bgGradient: 'from-[#1e3a8a] via-[#172554] to-[#0f172a]',
      textColor: 'text-white',
      actionText: 'Armar Pedido',
      actionCategory: 'todos',
      icon: Bike,
    },
    {
      id: 'promo-chicha',
      tag: 'TRADICIÓN VIVA',
      tagBg: 'bg-amber-400 text-[#00167A]',
      title: 'Chicha de Jora & Clarito',
      subtitle: 'Jarras de 1L fermentadas en cántaro de barro',
      bgGradient: 'from-[#451a03] via-[#78350f] to-[#b45309]',
      textColor: 'text-[#FFF3C1]',
      actionText: 'Ver Bebidas',
      actionCategory: 'bebidas',
      icon: Flame,
    },
  ];

  const handleAction = (promo: typeof promos[0]) => {
    if (promo.code) {
      navigator.clipboard?.writeText(promo.code);
      onApplyCouponCode(promo.code);
      setCopiedCoupon(promo.code);
      setTimeout(() => setCopiedCoupon(null), 2500);
    } else if (promo.actionCategory) {
      onExploreCategory(promo.actionCategory);
    }
  };

  return (
    <div className="w-full py-3 px-4">
      {/* Horizontal Snap Scroll container */}
      <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-1">
        {promos.map((promo, idx) => {
          const IconComp = promo.icon;
          return (
            <div
              key={promo.id}
              className={`snap-center shrink-0 w-[88vw] max-w-sm rounded-2xl p-4 bg-gradient-to-r ${promo.bgGradient} text-white shadow-md relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Subtle background motif */}
              <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute right-8 top-2 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${promo.tagBg}`}>
                    {promo.tag}
                  </span>
                  <IconComp className="w-4 h-4 text-white/70" />
                </div>

                <h3 className={`font-teko text-2xl font-bold uppercase leading-tight tracking-wide ${promo.textColor}`}>
                  {promo.title}
                </h3>
                <p className="text-xs text-white/85 leading-tight mt-0.5 line-clamp-2">
                  {promo.subtitle}
                </p>
              </div>

              <div className="mt-3.5 pt-2 border-t border-white/15 flex items-center justify-between">
                {promo.code ? (
                  <div className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-white/20">
                    <span className="text-[11px] font-mono font-bold tracking-wider text-[#FFF3C1]">
                      {promo.code}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#FFF3C1] font-bold">
                    Directo al fogón 🔥
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleAction(promo)}
                  className="px-3 py-1.5 bg-[#FFF3C1] text-[#00167A] hover:bg-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  {promo.code && copiedCoupon === promo.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>¡Aplicado!</span>
                    </>
                  ) : (
                    <>
                      <span>{promo.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
