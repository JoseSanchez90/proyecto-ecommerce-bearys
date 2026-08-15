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
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import { FiLoader } from "react-icons/fi";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);
    try {
      const err = await signUp(name, email, password);
      if (err) {
        setError(err);
      } else {
        onClose();
      }
    } catch (cause) {
      console.error("Error inesperado al registrar la cuenta", cause);
      setError("Ocurrió un error inesperado. Inténtalo nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 sm:p-8">
        <DialogHeader className="text-center">
          <DialogTitle className="font-monoton text-3xl">Bearys</DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Crea tu cuenta y empieza a comprar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Nombre completo</Label>
            <Input
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Teléfono</Label>
            <Input
              type="tel"
              placeholder="999 888 777"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
          <div className="flex flex-col gap-2">
            <Label>Repetir contraseña</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex items-center gap-2">
            <Checkbox
              id="subscribe"
              checked={subscribe}
              onCheckedChange={(checked) => setSubscribe(checked === true)}
            />
            <Label
              htmlFor="subscribe"
              className="text-sm text-gray-500 font-normal"
            >
              Suscribirme a correos de promociones y ofertas
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-500 font-normal"
            >
              Acepto los{" "}
              <a href="#" className="text-gray-900 hover:underline">
                términos y condiciones
              </a>
            </Label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-violet-600 hover:bg-violet-500 transition-colors cursor-pointer"
            disabled={!acceptTerms || submitting}
          >
            {submitting ? (
              <>
                <FiLoader className="animate-spin" aria-hidden="true" />
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-gray-900 font-medium hover:underline cursor-pointer"
            >
              Inicia sesión
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterModal;
