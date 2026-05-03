"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Globe,
  Phone,
  ShieldAlert,
  UserRound,
  Wallet,
} from "lucide-react";

import UserKycReviewDrawer from "./actions/UserKycReviewDrawer";
import UserMoreActionsDrawer from "./actions/UserMoreActionsDrawer";
import UserProfileDrawer from "./actions/UserProfileDrawer";
import UserRowActions from "./actions/UserRowActions";
import UserSuspendDialog from "./actions/UserSuspendDialog";
import UserValidateKycDialog from "./actions/UserValidateKycDialog";
import type {
  KycStatus,
  User,
  UserActionType,
  UsersFilter,
  UserStatus,
} from "./types";

type UsersTableProps = {
  usersData: User[];
  searchQuery?: string;
  activeFilter?: UsersFilter;
};

function getKycBadgeClass(status: KycStatus) {
  if (status === "Validé") {
    return "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]";
  }

  if (status === "En attente") {
    return "bg-yellow-50 text-yellow-700";
  }

  return "bg-red-50 text-red-600";
}

function getKycIcon(status: KycStatus) {
  if (status === "Validé") return CheckCircle2;
  if (status === "En attente") return Clock;
  return ShieldAlert;
}

function getUserStatusBadgeClass(status: UserStatus) {
  return status === "Actif"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-slate-100 text-slate-600";
}

function getKycProgressClass(status: KycStatus) {
  if (status === "Validé") return "bg-[var(--color-primary)]";
  if (status === "En attente") return "bg-yellow-500";
  return "bg-red-500";
}

