import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBagShopping,
  FaBoxOpen,
  FaCircleCheck,
  FaClock,
  FaEnvelope,
  FaHeadset,
  FaLocationDot,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { useAuth } from "@/contexts/auth-context";
import { useOrders } from "@/hooks/use-orders";
import { getProductSize } from "@/data/product-sizes";
import { useDeliveryAddress } from "@/hooks/use-delivery-address";
import {
  PERU_DEPARTMENTS,
  getDistricts,
  getProvinces,
} from "@/data/peru-locations";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusDetails: Record<
  string,
  { label: string; className: string; progress: number }
> = {
  pending: {
    label: "Recibido",
    className: "bg-amber-100 text-amber-700",
    progress: 0,
  },
  confirmed: {
    label: "Confirmado",
    className: "bg-blue-100 text-blue-700",
    progress: 1,
  },
  preparing: {
    label: "En preparación",
    className: "bg-violet-100 text-violet-700",
    progress: 2,
  },
  shipped: {
    label: "Enviado",
    className: "bg-sky-100 text-sky-700",
    progress: 3,
  },
  delivered: {
    label: "Entregado",
    className: "bg-emerald-100 text-emerald-700",
    progress: 4,
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700",
    progress: -1,
  },
};

const progressSteps = [
  "Recibido",
  "Confirmado",
  "Preparando",
  "Enviado",
  "Entregado",
];

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function formatCurrency(value: number) {
  return `S/. ${value.toFixed(2)}`;
}

