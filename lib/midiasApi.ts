import { Midia } from "./types";
import { supabase, supabaseConfigurado } from "./supabaseClient";
import { loadMidias as loadLocal, saveMidias as saveLocal } from "./storage";

const TABLE = "midias";

function paraLinha(m: Midia) {
  return {
    id: m.id,
    nome: m.nome,
    tipo: m.tipo,
    pessoa: m.pessoa,
    temporada: m.temporada,
    episodio: m.episodio,
    minutos: m.minutos,
    status: m.status,
    tmdb_id: m.tmdbId ?? null,
    ultima_temporada_vista: m.ultimaTemporadaVista ?? null,
    ultimo_episodio_visto: m.ultimoEpisodioVisto ?? null,
    novidade: m.novidade ?? null,
    tmdb_status: m.tmdbStatus ?? null,
  };
}

function daLinha(r: any): Midia {
  return {
    id: r.id,
    nome: r.nome,
    tipo: r.tipo,
    pessoa: r.pessoa,
    temporada: r.temporada,
    episodio: r.episodio,
    minutos: r.minutos,
    status: r.status,
    tmdbId: r.tmdb_id ?? undefined,
    ultimaTemporadaVista: r.ultima_temporada_vista ?? undefined,
    ultimoEpisodioVisto: r.ultimo_episodio_visto ?? undefined,
    novidade: r.novidade ?? null,
    tmdbStatus: r.tmdb_status ?? undefined,
    criadoEm: r.criado_em ?? undefined,
  };
}

export async function buscarMidias(): Promise<Midia[]> {
  if (!supabaseConfigurado || !supabase) {
    return loadLocal();
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("criado_em", { ascending: false });
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
