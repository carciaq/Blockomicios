export default function EventSelector({
  events,
  selectedEventId,
  onSelectEvent,
  votedEvents,
}) {
  return (
    <div className="space-y-4">
      {/* <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Seleccione el evento</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Elija la votación para la que desea emitir su voto. Los resultados en tiempo real se
          actualizan en el panel derecho.
        </p>
      </div> */}

      <div className="grid gap-3">
        {events.map((event) => {
          const voted = !!votedEvents?.[event.id];
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelectEvent(event)}
              className={`w-full rounded-3xl border p-4 text-left transition duration-200 ${
                selectedEventId === event.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              } ${voted ? 'opacity-80' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{event.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{event.description}</p>
                </div>
                {voted && (
                  <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-[11px] font-semibold">
                    Ya votó
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
