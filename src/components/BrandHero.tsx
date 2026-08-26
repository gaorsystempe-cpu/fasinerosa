import React from 'react';
import { Flame, Clock, ShieldCheck, Award, Sparkles, MapPin } from 'lucide-react';
import { BrandLogo, BrandEmblem } from './BrandLogo';

interface BrandHeroProps {
  onExploreClick: () => void;
  onOpenBrandStory: () => void;
}

export const BrandHero: React.FC<BrandHeroProps> = ({ onExploreClick, onOpenBrandStory }) => {
  return (
    <section className="relative overflow-hidden bg-[#00167A] text-white pt-10 pb-12 lg:py-16">
      {/* Background decorative textures */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FFF3C1] blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#FFF3C1] blur-3xl transform -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Brand statement */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF3C1]/15 text-[#FFF3C1] border border-[#FFF3C1]/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFF3C1]" />
              <span>Auténtica Picantería Piurana Digital</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-teko text-5xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight leading-[0.9] text-[#FFF3C1]">
                SABOR CON CARÁCTER, TRADICIÓN Y FRESCURA
              </h1>
              <p className="font-gotham text-sm sm:text-base text-white/85 max-w-2xl font-normal leading-relaxed">
                El auténtico sazón de los fogones piuranos llevado a tu mesa: seco de chabelo al batán, majado de yuca con chancho crujiente, majariscos, ceviche con zarandaja y tamalitos verdes recién hechos.
              </p>
            </div>

            {/* Value Props Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white">
                <Flame className="w-4 h-4 text-[#FFF3C1]" />
                <span>Cocinados al momento</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white">
                <Clock className="w-4 h-4 text-[#FFF3C1]" />
                <span>Delivery en 30-45 min</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white">
                <Award className="w-4 h-4 text-[#FFF3C1]" />
                <span>Insumos 100% de Piura</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-btn-explore"
                onClick={onExploreClick}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#FFF3C1] text-[#00167A] font-bold text-sm rounded-xl hover:bg-white active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Hacer Pedido Ahora</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                id="hero-btn-brand-info"
                onClick={onOpenBrandStory}
                className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-medium text-sm rounded-xl border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ver Identidad de Marca</span>
              </button>
            </div>
          </div>

          {/* Right Column: Featured Promo Card with brand yellow cream (#FFF3C1) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFF3C1] text-[#00167A] p-6 sm:p-7 rounded-2xl shadow-2xl border-4 border-white/20 relative">
              <div className="absolute top-4 right-4 bg-[#00167A] text-[#FFF3C1] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Especial del Día
              </div>

              <div className="flex items-center gap-3 mb-4">
                <BrandEmblem size={32} color="#00167A" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00167A]/70 block">
                    Combo Recomendado
                  </span>
                  <h3 className="font-teko text-3xl font-bold uppercase tracking-wide leading-none">
                    DUPLA PICANTERA + CLARITO
                  </h3>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden mb-4 aspect-16/9 bg-[#00167A]/10">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Seco de Chabelo y Clarito"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-2 bg-[#00167A]/90 backdrop-blur-xs text-[#FFF3C1] px-2.5 py-1 rounded-lg text-xs font-bold">
                  S/ 58.00 <span className="line-through text-white/60 text-[10px] font-normal">S/ 63.00</span>
                </div>
              </div>

              <p className="text-xs text-[#2C2D2F] font-medium mb-4 leading-relaxed">
                Seco de Chabelo tradicional con abundante carne aliñada + 1 Jarra de Clarito Piurano bien helado + chifles y zarza criolla.
              </p>

              <div className="pt-3 border-t border-[#00167A]/15 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#00167A] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#00167A]" />
                  <span>Empaque térmico oficial</span>
                </div>
                <button
                  id="promo-btn-order"
                  onClick={onExploreClick}
                  className="text-xs font-bold text-[#00167A] hover:underline flex items-center gap-1"
                >
                  Ver Menú Completo →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
