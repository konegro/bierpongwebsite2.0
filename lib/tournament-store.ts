"use client";

import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";
import type { Group, Match, MatchStatus, Team } from "./types";

export type TournamentState = {
  groups: Group[];
  teams: Team[];
  matches: Match[];
  settings: { startAt: string | null };
};

const EMPTY_STATE: TournamentState = { groups: [], teams: [], matches: [], settings: { startAt: null } };

const GROUP_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TEAMS_PER_GROUP = 4;

const uid = () => Math.random().toString(36).slice(2, 10);

// Module-level singleton: one Supabase connection + one cached snapshot
// shared by every useTournament() call, kept in sync via Realtime.
let cache: TournamentState = EMPTY_STATE;
let initialized = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function refetch() {
  const [groupsRes, teamsRes, playersRes, matchesRes, settingsRes] = await Promise.all([
    supabase.from("groups").select("*").order("name"),
    supabase.from("teams").select("*").order("name"),
    supabase.from("players").select("*").order("name"),
    supabase.from("matches").select("*"),
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  const players = playersRes.data ?? [];
  const teams: Team[] = (teamsRes.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    groupId: t.group_id ?? "",
    players: players.filter((p) => p.team_id === t.id).map((p) => ({ id: p.id, name: p.name })),
  }));

  const matches: Match[] = (matchesRes.data ?? []).map((m) => ({
    id: m.id,
    groupId: m.group_id ?? "",
    round: m.round,
    table: m.table_name,
    teamAId: m.team_a_id ?? "",
    teamBId: m.team_b_id ?? "",
    cupsA: m.cups_a,
    cupsB: m.cups_b,
    status: m.status as MatchStatus,
  }));

  cache = {
    groups: (groupsRes.data ?? []).map((g) => ({ id: g.id, name: g.name })),
    teams,
    matches,
    settings: { startAt: settingsRes.data?.start_at ?? null },
  };
  notify();
}

function ensureInit() {
  if (initialized) return;
  initialized = true;
  refetch();
  supabase
    .channel("tournament-sync")
    .on("postgres_changes", { event: "*", schema: "public", table: "groups" }, refetch)
    .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, refetch)
    .on("postgres_changes", { event: "*", schema: "public", table: "players" }, refetch)
    .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, refetch)
    .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, refetch)
    .subscribe();
}

function subscribe(callback: () => void) {
  ensureInit();
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return cache;
}

function getServerSnapshot() {
  return EMPTY_STATE;
}

// --- Groups ---

export function addGroup(name: string) {
  supabase.from("groups").insert({ id: uid(), name }).then(refetch);
}

export function renameGroup(id: string, name: string) {
  supabase.from("groups").update({ name }).eq("id", id).then(refetch);
}

export function deleteGroup(id: string) {
  supabase.from("groups").delete().eq("id", id).then(refetch);
}

// --- Teams ---

export function addTeam(name: string, groupId = "") {
  supabase.from("teams").insert({ id: uid(), name, group_id: groupId || null }).then(refetch);
}

export function renameTeam(id: string, name: string) {
  supabase.from("teams").update({ name }).eq("id", id).then(refetch);
}

export function setTeamGroup(id: string, groupId: string) {
  supabase.from("teams").update({ group_id: groupId || null }).eq("id", id).then(refetch);
}

export function deleteTeam(id: string) {
  Promise.all([
    supabase.from("matches").delete().or(`team_a_id.eq.${id},team_b_id.eq.${id}`),
    supabase.from("teams").delete().eq("id", id),
  ]).then(refetch);
}

/** Verteilt Teams zufällig auf Gruppen. Legt Gruppen automatisch an, wenn noch keine existieren. */
export function shuffleGroups() {
  (async () => {
    await refetch();
    const state = cache;
    if (state.teams.length === 0) return;

    let groups = state.groups;
    if (groups.length === 0) {
      const groupCount = Math.max(1, Math.ceil(state.teams.length / TEAMS_PER_GROUP));
      groups = Array.from({ length: groupCount }, (_, i) => ({
        id: uid(),
        name: `Gruppe ${GROUP_LETTERS[i] ?? i + 1}`,
      }));
      await supabase.from("groups").insert(groups);
    }

    const shuffled = [...state.teams].sort(() => Math.random() - 0.5);
    await Promise.all(
      shuffled.map((t, i) => supabase.from("teams").update({ group_id: groups[i % groups.length].id }).eq("id", t.id))
    );
    await refetch();
  })();
}

