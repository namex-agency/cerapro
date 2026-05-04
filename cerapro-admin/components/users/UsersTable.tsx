"use client";

import { useMemo, useState } from "react";
import { Phone, UserRound } from "lucide-react";

import UserMoreActionsDrawer from "./actions/UserMoreActionsDrawer";
import UserProfileDrawer from "./actions/UserProfileDrawer";
import UserRowActions from "./actions/UserRowActions";
import UserSuspendDialog from "./actions/UserSuspendDialog";
import type { User, UserActionType, UsersFilter, UserStatus } from "./types";

type UsersTableProps = {
  usersData: User[];
  searchQuery?: string;
  activeFilter?: UsersFilter;
};

function getUserStatusBadgeClass(status: UserStatus) {
  return status === "Actif"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-slate-100 text-slate-600";
}

export default function UsersTable({
  usersData,
  searchQuery = "",
  activeFilter = "all",
}: UsersTableProps) {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [suspendUser, setSuspendUser] = useState<User | null>(null);
  const [moreActionsUser, setMoreActionsUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    return usersData.filter((user) => {
      const searchableText = [user.fullName, user.phone, user.status]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        cleanQuery.length === 0 || searchableText.includes(cleanQuery);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "active" && user.status === "Actif");

      return matchesSearch && matchesFilter;
    });
  }, [usersData, searchQuery, activeFilter]);

  const openAction = (user: User, action: UserActionType) => {
    if (action === "profile") setProfileUser(user);
    if (action === "suspend") setSuspendUser(user);
    if (action === "more") setMoreActionsUser(user);
  };

  return (
    <section className="space-y-4">
      <UserProfileDrawer
        isOpen={Boolean(profileUser)}
        user={profileUser}
        onClose={() => setProfileUser(null)}
      />

      <UserSuspendDialog
        isOpen={Boolean(suspendUser)}
        user={suspendUser}
        onClose={() => setSuspendUser(null)}
      />

      <UserMoreActionsDrawer
        isOpen={Boolean(moreActionsUser)}
        user={moreActionsUser}
        onClose={() => setMoreActionsUser(null)}
      />

      <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-[var(--color-text)]">
          Liste des Longricheurs
        </h2>

        <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
          Vue simple des comptes Longricheurs enregistrés sur CERAPRO.
        </p>
      </div>

      {filteredUsers.length === 0 && (
        <div className="rounded-3xl border border-black/5 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-black text-[var(--color-text)]">
            Aucun Longricheur trouvé.
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
            Essayez une autre recherche ou un autre filtre.
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:hidden">
        {filteredUsers.map((user) => (
          <article
            key={user.phone}
            className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
                <UserRound size={21} strokeWidth={2.5} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-black text-[var(--color-text)]">
                  {user.fullName}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[var(--color-muted)]">
                  <Phone size={13} />
                  {user.phone}
                </p>

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${getUserStatusBadgeClass(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-3">
              <p className="mb-3 text-xs font-black uppercase text-[var(--color-muted)]">
                Actions
              </p>

              <UserRowActions user={user} onAction={openAction} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-black uppercase tracking-wide text-[var(--color-muted)]">
                <th className="px-6 py-4">Longricheur</th>
                <th className="px-6 py-4">Téléphone</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5">
              {filteredUsers.map((user) => (
                <tr
                  key={user.phone}
                  className="align-middle transition hover:bg-slate-50/80"
                >
                  <td className="px-6 py-5">
                    <div className="flex min-w-[220px] items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
                        <UserRound size={20} strokeWidth={2.5} />
                      </div>

                      <p className="text-sm font-black leading-5 text-[var(--color-text)]">
                        {user.fullName}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="flex min-w-[150px] items-center gap-1 text-sm font-semibold text-[var(--color-muted)]">
                      <Phone size={14} />
                      {user.phone}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getUserStatusBadgeClass(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex min-w-[230px] justify-end">
                      <UserRowActions user={user} onAction={openAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}