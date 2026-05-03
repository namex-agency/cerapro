"use client";

import { useMemo, useState } from "react";
import { theme } from "@/lib/theme";

type CategoryKey =
  | "bucco"
  | "beaute"
  | "bienetre"
  | "detox"
  | "hygiene"
  | "business";

type Product = {
  name: string;
  description: string;
  price: string;
  rating: string;
  reviews: string;
  image: string;
};

const categories: { key: CategoryKey; label: string; viewAllLabel: string }[] = [
  {
    key: "bucco",
    label: "Bucco-dentaire",
    viewAllLabel: "Voir tous les produits bucco-dentaires",
  },
  {
    key: "beaute",
    label: "Beauté & peau",
    viewAllLabel: "Voir tous les produits beauté & peau",
  },
  {
    key: "bienetre",
    label: "Bien-être",
    viewAllLabel: "Voir tous les produits bien-être",
  },
  {
    key: "detox",
    label: "Minceur & détox",
    viewAllLabel: "Voir tous les produits minceur & détox",
  },
  {
    key: "hygiene",
    label: "Hygiène maison",
    viewAllLabel: "Voir tous les produits d’hygiène maison",
  },
  {
    key: "business",
    label: "Opportunité",
    viewAllLabel: "Voir toutes les offres partenaire",
  },
];

const productsByCategory: Record<CategoryKey, Product[]> = {
  bucco: [
    {
      name: "Pâte dentifrice au thé blanc",
      description:
        "Une routine quotidienne pour une bouche fraîche, des dents propres et un sourire plus confiant.",
      price: "Dès 2 000 FCFA",
      rating: "4.8",
      reviews: "128",
      image: "/products/dentifrice-the-blanc.png",
    },
    {
      name: "Pâte dentifrice Artémisia",
      description:
        "Une formule bucco-dentaire premium pensée pour la fraîcheur, les gencives et le confort quotidien.",
      price: "Dès 2 600 FCFA",
      rating: "4.7",
      reviews: "96",
      image: "/products/dentifrice-artemisia.png",
    },
    {
      name: "Brosse à dents Longrich",
      description:
        "L’accessoire essentiel pour accompagner une routine dentaire simple, régulière et professionnelle.",
      price: "1 200 FCFA",
      rating: "4.6",
      reviews: "74",
      image: "/products/brosse-a-dents.png",
    },
    {
      name: "Parfum de bouche",
      description:
        "Une solution pratique pour garder une haleine fraîche à tout moment, même en déplacement.",
      price: "3 100 FCFA",
      rating: "4.8",
      reviews: "112",
      image: "/products/spray-de-bouche.png",
    },
  ],

  beaute: [
    {
      name: "Savon noir charbon de bambou",
      description:
        "Un soin nettoyant apprécié pour les routines visage et corps, avec une sensation de peau nette.",
      price: "6 200 FCFA",
      rating: "4.9",
      reviews: "143",
      image: "/products/savon-noir.png",
    },
    {
      name: "Lait de corps SOD",
      description:
        "Un soin corporel doux pour aider la peau à rester hydratée, souple et confortable.",
      price: "4 500 FCFA",
      rating: "4.7",
      reviews: "87",
      image: "/products/lait-de-corps.png",
    },
    {
      name: "Lotion rajeunissante",
      description:
        "Une lotion premium pour une sensation de peau plus fraîche, plus douce et plus lumineuse.",
      price: "4 000 FCFA",
      rating: "4.8",
      reviews: "105",
      image: "/products/lotion-rajeunissante.png",
    },
    {
      name: "Crème de main réparatrice",
      description:
        "Un soin pratique pour garder les mains douces, hydratées et agréablement parfumées.",
      price: "3 700 FCFA",
      rating: "4.6",
      reviews: "61",
      image: "/products/creme-main.png",
    },
  ],

  bienetre: [
    {
      name: "Vitamine C Longrich",
      description:
        "Un complément orienté vitalité pour accompagner la forme et l’équilibre au quotidien.",
      price: "10 500 FCFA",
      rating: "4.7",
      reviews: "118",
      image: "/products/vitamine-c.png",
    },
    {
      name: "Berry Oil",
      description:
        "Un produit premium associé au bien-être général, à l’énergie et à la nutrition.",
      price: "30 500 FCFA",
      rating: "4.9",
      reviews: "164",
      image: "/products/berry-oil.png",
    },
    {
      name: "Cordyceps Militaris",
      description:
        "Un produit phare Longrich positionné sur le tonus, l’énergie et le bien-être global.",
      price: "75 000 FCFA",
      rating: "4.9",
      reviews: "201",
      image: "/products/cordyceps.png",
    },
    {
      name: "Calcium",
      description:
        "Un complément associé aux besoins en calcium, zinc, fer et magnésium.",
      price: "11 000 FCFA",
      rating: "4.6",
      reviews: "79",
      image: "/products/calcium.png",
    },
  ],

  detox: [
    {
      name: "Thé minceur",
      description:
        "Une infusion Longrich pensée pour accompagner une routine minceur simple et régulière.",
      price: "6 200 FCFA",
      rating: "4.7",
      reviews: "91",
      image: "/products/the-minceur.png",
    },
    {
      name: "Thé vert détox",
      description:
        "Une routine détox légère pour accompagner l’équilibre et le confort digestif.",
      price: "6 200 FCFA",
      rating: "4.8",
      reviews: "109",
      image: "/products/the-vert.png",
    },
    {
      name: "Thé tension",
      description:
        "Une infusion positionnée sur l’équilibre, le confort et le bien-être quotidien.",
      price: "6 200 FCFA",
      rating: "4.6",
      reviews: "73",
      image: "/products/the-tension.png",
    },
    {
      name: "Gobelet alcalin",
      description:
        "Un accessoire premium pour intégrer une routine eau alcaline au quotidien.",
      price: "50 000 FCFA",
      rating: "4.8",
      reviews: "132",
      image: "/products/gobelet-alcalin.png",
    },
  ],

  hygiene: [
    {
      name: "Détergent liquide Artémisia",
      description:
        "Une solution maison pour nettoyer efficacement les vêtements et garder une sensation de fraîcheur.",
      price: "6 000 FCFA",
      rating: "4.7",
      reviews: "84",
      image: "/products/detergent-artemisia.png",
    },
    {
      name: "Savon antibactérien",
      description:
        "Un savon pratique pour l’hygiène quotidienne et l’entretien textile ciblé.",
      price: "2 700 FCFA",
      rating: "4.6",
      reviews: "68",
      image: "/products/savon-antibacterien.png",
    },
    {
      name: "Savon sous-vêtements",
      description:
        "Un produit conçu pour l’entretien ciblé des sous-vêtements et textiles délicats.",
      price: "2 700 FCFA",
      rating: "4.7",
      reviews: "76",
      image: "/products/savon-sous-vetements.png",
    },
    {
      name: "Détergent en poudre",
      description:
        "Une solution lessive pour redonner fraîcheur et propreté aux vêtements du quotidien.",
      price: "Prix catalogue",
      rating: "4.5",
      reviews: "52",
      image: "/products/detergent-poudre.png",
    },
  ],

  business: [
    {
      name: "Kit de base",
      description:
        "Un point d’entrée simple pour découvrir l’opportunité Longrich et commencer son activité.",
      price: "85 000 FCFA",
      rating: "4.8",
      reviews: "137",
      image: "/products/kit-base.png",
    },
    {
      name: "Kit Silver",
      description:
        "Une formule structurée pour lancer son activité avec plus de volume et de crédibilité.",
      price: "160 000 FCFA",
      rating: "4.8",
      reviews: "122",
      image: "/products/kit-silver.png",
    },
    {
      name: "Kit Combo Millionnaire",
      description:
        "Un pack business premium pour construire une activité Longrich plus ambitieuse.",
      price: "Dès 220 000 FCFA",
      rating: "4.9",
      reviews: "176",
      image: "/products/kit-combo.png",
    },
    {
      name: "Accompagnement partenaire",
      description:
        "Un accompagnement pour mieux démarrer, vendre, suivre ses prospects et structurer son réseau.",
      price: "Sur demande",
      rating: "4.9",
      reviews: "94",
      image: "/products/accompagnement.png",
    },
  ],
};