// --- Players ---

export function addPlayer(teamId: string, name: string) {
  supabase.from("players").insert({ id: uid(), team_id: teamId, name }).then(refetch);
}

export function deletePlayer(_teamId: string, playerId: string) {
  supabase.from("players").delete().eq("id", playerId).then(refetch);
}

// --- Matches ---

export function addMatch(match: Omit<Match, "id">) {
  supabase
    .from("matches")
    .insert({
      id: uid(),
      group_id: match.groupId || null,
      round: match.round,
      table_name: match.table,
      team_a_id: match.teamAId || null,
      team_b_id: match.teamBId || null,
      cups_a: match.cupsA,
      cups_b: match.cupsB,
      status: match.status,
    })
    .then(refetch);
}

export function updateMatch(id: string, patch: Partial<Match>) {
  const dbPatch: Record<string, unknown> = {};
  if (patch.groupId !== undefined) dbPatch.group_id = patch.groupId || null;
  if (patch.round !== undefined) dbPatch.round = patch.round;
  if (patch.table !== undefined) dbPatch.table_name = patch.table;
  if (patch.teamAId !== undefined) dbPatch.team_a_id = patch.teamAId || null;
  if (patch.teamBId !== undefined) dbPatch.team_b_id = patch.teamBId || null;
  if (patch.cupsA !== undefined) dbPatch.cups_a = patch.cupsA;
  if (patch.cupsB !== undefined) dbPatch.cups_b = patch.cupsB;
  if (patch.status !== undefined) dbPatch.status = patch.status;
  supabase.from("matches").update(dbPatch).eq("id", id).then(refetch);
}

export function deleteMatch(id: string) {
  supabase.from("matches").delete().eq("id", id).then(refetch);
}

/** Erzeugt alle fehlenden Paarungen einer Gruppe (Jeder-gegen-Jeden), ohne Duplikate. */
export function generateRoundRobin(groupId: string) {
  (async () => {
    await refetch();
    const state = cache;
    const groupTeams = state.teams.filter((t) => t.groupId === groupId);
    const existingPairs = new Set(
      state.matches.filter((m) => m.groupId === groupId).map((m) => [m.teamAId, m.teamBId].sort().join("|"))
    );
    const newMatches = [];
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        const key = [groupTeams[i].id, groupTeams[j].id].sort().join("|");
        if (existingPairs.has(key)) continue;
        newMatches.push({
          id: uid(),
          group_id: groupId,
          round: "Gruppenphase",
          table_name: "Tisch 1",
          team_a_id: groupTeams[i].id,
          team_b_id: groupTeams[j].id,
          cups_a: null,
          cups_b: null,
          status: "scheduled",
        });
      }
    }
    if (newMatches.length > 0) await supabase.from("matches").insert(newMatches);
    await refetch();
  })();
}

// --- Settings ---

export function setTournamentStart(startAt: string | null) {
  supabase.from("settings").update({ start_at: startAt }).eq("id", 1).then(refetch);
}

// --- Reset ---

export function resetTournament() {
  (async () => {
    await supabase.from("matches").delete().neq("id", "");
    await supabase.from("teams").delete().neq("id", ""); // players cascade via FK
    await supabase.from("groups").delete().neq("id", "");
    await supabase.from("settings").update({ start_at: null }).eq("id", 1);
    await refetch();
  })();
}

export function useTournament() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ...state,
    addGroup,
    renameGroup,
    deleteGroup,
    addTeam,
    renameTeam,
    setTeamGroup,
    deleteTeam,
    shuffleGroups,
    addPlayer,
    deletePlayer,
    addMatch,
    updateMatch,
    deleteMatch,
    generateRoundRobin,
    setTournamentStart,
    resetTournament,
  };
}
