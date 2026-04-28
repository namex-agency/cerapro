import {
  BadgeCheck,
  CalendarDays,
  FileCheck2,
  Globe,
  MapPin,
  Phone,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";

import type { User } from "../types";

type UserKycReviewDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
};

export default function UserKycReviewDrawer({
  isOpen,
  onClose,
  user,
}: UserKycReviewDrawerProps) {
  if (!isOpen || !user) return null;

  const missingFiles = [
    !user.kycFiles.selfie ? "Selfie" : null,
    !user.kycFiles.cniFront ? "CNI recto" : null,
    !user.kycFiles.cniBack ? "CNI verso" : null,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/40 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Fermer la vérification KYC"
        onClick={onClose}
        className="absolute inset-0"
      />

      <aside className="relative h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-2xl [scrollbar-color:var(--color-primary)_transparent] [scrollbar-width:thin] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Vérification KYC
            </p>

            <h2 className="mt-2 text-2xl font-black text-[var(--color-text)]">
              {user.fullName}
            </h2>

            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)]">
              <Phone size={15} />
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

        <div className="mt-6 rounded-3xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-[var(--color-text)]">
            <ShieldAlert size={18} className="text-[var(--color-primary)]" />
            État du dossier
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatusBox label="Statut KYC" value={user.kyc} />
            <StatusBox
              label="Complétude"
              value={`${user.kycFieldsCompleted}/${user.kycFieldsTotal} champs`}
            />
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black text-[var(--color-text)]">
            Informations déclarées
          </h3>

          <div className="mt-4 grid gap-3">
            <InfoLine icon={UserRound} label="Nom complet" value={user.fullName} />
            <InfoLine icon={Phone} label="Téléphone" value={user.phone} />
            <InfoLine
              icon={CalendarDays}
              label="Date de naissance"
              value={user.birthDate}
            />
            <InfoLine
              icon={MapPin}
              label="Lieu de naissance"
              value={user.birthPlace}
            />
            <InfoLine icon={MapPin} label="Lieu dit" value={user.placeName} />
            <InfoLine icon={MapPin} label="Quartier" value={user.district} />
            <InfoLine
              icon={Globe}
              label="Ville / Pays"
              value={`${user.city}, ${user.country}`}
            />
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black text-[var(--color-text)]">
            Pièces KYC
          </h3>

          <div className="mt-4 grid gap-3">
            <KycDocumentRow label="Photo selfie" isAvailable={user.kycFiles.selfie} />
            <KycDocumentRow label="CNI recto" isAvailable={user.kycFiles.cniFront} />
            <KycDocumentRow label="CNI verso" isAvailable={user.kycFiles.cniBack} />
          </div>
        </div>

        {missingFiles.length > 0 ? (
          <div className="mt-5 rounded-3xl border border-red-100 bg-red-50 p-5">
            <h3 className="text-sm font-black text-red-700">
              Pièces manquantes
            </h3>

            <p className="mt-2 text-sm font-semibold leading-6 text-red-600">
              Ce dossier ne peut pas être validé tant que ces éléments ne sont
              pas fournis : {missingFiles.join(", ")}.
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <h3 className="text-sm font-black text-emerald-700">
              Dossier complet
            </h3>

            <p className="mt-2 text-sm font-semibold leading-6 text-emerald-700">
              Toutes les pièces nécessaires sont présentes. Le dossier peut être
              contrôlé puis validé par l’équipe admin.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

function StatusBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase text-[var(--color-muted)]">
        {label}
      </p>

      <p className="mt-2 text-lg font-black text-[var(--color-text)]">{value}</p>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
        <Icon size={17} />
      </div>

      <div>
        <p className="text-xs font-black uppercase text-[var(--color-muted)]">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-black text-[var(--color-text)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function KycDocumentRow({
  label,
  isAvailable,
}: {
  label: string;
  isAvailable: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isAvailable
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {isAvailable ? <FileCheck2 size={17} /> : <ShieldAlert size={17} />}
        </div>

        <p className="text-sm font-black text-[var(--color-text)]">{label}</p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-black ${
          isAvailable
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-600"
        }`}
      >
        {isAvailable ? "Présent" : "Manquant"}
      </span>
    </div>
  );
}