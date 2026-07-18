import { Midia, Novidade } from "./types";

const BASE_URL = "https://api.themoviedb.org/3";

export interface TmdbSearchResult {
  id: number;
  name: string;
  first_air_date?: string;
  poster_path?: string | null;
}

export async function buscarSerie(
  nome: string,
  apiKey: string
): Promise<TmdbSearchResult[]> {
  const url = `${BASE_URL}/search/tv?query=${encodeURIComponent(
    nome
  )}&language=pt-BR&api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao buscar série no TMDB");
  const data = await res.json();
  return data.results || [];
}

export interface TmdbTvDetails {
  id: number;
  status: string; // "Returning Series" | "Ended" | "Canceled" | ...
  last_episode_to_air: {
    season_number: number;
    episode_number: number;
    air_date: string;
  } | null;
  next_episode_to_air: {
    season_number: number;
    episode_number: number;
    air_date: string;
  } | null;
}

export async function buscarDetalhesSerie(
  tmdbId: number,
  apiKey: string
): Promise<TmdbTvDetails> {
  const url = `${BASE_URL}/tv/${tmdbId}?language=pt-BR&api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao buscar detalhes da série no TMDB");
  return res.json();
}

/**
 * Compara o que já foi assistido com o que saiu de mais novo no TMDB
 * e retorna qual "novidade" deve aparecer no card (se houver).
 */
export function calcularNovidade(
  midia: Midia,
  detalhes: TmdbTvDetails
): { novidade: Novidade; tmdbStatus: string } {
  const ultimaTemp = midia.ultimaTemporadaVista ?? midia.temporada;
  const ultimoEp = midia.ultimoEpisodioVisto ?? midia.episodio;

  const lancado = detalhes.last_episode_to_air;
  let novidade: Novidade = null;

  if (lancado) {
    if (lancado.season_number > ultimaTemp) {
      novidade = "nova_temporada";
    } else if (
      lancado.season_number === ultimaTemp &&
      lancado.episode_number > ultimoEp
    ) {
      novidade = "novo_episodio";
    }
  }

  return { novidade, tmdbStatus: detalhes.status };
}
