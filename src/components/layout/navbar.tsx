import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiArrowLeft,
  FiChevronDown,
  FiLoader,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiSettings,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import LoginModal from "../auth/login";
import RegisterModal from "../auth/register";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { FaTrashAlt } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createOrder } from "@/lib/orders";
import { getProductSize } from "@/data/product-sizes";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PERU_DEPARTMENTS,
  getDistricts,
  getProvinces,
  getShippingCost,
} from "@/data/peru-locations";
import { useDeliveryAddress } from "@/hooks/use-delivery-address";

const menuItems = [
  { label: "Inicio", path: "/" },
  { label: "Productos", path: "/productos" },
  { label: "Promociones", path: "/promociones" },
  { label: "Acerca", path: "/acerca" },
  { label: "Contactame", path: "/contacto" },
];

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "delivery">("cart");
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
  const [openDeliverySelect, setOpenDeliverySelect] = useState<
    "department" | "province" | "district" | null
  >(null);
  const { items, addItem, removeItem, clearCart, totalItems } = useCart();
  const { products } = useProducts();
  const { user, loading, isAdmin, logout } = useAuth();
  const {
    address,
    setAddress,
    loading: addressLoading,
  } = useDeliveryAddress(user?.id);

  const cartTotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    const size = getProductSize(item.selectedSize);
    return sum + ((product?.price || 0) + size.priceMod) * item.quantity;
  }, 0);

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() ?? "?";
  const shippingCost = address.department
    ? getShippingCost(address.department)
    : 0;
  const availableProvinces = getProvinces(address.department);
  const availableDistricts = getDistricts(address.department, address.province);
  const orderTotal = cartTotal + shippingCost;
  const isAddressComplete =
    Boolean(address.department) &&
    Boolean(address.province.trim()) &&
    Boolean(address.district.trim()) &&
    address.address.trim().length >= 5;

  const closeCart = () => {
    setIsCartOpen(false);
    setCheckoutStep("cart");
    setPurchaseConfirmed(false);
    setOpenDeliverySelect(null);
    setCartError(null);
  };

  useEffect(() => {
    if (!isCartOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openDeliverySelect) {
        setOpenDeliverySelect(null);
      } else {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isCartOpen, openDeliverySelect]);

  const handleContinueCheckout = () => {
    setCartError(null);
    if (!user) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
      return;
    }
    setCheckoutStep("delivery");
  };

  const handleCheckout = async () => {
    setCartError(null);

    if (!user) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
      return;
    }

    if (!isAddressComplete || !purchaseConfirmed) {
      setCartError(
        "Completa la dirección y confirma que deseas realizar la compra.",
      );
      return;
    }

    const lines = items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      const size = getProductSize(item.selectedSize);
      const unitPrice = (product?.price || 0) + size.priceMod;
      return `- ${product?.name} · ${size.label} x${item.quantity} (S/. ${unitPrice * item.quantity})`;
    });
    setIsCreatingOrder(true);
    try {
      const orderId = await createOrder(
        items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
        })),
        address,
      );

      const referenceLine = address.reference
        ? `\nReferencia: ${address.reference}`
        : "";
      const message = `Hola, quiero confirmar mi compra:\n\n${lines.join(
        "\n",
      )}\n\nEntrega: ${address.department}, ${address.province}, ${
        address.district
      }\nDirección: ${address.address}${referenceLine}\n\nSubtotal: S/. ${
        cartTotal
      }\nEnvío: ${shippingCost === 0 ? "Gratis" : `S/. ${shippingCost}`}\nTotal: S/. ${
        orderTotal
      }\nPedido web: #${String(orderId).padStart(5, "0")}`;
      const whatsappUrl = `https://wa.me/521234567890?text=${encodeURIComponent(
        message,
      )}`;

      clearCart();
      setPurchaseConfirmed(false);
      setCheckoutStep("cart");
      setIsCartOpen(false);
      window.location.assign(whatsappUrl);
    } catch (cause) {
      console.warn("No se pudo registrar el pedido en Neon", cause);
      setCartError(
        "No pudimos crear la compra en tu historial. Revisa la configuración de Neon e inténtalo nuevamente.",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <nav className="relative z-50 mx-auto mt-5 w-full max-w-5xl px-4">
      <div className="relative z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-monoton text-xl font-medium text-gray-900 sm:text-2xl">
            Bearys
          </span>
        </div>
        <div className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-gray-900 underline underline-offset-4"
                        : "text-gray-600 hover:text-gray-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-5 sm:gap-7">
          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Abrir menú de mi cuenta"
                  className="flex cursor-pointer items-center gap-2 rounded-full outline-0"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                    {firstLetter}
                  </span>
                  <span className="hidden max-w-24 truncate text-sm font-semibold sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                  <FiChevronDown className="hidden h-3.5 w-3.5 text-gray-500 sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="truncate font-bold text-gray-900">
                    {user.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-normal text-gray-500">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/perfil">
                    <FiUser />
                    Mi cuenta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/perfil#pedidos">
                    <FiPackage />
                    Mis pedidos
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <FiSettings />
                      Panel administrativo
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => void logout()}
                >
                  <FiLogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              type="button"
              aria-label="Iniciar sesión"
              onClick={() => setIsLoginOpen(true)}
              className="cursor-pointer"
            >
              <FiUser className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            aria-label="Abrir carrito"
            onClick={() => setIsCartOpen(true)}
            className="cursor-pointer relative"
          >
            <FiShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {isCartOpen && (
            <div className="fixed inset-0 z-100">
              <button
                type="button"
                aria-label="Cerrar carrito"
                onPointerDown={(event) => {
                  if (openDeliverySelect) {
                    event.preventDefault();
                    setOpenDeliverySelect(null);
                    return;
                  }
                  closeCart();
                }}
                className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-xs animate-in fade-in-0"
              />
              <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-drawer-title"
                className="fixed inset-y-0 right-0 z-10 flex w-full flex-col rounded-l-4xl border-l bg-popover text-sm text-popover-foreground shadow-lg animate-in fade-in-0 slide-in-from-right-10 max-w-xs sm:max-w-md"
              >
                <div className="flex items-center justify-between gap-4 p-6">
                  <h2 id="cart-drawer-title" className="text-lg font-bold">
                    {checkoutStep === "cart"
                      ? `Mi Carrito (${totalItems} ${
                          totalItems === 1 ? "producto" : "productos"
                        })`
                      : "Datos de entrega"}
                  </h2>
                  <button
                    type="button"
                    aria-label="Cerrar carrito"
                    onClick={closeCart}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-12">
                      Tu carrito está vacío
                    </p>
                  ) : checkoutStep === "delivery" ? (
                    <div className="flex flex-col gap-5 pb-6">
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutStep("cart");
                          setCartError(null);
                        }}
                        className="flex w-fit cursor-pointer items-center gap-2 text-sm font-bold text-gray-600"
                      >
                        <FiArrowLeft className="h-4 w-4" />
                        Volver al carrito
                      </button>

                      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4">
                        <div className="flex items-center gap-2 font-bold">
                          <FiMapPin className="h-4 w-4 text-violet-700" />
                          Dirección de entrega
                        </div>
                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          Guardaremos estos datos en tu cuenta para tu siguiente
                          compra.
                        </p>
                      </div>

                      {addressLoading ? (
                        <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                          <FiLoader className="h-4 w-4 animate-spin" />
                          Cargando tu dirección...
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="checkout-department">
                              Departamento
                            </Label>
                            <Select
                              open={openDeliverySelect === "department"}
                              value={address.department}
                              onOpenChange={(open) =>
                                setOpenDeliverySelect(
                                  open ? "department" : null,
                                )
                              }
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
                                id="checkout-department"
                                className="w-full rounded-2xl bg-white"
                              >
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent className="z-120">
                                {PERU_DEPARTMENTS.map((department) => (
                                  <SelectItem
                                    key={department}
                                    value={department}
                                  >
                                    {department}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                              <Label htmlFor="checkout-province">
                                Provincia
                              </Label>
                              <Select
                                open={openDeliverySelect === "province"}
                                value={address.province}
                                disabled={!address.department}
                                onOpenChange={(open) =>
                                  setOpenDeliverySelect(
                                    open ? "province" : null,
                                  )
                                }
                                onValueChange={(province) =>
                                  setAddress((previous) => ({
                                    ...previous,
                                    province,
                                    district: "",
                                  }))
                                }
                              >
                                <SelectTrigger
                                  id="checkout-province"
                                  className="w-full rounded-2xl bg-white"
                                >
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="z-120">
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
                              <Label htmlFor="checkout-district">
                                Distrito
                              </Label>
                              <Select
                                open={openDeliverySelect === "district"}
                                value={address.district}
                                disabled={!address.province}
                                onOpenChange={(open) =>
                                  setOpenDeliverySelect(
                                    open ? "district" : null,
                                  )
                                }
                                onValueChange={(district) =>
                                  setAddress((previous) => ({
                                    ...previous,
                                    district,
                                  }))
                                }
                              >
                                <SelectTrigger
                                  id="checkout-district"
                                  className="w-full rounded-2xl bg-white"
                                >
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent className="z-120">
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
                            <Label htmlFor="checkout-address">Dirección</Label>
                            <input
                              id="checkout-address"
                              value={address.address}
                              onChange={(event) =>
                                setAddress((previous) => ({
                                  ...previous,
                                  address: event.target.value,
                                }))
                              }
                              placeholder="Avenida, calle y número"
                              className="h-10 rounded-2xl border border-input bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="checkout-reference">
                              Referencia (opcional)
                            </Label>
                            <textarea
                              id="checkout-reference"
                              value={address.reference}
                              onChange={(event) =>
                                setAddress((previous) => ({
                                  ...previous,
                                  reference: event.target.value,
                                }))
                              }
                              placeholder="Ej. Frente al parque"
                              rows={3}
                              className="resize-none rounded-2xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          </div>

                          <div className="rounded-3xl bg-gray-50 p-4 text-sm">
                            <div className="flex justify-between gap-4 text-gray-500">
                              <span>Subtotal</span>
                              <span>S/. {cartTotal}</span>
                            </div>
                            <div className="mt-2 flex justify-between gap-4 text-gray-500">
                              <span>Envío</span>
                              <span>
                                {!address.department
                                  ? "Por calcular"
                                  : shippingCost === 0
                                    ? "Gratis"
                                    : `S/. ${shippingCost}`}
                              </span>
                            </div>
                            <div className="mt-3 flex justify-between gap-4 border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                              <span>Total</span>
                              <span>S/. {orderTotal}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {items.map((item) => {
                        const product = products.find(
                          (p) => p.id === item.productId,
                        );
                        if (!product) return null;
                        return (
                          <div
                            key={`${item.productId}-${item.selectedSize}`}
                            className="flex gap-2 border-b border-gray-100 py-3 sm:gap-4"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
                            />
                            <div className="flex min-w-0 flex-1 flex-col justify-between">
                              <div>
                                <p className="truncate text-sm font-semibold">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {getProductSize(item.selectedSize).label} ·
                                  S/.{" "}
                                  {product.price +
                                    getProductSize(item.selectedSize).priceMod}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <button
                                    onClick={() =>
                                      removeItem(
                                        item.productId,
                                        item.selectedSize,
                                      )
                                    }
                                    disabled={item.quantity === 1}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer ${
                                      item.quantity === 1
                                        ? "bg-indigo-200 text-white cursor-not-allowed"
                                        : "bg-indigo-400 hover:bg-indigo-500 text-white"
                                    }`}
                                  >
                                    -
                                  </button>
                                  <span className="flex h-7 w-9 items-center justify-center rounded-xl bg-gray-200 text-center font-semibold sm:w-12">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      addItem(item.productId, item.selectedSize)
                                    }
                                    className="w-7 h-7 bg-indigo-400 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                                <p className="whitespace-nowrap text-xs font-bold sm:text-sm">
                                  S/.{" "}
                                  {(product.price +
                                    getProductSize(item.selectedSize)
                                      .priceMod) *
                                    item.quantity}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                for (let i = 0; i < item.quantity; i++) {
                                  removeItem(item.productId, item.selectedSize);
                                }
                              }}
                              className="text-red-500 hover:text-red-600 cursor-pointer self-start mt-1"
                            >
                              <FaTrashAlt className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-auto flex flex-col gap-2 p-6">
                  {items.length > 0 && (
                    <div className="flex w-full flex-col gap-4">
                      {cartError && (
                        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                          {cartError}
                        </p>
                      )}

                      {checkoutStep === "cart" ? (
                        <>
                          <div className="flex w-full justify-end">
                            <button
                              type="button"
                              onClick={clearCart}
                              className="cursor-pointer rounded-full px-4 py-2 text-sm text-red-500 outline-1 outline-red-500 hover:text-red-600"
                            >
                              Vaciar carrito
                            </button>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-4 text-xl font-bold">
                            <span>Total</span>
                            <span>S/. {cartTotal}</span>
                          </div>
                          <Button
                            type="button"
                            onClick={handleContinueCheckout}
                            className="w-full cursor-pointer rounded-full bg-blue-600 py-6 text-base font-semibold text-white hover:bg-blue-700"
                          >
                            Continuar compra
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-start gap-3 rounded-3xl border border-gray-200 p-4">
                            <Checkbox
                              id="confirm-purchase"
                              checked={purchaseConfirmed}
                              onCheckedChange={(checked) =>
                                setPurchaseConfirmed(checked === true)
                              }
                              className="mt-0.5"
                            />
                            <Label
                              htmlFor="confirm-purchase"
                              className="cursor-pointer text-sm font-normal leading-5"
                            >
                              Estoy seguro de realizar esta compra y autorizo
                              que se cree en mi historial.
                            </Label>
                          </div>
                          <Button
                            type="button"
                            onClick={() => void handleCheckout()}
                            disabled={
                              isCreatingOrder ||
                              addressLoading ||
                              !isAddressComplete ||
                              !purchaseConfirmed
                            }
                            className="w-full cursor-pointer rounded-full bg-blue-600 py-6 text-base font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed"
                          >
                            {isCreatingOrder ? (
                              <span className="flex items-center gap-2">
                                <FiLoader className="h-4 w-4 animate-spin" />
                                Generando compra...
                              </span>
                            ) : (
                              "Realizar compra"
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </aside>
            </div>
          )}
          <button
            type="button"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="cursor-pointer lg:hidden"
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-black/20 backdrop-blur-[2px] animate-in fade-in-0 lg:hidden"
          />
          <ul className="absolute left-4 right-4 top-[calc(100%+0.75rem)] z-50 flex flex-col rounded-4xl border border-border bg-white p-3 shadow-2xl animate-in fade-in-0 slide-in-from-top-2 duration-200 sm:left-6 sm:right-6 lg:hidden">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm font-medium ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-600"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      )}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </nav>
  );
}

export default Navbar;
