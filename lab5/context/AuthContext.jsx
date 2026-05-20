import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (!email.trim() || !password.trim()) {
      return { success: false, message: 'Введіть email і пароль.' };
    }

    setUser({ email: email.trim(), name: 'Користувач' });
    setIsAuthenticated(true);
    return { success: true };
  };

  const register = (email, password, name) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { success: false, message: 'Заповніть усі поля.' };
    }

    setUser({ email: email.trim(), name: name.trim() });
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      register,
      logout,
    }),
    [isAuthenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
