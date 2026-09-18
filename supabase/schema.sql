-- Xenogenesis Bierpong-Cup: Turnierdaten-Schema
-- Einmal komplett in den Supabase SQL-Editor einfügen und "Run" klicken.

create table if not exists groups (
  id text primary key,
  name text not null
);

create table if not exists teams (
  id text primary key,
  name text not null,
  group_id text references groups(id) on delete set null
);

create table if not exists players (
  id text primary key,
  team_id text not null references teams(id) on delete cascade,
  name text not null
);

create table if not exists matches (
  id text primary key,
  group_id text not null default '',
  round text not null,
  table_name text not null,
  team_a_id text not null default '',
  team_b_id text not null default '',
  cups_a int,
  cups_b int,
  status text not null default 'scheduled'
);

create table if not exists settings (
  id int primary key default 1,
  start_at timestamptz
);
insert into settings (id, start_at) values (1, null) on conflict (id) do nothing;

-- Kein echtes Nutzer-Login geplant (PIN-Schutz ist nur eine UI-Hürde, wie
-- bisher) -- daher offene Policies: jeder mit dem anon-Key darf lesen/schreiben.
alter table groups enable row level security;
alter table teams enable row level security;
alter table players enable row level security;
alter table matches enable row level security;
alter table settings enable row level security;

create policy "public access" on groups for all using (true) with check (true);
create policy "public access" on teams for all using (true) with check (true);
create policy "public access" on players for all using (true) with check (true);
create policy "public access" on matches for all using (true) with check (true);
create policy "public access" on settings for all using (true) with check (true);

-- Live-Sync für alle Clients aktivieren.
alter publication supabase_realtime add table groups, teams, players, matches, settings;
