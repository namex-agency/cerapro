"use client";

import { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://cerapro-production.up.railway.app";

export default function AdminLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanPhone = phone.replace(/\s+/g, "").trim();
    const cleanPassword = password.trim();

    if (!cleanPhone || !cleanPassword) {
      setErrorMessage("Numéro et mot de passe obligatoires.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: cleanPhone,
          password: cleanPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Connexion admin impossible.");
      }

      const accessToken = result?.data?.accessToken;
      const user = result?.data?.user;

      if (!accessToken || !user?.id) {
        throw new Error("Session admin invalide.");
      }

      localStorage.setItem("cerapro_admin_token", accessToken);
      localStorage.setItem("cerapro_admin_user", JSON.stringify(user));

      window.location.href = "/";
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Connexion admin impossible."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--color-primary)]">
            CERAPRO Admin
          </p>

          <h1 className="mt-3 text-2xl font-black text-[var(--color-text)]">
            Connexion administrateur
          </h1>

          <p className="mt-2 text-sm font-medium leading-6 text-[var(--color-muted)]">
            Accès réservé aux administrateurs CERAPRO autorisés.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-black text-[var(--color-text)]">
              Numéro WhatsApp
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Ex : 690000000"
              className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
            />
          </div>

          <div>
            <label className="text-sm font-black text-[var(--color-text)]">
              Mot de passe
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Votre mot de passe admin"
              className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-slate-50 px-4 text-sm font-bold outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-3">
              <p className="text-sm font-black text-red-600">
                {errorMessage}
              </p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-2xl bg-[var(--color-primary)] px-4 text-sm font-black text-white transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </section>
    </main>
  );
}