import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  const typeStyles = {
    success: 'bg-emerald-950/90 border-emerald-500 text-emerald-200',
    error: 'bg-rose-950/90 border-rose-500 text-rose-200',
    warning: 'bg-amber-950/90 border-amber-500 text-amber-200',
    info: 'bg-cyan-950/90 border-cyan-500 text-cyan-200',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border shadow-2xl backdrop-blur-md text-xs flex items-center gap-3 transition-all duration-300 ${
        typeStyles[type] || typeStyles.info
      }`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="font-bold text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          &times;
        </button>
      )}
    </div>
  );
}
