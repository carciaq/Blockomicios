import { ArrowRight, Eye, EyeOff, Info, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { SEED_PASSPHRASE_WORDS } from '../../../shared/utils/mockData';

/**
 * Formulario de verificación de identidad electoral (ID de padrón + llave
 * criptográfica privada). Los valores son controlados por el padre
 * (LoginView) para permitir el autocompletado desde el panel de demo.
 */
export default function LoginForm({
  voterId,
  privateKey,
  onVoterIdChange,
  onPrivateKeyChange,
  onSubmit,
  submitting,
}) {
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!voterId.trim() || !privateKey.trim()) return;
    onSubmit(voterId.trim(), privateKey.trim());
  };

  const generateRandomKey = () => {
    const phrase = Array.from(
      { length: 4 },
      () => SEED_PASSPHRASE_WORDS[Math.floor(Math.random() * SEED_PASSPHRASE_WORDS.length)]
    ).join('-');
    onPrivateKeyChange(phrase);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="voter-id"
          className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5"
        >
          Identificación de Elector (ID)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <User className="h-4 w-4" />
          </span>
          <input
            type="text"
            id="voter-id"
            required
            value={voterId}
            onChange={(e) => onVoterIdChange(e.target.value)}
            placeholder="Ejem: VOTE-2026-X9"
            className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label
            htmlFor="private-key"
            className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider"
          >
            Clave Criptográfica Privada
          </label>
          <span
            className="text-[11px] text-blue-600 cursor-pointer hover:underline font-medium"
            onClick={generateRandomKey}
          >
            Generar Aleatoria
          </span>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Lock className="h-4 w-4" />
          </span>
          <input
            type={showKey ? 'text' : 'password'}
            id="private-key"
            required
            value={privateKey}
            onChange={(e) => onPrivateKeyChange(e.target.value)}
            placeholder="Su frase de firma o llave privada hexadecimal"
            className="block w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
          />
          <button
            type="button"
            onClick={() => setShowKey((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-start space-x-2.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Privacidad garantizada:</strong> Las llaves nunca salen de su navegador. El
          voto se encripta localmente antes de propagarse a los validadores del sistema
          estatal.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 shadow-md shadow-blue-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{submitting ? 'Validando firma...' : 'Validar Identidad y Firma'}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
