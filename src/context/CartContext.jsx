"use client";

import { createContext, useContext, useMemo, useReducer, useState } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, isCombo } = action.payload;
      const key = `${product.id}-${isCombo ? "combo" : "solo"}`;
      const existing = state.items[key];
      const quantity = (existing?.quantity ?? 0) + 1;
      return {
        items: {
          ...state.items,
          [key]: { product, isCombo, quantity },
        },
      };
    }
    case "INCREMENT_ITEM": {
      const { key } = action.payload;
      const existing = state.items[key];
      if (!existing) return state;
      return {
        items: {
          ...state.items,
          [key]: { ...existing, quantity: existing.quantity + 1 },
        },
      };
    }
    case "DECREMENT_ITEM": {
      const { key } = action.payload;
      const existing = state.items[key];
      if (!existing) return state;
      if (existing.quantity <= 1) {
        const next = { ...state.items };
        delete next[key];
        return { items: next };
      }
      return {
        items: {
          ...state.items,
          [key]: { ...existing, quantity: existing.quantity - 1 },
        },
      };
    }
    case "REMOVE_ITEM": {
      const { key } = action.payload;
      const next = { ...state.items };
      delete next[key];
      return { items: next };
    }
    case "CLEAR_CART":
      return { items: {} };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: {} });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const value = useMemo(() => {
    const itemList = Object.entries(state.items).map(([key, item]) => ({ key, ...item }));
    const totalCount = itemList.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = itemList.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return {
      items: itemList,
      totalCount,
      totalPrice,
      addItem: (product, isCombo = false) =>
        dispatch({ type: "ADD_ITEM", payload: { product, isCombo } }),
      incrementItem: (key) => dispatch({ type: "INCREMENT_ITEM", payload: { key } }),
      decrementItem: (key) => dispatch({ type: "DECREMENT_ITEM", payload: { key } }),
      removeItem: (key) => dispatch({ type: "REMOVE_ITEM", payload: { key } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      toggleCart: () => setIsCartOpen((v) => !v),
    };
  }, [state, isCartOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de un <CartProvider>");
  }
  return ctx;
}