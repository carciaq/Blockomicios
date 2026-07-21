import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let toastIdCounter = 0;

/**
 * Proveedor de notificaciones (toasts) para toda la aplicación.
 * Se monta una vez en App.jsx y expone `showToast` vía el hook `useToast`.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title, message, type = 'blue') => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

/** Hook para disparar notificaciones desde cualquier componente. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast debe usarse dentro de un <ToastProvider>');
  }
  return ctx;
}
