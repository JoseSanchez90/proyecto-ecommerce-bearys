import { neonData } from "@/lib/neon-data";

export interface DeliveryAddress {
  department: string;
  province: string;
  district: string;
  address: string;
  reference: string;
}

export const EMPTY_DELIVERY_ADDRESS: DeliveryAddress = {
  department: "",
  province: "",
  district: "",
  address: "",
  reference: "",
};

interface DBDeliveryAddress {
  department: string | null;
  province: string | null;
  district: string | null;
  delivery_address: string | null;
  address_reference: string | null;
}

function mapDeliveryAddress(value: DBDeliveryAddress): DeliveryAddress {
  return {
    department: value.department ?? "",
    province: value.province ?? "",
    district: value.district ?? "",
    address: value.delivery_address ?? "",
    reference: value.address_reference ?? "",
  };
}

export async function getDeliveryAddress(
  userId: string,
): Promise<DeliveryAddress | null> {
  const { data, error } = await neonData
    .from("user_profiles")
    .select(
      "department,province,district,delivery_address,address_reference",
    )
    .eq("user_id", userId)
    .limit(1);

  if (error) throw error;
  const value = (data as DBDeliveryAddress[] | null)?.[0];
  return value ? mapDeliveryAddress(value) : null;
}

export async function saveDeliveryAddress(address: DeliveryAddress) {
  const { error } = await neonData.rpc("save_delivery_address", {
    p_department: address.department.trim(),
    p_province: address.province.trim(),
    p_district: address.district.trim(),
    p_delivery_address: address.address.trim(),
    p_address_reference: address.reference.trim() || null,
  });

  if (error) throw error;
}
