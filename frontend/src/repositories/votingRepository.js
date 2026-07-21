import apiClient, { USE_MOCKS } from '../services/apiClient';
import { MOCK_CANDIDATES } from '../shared/utils/mockData';
import { delay, generateMockHash } from '../shared/utils/formatters';

// Copia local usada solo en modo mock para simular persistencia de votos
// dentro de una misma sesión de navegador (no hay backend real detrás).
let mockCandidatesState = MOCK_CANDIDATES.map((c) => ({ ...c }));

/**
 * Repositorio del módulo de votación: candidatos, emisión y verificación
 * del voto firmado sobre la cadena de bloques.
 */
const votingRepository = {
  /**
   * Obtiene la lista de candidatos habilitados para la jornada electoral.
   * Backend real esperado: GET /candidates -> Candidate[]
   */
  async getCandidates() {
    if (USE_MOCKS) {
      await delay(400);
      return mockCandidatesState.map((c) => ({ ...c }));
    }
    const { data } = await apiClient.get('/candidates');
    return data;
  },

  /**
   * Verifica si el elector autenticado ya emitió su voto en esta jornada.
   * Backend real esperado: GET /votes/status?voterId=...
   */
  async getVoteStatus(voterId) {
    if (USE_MOCKS) {
      await delay(200);
      return { voted: false, voterId };
    }
    const { data } = await apiClient.get('/votes/status', { params: { voterId } });
    return data;
  },

  /**
   * Firma y transmite el voto del elector para un candidato específico.
   * Backend real esperado: POST /votes -> { txHash, block, timestamp }
   */
  async castVote(candidateId) {
    if (USE_MOCKS) {
      await delay(500);
      const candidate = mockCandidatesState.find((c) => c.id === candidateId);
      if (candidate) candidate.votes += 1;
      return {
        txHash: generateMockHash(64),
        block: Math.floor(Math.random() * 1000) + 28417,
        timestamp: new Date().toISOString(),
        candidateId,
      };
    }
    const { data } = await apiClient.post('/votes', { candidateId });
    return data;
  },
};

export default votingRepository;
