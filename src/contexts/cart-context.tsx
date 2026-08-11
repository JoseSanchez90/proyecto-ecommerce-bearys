import { createContext, useContext, useState, type ReactNode } from "react";
import {
  DEFAULT_PRODUCT_SIZE,
  type ProductSize,
} from "@/data/product-sizes";

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

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
