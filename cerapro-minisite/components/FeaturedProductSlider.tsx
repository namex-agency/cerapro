"use client";

import { useEffect, useMemo, useState } from "react";
import { theme } from "@/lib/theme";

const slides = [
  {
    eyebrow: "LONGSMILE TOTAL",
    title: "20X PLUS EFFICACE*",
    description: "Pour agir à la source des problèmes bucco-dentaires",
    cta: "En savoir plus",
    image: "/products/dentifrice-the-blanc.png",
    alt: "Dentifrice Longrich au thé blanc",
  },
  {
    eyebrow: "LONGSMILE FRESH",
    title: "UNE HALEINE FRAÎCHE PLUS LONGTEMPS*",
    description: "Pour garder confiance à chaque conversation",
    cta: "Découvrir le spray",
    image: "/products/spray-de-bouche.png",
    alt: "Spray de bouche Longrich",
  },
  {
    eyebrow: "LONGSMILE CARE",
    title: "UN NETTOYAGE PLUS PRÉCIS*",
    description: "Pour accompagner votre routine bucco-dentaire quotidienne",
    cta: "Voir la brosse",
    image: "/products/brosse-a-dents.png",
    alt: "Brosse à dents Longrich",
  },
];

export default function FeaturedProductSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  function goNext() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  function goPrev() {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    );
  }

  return (
    <section id="produits" className="relative bg-white px-5 py-20 md:py-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="relative">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Produit précédent"
            className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl font-black shadow-[0_8px_25px_rgba(15,46,46,0.16)] transition hover:scale-110 md:flex"
            style={{ color: theme.colors.primaryDark }}
          >
            ←
          </button>

          <article className="grid min-h-[520px] overflow-hidden rounded-[20px] bg-white shadow-[0_16px_45px_rgba(15,46,46,0.10)] ring-1 ring-black/5 md:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center px-8 py-12 md:px-16 lg:px-20">
              <p className="text-[14px] font-black uppercase tracking-[0.18em] text-black">
                {activeSlide.eyebrow}
              </p>

              <h2
                className="mt-7 max-w-xl text-[34px] font-black leading-[1.05] tracking-[-0.03em] md:text-[44px]"
                style={{ color: theme.colors.primaryDark }}
              >
                {activeSlide.title}
              </h2>

              <p className="mt-8 max-w-xl text-[19px] leading-[1.6] text-black">
                {activeSlide.description}
              </p>

              <button
                className="mt-12 w-fit rounded-[6px] px-7 py-4 text-[15px] font-black text-white shadow-md transition hover:scale-[1.03]"
                style={{ backgroundColor: theme.colors.primary }}
              >
                {activeSlide.cta}
              </button>
            </div>

            <div className="relative flex min-h-[320px] items-center justify-center bg-[#F6FAFA] px-8 py-10 md:min-h-full">
              <div
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(44,166,164,0.18), rgba(255,255,255,0) 58%)",
                }}
              />

              <img
                key={activeSlide.image}
                src={activeSlide.image}
                alt={activeSlide.alt}
                className="relative z-10 max-h-[360px] w-auto max-w-[82%] object-contain transition duration-700"
              />
            </div>
          </article>

          <button
            type="button"
            onClick={goNext}
            aria-label="Produit suivant"
            className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl font-black shadow-[0_8px_25px_rgba(15,46,46,0.16)] transition hover:scale-110 md:flex"
            style={{ color: theme.colors.primaryDark }}
          >
            →
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Afficher ${slide.alt}`}
              onClick={() => setActiveIndex(index)}
              className="h-2.5 rounded-full transition-all"
              style={{
                width: activeIndex === index ? 42 : 24,
                backgroundColor:
                  activeIndex === index
                    ? theme.colors.primary
                    : theme.colors.border,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}