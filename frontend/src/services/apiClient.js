import axios from 'axios';

/**
 * Cliente HTTP centralizado para comunicarse con el backend / gateway blockchain.
 * Todos los repositorios deben usar esta instancia en vez de instanciar axios
 * directamente, para mantener configuración (headers, interceptores, baseURL)
 * en un solo lugar.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de response: normaliza errores para que los repositorios y
// componentes reciban siempre un objeto de error predecible.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error de comunicación con el servidor.',
      status: error.response?.status || null,
      original: error,
    };
    return Promise.reject(normalizedError);
  }
);

export const USE_MOCKS = false;

export default apiClient;
