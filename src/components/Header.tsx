import React from 'react';
import { ShoppingBag, MapPin, Phone } from 'lucide-react';
import { BrandLogo, BrandEmblem } from './BrandLogo';
import { OrderType } from '../types';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  orderType?: OrderType;
  onChangeOrderType?: (type: OrderType) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenLocationPicker?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  const { settings } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-[#F9F9F9]/95 backdrop-blur-md border-b border-[#00167A]/10 shadow-xs">
      
      {/* Top Banner Notice (Desktop) */}
      <div className="bg-[#00167A] text-[#FFF3C1] py-1.5 px-4 text-xs font-medium tracking-wide hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-gotham font-semibold">PICANTERÍA SURQUILLO</span>
            <span className="text-white/60">|</span>
            <span className="text-white/90">{settings.bannerNotice || `Horario: ${settings.openingHours}`}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-[#FFF3C1]">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                Puesto 651 - Mercado 2 de Surquillo
              </span>
            </div>
            <a
              href={`https://wa.me/${settings.phone.replace(/\D/g, '')}?text=Hola%20La%20Facinerosa,%20deseo%20hacer%20una%20consulta`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold hover:underline text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FFF3C1]" />
              <span>{settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* MOBILE TOP BAR */}
      <div className="sm:hidden bg-[#00167A] text-[#FFF3C1] px-3.5 py-2 flex items-center justify-between border-b border-white/10 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[#FFF3C1] shrink-0" />
          <span className="text-[11px] font-bold text-[#FFF3C1] truncate">
            Mercado 2 de Surquillo (Puesto 651)
          </span>
        </div>

        <a
          href={`https://wa.me/${settings.phone.replace(/\D/g, '')}?text=Hola%20La%20Facinerosa,%20deseo%20hacer%20un%20pedido`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-lg bg-[#FFF3C1] text-[#00167A] text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-xs"
        >
          <Phone className="w-3 h-3" />
          <span>Pedir</span>
        </a>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-[#00167A] p-2 rounded-xl text-[#FFF3C1] shadow-xs hidden sm:flex items-center justify-center">
              <BrandEmblem size={28} color="#FFF3C1" />
            </div>
            <a href="#" className="hover:opacity-95 transition-opacity" id="header-brand-logo">
              <BrandLogo variant="blue" size="md" />
            </a>
          </div>

          {/* Right Section: Cart Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Cart Button (Desktop header cart) */}
            <button
              id="btn-header-cart"
              onClick={onOpenCart}
              className="relative hidden sm:flex items-center gap-2.5 px-3.5 sm:px-4 py-2 bg-[#00167A] text-[#FFF3C1] rounded-xl font-medium shadow-md hover:bg-[#00167A]/90 active:scale-95 transition-all group cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-[#00167A] font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold leading-none">
                  Mi Canasta
                </span>
                <span className="text-sm font-bold text-[#FFF3C1] leading-tight">
                  S/ {cartTotal.toFixed(2)}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

