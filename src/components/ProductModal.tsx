import React, { useState } from 'react';
import { Product, ExtraOption, SpiceLevel } from '../types';
import { COMMON_EXTRAS } from '../data/products';
import { X, Plus, Minus, Flame, Check, Info, ChevronDown, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    spiceLevel: SpiceLevel,
    selectedExtras: ExtraOption[],
    specialInstructions: string
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('medio');
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showExtrasAccordion, setShowExtrasAccordion] = useState(false);

  const availableExtras = product.availableExtras || COMMON_EXTRAS.slice(0, 3);

  const toggleExtra = (extra: ExtraOption) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const itemTotal = (product.price + extrasTotal) * quantity;

  const handleAdd = () => {
    onAddToCart(product, quantity, spiceLevel, selectedExtras, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Container - Bottom Sheet on mobile, centered modal on desktop */}
      <div className="relative bg-white w-full max-w-xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-[#00167A]/20 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Mobile Pull Bar */}
        <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 bg-black/40 absolute top-0 z-20">
          <div className="w-12 h-1 rounded-full bg-white/70" />
        </div>

        {/* Close button */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 active:scale-90 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Header */}
        <div className="relative h-44 sm:h-60 w-full bg-[#00167A]/10 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          
          <div className="absolute bottom-3 left-4 right-4 text-white">
            {product.badge && (
              <span className="inline-block bg-[#00167A] text-[#FFF3C1] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1 shadow-xs border border-[#FFF3C1]/20">
                {product.badge}
              </span>
            )}
            <h2 className="font-teko text-2xl sm:text-4xl font-bold uppercase tracking-wide leading-none drop-shadow-xs">
              {product.name}
            </h2>
            <div className="flex items-baseline gap-1 text-[#FFF3C1]">
              <span className="text-xs font-bold">S/</span>
              <span className="font-teko text-2xl sm:text-3xl font-bold leading-none">
                {product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Form */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {/* Description */}
          <p className="text-xs sm:text-sm text-[#2C2D2F]/85 leading-relaxed bg-[#F9F9F9] p-3 rounded-xl border border-[#00167A]/8">
            {product.description}
          </p>

          {/* Spice Level Option */}
          {product.category !== 'bebidas' && product.category !== 'guarniciones' && (
            <div>
              <label className="text-xs font-bold text-[#00167A] uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>Nivel de Ají & Picante</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sin_aji', label: 'Sin Ají', desc: 'Sabor suave' },
                  { id: 'medio', label: 'Toque Piurano', desc: 'Recomendado' },
                  { id: 'picante_bravo', label: 'Picante Bravo', desc: 'Ají limo' },
                ].map((item) => {
                  const isSelected = spiceLevel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSpiceLevel(item.id as SpiceLevel)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#00167A] bg-[#00167A]/5 text-[#00167A] ring-1 ring-[#00167A]'
                          : 'border-gray-200 hover:border-gray-300 text-[#2C2D2F] bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Extras (Collapsible Accordion Button) */}
          {availableExtras.length > 0 && (
            <div className="border border-[#00167A]/15 rounded-2xl overflow-hidden bg-white shadow-2xs">
              {/* Accordion Trigger Button */}
              <button
                type="button"
                id="btn-toggle-extras"
                onClick={() => setShowExtrasAccordion(!showExtrasAccordion)}
                className={`w-full px-3.5 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  showExtrasAccordion || selectedExtras.length > 0
                    ? 'bg-[#FFF3C1]/30'
                    : 'bg-gray-50/70 hover:bg-[#FFF3C1]/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#00167A]/10 text-[#00167A] flex items-center justify-center shrink-0">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#00167A] flex items-center gap-1.5">
                      <span>¿Deseas agregar guarnición o extra?</span>
                      <span className="text-[10px] font-normal text-gray-400 lowercase">(opcional)</span>
                    </div>
                    {selectedExtras.length > 0 && (
                      <p className="text-[11px] font-semibold text-emerald-700 pt-0.5">
                        {selectedExtras.length} {selectedExtras.length === 1 ? 'extra agregado' : 'extras agregados'} (+S/ {extrasTotal.toFixed(2)})
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {selectedExtras.length > 0 && (
                    <span className="bg-[#00167A] text-[#FFF3C1] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {selectedExtras.length}
                    </span>
                  )}
                  <div
                    className={`w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 transition-transform duration-200 ${
                      showExtrasAccordion ? 'rotate-180 bg-[#00167A] text-white border-[#00167A]' : ''
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {showExtrasAccordion && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 border-t border-[#00167A]/10 bg-white space-y-2">
                      {availableExtras.map((extra) => {
                        const isChecked = selectedExtras.some((e) => e.id === extra.id);
                        return (
                          <div
                            key={extra.id}
                            onClick={() => toggleExtra(extra)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? 'border-[#00167A] bg-[#FFF3C1]/35 text-[#00167A] shadow-2xs'
                                : 'border-gray-200 hover:border-gray-300 text-[#2C2D2F] bg-gray-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                  isChecked
                                    ? 'bg-[#00167A] border-[#00167A] text-white'
                                    : 'border-gray-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                              <span className="text-xs font-medium">{extra.name}</span>
                            </div>
                            <span className="text-xs font-bold text-[#00167A]">
                              + S/ {extra.price.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="text-xs font-bold text-[#00167A] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#00167A]" />
              <span>Instrucciones especiales para cocina</span>
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ej: sin cebolla en la sarza, plátano bien frito, etc."
              className="w-full px-3 py-2 bg-[#F9F9F9] border border-gray-200 rounded-xl text-xs text-[#2C2D2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00167A]"
            />
          </div>
        </div>

        {/* Modal Footer (Sticky at bottom of modal) */}
        <div className="p-3.5 sm:p-5 bg-white border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center bg-[#F9F9F9] border border-[#00167A]/20 rounded-xl p-0.5 sm:p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#00167A] hover:bg-[#FFF3C1] disabled:opacity-30 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 sm:w-8 text-center font-teko text-xl sm:text-2xl font-bold text-[#00167A]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#00167A] hover:bg-[#FFF3C1] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button */}
          <button
            id="modal-add-to-cart-btn"
            onClick={handleAdd}
            className="flex-1 py-3 px-4 bg-[#00167A] hover:bg-[#00167A]/90 text-[#FFF3C1] font-bold rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer"
          >
            <span>Agregar al Pedido</span>
            <span className="font-teko text-2xl leading-none text-[#FFF3C1]">
              S/ {itemTotal.toFixed(2)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
