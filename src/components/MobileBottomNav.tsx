import React from 'react';
import { Home, Search, Tag, ShoppingBag, UtensilsCrossed, Info } from 'lucide-react';

export type MobileTab = 'inicio' | 'explorar' | 'ofertas' | 'picanteria';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#00167A]/12 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden safe-area-pb">
      <div className="grid grid-cols-5 h-15 max-w-lg mx-auto items-center px-1">
        
        {/* Tab 1: Inicio */}
        <button
          onClick={() => onTabChange('inicio')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all ${
            activeTab === 'inicio' ? 'text-[#00167A]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'inicio' ? 'bg-[#00167A]/10' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-bold tracking-tight ${activeTab === 'inicio' ? 'text-[#00167A]' : 'text-gray-500'}`}>
            Inicio
          </span>
        </button>

        {/* Tab 2: Explorar */}
        <button
          onClick={() => onTabChange('explorar')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all ${
            activeTab === 'explorar' ? 'text-[#00167A]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'explorar' ? 'bg-[#00167A]/10' : ''}`}>
            <Search className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-bold tracking-tight ${activeTab === 'explorar' ? 'text-[#00167A]' : 'text-gray-500'}`}>
            Buscar
          </span>
        </button>

        {/* Tab 3: Ofertas */}
        <button
          onClick={() => onTabChange('ofertas')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all relative ${
            activeTab === 'ofertas' ? 'text-[#00167A]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
          <div className={`p-1 rounded-full ${activeTab === 'ofertas' ? 'bg-[#00167A]/10' : ''}`}>
            <Tag className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-bold tracking-tight ${activeTab === 'ofertas' ? 'text-[#00167A]' : 'text-gray-500'}`}>
            Ofertas
          </span>
        </button>

        {/* Tab 4: Mi Canasta (Direct open cart or tab) */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center gap-0.5 py-1 transition-all text-[#00167A] relative"
        >
          <div className="relative p-1 rounded-full bg-[#00167A] text-[#FFF3C1] shadow-xs active:scale-95 transition-transform">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-[#00167A] text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight text-[#00167A]">
            {cartCount > 0 ? `S/ ${cartTotal.toFixed(0)}` : 'Canasta'}
          </span>
        </button>

        {/* Tab 5: Picantería / Nosotros */}
        <button
          onClick={() => onTabChange('picanteria')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all ${
            activeTab === 'picanteria' ? 'text-[#00167A]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className={`p-1 rounded-full ${activeTab === 'picanteria' ? 'bg-[#00167A]/10' : ''}`}>
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-bold tracking-tight ${activeTab === 'picanteria' ? 'text-[#00167A]' : 'text-gray-500'}`}>
            Picantería
          </span>
        </button>

      </div>
    </nav>
  );
};
