import React from 'react';
import { Heart, Plus, Flame, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface HorizontalSectionScrollProps {
  title: string;
  badgeType?: 'popular' | 'promo';
  onViewAll: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
}

export const HorizontalSectionScroll: React.FC<HorizontalSectionScrollProps> = ({
  title,
  badgeType = 'popular',
  onViewAll,
  products,
  onSelectProduct,
  onQuickAdd,
  favorites,
  onToggleFavorite,
}) => {
  if (products.length === 0) return null;

  return (
    <section className="py-4 sm:py-6">
      {/* Section Header (Screenshot 2: Title on left, "Ver todo" on right) */}
      <div className="flex items-center justify-between px-4 sm:px-6 mb-3 sm:mb-4">
        <h2 className="font-gotham text-xl sm:text-2xl font-extrabold text-[#2C2D2F] tracking-tight">
          {title}
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs sm:text-sm font-extrabold text-[#00167A] hover:underline active:scale-95 transition-all cursor-pointer flex items-center gap-1"
        >
          Ver todo
        </button>
      </div>

      {/* Horizontal Carousel (Scroll Snap) */}
      <div className="flex gap-3.5 sm:gap-5 overflow-x-auto px-4 sm:px-6 pb-3 pt-1 scrollbar-none snap-x snap-mandatory">
        {products.map((product) => {
          const isFavorited = favorites.includes(product.id);
          const isPromo = badgeType === 'promo' || product.badge?.toLowerCase().includes('promo');

          return (
            <div
              key={product.id}
              className="snap-start shrink-0 w-44 sm:w-56 md:w-64 bg-white rounded-3xl p-3 border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Product Image Box */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 mb-2.5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                  loading="lazy"
                />

                {/* Badge Top Left (Strictly La Facinerosa Blue and Cream) */}
                <div className="absolute top-2 left-2">
                  {isPromo ? (
                    <span className="bg-[#00167A] text-[#FFF3C1] text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider border border-[#FFF3C1]/30">
                      PROMO
                    </span>
                  ) : (
                    <span className="bg-[#FFF3C1] text-[#00167A] border border-[#00167A]/25 text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider">
                      <Flame className="w-2.5 h-2.5 text-[#00167A] fill-[#00167A]" />
                      MÁS PEDIDO
                    </span>
                  )}
                </div>

                {/* Favorite Heart Button Top Right (Screenshot 2) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isFavorited
                      ? 'bg-rose-500 text-white shadow-md scale-110'
                      : 'bg-black/30 text-white hover:bg-black/50 backdrop-blur-xs'
                  }`}
                  title={isFavorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isFavorited ? 'fill-white stroke-white' : 'stroke-white'
                    }`}
                  />
                </button>
              </div>

              {/* Info & Content */}
              <div
                className="cursor-pointer space-y-1 flex-1"
                onClick={() => onSelectProduct(product)}
              >
                <h3 className="font-gotham font-bold text-xs sm:text-sm text-[#2C2D2F] line-clamp-1 leading-snug group-hover:text-[#00167A] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 leading-tight">
                  {product.description}
                </p>
              </div>

              {/* Bottom Row: Price + Circular '+' Button (Screenshot 2) */}
              <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-gray-100">
                <div className="font-gotham font-extrabold text-xs sm:text-sm text-[#00167A]">
                  S/ {product.price.toFixed(2)}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(product);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFF3C1] text-[#00167A] hover:bg-[#00167A] hover:text-[#FFF3C1] border border-[#00167A]/20 flex items-center justify-center active:scale-90 transition-all shadow-xs cursor-pointer"
                  title="Agregar a la canasta"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};
