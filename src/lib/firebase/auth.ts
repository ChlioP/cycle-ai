import { signInAnonymously, type User } from "firebase/auth";
import { getFirebaseServices } from "./client";

export async function ensureAuthenticatedUser(): Promise<User | null> {
  const services = getFirebaseServices();
  if (!services) return null;
  if (services.auth.currentUser) return services.auth.currentUser;
  const credential = await signInAnonymously(services.auth);
  return credential.user;
}
