"use client";

import { useState } from "react";

interface Props {
  apiKey: string;
  onSave: (key: string) => void;
}

export function TmdbSettings({ apiKey, onSave }: Props) {
  const [open, setOpen] = useState(!apiKey);
  const [value, setValue] = useState(apiKey);

  return (
    <div className="bg-base-card border border-base-border rounded-xl p-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <div className="font-semibold">Chave da API do TMDB</div>
          <div className="text-sm text-zinc-400">
            {apiKey ? "Configurada ✅" : "Necessária para checar novidades"}
          </div>
        </div>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ⌄
        </span>
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-sm text-zinc-400">
            Crie uma conta gratuita em{" "}
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              className="text-accent-luiz underline"
            >
              themoviedb.org/settings/api
            </a>{" "}
            e cole aqui a "API Key (v3 auth)".
          </p>
          <input
            className="bg-base-bg border border-base-border rounded-lg px-3 py-2"
            placeholder="Cole sua API key aqui"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            onClick={() => onSave(value.trim())}
            className="bg-accent-luiz text-white rounded-lg py-2 font-semibold hover:opacity-90"
          >
            Salvar
          </button>
        </div>
      )}
    </div>
  );
}
