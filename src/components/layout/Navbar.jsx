"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ShoppingBag, Bike } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon } from "@hugeicons/core-free-icons";
import GradientText from "@/components/ui/GradientText";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Carta", href: "#carta" },
  { label: "Combos", href: "#combos" },
  { label: "Nosotros", href: "#nosotros" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#inicio" className="flex items-center">
          <GradientText
            colors={["#ff4d1c", "#ffb703", "#ff4d1c"]}
            animationSpeed={5}
            className="font-display text-2xl tracking-wide"
          >
            CALLE FUEGO
          </GradientText>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm text-foreground/80">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-fire-500">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-foreground/70 transition-colors hover:text-fire-500"
          >
            <HugeiconsIcon icon={InstagramIcon} size={20} strokeWidth={1.8} />
          </a>
          <a
            href="https://glovoapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-fire-500 px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-105"
          >
            <Bike size={16} />
            Pedir en Glovo
          </a>
          <button
            type="button"
            onClick={openCart}
            aria-label="Carrito"
            className="relative rounded-full border border-white/20 p-2 text-foreground/80 transition-colors hover:border-fire-500 hover:text-fire-500"
          >
            <ShoppingBag size={20} />
            {totalCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-fire-500 px-1 text-[11px] font-bold text-background">
                {totalCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={openCart}
            aria-label="Carrito"
            className="relative text-foreground/80 transition-colors hover:text-fire-500"
          >
            <ShoppingBag size={22} />
            {totalCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-fire-500 px-1 text-[10px] font-bold text-background">
                {totalCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background/95 border-t border-white/10"
          >
            <div className="flex flex-col gap-4 px-6 py-6 font-body text-foreground/90">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://glovoapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-fire-500 px-4 py-3 font-semibold text-background"
              >
                <Bike size={16} />
                Pedir en Glovo
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}