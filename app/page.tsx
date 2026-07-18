"use client";

import { useEffect, useMemo, useState } from "react";
import { Midia, StatusSerie } from "@/lib/types";
import { loadMidias, saveMidias, loadTmdbKey, saveTmdbKey } from "@/lib/storage";
import { SeriesCard } from "@/components/SeriesCard";
import { AddSeriesForm } from "@/components/AddSeriesForm";
import { TmdbSettings } from "@/components/TmdbSettings";
import { buscarSerie, buscarDetalhesSerie, calcularNovidade } from "@/lib/tmdb";

export default function Page() {
  const [midias, setMidias] = useState<Midia[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [checando, setChecando] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMidias(loadMidias());
    setApiKey(loadTmdbKey());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveMidias(midias);
  }, [midias, loaded]);

  const stats = useMemo(() => {
    const series = midias.filter((m) => m.tipo === "serie").length;
    const filmes = midias.filter((m) => m.tipo === "filme").length;
    const minutos = midias.reduce((acc, m) => acc + (m.minutos || 0), 0);
    return { series, filmes, horas: Math.round(minutos / 60) };
  }, [midias]);

  function handleAdd(nova: Midia) {
    setMidias((prev) => [nova, ...prev]);
  }

  function handleDelete(id: string) {
    setMidias((prev) => prev.filter((m) => m.id !== id));
  }

  function handleUpdateStatus(id: string, status: StatusSerie) {
    setMidias((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  }

  function handleMarcarVisto(id: string) {
    setMidias((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              temporada: m.ultimaTemporadaVista ?? m.temporada,
              episodio: m.ultimoEpisodioVisto ?? m.episodio,
              novidade: null,
            }
          : m
      )
    );
  }

  async function checarNovidades() {
    if (!apiKey) {
      alert("Configure sua chave da API do TMDB primeiro.");
      return;
    }
    setChecando(true);
    try {
      const atualizadas = await Promise.all(
        midias
          .filter((m) => m.tipo === "serie")
          .map(async (m) => {
            try {
              let tmdbId = m.tmdbId;
              if (!tmdbId) {
                const resultados = await buscarSerie(m.nome, apiKey);
                if (resultados.length === 0) return m;
                tmdbId = resultados[0].id;
              }
              const detalhes = await buscarDetalhesSerie(tmdbId, apiKey);
              const { novidade, tmdbStatus } = calcularNovidade(m, detalhes);
              return { ...m, tmdbId, novidade, tmdbStatus };
            } catch {
              return m;
            }
          })
      );
      setMidias((prev) =>
        prev.map((m) => atualizadas.find((a) => a.id === m.id) || m)
      );
    } finally {
      setChecando(false);
    }
  }

  function handleSaveKey(key: string) {
    setApiKey(key);
    saveTmdbKey(key);
  }

  return (
    <main className="min-h-screen bg-base-bg pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-luiz/40 to-accent-kaly/40 flex items-center justify-center text-3xl mb-4">
          🎬
        </div>
        <h2 className="text-lg font-semibold">
          <span className="text-accent-luiz">Luiz</span>{" "}
          <span className="text-zinc-500">&</span>{" "}
          <span className="text-accent-kaly">Kaly</span>
        </h2>
        <h1 className="text-3xl font-bold mt-3">Controle de Mídia</h1>
        <p className="text-zinc-400 mt-1">Séries e filmes que assistimos juntos</p>

        <div className="grid grid-cols-3 gap-3 w-full mt-6">
          <div className="bg-base-card border border-base-border rounded-xl py-4">
            <div className="text-2xl font-bold text-accent-luiz">
              {stats.series}
            </div>
            <div className="text-xs text-zinc-400">Séries</div>
          </div>
          <div className="bg-base-card border border-base-border rounded-xl py-4">
            <div className="text-2xl font-bold text-accent-kaly">
              {stats.filmes}
            </div>
            <div className="text-xs text-zinc-400">Filmes</div>
          </div>
          <div className="bg-base-card border border-base-border rounded-xl py-4">
            <div className="text-2xl font-bold">{stats.horas}h</div>
            <div className="text-xs text-zinc-400">Assistidas</div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-8 flex flex-col gap-4">
        <TmdbSettings apiKey={apiKey} onSave={handleSaveKey} />

        <button
          onClick={checarNovidades}
          disabled={checando}
          className="bg-accent-luiz/15 border border-accent-luiz/40 text-accent-luiz rounded-xl py-3 font-semibold hover:bg-accent-luiz/25 disabled:opacity-50"
        >
          {checando ? "Checando novidades..." : "🔄 Checar novos episódios/temporadas"}
        </button>

        <AddSeriesForm onAdd={handleAdd} />

        <div className="bg-base-card border border-base-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">📋 Minha Lista</span>
            <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-zinc-400">
              {midias.length} itens
            </span>
          </div>

          {midias.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">
              Nenhuma série ou filme adicionado ainda.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {midias.map((m) => (
                <SeriesCard
                  key={m.id}
                  midia={m}
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                  onMarcarVisto={handleMarcarVisto}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          💾 Salvo neste navegador
        </p>
      </div>
    </main>
  );
}
