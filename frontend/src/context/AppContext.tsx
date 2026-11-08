import { createContext, useState, ReactNode, useContext } from 'react';

// Context structure 
interface AppContextType {
  token: string | null;
  userRole: string | null;
  login: (newToken: string, role: string) => void;
  logout: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component 
export function AppProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('role'));

  const login = (newToken: string, role: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', role);
    setToken(newToken);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setUserRole(null);
  };

  return (
    <AppContext.Provider value={{ token, userRole, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};