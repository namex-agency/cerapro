"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, Search, ShieldCheck, UserRound } from "lucide-react";

type AdminHeaderProps = {
  onOpenSidebar?: () => void;
};

type AdminUser = {
  id?: string;
  phone?: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: "ADMIN" | "SUPER_ADMIN" | string;
};

function getAdminDisplayName(adminUser: AdminUser | null) {
  const fullName = [adminUser?.firstName, adminUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Administrateur CERAPRO";
}

function getAdminRoleLabel(role?: string) {
  if (role === "SUPER_ADMIN") return "Super administrateur";
  if (role === "ADMIN") return "Administrateur";
  return "Session admin";
}

export function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("cerapro_admin_user");

    if (!storedUser) return;

    try {
      setAdminUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("cerapro_admin_user");
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("cerapro_admin_token");
    localStorage.removeItem("cerapro_admin_user");
    window.location.replace("/admin-login");
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-xl">
      <div className="flex w-full flex-col gap-4 px-4 py-4 sm:px-5 lg:px-6">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              aria-label="Ouvrir le menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-primary-dark)] shadow-sm ring-1 ring-[var(--color-border)] transition hover:bg-[var(--color-primary-light)] lg:hidden"
            >
              <Menu size={24} strokeWidth={2.7} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-primary-dark)] sm:text-[11px]">
                CERAPRO ADMIN
              </p>

              <h1 className="mt-1 text-base font-black leading-tight tracking-tight text-[var(--color-text)] sm:text-xl lg:text-2xl">
                <span className="hidden sm:inline">Bonne gestion de CERAPRO</span>
                <span className="sm:hidden">Bonne gestion</span>
              </h1>
            </div>
          </div>

          <div className="relative flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Notifications admin"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-primary-dark)] transition hover:bg-[var(--color-primary-light)]"
            >
              <Bell size={24} strokeWidth={2.6} />
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-danger)] px-1 text-[10px] font-black text-white">
                3
              </span>
            </button>

            <button
              type="button"
              aria-label="Profil administrateur"
              onClick={() => setIsProfileOpen((current) => !current)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-sm transition hover:scale-105 hover:bg-[var(--color-primary-dark)]"
            >
              <UserRound size={22} strokeWidth={2.6} />
            </button>

            {isProfileOpen ? (
              <div className="absolute right-0 top-14 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl">
                <div className="border-b border-black/5 bg-[var(--color-primary-light)] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
                      <ShieldCheck size={24} strokeWidth={2.6} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[var(--color-text)]">
                        {getAdminDisplayName(adminUser)}
                      </p>

                      <p className="mt-1 text-xs font-black uppercase tracking-wide text-[var(--color-primary-dark)]">
                        {getAdminRoleLabel(adminUser?.role)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-[var(--color-text-muted)]">
                      Téléphone admin
                    </p>

                    <p className="mt-1 text-sm font-black text-[var(--color-text)]">
                      {adminUser?.phone || "Non disponible"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-black text-red-600 transition hover:bg-red-100"
                  >
                    <LogOut size={18} strokeWidth={2.6} />
                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <label className="flex h-12 w-full min-w-0 items-center gap-3 rounded-full bg-white px-4 shadow-sm ring-1 ring-[var(--color-border)] transition focus-within:ring-2 focus-within:ring-[var(--color-primary)] lg:mx-auto lg:max-w-xl">
          <Search
            size={19}
            strokeWidth={2.5}
            className="shrink-0 text-[var(--color-text-muted)]"
          />

          <input
            type="text"
            placeholder="Rechercher..."
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </label>
      </div>
    </header>
  );
}