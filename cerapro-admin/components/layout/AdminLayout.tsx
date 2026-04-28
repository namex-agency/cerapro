"use client";

import { useState } from "react";

import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--color-background)]">
      <div className="flex h-full w-full overflow-hidden">
        <aside className="hidden h-full w-72 shrink-0 overflow-hidden border-r border-[var(--color-border)] bg-white lg:block">
          <AdminSidebar />
        </aside>

        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden"
          />
        ) : null}

        <aside
          className={`fixed left-0 top-0 z-50 h-full w-[82vw] max-w-[320px] overflow-hidden bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
        </aside>

        <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

          <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-5 lg:px-6 [scrollbar-color:var(--color-primary)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-primary)] [&::-webkit-scrollbar-thumb:hover]:bg-[var(--color-primary-dark)]">
            {children}
          </main>
        </section>
      </div>
    </div>
  );
}