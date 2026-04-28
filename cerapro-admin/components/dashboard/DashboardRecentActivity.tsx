import {
  BadgeCheck,
  Banknote,
  CreditCard,
  ShoppingCart,
} from "lucide-react";

const recentActivities = [
  {
    title: "Nouvelle commande mini-site",
    description: "Commande #CMD-2048 liée au mini-site d’un Longricheur",
    time: "Il y a 8 min",
    icon: ShoppingCart,
  },
  {
    title: "Paiement confirmé",
    description: "Paiement client validé via l’infrastructure CERAPRO",
    time: "Il y a 16 min",
    icon: CreditCard,
  },
  {
    title: "Demande de retrait créée",
    description: "Un Longricheur a demandé un retrait wallet",
    time: "Il y a 28 min",
    icon: Banknote,
  },
  {
    title: "KYC soumis",
    description: "Un nouveau dossier identité attend validation",
    time: "Il y a 42 min",
    icon: BadgeCheck,
  },
];

export default function DashboardRecentActivity() {
  return (
    <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[var(--color-text)]">
            Activité récente
          </h2>

          <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">
            Derniers événements opérationnels de la plateforme.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex gap-4 rounded-2xl border border-black/5 bg-slate-50/70 p-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                <Icon size={20} strokeWidth={2.5} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-black text-[var(--color-text)]">
                    {activity.title}
                  </h3>

                  <span className="text-xs font-bold text-[var(--color-muted)]">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium leading-5 text-[var(--color-muted)]">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}