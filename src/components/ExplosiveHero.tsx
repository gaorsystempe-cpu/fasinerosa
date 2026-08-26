import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FloatingDishArt } from './FloatingDishArt';
import { useStore } from '../context/StoreContext';

interface ExplosiveHeroProps {
  onExploreClick: () => void;
}

export const ExplosiveHero: React.FC<ExplosiveHeroProps> = ({
  onExploreClick,
}) => {
  const { settings } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF3C1]/60 via-[#FFF3C1]/20 to-[#F9F9F9] pt-6 sm:pt-10 pb-8 sm:pb-12 text-[#2C2D2F]">
      {/* Decorative brand bokeh dots (Using ONLY La Facinerosa Blue & Cream) */}
      <div className="absolute top-6 left-8 w-4 h-4 rounded-full bg-[#00167A]/20 blur-xs pointer-events-none" />
      <div className="absolute top-16 right-10 w-6 h-6 rounded-full bg-[#FFF3C1] border border-[#00167A]/20 blur-2xs pointer-events-none" />
      <div className="absolute bottom-12 left-1/4 w-5 h-5 rounded-full bg-[#00167A]/10 pointer-events-none" />
      <div className="absolute top-1/2 right-12 w-3.5 h-3.5 rounded-full bg-[#00167A]/15 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        
        {/* Brand Pill at Top */}
        <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
          <div className="bg-[#FFF3C1] border-2 border-[#00167A]/25 px-5 py-1.5 rounded-full shadow-xs flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-teko text-xl sm:text-2xl font-bold uppercase tracking-widest text-[#00167A] leading-none">
              {settings.businessName}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase font-extrabold tracking-wider text-[#00167A] bg-white/70 px-2 py-0.5 rounded-full border border-[#00167A]/15">
              Surquillo Puesto 651
            </span>
          </div>
        </div>

        {/* Catchy Hero Headline */}
        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-5">
          <h1 className="font-gotham text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#00167A] leading-[1.08]">
            {settings.heroTitle || 'Sabor que Despierta Tus Sentidos'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto font-medium">
            {settings.heroSubtitle}
          </p>
        </div>

        {/* Floating Dish Centerpiece */}
        <FloatingDishArt />

        {/* Action Button */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={onExploreClick}
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#00167A] text-[#FFF3C1] font-gotham font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:bg-[#00167A]/90 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer border border-[#FFF3C1]/30"
          >
            <span>Ver Carta Picantera</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

