import { Filter, Search, ShieldCheck, UserCheck, Users } from "lucide-react";
import type { UsersFilter } from "./types";

type UsersToolbarProps = {
  searchQuery: string;
  activeFilter: UsersFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: UsersFilter) => void;
};

export default function UsersToolbar({
  searchQuery,
  activeFilter,
  onSearchChange,
  onFilterChange,
}: UsersToolbarProps) {
  const getButtonClass = (filter: UsersFilter) => {
    const isActive = activeFilter === filter;

    if (filter === "kyc_pending") {
      return isActive
        ? "border border-yellow-300 bg-yellow-100 text-yellow-800"
        : "border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100";
    }

    return isActive
      ? "bg-[var(--color-primary)] text-white shadow-sm"
      : "border border-black/5 bg-slate-50 text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)]";
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Rechercher par nom, téléphone, ville, pays..."
              className="h-12 w-full rounded-2xl border border-black/5 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:bg-white"
            />
          </div>

          <button
            type="button"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[var(--color-primary-dark)]"
          >
            <Filter size={16} />
            Filtres avancés
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${getButtonClass(
              "all"
            )}`}
          >
            <Users size={16} />
            Tous les Longricheurs
          </button>

          <button
            type="button"
            onClick={() => onFilterChange("active")}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${getButtonClass(
              "active"
            )}`}
          >
            <UserCheck size={16} />
            Actifs
          </button>

          <button
            type="button"
            onClick={() => onFilterChange("kyc_pending")}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${getButtonClass(
              "kyc_pending"
            )}`}
          >
            <ShieldCheck size={16} />
            KYC en attente
          </button>

          <button
            type="button"
            onClick={() => onFilterChange("subscription_standard")}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${getButtonClass(
              "subscription_standard"
            )}`}
          >
            Abonnement standard · 1 000 FCFA
          </button>
        </div>
      </div>
    </div>
  );
}