"use client";

import { X, UserRound, ShieldAlert, Globe, Wallet } from "lucide-react";
import type { User } from "../types";

type Props = {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
};

export default function UserMoreActionsDrawer({
  isOpen,
  user,
  onClose,
}: Props) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/40 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0"
      />

      <aside className="relative h-full w-full max-w-md bg-white p-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
              Actions avancées
            </p>

            <h2 className="mt-2 text-xl font-black">
              {user.fullName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 space-y-3">

          <ActionItem icon={UserRound} label="Voir profil complet" />
          <ActionItem icon={ShieldAlert} label="Historique KYC" />
          <ActionItem icon={Globe} label="Voir mini-site" />
          <ActionItem icon={Wallet} label="Historique wallet" />

        </div>
      </aside>
    </div>
  );
}

function ActionItem({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-slate-100">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
        <Icon size={18} />
      </div>

      <span className="text-sm font-black">{label}</span>
    </button>
  );
}