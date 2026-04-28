import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type DashboardKpiCardProps = {
  title: string;
  value: string;
  description: string;
  href: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
};

export default function DashboardKpiCard({
  title,
  value,
  description,
  href,
  icon: Icon,
  trend,
  trendType = "neutral",
}: DashboardKpiCardProps) {
  const isUp = trendType === "up";
  const isDown = trendType === "down";

  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] transition group-hover:scale-105">
          <Icon size={22} strokeWidth={2.5} />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${
              isUp
                ? "bg-emerald-50 text-emerald-700"
                : isDown
                  ? "bg-red-50 text-red-600"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {isUp && <ArrowUpRight size={14} strokeWidth={3} />}
            {isDown && <ArrowDownRight size={14} strokeWidth={3} />}
            {trend}
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="text-sm font-bold text-[var(--color-muted)]">{title}</p>

        <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-text)]">
          {value}
        </h2>

        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-muted)]">
          {description}
        </p>
      </div>
    </Link>
  );
}