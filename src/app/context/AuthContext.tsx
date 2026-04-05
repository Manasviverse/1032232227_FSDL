import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService, type AuthUser } from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    avatar?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (u: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("edusync_token");
    const savedUser = localStorage.getItem("edusync_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("edusync_user");
      }
    }
    setIsLoading(false);
  }, []);

  const persist = (t: string, u: AuthUser) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("edusync_token", t);
    localStorage.setItem("edusync_user", JSON.stringify(u));
  };

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    persist(res.token, res.user);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    avatar?: string;
  }) => {
    const res = await authService.register(data);
    persist(res.token, res.user);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("edusync_token");
    localStorage.removeItem("edusync_user");
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...partial };
    setUser(updated);
    localStorage.setItem("edusync_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
