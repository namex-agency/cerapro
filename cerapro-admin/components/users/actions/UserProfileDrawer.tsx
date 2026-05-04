"use client";

import { Phone, UserRound, X } from "lucide-react";

import type { User } from "../types";

type UserProfileDrawerProps = {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
};

function getUserStatusBadgeClass(status: User["status"]) {
  return status === "Actif"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-slate-100 text-slate-600";
}

export default function UserProfileDrawer({
  isOpen,
  user,
  onClose,
}: UserProfileDrawerProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 p-4 backdrop-blur-sm">
      <aside className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/5 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--color-primary)]">
              Profil Longricheur
            </p>

            <h2 className="mt-1 text-xl font-black text-[var(--color-text)]">
              {user.fullName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            aria-label="Fermer le profil"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="rounded-3xl bg-[var(--color-primary-light)] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--color-primary-dark)] shadow-sm">
                <UserRound size={24} strokeWidth={2.5} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-black text-[var(--color-text)]">
                  {user.fullName}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-[var(--color-muted)]">
                  <Phone size={14} />
                  {user.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-[var(--color-muted)]">
              Statut du compte
            </p>

            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${getUserStatusBadgeClass(
                user.status
              )}`}
            >
              {user.status}
            </span>
          </div>

          <div className="rounded-3xl border border-black/5 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-[var(--color-muted)]">
              Identifiant interne
            </p>

            <p className="mt-2 break-all text-sm font-bold text-[var(--color-text)]">
              {user.id}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}