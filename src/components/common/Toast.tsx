import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSocial();

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-sm transition-all transform translate-y-0 ${
              isSuccess
                ? 'bg-white border-blue-200 text-slate-800'
                : isWarning
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : isError
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-600" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-blue-600" />}
            </div>
            <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1 -m-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
