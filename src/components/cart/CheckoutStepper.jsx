"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Stepper, { Step } from "@/components/ui/Stepper";
import { useCart } from "@/context/CartContext";

const DELIVERY_OPTIONS = [
  {
    value: "pickup",
    label: "Recoger en local",
    description: "Pasas por Calle Fuego cuando esté listo.",
  },
  {
    value: "dine_in",
    label: "Comer aquí",
    description: "Te lo servimos en mesa.",
  },
];

export default function CheckoutStepper({ onClose }) {
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [customer, setCustomer] = useState({ name: "", phone: "", notes: "" });
  const [orderNumber, setOrderNumber] = useState(null);

  const canContinueStep2 = customer.name.trim().length > 1 && customer.phone.trim().length > 5;
  const isNextDisabled = currentStep === 2 && !canContinueStep2;

  const deliveryLabel = useMemo(
    () => DELIVERY_OPTIONS.find((option) => option.value === deliveryMethod)?.label,
    [deliveryMethod]
  );

  const handleComplete = () => {
    setOrderNumber(`CF-${Math.floor(1000 + Math.random() * 9000)}`);
    clearCart();
  };

  return (
    <AnimatePresence mode="wait">
      {orderNumber ? (
        <motion.div
          key="confirmation"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center gap-4 py-14 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fire-500/15 text-fire-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-2xl text-foreground">¡Pedido confirmado!</h3>
          <p className="max-w-xs text-sm text-foreground/70">
            Tu número de pedido es <span className="font-semibold text-fire-500">{orderNumber}</span>.{" "}
            {deliveryMethod === "pickup"
              ? "Te avisaremos por teléfono en cuanto esté listo para recoger."
              : "Te lo llevaremos a tu mesa en breve."}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 rounded-full bg-fire-500 px-6 py-2 text-sm font-semibold text-background transition-transform hover:scale-105"
          >
            Cerrar
          </button>
        </motion.div>
      ) : (
        <motion.div key="stepper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Stepper
            onStepChange={setCurrentStep}
            onFinalStepCompleted={handleComplete}
            backButtonText="Atrás"
            nextButtonText="Siguiente"
            completeButtonText="Confirmar pedido"
            nextButtonProps={{ disabled: isNextDisabled }}
          >
            <Step>
              <h3 className="font-display text-xl text-foreground">¿Cómo lo quieres?</h3>
              <div className="mt-4 flex flex-col gap-3">
                {DELIVERY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDeliveryMethod(option.value)}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      deliveryMethod === option.value
                        ? "border-fire-500 bg-fire-500/10"
                        : "border-white/15 hover:border-white/30"
                    }`}
                  >
                    <span className="block font-semibold text-foreground">{option.label}</span>
                    <span className="block text-sm text-foreground/60">{option.description}</span>
                  </button>
                ))}
              </div>
            </Step>

            <Step>
              <h3 className="font-display text-xl text-foreground">Tus datos</h3>
              <div className="mt-4 flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={customer.name}
                  onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-transparent px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-fire-500 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={customer.phone}
                  onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-transparent px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-fire-500 focus:outline-none"
                />
                <textarea
                  placeholder="Notas (opcional): sin cebolla, alergias, etc."
                  value={customer.notes}
                  onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                  rows={3}
                  className="resize-none rounded-lg border border-white/15 bg-transparent px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-fire-500 focus:outline-none"
                />
              </div>
            </Step>

            <Step>
              <h3 className="font-display text-xl text-foreground">Revisa tu pedido</h3>
              <div className="mt-4 flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-sm">
                    <span className="text-foreground/80">
                      {item.quantity}× {item.product.name}
                    </span>
                    <span className="text-foreground/60">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 font-semibold text-foreground">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <p className="mt-3 text-sm text-foreground/60">
                  {deliveryLabel} · {customer.name || "—"} · {customer.phone || "—"}
                </p>
                {customer.notes ? (
                  <p className="text-sm italic text-foreground/50">
                    &ldquo;{customer.notes}&rdquo;
                  </p>
                ) : null}
              </div>
            </Step>
          </Stepper>
        </motion.div>
      )}
    </AnimatePresence>
  );
}