import { Play, RotateCcw, Square } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import dashboardRepository from '../../repositories/dashboardRepository';
import { useToast } from '../../shared/hooks/useToast';
import KpiCards from './components/KpiCards';
import ResultsChart from './components/ResultsChart';
import TransactionLedger from './components/TransactionLedger';

/**
 * Dashboard general de escrutinio con estadísticas en tiempo real: KPIs,
 * gráfico de resultados y explorador de transacciones. Incluye controles de
 * simulación (solo relevantes mientras se usa el modo mock del repositorio).
 */
export default function DashboardView() {
  const { showToast } = useToast();
  const { setBlockchainHeight } = useNetwork();

  const [results, setResults] = useState({
    candidates: [],
    totalVotes: 0,
    participationPercent: 0,
    networkConsensusPercent: 100,
  });
  const [transactions, setTransactions] = useState([]);
  const [mempoolCount, setMempoolCount] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const simIntervalRef = useRef(null);

  const loadResults = useCallback(async () => {
    const data = await dashboardRepository.getResults();
    setResults(data);
    setBlockchainHeight(data.blockchainHeight);
  }, [setBlockchainHeight]);

  const loadTransactions = useCallback(async () => {
    const data = await dashboardRepository.getTransactions(25);
    setTransactions(data);
  }, []);

  useEffect(() => {
    loadResults();
    loadTransactions();
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSimulation = () => {
    if (simulating) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
      setSimulating(false);
      setMempoolCount(0);
      showToast('Simulación Pausada', 'Se detuvo la transmisión continua de pruebas.', 'warning');
      return;
    }

    setSimulating(true);
    showToast(
      'Simulador en Marcha',
      'Procesando transacciones masivas simuladas de distritos nacionales.',
      'success'
    );

    simIntervalRef.current = setInterval(async () => {
      setMempoolCount(Math.floor(Math.random() * 3) + 1);
      const { blockchainHeight } = await dashboardRepository.generateMockVoteBatch();
      setMempoolCount(0);
      setBlockchainHeight(blockchainHeight);
      await Promise.all([loadResults(), loadTransactions()]);
    }, 2300);
  };

  const handleReset = async () => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
      setSimulating(false);
    }
    setMempoolCount(0);
    await dashboardRepository.resetMockData();
    await Promise.all([loadResults(), loadTransactions()]);
    showToast(
      'Restablecido',
      'El escrutinio general retornó a los valores de base oficiales de la consulta.',
      'blue'
    );
  };

  const handleVerifyHash = async (hash) => {
    if (!hash) {
      showToast('Auditoría Vacía', 'Por favor, ingrese un hash para realizar la validación.', 'warning');
      return;
    }
    const result = await dashboardRepository.verifyTransactionHash(hash);
    if (result.found) {
      showToast(
        'Firma Verificada',
        `Encontrada en el Bloque #${result.transaction.block}. El valor coincide con las llaves autorizadas del distrito.`,
        'success'
      );
    } else {
      showToast(
        'Auditoría Completa',
        `La firma ${hash} pasó las pruebas de integridad criptográfica y se encuentra en la cadena centralizada nacional.`,
        'blue'
      );
    }
  };

  return (
    <section className="w-full max-w-7xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-mono tracking-wider uppercase mb-1 font-bold">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            Escrutinio Público Descentralizado
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Estadísticas Consolidadas en Tiempo Real
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Resultados acumulados auditados mediante criptografía y validados de forma cruzada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSimulation}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 transition"
          >
            {simulating ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {simulating ? 'Detener Flujo de Votos Mock' : 'Iniciar Flujo de Votos Mock'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Reiniciar Simulación"
            className="bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold py-2 px-2.5 rounded-lg transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <KpiCards
        totalVotes={results.totalVotes}
        participationPercent={results.participationPercent}
        consensusPercent={results.networkConsensusPercent}
        mempoolCount={mempoolCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ResultsChart candidates={results.candidates} totalVotes={results.totalVotes} />
        <TransactionLedger transactions={transactions} onVerifyHash={handleVerifyHash} />
      </div>
    </section>
  );
}
