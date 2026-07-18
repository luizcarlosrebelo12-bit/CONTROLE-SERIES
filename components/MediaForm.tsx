"use client";

import { Midia } from "@/lib/types";
import { useEffect, useState } from "react";
import { Tv, Film, Pencil, Plus, ChevronDown, X, Save, Sparkles } from "lucide-react";

interface Props {
  modoEdicao?: Midia | null;
  onAdd: (midia: Midia) => void;
  onUpdate: (midia: Midia) => void;
  onCancelEdit: () => void;
}

function vazio() {
  return {
    nome: "",
    tipo: "serie" as "serie" | "filme",
    pessoa: "Luiz",
    temporada: 1,
    episodio: 1,
    horas: 0,
    minutos: 0,
  };
}

export function MediaForm({
  modoEdicao,
  onAdd,
  onUpdate,
  onCancelEdit,
}: Props) {
  const [open, setOpen] = useState(!!modoEdicao);
  const [form, setForm] = useState(vazio());

  useEffect(() => {
    if (modoEdicao) {
      setForm({
        nome: modoEdicao.nome,
        tipo: modoEdicao.tipo,
        pessoa: modoEdicao.pessoa,
        temporada: modoEdicao.temporada,
        episodio: modoEdicao.episodio,
        horas: Math.floor(modoEdicao.minutos / 60),
        minutos: modoEdicao.minutos % 60,
      });
      setOpen(true);
    }
  }, [modoEdicao]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) return;
    const totalMinutos = form.horas * 60 + form.minutos;

    if (modoEdicao) {
      onUpdate({
        ...modoEdicao,
        nome: form.nome.trim(),
        tipo: form.tipo,
        pessoa: form.pessoa,
        temporada: form.temporada,
        episodio: form.episodio,
        minutos: totalMinutos,
      });
    } else {
      onAdd({
        id: crypto.randomUUID(),
        nome: form.nome.trim(),
        tipo: form.tipo,
        pessoa: form.pessoa,
        temporada: form.temporada,
        episodio: form.episodio,
        minutos: totalMinutos,
        status: "assistindo",
        ultimaTemporadaVista: form.temporada,
        ultimoEpisodioVisto: form.episodio,
        novidade: null,
      });
    }
    setForm(vazio());
    setOpen(false);
  }

  function handleCancel() {
    setForm(vazio());
    setOpen(false);
    onCancelEdit();
  }

  return (
    <div className="bg-base-card border border-base-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => (modoEdicao ? undefined : setOpen((o) => !o))}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="w-9 h-9 rounded-full bg-accent-luiz/20 text-accent-luiz flex items-center justify-center shrink-0">
          {modoEdicao ? <Pencil size={16} /> : <Plus size={18} />}
        </span>
        <div className="flex-1">
          <div className="font-semibold">
            {modoEdicao ? `Editando: ${modoEdicao.nome}` : "Adicionar nova mídia"}
          </div>
          <div className="text-sm text-zinc-400">
            Séries, filmes e tempo assistido
          </div>
        </div>
        {!modoEdicao && (
          <ChevronDown
            size={18}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="p-4 pt-0 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
            <Sparkles size={14} /> <span>Editar mídia</span>
            <span className="text-zinc-600">— Adicione séries e filmes</span>
          </div>

          {/* Tipo */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, tipo: "serie" }))}
              className={`py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                form.tipo === "serie"
                  ? "bg-accent-luiz text-white"
                  : "bg-base-bg border border-base-border text-zinc-400"
              }`}
            >
              <Tv size={16} /> Série
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, tipo: "filme" }))}
              className={`py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                form.tipo === "filme"
                  ? "bg-accent-luiz text-white"
                  : "bg-base-bg border border-base-border text-zinc-400"
              }`}
            >
              <Film size={16} /> Filme
            </button>
          </div>

          {/* Pessoa */}
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">
              Quem assistiu
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, pessoa: "Luiz" }))}
                className={`py-3 rounded-xl font-semibold transition ${
                  form.pessoa === "Luiz"
                    ? "bg-accent-luiz text-white"
                    : "bg-base-bg border border-base-border text-zinc-400"
                }`}
              >
                Luiz
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, pessoa: "Kaly" }))}
                className={`py-3 rounded-xl font-semibold transition ${
                  form.pessoa === "Kaly"
                    ? "bg-accent-kaly text-white"
                    : "bg-base-bg border border-base-border text-zinc-400"
                }`}
              >
                Kaly
              </button>
            </div>
          </div>

          {/* Titulo */}
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Título</label>
            <input
              className="w-full bg-base-bg border border-base-border rounded-xl px-4 py-3"
              placeholder="Nome da série ou filme"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            />
          </div>

          {/* Temporada / Episodio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Temporada
              </label>
              <input
                type="number"
                min={1}
                className="w-full bg-base-bg border border-base-border rounded-xl px-4 py-3"
                value={form.temporada}
                onChange={(e) =>
                  setForm((f) => ({ ...f, temporada: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Episódio
              </label>
              <input
                type="number"
                min={1}
                className="w-full bg-base-bg border border-base-border rounded-xl px-4 py-3"
                value={form.episodio}
                onChange={(e) =>
                  setForm((f) => ({ ...f, episodio: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          {/* Tempo assistido */}
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">
              Tempo Assistido
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  className="w-full bg-base-bg border border-base-border rounded-xl px-4 py-3"
                  value={form.horas}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, horas: Number(e.target.value) }))
                  }
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                  h
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={59}
                  className="w-full bg-base-bg border border-base-border rounded-xl px-4 py-3"
                  value={form.minutos}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, minutos: Number(e.target.value) }))
                  }
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                  min
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="py-3 rounded-xl font-semibold bg-base-bg border border-base-border text-zinc-300 flex items-center justify-center gap-2"
            >
              <X size={16} /> Cancelar
            </button>
            <button
              type="submit"
              className="py-3 rounded-xl font-semibold bg-accent-luiz text-white flex items-center justify-center gap-2 hover:opacity-90"
            >
              <Save size={16} /> {modoEdicao ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
