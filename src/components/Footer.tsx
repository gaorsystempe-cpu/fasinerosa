import React from 'react';
import { BrandLogo, BrandEmblem } from './BrandLogo';
import { MapPin, Phone, Clock, Instagram, Facebook, Heart, ShieldCheck, Store, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenBrandStory?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings, isAdmin } = useStore();

  return (
    <footer className="bg-[#00167A] text-white border-t border-white/10 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/15">
          
          {/* Brand Presentation */}
          <div className="space-y-3">
            <BrandLogo variant="cream" size="md" />
            <p className="text-xs text-white/80 leading-relaxed font-sans max-w-sm">
              Auténtica gastronomía piurana. Pescados y mariscos frescos del día en el Mercado 2 de Surquillo y delivery a todo Lima.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {settings.socialInstagram && (
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#FFF3C1] hover:bg-white/20 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialFacebook && (
                <a
                  href={settings.socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#FFF3C1] hover:bg-white/20 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Location & Coverage */}
          <div className="space-y-2.5">
            <h4 className="font-teko text-xl font-bold uppercase text-[#FFF3C1] tracking-wide">
              Ubicación
            </h4>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFF3C1] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <p className="text-white/60 pl-6">
                Delivery disponible a Surquillo, Miraflores, San Isidro, San Borja, Surco y alrededores.
              </p>
            </div>
          </div>

          {/* Horarios & Contacto */}
          <div className="space-y-2.5">
            <h4 className="font-teko text-xl font-bold uppercase text-[#FFF3C1] tracking-wide">
              Atención & Pedidos
            </h4>
            <div className="space-y-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFF3C1]" />
                <span>{settings.openingHours}</span>
              </div>
              <a 
                href={`https://wa.me/${settings.phone.replace(/\D/g, '')}?text=Hola%20La%20Facinerosa,%20deseo%20hacer%20un%20pedido`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#FFF3C1] font-bold hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp: {settings.phone}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Discreet Staff Access */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-3">
          <p>© {new Date().getFullYear()} {settings.businessName}. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Gastronomía Piurana <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            </span>

            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-[11px] text-white/40 hover:text-[#FFF3C1] transition-colors flex items-center gap-1 cursor-pointer"
                title="Acceso Personal / POS"
              >
                <Store className="w-3 h-3" />
                <span>{isAdmin ? 'Panel POS' : 'Personal'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

