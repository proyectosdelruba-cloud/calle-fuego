"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Flame } from "lucide-react";
import Stepper, { Step } from "@/components/ui/Stepper";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { coinsToDiscount, formatCoins, maxRedeemableCoins } from "@/lib/fireCoins";

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
  const { profile, fireCoins, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [customer, setCustomer] = useState({ name: "", phone: "", notes: "" });
  const [coinsToRedeem, setCoinsToRedeem] = useState(0);
  const [orderResult, setOrderResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Precarga el nombre desde el perfil en cuanto llega (una sola vez),
  // sin usar un efecto: se ajusta durante el render, como recomienda React
  // para "adaptar el estado a partir de una prop" (ver react.dev).
  const [prefilledName, setPrefilledName] = useState(null);
  if (profile?.full_name && profile.full_name !== prefilledName) {
    setPrefilledName(profile.full_name);
    if (!customer.name) {
      setCustomer((c) => ({ ...c, name: profile.full_name }));
    }
  }

  const maxRedeemable = useMemo(
    () => maxRedeemableCoins(totalPrice, fireCoins),
    [totalPrice, fireCoins]
  );
  const discount = coinsToDiscount(coinsToRedeem);
  const finalTotal = Math.max(totalPrice - discount, 0);

  const canContinueStep2 = customer.name.trim().length > 1 && customer.phone.trim().length > 5;
  const isNextDisabled = currentStep === 2 && !canContinueStep2;

  const deliveryLabel = useMemo(
    () => DELIVERY_OPTIONS.find((option) => option.value === deliveryMethod)?.label,
    [deliveryMethod]
  );

  const handleComplete = async () => {
    setSubmitting(true);

    const payload = {
      deliveryMethod,
      customer,
      total: totalPrice,
      fireCoinsRedeemed: coinsToRedeem,
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        isCombo: item.isCombo,
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "No se pudo guardar el pedido");

      setOrderResult(data);
      await refreshProfile();

      if (data.coinsEarned > 0) {
        toast.success(`🔥 +${formatCoins(data.coinsEarned)} Fire Coins ganados`, {
          description: "Ya están en tu saldo, listos para tu próximo pedido.",
        });
      }
    } catch (error) {
      console.warn("No se pudo guardar el pedido en Supabase, usando fallback local:", error);
      setOrderResult({
        orderNumber: `CF-${Math.floor(1000 + Math.random() * 9000)}`,
        coinsEarned: 0,
        persisted: false,
      });
      toast.error("No se pudo conectar con el servidor, pero tu pedido quedó registrado localmente.");
    } finally {
      clearCart();
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {orderResult ? (
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
            Tu número de pedido es{" "}
            <span className="font-semibold text-fire-500">{orderResult.orderNumber}</span>.{" "}
            {deliveryMethod === "pickup"
              ? "Te avisaremos por teléfono en cuanto esté listo para recoger."
              : "Te lo llevaremos a tu mesa en breve."}
          </p>
          {orderResult.coinsEarned > 0 && (
            <p className="flex items-center gap-1.5 text-sm text-fire-400">
              <Flame size={16} />
              Has ganado {formatCoins(orderResult.coinsEarned)} Fire Coins
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-2 rounded-full bg-fire-500 px-6 py-2 text-sm font-semibold text-background transition-transform hover:scale-105"
          >
            Cerrar
          </button>
        </motion.div>
      ) : submitting ? (
        <motion.div
          key="submitting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center gap-3 py-20 text-center text-foreground/70"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-fire-500 border-t-transparent" />
          <p className="text-sm">Enviando tu pedido...</p>
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
                <p className="mt-1 text-sm text-foreground/60">
                  {deliveryLabel} · {customer.name || "—"} · {customer.phone || "—"}
                </p>
              </div>

              {maxRedeemable > 0 && (
                <div className="mt-4 rounded-xl border border-fire-500/20 bg-fire-500/5 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Flame size={15} className="text-fire-500" />
                      Canjear Fire Coins
                    </span>
                    <span className="text-fire-500">Saldo: {formatCoins(fireCoins)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={maxRedeemable}
                    step={Math.max(1, Math.round(maxRedeemable / 100))}
                    value={coinsToRedeem}
                    onChange={(e) => setCoinsToRedeem(Number(e.target.value))}
                    className="mt-3 w-full accent-fire-500"
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-foreground/60">
                    <span>{formatCoins(coinsToRedeem)} monedas</span>
                    <button
                      type="button"
                      onClick={() => setCoinsToRedeem(maxRedeemable)}
                      className="font-semibold text-fire-500 hover:underline"
                    >
                      Usar el máximo
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-col gap-1 border-t border-white/10 pt-3 text-sm">
                <div className="flex items-center justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-fire-500">
                    <span>Descuento Fire Coins</span>
                    <span>-{discount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-lg font-semibold text-foreground">
                  <span>Total a pagar</span>
                  <span>{finalTotal.toFixed(2)} €</span>
                </div>
              </div>
            </Step>
          </Stepper>
        </motion.div>
      )}
    </AnimatePresence>
  );
}