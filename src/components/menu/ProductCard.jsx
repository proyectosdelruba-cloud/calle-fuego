"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

const ALLERGEN_LABELS = {
  gluten: "Gluten",
  lacteos: "Lácteos",
  huevo: "Huevo",
  mostaza: "Mostaza",
  sulfitos: "Sulfitos",
  soja: "Soja",
  frutos_cascara: "Frutos de cáscara",
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-char"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl tracking-wide text-foreground">{product.name}</h3>
          <span className="whitespace-nowrap font-display text-xl text-fire-500">
            {product.price.toFixed(2)} €
          </span>
        </div>

        {product.description ? (
          <p className="mt-2 text-sm text-foreground/70">{product.description}</p>
        ) : null}

        {product.allergens.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.allergens.map((allergen) => (
              <span
                key={allergen}
                className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] uppercase tracking-wide text-foreground/60"
              >
                {ALLERGEN_LABELS[allergen] ?? allergen}
              </span>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            addItem(product, false);
            toast.success(`${product.name} añadido`, {
              description: "Ya está en tu carrito.",
            });
          }}
          className="mt-4 rounded-full bg-fire-500 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.02] active:scale-95"
        >
          Añadir al carrito
        </button>
      </div>
    </motion.article>
  );
}