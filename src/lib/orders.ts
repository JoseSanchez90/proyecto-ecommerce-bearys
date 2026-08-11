import { neonData } from "@/lib/neon-data";
import type { ProductSize } from "@/data/product-sizes";
import type { DeliveryAddress } from "@/lib/delivery-address";

export interface CreateOrderItem {
  productId: number;
  quantity: number;
  selectedSize: ProductSize;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  productName: string;
  productImage: string | null;
  selectedSize: ProductSize;
}

export interface Order {
  id: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  createdAt: string;
  department: string;
  province: string;
  district: string;
  deliveryAddress: string;
  addressReference: string;
  items: OrderItem[];
}

interface DBProductRelation {
  name: string;
  image: string;
}

interface DBOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number | string;
  selected_size: ProductSize | null;
  products: DBProductRelation | DBProductRelation[] | null;
}

interface DBOrder {
  id: number;
  subtotal: number | string | null;
  shipping_cost: number | string | null;
  total: number | string;
  status: string | null;
  created_at: string;
  department: string | null;
  province: string | null;
  district: string | null;
  delivery_address: string | null;
  address_reference: string | null;
  order_items: DBOrderItem[] | null;
}

function getProduct(relation: DBOrderItem["products"]) {
  return Array.isArray(relation) ? relation[0] : relation;
}

function mapOrder(order: DBOrder): Order {
  return {
    id: order.id,
    subtotal: Number(order.subtotal ?? order.total),
    shippingCost: Number(order.shipping_cost ?? 0),
    total: Number(order.total),
    status: order.status ?? "pending",
    createdAt: order.created_at,
    department: order.department ?? "",
    province: order.province ?? "",
    district: order.district ?? "",
    deliveryAddress: order.delivery_address ?? "",
    addressReference: order.address_reference ?? "",
    items: (order.order_items ?? []).map((item) => {
      const product = getProduct(item.products);
      return {
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),
        productName: product?.name ?? "Producto",
        productImage: product?.image ?? null,
        selectedSize: item.selected_size ?? "pequeno",
      };
    }),
  };
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await neonData
    .from("orders")
    .select(
      "id,subtotal,shipping_cost,total,status,created_at,department,province,district,delivery_address,address_reference,order_items(id,product_id,quantity,price,selected_size,products(name,image))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DBOrder[]).map(mapOrder);
}

export async function createOrder(
  items: CreateOrderItem[],
  address: DeliveryAddress,
): Promise<number> {
  const payload = items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
    selected_size: item.selectedSize,
  }));

  const { data, error } = await neonData.rpc("create_order", {
    p_items: payload,
    p_department: address.department.trim(),
    p_province: address.province.trim(),
    p_district: address.district.trim(),
    p_delivery_address: address.address.trim(),
    p_address_reference: address.reference.trim() || null,
  });

  if (error) throw error;

  const orderId = Number(data);
  if (!Number.isFinite(orderId)) {
    throw new Error("Neon no devolvió el identificador del pedido");
  }

  return orderId;
}
