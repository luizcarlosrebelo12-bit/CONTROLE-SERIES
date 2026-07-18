import { Midia } from "./types";

const MIDIAS_KEY = "controle-series:midias";
const TMDB_KEY = "controle-series:tmdb-key";

export function loadMidias(): Midia[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MIDIAS_KEY);
    return raw ? (JSON.parse(raw) as Midia[]) : [];
  } catch {
    return [];
  }
}

export function saveMidias(midias: Midia[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MIDIAS_KEY, JSON.stringify(midias));
}

export function loadTmdbKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TMDB_KEY) || "";
}

export function saveTmdbKey(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TMDB_KEY, key);
}
