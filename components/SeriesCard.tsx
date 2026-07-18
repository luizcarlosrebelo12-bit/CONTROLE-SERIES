"use client";

import { Midia, STATUS_LABELS, StatusSerie } from "@/lib/types";
import { StatusBadge, NovidadeBadge } from "./StatusBadge";
import { useState } from "react";
import { Tv, Film, User, Clock, Pencil, Trash2 } from "lucide-react";

interface Props {
  midia: Midia;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: StatusSerie) => void;
  onMarcarVisto: (id: string) => void;
  onEdit: (midia: Midia) => void;
}

export function SeriesCard({
  midia,
  onDelete,
  onUpdateStatus,
  onMarcarVisto,
  onEdit,
}: Props) {
  const [editingStatus, setEditingStatus] = useState(false);

  return (
    <div className="bg-base-card border border-base-border rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors hover:border-accent-luiz/40">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${
            midia.pessoa.toLowerCase() === "kaly"
              ? "bg-gradient-to-br from-accent-kaly to-pink-600 shadow-accent-kaly/25"
              : "bg-gradient-to-br from-accent-luiz to-blue-600 shadow-accent-luiz/25"
          }`}
        >
          {midia.tipo === "serie" ? <Tv size={20} /> : <Film size={20} />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold truncate">{midia.nome}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent-luiz/15 text-accent-luiz border border-accent-luiz/30">
              {midia.tipo === "serie" ? "Série" : "Filme"}
            </span>
            {editingStatus ? (
              <select
                autoFocus
                defaultValue={midia.status}
                onBlur={() => setEditingStatus(false)}
                onChange={(e) => {
                  onUpdateStatus(midia.id, e.target.value as StatusSerie);
                  setEditingStatus(false);
                }}
                className="text-xs bg-base-bg border border-base-border rounded-full px-2 py-0.5"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            ) : (
              <button onClick={() => setEditingStatus(true)}>
                <StatusBadge status={midia.status} />
              </button>
            )}
            {midia.novidade && <NovidadeBadge novidade={midia.novidade} />}
          </div>
          <div className="text-sm text-zinc-400 flex items-center gap-3 mt-1">
            <span
              className={`flex items-center gap-1 ${
                midia.pessoa.toLowerCase() === "kaly"
                  ? "text-accent-kaly"
                  : "text-accent-luiz"
              }`}
            >
              <User size={14} /> {midia.pessoa}
            </span>
            <span>
              T{midia.temporada} E{midia.episodio}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {midia.minutos} min
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {midia.novidade && (
          <button
            onClick={() => onMarcarVisto(midia.id)}
            className="text-xs px-3 py-1 rounded-lg bg-accent-luiz/20 text-accent-luiz border border-accent-luiz/40 hover:bg-accent-luiz/30"
          >
            Marquei como visto
          </button>
        )}
        <button
          onClick={() => onEdit(midia)}
          className="text-zinc-500 hover:text-accent-luiz p-1"
          aria-label="Editar"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(midia.id)}
          className="text-zinc-500 hover:text-red-400 p-1"
          aria-label="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
