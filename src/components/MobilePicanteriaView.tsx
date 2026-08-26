import React from 'react';
import { BrandLogo, BrandEmblem } from './BrandLogo';
import { MapPin, Phone, Clock, ShieldCheck, Heart, MessageSquare, Instagram, Facebook, Award, Sparkles, Utensils, ChevronRight } from 'lucide-react';

interface MobilePicanteriaViewProps {
  onOpenBrandStory: () => void;
  onOpenLocationPicker: () => void;
}

export const MobilePicanteriaView: React.FC<MobilePicanteriaViewProps> = ({
  onOpenBrandStory,
  onOpenLocationPicker,
}) => {
  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      
      {/* Brand Header Banner */}
      <div className="bg-[#00167A] text-[#FFF3C1] p-6 rounded-3xl shadow-md text-center space-y-3 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-white/10 mx-auto flex items-center justify-center p-3">
          <BrandEmblem size={44} color="#FFF3C1" />
        </div>

        <div>
          <h2 className="font-teko text-3xl sm:text-4xl font-bold uppercase tracking-wide leading-none text-[#FFF3C1]">
            LA FACINEROSA
          </h2>
          <p className="text-xs text-white/90 font-medium tracking-wider uppercase mt-0.5">
            Picantería Piurana Contemporánea
          </p>
        </div>

        <p className="text-xs text-white/80 max-w-sm mx-auto leading-relaxed">
          Tradición viva del norte. Majados en batán de piedra, aderezos con leña de algarrobo y chicha de jora en cántaro de barro.
        </p>

        <button
          onClick={onOpenBrandStory}
          className="px-4 py-2 bg-[#FFF3C1] text-[#00167A] text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ver Filosofía & Manual de Marca</span>
        </button>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href="https://wa.me/51969823145?text=Hola%20La%20Facinerosa,%20tengo%20una%20consulta"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col items-center text-center gap-2 active:scale-98 transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2C2D2F]">WhatsApp Directo</h4>
            <span className="text-[10px] text-gray-500">Atención inmediata</span>
          </div>
        </a>

        <a
          href="https://maps.google.com/?q=Mercado+2+de+Surquillo+puesto+651+Lima+Peru"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs flex flex-col items-center text-center gap-2 active:scale-98 transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#00167A] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2C2D2F]">Cómo Llegar</h4>
            <span className="text-[10px] text-gray-500">Mercado 2 Surquillo</span>
          </div>
        </a>
      </div>

      {/* Information List (PedidosYa store details style) */}
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-2xs overflow-hidden">
        
        {/* Ubicación */}
        <div className="p-4 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#00167A] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#2C2D2F]">Ubicación del Local</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Mercado 2 de Surquillo, Puesto 651, Surquillo, Lima
            </p>
            <span className="text-[11px] text-[#00167A] font-semibold block mt-1">
              Zonas de cobertura: Surquillo, Miraflores, San Isidro, San Borja, Surco, Barranco y distritos de Lima
            </span>
          </div>
        </div>

        {/* Horarios */}
        <div className="p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#00167A] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#2C2D2F]">Horarios de Atención</h4>
            <div className="text-xs text-gray-600 space-y-0.5 mt-0.5">
              <div className="flex justify-between">
                <span>Martes a Domingo:</span>
                <strong className="text-[#00167A]">11:30 AM – 6:00 PM</strong>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Lunes:</span>
                <span>Descanso del Fogón</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teléfono */}
        <div className="p-4 flex items-start gap-3">
          <Phone className="w-5 h-5 text-[#00167A] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#2C2D2F]">Central de Pedidos</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              +51 969 823 145 (Llamadas y WhatsApp)
            </p>
          </div>
        </div>

        {/* Calidad y Garantía */}
        <div className="p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#2C2D2F]">Compromiso Picantero</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Insumos frescos del día, limón legítimo de Chulucanas, plátano de Morropón y protocolos estrictos de higiene y empaque térmico.
            </p>
          </div>
        </div>

      </div>

      {/* Social Media Links */}
      <div className="flex justify-center gap-3">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#2C2D2F] hover:bg-gray-50 shadow-2xs"
        >
          <Instagram className="w-4 h-4 text-pink-600" />
          <span>@lafacinerosapiurana</span>
        </a>

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#2C2D2F] hover:bg-gray-50 shadow-2xs"
        >
          <Facebook className="w-4 h-4 text-blue-600" />
          <span>Facebook</span>
        </a>
      </div>

    </div>
  );
};
