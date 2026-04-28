import {
  BadgeCheck,
  Ban,
  Eye,
  FileSearch,
  MoreHorizontal,
} from "lucide-react";

import type { User, UserActionType } from "../types";

type UserRowActionsProps = {
  user: User;
  onAction: (user: User, action: UserActionType) => void;
};

export default function UserRowActions({ user, onAction }: UserRowActionsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        type="button"
        title="Voir dossier"
        onClick={() => onAction(user, "profile")}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] transition hover:bg-[var(--color-primary)] hover:text-white"
      >
        <Eye size={17} />
      </button>

      <button
        type="button"
        title="Vérifier KYC"
        onClick={() => onAction(user, "kyc")}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700 transition hover:bg-yellow-100"
      >
        <FileSearch size={17} />
      </button>

      <button
        type="button"
        title="Valider KYC"
        onClick={() => onAction(user, "validate")}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
      >
        <BadgeCheck size={17} />
      </button>

      <button
        type="button"
        title="Suspendre"
        onClick={() => onAction(user, "suspend")}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
      >
        <Ban size={17} />
      </button>

      <button
        type="button"
        title="Plus d’actions"
        onClick={() => onAction(user, "more")}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
      >
        <MoreHorizontal size={17} />
      </button>
    </div>
  );
}