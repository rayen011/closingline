import { createContext, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const AuthContext = createContext(null);

const appRedirect = () => `${window.location.origin}/app`;

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signInWithPassword = useCallback(
    (email, password) => supabase.auth.signInWithPassword({ email, password }),
    [],
  );

  const signUpWithPassword = useCallback(
    (email, password) =>
      supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: appRedirect() },
      }),
    [],
  );

  const signInWithGoogle = useCallback(
    () =>
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: appRedirect() },
      }),
    [],
  );

  const signOut = useCallback(() => supabase.auth.signOut(), []);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
