import { CheckCircle2, Circle, Cpu, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { generateMockHash } from '../../../shared/utils/formatters';

const STEP_LABELS = [
  'Generación de Hash SHA-256',
  'Firma criptográfica asimétrica',
  'Minado y consenso en bloque nacional',
];

// pending -> processing -> done
function StepRow({ label, status }) {
  const icon =
    status === 'done' ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
    ) : status === 'processing' ? (
      <Loader className="h-4 w-4 text-blue-600 animate-spin" />
    ) : (
      <Circle className="h-4 w-4 text-slate-400" />
    );

  const statusText =
    status === 'done' ? 'Completado' : status === 'processing' ? 'En proceso...' : 'Pendiente';
  const statusColor =
    status === 'done'
      ? 'text-emerald-600'
      : status === 'processing'
      ? 'text-blue-600'
      : 'text-slate-400';

  return (
    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2">
        {icon}
        <span className={status === 'pending' ? 'text-slate-400' : 'text-slate-700'}>
          {label}
        </span>
      </div>
      <span className={`text-[10px] ${statusColor}`}>{statusText}</span>
    </div>
  );
}

/**
 * Modal que simula visualmente el proceso de firma y consenso del voto
 * (hash -> firma asimétrica -> minado). Al completar las 3 etapas habilita
 * el botón de transmisión, que dispara `onConfirm`.
 */
export default function SigningModal({ open, candidate, onClose, onConfirm, broadcasting }) {
  const [stepStatuses, setStepStatuses] = useState(['pending', 'pending', 'pending']);
  const [displayHash, setDisplayHash] = useState('');

  useEffect(() => {
    if (!open) return undefined;

    setDisplayHash(generateMockHash(32) + '... (Consenso Activo)');
    setStepStatuses(['processing', 'pending', 'pending']);

    const t1 = setTimeout(() => {
      setStepStatuses(['done', 'processing', 'pending']);
    }, 750);
    const t2 = setTimeout(() => {
      setStepStatuses(['done', 'done', 'processing']);
    }, 750 + 900);
    const t3 = setTimeout(() => {
      setStepStatuses(['done', 'done', 'done']);
    }, 750 + 900 + 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [open, candidate?.id]);

  if (!open) return null;

  const allDone = stepStatuses.every((s) => s === 'done');

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 max-w-md w-full rounded-2xl p-6 shadow-2xl relative">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center p-2.5 bg-blue-50 rounded-full border border-blue-100 mb-2 text-blue-600">
            <Cpu className="h-6 w-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Procesando Firma Digital</h3>
          <p className="text-slate-500 text-xs mt-1">
            El protocolo de consenso está registrando la transacción en el bloque distribuido.
          </p>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {STEP_LABELS.map((label, i) => (
            <StepRow key={label} label={label} status={stepStatuses[i]} />
          ))}
        </div>

        <div className="mt-4 p-3 bg-slate-100 border border-slate-200 rounded-lg">
          <span className="block text-[9px] text-slate-500 font-mono tracking-wider uppercase mb-1">
            Hash de la transacción electoral
          </span>
          <span className="font-mono text-[9px] text-slate-700 break-all">{displayHash}</span>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!allDone || broadcasting}
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
              allDone
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
            }`}
          >
            {broadcasting ? 'Transmitiendo...' : 'Transmitir Voto'}
          </button>
        </div>
      </div>
    </div>
  );
}
