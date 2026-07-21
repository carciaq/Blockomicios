import apiClient, { USE_MOCKS } from '../services/apiClient';
import {
  MOCK_CANDIDATES,
  MOCK_NETWORK_INFO,
  MOCK_TRANSACTIONS,
} from '../shared/utils/mockData';
import { delay, generateShortMockHash } from '../shared/utils/formatters';

// Estado local usado solo por el modo mock, para simular la evolución del
// escrutinio y del libro de transacciones sin backend real.
let mockCandidatesState = MOCK_CANDIDATES.map((c) => ({ ...c }));
let mockTransactionsState = [...MOCK_TRANSACTIONS];
let mockBlockchainHeight = MOCK_NETWORK_INFO.blockchainHeight;

/**
 * Repositorio del dashboard de escrutinio: resultados consolidados,
 * indicadores de red y explorador de transacciones (ledger).
 *
 * Nota sobre tiempo real: cuando exista backend, `subscribeToLiveUpdates`
 * debería reemplazarse por una suscripción WebSocket / Server-Sent Events
 * en vez de polling. Se deja aquí como punto único de integración.
 */
const dashboardRepository = {
  /**
   * Resultados consolidados por candidato + indicadores clave (KPIs).
   * Backend real esperado: GET /dashboard/results
   */
  async getResults() {
    if (USE_MOCKS) {
      await delay(300);
      const totalVotes = mockCandidatesState.reduce((sum, c) => sum + c.votes, 0);
      return {
        candidates: mockCandidatesState.map((c) => ({ ...c })),
        totalVotes,
        participationPercent: (totalVotes / MOCK_NETWORK_INFO.padronTotal) * 100,
        networkConsensusPercent: 100,
        blockchainHeight: mockBlockchainHeight,
        activeNetworkNodes: MOCK_NETWORK_INFO.activeNetworkNodes,
      };
    }
    const { data } = await apiClient.get('/dashboard/results');
    return data;
  },

  /**
   * Últimas transacciones (votos) registradas en la cadena de bloques.
   * Backend real esperado: GET /dashboard/transactions?limit=25
   */
  async getTransactions(limit = 25) {
    if (USE_MOCKS) {
      await delay(300);
      return mockTransactionsState.slice(0, limit);
    }
    const { data } = await apiClient.get('/dashboard/transactions', {
      params: { limit },
    });
    return data;
  },

  /**
   * Verifica una transacción de voto por su hash (auditoría pública).
   * Backend real esperado: GET /dashboard/transactions/verify?hash=...
   */
  async verifyTransactionHash(hash) {
    if (USE_MOCKS) {
      await delay(350);
      const match = mockTransactionsState.find((tx) =>
        tx.txHash.toLowerCase().includes(hash.toLowerCase())
      );
      return match ? { found: true, transaction: match } : { found: false };
    }
    const { data } = await apiClient.get('/dashboard/transactions/verify', {
      params: { hash },
    });
    return data;
  },

  /**
   * SOLO DISPONIBLE EN MODO MOCK: genera un lote de votos simulados para
   * demostrar la actualización en tiempo real del dashboard. En producción
   * este método no debe usarse; los datos llegarán por la suscripción real.
   */
  async generateMockVoteBatch() {
    if (!USE_MOCKS) {
      throw new Error('generateMockVoteBatch solo está disponible en modo mock.');
    }
    await delay(1000);
    const pendingVoters = Math.floor(Math.random() * 3) + 1;
    mockBlockchainHeight += 1;

    for (let i = 0; i < pendingVoters; i++) {
      const candidate =
        mockCandidatesState[Math.floor(Math.random() * mockCandidatesState.length)];
      candidate.votes += Math.floor(Math.random() * 12) + 1;

      mockTransactionsState.unshift({
        txHash: generateShortMockHash(),
        block: mockBlockchainHeight,
        timestamp: 'Hace unos instantes',
        candidate: candidate.name,
        status: 'Verificado',
      });
    }

    if (mockTransactionsState.length > 25) {
      mockTransactionsState = mockTransactionsState.slice(0, 25);
    }

    return { processedVotes: pendingVoters, blockchainHeight: mockBlockchainHeight };
  },

  /** Restablece los datos de la simulación a sus valores base (solo demo). */
  async resetMockData() {
    if (!USE_MOCKS) return;
    await delay(200);
    mockCandidatesState = MOCK_CANDIDATES.map((c) => ({ ...c }));
    mockTransactionsState = [...MOCK_TRANSACTIONS];
    mockBlockchainHeight = MOCK_NETWORK_INFO.blockchainHeight;
  },
};

export default dashboardRepository;
