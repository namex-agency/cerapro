import type { Metadata } from "next";
import "./globals.css";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

export const metadata: Metadata = {
  title: "CERAPRO Admin",
  description: "Plateforme admin CERAPRO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AdminAuthGuard>{children}</AdminAuthGuard>
      </body>
    </html>
  );
}