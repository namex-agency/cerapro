import {
  BadgeCheck,
  Banknote,
  CreditCard,
  FileCheck,
  Headphones,
  Landmark,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";

import DashboardKpiCard from "./DashboardKpiCard";

const dashboardKpis = [
  {
    title: "Longricheurs inscrits",
    value: "24 860",
    description: "Utilisateurs enregistrés sur CERAPRO",
    href: "/users",
    icon: Users,
    trend: "+12.8%",
    trendType: "up" as const,
  },
  {
    title: "KYC à valider",
    value: "312",
    description: "Dossiers identité en attente",
    href: "/kyc",
    icon: FileCheck,
    trend: "+4.6%",
    trendType: "up" as const,
  },
  {
    title: "Abonnements actifs",
    value: "8 420",
    description: "Longricheurs avec accès actif",
    href: "/subscriptions",
    icon: BadgeCheck,
    trend: "+7.4%",
    trendType: "up" as const,
  },
  {
    title: "Mini-sites créés",
    value: "6 915",
    description: "Boutiques personnelles générées",
    href: "/mini-sites",
    icon: Store,
    trend: "+15.1%",
    trendType: "up" as const,
  },
  {
    title: "Commandes mini-sites",
    value: "18 230",
    description: "Commandes clients enregistrées",
    href: "/orders",
    icon: ShoppingCart,
    trend: "+21.6%",
    trendType: "up" as const,
  },
  {
    title: "Paiements encaissés",
    value: "184 500 000 FCFA",
    description: "Volume total collecté par CERAPRO",
    href: "/payments",
    icon: CreditCard,
    trend: "+18.9%",
    trendType: "up" as const,
  },
  {
    title: "Wallets supervisés",
    value: "7 832",
    description: "Comptes financiers Longricheurs",
    href: "/wallets",
    icon: Landmark,
    trend: "+9.2%",
    trendType: "up" as const,
  },
  {
    title: "Retraits en attente",
    value: "43",
    description: "Demandes à traiter par l’équipe",
    href: "/withdrawals",
    icon: Banknote,
    trend: "-3.1%",
    trendType: "down" as const,
  },
  {
    title: "Tickets support",
    value: "27",
    description: "Demandes ouvertes ou urgentes",
    href: "/support",
    icon: Headphones,
    trend: "Stable",
    trendType: "neutral" as const,
  },
];

export default function DashboardKpiGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {dashboardKpis.map((kpi) => (
        <DashboardKpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}