import React, { createContext, useContext } from 'react';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  handleLoginSuccess: () => {},
  handleLogout: () => {},
});

export function AuthProvider({ user, setUser, handleLoginSuccess, handleLogout, children }) {
  return (
    <AuthContext.Provider value={{ user, setUser, handleLoginSuccess, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context || { user: null, setUser: () => {}, handleLoginSuccess: () => {}, handleLogout: () => {} };
}

export default AuthContext;
