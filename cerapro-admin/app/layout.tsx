import type { Metadata } from "next";
import "./globals.css";
import { AdminLayout } from "@/components/layout/AdminLayout";

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
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}