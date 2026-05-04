import { Search, UserCheck, Users } from "lucide-react";
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

    return isActive
      ? "bg-[var(--color-primary)] text-white shadow-sm"
      : "border border-black/5 bg-slate-50 text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)]";
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher par nom, téléphone ou statut..."
            className="h-12 w-full rounded-2xl border border-black/5 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:bg-white"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
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
        </div>
      </div>
    </div>
  );
}