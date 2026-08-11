import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authClient } from "@/auth";
import { neonData } from "@/lib/neon-data";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  refreshAdminAccess: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<string | null>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  const refreshAdminAccess = async () => {
    setAdminLoading(true);
    try {
      const { data, error } = await neonData.rpc("is_admin");
      if (error) throw error;
      const allowed = data === true;
      setIsAdmin(allowed);
      return allowed;
    } catch {
      setIsAdmin(false);
      return false;
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    authClient.getSession().then(async (result) => {
      if (result.data?.session && result.data?.user) {
        setUser({
          id: result.data.user.id,
          name: result.data.user.name ?? "",
          email: result.data.user.email ?? "",
        });
        await refreshAdminAccess();
      } else {
        setAdminLoading(false);
      }
      setLoading(false);
    });
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) return result.error.message ?? "Error al iniciar sesion";

    const sessionResult = await authClient.getSession();
    if (sessionResult.data?.session && sessionResult.data?.user) {
      setUser({
        id: sessionResult.data.user.id,
        name: sessionResult.data.user.name ?? "",
        email: sessionResult.data.user.email ?? "",
      });
      await refreshAdminAccess();
    }
    return null;
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<string | null> => {
    const result = await authClient.signUp.email({ name, email, password });
    if (result.error) return result.error.message ?? "Error al registrarse";

    const sessionResult = await authClient.getSession();
    if (sessionResult.data?.session && sessionResult.data?.user) {
      setUser({
        id: sessionResult.data.user.id,
        name: sessionResult.data.user.name ?? "",
        email: sessionResult.data.user.email ?? "",
      });
      await refreshAdminAccess();
    }
    return null;
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
    setIsAdmin(false);
    setAdminLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        adminLoading,
        refreshAdminAccess,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
