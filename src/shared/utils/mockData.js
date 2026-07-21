/**
 * Datos semilla usados únicamente por los repositorios en modo "mock",
 * mientras el backend blockchain real no está disponible. Reflejan la
 * estructura que se espera reciba la app desde la API.
 */

export const MOCK_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Dra. Sofía Martínez',
    party: 'Alianza Tecnológica y Progreso',
    color: 'blue',
    votes: 2450,
    avatar: '👩‍💼',
    proposal:
      'Digitalización de trámites estatales, infraestructura para IA ética y modernización educativa nacional.',
  },
  {
    id: 'cand-2',
    name: 'Ing. Carlos Mendoza',
    party: 'Unión Sostenible y Economía Verde',
    color: 'emerald',
    votes: 2180,
    avatar: '👨‍🌾',
    proposal:
      'Soberanía energética limpia, reforestación masiva y fomento de la economía circular.',
  },
  {
    id: 'cand-3',
    name: 'Abg. Valeria Ruiz',
    party: 'Movimiento Justicia Social e Integración',
    color: 'slate',
    votes: 1950,
    avatar: '⚖️',
    proposal:
      'Reforma laboral transparente, salud pública digital integrada y equidad de oportunidades.',
  },
];

export const MOCK_TRANSACTIONS = [
  {
    txHash: '0x3f8a9e...7c2d',
    block: 28413,
    timestamp: 'Hace 2 min',
    candidate: 'Dra. Sofía Martínez',
    status: 'Verificado',
  },
  {
    txHash: '0x8c7b6d...1e5a',
    block: 28414,
    timestamp: 'Hace 1 min',
    candidate: 'Ing. Carlos Mendoza',
    status: 'Verificado',
  },
  {
    txHash: '0x2a9e4f...9b8c',
    block: 28415,
    timestamp: 'Hace 30 seg',
    candidate: 'Abg. Valeria Ruiz',
    status: 'Verificado',
  },
];

export const MOCK_DEMO_USERS = [
  {
    voterId: 'VOTE-2026-X9',
    name: 'Ana Gómez',
    phone: '+57 312 456 7890',
    voted: false,
  },
  {
    voterId: 'VOTE-2026-Y4',
    name: 'Mateo Silva',
    phone: '+57 315 987 6543',
    voted: true,
  },
];

export const MOCK_NETWORK_INFO = {
  blockchainHeight: 28416,
  activeNetworkNodes: 24,
  padronTotal: 10000,
};

export const SEED_PASSPHRASE_WORDS = [
  'oficial',
  'seguro',
  'consenso',
  'digital',
  'urna',
  'bloque',
  'padrón',
  'voto',
  'nacional',
  'auditable',
  'criptografía',
  'validador',
];
