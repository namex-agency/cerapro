"use client";

import { theme } from "@/lib/theme";

export default function Hero() {
  return (
    <section className="relative w-full bg-white pb-28">
      <div
        className="relative mx-auto h-[650px] w-[88%] max-w-[1460px] overflow-hidden md:h-[690px]"
        style={{ backgroundColor: theme.colors.primary }}
      >
        {/* Image desktop */}
        <div
          className="absolute right-0 top-0 hidden h-full w-[56%] bg-cover bg-center bg-no-repeat md:block"
          style={{
            backgroundImage: "url('/hero-couple.jpg')",
          }}
        />

        {/* Image mobile */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{
            backgroundImage: "url('/hero-couple.jpg')",
          }}
        />

        {/* Dégradé desktop ultra doux */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, #2CA6A4 0%, #2CA6A4 42%, rgba(44,166,164,0.94) 52%, rgba(44,166,164,0.42) 66%, rgba(44,166,164,0.08) 82%, rgba(44,166,164,0) 100%)",
          }}
        />

        {/* Overlay mobile */}
        <div className="absolute inset-0 bg-black/35 md:hidden" />

        {/* Grand sourire blanc desktop */}
        <svg
          className="absolute left-[23%] top-[27%] z-10 hidden h-[160px] w-[37%] text-white md:block"
          viewBox="0 0 620 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M52 38C178 165 430 168 568 38"
            stroke="currentColor"
            strokeWidth="38"
            strokeLinecap="round"
          />
        </svg>

        {/* Texte hero */}
        <div className="relative z-20 flex h-full flex-col items-center justify-end px-6 pb-[126px] text-center text-white">
          <h1 className="max-w-[980px] text-[46px] font-black leading-[1.04] tracking-[-0.045em] md:text-[60px] lg:text-[68px]">
            Le pouvoir d’un sourire naturel
          </h1>

          <p className="mt-5 max-w-[1120px] text-[18px] font-bold leading-[1.45] md:text-[20px]">
            Améliorez votre santé bucco-dentaire avec Longsmile et découvrez
            une opportunité sérieuse avec Longrich.
          </p>
        </div>
      </div>

      {/* Carte flottante */}
      <div className="relative z-30 mx-auto -mt-[94px] w-[76%] max-w-[1120px]">
        <div className="rounded-[18px] bg-white px-12 py-7 shadow-[0_12px_30px_rgba(15,46,46,0.18)]">
          <h2
            className="text-center text-[24px] font-black leading-tight"
            style={{ color: theme.colors.primaryDark }}
          >
            Comment pouvons-nous vous aider ?
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1fr_150px] md:items-end">
            <div>
              <label className="text-[11px] font-black uppercase tracking-[0.25em] text-[#1D2B2B]">
                Quels sont vos besoins ?
              </label>

              <select className="mt-4 w-full border-0 border-b border-[#D5DDDD] bg-white pb-3 text-[16px] text-[#6B7373] outline-none">
                <option>Sélectionnez</option>
                <option>Dents plus blanches</option>
                <option>Haleine fraîche</option>
                <option>Santé des gencives</option>
                <option>Protection de l’émail</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase tracking-[0.25em] text-[#1D2B2B]">
                Quels sont vos objectifs ?
              </label>

              <select className="mt-4 w-full border-0 border-b border-[#D5DDDD] bg-white pb-3 text-[16px] text-[#6B7373] outline-none">
                <option>Sélectionnez</option>
                <option>Me sentir mieux</option>
                <option>Prendre soin de ma famille</option>
                <option>Gagner de l’argent avec Longrich</option>
              </select>
            </div>

            <button
              className="h-[46px] rounded-[5px] text-[14px] font-black text-white shadow-md transition hover:scale-[1.03] hover:shadow-xl"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Commencer →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}