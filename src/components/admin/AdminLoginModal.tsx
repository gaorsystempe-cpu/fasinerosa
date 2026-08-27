import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Lock, KeyRound, ShieldAlert, ArrowRight, Store, Check, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
  onSuccess: propsOnSuccess,
}) => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginAdmin, settings, isAdmin } = useStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Determine if modal should be open (from props or context)
  const isVisible = propsIsOpen !== undefined ? propsIsOpen : isLoginModalOpen;

  const handleClose = useCallback(() => {
    setPin('');
    setError(false);
    if (propsOnClose) {
      propsOnClose();
    }
    setIsLoginModalOpen(false);
  }, [propsOnClose, setIsLoginModalOpen]);

  const handleSuccess = useCallback(() => {
    setPin('');
    setError(false);
    if (propsOnSuccess) {
      propsOnSuccess();
    }
    setIsLoginModalOpen(false);
  }, [propsOnSuccess, setIsLoginModalOpen]);

  const attemptLogin = useCallback((pinToTest: string) => {
    const clean = pinToTest.trim();
    const success = loginAdmin(clean);
    if (success) {
      handleSuccess();
    } else {
      setError(true);
      setPin('');
    }
  }, [loginAdmin, handleSuccess]);

  // Physical Keyboard Listener (0-9, Backspace, Enter, Esc)
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        setPin((prev) => {
          if (prev.length < 6) {
            const next = prev + e.key;
            setError(false);
            if (next.length === 4) {
              setTimeout(() => attemptLogin(next), 150);
            }
            return next;
          }
          return prev;
        });
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setPin((prev) => prev.slice(0, -1));
        setError(false);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (pin.length > 0) {
          attemptLogin(pin);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, pin, attemptLogin, handleClose]);

  if (!isVisible) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        setTimeout(() => attemptLogin(nextPin), 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-[#00167A]/20 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#00167A] p-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF3C1]/20 flex items-center justify-center text-[#FFF3C1]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-teko text-2xl font-bold uppercase tracking-wider leading-none text-[#FFF3C1]">
                Punto de Venta & Admin
              </h3>
              <p className="text-[11px] text-white/80">Acceso exclusivo para el personal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col items-center">
          <div className="mb-3 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-[#00167A] mb-1.5">
              <Store className="w-3.5 h-3.5" /> Mercado 2 Surquillo - Puesto 651
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Ingresa el PIN de seguridad de 4 dígitos (puedes usar el teclado o la botonera):
            </p>
          </div>

          {/* PIN Display */}
          <div className="flex items-center justify-center gap-2.5 mb-4">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-11 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all shadow-xs ${
                  pin.length > idx
                    ? 'border-[#00167A] bg-[#00167A]/5 text-[#00167A] scale-105'
                    : 'border-gray-200 bg-gray-50 text-gray-300'
                } ${error ? 'border-red-500 bg-red-50 text-red-500 animate-shake' : ''}`}
              >
                {pin.length > idx ? '●' : ''}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold mb-3 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>PIN incorrecto. Inténtalo nuevamente.</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-[260px] mb-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(num)}
                className="h-11 rounded-2xl bg-gray-50 hover:bg-[#00167A]/10 active:scale-95 border border-gray-200 text-lg font-bold text-[#2C2D2F] hover:text-[#00167A] transition-all cursor-pointer shadow-xs"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-xs font-bold text-gray-600 transition-all cursor-pointer"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-11 rounded-2xl bg-gray-50 hover:bg-[#00167A]/10 active:scale-95 border border-gray-200 text-lg font-bold text-[#2C2D2F] transition-all cursor-pointer shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-xs font-bold text-gray-600 transition-all cursor-pointer flex items-center justify-center"
            >
              ⌫
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={() => attemptLogin(pin)}
            disabled={pin.length === 0}
            className={`w-full py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              pin.length >= 4
                ? 'bg-[#00167A] text-[#FFF3C1] hover:bg-[#00167A]/90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Ingresar al Sistema</span>
            <ArrowRight className="w-4 h-4" />
          </button>


        </div>
      </div>
    </div>
  );
};

