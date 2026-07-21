import { Check } from 'lucide-react';

const THEME_BADGE = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  slate: 'bg-slate-100 border-slate-300 text-slate-700',
};

const THEME_LABEL = {
  blue: 'Tecnológico',
  emerald: 'Ecologista',
  slate: 'Moderado',
};

/** Tarjeta de un candidato dentro de la boleta de votación. */
export default function CandidateCard({ candidate, onSelect, disabled }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-lg transition-all duration-300 relative group shadow-sm">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-3xl p-2 bg-slate-100 border border-slate-200 rounded-xl group-hover:scale-105 transition duration-300">
            {candidate.avatar}
          </span>
          <span
            className={`text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border ${
              THEME_BADGE[candidate.color] || THEME_BADGE.blue
            }`}
          >
            {THEME_LABEL[candidate.color] || THEME_LABEL.blue}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-0.5">{candidate.name}</h3>
        <p className="text-xs text-blue-700 font-semibold mb-3">{candidate.party}</p>

        <div className="text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3 mt-2">
          <strong className="text-slate-800 block mb-1 font-bold text-[11px]">
            Enfoque de Propuesta:
          </strong>
          &quot;{candidate.proposal}&quot;
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect(candidate)}
          className="w-full flex justify-center items-center gap-1.5 py-2.5 px-4 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 transition duration-150 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span>Marcar opción</span>
          <Check className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
