import { createContext, useContext, useMemo, useState } from 'react';
import { MOCK_NETWORK_INFO } from '../shared/utils/mockData';

const NetworkContext = createContext(null);

/**
 * Contexto con el estado "global" de la red blockchain (altura de bloque,
 * nodos activos) que se muestra en el header y se actualiza tanto al votar
 * como al recibir nuevas transacciones en el dashboard.
 */
export function NetworkProvider({ children }) {
  const [blockchainHeight, setBlockchainHeight] = useState(
    MOCK_NETWORK_INFO.blockchainHeight
  );
  const [activeNetworkNodes] = useState(MOCK_NETWORK_INFO.activeNetworkNodes);

  const bumpBlockchainHeight = () => setBlockchainHeight((prev) => prev + 1);

  const value = useMemo(
    () => ({
      blockchainHeight,
      setBlockchainHeight,
      bumpBlockchainHeight,
      activeNetworkNodes,
    }),
    [blockchainHeight, activeNetworkNodes]
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error('useNetwork debe usarse dentro de un <NetworkProvider>');
  }
  return ctx;
}
