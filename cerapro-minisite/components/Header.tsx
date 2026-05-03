"use client";

import { theme } from "@/lib/theme";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.10)]"
      style={{
        backgroundColor: `${theme.colors.primary}CC`,
      }}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logo Longsmile */}
        <a href="/" className="flex flex-col items-start leading-none">
          <span className="text-3xl font-black tracking-tight text-white md:text-[34px]">
            Longsmile
          </span>

          {/* Smile SVG */}
          <svg
            width="112"
            height="22"
            viewBox="0 0 112 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mt-1"
          >
            <path
              d="M8 4C25 20 78 20 104 4"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        </a>

        {/* Menu desktop */}
        <nav className="hidden items-center gap-8 text-sm font-black uppercase tracking-wide lg:flex">
          <a href="#produits" className="text-white transition hover:opacity-80">
            Produits
          </a>

          <a href="#sante" className="text-white transition hover:opacity-80">
            Santé bucco-dentaire
          </a>

          <a
            href="#opportunite"
            className="text-white transition hover:opacity-80"
          >
            Opportunité
          </a>

          <a
            href="#partenaire"
            className="text-white transition hover:opacity-80"
          >
            Devenir partenaire
          </a>

          <a
            href="#espace"
            className="rounded-full border border-white/80 px-6 py-2.5 text-white transition hover:bg-white hover:text-[#2CA6A4]"
          >
            Mon espace
          </a>
        </nav>

        {/* Bouton mobile — sans cercle */}
        <button
          type="button"
          aria-label="Ouvrir le menu"
          className="flex items-center justify-center text-white transition hover:opacity-80 lg:hidden"
        >
          <span className="text-[42px] font-light leading-none">☰</span>
        </button>
      </div>
    </header>
  );
}