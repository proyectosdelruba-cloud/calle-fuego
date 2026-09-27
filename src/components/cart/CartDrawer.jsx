"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CheckoutStepper from "./CheckoutStepper";

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    items,
    totalPrice,
    totalCount,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!isCartOpen) {
      const timeout = setTimeout(() => setCheckingOut(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-char shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-display text-2xl text-foreground">
                {checkingOut ? "Finalizar pedido" : "Tu pedido"}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="text-foreground/70 transition-colors hover:text-fire-500"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AnimatePresence mode="wait">
                {checkingOut ? (
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <button
                      type="button"
                      onClick={() => setCheckingOut(false)}
                      className="mb-4 text-sm text-foreground/60 transition-colors hover:text-fire-500"
                    >
                      ← Volver al carrito
                    </button>
                    <CheckoutStepper onClose={closeCart} />
                  </motion.div>
                ) : items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center text-foreground/60"
                  >
                    <ShoppingBag size={40} className="text-foreground/30" />
                    <p>Tu carrito está vacío.</p>
                    <p className="text-sm">Añade alguna smashburger para empezar.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="items"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4"
                  >
                    {items.map((item) => (
                      <div key={item.key} className="flex gap-3 border-b border-white/5 pb-4">
                        <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg bg-white/5">
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {item.product.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.key)}
                              aria-label="Eliminar producto"
                              className="text-foreground/40 transition-colors hover:text-fire-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => decrementItem(item.key)}
                                aria-label="Quitar una unidad"
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-foreground/70 transition-colors hover:border-fire-500 hover:text-fire-500"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-4 text-center text-sm text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => incrementItem(item.key)}
                                aria-label="Añadir una unidad"
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-foreground/70 transition-colors hover:border-fire-500 hover:text-fire-500"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-fire-500">
                              {(item.product.price * item.quantity).toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!checkingOut && items.length > 0 && (
              <div className="border-t border-white/10 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-body text-foreground/70">Total</span>
                  <span className="font-display text-2xl text-fire-500">
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckingOut(true)}
                  className="w-full rounded-full bg-fire-500 py-3 font-semibold text-background transition-transform hover:scale-[1.01]"
                >
                  Continuar ({totalCount})
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}