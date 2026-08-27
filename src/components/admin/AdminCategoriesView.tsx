import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { supabaseService } from '../../services/supabaseService';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Check, 
  X, 
  RefreshCw, 
  Flame, 
  Sparkles, 
  Fish, 
  Users, 
  Wine, 
  Cookie, 
  Utensils, 
  Coffee, 
  Beer, 
  Pizza, 
  IceCream, 
  ChefHat, 
  Salad, 
  Sandwich, 
  Soup,
  Layers,
  AlertCircle,
  Eye,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'Utensils', label: 'Cubiertos', icon: Utensils },
  { name: 'Flame', label: 'Fuego / Brasa', icon: Flame },
  { name: 'Sparkles', label: 'Estrellas / Piqueos', icon: Sparkles },
  { name: 'Fish', label: 'Pescados / Marinos', icon: Fish },
  { name: 'Users', label: 'Familiar / Rondas', icon: Users },
  { name: 'Wine', label: 'Bebidas / Chichas', icon: Wine },
  { name: 'Beer', label: 'Cervezas', icon: Beer },
  { name: 'Coffee', label: 'Cafetería', icon: Coffee },
  { name: 'Cookie', label: 'Postres / Dulces', icon: Cookie },
  { name: 'IceCream', label: 'Helados', icon: IceCream },
  { name: 'Pizza', label: 'Pizzas / Masas', icon: Pizza },
  { name: 'ChefHat', label: 'Chef / Especial', icon: ChefHat },
  { name: 'Salad', label: 'Ensaladas / Guarnición', icon: Salad },
  { name: 'Sandwich', label: 'Sánguches', icon: Sandwich },
  { name: 'Soup', label: 'Sopas / Caldos', icon: Soup },
];

