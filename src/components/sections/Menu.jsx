"use client";
 
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  HamburgerIcon,
  FrenchFries01Icon,
  PackageIcon,
  CupSodaIcon,
  CakeIcon,
} from "@hugeicons/core-free-icons";
import BranchedMenu from "@/components/ui/BranchedMenu";
import ProductCard from "@/components/menu/ProductCard";
import { supabaseBrowser } from "@/lib/supabase/client";
import { CATEGORIES, PRODUCTS } from "@/lib/data/menu";
 
const CATEGORY_ICONS = {
  burgers: HamburgerIcon,
  entrantes: FrenchFries01Icon,
  combos: PackageIcon,
  bebidas: CupSodaIcon,
  postres: CakeIcon,
};
 
export default function Menu() {
  const [categories] = useState(CATEGORIES);
  const [products, setProducts] = useState(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].slug);
 
  useEffect(() => {
    let cancelled = false;
 
    async function loadFromSupabase() {
      try {
        const [{ data: categoryData }, { data: productData }] = await Promise.all([
          supabaseBrowser.from("categories").select("*").order("sort_order"),
          supabaseBrowser.from("products").select("*").eq("is_available", true),
        ]);
 
        if (cancelled) return;
        // Si Supabase todavía no tiene datos reales (o no está configurado),
        // nos quedamos con la carta local de ejemplo definida en lib/data/menu.ts.
        if (categoryData?.length && productData?.length) {
          setProducts(productData);
        }
      } catch {
        // Sin conexión a Supabase todavía: seguimos con los datos locales.
      }
    }
 
    loadFromSupabase();
    return () => {
      cancelled = true;
    };
  }, []);
 
  const menuItems = useMemo(
    () => [
      {
        label: "Categorías",
        children: categories.map((category) => ({
          value: category.slug,
          label: category.name,
          icon: CATEGORY_ICONS[category.slug],
        })),
      },
    ],
    [categories]
  );
 
  const visibleProducts = useMemo(
    () => products.filter((product) => product.category_id === activeCategory),
    [products, activeCategory]
  );
 
  return (
    <section id="carta" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 text-center">
        <span className="font-body text-sm uppercase tracking-[0.3em] text-fire-300">
          La carta
        </span>
        <h2 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
          Elige tu fuego
        </h2>
      </div>
 
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-28 md:h-fit">
          <BranchedMenu
            items={menuItems}
            defaultOpen={[0]}
            defaultActive={activeCategory}
            onSelect={(value) => setActiveCategory(value)}
            accentColor="#ff4d1c"
            lineColor="#3f3f46"
            color="#f5f5f5"
          />
        </aside>
 
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
 