"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabaseBrowser
      .from("profiles")
      .select("id, full_name, phone, fire_coins")
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      if (data.user) loadProfile(data.user.id);
      setLoading(false);
    });

    const { data: subscription } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo(
    () => ({
      user,
      profile,
      fireCoins: profile?.fire_coins ?? 0,
      loading,
      isAuthenticated: Boolean(user),
      refreshProfile: () => (user ? loadProfile(user.id) : Promise.resolve()),
      signInWithPassword: (email, password) =>
        supabaseBrowser.auth.signInWithPassword({ email, password }),
      signUpWithPassword: (email, password, fullName) =>
        supabaseBrowser.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        }),
      signOut: () => supabaseBrowser.auth.signOut(),
    }),
    [user, profile, loading, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return ctx;
}