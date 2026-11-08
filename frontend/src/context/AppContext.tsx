import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  token: string | null;
  userRole: string | null;
  user: any;
  login: (token: string, role: string, userData?: any) => void;
  logout: () => void;
  setUser: (user: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('role'));
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (newToken: string, role: string, userData?: any) => {
    setToken(newToken);
    setUserRole(role);
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', role);
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  return (
    <AppContext.Provider value={{ token, userRole, user, login, logout, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};