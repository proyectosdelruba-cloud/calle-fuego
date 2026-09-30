import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

const TABS = [
  { href: "/admin", label: "Pedidos" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-4xl">Calle Fuego · Admin</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Panel interno — no enlazado desde la web pública.
        </p>

        <nav className="mt-6 flex gap-2 border-b border-white/10">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="rounded-t-lg px-4 py-2 text-sm font-semibold text-foreground/60 transition-colors hover:text-fire-500"
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}