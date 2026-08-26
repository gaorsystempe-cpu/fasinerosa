import React, { useState } from 'react';
import { Tag, Sparkles, Bike, Check, Copy, Flame, Gift, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface MobileOffersViewProps {
  onApplyCoupon: (code: string) => boolean;
  appliedCoupon: string | null;
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

export const MobileOffersView: React.FC<MobileOffersViewProps> = ({
  onApplyCoupon,
  appliedCoupon,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const coupons = [
    {
      code: 'FACINEROSA10',
      title: '10% de Descuento Bienvenida',
      desc: 'Válido para tu pedido en toda la carta de la picantería.',
      discount: '10% OFF',
      minSpend: 'Sin mínimo',
    },
    {
      code: 'ENVIOGRATIS80',
      title: 'Delivery Gratis en Piura',
      desc: 'Envío 100% gratis en compras superiores a S/ 80.00.',
      discount: 'ENVÍO S/ 0',
      minSpend: 'Min. S/ 80',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    onApplyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const featuredComboProduct = PRODUCTS.find((p) => p.id === 'ronda-facinerosa-familiar') || PRODUCTS[0];
  const secoChabelo = PRODUCTS.find((p) => p.id === 'seco-chabelo') || PRODUCTS[0];
  const majadoYuca = PRODUCTS.find((p) => p.id === 'majado-yuca-chancho') || PRODUCTS[1];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#00167A] via-[#0b2494] to-[#001057] text-[#FFF3C1] p-5 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Gift className="w-4 h-4" />
            <span>Zona de Promociones Picanteras</span>
          </div>
          <h2 className="font-teko text-3xl font-bold uppercase tracking-wide leading-none text-white">
            OFERTAS & CUPONES DEL DÍA
          </h2>
          <p className="text-xs text-white/80 leading-relaxed max-w-xs">
            Aprovecha nuestros descuentos exclusivos y disfruta de la mejor sazón piurana al mejor precio.
          </p>
        </div>
      </div>

      {/* Coupons Section */}
      <div className="space-y-3">
        <h3 className="font-teko text-2xl font-bold uppercase text-[#00167A] flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <span>Cupones Disponibles</span>
        </h3>

        <div className="space-y-2.5">
          {coupons.map((coupon) => {
            const isApplied = appliedCoupon === coupon.code;
            return (
              <div
                key={coupon.code}
                className={`p-4 rounded-2xl border transition-all ${
                  isApplied
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-[#00167A]/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#00167A] text-[#FFF3C1] text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                        {coupon.discount}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {coupon.minSpend}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-[#2C2D2F]">
                      {coupon.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {coupon.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                      isApplied || copiedCode === coupon.code
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FFF3C1] text-[#00167A] hover:bg-amber-200'
                    }`}
                  >
                    {isApplied || copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Aplicado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{coupon.code}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Big Combo */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="bg-amber-400 text-[#00167A] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
            🔥 COMBO FAMILIAR ESTRELLA
          </span>
          <span className="text-xs font-bold text-emerald-600">
            Ahorra 15%
          </span>
        </div>

        <div className="flex gap-3.5 items-center">
          <img
            src={featuredComboProduct.image}
            alt={featuredComboProduct.name}
            className="w-24 h-24 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1">
            <h4 className="font-teko text-2xl font-bold uppercase text-[#00167A] leading-tight">
              {featuredComboProduct.name}
            </h4>
            <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">
              {featuredComboProduct.description}
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xs font-bold text-[#00167A]">S/</span>
              <span className="font-teko text-3xl font-bold text-[#00167A] leading-none">
                {featuredComboProduct.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-gray-400 line-through ml-2">S/ 140.00</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelectProduct(featuredComboProduct)}
          className="w-full py-2.5 bg-[#00167A] hover:bg-[#00167A]/90 text-[#FFF3C1] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>Personalizar & Agregar Combo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Platos en Tendencia */}
      <div className="space-y-3">
        <h3 className="font-teko text-2xl font-bold uppercase text-[#00167A] flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-500" />
          <span>Los Más Pedidos de la Semana</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {[secoChabelo, majadoYuca].map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs space-y-2 cursor-pointer active:scale-98 transition-transform"
            >
              <div className="relative aspect-4/3 rounded-xl overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 bg-[#00167A] text-[#FFF3C1] text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {prod.badge || 'Popular'}
                </span>
              </div>
              <h5 className="font-teko text-lg font-bold uppercase text-[#00167A] leading-tight truncate">
                {prod.name}
              </h5>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00167A]">
                  S/ {prod.price.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Pedir +
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
