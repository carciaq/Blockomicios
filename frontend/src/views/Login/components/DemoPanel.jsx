import { FileInput } from 'lucide-react';

/**
 * Panel de credenciales de demo/simulación, permite autocompletar el
 * formulario con un elector habilitado de ejemplo.
 */
export default function DemoPanel({ demoUser, onAutofill }) {
  if (!demoUser) return null;

  return (
    <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
          Entorno de Simulación
        </span>
        <span className="text-[9px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-mono font-bold">
          Modo Demo
        </span>
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between items-center text-slate-700">
          <span>
            Elector habilitado:{' '}
            <strong className="font-mono text-slate-900">{demoUser.voterId}</strong>
          </span>
          <button
            type="button"
            onClick={onAutofill}
            className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-semibold text-xs"
          >
            <FileInput className="h-3 w-3" /> Autocompletar
          </button>
        </div>
      </div>
    </div>
  );
}
