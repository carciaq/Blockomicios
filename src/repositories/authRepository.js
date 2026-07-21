import apiClient, { USE_MOCKS } from '../services/apiClient';
import { MOCK_DEMO_USERS } from '../shared/utils/mockData';
import { delay, maskSecret } from '../shared/utils/formatters';

/**
 * Repositorio de autenticación: encapsula toda la comunicación con la API
 * relacionada a verificación de identidad electoral y firma de sesión.
 * Los componentes NUNCA deben llamar a axios/fetch directamente: siempre
 * pasan por este repositorio.
 */
const authRepository = {
  /**
   * Valida la identidad del elector (ID de padrón + llave privada/firma) y
   * devuelve la sesión autenticada.
   * Backend real esperado: POST /auth/login -> { token, voter: { id, voted } }
   */
  async login(voterId, privateKey) {
    if (USE_MOCKS) {
      await delay(600);
      const demoMatch = MOCK_DEMO_USERS.find((u) => u.voterId === voterId);
      return {
        id: voterId,
        privateKeyPreview: maskSecret(privateKey),
        voted: demoMatch ? demoMatch.voted : false,
      };
    }

    const { data } = await apiClient.post('/auth/login', {
      voterId,
      privateKey,
    });

    if (data.token) {
      sessionStorage.setItem('blockvote_session_token', data.token);
    }

    return {
      id: data.voter.id,
      privateKeyPreview: maskSecret(privateKey),
      voted: data.voter.voted,
    };
  },

  /** Cierra la sesión del elector actual en el backend (invalida el token). */
  async logout() {
    if (USE_MOCKS) {
      await delay(150);
      return true;
    }
    await apiClient.post('/auth/logout');
    return true;
  },

  /** Devuelve las credenciales de demo disponibles para el entorno de simulación. */
  async getDemoCredentials() {
    if (USE_MOCKS) {
      await delay(100);
      return MOCK_DEMO_USERS;
    }
    const { data } = await apiClient.get('/auth/demo-credentials');
    return data;
  },
};

export default authRepository;
