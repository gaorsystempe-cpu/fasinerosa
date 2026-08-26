import React from 'react';
import { Home, UtensilsCrossed, Heart, ShoppingBag } from 'lucide-react';

export type MainTab = 'inicio' | 'menu' | 'favoritos' | 'carrito';

interface FloatingPillBottomNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
}

export const FloatingPillBottomNav: React.FC<FloatingPillBottomNavProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  favoritesCount,
  onOpenCart,
}) => {
  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
      {/* Floating Pill Container (Screenshot 3 Bottom Navigation) */}
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-full px-4 sm:px-6 py-2.5 shadow-2xl flex items-center justify-around gap-4 sm:gap-8 max-w-sm sm:max-w-md w-full">
        
        {/* 1. INICIO */}
        <button
          id="nav-tab-inicio"
          onClick={() => onTabChange('inicio')}
          className={`flex flex-col items-center gap-0.5 relative py-0.5 px-2 transition-all cursor-pointer ${
            activeTab === 'inicio' ? 'text-[#00167A]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'inicio' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-tight">Inicio</span>
          {activeTab === 'inicio' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#00167A] absolute -bottom-1" />
          )}
        </button>

        {/* 2. MENÚ */}
        <button
          id="nav-tab-menu"
          onClick={() => onTabChange('menu')}
          className={`flex flex-col items-center gap-0.5 relative py-0.5 px-2 transition-all cursor-pointer ${
            activeTab === 'menu' ? 'text-[#00167A]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <UtensilsCrossed className={`w-5 h-5 ${activeTab === 'menu' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-tight">Menú</span>
          {activeTab === 'menu' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#00167A] absolute -bottom-1" />
          )}
        </button>

        {/* 3. FAVORITOS */}
        <button
          id="nav-tab-favoritos"
          onClick={() => onTabChange('favoritos')}
          className={`flex flex-col items-center gap-0.5 relative py-0.5 px-2 transition-all cursor-pointer ${
            activeTab === 'favoritos' ? 'text-[#00167A]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeTab === 'favoritos' ? 'stroke-[2.5] text-rose-500 fill-rose-500' : 'stroke-2'}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-tight">Favoritos</span>
          {activeTab === 'favoritos' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#00167A] absolute -bottom-1" />
          )}
        </button>

        {/* 4. CARRITO */}
        <button
          id="nav-tab-carrito"
          onClick={() => {
            onTabChange('carrito');
            onOpenCart();
          }}
          className={`flex flex-col items-center gap-0.5 relative py-0.5 px-2 transition-all cursor-pointer ${
            activeTab === 'carrito' ? 'text-[#00167A]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'carrito' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#00167A] text-[#FFF3C1] text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-[#FFF3C1] animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-tight">Carrito</span>
          {activeTab === 'carrito' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#00167A] absolute -bottom-1" />
          )}
        </button>

      </nav>
    </div>
  );
};
