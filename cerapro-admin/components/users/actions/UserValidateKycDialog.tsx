import { BadgeCheck, ShieldCheck, X } from "lucide-react";

import type { User } from "../types";

type UserValidateKycDialogProps = {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
};

export default function UserValidateKycDialog({
  isOpen,
  user,
  onClose,
}: UserValidateKycDialogProps) {
  if (!isOpen || !user) return null;

  const canValidate =
    user.kycFiles.selfie && user.kycFiles.cniFront && user.kycFiles.cniBack;

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
      <button
        type="button"
        aria-label="Fermer la validation KYC"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Validation KYC
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

        <div
          className={`mt-6 rounded-3xl border p-5 ${
            canValidate
              ? "border-emerald-100 bg-emerald-50"
              : "border-red-100 bg-red-50"
          }`}
        >
          <div
            className={`flex items-center gap-2 text-sm font-black ${
              canValidate ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {canValidate ? <BadgeCheck size={18} /> : <ShieldCheck size={18} />}
            {canValidate ? "Dossier prêt à valider" : "Validation impossible"}
          </div>

          <p
            className={`mt-3 text-sm font-semibold leading-6 ${
              canValidate ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {canValidate
              ? "Toutes les pièces KYC sont présentes. L’équipe admin pourra valider ce compte après contrôle manuel des informations."
              : "Ce dossier contient encore des pièces manquantes. Il doit être complété avant validation officielle."}
          </p>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <p className="text-sm font-black text-[var(--color-text)]">
            Résumé du contrôle
          </p>

          <div className="mt-3 grid gap-2 text-sm font-semibold text-[var(--color-muted)]">
            <p>Statut actuel : {user.kyc}</p>
            <p>
              Complétude : {user.kycFieldsCompleted}/{user.kycFieldsTotal} champs
            </p>
            <p>Selfie : {user.kycFiles.selfie ? "Présent" : "Manquant"}</p>
            <p>
              CNI recto : {user.kycFiles.cniFront ? "Présent" : "Manquant"}
            </p>
            <p>
              CNI verso : {user.kycFiles.cniBack ? "Présent" : "Manquant"}
            </p>
          </div>
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
            disabled={!canValidate}
            className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            Valider le KYC
          </button>
        </div>
      </section>
    </div>
  );
}