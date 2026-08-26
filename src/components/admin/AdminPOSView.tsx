import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Product, 
  CartItem, 
  CategoryId, 
  POSSaleType, 
  PaymentMethod, 
  POSSale,
  SpiceLevel,
  ExtraOption
} from '../../types';
import { CATEGORIES } from '../../data/products';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Store, 
  Check, 
  Printer, 
  User, 
  Lock, 
  Unlock, 
  Coins, 
  Sparkles, 
  UtensilsCrossed,
  X,
  AlertCircle
} from 'lucide-react';
import { ThermalTicketModal } from './ThermalTicketModal';

export const AdminPOSView: React.FC = () => {
  const { 
    products, 
    cashShift, 
    openCashShift, 
    closeCashShift, 
    createPOSSale, 
    settings 
  } = useStore();

  // POS State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saleType, setSaleType] = useState<POSSaleType>('mostrador');
  const [tableNumber, setTableNumber] = useState('Mesa 1');
  const [customerName, setCustomerName] = useState('');
  const [customerDoc, setCustomerDoc] = useState('');

  // Item customization modal
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel>('medio');
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [customNotes, setCustomNotes] = useState('');

  // Cashier Modal
  const [isCashShiftModalOpen, setIsCashShiftModalOpen] = useState(false);
  const [initialCashInput, setInitialCashInput] = useState('150');
  const [cashierNameInput, setCashierNameInput] = useState('Cajero Puesto 651');
  const [countedCashInput, setCountedCashInput] = useState('');
  const [shiftNotesInput, setShiftNotesInput] = useState('');

  // Payment Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [cashReceived, setCashReceived] = useState<string>('');
  
  // Last sale for ticket print
  const [completedSale, setCompletedSale] = useState<POSSale | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketType, setTicketType] = useState<'cliente' | 'cocina'>('cliente');

  // Filtered products
  const availableProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'todos' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.itemTotal, 0);
  }, [cart]);
  const total = subtotal;

  const numCashReceived = parseFloat(cashReceived) || 0;
  const changeAmount = Math.max(0, numCashReceived - total);

  // Add Product to Cart
  const handleQuickAdd = (product: Product) => {
    if (product.isAvailable === false) return;

    if (product.availableExtras && product.availableExtras.length > 0) {
      // Open customization modal
      setCustomizingProduct(product);
      setSelectedSpice('medio');
      setSelectedExtras([]);
      setCustomNotes('');
    } else {
      // Direct add
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity: 1,
        spiceLevel: 'medio',
        selectedExtras: [],
        itemTotal: product.price,
      };
      setCart(prev => [...prev, newItem]);
    }
  };

  const handleConfirmCustomItem = () => {
    if (!customizingProduct) return;
    const extrasTotal = selectedExtras.reduce((acc, ex) => acc + ex.price, 0);
    const itemTotal = customizingProduct.price + extrasTotal;

    const newItem: CartItem = {
      id: `${customizingProduct.id}-${Date.now()}`,
      product: customizingProduct,
      quantity: 1,
      spiceLevel: selectedSpice,
      selectedExtras,
      specialInstructions: customNotes.trim() || undefined,
      itemTotal,
    };

    setCart(prev => [...prev, newItem]);
    setCustomizingProduct(null);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const item = updated[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      const unitPrice = item.product.price + (item.selectedExtras?.reduce((a, e) => a + e.price, 0) || 0);
      item.quantity = newQty;
      item.itemTotal = unitPrice * newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerDoc('');
  };

  // Open Checkout
  const handleOpenPayModal = () => {
    if (cart.length === 0) return;
    setCashReceived(total.toString());
    setIsPayModalOpen(true);
  };

  // Complete Sale
  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'efectivo' && numCashReceived < total) {
      alert('El monto en efectivo ingresado es menor al total a cobrar.');
      return;
    }

    const sale = createPOSSale({
      saleType,
      tableNumber: saleType === 'mesa' ? tableNumber : undefined,
      customerName: customerName.trim() || 'Cliente Mostrador',
      customerDoc: customerDoc.trim() || undefined,
      items: cart,
      subtotal,
      discount: 0,
      total,
      paymentMethod,
      cashGiven: paymentMethod === 'efectivo' ? numCashReceived : undefined,
      changeAmount: paymentMethod === 'efectivo' ? changeAmount : undefined,
      cashierName: cashShift.cashierName || 'Cajero Puesto 651',
    });

    setCompletedSale(sale);
    setIsPayModalOpen(false);
    handleClearCart();
    setTicketType('cliente');
    setIsTicketModalOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* LEFT COLUMN: Products catalog & search (Touch-optimized) */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        
        {/* Top Shift Status & Search Bar */}
        <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#00167A] text-[#FFF3C1] flex items-center justify-center font-bold">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-[#00167A] leading-tight">
                  Punto de Venta Local • Puesto 651
                </h3>
                <p className="text-[10px] sm:text-[11px] text-gray-500">
                  Mercado 2 de Surquillo • {cashShift.isOpen ? `Caja Abierta: S/ ${cashShift.totalSales.toFixed(2)} acumulados` : 'Caja Cerrada'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCashShiftModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                cashShift.isOpen 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200' 
                  : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 animate-pulse'
              }`}
            >
              {cashShift.isOpen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{cashShift.isOpen ? 'Caja Abierta' : 'Aperturar Caja'}</span>
            </button>
          </div>

          {/* Search bar & quick category pills */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar plato o bebida en carta..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00167A]"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-xs font-bold text-gray-700"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Category Tabs (Scrollable on mobile/tablet) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#00167A] text-[#FFF3C1] shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 max-h-[60vh] lg:max-h-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {availableProducts.map(product => {
              const isOut = product.isAvailable === false;
              return (
                <div
                  key={product.id}
                  onClick={() => !isOut && handleQuickAdd(product)}
                  className={`p-2.5 rounded-2xl border transition-all flex flex-col justify-between select-none ${
                    isOut
                      ? 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                      : 'bg-white border-gray-200/90 hover:border-[#00167A] hover:shadow-md active:scale-98 cursor-pointer'
                  }`}
                >
                  <div className="relative mb-2 rounded-xl overflow-hidden aspect-4/3 bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {product.badge && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#00167A] text-[#FFF3C1] text-[9px] font-bold rounded-md uppercase">
                        {product.badge}
                      </span>
                    )}
                    {isOut && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center text-white text-[11px] font-bold uppercase">
                        Agotado
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#2C2D2F] line-clamp-2 leading-tight">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                      <span className="text-xs font-extrabold text-[#00167A]">
                        S/ {product.price.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        disabled={isOut}
                        className="w-6 h-6 rounded-lg bg-[#00167A] text-[#FFF3C1] flex items-center justify-center hover:bg-[#00167A]/80 transition-colors shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {availableProducts.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-xs">
              No se encontraron platos para la búsqueda seleccionada.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: POS Cart & Ticket Order Panel */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-3xl border border-gray-200/80 shadow-md overflow-hidden shrink-0">
        
        {/* Ticket Header & Sale Type */}
        <div className="p-4 bg-[#00167A] text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#FFF3C1]" />
              <span className="font-teko text-xl font-bold uppercase tracking-wider text-[#FFF3C1] leading-none">
                Comanda de Venta
              </span>
            </div>
            <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full font-mono">
              {cart.length} {cart.length === 1 ? 'ítem' : 'ítems'}
            </span>
          </div>

          {/* Sale Type Pills */}
          <div className="grid grid-cols-3 gap-1 bg-white/10 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setSaleType('mostrador')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                saleType === 'mostrador' ? 'bg-[#FFF3C1] text-[#00167A] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Mostrador
            </button>
            <button
              type="button"
              onClick={() => setSaleType('mesa')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                saleType === 'mesa' ? 'bg-[#FFF3C1] text-[#00167A] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              En Mesa
            </button>
            <button
              type="button"
              onClick={() => setSaleType('llevar')}
              className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                saleType === 'llevar' ? 'bg-[#FFF3C1] text-[#00167A] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Para Llevar
            </button>
          </div>

          {/* Table / Customer inputs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {saleType === 'mesa' && (
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="px-2.5 py-1.5 bg-white text-gray-800 rounded-lg font-semibold focus:outline-none"
              >
                {['Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6', 'Barra 1', 'Barra 2'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Cliente (Opcional)"
              className="px-2.5 py-1.5 bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg text-xs focus:outline-none focus:bg-white focus:text-gray-800"
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 p-3 overflow-y-auto max-h-[300px] lg:max-h-[360px] space-y-2 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-300">
                <Store className="w-6 h-6" />
              </div>
              <p className="text-xs">Ticket vacío. Toca un plato del catálogo para agregarlo a la comanda.</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2 text-xs">
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-[#2C2D2F] truncate leading-tight">
                    {item.product.name}
                  </h5>
                  <div className="text-[10px] text-gray-500 space-y-0.5 mt-0.5">
                    {item.spiceLevel === 'picante_bravo' && (
                      <span className="text-red-600 font-bold block">🌶️ Picante Bravo</span>
                    )}
                    {item.spiceLevel === 'sin_aji' && (
                      <span className="text-gray-400 block">🚫 Sin ají</span>
                    )}
                    {item.selectedExtras?.map(ex => (
                      <span key={ex.id} className="text-amber-700 block">+ {ex.name} (+S/ {ex.price})</span>
                    ))}
                    {item.specialInstructions && (
                      <span className="text-blue-700 italic block">Nota: {item.specialInstructions}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#00167A] block mt-1">
                    S/ {item.itemTotal.toFixed(2)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(index, -1)}
                    className="w-6 h-6 rounded-lg bg-white shadow-2xs hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(index, 1)}
                    className="w-6 h-6 rounded-lg bg-white shadow-2xs hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Totals & Checkout Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">Total a Cobrar:</span>
            <span className="font-teko text-3xl font-bold text-[#00167A] leading-none">
              S/ {total.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleClearCart}
              className="py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer"
            >
              Borrar
            </button>
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleOpenPayModal}
              className="col-span-3 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Cobrar S/ {total.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOMIZE ITEM MODAL */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
            <div className="p-4 bg-[#00167A] text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#FFF3C1]">{customizingProduct.name}</h4>
                <p className="text-[11px] text-white/80">Configurar nivel de picante y extras</p>
              </div>
              <button
                onClick={() => setCustomizingProduct(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Spice Level */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Nivel de Picante
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: 'sin_aji' as SpiceLevel, label: 'Sin Ají' },
                    { id: 'medio' as SpiceLevel, label: 'Medio 🌶️' },
                    { id: 'picante_bravo' as SpiceLevel, label: 'Bravo 🌶️🌶️' },
                  ].map(sp => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => setSelectedSpice(sp.id)}
                      className={`py-2 px-2 rounded-xl font-bold border transition-all text-center ${
                        selectedSpice === sp.id
                          ? 'bg-[#00167A] text-[#FFF3C1] border-[#00167A]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extras */}
              {customizingProduct.availableExtras && customizingProduct.availableExtras.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Guarniciones / Extras
                  </label>
                  <div className="space-y-1.5">
                    {customizingProduct.availableExtras.map(ex => {
                      const isSelected = selectedExtras.some(e => e.id === ex.id);
                      return (
                        <div
                          key={ex.id}
                          onClick={() => {
                            setSelectedExtras(prev =>
                              isSelected ? prev.filter(e => e.id !== ex.id) : [...prev, ex]
                            );
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-50 border-amber-300 font-bold text-[#00167A]'
                              : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-[#00167A] border-[#00167A] text-white' : 'border-gray-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <span>{ex.name}</span>
                          </div>
                          <span className="font-bold">+S/ {ex.price.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Notes */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Nota para cocina (Opcional)
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Ej: Servir chifles aparte, con bastante limón..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00167A]"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={handleConfirmCustomItem}
                className="w-full py-2.5 bg-[#00167A] text-[#FFF3C1] font-bold text-xs rounded-xl shadow-xs hover:bg-[#00167A]/90"
              >
                Agregar al Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PAYMENT MODAL */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
            
            {/* Header */}
            <div className="p-4 bg-[#00167A] text-white flex items-center justify-between">
              <div>
                <h3 className="font-teko text-2xl font-bold uppercase tracking-wider text-[#FFF3C1] leading-none">
                  Cobrar Ticket de Venta
                </h3>
                <p className="text-[11px] text-white/80">Selecciona el método de pago del cliente</p>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total Big Display */}
            <div className="p-4 bg-amber-50 border-b border-amber-200 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Total a Pagar</span>
              <span className="font-teko text-4xl font-extrabold text-[#00167A] leading-none">
                S/ {total.toFixed(2)}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'efectivo' as PaymentMethod, label: 'Efectivo', icon: DollarSign },
                  { id: 'yape' as PaymentMethod, label: 'Yape QR', icon: Smartphone },
                  { id: 'plin' as PaymentMethod, label: 'Plin', icon: Smartphone },
                  { id: 'pos' as PaymentMethod, label: 'Tarjeta', icon: CreditCard },
                ].map(pm => {
                  const Icon = pm.icon;
                  const isSel = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#00167A] text-[#FFF3C1] border-[#00167A] shadow-xs ring-2 ring-[#00167A]/30'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Cash Input & Quick Bills */}
              {paymentMethod === 'efectivo' && (
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">Monto Recibido (S/):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      className="w-32 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-right font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#00167A]"
                    />
                  </div>

                  {/* Fast Bill Buttons */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCashReceived(total.toString())}
                      className="py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100"
                    >
                      Exacto
                    </button>
                    {[20, 50, 100].map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setCashReceived(b.toString())}
                        className="py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100"
                      >
                        S/ {b}
                      </button>
                    ))}
                  </div>

                  {/* Vuelto Calculation */}
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">Vuelto a entregar:</span>
                    <span className="text-base font-extrabold text-emerald-900 font-mono">
                      S/ {changeAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Yape / Plin QR Preview */}
              {(paymentMethod === 'yape' || paymentMethod === 'plin') && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-center space-y-2">
                  <div className="inline-block p-2 bg-white rounded-xl shadow-xs">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=0002010102115204000053036045802PE5914LA%20FACINEROSA6005LIMA62070503***6304"
                      alt="QR Yape"
                      className="w-24 h-24 mx-auto"
                    />
                  </div>
                  <p className="text-xs font-bold text-purple-900">
                    Número: {settings.phone} (La Facinerosa)
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Confirma que el cliente muestre la constancia en su celular antes de finalizar.
                  </p>
                </div>
              )}

              {/* Card POS Note */}
              {paymentMethod === 'pos' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-center text-xs text-blue-900">
                  💳 Procesa la tarjeta en el POS físico Izipay / Niubiz y luego confirma la venta.
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="w-1/3 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleCompleteSale}
                className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Emitir Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASH SHIFT (APERTURA Y CIERRE DE CAJA) MODAL */}
      {isCashShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
            <div className="p-4 bg-[#00167A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#FFF3C1]" />
                <h3 className="font-bold text-sm text-[#FFF3C1]">Control de Caja • Puesto 651</h3>
              </div>
              <button
                onClick={() => setIsCashShiftModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {cashShift.isOpen ? (
                // Cierre de caja
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs">
                    <p className="font-bold text-emerald-900">🟢 Turno en Curso</p>
                    <p className="text-gray-600">Apertura: {new Date(cashShift.openedAt).toLocaleTimeString()}</p>
                    <p className="text-gray-600">Monto Inicial: S/ {cashShift.initialCash.toFixed(2)}</p>
                    <p className="text-gray-600">Ventas en Efectivo: S/ {cashShift.cashSales.toFixed(2)}</p>
                    <p className="text-gray-600">Ventas Yape/Plin: S/ {(cashShift.yapeSales + cashShift.plinSales).toFixed(2)}</p>
                    <p className="text-gray-600">Ventas Tarjeta: S/ {cashShift.cardSales.toFixed(2)}</p>
                    <div className="pt-2 border-t border-emerald-200 flex justify-between font-bold text-sm text-[#00167A]">
                      <span>Efectivo Esperado en Caja:</span>
                      <span>S/ {(cashShift.initialCash + cashShift.cashSales).toFixed(2)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Efectivo Contado al Cierre (S/):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={countedCashInput}
                      onChange={(e) => setCountedCashInput(e.target.value)}
                      placeholder="Ej: 201.00"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#00167A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Observaciones / Arqueo
                    </label>
                    <textarea
                      rows={2}
                      value={shiftNotesInput}
                      onChange={(e) => setShiftNotesInput(e.target.value)}
                      placeholder="Notas del turno de caja..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00167A]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const counted = parseFloat(countedCashInput) || (cashShift.initialCash + cashShift.cashSales);
                      closeCashShift(counted, shiftNotesInput);
                      setIsCashShiftModalOpen(false);
                    }}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
                  >
                    Cerrar Caja de Hoy (Arqueo Final)
                  </button>
                </div>
              ) : (
                // Apertura de caja
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                    <p className="font-bold">⚠️ La caja se encuentra cerrada.</p>
                    <p className="text-gray-600 mt-0.5">Ingresa el monto de fondo inicial en sencillo para iniciar las ventas del día.</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Monto Inicial de Apertura (S/):
                    </label>
                    <input
                      type="number"
                      value={initialCashInput}
                      onChange={(e) => setInitialCashInput(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#00167A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Nombre del Cajero / Responsable:
                    </label>
                    <input
                      type="text"
                      value={cashierNameInput}
                      onChange={(e) => setCashierNameInput(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00167A]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      openCashShift(parseFloat(initialCashInput) || 100, cashierNameInput);
                      setIsCashShiftModalOpen(false);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Aperturar Turno de Caja</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* THERMAL TICKET MODAL */}
      {completedSale && (
        <ThermalTicketModal
          sale={completedSale}
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          ticketType={ticketType}
        />
      )}
    </div>
  );
};
