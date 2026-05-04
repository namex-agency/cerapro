"use client";

import { useEffect, useState } from "react";
import { CheckCircle, UserX, Users } from "lucide-react";

import { getUsers, getUsersKpis, type UsersKpisData } from "@/lib/api";
import UsersKpiGrid from "./UsersKpiGrid";
import UsersTable from "./UsersTable";
import UsersToolbar from "./UsersToolbar";
import type { User, UsersFilter } from "./types";

type ApiUser = Record<string, unknown>;

function toText(value: unknown, fallback = "Non renseigné") {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function mapApiUserStatus(apiUser: ApiUser): User["status"] {
  return apiUser.status === "Actif" ? "Actif" : "Inactif";
}

function mapApiUserToUser(apiUser: ApiUser): User {
  const firstName = toText(apiUser.firstName, "");
  const lastName = toText(apiUser.lastName, "");
  const fullName =
    `${firstName} ${lastName}`.trim() ||
    toText(apiUser.fullName) ||
    toText(apiUser.name);

  return {
    id: toText(apiUser.id),
    fullName,
    phone: toText(apiUser.phone),
    status: mapApiUserStatus(apiUser),
  };
}

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<UsersFilter>("all");
  const [usersData, setUsersData] = useState<User[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [usersResponse, kpisResponse] = await Promise.all([
          getUsers(),
          getUsersKpis(),
        ]);

        const mappedUsers = usersResponse.data.map(mapApiUserToUser);
        setUsersData(mappedUsers);

        const data: UsersKpisData = kpisResponse.data;

        setKpis([
          {
            title: "Total Longricheurs",
            value: data.total.toLocaleString(),
            description: "Comptes enregistrés",
            icon: Users,
          },
          {
            title: "Actifs",
            value: data.active.toLocaleString(),
            description: "Comptes actifs",
            icon: CheckCircle,
          },
          {
            title: "Inactifs",
            value: data.inactive.toLocaleString(),
            description: "Comptes inactifs",
            icon: UserX,
          },
        ]);
      } catch {
        setErrorMessage(
          "Impossible de charger les données depuis le backend CERAPRO."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
          Utilisateurs
        </p>

        <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
          Gestion des Longricheurs
        </h1>

        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[var(--color-muted)]">
          Supervisez simplement les comptes Longricheurs enregistrés sur
          CERAPRO.
        </p>
      </div>

      <UsersKpiGrid kpis={kpis} />

      <UsersToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-[var(--color-muted)]">
            Chargement des données...
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-black text-red-600">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage ? (
        <UsersTable
          usersData={usersData}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
        />
      ) : null}
    </section>
  );
}