function KycFileBadge({ label, valid }: { label: string; valid: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-black ${
        valid ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      {label}
    </span>
  );
}

export default function UsersTable({
  usersData,
  searchQuery = "",
  activeFilter = "all",
}: UsersTableProps) {
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [kycReviewUser, setKycReviewUser] = useState<User | null>(null);
  const [validateKycUser, setValidateKycUser] = useState<User | null>(null);
  const [suspendUser, setSuspendUser] = useState<User | null>(null);
  const [moreActionsUser, setMoreActionsUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    return usersData.filter((user) => {
      const searchableText = [
        user.fullName,
        user.phone,
        user.city,
        user.country,
        user.district,
        user.placeName,
        user.kyc,
        user.status,
        user.subscription,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        cleanQuery.length === 0 || searchableText.includes(cleanQuery);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "active" && user.status === "Actif") ||
        (activeFilter === "kyc_pending" && user.kyc === "En attente") ||
        (activeFilter === "subscription_standard" &&
          user.subscription === "Standard");

      return matchesSearch && matchesFilter;
    });
  }, [usersData, searchQuery, activeFilter]);

    console.log("USERS DATA ID CHECK", usersData);
    
  const openAction = (user: User, action: UserActionType) => {
    if (action === "profile") setProfileUser(user);
    if (action === "kyc") setKycReviewUser(user);
    if (action === "validate") setValidateKycUser(user);
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

      <UserKycReviewDrawer
        isOpen={Boolean(kycReviewUser)}
        user={kycReviewUser}
        onClose={() => setKycReviewUser(null)}
      />

      <UserValidateKycDialog
        isOpen={Boolean(validateKycUser)}
        user={validateKycUser}
        onClose={() => setValidateKycUser(null)}
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
          Vue administrative des comptes, KYC, mini-sites, wallets et
          abonnements.
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

      <div className="grid gap-4 xl:hidden">
        {filteredUsers.map((user) => {
          const KycIcon = getKycIcon(user.kyc);
          const progress =
            (user.kycFieldsCompleted / user.kycFieldsTotal) * 100;

          return (
            <article
              key={user.phone}
              className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
                  <UserRound size={21} strokeWidth={2.5} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-[var(--color-text)]">
                    {user.fullName}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[var(--color-muted)]">
                    <Phone size={13} />
                    {user.phone}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoBox
                  title="Adresse"
                  main={`${user.city}, ${user.country}`}
                  sub={`${user.district} · ${user.placeName}`}
                />

                <InfoBox
                  title="Naissance"
                  main={user.birthDate}
                  sub={user.birthPlace}
                />

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase text-[var(--color-muted)]">
                    Statut
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${getUserStatusBadgeClass(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-black uppercase text-[var(--color-muted)]">
                    KYC
                  </p>

                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${getKycBadgeClass(
                      user.kyc
                    )}`}
                  >
                    <KycIcon size={13} />
                    {user.kyc}
                  </span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3 sm:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase text-[var(--color-muted)]">
                      Complétude KYC
                    </p>

                    <span className="text-xs font-black text-[var(--color-text)]">
                      {user.kycFieldsCompleted}/{user.kycFieldsTotal}
                    </span>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className={`h-2 rounded-full ${getKycProgressClass(
                        user.kyc
                      )}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <KycFileBadge label="Selfie" valid={user.kycFiles.selfie} />
                    <KycFileBadge
                      label="CNI recto"
                      valid={user.kycFiles.cniFront}
                    />
                    <KycFileBadge
                      label="CNI verso"
                      valid={user.kycFiles.cniBack}
                    />
                  </div>
                </div>

                <InfoBox
                  title="Abonnement"
                  main={user.subscription}
                  sub={user.subscriptionPrice}
                />

                <InfoBox
                  title="Wallet"
                  main={user.wallet}
                  sub="Solde disponible"
                />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                <p className="mb-3 text-xs font-black uppercase text-[var(--color-muted)]">
                  Actions
                </p>

                <UserRowActions user={user} onAction={openAction} />
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm xl:block">
        <div className="overflow-x-auto [scrollbar-color:var(--color-primary)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-primary)]">
          <table className="w-full min-w-[1600px] border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-black uppercase tracking-wide text-[var(--color-muted)]">
                <th className="px-6 py-4">Longricheur</th>
                <th className="px-6 py-4">Adresse</th>
                <th className="px-6 py-4">Naissance</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">KYC</th>
                <th className="px-6 py-4">Complétude KYC</th>
                <th className="px-6 py-4">Pièces</th>
                <th className="px-6 py-4">Abonnement</th>
                <th className="px-6 py-4">Mini-site</th>
                <th className="px-6 py-4">Wallet</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5">
              {filteredUsers.map((user) => {
                const KycIcon = getKycIcon(user.kyc);
                const progress =
                  (user.kycFieldsCompleted / user.kycFieldsTotal) * 100;

                return (
                  <tr
                    key={user.phone}
                    className="align-top transition hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-5">
                      <div className="flex min-w-[220px] items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
                          <UserRound size={20} strokeWidth={2.5} />
                        </div>

                        <div>
                          <p className="text-sm font-black leading-5 text-[var(--color-text)]">
                            {user.fullName}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                            <Phone size={13} />
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="min-w-[190px]">
                        <p className="text-sm font-black leading-5 text-[var(--color-text)]">
                          {user.city}, {user.country}
                        </p>

                        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
                          {user.district} · {user.placeName}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="min-w-[130px]">
                        <p className="text-sm font-black text-[var(--color-text)]">
                          {user.birthDate}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                          {user.birthPlace}
                        </p>
                      </div>
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
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${getKycBadgeClass(
                          user.kyc
                        )}`}
                      >
                        <KycIcon size={13} />
                        {user.kyc}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="min-w-[180px]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[var(--color-text)]">
                            {user.kycFieldsCompleted}/{user.kycFieldsTotal}
                          </span>

                          <span className="text-xs font-bold text-[var(--color-muted)]">
                            champs
                          </span>
                        </div>

                        <div className="mt-2 h-2 rounded-full bg-slate-200">
                          <div
                            className={`h-2 rounded-full ${getKycProgressClass(
                              user.kyc
                            )}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex min-w-[190px] flex-wrap gap-2">
                        <KycFileBadge
                          label="Selfie"
                          valid={user.kycFiles.selfie}
                        />
                        <KycFileBadge
                          label="CNI recto"
                          valid={user.kycFiles.cniFront}
                        />
                        <KycFileBadge
                          label="CNI verso"
                          valid={user.kycFiles.cniBack}
                        />
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="min-w-[130px]">
                        <p className="text-sm font-black text-[var(--color-text)]">
                          {user.subscription}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
                          {user.subscriptionPrice}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                        <Globe size={13} />
                        {user.miniSite}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <p className="flex min-w-[120px] items-center gap-1 text-sm font-black text-[var(--color-text)]">
                        <Wallet size={15} />
                        {user.wallet}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="min-w-[230px]">
                        <UserRowActions user={user} onAction={openAction} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function InfoBox({
  title,
  main,
  sub,
}: {
  title: string;
  main: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-black uppercase text-[var(--color-muted)]">
        {title}
      </p>

      <p className="mt-1 text-sm font-black text-[var(--color-text)]">
        {main}
      </p>

      <p className="text-xs font-semibold text-[var(--color-muted)]">{sub}</p>
    </div>
  );
}