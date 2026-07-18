-- Rode este SQL no Supabase: Painel do projeto > SQL Editor > New query > cole e clique em Run

create table if not exists midias (
  id text primary key,
  nome text not null,
  tipo text not null,
  pessoa text not null,
  temporada integer not null default 1,
  episodio integer not null default 1,
  minutos integer not null default 0,
  status text not null default 'assistindo',
  tmdb_id integer,
  ultima_temporada_vista integer,
  ultimo_episodio_visto integer,
  novidade text,
  tmdb_status text,
  criado_em timestamptz not null default now()
);

-- Permite que o app (usando a chave anônima) leia e grave dados.
-- Como é um app pessoal sem login, qualquer pessoa com o link do Supabase
-- poderia acessar os dados -- mantenha a URL e a chave só entre vocês dois.
alter table midias enable row level security;

create policy "Permitir leitura publica" on midias
  for select using (true);

create policy "Permitir escrita publica" on midias
  for insert with check (true);

create policy "Permitir atualizacao publica" on midias
  for update using (true);

create policy "Permitir exclusao publica" on midias
  for delete using (true);
