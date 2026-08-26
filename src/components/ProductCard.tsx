import React from 'react';
import { Product } from '../types';
import { Plus, Flame, Clock, Users, Sparkles, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  quantityInCart?: number;
  isFavorited?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  quantityInCart = 0,
  isFavorited = false,
  onToggleFavorite,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
    >
      {/* MOBILE LAYOUT (< sm screens - PedidosYa style horizontal item) */}
      <div className="flex sm:hidden p-3.5 gap-3 justify-between items-center cursor-pointer active:bg-gray-50 transition-colors" onClick={() => onSelect(product)}>
        
        {/* Left Side: Dish Info */}
        <div className="flex-1 min-w-0 pr-1 space-y-1">
          {product.badge && (
            <span className="inline-block bg-[#00167A] text-[#FFF3C1] text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-2xs">
              {product.badge}
            </span>
          )}

          <h3 className="font-gotham text-sm font-bold text-[#2C2D2F] leading-tight line-clamp-1">
            {product.name}
          </h3>

          <p className="text-[11px] text-[#2C2D2F]/75 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <div className="font-gotham font-extrabold text-sm text-[#00167A]">
              S/ {product.price.toFixed(2)}
            </div>

            {product.prepTime && (
              <span className="text-[10px] text-gray-400 flex items-center gap-0.5 ml-2">
                <Clock className="w-2.5 h-2.5" />
                {product.prepTime}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Square Thumbnail + Floating Add Button & Heart */}
        <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-gray-100 shadow-2xs">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />

          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                isFavorited
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/40 text-white hover:bg-black/60'
              }`}
            >
              <Heart className={`w-3 h-3 ${isFavorited ? 'fill-white stroke-white' : 'stroke-white'}`} />
            </button>
          )}

          {/* Floating '+' Button on Thumbnail */}
          <button
            id={`btn-mobile-quickadd-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="absolute bottom-1.5 right-1.5 w-8 h-8 rounded-full bg-[#00167A] text-[#FFF3C1] hover:bg-[#00167A]/90 active:scale-90 flex items-center justify-center shadow-md transition-all border border-white/80"
          >
            {quantityInCart > 0 ? (
              <span className="text-xs font-bold font-mono">{quantityInCart}</span>
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>

      {/* DESKTOP / TABLET LAYOUT (>= sm screens - Rich Vertical Grid Card) */}
      <div className="hidden sm:flex sm:flex-col justify-between h-full">
        <div>
          {/* Product Image & Badges */}
          <div className="relative aspect-4/3 w-full overflow-hidden bg-[#00167A]/5 cursor-pointer" onClick={() => onSelect(product)}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
              {product.badge && (
                <span className="bg-[#00167A] text-[#FFF3C1] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FFF3C1]" />
                  {product.badge}
                </span>
              )}
              {product.isSpicy && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Picantito
                </span>
              )}
            </div>

            {/* Favorite heart button */}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(product.id);
                }}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isFavorited
                    ? 'bg-rose-500 text-white shadow-md scale-110'
                    : 'bg-black/40 text-white hover:bg-black/60'
                }`}
                title={isFavorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white stroke-white' : 'stroke-white'}`} />
              </button>
            )}

            {/* Prep time & Portions pill */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
              {product.portions && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#FFF3C1]" />
                  {product.portions}
                </span>
              )}
              {product.prepTime && (
                <span className="flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3 text-[#FFF3C1]" />
                  {product.prepTime}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3
                onClick={() => onSelect(product)}
                className="font-teko text-2xl sm:text-[26px] font-bold uppercase tracking-wide text-[#00167A] leading-tight hover:text-[#00167A]/80 cursor-pointer line-clamp-1"
              >
                {product.name}
              </h3>
            </div>

            <p className="text-xs text-[#2C2D2F]/80 line-clamp-3 leading-relaxed mb-4 min-h-[3.6em]">
              {product.description}
            </p>
          </div>
        </div>

        {/* Footer / Price & CTA */}
        <div className="p-4 sm:p-5 pt-0 border-t border-[#00167A]/8 mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#2C2D2F]/60 tracking-wider block">
              Precio
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-[#00167A]">S/</span>
              <span className="font-teko text-3xl font-bold text-[#00167A] leading-none">
                {product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`btn-customize-${product.id}`}
              onClick={() => onSelect(product)}
              className="px-3 py-2 text-xs font-semibold text-[#00167A] bg-[#FFF3C1] hover:bg-[#ffeaa1] rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              Personalizar
            </button>
            
            <button
              id={`btn-quick-add-${product.id}`}
              onClick={() => onQuickAdd(product)}
              title="Agregar directamente"
              className="p-2 bg-[#00167A] text-[#FFF3C1] hover:bg-[#00167A]/90 active:scale-95 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
