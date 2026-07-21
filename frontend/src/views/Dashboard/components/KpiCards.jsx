import { ArchiveRestore, CheckSquare, History, PieChart } from 'lucide-react';
import { formatNumber, formatPercent } from '../../../shared/utils/formatters';

/** Tarjetas de indicadores clave del escrutinio (KPIs). */
export default function KpiCards({ totalVotes, participationPercent, mempoolCount, consensusPercent }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Sufragios Emitidos
          </span>
          <span className="block text-2xl font-extrabold text-slate-900 mt-0.5">
            {formatNumber(totalVotes)}
          </span>
        </div>
        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
          <ArchiveRestore className="h-5 w-5" />
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Participación de Padrón
          </span>
          <span className="block text-2xl font-extrabold text-emerald-600 mt-0.5">
            {formatPercent(participationPercent)}
          </span>
        </div>
        <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
          <PieChart className="h-5 w-5" />
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Consenso de Nodos
          </span>
          <span className="block text-2xl font-extrabold text-slate-800 mt-0.5">
            {formatPercent(consensusPercent, 0)}
          </span>
        </div>
        <div className="p-2.5 bg-slate-200 rounded-lg text-slate-700">
          <CheckSquare className="h-5 w-5" />
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Transacciones en Fila
          </span>
          <span className="block text-2xl font-extrabold text-amber-600 mt-0.5">
            {mempoolCount}
          </span>
        </div>
        <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
          <History className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
