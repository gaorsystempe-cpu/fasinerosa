import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { AppSettings } from '../../types';
import { supabaseService } from '../../services/supabaseService';
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
  Flame,
  Camera,
  Loader2,
  X
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useStore();
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [showManualHeroUrl, setShowManualHeroUrl] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen de portada es muy pesada (máximo 10MB).');
      return;
    }

    setIsUploadingHero(true);
    try {
      const res = await supabaseService.uploadImage(file, 'banners');
      if (res.url) {
        setFormData(prev => ({ ...prev, heroImage: res.url }));
        setSavedSuccess(false);
      } else {
        alert(res.error || 'No se pudo subir la foto de portada.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error subiendo imagen: ' + (err?.message || ''));
    } finally {
      setIsUploadingHero(false);
      if (heroInputRef.current) heroInputRef.current.value = '';
    }
  };

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

          {/* Hero Banner Image Direct Upload */}
          <div className="space-y-2 pt-1">
            <label className="font-bold text-gray-700 block">Foto de Portada Principal (Hero Banner)</label>

            <input
              type="file"
              ref={heroInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleHeroUpload}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
              <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-gray-200 border border-gray-300 flex-shrink-0 shadow-xs">
                {formData.heroImage ? (
                  <img
                    src={formData.heroImage}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-[10px]">
                    <ImageIcon className="w-5 h-5 mb-1" />
                    <span>Sin portada</span>
                  </div>
                )}

                {isUploadingHero && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-5 h-5 animate-spin mb-1 text-[#FFF3C1]" />
                    <span className="text-[9px] font-bold">Subiendo...</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isUploadingHero}
                    onClick={() => heroInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-[#00167A] hover:bg-[#00167A]/90 text-[#FFF3C1] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{formData.heroImage ? 'Cambiar Foto de Portada' : 'Subir Foto de Portada'}</span>
                  </button>

                  {formData.heroImage && (
                    <button
                      type="button"
                      onClick={() => handleChange('heroImage', '')}
                      className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 cursor-pointer transition-colors"
                      title="Quitar foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-gray-500">
                    {isUploadingHero ? 'Guardando en Supabase Storage...' : 'Sube foto horizontal de alta calidad'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowManualHeroUrl(!showManualHeroUrl)}
                    className="text-[10px] text-[#00167A] font-bold hover:underline cursor-pointer"
                  >
                    {showManualHeroUrl ? 'Ocultar URL manual' : 'O usar link manual'}
                  </button>
                </div>
              </div>
            </div>

            {showManualHeroUrl && (
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 mt-2">
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Ingresar URL directa</label>
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => handleChange('heroImage', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                />
              </div>
            )}
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
