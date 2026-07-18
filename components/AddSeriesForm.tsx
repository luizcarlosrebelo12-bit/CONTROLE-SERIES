"use client";

import { Midia } from "@/lib/types";
import { useState } from "react";

interface Props {
  onAdd: (midia: Midia) => void;
}

export function AddSeriesForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"serie" | "filme">("serie");
  const [pessoa, setPessoa] = useState("Luiz");
  const [temporada, setTemporada] = useState(1);
  const [episodio, setEpisodio] = useState(1);
  const [minutos, setMinutos] = useState(0);

  function reset() {
    setNome("");
    setTipo("serie");
    setPessoa("Luiz");
    setTemporada(1);
    setEpisodio(1);
    setMinutos(0);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      nome: nome.trim(),
      tipo,
      pessoa,
      temporada,
      episodio,
      minutos,
      status: "assistindo",
      ultimaTemporadaVista: temporada,
      ultimoEpisodioVisto: episodio,
      novidade: null,
    });
    reset();
    setOpen(false);
  }

  return (
    <div className="bg-base-card border border-base-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div>
          <div className="font-semibold">Adicionar nova mídia</div>
          <div className="text-sm text-zinc-400">
            Séries, filmes e tempo assistido
          </div>
        </div>
        <span
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="p-4 pt-0 grid grid-cols-2 gap-3"
        >
          <input
            className="col-span-2 bg-base-bg border border-base-border rounded-lg px-3 py-2"
            placeholder="Nome da série ou filme"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <select
            className="bg-base-bg border border-base-border rounded-lg px-3 py-2"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "serie" | "filme")}
          >
            <option value="serie">Série</option>
            <option value="filme">Filme</option>
          </select>
          <select
            className="bg-base-bg border border-base-border rounded-lg px-3 py-2"
            value={pessoa}
            onChange={(e) => setPessoa(e.target.value)}
          >
            <option value="Luiz">Luiz</option>
            <option value="Kaly">Kaly</option>
          </select>
          <input
            type="number"
            min={1}
            className="bg-base-bg border border-base-border rounded-lg px-3 py-2"
            placeholder="Temporada"
            value={temporada}
            onChange={(e) => setTemporada(Number(e.target.value))}
          />
          <input
            type="number"
            min={1}
            className="bg-base-bg border border-base-border rounded-lg px-3 py-2"
            placeholder="Episódio"
            value={episodio}
            onChange={(e) => setEpisodio(Number(e.target.value))}
          />
          <input
            type="number"
            min={0}
            className="col-span-2 bg-base-bg border border-base-border rounded-lg px-3 py-2"
            placeholder="Minutos assistidos"
            value={minutos}
            onChange={(e) => setMinutos(Number(e.target.value))}
          />
          <button
            type="submit"
            className="col-span-2 bg-accent-luiz text-white rounded-lg py-2 font-semibold hover:opacity-90"
          >
            Adicionar
          </button>
        </form>
      )}
    </div>
  );
}
