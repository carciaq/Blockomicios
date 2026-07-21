import { AlertTriangle, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/** Bloque mostrado cuando el elector ya emitió su voto en esta jornada. */
export default function VotedBlocker() {
  const navigate = useNavigate();
  return (
    <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center mb-6 max-w-xl mx-auto">
      <AlertTriangle className="h-10 w-10 text-amber-600 mx-auto mb-2" />
      <h3 className="text-base font-bold text-slate-900">Sufragio Previamente Registrado</h3>
      <p className="text-slate-500 text-xs mt-1">
        Su firma digital ya cuenta con un registro consolidado de voto en el libro de
        contabilidad blockchain para esta jornada.
      </p>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 transition"
        >
          Verificar Resultados <BarChart3 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
