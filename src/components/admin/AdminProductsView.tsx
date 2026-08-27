import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, CategoryId, ExtraOption } from '../../types';
import { CATEGORIES } from '../../data/products';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  RotateCcw, 
  Sparkles, 
  Image as ImageIcon, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const SAMPLE_PERUVIAN_PHOTOS = [
  { label: 'Seco / Majado', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chancho / Chicharrón', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ceviche / Mariscos', url: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80' },
  { label: 'Ronda Picantera', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tamalito / Entrada', url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chicha / Bebida', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' },
];

export const AdminProductsView: React.FC = () => {
  const { products, toggleProductAvailability, saveProduct, deleteProduct, resetProducts } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filter
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'todos' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenNewProduct = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: '',
      category: 'insignias',
      price: 35,
      description: '',
      image: SAMPLE_PERUVIAN_PHOTOS[0].url,
      badge: 'Nuevo Plato',
      isPopular: false,
      isSpicy: false,
      isAvailable: true,
      prepTime: '15-20 min',
      portions: '1-2 personas',
      availableExtras: [
        { id: 'chifles', name: 'Chifles Piuranos', price: 6 },
        { id: 'zarza', name: 'Zarza Criolla', price: 4 },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) {
      alert('Por favor completa el nombre y precio del plato.');
      return;
    }

    setIsSaving(true);
    try {
      await saveProduct(editingProduct as Product);
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-teko text-2xl font-bold uppercase tracking-wider text-[#00167A] leading-none">
            Catálogo & Stock de Productos
          </h3>
          <p className="text-xs text-gray-500">
            Administra precios, fotos, descripciones y disponibilidad en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetProducts}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Restaurar carta original de La Facinerosa"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar Carta
          </button>

          <button
            type="button"
            onClick={handleOpenNewProduct}
            className="px-4 py-2 bg-[#00167A] hover:bg-[#00167A]/90 text-[#FFF3C1] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nuevo Plato / Bebida
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre de plato o ingredientes..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#00167A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#00167A] text-[#FFF3C1]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredProducts.map(product => {
          const isAvailable = product.isAvailable !== false;

          return (
            <div
              key={product.id}
              className={`bg-white rounded-3xl border transition-all p-3.5 flex flex-col justify-between shadow-xs ${
                isAvailable ? 'border-gray-200' : 'border-red-200 bg-red-50/20'
              }`}
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden aspect-16/10 mb-2.5 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover ${!isAvailable ? 'grayscale opacity-75' : ''}`}
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#00167A] text-[#FFF3C1] text-[10px] font-bold rounded-lg uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2C2D2F] leading-tight">
                      {product.name}
                    </h4>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mt-0.5">
                      Categoría: {product.category}
                    </span>
                  </div>
                  <span className="font-extrabold text-sm text-[#00167A] shrink-0">
                    S/ {product.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1.5 leading-tight">
                  {product.description}
                </p>
              </div>

              {/* Action Bar */}
              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                {/* Stock Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleProductAvailability(product.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                  title="Cambiar disponibilidad en tienda y POS"
                >
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span>{isAvailable ? 'Disponible' : 'Agotado'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditProduct(product)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-[#00167A] hover:text-white text-gray-700 transition-colors cursor-pointer"
                    title="Editar plato"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar "${product.name}" del menú?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700 transition-colors cursor-pointer"
                    title="Eliminar plato"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT / CREATE PRODUCT MODAL */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#00167A] text-white flex items-center justify-between">
              <div>
                <h3 className="font-teko text-2xl font-bold uppercase tracking-wider text-[#FFF3C1] leading-none">
                  {editingProduct.name ? 'Editar Plato' : 'Nuevo Plato en Carta'}
                </h3>
                <p className="text-[11px] text-white/80">Configura la información del producto</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="font-bold text-gray-700 block mb-1">Nombre del Plato *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Seco de Chabelo Especial"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-[#00167A]"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="font-bold text-gray-700 block mb-1">Categoría</label>
                  <select
                    value={editingProduct.category || 'insignias'}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value as CategoryId }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-[#00167A]"
                  >
                    {CATEGORIES.filter(c => c.id !== 'todos').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Precio (S/) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-[#00167A]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Tiempo Prep.</label>
                  <input
                    type="text"
                    value={editingProduct.prepTime || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, prepTime: e.target.value }))}
                    placeholder="20 min"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Etiqueta Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="Ej: Plato Estrella"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Descripción del Plato</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detalla los ingredientes y preparación..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              {/* Photo selection */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">URL de la Foto</label>
                <input
                  type="text"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />

                <span className="text-[10px] text-gray-400 block mt-1">Fotos sugeridas (toca para aplicar):</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {SAMPLE_PERUVIAN_PHOTOS.map(photo => (
                    <button
                      key={photo.label}
                      type="button"
                      onClick={() => setEditingProduct(prev => ({ ...prev, image: photo.url }))}
                      className="px-2 py-1 bg-gray-100 hover:bg-[#00167A] hover:text-[#FFF3C1] rounded-lg text-[10px] font-semibold transition-colors"
                    >
                      {photo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes for spicy & popular */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPopular || false}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="rounded text-[#00167A]"
                  />
                  <span>Destacar como Más Pedido 🔥</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingProduct.isSpicy || false}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, isSpicy: e.target.checked }))}
                    className="rounded text-[#00167A]"
                  />
                  <span>Plato Picante 🌶️</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-200 flex gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-2/3 py-2.5 bg-[#00167A] hover:bg-[#00167A]/90 text-[#FFF3C1] font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#FFF3C1] border-t-transparent rounded-full animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    'Guardar Plato'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
