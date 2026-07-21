import axios from 'axios';

/**
 * Cliente HTTP centralizado para comunicarse con el backend / gateway blockchain.
 * Todos los repositorios deben usar esta instancia en vez de instanciar axios
 * directamente, para mantener configuración (headers, interceptores, baseURL)
 * en un solo lugar.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request: aquí se puede inyectar el token de sesión del elector
// (por ejemplo un JWT emitido tras validar la firma) cuando el backend lo requiera.
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('blockvote_session_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: normaliza errores para que los repositorios y
// componentes reciban siempre un objeto de error predecible.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'Error de comunicación con el servidor.',
      status: error.response?.status || null,
      original: error,
    };
    return Promise.reject(normalizedError);
  }
);

/**
 * Bandera global para saber si debemos usar datos simulados (mocks) mientras
 * el backend blockchain aún no está disponible. Los repositorios consultan
 * este flag para decidir si llaman a la API real o devuelven datos mock.
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export default apiClient;
