import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    
    // Auto close after 3.5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { message, type } = toast;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slideIn">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-sm ${
        type === 'error'
          ? 'bg-red-50 border-red-100 text-red-800 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-300'
          : 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-300'
      }`}>
        {type === 'error' ? (
          <AlertCircle className="h-5 w-5 text-red-550 dark:text-red-400 shrink-0" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-emerald-550 dark:text-emerald-400 shrink-0" />
        )}
        
        <p className="text-sm font-medium pr-2 truncate max-w-[240px]" title={message}>
          {message}
        </p>

        <button
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 p-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer shrink-0"
          aria-label="Close notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
