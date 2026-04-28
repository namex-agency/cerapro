import {
  BadgeCheck,
  CalendarDays,
  Globe,
  MapPin,
  Phone,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import type { User } from "../types";

type UserProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
};

export default function UserProfileDrawer({
  isOpen,
  onClose,
  user,
}: UserProfileDrawerProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end bg-black/40 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Fermer le dossier"
        onClick={onClose}
        className="absolute inset-0"
      />

      <aside className="relative h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-2xl [scrollbar-color:var(--color-primary)_transparent] [scrollbar-width:thin] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Dossier Longricheur
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

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-[var(--color-primary-light)] p-4">
            <div className="flex items-center gap-2 text-sm font-black text-[var(--color-primary-dark)]">
              <UserRound size={17} />
              Statut compte
            </div>

            <p className="mt-3 text-xl font-black text-[var(--color-text)]">
              {user.status}
            </p>
          </div>

          <div className="rounded-3xl bg-[var(--color-primary-light)] p-4">
            <div className="flex items-center gap-2 text-sm font-black text-[var(--color-primary-dark)]">
              <BadgeCheck size={17} />
              Statut KYC
            </div>

            <p className="mt-3 text-xl font-black text-[var(--color-text)]">
              {user.kyc}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black text-[var(--color-text)]">
            Identité
          </h3>

          <div className="mt-4 grid gap-3">
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
            Activité CERAPRO
          </h3>

          <div className="mt-4 grid gap-3">
            <InfoLine
              icon={BadgeCheck}
              label="Abonnement"
              value={`${user.subscription} · ${user.subscriptionPrice}`}
            />

            <InfoLine icon={Globe} label="Mini-site" value={user.miniSite} />

            <InfoLine icon={Wallet} label="Wallet" value={user.wallet} />
          </div>
        </div>
      </aside>
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