import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AppSettings } from '../../types';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Share2, 
  Truck, 
  KeyRound, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  Sparkles,
  Image as ImageIcon,
  Flame
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useStore();
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof AppSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleReset = () => {
    if (confirm('¿Restaurar toda la configuración original del front-end?')) {
      resetSettings();
      setFormData({ ...settings });
      setSavedSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-5">
      {/* Header & Save */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-teko text-2xl font-bold uppercase tracking-wider text-[#00167A] leading-none">
            Configuración del Front-End & Negocio
          </h3>
          <p className="text-xs text-gray-500">
            Personaliza en tiempo real fotos, textos de portada, horarios, WhatsApp y redes sociales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Guardar Cambios
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Configuración guardada exitosamente! Los cambios ya se reflejan en la tienda online y punto de venta.</span>
        </div>
      )}

      {/* Grid of Setting Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 1. Datos del Local y Atención */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Store className="w-4 h-4 text-[#00167A]" />
            <h4 className="font-bold text-sm text-[#00167A] uppercase tracking-wider">
              Datos del Local & Contacto
            </h4>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Nombre Comercial del Negocio</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:ring-2 focus:ring-[#00167A]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Slogan / Subtítulo</label>
            <input
              type="text"
              value={formData.businessTagline}
              onChange={(e) => handleChange('businessTagline', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00167A]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Dirección del Puesto</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00167A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Teléfono WhatsApp Pedidos</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+51 969 823 145"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:ring-2 focus:ring-[#00167A]"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Horario de Atención</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                placeholder="10:00 AM - 6:00 PM"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00167A]"
              />
            </div>
          </div>
        </div>

        {/* 2. Textos de Portada & Hero Banner */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="font-bold text-sm text-[#00167A] uppercase tracking-wider">
              Portada & Textos del Front-End
            </h4>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Aviso Superior (Marquee Banner)</label>
            <input
              type="text"
              value={formData.bannerNotice}
              onChange={(e) => handleChange('bannerNotice', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00167A]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Título Gigante del Hero</label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => handleChange('heroTitle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:ring-2 focus:ring-[#00167A]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Subtítulo Descriptivo</label>
            <textarea
              rows={2}
              value={formData.heroSubtitle}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00167A]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">URL de la Foto de Portada</label>
            <input
              type="text"
              value={formData.heroImage}
              onChange={(e) => handleChange('heroImage', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00167A]"
            />
          </div>
        </div>

        {/* 3. Redes Sociales */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Share2 className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-sm text-[#00167A] uppercase tracking-wider">
              Redes Sociales & Enlaces
            </h4>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Enlace Instagram</label>
            <input
              type="text"
              value={formData.socialInstagram}
              onChange={(e) => handleChange('socialInstagram', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00167A]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Enlace TikTok</label>
            <input
              type="text"
              value={formData.socialTiktok}
              onChange={(e) => handleChange('socialTiktok', e.target.value)}
              placeholder="https://tiktok.com/@..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00167A]"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Enlace Google Maps</label>
            <input
              type="text"
              value={formData.socialGoogleMaps}
              onChange={(e) => handleChange('socialGoogleMaps', e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00167A]"
            />
          </div>
        </div>

        {/* 4. Tarifas de Delivery & Seguridad */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3.5 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Truck className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-sm text-[#00167A] uppercase tracking-wider">
              Delivery & Seguridad Admin
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Tarifa Delivery Base (S/)</label>
              <input
                type="number"
                step="0.5"
                value={formData.baseDeliveryFee}
                onChange={(e) => handleChange('baseDeliveryFee', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:ring-2 focus:ring-[#00167A]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Envío Gratis Desde (S/)</label>
              <input
                type="number"
                step="1"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => handleChange('freeDeliveryThreshold', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:ring-2 focus:ring-[#00167A]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className="font-bold text-gray-700 block mb-1">PIN de Seguridad Administrador</label>
            <input
              type="text"
              maxLength={6}
              value={formData.adminPin}
              onChange={(e) => handleChange('adminPin', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-mono font-bold text-sm focus:ring-2 focus:ring-[#00167A]"
            />
            <p className="text-[10px] text-gray-400 mt-1">Clave de 4 dígitos para ingresar al sistema de gestión.</p>
          </div>
        </div>

      </div>
    </form>
  );
};
