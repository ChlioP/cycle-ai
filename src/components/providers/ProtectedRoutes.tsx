"use client";

import { useFirebaseAuth } from "./FirebaseAuthProvider";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { user, loading, error, configured } = useFirebaseAuth();

  if (!configured) return children;
  if (loading) return <main className="main"><p className="muted" role="status">Securing your private data…</p><div className="section-block"><DashboardSkeleton /></div></main>;
  if (error || !user) return <main className="main"><h1>Unable to sign in</h1><p className="muted">Firebase Authentication is required to access your health logs.</p></main>;
  return children;
}
