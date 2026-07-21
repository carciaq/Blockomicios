import { BarChart, Info } from 'lucide-react';
import { formatNumber } from '../../../shared/utils/formatters';

const THEME_HEX = {
  blue: '#3182ce',
  emerald: '#059669',
  slate: '#475569',
};

/** Gráfico de barras horizontal con la distribución de votos por candidato. */
export default function ResultsChart({ candidates, totalVotes }) {
  return (
    <div className="lg:col-span-7 bg-slate-50/50 border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
          <BarChart className="h-[18px] w-[18px] text-blue-600" /> Distribución de Votos en
          Tiempo Real
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Distribución porcentual de votos válidos contabilizados en bloques minados.
        </p>
      </div>

      <div className="space-y-4 my-5">
        {candidates.map((c) => {
          const percent = totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : '0.0';
          const colorHex = THEME_HEX[c.color] || THEME_HEX.blue;
          return (
            <div key={c.id} className="space-y-1.5">
              <div className="flex justify-between items-end text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl p-1 bg-white border border-slate-100 rounded-md">
                    {c.avatar}
                  </span>
                  <div>
                    <span className="text-slate-900 block font-bold text-xs">{c.name}</span>
                    <span className="text-slate-500 block text-[9px] font-mono font-medium leading-none">
                      {c.party}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 font-mono font-bold text-xs">{percent}%</span>
                  <span className="text-slate-500 block text-[9px] font-mono">
                    {formatNumber(c.votes)} Sufragios
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200/70 rounded-full h-3 border border-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: colorHex,
                    boxShadow: `0 0 6px ${colorHex}25`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-center gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <p className="text-xs text-blue-800 leading-normal">
          Los datos aquí expuestos corresponden a resultados consolidados criptográficamente en
          la cadena de bloques. Son públicos e irreversibles.
        </p>
      </div>
    </div>
  );
}
