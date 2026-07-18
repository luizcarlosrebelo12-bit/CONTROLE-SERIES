import { STATUS_COLORS, STATUS_LABELS, StatusSerie } from "@/lib/types";

export function StatusBadge({ status }: { status: StatusSerie }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function NovidadeBadge({
  novidade,
}: {
  novidade: "novo_episodio" | "nova_temporada";
}) {
  const isTemporada = novidade === "nova_temporada";
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse ${
        isTemporada
          ? "bg-green-500/20 text-green-400 border border-green-500/40"
          : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
      }`}
    >
      {isTemporada ? "NOVA TEMPORADA" : "NOVO EP"}
    </span>
  );
}
