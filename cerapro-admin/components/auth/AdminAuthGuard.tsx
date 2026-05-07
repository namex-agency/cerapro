"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminLayout } from "@/components/layout/AdminLayout";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const pathname = usePathname();

  const publicRoutes = ["/admin-login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (isPublicRoute) {
      setIsCheckingSession(false);
      return;
    }

    const token = localStorage.getItem("cerapro_admin_token");

    if (!token) {
      window.location.replace("/admin-login");
      return;
    }

    setIsCheckingSession(false);
  }, [isPublicRoute]);

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
            CERAPRO Admin
          </p>

          <h1 className="mt-3 text-xl font-black text-[var(--color-text)]">
            Vérification de la session
          </h1>

          <p className="mt-2 text-sm font-semibold text-[var(--color-muted)]">
            Sécurisation de l’accès administrateur...
          </p>
        </div>
      </main>
    );
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}