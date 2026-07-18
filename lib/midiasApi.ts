import { Midia } from "./types";
import { supabase, supabaseConfigurado } from "./supabaseClient";
import { loadMidias as loadLocal, saveMidias as saveLocal } from "./storage";

const TABLE = "media";

function paraLinha(m: Midia) {
  return {
    id: m.id,
    title: m.nome,
    type: m.tipo,
    user_name: m.pessoa,
    season: m.temporada,
    episode: m.episodio,
    minutes: m.minutos,
    status: m.status,
    tmdb_id: m.tmdbId ?? null,
    last_season_seen: m.ultimaTemporadaVista ?? null,
    last_episode_seen: m.ultimoEpisodioVisto ?? null,
    news: m.novidade ?? null,
    tmdb_status: m.tmdbStatus ?? null,
  };
}

function daLinha(r: any): Midia {
  return {
    id: r.id,
    nome: r.title,
    tipo: r.type,
    pessoa: r.user_name,
    temporada: r.season,
    episodio: r.episode,
    minutos: r.minutes,
    status: r.status ?? "assistindo",
    tmdbId: r.tmdb_id ?? undefined,
    ultimaTemporadaVista: r.last_season_seen ?? undefined,
    ultimoEpisodioVisto: r.last_episode_seen ?? undefined,
    novidade: r.news ?? null,
    tmdbStatus: r.tmdb_status ?? undefined,
    criadoEm: r.created_at ?? undefined,
  };
}

export async function buscarMidias(): Promise<Midia[]> {
  if (!supabaseConfigurado || !supabase) {
    return loadLocal();
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar mídias do Supabase:", error.message);
    return loadLocal();
  }
  return (data || []).map(daLinha);
}

export async function salvarMidia(m: Midia): Promise<void> {
  if (!supabaseConfigurado || !supabase) {
    const atuais = loadLocal();
    const semEla = atuais.filter((x) => x.id !== m.id);
    saveLocal([m, ...semEla]);
    return;
  }
  const { error } = await supabase.from(TABLE).upsert(paraLinha(m));
  if (error) console.error("Erro ao salvar mídia no Supabase:", error.message);
}

export async function excluirMidia(id: string): Promise<void> {
  if (!supabaseConfigurado || !supabase) {
    saveLocal(loadLocal().filter((m) => m.id !== id));
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) console.error("Erro ao excluir mídia no Supabase:", error.message);
}