function Perfil() {
  const { hash } = useLocation();
  const { user, logout } = useAuth();
  const { orders, loading, error, refetch } = useOrders(user?.id);
  const {
    address,
    setAddress,
    loading: addressLoading,
    saving: addressSaving,
    saved: addressSaved,
    error: addressError,
    save: saveAddress,
  } = useDeliveryAddress(user?.id);

  useEffect(() => {
    if (hash !== "#pedidos") return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById("pedidos")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  if (!user) return null;

  const firstLetter = user.name.charAt(0).toUpperCase() || "?";
  const activeOrders = orders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status),
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;
  const availableProvinces = getProvinces(address.department);
  const availableDistricts = getDistricts(
    address.department,
    address.province,
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-10 text-gray-900 sm:px-6 sm:pt-14 lg:px-8 lg:pb-36">
      <div className="max-w-3xl">
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
          Mi cuenta
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-500 sm:text-lg">
          Consulta tus datos, revisa tus compras y sigue el avance de cada
          pedido desde un solo lugar.
        </p>
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="rounded-4xl border border-gray-200 bg-gray-50 p-6 lg:sticky lg:top-8">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
              {firstLetter}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">{user.name}</p>
              <p className="truncate text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <nav
            className="mt-7 flex flex-col gap-2"
            aria-label="Secciones de mi cuenta"
          >
            <a
              href="#cuenta"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold"
            >
              <FaUser className="h-4 w-4 text-violet-700" />
              Datos de cuenta
            </a>
            <a
              href="#pedidos"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-600"
            >
              <FaBagShopping className="h-4 w-4 text-violet-700" />
              Mis compras
            </a>
            <a
              href="#direccion"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-600"
            >
              <FaLocationDot className="h-4 w-4 text-violet-700" />
              Dirección
            </a>
            <Link
              to="/contacto"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-600"
            >
              <FaHeadset className="h-4 w-4 text-violet-700" />
              Necesito ayuda
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => void logout()}
            className="mt-7 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-red-500 hover:bg-red-400 px-5 py-3 text-sm font-bold text-white transition-colors"
          >
            <FaRightFromBracket className="h-4 w-4" />
            Cerrar sesión
          </button>
        </aside>

        <div className="min-w-0 space-y-8">
          <section
            className="grid gap-4 sm:grid-cols-3"
            aria-label="Resumen de pedidos"
          >
            <article className="rounded-3xl border border-violet-200 bg-gray-50 p-5">
              <FaBagShopping className="h-5 w-5 text-violet-700" />
              <p className="mt-5 text-3xl font-bold">{orders.length}</p>
              <p className="mt-1 text-sm text-gray-500">Pedidos realizados</p>
            </article>
            <article className="rounded-3xl border border-violet-200 bg-gray-50 p-5">
              <FaClock className="h-5 w-5 text-sky-700" />
              <p className="mt-5 text-3xl font-bold">{activeOrders}</p>
              <p className="mt-1 text-sm text-gray-500">Pedidos en proceso</p>
            </article>
            <article className="rounded-3xl border border-violet-200 bg-gray-50 p-5">
              <FaCircleCheck className="h-5 w-5 text-emerald-700" />
              <p className="mt-5 text-3xl font-bold">{deliveredOrders}</p>
              <p className="mt-1 text-sm text-gray-500">Pedidos entregados</p>
            </article>
          </section>

          <section
            id="cuenta"
            className="scroll-mt-8 rounded-4xl border border-gray-200 bg-gray-50 p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold">Datos de la cuenta</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Tus datos personales registrados no se pueden editar.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-violet-100 p-5">
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                  <FaUser className="h-4 w-4 text-violet-700" />
                  Nombre
                </div>
                <p className="mt-3 wrap-break-words font-bold">{user.name}</p>
              </div>
              <div className="rounded-3xl bg-violet-100 p-5">
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                  <FaEnvelope className="h-4 w-4 text-violet-700" />
                  Correo electrónico
                </div>
                <p className="mt-3 wrap-break-words font-bold">{user.email}</p>
              </div>
            </div>
          </section>

          <section
            id="direccion"
            className="scroll-mt-8 rounded-4xl border border-gray-200 bg-white p-6 sm:p-8"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <FaLocationDot className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-2xl font-bold">Dirección de entrega</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Puedes actualizarla aquí y la encontraremos lista cuando
                  continúes una compra.
                </p>
              </div>
            </div>

            {addressLoading ? (
              <p className="mt-7 text-sm text-gray-500">
                Cargando dirección...
              </p>
            ) : (
              <form
                className="mt-7 grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void saveAddress();
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="profile-department">Departamento</Label>
                  <Select
                    value={address.department}
                    onValueChange={(department) =>
                      setAddress((previous) => ({
                        ...previous,
                        department,
                        province: "",
                        district: "",
                      }))
                    }
                  >
                    <SelectTrigger
                      id="profile-department"
                      className="w-full rounded-2xl bg-white"
                    >
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERU_DEPARTMENTS.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="profile-province">Provincia</Label>
                    <Select
                      value={address.province}
                      disabled={!address.department}
                      onValueChange={(province) =>
                        setAddress((previous) => ({
                          ...previous,
                          province,
                          district: "",
                        }))
                      }
                    >
                      <SelectTrigger
                        id="profile-province"
                        className="w-full rounded-2xl bg-white"
                      >
                        <SelectValue placeholder="Selecciona una provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProvinces.map((province) => (
                          <SelectItem
                            key={province.name}
                            value={province.name}
                          >
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profile-district">Distrito</Label>
                    <Select
                      value={address.district}
                      disabled={!address.province}
                      onValueChange={(district) =>
                        setAddress((previous) => ({
                          ...previous,
                          district,
                        }))
                      }
                    >
                      <SelectTrigger
                        id="profile-district"
                        className="w-full rounded-2xl bg-white"
                      >
                        <SelectValue placeholder="Selecciona un distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="profile-address">Dirección</Label>
                  <input
                    id="profile-address"
                    value={address.address}
                    onChange={(event) =>
                      setAddress((previous) => ({
                        ...previous,
                        address: event.target.value,
                      }))
                    }
                    className="h-11 rounded-2xl border border-input bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="profile-reference">
                    Referencia (opcional)
                  </Label>
                  <textarea
                    id="profile-reference"
                    value={address.reference}
                    onChange={(event) =>
                      setAddress((previous) => ({
                        ...previous,
                        reference: event.target.value,
                      }))
                    }
                    rows={3}
                    className="resize-none rounded-2xl border border-input bg-white px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {addressError && (
                  <p className="text-sm text-red-600">{addressError}</p>
                )}
                {addressSaved && (
                  <p className="text-sm font-semibold text-emerald-700">
                    Dirección guardada correctamente.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    addressSaving ||
                    !address.department ||
                    !address.province.trim() ||
                    !address.district.trim() ||
                    address.address.trim().length < 5
                  }
                  className="mt-2 w-full cursor-pointer rounded-full bg-violet-700 px-7 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                >
                  {addressSaving ? "Guardando..." : "Guardar dirección"}
                </button>
              </form>
            )}
          </section>

          <section id="pedidos" className="scroll-mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Mis compras</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Historial y estado de los pedidos asociados a tu cuenta.
                </p>
              </div>
              {!loading && orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="cursor-pointer text-left text-sm font-bold text-violet-700"
                >
                  Actualizar pedidos
                </button>
              )}
            </div>

            {loading ? (
              <div className="mt-6 rounded-4xl border border-gray-200 bg-gray-50 px-6 py-14 text-center text-gray-500">
                Cargando tus pedidos...
              </div>
            ) : error ? (
              <div className="mt-6 rounded-4xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                <p className="text-sm leading-6 text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-4 cursor-pointer rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white"
                >
                  Intentar nuevamente
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="mt-6 flex flex-col items-center rounded-4xl border border-gray-200 bg-gray-50 px-6 py-14 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  <FaBoxOpen className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold">
                  Aún no tienes pedidos
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Cuando confirmes una compra desde el carrito, podrás consultar
                  aquí sus productos y su estado.
                </p>
                <Link
                  to="/productos"
                  className="mt-6 rounded-full bg-violet-700 hover:bg-violet-600 transition-colors px-7 py-3 text-sm font-bold text-white"
                >
                  Explorar productos
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {orders.map((order) => {
                  const status =
                    statusDetails[order.status] ?? statusDetails.pending;
                  return (
                    <article
                      key={order.id}
                      className="overflow-hidden rounded-4xl border border-gray-200 bg-white"
                    >
                      <header className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div>
                          <p className="text-lg font-bold">
                            Pedido #{String(order.id).padStart(5, "0")}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {dateFormatter.format(new Date(order.createdAt))}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
                          <span
                            className={`rounded-full px-4 py-2 text-xs font-bold ${status.className}`}
                          >
                            {status.label}
                          </span>
                          <p className="text-lg font-bold">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                      </header>

                      <div className="p-5 sm:p-6">
                        {order.status === "cancelled" ? (
                          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            Este pedido fue cancelado. Contáctanos si necesitas
                            más información.
                          </p>
                        ) : (
                          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                            {progressSteps.map((step, index) => (
                              <div key={step} className="min-w-0">
                                <div
                                  className={`h-2 rounded-full ${
                                    index <= status.progress
                                      ? "bg-violet-600"
                                      : "bg-gray-200"
                                  }`}
                                />
                                <p className="mt-2 truncate text-[0.58rem] font-semibold text-gray-500 min-[420px]:text-[0.65rem] sm:text-xs">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {order.deliveryAddress && (
                          <div className="mt-5 grid gap-4 rounded-3xl bg-gray-50 p-4 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
                            <div className="min-w-0">
                              <p className="font-bold">Entrega</p>
                              <p className="mt-1 leading-6 text-gray-500">
                                {order.department}, {order.province},{" "}
                                {order.district} · {order.deliveryAddress}
                              </p>
                              {order.addressReference && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Referencia: {order.addressReference}
                                </p>
                              )}
                            </div>
                            <div className="sm:text-right">
                              <p className="text-xs text-gray-500">Envío</p>
                              <p className="mt-1 font-bold">
                                {order.shippingCost === 0
                                  ? "Gratis"
                                  : formatCurrency(order.shippingCost)}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 divide-y divide-gray-100">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                            >
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-18 sm:w-18"
                                />
                              ) : (
                                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 sm:h-18 sm:w-18">
                                  <FaBoxOpen className="h-5 w-5" />
                                </span>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-bold">
                                  {item.productName}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {getProductSize(item.selectedSize).label} ·{" "}
                                  Cantidad: {item.quantity}
                                </p>
                              </div>
                              <p className="shrink-0 text-sm font-bold sm:text-base">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-5 rounded-4xl border border-zinc-200 bg-zinc-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-xl font-bold">
                ¿Necesitas ayuda con un pedido?
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Envíanos el número del pedido y te ayudaremos a revisar su
                estado.
              </p>
            </div>
            <Link
              to="/contacto"
              className="shrink-0 rounded-full bg-violet-700 hover:bg-violet-600 transition-colors px-6 py-3 text-center text-sm font-bold text-white"
            >
              Contactar
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Perfil;
