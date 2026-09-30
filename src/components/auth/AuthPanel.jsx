"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Flame } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthPanel({ onAuthenticated }) {
  const { signInWithPassword, signUpWithPassword } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      if (mode === "signup") {
        const { error } = await signUpWithPassword(form.email, form.password, form.name);
        if (error) throw error;
        toast.success("¡Cuenta creada! Ya puedes seguir con tu pedido.");
      } else {
        const { error } = await signInWithPassword(form.email, form.password);
        if (error) throw error;
        toast.success("¡Bienvenido de vuelta! 🔥");
      }
      onAuthenticated?.();
    } catch (error) {
      setErrorMessage(error?.message ?? "Algo ha ido mal. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fire-500/15 text-fire-500">
          <Flame size={22} />
        </div>
        <h3 className="font-display text-xl text-foreground">
          {mode === "login" ? "Inicia sesión para continuar" : "Crea tu cuenta"}
        </h3>
        <p className="max-w-xs text-sm text-foreground/60">
          Necesitas una cuenta para ganar y canjear Fire Coins en tus pedidos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <input
            type="text"
            required
            placeholder="Nombre completo"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-lg border border-white/15 bg-transparent px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-fire-500 focus:outline-none"
          />
        )}
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-fire-500 focus:outline-none"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="rounded-lg border border-white/15 bg-transparent px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-fire-500 focus:outline-none"
        />

        {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 rounded-full bg-fire-500 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Un momento..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
        className="text-center text-sm text-foreground/60 transition-colors hover:text-fire-500"
      >
        {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </motion.div>
  );
}