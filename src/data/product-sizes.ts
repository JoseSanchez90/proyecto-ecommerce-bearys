export const PRODUCT_SIZES = [
  { key: "pequeno", label: "Pequeño", dims: "12-15 cm", priceMod: 0 },
  { key: "mediano", label: "Mediano", dims: "18-22 cm", priceMod: 50 },
  { key: "grande", label: "Grande", dims: "25-30 cm", priceMod: 100 },
  {
    key: "extra-grande",
    label: "Extra grande",
    dims: "35-40 cm",
    priceMod: 150,
  },
] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number]["key"];

export const DEFAULT_PRODUCT_SIZE: ProductSize = "pequeno";

export function getProductSize(size: ProductSize) {
  return (
    PRODUCT_SIZES.find((option) => option.key === size) ?? PRODUCT_SIZES[0]
  );
}
