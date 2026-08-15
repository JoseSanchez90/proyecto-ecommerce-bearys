import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PRODUCT_SIZE,
  PRODUCT_SIZES,
  type ProductSize,
} from "@/data/product-sizes";

const CART_STORAGE_KEY = "bearys-cart-v1";

interface CartItem {
  productId: number;
  quantity: number;
  selectedSize: ProductSize;
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: number, selectedSize?: ProductSize) => void;
  addItems: (
    productId: number,
    quantity: number,
    selectedSize?: ProductSize,
  ) => void;
  removeItem: (productId: number, selectedSize?: ProductSize) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | null>(null);

const validProductSizes = new Set<ProductSize>(
  PRODUCT_SIZES.map(({ key }) => key),
);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;
  return (
    Number.isInteger(item.productId) &&
    Number(item.productId) > 0 &&
    Number.isInteger(item.quantity) &&
    Number(item.quantity) > 0 &&
    typeof item.selectedSize === "string" &&
    validProductSizes.has(item.selectedSize as ProductSize)
  );
}

function readStoredCart(): CartItem[] {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) return [];

    const parsedCart: unknown = JSON.parse(storedCart);
    if (!Array.isArray(parsedCart)) return [];

    return parsedCart.filter(isCartItem);
  } catch (cause) {
    console.warn("No se pudo restaurar el carrito guardado", cause);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    try {
      if (items.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    } catch (cause) {
      console.warn("No se pudo guardar el carrito", cause);
    }
  }, [items]);

  const addItem = (
    productId: number,
    selectedSize: ProductSize = DEFAULT_PRODUCT_SIZE,
  ) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === productId && item.selectedSize === selectedSize,
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { productId, quantity: 1, selectedSize }];
    });
  };

  const addItems = (
    productId: number,
    quantity: number,
    selectedSize: ProductSize = DEFAULT_PRODUCT_SIZE,
  ) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === productId && item.selectedSize === selectedSize,
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, quantity, selectedSize }];
    });
  };

  const removeItem = (
    productId: number,
    selectedSize: ProductSize = DEFAULT_PRODUCT_SIZE,
  ) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === productId && item.selectedSize === selectedSize,
      );
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.productId === productId && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        );
      }
      return prev.filter(
        (item) =>
          item.productId !== productId || item.selectedSize !== selectedSize,
      );
    });
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, addItems, removeItem, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
