import { formatNumber } from '../../../shared/utils/formatters';

export default function ResultsPanel({ results }) {
  const totalVotes = results.reduce((sum, event) => sum + event.totalVotes, 0);
  const eventsWithVotes = results.filter((event) => event.totalVotes > 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">Resultados en tiempo real</p>
        <h3 className="text-lg font-bold text-slate-900 mt-2">Resumen por evento</h3>
        <p className="text-xs text-slate-500 mt-1">Se actualiza automáticamente después de cada voto.</p>
      </div>

      {eventsWithVotes.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
          No hay resultados disponibles todavía. Intente recargar la página después de emitirse algunos votos.
        </div>
      ) : (
        <div className="space-y-4">
          {eventsWithVotes.map((event) => (
            <div key={event.eventId} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{event.eventName}</p>
                  <p className="text-[11px] text-slate-500">{event.description}</p>
                </div>
                <span className="text-xs font-semibold text-slate-700">{formatNumber(event.totalVotes)} votos</span>
              </div>
              <div className="space-y-2">
                {(event.candidates || [])
                  .filter((candidate) => candidate.votes > 0)
                  .map((candidate) => (
                    <div key={candidate.candidateId} className="flex justify-between text-xs text-slate-600">
                      <span>{candidate.name}</span>
                      <span className="font-semibold text-slate-900">{candidate.votes}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-3xl bg-blue-600 px-4 py-3 text-white text-sm font-semibold">
        Total de votos en la jornada: {formatNumber(totalVotes)}
      </div>
    </div>
  );
}