export const AdminCategoriesView: React.FC = () => {
  const { categories, saveCategory, deleteCategory, resetCategories, products } = useStore();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formIcon, setFormIcon] = useState('Utensils');
  const [formBadge, setFormBadge] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSortOrder, setFormSortOrder] = useState<number>(0);

  // Image Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories to display (ignore 'todos' in grid management, or allow editing it with special badge)
  const manageableCategories = categories;

  // Dish counts per category
  const getDishCount = (categoryId: string) => {
    if (categoryId === 'todos') return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  const handleOpenCreate = () => {
    setIsCreatingNew(true);
    setEditingCategory(null);
    setFormId('');
    setFormName('');
    setFormImage('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80');
    setFormIcon('Flame');
    setFormBadge('');
    setFormDescription('');
    setFormSortOrder(categories.length);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleOpenEdit = (cat: Category) => {
    setIsCreatingNew(false);
    setEditingCategory(cat);
    setFormId(cat.id);
    setFormName(cat.name);
    setFormImage(cat.image || '');
    setFormIcon(cat.icon || 'Utensils');
    setFormBadge(cat.badge || '');
    setFormDescription(cat.description || '');
    setFormSortOrder(cat.sortOrder ?? 0);
    setUploadError(null);
    setUploadSuccess(false);
  };

  // Helper to slugify name
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle direct file upload to Supabase Storage
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('La imagen supera el límite de 10 MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const result = await supabaseService.uploadImage(file, 'categories');
      if (result.url) {
        setFormImage(result.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(result.error || 'Error al subir la imagen.');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error inesperado al subir la foto.');
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if desired
      if (event.target) event.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('El nombre de la categoría es obligatorio.');
      return;
    }

    let finalId = formId.trim();
    if (isCreatingNew || !finalId) {
      finalId = slugify(formName);
      if (!finalId) finalId = `cat-${Date.now()}`;
      // Check if id already exists
      let counter = 1;
      let checkId = finalId;
      while (categories.some(c => c.id === checkId)) {
        checkId = `${finalId}-${counter}`;
        counter++;
      }
      finalId = checkId;
    }

    const categoryData: Category = {
      id: finalId,
      name: formName.trim(),
      image: formImage.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      icon: formIcon,
      badge: formBadge.trim() || undefined,
      description: formDescription.trim() || undefined,
      sortOrder: Number(formSortOrder) || 0,
    };

    await saveCategory(categoryData);

    setSaveSuccessMessage(`Categoría "${categoryData.name}" guardada con éxito.`);
    setTimeout(() => setSaveSuccessMessage(null), 3000);

    setEditingCategory(null);
    setIsCreatingNew(false);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    if (categoryToDelete.id === 'todos') {
      alert('La categoría general no se puede eliminar.');
      setCategoryToDelete(null);
      return;
    }

    await deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
    setSaveSuccessMessage('Categoría eliminada.');
    setTimeout(() => setSaveSuccessMessage(null), 2500);
  };

  const renderIconComponent = (iconName?: string) => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    const IconComp = found ? found.icon : Utensils;
    return <IconComp className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#00167A] text-[#FFF3C1] flex items-center justify-center font-bold shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#00167A] tracking-tight">
                Gestión de Categorías & Fotos
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Crea nuevas categorías, cambia sus portadas (fotos), asigna iconos y organiza la vitrina del cliente.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetCategories}
            className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Restaura las 6 categorías originales norteñas de La Facinerosa"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restaurar Originales</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#00167A] hover:bg-[#001260] text-[#FFF3C1] text-xs font-black flex items-center gap-2 shadow-sm transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Categories Grid (Live previews of how they appear in storefront) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {manageableCategories.map((cat) => {
          const dishCount = getDishCount(cat.id);
          const isSystemTodos = cat.id === 'todos';

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Category Cover Image Box */}
              <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Badge Top Left */}
                {cat.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#FFD700] text-[#00167A] text-[10px] font-black uppercase tracking-wider shadow-xs">
                    {cat.badge}
                  </span>
                )}

                {/* Dish Count Pill Top Right */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                  {dishCount} {dishCount === 1 ? 'plato' : 'platos'}
                </span>

                {/* Text Bottom of Photo */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF3C1]/20 backdrop-blur-xs text-[#FFF3C1] flex items-center justify-center">
                      {renderIconComponent(cat.icon)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base leading-tight text-white drop-shadow-xs">
                        {cat.name}
                      </h3>
                      <p className="text-[10px] text-white/70 font-mono">
                        ID: {cat.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description and Action Bar */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3 bg-slate-50/50">
                {cat.description ? (
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {cat.description}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    {isSystemTodos 
                      ? 'Categoría principal que engloba toda la carta.' 
                      : 'Visible en el filtro superior y en la grilla visual de la tienda.'}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Orden: #{cat.sortOrder ?? 0}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="px-3 py-1.5 rounded-lg bg-[#00167A]/10 hover:bg-[#00167A] text-[#00167A] hover:text-[#FFF3C1] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Editar nombre, foto de portada o icono"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    {!isSystemTodos && (
                      <button
                        type="button"
                        onClick={() => setCategoryToDelete(cat)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT / CREATE MODAL */}
      {(isCreatingNew || editingCategory) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-auto">
            {/* Modal Header */}
            <div className="bg-[#00167A] px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFF3C1]/20 flex items-center justify-center text-[#FFF3C1]">
                  {isCreatingNew ? <Plus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-black text-base text-[#FFF3C1]">
                    {isCreatingNew ? 'Crear Nueva Categoría' : `Editar: ${editingCategory?.name}`}
                  </h3>
                  <p className="text-[11px] text-white/70">
                    Personaliza el nombre, foto de portada e icono
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingCategory(null);
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nombre de la Categoría <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (isCreatingNew && !formId) {
                      setFormId(slugify(e.target.value));
                    }
                  }}
                  placeholder="Ej. Ceviches & Marinos, Bebidas Típicas, Postres..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#00167A] focus:border-[#00167A]"
                />
              </div>

              {/* Photo & Image Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Foto de Portada (Fondo de la Tarjeta)
                </label>
                
                {/* Image Preview & Upload Button */}
                <div className="space-y-3">
                  <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-200">
                    <img
                      src={formImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Live Preview Text Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#FFF3C1]/20 text-[#FFF3C1] flex items-center justify-center">
                          {renderIconComponent(formIcon)}
                        </div>
                        <span className="font-extrabold text-sm text-white drop-shadow-xs">
                          {formName || 'Nombre de la Categoría'}
                        </span>
                      </div>
                    </div>

                    {isUploading && (
                      <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#FFD700]" />
                        <span className="text-xs font-bold">Subiendo a Supabase Storage...</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{isUploading ? 'Subiendo...' : '📷 Subir Foto (Cámara / Galería)'}</span>
                    </button>
                  </div>

                  {uploadSuccess && (
                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ¡Foto subida y guardada en Supabase con éxito!
                    </p>
                  )}

                  {uploadError && (
                    <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {uploadError}
                    </p>
                  )}

                  {/* Manual URL fallback */}
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">
                      O pega una URL directa de imagen si lo prefieres:
                    </span>
                    <input
                      type="url"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#00167A]"
                    />
                  </div>
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Icono Representativo
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconC = item.icon;
                    const isSelected = formIcon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormIcon(item.name)}
                        className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#00167A] text-[#FFF3C1] ring-2 ring-[#00167A] shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                        title={item.label}
                      >
                        <IconC className="w-4 h-4" />
                        <span className="text-[9px] font-bold truncate max-w-[50px] leading-tight">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid 2 Columns: Badge & Sort Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Distintivo / Badge (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Ej. Especialidad, Nuevo..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#00167A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Orden de Posición (#)
                  </label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#00167A]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descripción Corta (Opcional)
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Breve detalle de los platos en esta sección..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#00167A]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#00167A] hover:bg-[#001260] text-[#FFF3C1] text-xs font-black flex items-center gap-1.5 shadow-md transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreatingNew ? 'Crear Categoría' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900">
                ¿Eliminar categoría "{categoryToDelete.name}"?
              </h3>
              {getDishCount(categoryToDelete.id) > 0 && (
                <div className="mt-2 p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-semibold text-amber-800 text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Atención: Hay <strong>{getDishCount(categoryToDelete.id)} platos</strong> asignados a esta categoría. Al eliminarla, deberás reasignarlos a otra categoría para que sigan visibles.
                  </span>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Esta acción eliminará la tarjeta visual y la opción en los filtros de la tienda.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
