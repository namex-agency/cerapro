"use client";

import { useState } from "react";
import { Ban, ShieldAlert, Trash2, X } from "lucide-react";

import { deleteUser } from "../../../services/admin.service";
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
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !user) return null;

  const expectedText = "SUPPRIMER";
  const canDelete = confirmationText.trim().toUpperCase() === expectedText;

  async function handleDeleteUser() {
    if (!user || !canDelete || isDeleting) return;

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteUser(user.id);

      alert("Utilisateur supprimé définitivement.");
      onClose();
      window.location.reload();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer cet utilisateur.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
      <button
        type="button"
        aria-label="Fermer la suppression du compte"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-600">
              Suppression définitive
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
            disabled={isDeleting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-center gap-2 text-sm font-black text-red-700">
            <ShieldAlert size={18} />
            Action irréversible
          </div>

          <p className="mt-3 text-sm font-semibold leading-6 text-red-600">
            Cette action supprimera définitivement ce Longricheur, ainsi que ses
            données liées en base de données lorsque les relations Prisma le
            permettent. Cette opération est réservée au super admin.
          </p>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <label
            htmlFor="delete-confirmation"
            className="text-sm font-black text-[var(--color-text)]"
          >
            Confirmation obligatoire
          </label>

          <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-muted)]">
            Pour confirmer, écris exactement :
            <span className="ml-1 font-black text-red-600">SUPPRIMER</span>
          </p>

          <input
            id="delete-confirmation"
            value={confirmationText}
            onChange={(event) => setConfirmationText(event.target.value)}
            placeholder="Tape SUPPRIMER ici"
            disabled={isDeleting}
            className="mt-3 w-full rounded-2xl border border-black/5 bg-white p-4 text-sm font-black uppercase text-[var(--color-text)] outline-none transition placeholder:normal-case placeholder:text-[var(--color-muted)] focus:border-red-300 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {errorMessage ? (
            <p className="mt-3 rounded-2xl bg-red-100 p-3 text-sm font-bold text-red-700">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-2xl border border-black/5 bg-slate-50 px-5 py-3 text-sm font-black text-[var(--color-text)] transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleDeleteUser}
            disabled={!canDelete || isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Ban size={17} />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Supprimer définitivement
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}