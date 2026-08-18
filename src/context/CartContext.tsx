import { createContext, useContext, useState } from "react";
import { Product } from "../data/products";

type SelectedVariant = {
  id: string;
  type: string;
  value: string;
  stock?: number;
};

type CartItem = Product & {
  quantity: number;
  selectedVariant?: SelectedVariant;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant?: SelectedVariant) => void;
  removeFromCart: (productId: string | number, variantId?: string) => void;
  updateQuantity: (
  productId: string | number,
  variantId: string | undefined,
  quantity: number
) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, variant?: SelectedVariant) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedVariant?.id === variant?.id
      );

      if (exists) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedVariant?.id === variant?.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, selectedVariant: variant, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string | number, variantId?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === productId && item.selectedVariant?.id === variantId)
      )
    );
  };

  const updateQuantity = (
  productId: string | number,
  variantId: string | undefined,
  quantity: number
) => {
  setCart((prev) => {
    if (quantity <= 0) {
      return prev.filter(
        (item) =>
          !(item.id === productId && item.selectedVariant?.id === variantId)
      );
    }

    return prev.map((item) => {
      const isSameItem =
        item.id === productId &&
        item.selectedVariant?.id === variantId;

      if (!isSameItem) return item;

      const availableStock =
        item.selectedVariant?.stock ??
        item.stock ??
        Infinity;

      return {
        ...item,
        quantity: Math.min(quantity, availableStock),
      };
    });
  });
};

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  totalItems,
  totalPrice,
}}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}