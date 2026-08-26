import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { X, CheckCircle2, Clock, ChefHat, Bike, Check, MessageSquare, Download, Sparkles, MapPin, Receipt } from 'lucide-react';
import { BrandLogo, BrandEmblem } from './BrandLogo';

interface OrderTrackerModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const [currentStep, setCurrentStep] = useState<number>(1); // 0: recibido, 1: en cocina, 2: en camino, 3: entregado
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(35);

  useEffect(() => {
    // Simulated progression for demo feel
    const timer1 = setTimeout(() => setCurrentStep(1), 3000);
    const timer2 = setTimeout(() => setCurrentStep(2), 15000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { title: 'Pedido Recibido', desc: 'Comanda registrada', icon: CheckCircle2 },
    { title: 'En el Fogón', desc: 'Cocinando al momento', icon: ChefHat },
    { title: 'En Camino', desc: 'Repartidor asignado', icon: Bike },
    { title: '¡Entregado!', desc: 'Buen provecho', icon: Check },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#00167A]/20 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Brand Deep Blue */}
        <div className="p-5 bg-[#00167A] text-[#FFF3C1] text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-block p-2 rounded-full bg-emerald-500/20 text-emerald-300 mb-2">
            <CheckCircle2 className="w-8 h-8 mx-auto" />
          </div>

          <h2 className="font-teko text-3xl sm:text-4xl font-bold uppercase tracking-wide leading-none">
            ¡Pedido Confirmado con Éxito!
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Orden <span className="font-mono font-bold text-[#FFF3C1]">#{order.orderNumber}</span> • {order.createdAt}
          </p>
        </div>

        {/* Status Tracker Bar */}
        <div className="p-5 bg-[#FFF3C1]/30 border-b border-amber-200/60">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#00167A] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#00167A]" />
              <span>Tiempo Estimado: ~{estimatedMinutes} min</span>
            </span>
            <span className="text-[11px] bg-[#00167A] text-[#FFF3C1] px-2.5 py-0.5 rounded-full font-bold">
              {steps[currentStep].title}
            </span>
          </div>

          {/* Stepper dots */}
          <div className="relative flex justify-between items-center">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#00167A] -translate-y-1/2 z-0 transition-all duration-700"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              const IconComp = s.icon;

              return (
                <div key={s.title} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[#00167A] text-[#FFF3C1] shadow-md ring-4 ring-[#FFF3C1]'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-tight ${isCurrent ? 'text-[#00167A]' : 'text-gray-500'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Digital Ticket Breakdown */}
        <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
          <div className="bg-[#F9F9F9] p-4 rounded-xl border border-gray-200 space-y-3 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#00167A]" />
                <span className="font-bold text-xs text-[#00167A] uppercase">Ticket de Consumo</span>
              </div>
              <span className="text-[11px] text-gray-500">{order.customer.fullName}</span>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              {order.items.map((it) => (
                <div key={it.id} className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[#2C2D2F]">
                      {it.quantity}x {it.product.name}
                    </span>
                    <div className="text-[10px] text-gray-500">
                      {it.spiceLevel === 'sin_aji' ? 'Sin ají' : it.spiceLevel === 'picante_bravo' ? 'Ají bravo' : 'Toque piurano'}
                      {it.selectedExtras.length > 0 && ` • +${it.selectedExtras.map(e => e.name).join(', ')}`}
                    </div>
                  </div>
                  <span className="font-semibold text-[#00167A] shrink-0">
                    S/ {it.itemTotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total summary */}
            <div className="pt-2 border-t border-dashed border-gray-300 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>S/ {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Descuento aplicado</span>
                  <span>- S/ {order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Costo de Envío</span>
                  <span>S/ {order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-[#00167A] pt-1">
                <span>TOTAL</span>
                <span className="font-teko text-2xl leading-none">S/ {order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 pt-1">
              <span>Método: </span>
              <strong className="uppercase text-[#2C2D2F]">{order.customer.paymentMethod}</strong>
              {order.customer.address && (
                <div className="mt-1">
                  📍 <strong>Entrega:</strong> {order.customer.address}
                  {order.customer.reference && <span className="text-gray-400 block sm:inline sm:ml-1 font-normal">(Ref: {order.customer.reference})</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row gap-2.5">
          <a
            href="https://wa.me/51969823145?text=Hola%20La%20Facinerosa,%20tengo%20una%20consulta%20sobre%20mi%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-[#00167A] hover:bg-[#00167A]/90 text-[#FFF3C1] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Consultar por WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-[#2C2D2F] font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
