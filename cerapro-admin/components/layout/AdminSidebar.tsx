'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Bell,
  BookOpenText,
  Bot,
  CreditCard,
  FileCheck,
  Gauge,
  Globe,
  HelpCircle,
  Home,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
  Wallet,
} from 'lucide-react';

type AdminSidebarProps = {
  onNavigate?: () => void;
};

const menuItems = [
  { label: 'Dashboard', href: '/', icon: Gauge },
  { label: 'Utilisateurs', href: '/users', icon: Users },
  { label: 'KYC', href: '/kyc', icon: FileCheck },
  { label: 'Abonnements', href: '/subscriptions', icon: ShieldCheck },
  { label: 'Produits', href: '/products', icon: Package },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Commandes', href: '/orders', icon: ShoppingCart },
  { label: 'Mini-sites', href: '/mini-sites', icon: Globe },
  { label: 'Wallets', href: '/wallets', icon: Wallet },
  { label: 'Paiements', href: '/payments', icon: CreditCard },
  { label: 'Retraits', href: '/withdrawals', icon: Wallet },
  { label: 'Longrich Matin', href: '/longrich-matin', icon: BookOpenText },
  { label: 'Coach Longrich', href: '/coach', icon: Bot },
  { label: 'Tickets support', href: '/support', icon: HelpCircle },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Paramètres', href: '/settings', icon: Settings },
];

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full min-w-0 flex-col bg-white px-4 py-5">
      <Link
        href="/"
        onClick={onNavigate}
        className="mb-6 flex h-20 shrink-0 items-center px-2"
      >
        <Image
          src="/logo-cerapro.png"
          alt="Logo CERAPRO"
          width={300}
          height={100}
          priority
          className="h-auto max-h-50 w-auto object-contain"
        />
      </Link>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-color:var(--color-primary)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-primary)] [&::-webkit-scrollbar-thumb:hover]:bg-[var(--color-primary-dark)]">
        {menuItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)]'
              }`}
            >
              <Icon
                size={18}
                strokeWidth={2.4}
                className={`shrink-0 ${
                  isActive ? 'text-white' : 'text-[var(--color-text)]'
                }`}
              />
              <span className="min-w-0 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 shrink-0 rounded-3xl bg-[var(--color-primary-light)] p-4">
        <div className="flex min-w-0 items-center gap-2 text-sm font-black text-[var(--color-primary-dark)]">
          <Home size={17} className="shrink-0" />
          <span className="truncate">Centre de contrôle</span>
        </div>

        <p className="mt-2 text-xs font-semibold leading-5 text-[var(--color-text)]">
          Gestion globale : utilisateurs, contenus, paiements et supervision.
        </p>
      </div>
    </div>
  );
}