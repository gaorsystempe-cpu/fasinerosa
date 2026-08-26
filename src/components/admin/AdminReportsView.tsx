import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  ShoppingBag, 
  Store, 
  Printer, 
  Calendar, 
  Search, 
  Utensils, 
  ArrowUpRight,
  ReceiptText,
  FileSpreadsheet
} from 'lucide-react';
import { ThermalTicketModal } from './ThermalTicketModal';
import { POSSale, Order } from '../../types';

export const AdminReportsView: React.FC = () => {
  const { posSales, orders, cashShift, settings } = useStore();
  const [selectedRange, setSelectedRange] = useState<'hoy' | 'todos'>('hoy');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ticket Modal
  const [selectedPOSForTicket, setSelectedPOSForTicket] = useState<POSSale | null>(null);
  const [selectedOrderForTicket, setSelectedOrderForTicket] = useState<Order | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Calculations
  const validPOSSales = useMemo(() => {
    return posSales.filter(s => s.status !== 'anulada');
  }, [posSales]);

  const validWebOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'cancelado');
  }, [orders]);

  // Combined transactions
  const combinedTransactions = useMemo(() => {
    const posList = validPOSSales.map(s => ({
      id: s.id,
      number: s.saleNumber,
      date: s.createdAt,
      type: 'pos' as const,
      subType: s.saleType === 'mesa' ? `Mesa: ${s.tableNumber}` : s.saleType === 'llevar' ? 'Para Llevar' : 'Mostrador',
      customer: s.customerName || 'Cliente Mostrador',
      method: s.paymentMethod,
      total: s.total,
      rawItem: s,
    }));

    const webList = validWebOrders.map(o => ({
      id: o.id,
      number: o.orderNumber,
      date: o.createdAt,
      type: 'web' as const,
      subType: o.customer.orderType === 'delivery' ? 'Delivery Web' : o.customer.orderType === 'pickup' ? 'Recojo Web' : `Mesa: ${o.customer.tableNumber}`,
      customer: o.customer.fullName,
      method: o.customer.paymentMethod,
      total: o.total,
      rawItem: o,
    }));

    return [...posList, ...webList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [validPOSSales, validWebOrders]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return combinedTransactions.filter(t => {
      const matchSearch = t.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.customer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [combinedTransactions, searchQuery]);

  // Totals
  const totalPOSRevenue = validPOSSales.reduce((acc, s) => acc + s.total, 0);
  const totalWebRevenue = validWebOrders.reduce((acc, o) => acc + o.total, 0);
  const totalGeneralRevenue = totalPOSRevenue + totalWebRevenue;
  const totalTransactionsCount = validPOSSales.length + validWebOrders.length;
  const averageTicket = totalTransactionsCount > 0 ? totalGeneralRevenue / totalTransactionsCount : 0;

  // Payment Breakdown
  const paymentBreakdown = useMemo(() => {
    let efectivo = 0;
    let yape = 0;
    let plin = 0;
    let tarjeta = 0;

    validPOSSales.forEach(s => {
      if (s.paymentMethod === 'efectivo') efectivo += s.total;
      if (s.paymentMethod === 'yape') yape += s.total;
      if (s.paymentMethod === 'plin') plin += s.total;
      if (s.paymentMethod === 'pos') tarjeta += s.total;
    });

    validWebOrders.forEach(o => {
      if (o.customer.paymentMethod === 'efectivo') efectivo += o.total;
      if (o.customer.paymentMethod === 'yape') yape += o.total;
      if (o.customer.paymentMethod === 'plin') plin += o.total;
      if (o.customer.paymentMethod === 'pos') tarjeta += o.total;
    });

    return { efectivo, yape, plin, tarjeta };
  }, [validPOSSales, validWebOrders]);

  // Top Dishes ranking
  const topDishes = useMemo(() => {
    const dishMap: { [name: string]: { name: string; count: number; total: number } } = {};

    validPOSSales.forEach(sale => {
      sale.items.forEach(item => {
        const key = item.product.name;
        if (!dishMap[key]) dishMap[key] = { name: key, count: 0, total: 0 };
        dishMap[key].count += item.quantity;
        dishMap[key].total += item.itemTotal;
      });
    });

    validWebOrders.forEach(order => {
      order.items.forEach(item => {
        const key = item.product.name;
        if (!dishMap[key]) dishMap[key] = { name: key, count: 0, total: 0 };
        dishMap[key].count += item.quantity;
        dishMap[key].total += item.itemTotal;
      });
    });

    return Object.values(dishMap).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [validPOSSales, validWebOrders]);

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Header & Print Action */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-teko text-2xl font-bold uppercase tracking-wider text-[#00167A] leading-none">
            Reportes de Ventas & Métricas
          </h3>
          <p className="text-xs text-gray-500">
            Resumen consolidado de ventas del Punto de Venta Local (Puesto 651) y Pedidos Web
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintSummary}
            className="px-3.5 py-2 bg-[#00167A] text-[#FFF3C1] rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#00167A]/90 transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" /> Imprimir Arqueo
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-[#00167A] to-blue-900 text-white p-4 rounded-3xl shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-[#FFF3C1] uppercase tracking-wider block">
            Ventas Totales
          </span>
          <span className="font-teko text-3xl sm:text-4xl font-extrabold text-white leading-none block">
            S/ {totalGeneralRevenue.toFixed(2)}
          </span>
          <span className="text-[10px] text-white/70 block">
            {totalTransactionsCount} transacciones completadas
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              POS Local (Puesto 651)
            </span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-teko text-3xl font-extrabold text-[#00167A] leading-none block">
            S/ {totalPOSRevenue.toFixed(2)}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            {validPOSSales.length} ventas en salón/mostrador
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Pedidos Web (Delivery)
            </span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-teko text-3xl font-extrabold text-[#00167A] leading-none block">
            S/ {totalWebRevenue.toFixed(2)}
          </span>
          <span className="text-[10px] text-blue-600 font-semibold block">
            {validWebOrders.length} pedidos por la web
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Ticket Promedio
            </span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <span className="font-teko text-3xl font-extrabold text-[#00167A] leading-none block">
            S/ {averageTicket.toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-400 block">
            Por cliente atendido
          </span>
        </div>
      </div>

      {/* Middle Grid: Payment Breakdown & Best Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment Methods Breakdown */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-[#00167A] uppercase tracking-wider">
            Ingresos por Método de Pago
          </h4>

          <div className="space-y-3">
            {[
              { label: 'Efectivo en Caja', amount: paymentBreakdown.efectivo, icon: DollarSign, color: 'bg-emerald-500' },
              { label: 'Yape QR', amount: paymentBreakdown.yape, icon: Smartphone, color: 'bg-purple-600' },
              { label: 'Plin', amount: paymentBreakdown.plin, icon: Smartphone, color: 'bg-sky-500' },
              { label: 'Tarjeta / POS Físico', amount: paymentBreakdown.tarjeta, icon: CreditCard, color: 'bg-blue-600' },
            ].map(item => {
              const pct = totalGeneralRevenue > 0 ? (item.amount / totalGeneralRevenue) * 100 : 0;
              const Icon = item.icon;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <Icon className="w-3.5 h-3.5 text-gray-500" /> {item.label}
                    </span>
                    <span className="text-[#00167A]">
                      S/ {item.amount.toFixed(2)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Sold Dishes Ranking */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-[#00167A] uppercase tracking-wider">
            🏆 Platos Más Vendidos (Ranking)
          </h4>

          <div className="space-y-2.5">
            {topDishes.map((dish, idx) => (
              <div
                key={dish.name}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#00167A] text-[#FFF3C1] font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-gray-800 truncate">{dish.name}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-[#00167A] block">{dish.count} porciones</span>
                  <span className="text-[10px] text-gray-400">S/ {dish.total.toFixed(2)}</span>
                </div>
              </div>
            ))}

            {topDishes.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">Aún no hay platos registrados en ventas.</p>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History Log Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-sm text-[#00167A] uppercase tracking-wider">
              Historial de Transacciones
            </h4>
            <p className="text-[11px] text-gray-500">Listado detallado de todas las ventas emitidas</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar comprobante o cliente..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00167A] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Canal / Tipo</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Hora</th>
                <th className="py-3 px-4">Medio Pago</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#00167A]">
                    {tx.number}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      tx.type === 'pos' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tx.type === 'pos' ? <Store className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                      {tx.subType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {tx.customer}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-[11px]">
                    {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] font-semibold text-gray-700">
                    {tx.method}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    S/ {tx.total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        if (tx.type === 'pos') {
                          setSelectedPOSForTicket(tx.rawItem as POSSale);
                          setSelectedOrderForTicket(null);
                        } else {
                          setSelectedOrderForTicket(tx.rawItem as Order);
                          setSelectedPOSForTicket(null);
                        }
                        setIsTicketModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#00167A] hover:text-white text-gray-600 transition-colors cursor-pointer"
                      title="Ver Comprobante"
                    >
                      <ReceiptText className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal */}
      {(selectedPOSForTicket || selectedOrderForTicket) && (
        <ThermalTicketModal
          sale={selectedPOSForTicket || undefined}
          order={selectedOrderForTicket || undefined}
          isOpen={isTicketModalOpen}
          onClose={() => {
            setIsTicketModalOpen(false);
            setSelectedPOSForTicket(null);
            setSelectedOrderForTicket(null);
          }}
          ticketType="cliente"
        />
      )}
    </div>
  );
};
