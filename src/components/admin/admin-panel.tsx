import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  FiArchive,
  FiBarChart2,
  FiCheck,
  FiChevronRight,
  FiEdit3,
  FiFileText,
  FiHome,
  FiImage,
  FiLoader,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShoppingBag,
  FiUserPlus,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/data/products";
import {
  archiveProduct,
  createAdminAuthUser,
  createProduct,
  getAdminOrders,
  getAdminProducts,
  getAdminUsers,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  setUserBan,
  updateOrderStatus,
  updateProduct,
  type AdminOrder,
  type AdminOrderStatus,
  type AdminUser,
  type ProductInput,
} from "@/lib/admin";
import {
  defaultSiteSettings,
  getSiteSettings,
  updateSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";

type Section = "resumen" | "pedidos" | "ventas" | "productos" | "contenido" | "usuarios";

const navItems: { id: Section; label: string; icon: typeof FiHome }[] = [
  { id: "resumen", label: "Resumen", icon: FiBarChart2 },
  { id: "pedidos", label: "Pedidos", icon: FiShoppingBag },
  { id: "ventas", label: "Ventas y boletas", icon: FiFileText },
  { id: "productos", label: "Productos", icon: FiPackage },
  { id: "contenido", label: "Contenido", icon: FiImage },
  { id: "usuarios", label: "Usuarios", icon: FiUsers },
];

const emptyProduct: ProductInput = {
  name: "",
  image: "",
  galleryImages: [],
  desc: "",
  price: 0,
  popular: false,
  category: "animales",
  onSale: false,
  isNew: false,
  rating: 5,
  reviews: 0,
  tamano: "mediano",
  material: "lana acrilica",
  instruccionesCuidado: "Lavado a mano con agua tibia. No usar blanqueador. Secar a la sombra.",
  diasEntrega: 7,
  artesanal: true,
  stock: 10,
  peso: 150,
  isFeaturedMonth: false,
  isActive: true,
};

const money = (value: number) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value);
const date = (value: string) => new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);

function printReceipt(order: AdminOrder) {
  const receipt = window.open("", "_blank", "width=760,height=900");
  if (!receipt) return;
  const rows = order.items.map((item) => `<tr><td>${escapeHtml(item.productName)} · ${escapeHtml(item.selectedSize)}</td><td>${item.quantity}</td><td>${money(item.price)}</td><td>${money(item.price * item.quantity)}</td></tr>`).join("");
  receipt.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Boleta interna #${order.id}</title><style>body{font-family:Arial,sans-serif;color:#171717;margin:40px}header{display:flex;justify-content:space-between;border-bottom:2px solid #7c3aed;padding-bottom:20px}h1{margin:0;color:#6d28d9}.meta{text-align:right}.notice{margin:20px 0;padding:12px;background:#f5f3ff;border-radius:12px;font-size:12px;color:#5b21b6}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{text-align:left;padding:12px;border-bottom:1px solid #ddd}th{background:#fafafa}.totals{margin-left:auto;margin-top:24px;width:280px}.totals div{display:flex;justify-content:space-between;padding:6px}.total{font-size:18px;font-weight:bold;border-top:1px solid #bbb}.address{margin-top:24px;line-height:1.6}@media print{body{margin:18mm}.no-print{display:none}}</style></head><body><header><div><h1>Bearys</h1><p>Boleta de venta interna</p></div><div class="meta"><strong>N.º ${String(order.id).padStart(6, "0")}</strong><br>${date(order.createdAt)}</div></header><div class="notice">Documento de control interno. No reemplaza un comprobante electrónico autorizado por SUNAT.</div><p><strong>Cliente:</strong> ${escapeHtml(order.customerName)}<br><strong>Correo:</strong> ${escapeHtml(order.customerEmail)}</p><table><thead><tr><th>Producto</th><th>Cant.</th><th>P. unit.</th><th>Importe</th></tr></thead><tbody>${rows}</tbody></table><div class="totals"><div><span>Subtotal</span><span>${money(order.subtotal)}</span></div><div><span>Envío</span><span>${money(order.shippingCost)}</span></div><div class="total"><span>Total</span><span>${money(order.total)}</span></div></div><div class="address"><strong>Entrega</strong><br>${escapeHtml(order.department)}, ${escapeHtml(order.province)}, ${escapeHtml(order.district)}<br>${escapeHtml(order.deliveryAddress)}${order.addressReference ? `<br>Referencia: ${escapeHtml(order.addressReference)}` : ""}</div><p class="no-print" style="margin-top:32px"><button onclick="window.print()">Imprimir / Guardar PDF</button></p></body></html>`);
  receipt.document.close();
  receipt.focus();
}

