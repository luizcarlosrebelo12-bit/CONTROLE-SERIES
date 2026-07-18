export type StatusSerie =
  | "assistindo"
  | "finalizado"
  | "aguardando_temporada"
  | "pausado";

export type Novidade = "novo_episodio" | "nova_temporada" | null;

export interface Midia {
  id: string;
  nome: string;
  tipo: "serie" | "filme";
  pessoa: string;
  temporada: number;
  episodio: number;
  minutos: number;
  status: StatusSerie;
  tmdbId?: number;
  ultimaTemporadaVista?: number;
  ultimoEpisodioVisto?: number;
  novidade?: Novidade;
  tmdbStatus?: string;
  criadoEm?: string;
}

export const STATUS_LABELS: Record<StatusSerie, string> = {
  assistindo: "Assistindo",
  finalizado: "Finalizado",
  aguardando_temporada: "Aguardando nova temporada",
  pausado: "Pausado",
};

export const STATUS_COLORS: Record<StatusSerie, string> = {
  assistindo: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  finalizado: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  aguardando_temporada: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  pausado: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};
