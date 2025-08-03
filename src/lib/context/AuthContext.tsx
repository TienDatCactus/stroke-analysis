// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "DOCTOR" | "ADMIN" | "PATIENT"; // Extendable

interface AuthState {
  username: string;
}

interface AuthContextType {
  user: AuthState | null;
  login: (user: AuthState) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthState | null>(null);

  const login = (user: AuthState) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
