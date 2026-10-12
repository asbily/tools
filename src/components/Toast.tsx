import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'error';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[10000] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const Icon = toast.type === 'error' ? AlertCircle : toast.type === 'info' ? Info : CheckCircle2;
        const iconColor =
          toast.type === 'error'
            ? 'text-rose-500'
            : toast.type === 'info'
            ? 'text-sky-500'
            : 'text-emerald-500';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-neutral-900/95 dark:bg-white/95 text-white dark:text-neutral-900 border border-neutral-800 dark:border-neutral-200 shadow-xl rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-medium backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span className="truncate">{toast.text}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-neutral-400 hover:text-white dark:hover:text-black shrink-0 p-0.5 rounded cursor-pointer transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
