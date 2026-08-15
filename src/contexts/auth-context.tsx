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

function translateAuthMessage(message: string, fallback: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid origin")) {
    return "Este dominio no está autorizado en Neon Auth. Agrega la URL del sitio a los orígenes permitidos.";
  }

  if (
    normalizedMessage.includes("password does not meet security requirements") ||
    normalizedMessage.includes("password is too short") ||
    normalizedMessage.includes("weak password")
  ) {
    return "La contraseña no cumple con los requisitos de seguridad.";
  }

  if (
    normalizedMessage.includes("user already exists") ||
    normalizedMessage.includes("email already exists") ||
    normalizedMessage.includes("email is already in use")
  ) {
    return "Ya existe una cuenta registrada con este correo electrónico.";
  }

  if (normalizedMessage.includes("invalid email")) {
    return "El correo electrónico ingresado no es válido.";
  }

  if (
    normalizedMessage.includes("invalid credentials") ||
    normalizedMessage.includes("invalid email or password")
  ) {
    return "El correo electrónico o la contraseña son incorrectos.";
  }

  if (
    normalizedMessage.includes("failed to fetch") ||
    normalizedMessage.includes("network")
  ) {
    return "No se pudo conectar con el servicio de autenticación. Revisa tu conexión e inténtalo nuevamente.";
  }

  return message || fallback;
}

function getAuthErrorMessage(cause: unknown, fallback: string) {
  const message =
    cause instanceof Error
      ? cause.message
      : typeof cause === "object" && cause !== null && "message" in cause
        ? String(cause.message)
        : "";

  return translateAuthMessage(message, fallback);
}

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
    const restoreSession = async () => {
      try {
        const result = await authClient.getSession();
        if (result.data?.session && result.data?.user) {
          setUser({
            id: result.data.user.id,
            name: result.data.user.name ?? "",
            email: result.data.user.email ?? "",
          });
          void refreshAdminAccess();
        } else {
          setAdminLoading(false);
        }
      } catch (cause) {
        console.error("No se pudo restaurar la sesión de Neon Auth", cause);
        setAdminLoading(false);
      } finally {
        setLoading(false);
      }
    };

    void restoreSession();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });
      if (result.error) {
        return getAuthErrorMessage(result.error, "Error al iniciar sesión");
      }

      const sessionResult = await authClient.getSession();
      if (sessionResult.data?.session && sessionResult.data?.user) {
        setUser({
          id: sessionResult.data.user.id,
          name: sessionResult.data.user.name ?? "",
          email: sessionResult.data.user.email ?? "",
        });
        void refreshAdminAccess();
      }
      return null;
    } catch (cause) {
      console.error("Error al iniciar sesión con Neon Auth", cause);
      return getAuthErrorMessage(cause, "No se pudo iniciar sesión");
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (result.error) {
        return getAuthErrorMessage(result.error, "Error al registrarse");
      }

      const sessionResult = await authClient.getSession();
      if (sessionResult.data?.session && sessionResult.data?.user) {
        setUser({
          id: sessionResult.data.user.id,
          name: sessionResult.data.user.name ?? "",
          email: sessionResult.data.user.email ?? "",
        });
        void refreshAdminAccess();
      }
      return null;
    } catch (cause) {
      console.error("Error al registrar la cuenta con Neon Auth", cause);
      return getAuthErrorMessage(cause, "No se pudo crear la cuenta");
    }
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
