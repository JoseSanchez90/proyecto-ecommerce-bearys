import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@/contexts/auth-context";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const err = await login(email, password);
    setSubmitting(false);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 sm:p-10">
        <DialogHeader className="text-center">
          <DialogTitle className="font-monoton text-3xl">Bearys</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            ¡Bienvenido! Inicia sesión para continuar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              placeholder="correo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Contraseña</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Recordarme
              </Label>
            </div>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-violet-600 hover:bg-violet-500 transition-colors cursor-pointer"
            disabled={submitting}
          >
            {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-gray-900 font-medium hover:underline cursor-pointer"
          >
            Regístrate
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
