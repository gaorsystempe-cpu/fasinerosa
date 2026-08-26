import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';
import { 
  Store, 
  ShoppingBag, 
  BarChart3, 
  UtensilsCrossed, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Coins, 
  Clock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AdminPOSView } from './AdminPOSView';
import { AdminWebOrdersView } from './AdminWebOrdersView';
import { AdminReportsView } from './AdminReportsView';
import { AdminProductsView } from './AdminProductsView';
import { AdminSettingsView } from './AdminSettingsView';
import { BrandLogo } from '../BrandLogo';

interface AdminLayoutProps {
  onReturnToStorefront: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onReturnToStorefront }) => {
  const { 
    activeAdminTab, 
    setActiveAdminTab, 
    orders, 
    cashShift, 
    logoutAdmin,
    settings 
  } = useStore();

  const pendingOrdersCount = orders.filter(o => o.status === 'recibido').length;

  const tabs: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'pos', label: 'Punto de Venta', icon: Store },
    { id: 'pedidos_web', label: 'Pedidos Web', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'reportes', label: 'Reportes de Venta', icon: BarChart3 },
    { id: 'productos', label: 'Catálogo & Stock', icon: UtensilsCrossed },
    { id: 'configuracion', label: 'Configuración Front', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col font-sans">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#00167A] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Brand Logo & Station */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFF3C1]/20 flex items-center justify-center text-[#FFF3C1] font-bold">
                <Store className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <h1 className="font-teko text-xl font-bold uppercase tracking-wider text-[#FFF3C1] leading-none">
                    {settings.businessName}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold uppercase">
                    Admin & POS
                  </span>
                </div>
                <p className="text-[10px] text-white/70">
                  {settings.address}
                </p>
              </div>
            </div>

            {/* Quick Actions (View Storefront & Logout) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReturnToStorefront}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF3C1] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Volver a la vista del cliente"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Ver Tienda Web</span>
              </button>

              <button
                type="button"
                onClick={logoutAdmin}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation (Horizontal Scrollable for Mobile & Tablet) */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFF3C1] text-[#00167A] shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-red-600 text-white animate-pulse' : 'bg-red-500 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Admin View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {activeAdminTab === 'pos' && <AdminPOSView />}
        {activeAdminTab === 'pedidos_web' && <AdminWebOrdersView />}
        {activeAdminTab === 'reportes' && <AdminReportsView />}
        {activeAdminTab === 'productos' && <AdminProductsView />}
        {activeAdminTab === 'configuracion' && <AdminSettingsView />}
      </main>
    </div>
  );
};
