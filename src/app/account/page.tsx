import type { Metadata } from "next";
import { Flame } from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";
import AccountAuthGate from "./AccountAuthGate";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

interface TransactionRow {
  id: string;
  amount: number;
  reason: string;
  created_at: string;
}

export default async function AccountPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 py-24 text-foreground">
        <div className="w-full max-w-sm">
          <AccountAuthGate />
        </div>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, fire_coins")
    .eq("id", user.id)
    .maybeSingle();

  const { data: transactions } = await supabase
    .from("fire_coins_transactions")
    .select("id, amount, reason, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  const fireCoins = profile?.fire_coins ?? 0;

  return (
    <main className="min-h-screen bg-background px-6 py-24 text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl">Mi cuenta</h1>
            <p className="mt-1 text-sm text-foreground/60">{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-fire-500/20 bg-fire-500/5 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fire-500/15 text-fire-500">
            <Flame size={26} />
          </div>
          <div>
            <p className="text-sm text-foreground/60">Tu saldo</p>
            <p className="font-display text-3xl text-fire-500">
              {new Intl.NumberFormat("es-ES").format(fireCoins)} Fire Coins
            </p>
          </div>
        </div>

        <h2 className="mt-10 font-display text-2xl">Historial</h2>
        <div className="mt-4 flex flex-col gap-2">
          {!transactions || transactions.length === 0 ? (
            <p className="rounded-xl border border-white/10 p-4 text-sm text-foreground/60">
              Todavía no tienes movimientos. ¡Haz tu primer pedido para ganar Fire Coins!
            </p>
          ) : (
            (transactions as TransactionRow[]).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-char px-4 py-3"
              >
                <div>
                  <p className="text-sm text-foreground/80">{tx.reason}</p>
                  <p className="text-xs text-foreground/40">
                    {new Date(tx.created_at).toLocaleString("es-ES")}
                  </p>
                </div>
                <span
                  className={`font-display text-lg ${
                    tx.amount >= 0 ? "text-fire-500" : "text-foreground/60"
                  }`}
                >
                  {tx.amount >= 0 ? "+" : ""}
                  {tx.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}