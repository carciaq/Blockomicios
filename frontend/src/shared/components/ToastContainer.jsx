import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const TYPE_STYLES = {
  blue: { border: 'border-blue-200', icon: 'text-blue-600', Icon: Info },
  success: {
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  danger: {
    border: 'border-rose-200',
    icon: 'text-rose-600',
    Icon: AlertOctagon,
  },
  warning: {
    border: 'border-amber-200',
    icon: 'text-amber-600',
    Icon: AlertTriangle,
  },
};

/** Renderiza la pila de notificaciones flotantes en la esquina superior derecha. */
export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const style = TYPE_STYLES[toast.type] || TYPE_STYLES.blue;
        const { Icon } = style;
        return (
          <div
            key={toast.id}
            className={`flex gap-3 p-4 rounded-xl border bg-white shadow-md ${style.border} pointer-events-auto transition-all duration-300 animate-[fadeIn_0.3s_ease-out]`}
            onClick={() => removeToast(toast.id)}
            role="status"
          >
            <div className={`flex-shrink-0 ${style.icon}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{toast.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
