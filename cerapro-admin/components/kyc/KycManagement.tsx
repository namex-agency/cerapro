"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  ShieldAlert,
  X,
  XCircle,
} from "lucide-react";

import {
  approveAdminKyc,
  getAdminKycProfiles,
  rejectAdminKyc,
} from "@/lib/api";

type KycStatus = "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";

type AdminKycProfile = {
  id: string;
  userId: string;
  status: KycStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  selfieUrl: string | null;
  cniFrontUrl: string | null;
  cniBackUrl: string | null;
  user: {
    fullName: string;
    phone: string;
    country: string;
    city: string;
    district?: string;
    placeName?: string;
    birthDate?: string | null;
    birthPlace?: string;
  };
};

function getStatusLabel(status: KycStatus) {
  if (status === "APPROVED") return "Validé";
  if (status === "PENDING") return "En attente";
  if (status === "REJECTED") return "Rejeté";
  return "Non commencé";
}

function getStatusClass(status: KycStatus) {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-700";
  if (status === "PENDING") return "bg-yellow-50 text-yellow-700";
  if (status === "REJECTED") return "bg-red-50 text-red-600";
  return "bg-slate-100 text-slate-600";
}

function getStatusIcon(status: KycStatus) {
  if (status === "APPROVED") return CheckCircle2;
  if (status === "PENDING") return Clock;
  if (status === "REJECTED") return XCircle;
  return ShieldAlert;
}

