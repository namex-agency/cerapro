import DashboardKpiGrid from "./DashboardKpiGrid";
import DashboardRecentActivity from "./DashboardRecentActivity";
import DashboardOperationalAlerts from "./DashboardOperationalAlerts";

export default function AdminDashboard() {
  return (
    <section className="space-y-6">
      {/* Zone 1 — Header */}
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
          Vue globale
        </p>

        <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
          Tableau de bord CERAPRO
        </h1>

        <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--color-muted)]">
          Supervision globale de la plateforme : utilisateurs, revenus,
          commandes, paiements et activité générale.
        </p>
      </div>

      {/* Zone 2 — KPI */}
      <DashboardKpiGrid />

      {/* Zone 3 — Activité récente */}
      <DashboardRecentActivity />

      {/* Zone  — Alerte opération */}
      <DashboardOperationalAlerts />
    </section>
  );
}