function StatusBadge({ status }: { status: AdminOrderStatus }) {
  const colors: Record<AdminOrderStatus, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    preparing: "bg-violet-50 text-violet-700",
    shipped: "bg-cyan-50 text-cyan-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${colors[status]}`}>{ORDER_STATUS_LABELS[status]}</span>;
}

function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`max-h-[92vh] w-full overflow-y-auto rounded-t-4xl bg-white p-5 shadow-2xl sm:rounded-4xl sm:p-7 ${wide ? "max-w-4xl" : "max-w-xl"}`}>
        <div className="mb-6 flex items-center justify-between gap-4"><h2 className="text-xl font-bold">{title}</h2><button type="button" onClick={onClose} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100"><FiX /></button></div>
        {children}
      </section>
    </div>
  );
}

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState<Section>("resumen");
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminOrderStatus>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null | "new">(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [loadedUsers, loadedProducts, loadedSettings] = await Promise.all([
        getAdminUsers(), getAdminProducts(), getSiteSettings(),
      ]);
      const loadedOrders = await getAdminOrders(loadedUsers);
      setUsers(loadedUsers);
      setProducts(loadedProducts);
      setSettings(loadedSettings);
      setOrders(loadedOrders);
    } catch (cause) {
      console.error(cause);
      setError("No se pudo cargar el panel. Verifica que ejecutaste neon-admin-panel.sql en la rama correcta de Neon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  const validSales = useMemo(() => orders.filter((order) => order.status !== "cancelled"), [orders]);
  const grossSales = validSales.reduce((sum, order) => sum + order.total, 0);
  const deliveredSales = orders.filter((order) => order.status === "delivered").reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => ["pending", "confirmed", "preparing"].includes(order.status)).length;
  const metrics = [
    { label: "Ventas registradas", value: money(grossSales), Icon: FiBarChart2 },
    { label: "Ventas entregadas", value: money(deliveredSales), Icon: FiCheck },
    { label: "Pedidos activos", value: String(pendingOrders), Icon: FiShoppingBag },
    { label: "Clientes", value: String(users.length), Icon: FiUsers },
  ];

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesSearch = !search || String(order.id).includes(search) || order.customerName.toLowerCase().includes(search) || order.customerEmail.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [orders, query, statusFilter]);

  const notify = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(null), 3200); };

  const handleStatus = async (order: AdminOrder, status: AdminOrderStatus) => {
    setSaving(true); setError(null);
    try {
      await updateOrderStatus(order.id, status);
      setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status } : item));
      setSelectedOrder((current) => current?.id === order.id ? { ...current, status } : current);
      notify(`Pedido #${order.id} actualizado.`);
    } catch { setError("No se pudo actualizar el pedido."); }
    finally { setSaving(false); }
  };

  const handleArchive = async (product: Product) => {
    setSaving(true); setError(null);
    try {
      const active = product.isActive === false;
      await archiveProduct(product.id, active);
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, isActive: active } : item));
      notify(active ? "Producto restaurado." : "Producto retirado del catálogo sin borrar su historial.");
    } catch { setError("No se pudo cambiar la disponibilidad del producto."); }
    finally { setSaving(false); }
  };

  const handleFeatured = async (product: Product) => {
    setSaving(true);
    try {
      const updated = { ...product, isFeaturedMonth: !product.isFeaturedMonth };
      const { id: _id, ...payload } = updated;
      await updateProduct(product.id, payload);
      setProducts((current) => current.map((item) => item.id === product.id ? updated : item));
    } catch { setError("No se pudo actualizar Productos del mes."); }
    finally { setSaving(false); }
  };

  const handleBan = async (account: AdminUser) => {
    setSaving(true);
    try {
      await setUserBan(account.userId, !account.banned, account.banned ? undefined : "Bloqueado desde el panel administrativo");
      setUsers((current) => current.map((item) => item.userId === account.userId ? { ...item, banned: !item.banned } : item));
      notify(account.banned ? "Usuario habilitado." : "Usuario bloqueado.");
    } catch { setError("No se pudo actualizar el usuario."); }
    finally { setSaving(false); }
  };

  const renderOrders = (salesOnly = false) => {
    const source = salesOnly ? filteredOrders.filter((order) => order.status !== "cancelled") : filteredOrders;
    return (
      <div className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por pedido, cliente o correo" className="h-11 w-full rounded-full border bg-white pl-11 pr-4 text-sm outline-none focus:border-violet-400" /></label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | AdminOrderStatus)} className="h-11 rounded-full border bg-white px-4 text-sm outline-none"><option value="all">Todos los estados</option>{ORDER_STATUSES.map((status) => <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>)}</select>
        </div>
        <div className="overflow-hidden rounded-3xl border bg-white">
          <div className="hidden grid-cols-[90px_1.3fr_1fr_130px_120px_44px] gap-4 border-b bg-gray-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 lg:grid"><span>Pedido</span><span>Cliente</span><span>Fecha</span><span>Estado</span><span>Total</span><span /></div>
          {source.length === 0 ? <p className="p-10 text-center text-sm text-gray-500">No hay resultados.</p> : source.map((order) => (
            <button key={order.id} type="button" onClick={() => setSelectedOrder(order)} className="grid w-full cursor-pointer gap-3 border-b px-5 py-4 text-left last:border-0 hover:bg-violet-50/40 lg:grid-cols-[90px_1.3fr_1fr_130px_120px_44px] lg:items-center lg:gap-4">
              <strong>#{String(order.id).padStart(5, "0")}</strong>
              <span className="min-w-0"><span className="block truncate font-semibold">{order.customerName}</span><span className="block truncate text-xs text-gray-500">{order.customerEmail}</span></span>
              <span className="text-sm text-gray-500">{date(order.createdAt)}</span>
              <span><StatusBadge status={order.status} /></span>
              <strong>{money(order.total)}</strong>
              <FiChevronRight className="hidden text-gray-400 lg:block" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f7fb] text-gray-950">
      <aside className={`fixed inset-y-0 left-0 z-80 flex w-72 flex-col border-r border-violet-100 bg-white p-5 transition-transform lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between"><span className="font-monoton text-xl">Bearys</span><button className="rounded-full p-2 lg:hidden" onClick={() => setMenuOpen(false)}><FiX /></button></div>
        <div className="mt-8 rounded-3xl bg-violet-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-violet-600">Propietario</p><p className="mt-1 truncate font-semibold">{user?.name}</p><p className="truncate text-xs text-gray-500">{user?.email}</p></div>
        <nav className="mt-7 grid gap-1">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => { setSection(item.id); setMenuOpen(false); setQuery(""); setStatusFilter("all"); }} className={`flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${section === item.id ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-violet-50"}`}><Icon />{item.label}</button>; })}</nav>
        <div className="mt-auto grid gap-2"><Link to="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"><FiHome /> Ver tienda</Link><button onClick={() => void logout()} className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"><FiLogOut /> Cerrar sesión</button></div>
      </aside>
      {menuOpen && <button className="fixed inset-0 z-70 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)} />}

      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-50 flex h-18 items-center justify-between border-b border-violet-100 bg-white/90 px-4 backdrop-blur-md sm:px-7 lg:px-10"><div className="flex items-center gap-3"><button className="rounded-full border p-2.5 lg:hidden" onClick={() => setMenuOpen(true)}><FiMenu /></button><div><p className="text-xs text-gray-500">Panel administrativo</p><h1 className="text-lg font-bold">{navItems.find((item) => item.id === section)?.label}</h1></div></div><button onClick={() => void loadData()} disabled={loading} className="flex cursor-pointer items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold"><FiRefreshCw className={loading ? "animate-spin" : ""} /><span className="hidden sm:inline">Actualizar</span></button></header>
        <div className="mx-auto max-w-400 p-4 sm:p-7 lg:p-10">
          {error && <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={() => setError(null)}><FiX /></button></div>}
          {message && <div className="fixed bottom-5 right-5 z-110 flex items-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-xl"><FiCheck className="text-emerald-400" />{message}</div>}
          {loading ? <div className="flex min-h-100 items-center justify-center text-violet-600"><FiLoader className="h-7 w-7 animate-spin" /></div> : (
            <>
              {section === "resumen" && <section className="grid gap-7"><div><h2 className="text-2xl font-bold sm:text-3xl">Hola, {user?.name.split(" ")[0]}</h2><p className="mt-1 text-sm text-gray-500">Este es el estado actual de tu tienda.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, Icon }) => <article key={label} className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700"><Icon /></div><p className="mt-5 text-sm text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></article>)}</div><div><div className="mb-4 flex items-end justify-between"><div><h3 className="text-xl font-bold">Pedidos recientes</h3><p className="text-sm text-gray-500">Últimos movimientos de la tienda.</p></div><button onClick={() => setSection("pedidos")} className="text-sm font-bold text-violet-700">Ver todos</button></div>{renderOrders()}</div></section>}

              {section === "pedidos" && <section><div className="mb-6"><h2 className="text-2xl font-bold">Gestión de pedidos</h2><p className="mt-1 text-sm text-gray-500">Actualiza el avance, revisa la entrega o cancela un pedido.</p></div>{renderOrders()}</section>}

              {section === "ventas" && <section><div className="mb-6"><h2 className="text-2xl font-bold">Historial de ventas</h2><p className="mt-1 text-sm text-gray-500">Consulta las ventas y genera una boleta interna imprimible.</p></div><div className="mb-6 grid gap-4 sm:grid-cols-3"><article className="rounded-3xl border bg-white p-5"><p className="text-sm text-gray-500">Total no cancelado</p><strong className="mt-1 block text-2xl">{money(grossSales)}</strong></article><article className="rounded-3xl border bg-white p-5"><p className="text-sm text-gray-500">Ventas</p><strong className="mt-1 block text-2xl">{validSales.length}</strong></article><article className="rounded-3xl border bg-white p-5"><p className="text-sm text-gray-500">Ticket promedio</p><strong className="mt-1 block text-2xl">{money(validSales.length ? grossSales / validSales.length : 0)}</strong></article></div>{renderOrders(true)}</section>}

              {section === "productos" && <ProductsSection products={products} onEdit={setEditingProduct} onArchive={(product) => void handleArchive(product)} onFeatured={(product) => void handleFeatured(product)} disabled={saving} />}

              {section === "contenido" && <ContentSection settings={settings} setSettings={setSettings} saving={saving} onSave={async () => { setSaving(true); setError(null); try { await updateSiteSettings(settings); notify("Contenido publicado correctamente."); } catch { setError("No se pudo guardar el contenido."); } finally { setSaving(false); } }} />}

              {section === "usuarios" && <AdminUsersSection users={users} currentUserId={user?.id ?? ""} disabled={saving} onBan={(account) => void handleBan(account)} onRefresh={() => void loadData()} />}
            </>
          )}
        </div>
      </main>

      {selectedOrder && <Modal title={`Pedido #${String(selectedOrder.id).padStart(5, "0")}`} onClose={() => setSelectedOrder(null)} wide><div className="grid gap-6 lg:grid-cols-[1fr_320px]"><div><div className="grid gap-3">{selectedOrder.items.map((item) => <div key={item.id} className="flex items-center gap-4 rounded-2xl border p-3">{item.productImage ? <img src={item.productImage} alt="" className="h-14 w-14 rounded-xl object-cover" /> : <div className="h-14 w-14 rounded-xl bg-gray-100" />}<div className="min-w-0 flex-1"><p className="truncate font-semibold">{item.productName}</p><p className="text-xs text-gray-500">{item.selectedSize} · {item.quantity} unidad(es)</p></div><strong>{money(item.price * item.quantity)}</strong></div>)}</div><div className="mt-5 rounded-2xl bg-gray-50 p-4 text-sm leading-6"><strong>Entrega</strong><p>{selectedOrder.department}, {selectedOrder.province}, {selectedOrder.district}</p><p>{selectedOrder.deliveryAddress}</p>{selectedOrder.addressReference && <p className="text-gray-500">Ref.: {selectedOrder.addressReference}</p>}</div></div><aside className="rounded-3xl border border-violet-100 bg-violet-50 p-5"><p className="font-bold">{selectedOrder.customerName}</p><p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p><div className="my-5 grid gap-2 border-y border-violet-100 py-5 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{money(selectedOrder.subtotal)}</span></div><div className="flex justify-between"><span>Envío</span><span>{money(selectedOrder.shippingCost)}</span></div><div className="flex justify-between text-base font-bold"><span>Total</span><span>{money(selectedOrder.total)}</span></div></div><Label htmlFor="order-status">Estado del pedido</Label><select id="order-status" value={selectedOrder.status} disabled={saving} onChange={(event) => void handleStatus(selectedOrder, event.target.value as AdminOrderStatus)} className="mt-2 h-11 w-full rounded-full border bg-white px-4 text-sm">{ORDER_STATUSES.map((status) => <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>)}</select><Button variant="outline" onClick={() => printReceipt(selectedOrder)} className="mt-3 w-full cursor-pointer rounded-full"><FiFileText /> Generar boleta</Button>{selectedOrder.status !== "cancelled" && <Button variant="outline" onClick={() => void handleStatus(selectedOrder, "cancelled")} className="mt-3 w-full cursor-pointer rounded-full border-red-200 text-red-600 hover:bg-red-50"><FiX /> Cancelar pedido</Button>}</aside></div></Modal>}

      {editingProduct && <ProductEditorWithGallery product={editingProduct === "new" ? null : editingProduct} saving={saving} onClose={() => setEditingProduct(null)} onSave={async (payload) => { setSaving(true); setError(null); try { if (editingProduct === "new") await createProduct(payload); else await updateProduct(editingProduct.id, payload); setEditingProduct(null); notify(editingProduct === "new" ? "Producto creado." : "Producto actualizado."); const loaded = await getAdminProducts(); setProducts(loaded); } catch { setError("No se pudo guardar el producto. Revisa los campos y la migración de Neon."); } finally { setSaving(false); } }} />}
    </div>
  );
}

function ProductsSection({ products, onEdit, onArchive, onFeatured, disabled }: { products: Product[]; onEdit: (product: Product | "new") => void; onArchive: (product: Product) => void; onFeatured: (product: Product) => void; disabled: boolean }) {
  const [search, setSearch] = useState("");
  const visible = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
  return <section><div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-bold">Catálogo</h2><p className="mt-1 text-sm text-gray-500">Crea, edita, retira productos y elige los destacados del mes.</p></div><Button onClick={() => onEdit("new")} className="rounded-full bg-violet-600 hover:bg-violet-700"><FiPlus /> Nuevo producto</Button></div><label className="relative mb-5 block max-w-xl"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto" className="h-11 w-full rounded-full border bg-white pl-11 pr-4 text-sm" /></label><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{visible.map((product) => <article key={product.id} className={`overflow-hidden rounded-3xl border bg-white ${product.isActive === false ? "opacity-60" : ""}`}><img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" /><div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-bold">{product.name}</h3><p className="text-xs text-gray-500">Stock: {product.stock} · {money(product.price)}</p></div><button title="Producto del mes" disabled={disabled} onClick={() => onFeatured(product)} className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${product.isFeaturedMonth ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500"}`}>Mes</button></div><div className="mt-4 flex gap-2"><Button variant="outline" onClick={() => onEdit(product)} className="flex-1 rounded-full"><FiEdit3 /> Editar</Button><Button variant="outline" disabled={disabled} title={product.isActive === false ? "Restaurar" : "Retirar"} onClick={() => onArchive(product)} className="rounded-full"><FiArchive /></Button></div></div></article>)}</div></section>;
}

void ProductEditor;

function ProductEditorWithGallery({ product, saving, onClose, onSave }: { product: Product | null; saving: boolean; onClose: () => void; onSave: (product: ProductInput) => Promise<void> }) {
  const [form, setForm] = useState<ProductInput>(product ? (({ id: _id, ...rest }) => rest)(product) : emptyProduct);
  const gallery = Array.from({ length: 4 }, (_, index) => form.galleryImages?.[index] ?? "");
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((current) => ({ ...current, [key]: value }));
  const setGalleryImage = (index: number, value: string) => {
    const next = [...gallery];
    next[index] = value;
    set("galleryImages", next.map((image) => image.trim()).filter(Boolean));
  };
  const submit = (event: FormEvent) => { event.preventDefault(); void onSave({ ...form, galleryImages: gallery.map((image) => image.trim()).filter(Boolean) }); };

  return (
    <Modal title={product ? "Editar producto" : "Nuevo producto"} onClose={onClose} wide>
      <form onSubmit={submit} className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre"><Input value={form.name} onChange={(event) => set("name", event.target.value)} required /></Field>
          <Field label="Categoria"><Input value={form.category} onChange={(event) => set("category", event.target.value)} required /></Field>
        </div>
        <Field label="Imagen principal">
          <Input value={form.image} onChange={(event) => set("image", event.target.value)} placeholder="/imagenes/producto.webp" required />
        </Field>
        {form.image && <img src={form.image} alt="Vista previa principal" className="h-36 w-full rounded-2xl object-cover" />}

        <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
          <h3 className="font-bold text-violet-900">Galeria del detalle</h3>
          <p className="mt-1 text-xs text-violet-700">Agrega hasta 4 imagenes adicionales. La imagen principal siempre aparece primero.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {gallery.map((image, index) => (
              <div key={index} className="grid grid-cols-[72px_1fr] items-center gap-3">
                {image ? <img src={image} alt={`Imagen extra ${index + 1}`} className="h-16 w-18 rounded-2xl bg-white object-cover" /> : <div className="h-16 w-18 rounded-2xl border border-dashed border-violet-200 bg-white" />}
                <Field label={`Imagen extra ${index + 1}`}>
                  <Input value={image} onChange={(event) => setGalleryImage(index, event.target.value)} placeholder="/imagenes/producto-detalle.webp" />
                </Field>
              </div>
            ))}
          </div>
        </div>

        <Field label="Descripcion"><textarea value={form.desc} onChange={(event) => set("desc", event.target.value)} rows={3} required className="rounded-2xl border px-3 py-2 text-sm" /></Field>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <NumberField label="Precio" value={form.price} onChange={(value) => set("price", value)} min={0} />
          <NumberField label="Stock" value={form.stock} onChange={(value) => set("stock", value)} min={0} />
          <NumberField label="Peso (g)" value={form.peso} onChange={(value) => set("peso", value)} min={0} />
          <NumberField label="Entrega (dias)" value={form.diasEntrega} onChange={(value) => set("diasEntrega", value)} min={1} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tamano base">
            <select value={form.tamano} onChange={(event) => set("tamano", event.target.value)} className="h-10 rounded-2xl border bg-white px-3 text-sm">
              <option value="pequeno">Pequeno</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
              <option value="extra-grande">Extra grande</option>
            </select>
          </Field>
          <Field label="Material"><Input value={form.material} onChange={(event) => set("material", event.target.value)} /></Field>
        </div>
        <Field label="Instrucciones de cuidado"><textarea value={form.instruccionesCuidado} onChange={(event) => set("instruccionesCuidado", event.target.value)} rows={2} className="rounded-2xl border px-3 py-2 text-sm" /></Field>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Toggle label="Popular" checked={form.popular} onChange={(value) => set("popular", value)} />
          <Toggle label="En promocion" checked={form.onSale} onChange={(value) => set("onSale", value)} />
          <Toggle label="Nuevo" checked={form.isNew} onChange={(value) => set("isNew", value)} />
          <Toggle label="Producto del mes" checked={form.isFeaturedMonth ?? false} onChange={(value) => set("isFeaturedMonth", value)} />
        </div>
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-full">Cancelar</Button>
          <Button disabled={saving} className="rounded-full bg-violet-600 hover:bg-violet-700">{saving ? <FiLoader className="animate-spin" /> : <FiCheck />} Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}

function ProductEditor({ product, saving, onClose, onSave }: { product: Product | null; saving: boolean; onClose: () => void; onSave: (product: ProductInput) => Promise<void> }) {
  const [form, setForm] = useState<ProductInput>(product ? (({ id: _id, ...rest }) => rest)(product) : emptyProduct);
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => { event.preventDefault(); void onSave(form); };
  return <Modal title={product ? "Editar producto" : "Nuevo producto"} onClose={onClose} wide><form onSubmit={submit} className="grid gap-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Nombre"><Input value={form.name} onChange={(event) => set("name", event.target.value)} required /></Field><Field label="Categoría"><Input value={form.category} onChange={(event) => set("category", event.target.value)} required /></Field></div><Field label="Ruta o URL de imagen"><Input value={form.image} onChange={(event) => set("image", event.target.value)} placeholder="/imagenes/producto.webp" required /></Field>{form.image && <img src={form.image} alt="Vista previa" className="h-36 w-full rounded-2xl object-cover" />}<Field label="Descripción"><textarea value={form.desc} onChange={(event) => set("desc", event.target.value)} rows={3} required className="rounded-2xl border px-3 py-2 text-sm" /></Field><div className="grid grid-cols-2 gap-4 sm:grid-cols-4"><NumberField label="Precio" value={form.price} onChange={(value) => set("price", value)} min={0} /><NumberField label="Stock" value={form.stock} onChange={(value) => set("stock", value)} min={0} /><NumberField label="Peso (g)" value={form.peso} onChange={(value) => set("peso", value)} min={0} /><NumberField label="Entrega (días)" value={form.diasEntrega} onChange={(value) => set("diasEntrega", value)} min={1} /></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Tamaño base"><select value={form.tamano} onChange={(event) => set("tamano", event.target.value)} className="h-10 rounded-2xl border bg-white px-3 text-sm"><option value="pequeno">Pequeño</option><option value="mediano">Mediano</option><option value="grande">Grande</option><option value="extra-grande">Extra grande</option></select></Field><Field label="Material"><Input value={form.material} onChange={(event) => set("material", event.target.value)} /></Field></div><Field label="Instrucciones de cuidado"><textarea value={form.instruccionesCuidado} onChange={(event) => set("instruccionesCuidado", event.target.value)} rows={2} className="rounded-2xl border px-3 py-2 text-sm" /></Field><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Toggle label="Popular" checked={form.popular} onChange={(value) => set("popular", value)} /><Toggle label="En promoción" checked={form.onSale} onChange={(value) => set("onSale", value)} /><Toggle label="Nuevo" checked={form.isNew} onChange={(value) => set("isNew", value)} /><Toggle label="Producto del mes" checked={form.isFeaturedMonth ?? false} onChange={(value) => set("isFeaturedMonth", value)} /></div><div className="flex justify-end gap-3 border-t pt-5"><Button type="button" variant="outline" onClick={onClose} className="rounded-full">Cancelar</Button><Button disabled={saving} className="rounded-full bg-violet-600 hover:bg-violet-700">{saving ? <FiLoader className="animate-spin" /> : <FiCheck />} Guardar</Button></div></form></Modal>;
}

function ContentSection({ settings, setSettings, saving, onSave }: { settings: SiteSettings; setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>; saving: boolean; onSave: () => Promise<void> }) {
  const setArray = (key: "homeDesktopImages" | "homeMobileImages", index: number, value: string) => setSettings((current) => ({ ...current, [key]: current[key].map((item, itemIndex) => itemIndex === index ? value : item) }));
  return <section><div className="mb-6"><h2 className="text-2xl font-bold">Contenido visual</h2><p className="mt-1 text-sm text-gray-500">Actualiza rutas dentro de public o URLs HTTPS. Los cambios se muestran en la tienda.</p></div><div className="grid gap-6"><article className="rounded-3xl border bg-white p-5 sm:p-6"><h3 className="font-bold">Carrusel de inicio</h3><p className="mb-5 mt-1 text-xs text-gray-500">Tres imágenes de escritorio y sus equivalentes móviles.</p><div className="grid gap-5 lg:grid-cols-2"><div className="grid gap-3"><p className="text-sm font-semibold">Escritorio</p>{settings.homeDesktopImages.map((image, index) => <ImageInput key={`desktop-${index}`} label={`Imagen ${index + 1}`} value={image} onChange={(value) => setArray("homeDesktopImages", index, value)} />)}</div><div className="grid gap-3"><p className="text-sm font-semibold">Móvil</p>{settings.homeMobileImages.map((image, index) => <ImageInput key={`mobile-${index}`} label={`Imagen ${index + 1}`} value={image} onChange={(value) => setArray("homeMobileImages", index, value)} />)}</div></div></article><article className="rounded-3xl border bg-white p-5 sm:p-6"><h3 className="font-bold">Portadas y promoción</h3><div className="mt-5 grid gap-4 sm:grid-cols-2"><ImageInput label="Portada de Productos" value={settings.productsHeaderImage} onChange={(value) => setSettings((current) => ({ ...current, productsHeaderImage: value }))} /><ImageInput label="Promociones (escritorio)" value={settings.promotionsHeaderImage} onChange={(value) => setSettings((current) => ({ ...current, promotionsHeaderImage: value }))} /><ImageInput label="Promociones (móvil)" value={settings.promotionsMobileImage} onChange={(value) => setSettings((current) => ({ ...current, promotionsMobileImage: value }))} /><ImageInput label="Promoción de inicio" value={settings.homePromotionImage} onChange={(value) => setSettings((current) => ({ ...current, homePromotionImage: value }))} /></div><div className="mt-5 max-w-md"><Field label="La promoción termina en"><Input type="datetime-local" value={settings.promotionEndAt.slice(0, 16)} onChange={(event) => setSettings((current) => ({ ...current, promotionEndAt: new Date(event.target.value).toISOString() }))} /></Field></div></article><div className="flex justify-end"><Button disabled={saving} onClick={() => void onSave()} className="rounded-full bg-violet-600 px-7 hover:bg-violet-700">{saving ? <FiLoader className="animate-spin" /> : <FiCheck />} Publicar cambios</Button></div></div></section>;
}

function UsersSection({ users, currentUserId, disabled, onBan, onRefresh }: { users: AdminUser[]; currentUserId: string; disabled: boolean; onBan: (user: AdminUser) => void; onRefresh: () => void }) {
  const [showCreate, setShowCreate] = useState(false);
  return <section><div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-bold">Usuarios</h2><p className="mt-1 text-sm text-gray-500">Consulta clientes, compras y controla el acceso.</p></div><Button onClick={() => setShowCreate(true)} className="rounded-full bg-violet-600 hover:bg-violet-700"><FiPlus /> Crear usuario</Button></div><div className="overflow-hidden rounded-3xl border bg-white">{users.map((account) => <article key={account.userId} className="grid gap-3 border-b p-5 last:border-0 lg:grid-cols-[1.4fr_1fr_130px_130px] lg:items-center"><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate font-bold">{account.name}</p>{account.userId === currentUserId && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">TÚ</span>}</div><p className="truncate text-sm text-gray-500">{account.email}</p></div><div className="text-sm"><p>{account.orderCount} pedido(s)</p><p className="font-bold">{money(account.totalSpent)}</p></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${account.banned ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{account.banned ? "Bloqueado" : "Activo"}</span>{account.userId !== currentUserId ? <Button variant="outline" disabled={disabled} onClick={() => onBan(account)} className={`rounded-full ${account.banned ? "text-emerald-700" : "text-red-600"}`}>{account.banned ? "Habilitar" : "Bloquear"}</Button> : <span />}</article>)}</div>{showCreate && <Modal title="Crear acceso de usuario" onClose={() => setShowCreate(false)}><div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 text-sm leading-6 text-gray-700"><p className="font-bold text-violet-800">Las contraseñas no deben pasar por el navegador del panel.</p><p className="mt-2">Crea el usuario en <strong>Neon Console → Auth → Users → Create user</strong>. Luego vuelve aquí y pulsa actualizar. Aparecerá automáticamente en esta lista.</p></div><div className="mt-5 flex justify-end gap-3"><Button variant="outline" className="rounded-full" onClick={() => setShowCreate(false)}>Cerrar</Button><Button className="rounded-full bg-violet-600 hover:bg-violet-700" onClick={() => { setShowCreate(false); onRefresh(); }}><FiRefreshCw /> Ya lo creé</Button></div></Modal>}</section>;
}

void UsersSection;

function AdminUsersSection({ users, currentUserId, disabled, onBan, onRefresh }: { users: AdminUser[]; currentUserId: string; disabled: boolean; onBan: (user: AdminUser) => void; onRefresh: () => void }) {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold">Usuarios</h2>
          <p className="mt-1 text-sm text-gray-500">Consulta clientes, compras y controla el acceso.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="rounded-full bg-violet-600 hover:bg-violet-700">
          <FiPlus /> Crear usuario
        </Button>
      </div>
      <div className="overflow-hidden rounded-3xl border bg-white">
        {users.map((account) => (
          <article key={account.userId} className="grid gap-3 border-b p-5 last:border-0 lg:grid-cols-[1.4fr_1fr_130px_130px] lg:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-bold">{account.name}</p>
                {account.userId === currentUserId && <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">TÚ</span>}
              </div>
              <p className="truncate text-sm text-gray-500">{account.email}</p>
            </div>
            <div className="text-sm">
              <p>{account.orderCount} pedido(s)</p>
              <p className="font-bold">{money(account.totalSpent)}</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${account.banned ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {account.banned ? "Bloqueado" : "Activo"}
            </span>
            {account.userId !== currentUserId ? (
              <Button variant="outline" disabled={disabled} onClick={() => onBan(account)} className={`rounded-full ${account.banned ? "text-emerald-700" : "text-red-600"}`}>
                {account.banned ? "Habilitar" : "Bloquear"}
              </Button>
            ) : <span />}
          </article>
        ))}
      </div>
      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            onRefresh();
          }}
        />
      )}
    </section>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCreating(true);
    try {
      await createAdminAuthUser({ name, email, password });
      onCreated();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "No se pudo crear el usuario.";
      setError(message.includes("already") || message.includes("existe") ? "Ese correo ya existe. Usa otro correo o revisa la lista de usuarios." : message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal title="Crear usuario" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4 text-sm text-violet-900">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-violet-700">
              <FiUserPlus />
            </span>
            <div>
              <p className="font-bold">Cuenta de cliente</p>
              <p className="mt-1 text-violet-700">El usuario podra iniciar sesion con este correo y contraseña.</p>
            </div>
          </div>
        </div>
        <Field label="Nombre completo">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre del cliente" required />
        </Field>
        <Field label="Correo electronico">
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="cliente@correo.com" required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contraseña">
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimo 8 caracteres" required />
          </Field>
          <Field label="Repetir contraseña">
            <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repite la contraseña" required />
          </Field>
        </div>
        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="rounded-full" onClick={onClose} disabled={creating}>Cancelar</Button>
          <Button disabled={creating} className="rounded-full bg-violet-600 hover:bg-violet-700">
            {creating ? <FiLoader className="animate-spin" /> : <FiUserPlus />} Crear usuario
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2"><span className="text-sm font-semibold">{label}</span>{children}</label>; }
function NumberField({ label, value, onChange, min }: { label: string; value: number; onChange: (value: number) => void; min?: number }) { return <Field label={label}><Input type="number" min={min} value={value} onChange={(event) => onChange(Number(event.target.value))} required /></Field>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm font-semibold"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-violet-600" />{label}</label>; }
function ImageInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <div className="grid grid-cols-[64px_1fr] items-center gap-3"><img src={value} alt="" className="h-14 w-16 rounded-xl bg-gray-100 object-cover" /><Field label={label}><Input value={value} onChange={(event) => onChange(event.target.value)} /></Field></div>; }

