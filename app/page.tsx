"use client";

import { useEffect, useMemo, useState } from "react";
import { Midia, StatusSerie } from "@/lib/types";
import { buscarMidias, salvarMidia, excluirMidia } from "@/lib/midiasApi";
import { loadTmdbKey, saveTmdbKey } from "@/lib/storage";
import { supabaseConfigurado } from "@/lib/supabaseClient";
import { SeriesCard } from "@/components/SeriesCard";
import { MediaForm } from "@/components/MediaForm";
import { TmdbSettings } from "@/components/TmdbSettings";
import { buscarSerie, buscarDetalhesSerie, calcularNovidade } from "@/lib/tmdb";
import { Clapperboard, RefreshCw, List, Cloud, HardDrive } from "lucide-react";

const SEED_KEY = "controle-series:seeded-v1";

function dadosIniciais(): Midia[] {
  const base = [
    { nome: "CANGAÇO NOVO", pessoa: "Luiz", temporada: 1, episodio: 2, minutos: 0 },
    { nome: "SAFE", pessoa: "Kaly", temporada: 1, episodio: 7, minutos: 5 },
    { nome: "SCORPION", pessoa: "Luiz", temporada: 2, episodio: 10, minutos: 0 },
    { nome: "DE FÉRIAS COM O EX DIRETORIA", pessoa: "Luiz", temporada: 2, episodio: 9, minutos: 0 },
    { nome: "O RESIDENTE", pessoa: "Kaly", temporada: 1, episodio: 8, minutos: 15 },
    { nome: "GREYS ANATOMY", pessoa: "Kaly", temporada: 22, episodio: 19, minutos: 0 },
  ];
  return base.map((b) => ({
    id: crypto.randomUUID(),
    nome: b.nome,
    tipo: "serie" as const,
    pessoa: b.pessoa,
    temporada: b.temporada,
    episodio: b.episodio,
    minutos: b.minutos,
    status: "assistindo" as const,
    ultimaTemporadaVista: b.temporada,
    ultimoEpisodioVisto: b.episodio,
    novidade: null,
  }));
}

export default function Page() {
  const [midias, setMidias] = useState<Midia[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [checando, setChecando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState<Midia | null>(null);

  async function recarregar() {
    const dados = await buscarMidias();
    setMidias(dados);
    return dados;
  }

  useEffect(() => {
    setApiKey(loadTmdbKey());
    recarregar().then(async (dados) => {
      const jaSemeado = typeof window !== "undefined" && window.localStorage.getItem(SEED_KEY);
      if ((!dados || dados.length === 0) && !jaSemeado) {
        const iniciais = dadosIniciais();
        setMidias(iniciais);
        await Promise.all(iniciais.map((m) => salvarMidia(m)));
        window.localStorage.setItem(SEED_KEY, "1");
      }
    }).finally(() => setCarregando(false));
  }, []);

  const stats = useMemo(() => {
    const series = midias.filter((m) => m.tipo === "serie").length;
    const filmes = midias.filter((m) => m.tipo === "filme").length;
    const minutos = midias.reduce((acc, m) => acc + (m.minutos || 0), 0);
    return { series, filmes, horas: Math.round(minutos / 60) };
  }, [midias]);

  async function handleAdd(nova: Midia) {
    setMidias((prev) => [nova, ...prev]);
    await salvarMidia(nova);
  }

  async function handleDelete(id: string) {
    setMidias((prev) => prev.filter((m) => m.id !== id));
    await excluirMidia(id);
  }

  async function handleUpdate(atualizada: Midia) {
    setMidias((prev) =>
      prev.map((m) => (m.id === atualizada.id ? atualizada : m))
    );
    setEditando(null);
    await salvarMidia(atualizada);
  }

  async function handleUpdateStatus(id: string, status: StatusSerie) {
    const alvo = midias.find((m) => m.id === id);
    if (!alvo) return;
    const atualizada = { ...alvo, status };
    setMidias((prev) => prev.map((m) => (m.id === id ? atualizada : m)));
    await salvarMidia(atualizada);
  }

  async function handleMarcarVisto(id: string) {
    const alvo = midias.find((m) => m.id === id);
    if (!alvo) return;
    const atualizada = {
      ...alvo,
      temporada: alvo.ultimaTemporadaVista ?? alvo.temporada,
      episodio: alvo.ultimoEpisodioVisto ?? alvo.episodio,
      novidade: null,
    };
    setMidias((prev) => prev.map((m) => (m.id === id ? atualizada : m)));
    await salvarMidia(atualizada);
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
      await Promise.all(atualizadas.map((m) => salvarMidia(m)));
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
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-luiz/40 to-accent-kaly/40 flex items-center justify-center mb-4">
          <Clapperboard size={36} className="text-white" />
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
          className="bg-accent-luiz/15 border border-accent-luiz/40 text-accent-luiz rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-accent-luiz/25 disabled:opacity-50"
        >
          <RefreshCw size={18} className={checando ? "animate-spin" : ""} />
          {checando ? "Checando novidades..." : "Checar novos episódios/temporadas"}
        </button>

        <MediaForm
          modoEdicao={editando}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditando(null)}
        />

        <div className="bg-base-card border border-base-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold flex items-center gap-2">
              <List size={18} /> Minha Lista
            </span>
            <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-zinc-400">
              {midias.length} itens
            </span>
          </div>

          {carregando ? (
            <p className="text-zinc-500 text-sm text-center py-8">
              Carregando...
            </p>
          ) : midias.length === 0 ? (
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
                  onEdit={setEditando}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4 flex items-center justify-center gap-1">
          {supabaseConfigurado ? (
            <>
              <Cloud size={14} /> Sincronizado na nuvem
            </>
          ) : (
            <>
              <HardDrive size={14} /> Salvo neste navegador (configure o Supabase para sincronizar)
            </>
          )}
        </p>
      </div>
    </main>
  );
}
