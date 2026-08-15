import { neonData } from "@/lib/neon-data";
import type { Product } from "@/data/products";
import type { ProductSize } from "@/data/product-sizes";

export const ORDER_WORKFLOW_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
] as const;

export const ORDER_STATUSES = [
  ...ORDER_WORKFLOW_STATUSES,
  "cancelled",
] as const;

export type AdminOrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  pending: "Recibido",
  confirmed: "Confirmado",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export interface AdminUser {
  userId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  banned: boolean;
  banReason: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface AdminCreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface AdminOrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  selectedSize: ProductSize;
  productName: string;
  productImage: string | null;
}

export interface AdminOrder {
  id: number;
  userId: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: AdminOrderStatus;
  createdAt: string;
  department: string;
  province: string;
  district: string;
  deliveryAddress: string;
  addressReference: string;
  items: AdminOrderItem[];
}

interface DBAdminUser {
  user_id: string;
  name: string;
  email: string;
  email_verified: boolean;
  banned: boolean;
  ban_reason: string | null;
  created_at: string;
  order_count: number | string;
  total_spent: number | string;
}

interface DBOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number | string;
  selected_size: ProductSize | null;
  products: { name: string; image: string | null } | { name: string; image: string | null }[] | null;
}

interface DBAdminOrder {
  id: number;
  user_id: string;
  subtotal: number | string;
  shipping_cost: number | string;
  total: number | string;
  status: AdminOrderStatus | null;
  created_at: string;
  department: string | null;
  province: string | null;
  district: string | null;
  delivery_address: string | null;
  address_reference: string | null;
  order_items: DBOrderItem[] | null;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await neonData.rpc("admin_list_users");
  if (error) throw error;
  return ((data ?? []) as DBAdminUser[]).map((user) => ({
    userId: user.user_id,
    name: user.name,
    email: user.email,
    emailVerified: user.email_verified,
    banned: user.banned,
    banReason: user.ban_reason,
    createdAt: user.created_at,
    orderCount: Number(user.order_count),
    totalSpent: Number(user.total_spent),
  }));
}

export async function setUserBan(userId: string, banned: boolean, reason?: string) {
  const { error } = await neonData.rpc("admin_set_user_ban", {
    p_user_id: userId,
    p_banned: banned,
    p_reason: reason ?? null,
  });
  if (error) throw error;
}

export async function createAdminAuthUser({ name, email, password }: AdminCreateUserInput) {
  const authUrl = String(import.meta.env.VITE_NEON_AUTH_URL ?? "").replace(/\/$/, "");
  if (!authUrl) throw new Error("Falta configurar VITE_NEON_AUTH_URL.");

  const response = await fetch(`${authUrl}/sign-up/email`, {
    method: "POST",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      callbackURL: window.location.origin,
    }),
  });

  const body = await response.json().catch(() => null) as {
    message?: string;
    error?: string;
    code?: string;
  } | null;

  if (!response.ok) {
    const message = body?.message ?? body?.error ?? "No se pudo crear el usuario.";
    throw new Error(message);
  }
}

export async function getAdminOrders(users: AdminUser[]): Promise<AdminOrder[]> {
  const { data, error } = await neonData
    .from("orders")
    .select("id,user_id,subtotal,shipping_cost,total,status,created_at,department,province,district,delivery_address,address_reference,order_items(id,product_id,quantity,price,selected_size,products(name,image))")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const userMap = new Map(users.map((user) => [user.userId, user]));
  return ((data ?? []) as DBAdminOrder[]).map((order) => {
    const customer = userMap.get(order.user_id);
    return {
      id: order.id,
      userId: order.user_id,
      customerName: customer?.name ?? "Cliente",
      customerEmail: customer?.email ?? "",
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shipping_cost),
      total: Number(order.total),
      status: order.status ?? "pending",
      createdAt: order.created_at,
      department: order.department ?? "",
      province: order.province ?? "",
      district: order.district ?? "",
      deliveryAddress: order.delivery_address ?? "",
      addressReference: order.address_reference ?? "",
      items: (order.order_items ?? []).map((item) => {
        const product = Array.isArray(item.products) ? item.products[0] : item.products;
        return {
          id: item.id,
          productId: item.product_id,
          quantity: item.quantity,
          price: Number(item.price),
          selectedSize: item.selected_size ?? "pequeno",
          productName: product?.name ?? "Producto eliminado",
          productImage: product?.image ?? null,
        };
      }),
    };
  });
}

export async function updateOrderStatus(orderId: number, status: AdminOrderStatus) {
  const { error } = await neonData.rpc("admin_update_order_status", {
    p_order_id: orderId,
    p_status: status,
  });
  if (error) throw error;
}

export type ProductInput = Omit<Product, "id">;

function productPayload(product: ProductInput) {
  return {
    name: product.name.trim(),
    image: product.image.trim(),
    gallery_images: (product.galleryImages ?? [])
      .map((image) => image.trim())
      .filter(Boolean)
      .slice(0, 4),
    desc: product.desc.trim(),
    price: product.price,
    popular: product.popular,
    category: product.category.trim(),
    on_sale: product.onSale,
    is_new: product.isNew,
    rating: product.rating,
    reviews: product.reviews,
    tamano: product.tamano,
    material: product.material.trim(),
    instrucciones_cuidado: product.instruccionesCuidado.trim(),
    dias_entrega: product.diasEntrega,
    artesanal: product.artesanal,
    stock: product.stock,
    peso: product.peso,
    is_featured_month: product.isFeaturedMonth ?? false,
    is_active: product.isActive ?? true,
    updated_at: new Date().toISOString(),
  };
}

export async function createProduct(product: ProductInput) {
  const { error } = await neonData.from("products").insert(productPayload(product));
  if (error) throw error;
}

export async function updateProduct(id: number, product: ProductInput) {
  const { error } = await neonData.from("products").update(productPayload(product)).eq("id", id);
  if (error) throw error;
}

export async function archiveProduct(id: number, active: boolean) {
  const { error } = await neonData
    .from("products")
    .update({ is_active: active, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

interface DBProduct {
  id: number;
  name: string;
  image: string;
  gallery_images?: string[] | null;
  desc: string;
  price: number | string;
  popular: boolean;
  category: string;
  on_sale: boolean;
  is_new: boolean;
  rating: number;
  reviews: number;
  tamano: string;
  material: string;
  instrucciones_cuidado: string;
  dias_entrega: number;
  artesanal: boolean;
  stock: number;
  peso: number;
  is_featured_month: boolean;
  is_active: boolean;
}

export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await neonData.from("products").select("*").order("id");
  if (error) throw error;
  return ((data ?? []) as DBProduct[]).map((product) => ({
    id: product.id,
    name: product.name,
    image: product.image,
    galleryImages: product.gallery_images ?? [],
    desc: product.desc,
    price: Number(product.price),
    popular: product.popular,
    category: product.category,
    onSale: product.on_sale,
    isNew: product.is_new,
    rating: Number(product.rating),
    reviews: Number(product.reviews),
    tamano: product.tamano,
    material: product.material,
    instruccionesCuidado: product.instrucciones_cuidado,
    diasEntrega: Number(product.dias_entrega),
    artesanal: product.artesanal,
    stock: Number(product.stock),
    peso: Number(product.peso),
    isFeaturedMonth: product.is_featured_month,
    isActive: product.is_active,
  }));
}
