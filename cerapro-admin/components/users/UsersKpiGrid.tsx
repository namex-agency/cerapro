import { LucideIcon } from "lucide-react";

export type UsersKpi = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export default function UsersKpiGrid({ kpis }: { kpis: UsersKpi[] }) {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi: UsersKpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.title}
            className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
                <Icon
                  size={20}
                  className="text-[var(--color-primary-dark)]"
                />
              </div>
            </div>

            <p className="mt-4 text-sm font-bold text-[var(--color-muted)]">
              {kpi.title}
            </p>

            <h2 className="mt-1 text-2xl font-black text-[var(--color-text)]">
              {kpi.value}
            </h2>

            <p className="mt-1 text-xs font-semibold text-[var(--color-muted)]">
              {kpi.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}