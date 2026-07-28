import { ArrowRight, User } from 'lucide-react';

export default function LoginForm({ voterId, onVoterIdChange, onSubmit, submitting, error }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!voterId.trim()) return;
    onSubmit(voterId.trim());
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
            placeholder="Ejem: 12345678"
            className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150"
          />
        </div>
      {error ? (
        <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-3">
          {error}
        </div>
      ) : (
        <div className="flex items-start space-x-2.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-blue-500 flex-shrink-0 mt-0.5">✓</span>
          <p className="leading-relaxed">
            Use su número de elector único. El sistema conserva la prueba de voto y evita votaciones
            múltiples en la cadena de bloques.
          </p>
        </div>
      )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 shadow-md shadow-blue-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{submitting ? 'Validando identidad...' : 'Ingresar con mi ID de elector'}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
