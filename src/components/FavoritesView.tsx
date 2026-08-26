import React from 'react';
import { Heart, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface FavoritesViewProps {
  favoriteProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onExploreMenu: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteProducts,
  onSelectProduct,
  onQuickAdd,
  onToggleFavorite,
  onExploreMenu,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="font-gotham text-2xl sm:text-3xl font-extrabold text-[#2C2D2F]">
              Mis Favoritos
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Tus platos picanteros guardados para pedir en un solo toque
          </p>
        </div>
        <span className="bg-[#FFF3C1] text-[#00167A] text-xs font-bold px-3 py-1.5 rounded-full border border-[#00167A]/20">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? 'plato' : 'platos'}
        </span>
      </div>

      {/* List or Empty State */}
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 stroke-1.5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-gotham text-lg font-bold text-[#2C2D2F]">
              Aún no tienes platos en favoritos
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Presiona el corazón <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500 mx-0.5" /> en cualquier plato de la carta para guardarlo aquí.
            </p>
          </div>
          <button
            onClick={onExploreMenu}
            className="px-6 py-3 bg-[#00167A] text-[#FFF3C1] font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md hover:bg-[#00167A]/90 transition-all cursor-pointer"
          >
            Explorar Carta Picantera
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favoriteProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-3.5 border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Image box */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                />
                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md active:scale-90 transition-transform"
                  title="Quitar de favoritos"
                >
                  <Heart className="w-4 h-4 fill-white stroke-white" />
                </button>
              </div>

              {/* Info */}
              <div
                className="cursor-pointer space-y-1 mb-3"
                onClick={() => onSelectProduct(product)}
              >
                <h3 className="font-gotham font-bold text-sm text-[#2C2D2F] line-clamp-1 group-hover:text-[#00167A]">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Add */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="font-gotham font-extrabold text-sm text-[#00167A]">
                  S/ {product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onQuickAdd(product)}
                  className="px-3.5 py-1.5 bg-[#FFF3C1] hover:bg-[#00167A] text-[#00167A] hover:text-[#FFF3C1] text-xs font-bold rounded-xl border border-[#00167A]/20 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
