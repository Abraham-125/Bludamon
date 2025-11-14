import React, { createContext, useContext, useEffect, useState } from "react";

export interface Producto {
  id: number;
  nombre: string;
  img: string;
  precio: string;
}

export interface CartItem {
  id: number;
  nombre: string;
  img: string;
  precio: string;
  cantidad: number;
  color?: string;
  talla?: string;
}

interface CartContextValue {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
  removeFromCart: (indexOrId: number) => void;
  clearCart: () => void;
  updateQuantity: (index: number, cantidad: number) => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "bludamon_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setCart(parsed);
      }
    } catch (e) {
      console.warn("Error parsing cart from localStorage", e);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Error saving cart to localStorage", e);
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, "cantidad">, cantidad = 1) => {
    // Merge like items? For simplicity treat as separate entries unless same id+color+talla
    setCart((prev) => {
      const idx = prev.findIndex(
        (p) =>
          p.id === item.id && p.color === item.color && p.talla === item.talla
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].cantidad = copy[idx].cantidad + cantidad;
        return copy;
      } else {
        return [
          ...prev,
          {
            ...item,
            cantidad,
          },
        ];
      }
    });
  };

  const removeFromCart = (indexOrId: number) => {
    // if index exists, remove by index; otherwise remove by id (first match)
    setCart((prev) => {
      if (indexOrId >= 0 && indexOrId < prev.length) {
        const copy = [...prev];
        copy.splice(indexOrId, 1);
        return copy;
      } else {
        // remove first by id
        const idx = prev.findIndex((p) => p.id === indexOrId);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (index: number, cantidad: number) => {
    if (cantidad <= 0) {
      // remove
      setCart((prev) => {
        const copy = [...prev];
        copy.splice(index, 1);
        return copy;
      });
      return;
    }
    setCart((prev) => {
      const copy = [...prev];
      if (index >= 0 && index < copy.length) {
        copy[index] = { ...copy[index], cantidad };
      }
      return copy;
    });
  };

  const getTotal = () => {
    // precio strings like "$10.000" -> try to parse digits
    return cart.reduce((sum, it) => {
      const n = Number(String(it.precio).replace(/[^0-9]/g, ""));
      return sum + (isNaN(n) ? 0 : n) * it.cantidad;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
