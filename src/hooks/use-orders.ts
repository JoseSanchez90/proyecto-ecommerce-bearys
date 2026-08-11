import { useCallback, useEffect, useState } from "react";
import { getUserOrders, type Order } from "@/lib/orders";

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setOrders(await getUserOrders(userId));
    } catch (cause) {
      console.warn("No se pudo cargar el historial de pedidos", cause);
      setError(
        "No pudimos cargar tus pedidos. Revisa la configuración de Neon e inténtalo nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return { orders, loading, error, refetch: loadOrders };
}
