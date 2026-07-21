import { FileText, Link2, Search } from 'lucide-react';
import { useState } from 'react';

/** Explorador de las últimas transacciones (votos) registradas en la cadena. */
export default function TransactionLedger({ transactions, onVerifyHash, onVerifyTerm }) {
  const [term, setTerm] = useState('');

  const handleVerify = () => {
    if (!term.trim()) {
      onVerifyTerm?.(''); // deja que el padre muestre el toast de "vacío"
      return;
    }
    onVerifyHash(term.trim());
  };

  return (
    <div className="lg:col-span-5 bg-slate-50/50 border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between h-[450px]">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
          <FileText className="h-[18px] w-[18px] text-slate-700" /> Explorador: Últimas
          Transacciones
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Historial continuo de bloques de votación firmados y propagados.
        </p>
      </div>

      <div className="flex-grow my-3 overflow-y-auto custom-scrollbar pr-1 max-h-[250px] space-y-2.5">
        {transactions.map((tx, idx) => (
          <div
            key={`${tx.txHash}-${idx}`}
            className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs hover:border-blue-300 transition duration-150 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                <Link2 className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-mono text-[10px] text-slate-500">
                  TX:{' '}
                  <strong
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => onVerifyHash(tx.txHash)}
                  >
                    {tx.txHash}
                  </strong>
                </span>
                <span className="text-[9px] text-slate-400">
                  Bloque #{tx.block} • {tx.timestamp}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-800 font-semibold block text-[10px]">Cifrado ZKP</span>
              <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Auditado
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-3.5 mt-2">
        <div className="relative">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            placeholder="Buscar o auditar Hash de transacción..."
            className="block w-full py-2 pl-3 pr-9 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleVerify}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-700"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
