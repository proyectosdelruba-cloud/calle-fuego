import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para Server Components, Route Handlers y Server Actions.
// Usa la anon key + las cookies de la petición: sabe quién ha iniciado sesión
// y respeta las políticas RLS (a diferencia del cliente admin de abajo).
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Se puede ignorar si se llama desde un Server Component:
          // el middleware ya se encarga de refrescar la sesión.
        }
      },
    },
  });
}