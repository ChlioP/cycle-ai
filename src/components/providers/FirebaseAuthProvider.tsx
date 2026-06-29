"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { getFirebaseServices, isFirebaseConfigured } from "@/lib/firebase/client";

type AuthState = { user: User | null; loading: boolean; error: string | null; configured: boolean };
const AuthContext = createContext<AuthState>({ user: null, loading: true, error: null, configured: isFirebaseConfigured });

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: isFirebaseConfigured, error: null, configured: isFirebaseConfigured });

  useEffect(() => {
    const services = getFirebaseServices();
    if (!services) return;
    return onAuthStateChanged(services.auth, async (user) => {
      if (user) {
        setState({ user, loading: false, error: null, configured: true });
        return;
      }
      try {
        await signInAnonymously(services.auth);
      } catch (error) {
        setState({ user: null, loading: false, error: error instanceof Error ? error.message : "Authentication failed", configured: true });
      }
    });
  }, []);

  return <AuthContext value={state}>{children}</AuthContext>;
}

export function useFirebaseAuth() {
  return useContext(AuthContext);
}
