import { useState, type FormEvent } from "react";
import { FiArrowLeft, FiLoader, FiLock, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminPanel from "@/components/admin/admin-panel";

function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const message = await login(email.trim(), password);
    if (message) setError(message);
    setSubmitting(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-violet-50 px-4 py-10">
      <section className="w-full max-w-md rounded-4xl border border-violet-100 bg-white p-6 shadow-xl sm:p-9">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
          <FiArrowLeft /> Volver a la tienda
        </a>
        <div className="mb-7 flex h-13 w-13 items-center justify-center rounded-full bg-violet-600 text-white">
          <FiLock className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-bold text-gray-950">Administración</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Acceso privado para la gestión de Bearys.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="admin-email">Correo</Label>
            <Input id="admin-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="admin-password">Contraseña</Label>
            <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <Button disabled={submitting} className="h-12 cursor-pointer rounded-full bg-violet-600 text-white hover:bg-violet-700">
            {submitting ? <><FiLoader className="animate-spin" /> Ingresando...</> : "Ingresar al panel"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export default function AdminRoute() {
  const { user, loading, isAdmin, adminLoading, logout } = useAuth();

  if (loading || (user && adminLoading)) {
    return <div className="flex min-h-screen items-center justify-center bg-violet-50 text-violet-700"><FiLoader className="h-7 w-7 animate-spin" /></div>;
  }
  if (!user) return <AdminLogin />;
  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-violet-50 px-4">
        <section className="w-full max-w-lg rounded-4xl border border-violet-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600"><FiLock /></div>
          <h1 className="mt-5 text-2xl font-bold">Acceso no autorizado</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">La cuenta {user.email} no tiene el rol de administrador en Neon.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="outline" className="rounded-full" onClick={() => void logout()}><FiLogOut /> Usar otra cuenta</Button>
            <Button className="rounded-full bg-violet-600 hover:bg-violet-700" onClick={() => { window.location.href = "/"; }}>Volver a la tienda</Button>
          </div>
        </section>
      </main>
    );
  }
  return <AdminPanel />;
}
