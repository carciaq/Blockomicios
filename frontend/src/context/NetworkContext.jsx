import { createContext, useContext, useMemo, useState } from 'react';

const NetworkContext = createContext(null);

/**
 * Contexto con el estado "global" de la red blockchain (altura de bloque,
 * nodos activos) que se muestra en el header y se actualiza al votar.
 */
export function NetworkProvider({ children }) {
  const [blockchainHeight, setBlockchainHeight] = useState(8);
  const [activeNetworkNodes] = useState(4);

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