function Stars() {
  return (
    <div className="flex items-center gap-0.5 text-[18px] leading-none text-[#F4B400]">
      <span>★</span>
      <span>★</span>
      <span>★</span>
      <span>★</span>
      <span>★</span>
    </div>
  );
}

export default function Produitsetsolutions() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("bucco");

  const activeProducts = useMemo(() => {
    return productsByCategory[activeCategory];
  }, [activeCategory]);

  const activeViewAllLabel = useMemo(() => {
    return categories.find((category) => category.key === activeCategory)
      ?.viewAllLabel;
  }, [activeCategory]);

  return (
    <section id="produits" className="bg-white px-6 py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        {/* Titre */}
        <div className="text-center">
          <h2 className="text-[30px] font-black tracking-tight text-slate-950 md:text-[34px]">
            Produits & solutions
          </h2>
        </div>

        {/* Catégories */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => {
            const isActive = category.key === activeCategory;

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className="rounded-full border px-5 py-2 text-sm font-bold transition duration-200"
                style={{
                  borderColor: theme.colors.primary,
                  backgroundColor: isActive ? theme.colors.primary : "white",
                  color: isActive ? "white" : theme.colors.primary,
                }}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Produits */}
        <div className="mt-20 grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-4">
          {activeProducts.map((product) => (
            <article key={product.name} className="flex flex-col">
              {/* Cadre photo */}
              <div className="flex h-[248px] items-center justify-center rounded-[22px] border border-[#eadfdb] bg-white p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[180px] max-w-full object-contain"
                />
              </div>

              {/* Prix juste sous la photo */}
              <p
                className="mt-5 text-[15px] font-black"
                style={{ color: theme.colors.primary }}
              >
                {product.price}
              </p>

              {/* Titre */}
              <h3 className="mt-3 min-h-[56px] text-[20px] font-black leading-[1.25] text-slate-950">
                {product.name}
              </h3>

              {/* Description */}
              <p className="mt-3 min-h-[92px] text-[14px] font-medium leading-6 text-slate-700">
                {product.description}
              </p>

              {/* Notes */}
              <div className="mt-4 flex items-center gap-2">
                <Stars />

                <span className="text-[14px] font-black text-slate-950">
                  {product.rating}
                </span>

                <span
                  className="text-[14px] font-black"
                  style={{ color: theme.colors.primary }}
                >
                  ({product.reviews})
                </span>
              </div>

              {/* Actions */}
              <div className="mt-9 flex items-center gap-6">
                <a
                  href="#commande"
                  className="inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-[14px] font-black text-white transition hover:opacity-90"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Acheter maintenant
                </a>

                <a
                  href="#details"
                  className="text-[14px] font-black transition hover:opacity-75"
                  style={{ color: theme.colors.primary }}
                >
                  Détails
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Voir tous les produits */}
        <div className="mt-20 flex justify-center">
          <a
            href="#catalogue"
            className="group inline-flex items-center gap-3 text-[15px] font-black transition hover:opacity-80"
            style={{ color: theme.colors.primary }}
          >
            <span>{activeViewAllLabel}</span>

            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-white transition group-hover:translate-x-1"
              style={{ backgroundColor: theme.colors.primary }}
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}