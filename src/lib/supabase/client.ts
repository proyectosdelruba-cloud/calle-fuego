"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para Client Components: sabe quién ha iniciado sesión (guarda la
// sesión en cookies, sincronizada con el servidor) y respeta las políticas RLS.
export const supabaseBrowser = createBrowserClient(supabaseUrl, supabaseAnonKey);