export default function KycManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [kycProfiles, setKycProfiles] = useState<AdminKycProfile[]>([]);
  const [selectedKyc, setSelectedKyc] = useState<AdminKycProfile | null>(null);

  async function loadKycProfiles() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getAdminKycProfiles();

      setKycProfiles(response.data);
    } catch {
      setErrorMessage("Impossible de charger les dossiers KYC.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadKycProfiles();
  }, []);

  async function handleApprove(userId: string) {
    if (isActionLoading) return;

    const confirmed = window.confirm("Confirmer la validation de ce KYC ?");

    if (!confirmed) return;

    try {
      setIsActionLoading(true);

      await approveAdminKyc(userId);
      await loadKycProfiles();

      setSelectedKyc(null);
    } catch {
      alert("Erreur lors de la validation du KYC.");
    } finally {
      setIsActionLoading(false);
    }
  }

  async function handleReject(userId: string) {
    if (isActionLoading) return;

    const reason = window.prompt("Motif de rejet ?");

    if (!reason?.trim()) return;

    try {
      setIsActionLoading(true);

      await rejectAdminKyc(userId, reason.trim());
      await loadKycProfiles();

      setSelectedKyc(null);
    } catch {
      alert("Erreur lors du rejet du KYC.");
    } finally {
      setIsActionLoading(false);
    }
  }

  const stats = useMemo(() => {
    return {
      total: kycProfiles.length,
      pending: kycProfiles.filter((kyc) => kyc.status === "PENDING").length,
      approved: kycProfiles.filter((kyc) => kyc.status === "APPROVED").length,
      rejected: kycProfiles.filter((kyc) => kyc.status === "REJECTED").length,
    };
  }, [kycProfiles]);

  return (
    <section className="space-y-6">
      <KycDetailsDrawer
        kyc={selectedKyc}
        isActionLoading={isActionLoading}
        onClose={() => setSelectedKyc(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-primary)]">
          KYC
        </p>

        <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
          Vérification des Longricheurs
        </h1>

        <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-[var(--color-muted)]">
          Consultez, validez ou rejetez les dossiers KYC soumis par les
          Longricheurs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KycStatCard label="Total dossiers" value={stats.total} />
        <KycStatCard label="En attente" value={stats.pending} />
        <KycStatCard label="Validés" value={stats.approved} />
        <KycStatCard label="Rejetés" value={stats.rejected} />
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <p className="text-sm font-black text-[var(--color-muted)]">
            Chargement des dossiers KYC...
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-black text-red-600">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage ? (
        <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead className="bg-slate-50">
                <tr className="text-xs font-black uppercase tracking-wide text-[var(--color-muted)]">
                  <th className="px-6 py-4">Longricheur</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Ville</th>
                  <th className="px-6 py-4">Statut KYC</th>
                  <th className="px-6 py-4">Documents</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/5">
                {kycProfiles.map((kyc) => {
                  const StatusIcon = getStatusIcon(kyc.status);

                  return (
                    <tr
                      key={kyc.id}
                      className="align-middle transition hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-black text-[var(--color-text)]">
                          {kyc.user.fullName}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-[var(--color-muted)]">
                          {kyc.user.phone}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-[var(--color-muted)]">
                          {kyc.user.city}, {kyc.user.country}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                            kyc.status
                          )}`}
                        >
                          <StatusIcon size={13} />
                          {getStatusLabel(kyc.status)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <DocumentBadge label="Selfie" ok={!!kyc.selfieUrl} />
                          <DocumentBadge
                            label="CNI recto"
                            ok={!!kyc.cniFrontUrl}
                          />
                          <DocumentBadge
                            label="CNI verso"
                            ok={!!kyc.cniBackUrl}
                          />
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedKyc(kyc)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] transition hover:bg-[var(--color-primary)] hover:text-white"
                            title="Voir le dossier"
                          >
                            <Eye size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function KycDetailsDrawer({
  kyc,
  isActionLoading,
  onClose,
  onApprove,
  onReject,
}: {
  kyc: AdminKycProfile | null;
  isActionLoading: boolean;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}) {
  if (!kyc) return null;

  const StatusIcon = getStatusIcon(kyc.status);
  const canReview = kyc.status === "PENDING";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 p-4 backdrop-blur-sm">
      <aside className="flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/5 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--color-primary)]">
              Dossier KYC
            </p>

            <h2 className="mt-1 text-xl font-black text-[var(--color-text)]">
              {kyc.user.fullName}
            </h2>

            <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">
              {kyc.user.phone}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            aria-label="Fermer le dossier KYC"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="rounded-3xl border border-black/5 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-[var(--color-muted)]">
              Statut actuel
            </p>

            <span
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                kyc.status
              )}`}
            >
              <StatusIcon size={13} />
              {getStatusLabel(kyc.status)}
            </span>

            {kyc.rejectionReason ? (
              <p className="mt-3 text-sm font-semibold text-red-600">
                Motif : {kyc.rejectionReason}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard label="Pays" value={kyc.user.country} />
            <InfoCard label="Ville" value={kyc.user.city} />
            <InfoCard
              label="Quartier"
              value={kyc.user.district || "À compléter"}
            />
            <InfoCard
              label="Lieu dit"
              value={kyc.user.placeName || "À compléter"}
            />
            <InfoCard
              label="Date de naissance"
              value={
                kyc.user.birthDate
                  ? String(kyc.user.birthDate).slice(0, 10)
                  : "À compléter"
              }
            />
            <InfoCard
              label="Lieu de naissance"
              value={kyc.user.birthPlace || "À compléter"}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <KycImageCard title="Selfie" imageUrl={kyc.selfieUrl} />
            <KycImageCard title="CNI recto" imageUrl={kyc.cniFrontUrl} />
            <KycImageCard title="CNI verso" imageUrl={kyc.cniBackUrl} />
          </div>
        </div>

        <div className="flex gap-3 border-t border-black/5 p-5">
          <button
            type="button"
            disabled={!canReview || isActionLoading}
            onClick={() => onApprove(kyc.userId)}
            className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isActionLoading ? "Traitement..." : "Valider KYC"}
          </button>

          <button
            type="button"
            disabled={!canReview || isActionLoading}
            onClick={() => onReject(kyc.userId)}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Rejeter
          </button>
        </div>
      </aside>
    </div>
  );
}

function KycStatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-[var(--color-muted)]">{label}</p>
      <h2 className="mt-1 text-2xl font-black text-[var(--color-text)]">
        {value.toLocaleString()}
      </h2>
    </div>
  );
}

function DocumentBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-black ${
        ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      {label}
    </span>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-[var(--color-muted)]">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}

function KycImageCard({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 bg-slate-50">
      <div className="border-b border-black/5 p-4">
        <p className="text-sm font-black text-[var(--color-text)]">{title}</p>
      </div>

      {imageUrl ? (
        <a href={imageUrl} target="_blank" rel="noreferrer">
          <img
            src={imageUrl}
            alt={title}
            className="h-56 w-full object-cover transition hover:scale-[1.02]"
          />
        </a>
      ) : (
        <div className="flex h-56 items-center justify-center p-5 text-center">
          <p className="text-sm font-bold text-[var(--color-muted)]">
            Image non fournie
          </p>
        </div>
      )}
    </div>
  );
}