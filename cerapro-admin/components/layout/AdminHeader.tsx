'use client';

import { Bell, Menu, Search, UserRound } from 'lucide-react';

type AdminHeaderProps = {
  onOpenSidebar?: () => void;
};

export function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-xl">
      <div className="flex w-full flex-col gap-4 px-4 py-4 sm:px-5 lg:px-6">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              aria-label="Ouvrir le menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-primary-dark)] shadow-sm ring-1 ring-[var(--color-border)] transition hover:bg-[var(--color-primary-light)] lg:hidden"
            >
              <Menu size={24} strokeWidth={2.7} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-primary-dark)] sm:text-[11px]">
                CERAPRO ADMIN
              </p>

              <h1 className="mt-1 text-base font-black leading-tight tracking-tight text-[var(--color-text)] sm:text-xl lg:text-2xl">
                <span className="hidden sm:inline">Bonne gestion de CERAPRO</span>
                <span className="sm:hidden">Bonne gestion</span>
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Notifications admin"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-primary-dark)] transition hover:bg-[var(--color-primary-light)]"
            >
              <Bell size={24} strokeWidth={2.6} />
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-danger)] px-1 text-[10px] font-black text-white">
                3
              </span>
            </button>

            <button
              type="button"
              aria-label="Profil administrateur"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-sm transition hover:scale-105 hover:bg-[var(--color-primary-dark)]"
            >
              <UserRound size={22} strokeWidth={2.6} />
            </button>
          </div>
        </div>

        <label className="flex h-12 w-full min-w-0 items-center gap-3 rounded-full bg-white px-4 shadow-sm ring-1 ring-[var(--color-border)] transition focus-within:ring-2 focus-within:ring-[var(--color-primary)] lg:mx-auto lg:max-w-xl">
          <Search
            size={19}
            strokeWidth={2.5}
            className="shrink-0 text-[var(--color-text-muted)]"
          />

          <input
            type="text"
            placeholder="Rechercher..."
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </label>
      </div>
    </header>
  );
}