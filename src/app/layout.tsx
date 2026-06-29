import type { Metadata } from "next";
import { FirebaseAuthProvider } from "@/components/providers/FirebaseAuthProvider";
import { HealthDataProvider } from "@/components/providers/HealthDataProvider";
import { ProtectedRoutes } from "@/components/providers/ProtectedRoutes";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "CycleCare AI", template: "%s · CycleCare AI" },
  description: "A private cycle tracking and wellness companion.",
  openGraph: {
    title: "CycleCare AI",
    description: "Private cycle tracking, symptom insights, and educational analytics.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><FirebaseAuthProvider><ProtectedRoutes><HealthDataProvider>{children}</HealthDataProvider></ProtectedRoutes></FirebaseAuthProvider></body>
    </html>
  );
}
