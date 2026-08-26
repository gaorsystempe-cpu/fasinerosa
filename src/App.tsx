import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from './context/StoreContext';
import { CATEGORIES } from './data/products';
import { Product, CartItem, CategoryId, OrderType, ExtraOption, SpiceLevel, Order } from './types';
import { Header } from './components/Header';
import { ExplosiveHero } from './components/ExplosiveHero';
import { HorizontalSectionScroll } from './components/HorizontalSectionScroll';
import { CategoriesGrid } from './components/CategoriesGrid';
import { FavoritesView } from './components/FavoritesView';
import { FloatingPillBottomNav, MainTab } from './components/FloatingPillBottomNav';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { DishGridSkeleton } from './components/DishGridSkeleton';
import { Footer } from './components/Footer';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { Check, Search, Sparkles, MessageSquare, Phone, MapPin, Heart, Utensils, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { products, settings, isAdmin } = useStore();


  // Admin View state
  const [isInAdminMode, setIsInAdminMode] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('facinerosa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Favorites State (Persisted in localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('facinerosa_favorites');
      return saved ? JSON.parse(saved) : ['seco-chabelo', 'ceviche-mero-piurano'];
    } catch {
      return ['seco-chabelo', 'ceviche-mero-piurano'];
    }
  });

  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState<MainTab>('inicio');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Smooth filter category handler
  const handleSelectCategory = (cat: CategoryId) => {
    if (cat === selectedCategory && !isFiltering) return;
    setIsFiltering(true);
    setSelectedCategory(cat);
  };

  // Turn off loading animation after brief smooth duration
  useEffect(() => {
    if (isFiltering) {
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isFiltering]);
  
  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  
  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('FACINEROSA10');
  
  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('facinerosa_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Save favorites to local storage
  useEffect(() => {
    try {
      localStorage.setItem('facinerosa_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle favorite dish
  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Plato retirado de tus favoritos');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('❤️ ¡Plato guardado en tus favoritos!');
        return [...prev, productId];
      }
    });
  };

  // Cart calculations
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.itemTotal, 0), [cart]);

  // Map product id to quantity in cart
  const productQuantityMap = useMemo(() => {
    const map: Record<string, number> = {};
    cart.forEach((item) => {
      map[item.product.id] = (map[item.product.id] || 0) + item.quantity;
    });
    return map;
  }, [cart]);

  // Category counts based on live products
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      todos: products.length,
      insignias: 0,
      entradas: 0,
      marinos: 0,
      rondas: 0,
      bebidas: 0,
      guarniciones: 0,
    };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Popular products ("Lo más pedido")
  const popularProducts = useMemo(() => {
    return products.filter((p) => p.isPopular && p.isAvailable !== false);
  }, [products]);

  // Promo products ("Promociones")
  const promoProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (p.badge?.toUpperCase().includes('PROMO') ||
        p.category === 'rondas' ||
        p.badge?.toLowerCase().includes('favorito')) &&
        p.isAvailable !== false
    );
  }, [products]);

  // Favorite products list
  const favoriteProductsList = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);

  // Filtered Products for the Menu view
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'todos' || product.category === selectedCategory;
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.badge && product.badge.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart Operations
  const handleAddToCart = (
    product: Product,
    quantity: number,
    spiceLevel: SpiceLevel,
    selectedExtras: ExtraOption[],
    specialInstructions: string
  ) => {
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    const itemTotal = (product.price + extrasTotal) * quantity;
    const extrasKey = selectedExtras.map((e) => e.id).sort().join('-');
    const itemId = `${product.id}_${spiceLevel}_${extrasKey}_${specialInstructions.trim()}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const currentItem = updated[existingIndex];
        const newQty = currentItem.quantity + quantity;
        updated[existingIndex] = {
          ...currentItem,
          quantity: newQty,
          itemTotal: (product.price + extrasTotal) * newQty,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: itemId,
            product,
            quantity,
            spiceLevel,
            selectedExtras,
            specialInstructions: specialInstructions.trim() || undefined,
            itemTotal,
          },
        ];
      }
    });

    showToast(`¡Agregaste ${quantity}x ${product.name} a la canasta!`);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, 1, 'medio', [], '');
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === itemId) {
          const extrasTotal = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
          return {
            ...item,
            quantity: newQty,
            itemTotal: (item.product.price + extrasTotal) * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    showToast('Plato retirado');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Canasta vaciada');
  };

  const handleApplyCoupon = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'FACINEROSA10' || cleanCode === 'ENVIOGRATIS80') {
      setAppliedCoupon(cleanCode);
      showToast(`¡Cupón ${cleanCode} aplicado!`);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setCart([]);
    setActiveOrder(order);
  };

  const navigateToMenuCategory = (cat: CategoryId) => {
    setIsFiltering(true);
    setSelectedCategory(cat);
    setActiveTab('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Admin modal or view
  const handleOpenAdminTrigger = () => {
    if (isAdmin) {
      setIsInAdminMode(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // If in Admin Mode, render the full admin & POS layout
  if (isInAdminMode && isAdmin) {
    return (
      <AdminLayout
        onReturnToStorefront={() => setIsInAdminMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] text-[#2C2D2F] pb-24 sm:pb-28">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 sm:bottom-20 right-4 sm:right-6 z-50 bg-[#00167A] text-[#FFF3C1] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top sm:slide-in-from-bottom-5 duration-200 border border-[#FFF3C1]/30">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && activeTab !== 'menu') {
            setActiveTab('menu');
          }
        }}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* MAIN VIEW SWITCHER */}
      
      {/* 1. TAB: INICIO */}
      {activeTab === 'inicio' && (
        <div className="space-y-4 sm:space-y-6">
          
          {/* Explosive Hero Section */}
          <ExplosiveHero
            onExploreClick={() => {
              setActiveTab('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8">
            
            {/* "Lo más pedido" Horizontal Carousel */}
            <HorizontalSectionScroll
              title="Lo más pedido"
              badgeType="popular"
              products={popularProducts}
              onViewAll={() => navigateToMenuCategory('insignias')}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={handleQuickAdd}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* "Promociones" Horizontal Carousel */}
            <HorizontalSectionScroll
              title="Promociones"
              badgeType="promo"
              products={promoProducts}
              onViewAll={() => navigateToMenuCategory('rondas')}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={handleQuickAdd}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* "Categorías" 2-Column Grid */}
            <CategoriesGrid
              categoryCounts={categoryCounts}
              onSelectCategory={navigateToMenuCategory}
            />

            {/* Surquillo Puesto 651 Tradition Card Banner */}
            <div className="px-4 sm:px-6">
              <div className="bg-[#FFF3C1] rounded-3xl p-6 sm:p-8 border-2 border-[#00167A]/15 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00167A] bg-white/70 px-3 py-1 rounded-full inline-block">
                      Tradición Picantera en Lima
                    </span>
                    <h3 className="font-gotham text-xl sm:text-2xl font-extrabold text-[#00167A]">
                      Fogones vivos & Sazón al Batán en Surquillo
                    </h3>
                    <p className="text-xs text-[#2C2D2F]/80 max-w-xl">
                      Cocinamos cada seco de chabelo, majado y ceviche al momento en el Mercado 2 de Surquillo Puesto 651.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('menu');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 bg-[#00167A] text-[#FFF3C1] text-xs font-bold rounded-xl shadow-xs hover:bg-[#00167A]/90 transition-all cursor-pointer"
                    >
                      Ver la Carta
                    </button>
                    <a
                      href={`https://wa.me/${settings.phone.replace(/\D/g, '')}?text=Hola%20La%20Facinerosa,%20deseo%20hacer%20un%20pedido%20especial`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-white text-[#00167A] text-xs font-bold rounded-xl border border-[#00167A]/20 shadow-xs flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. TAB: MENÚ / CARTA COMPLETA */}
      {activeTab === 'menu' && (
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full space-y-4 sm:space-y-6">
          
          {/* Sticky Category Filter Bar */}
          <div className="sticky top-14 sm:top-18 z-30 bg-[#F9F9F9]/95 backdrop-blur-md pt-2 pb-3">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#00167A] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#00167A]" />
                <span>Carta Completa</span>
              </div>
              <h2 className="font-gotham text-2xl sm:text-3xl font-extrabold text-[#00167A]">
                {selectedCategory === 'todos'
                  ? 'Todos los Platos'
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {isFiltering ? (
                <span className="text-[#00167A] font-bold inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00167A] animate-ping" />
                  Filtrando carta...
                </span>
              ) : (
                `${filteredProducts.length} ${filteredProducts.length === 1 ? 'plato disponible' : 'platos disponibles'}`
              )}
            </span>
          </div>

          {/* Products List / Grid */}
          <AnimatePresence mode="wait">
            {isFiltering ? (
              <motion.div
                key="filtering-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <DishGridSkeleton
                  categoryName={
                    selectedCategory === 'todos'
                      ? 'Todos los Platos'
                      : CATEGORIES.find((c) => c.id === selectedCategory)?.name
                  }
                />
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                key="empty-products"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFF3C1] text-[#00167A] mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-gotham text-lg font-bold text-[#2C2D2F]">
                  No encontramos platos con "{searchQuery}"
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Prueba buscando por "seco", "majado", "ceviche", "tamalitos" o "chicha".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    handleSelectCategory('todos');
                  }}
                  className="px-5 py-2.5 bg-[#00167A] text-[#FFF3C1] font-bold text-xs rounded-xl shadow-xs hover:bg-[#00167A]/90 transition-all cursor-pointer"
                >
                  Ver Todo el Menú
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`products-grid-${selectedCategory}-${searchQuery}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onQuickAdd={handleQuickAdd}
                    quantityInCart={productQuantityMap[product.id] || 0}
                    isFavorited={favorites.includes(product.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* 3. TAB: FAVORITOS */}
      {activeTab === 'favoritos' && (
        <FavoritesView
          favoriteProducts={favoriteProductsList}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={handleQuickAdd}
          onToggleFavorite={handleToggleFavorite}
          onExploreMenu={() => {
            setActiveTab('menu');
            setSelectedCategory('todos');
          }}
        />
      )}

      {/* Floating Pill Navigation Bar */}
      <FloatingPillBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'carrito') {
            setIsCartOpen(true);
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        cartCount={cartCount}
        favoritesCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Footer */}
      <div className="hidden sm:block mt-12">
        <Footer onOpenAdmin={handleOpenAdminTrigger} />
      </div>

      {/* Location / Zone Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        orderType={orderType}
        onChangeOrderType={setOrderType}
      />

      {/* Product Customization Bottom Sheet / Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer / Bottom Sheet */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        orderType={orderType}
        appliedCoupon={appliedCoupon}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Status Tracker & Ticket Modal */}
      <OrderTrackerModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
      />

      {/* Admin PIN Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsInAdminMode(true);
        }}
      />

    </div>
  );
}
