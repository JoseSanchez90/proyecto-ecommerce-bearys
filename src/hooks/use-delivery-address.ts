import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_DELIVERY_ADDRESS,
  getDeliveryAddress,
  saveDeliveryAddress,
  type DeliveryAddress,
} from "@/lib/delivery-address";

export function useDeliveryAddress(userId?: string) {
  const [address, setAddress] = useState<DeliveryAddress>(
    EMPTY_DELIVERY_ADDRESS,
  );
  const [loading, setLoading] = useState(Boolean(userId));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!userId) {
      setAddress(EMPTY_DELIVERY_ADDRESS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    void getDeliveryAddress(userId)
      .then((savedAddress) => {
        if (!cancelled && savedAddress) setAddress(savedAddress);
      })
      .catch((cause) => {
        console.warn("No se pudo cargar la dirección guardada", cause);
        if (!cancelled) {
          setError("No pudimos cargar tu dirección guardada.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await saveDeliveryAddress(address);
      setSaved(true);
      return true;
    } catch (cause) {
      console.warn("No se pudo guardar la dirección", cause);
      setError("No pudimos guardar la dirección. Inténtalo nuevamente.");
      return false;
    } finally {
      setSaving(false);
    }
  }, [address]);

  return { address, setAddress, loading, saving, saved, error, save };
}
