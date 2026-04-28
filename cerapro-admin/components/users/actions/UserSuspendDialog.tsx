import { Ban, ShieldAlert, X } from "lucide-react";

import type { User } from "../types";

type UserSuspendDialogProps = {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
};

export default function UserSuspendDialog({
  isOpen,
  user,
  onClose,
}: UserSuspendDialogProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
      <button
        type="button"
        aria-label="Fermer la suspension du compte"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-600">
              Suspension compte
            </p>

            <h2 className="mt-2 text-2xl font-black text-[var(--color-text)]">
              {user.fullName}
            </h2>

            <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">
              {user.phone}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-center gap-2 text-sm font-black text-red-700">
            <ShieldAlert size={18} />
            Action sensible
          </div>

          <p className="mt-3 text-sm font-semibold leading-6 text-red-600">
            Cette action suspendra l’accès du Longricheur à son espace CERAPRO,
            à son mini-site et aux opérations sensibles. En production, cette
            action devra être journalisée avec un motif admin.
          </p>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <label
            htmlFor="suspend-reason"
            className="text-sm font-black text-[var(--color-text)]"
          >
            Motif de suspension
          </label>

          <textarea
            id="suspend-reason"
            rows={4}
            placeholder="Exemple : documents KYC frauduleux, comportement suspect, litige paiement..."
            className="mt-3 w-full resize-none rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-red-300"
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-black/5 bg-slate-50 px-5 py-3 text-sm font-black text-[var(--color-text)] transition hover:bg-slate-100"
          >
            Annuler
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700"
          >
            <Ban size={17} />
            Suspendre le compte
          </button>
        </div>
      </section>
    </div>
  );
}