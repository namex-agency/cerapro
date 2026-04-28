import { AlertTriangle, CreditCard, FileWarning, Wallet } from "lucide-react";

const operationalAlerts = [
  {
    title: "Retraits bloqués",
    description: "7 demandes nécessitent une vérification manuelle.",
    level: "Critique",
    icon: Wallet,
  },
  {
    title: "KYC incomplets",
    description: "18 dossiers sont soumis avec pièces manquantes.",
    level: "À traiter",
    icon: FileWarning,
  },
  {
    title: "Paiements échoués",
    description: "12 transactions clients doivent être contrôlées.",
    level: "Urgent",
    icon: CreditCard,
  },
  {
    title: "Tickets sensibles",
    description: "4 demandes support concernent des opérations financières.",
    level: "Surveillance",
    icon: AlertTriangle,
  },
];

export default function DashboardOperationalAlerts() {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-black text-[var(--color-text)]">
          Alertes opérationnelles
        </h2>

        <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
          Points critiques à surveiller pour maintenir la qualité et la sécurité
          de la plateforme.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {operationalAlerts.map((alert) => {
          const Icon = alert.icon;

          return (
            <article
              key={alert.title}
              className="rounded-2xl border border-black/5 bg-slate-50/70 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Icon size={20} strokeWidth={2.5} />
                </div>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-red-600 shadow-sm">
                  {alert.level}
                </span>
              </div>

              <h3 className="mt-4 text-sm font-black text-[var(--color-text)]">
                {alert.title}
              </h3>

              <p className="mt-1 text-sm font-medium leading-5 text-[var(--color-muted)]">
                {alert.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}