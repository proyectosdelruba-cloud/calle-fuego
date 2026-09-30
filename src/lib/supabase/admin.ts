import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente con privilegios de administrador (service_role): salta TODAS las
// políticas RLS. Solo se usa en código de servidor de confianza (Route
// Handlers, Server Actions, el panel /admin) — nunca en un Client Component,
// y el paquete "server-only" hace que el build falle si alguien lo intenta
// importar por error desde un archivo de cliente.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});