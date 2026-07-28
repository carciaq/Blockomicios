import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

/**
 * Contexto de sesión del elector autenticado. Reemplaza al `state.currentUser`
 * global del mockup original, exponiendo login/logout a toda la app.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (userSession) =>
    setCurrentUser((prev) => ({
      ...userSession,
      votedEvents: prev?.votedEvents || userSession?.votedEvents || {},
    }));
  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('blockvote_session_token');
  };
  const markAsVoted = (eventId) =>
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            votedEvents: {
              ...(prev.votedEvents || {}),
              [eventId]: true,
            },
          }
        : prev
    );

  const value = useMemo(
    () => ({ currentUser, login, logout, markAsVoted, isAuthenticated: !!currentUser }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook para leer/mutar la sesión del elector actual. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return ctx;
}
