// src/context/AuthContext.tsx
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface AuthState {
  id?: string;
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

  const login = async (user: AuthState) => {
    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!resp.ok) {
        toast.error("Wrong ID or username. Please try again.");
      }
      const data = await resp.json();
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast.success("Login successful!");
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please try again.");
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Cleanup function to avoid memory leaks
    return () => {
      setUser(null);
    };
  }, []);
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
