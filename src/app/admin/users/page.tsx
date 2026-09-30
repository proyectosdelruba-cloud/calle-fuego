import { supabaseAdmin } from "@/lib/supabase/admin";
import { grantFireCoins } from "../actions";

export const dynamic = "force-dynamic";

interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  fire_coins: number;
}

interface UserRow {
  id: string;
  email: string | undefined;
  createdAt: string;
  fullName: string | null;
  phone: string | null;
  fireCoins: number;
}

async function getUsers(): Promise<{ users: UserRow[]; error: string | null }> {
  try {
    const [{ data: authData, error: authError }, { data: profiles, error: profilesError }] =
      await Promise.all([
        supabaseAdmin.auth.admin.listUsers({ perPage: 200 }),
        supabaseAdmin.from("profiles").select("id, full_name, phone, fire_coins"),
      ]);

    if (authError) throw authError;
    if (profilesError) throw profilesError;

    const profilesById = new Map(
      ((profiles as ProfileRow[]) ?? []).map((profile) => [profile.id, profile])
    );

    const users: UserRow[] = authData.users
      .map((authUser) => {
        const profile = profilesById.get(authUser.id);
        return {
          id: authUser.id,
          email: authUser.email,
          createdAt: authUser.created_at,
          fullName: profile?.full_name ?? null,
          phone: profile?.phone ?? null,
          fireCoins: profile?.fire_coins ?? 0,
        };
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return { users, error: null };
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    return {
      users: [],
      error: "No se pudieron cargar los usuarios. ¿Está Supabase configurado correctamente?",
    };
  }
}

export default async function AdminUsersPage() {
  const { users, error } = await getUsers();

  if (error) {
    return (
      <div className="rounded-xl border border-fire-500/30 bg-fire-500/5 p-6 text-sm text-fire-300">
        {error}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 p-6 text-sm text-foreground/60">
        Todavía no hay usuarios registrados.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-char p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-foreground">{user.fullName ?? "Sin nombre"}</p>
            <p className="text-sm text-foreground/60">{user.email ?? "Sin email"}</p>
            {user.phone && <p className="text-xs text-foreground/40">{user.phone}</p>}
            <p className="mt-1 text-xs text-foreground/40">
              Registrado el {new Date(user.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="rounded-full bg-fire-500/15 px-3 py-1 text-sm font-semibold text-fire-400">
              🔥 {new Intl.NumberFormat("es-ES").format(user.fireCoins)} Fire Coins
            </span>

            <form action={grantFireCoins} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <input
                type="number"
                name="amount"
                min={1}
                placeholder="Cantidad"
                required
                className="w-24 rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm text-foreground placeholder:text-foreground/40 focus:border-fire-500 focus:outline-none"
              />
              <input
                type="text"
                name="reason"
                placeholder="Motivo (opcional)"
                className="w-40 rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm text-foreground placeholder:text-foreground/40 focus:border-fire-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-fire-500 px-3 py-1.5 text-xs font-semibold text-background transition-transform hover:scale-105"
              >
                Regalar
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}