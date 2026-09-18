"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  ArrowLeft,
  Shuffle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CalendarClock,
} from "lucide-react";
import { useTournament } from "@/lib/tournament-store";
import type { Match, MatchStatus } from "@/lib/types";

const PIN = "1234";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!unlocked) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-5 bg-doom-black px-6">
        <Link
          href="/"
          className="focus-doom absolute left-4 flex items-center gap-1.5 text-sm text-doom-silver/50 hover:text-doom-silver"
          style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
        >
          <ArrowLeft size={16} /> Zur Spieler-Ansicht
        </Link>
        <div className="chamfer flex h-16 w-16 items-center justify-center border border-doom-green bg-doom-card glow-green">
          <Lock size={26} className="text-doom-green" />
        </div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Turnierleitung</h1>
        <form
          className="flex flex-col items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (pin === PIN) {
              setUnlocked(true);
              setError(false);
            } else {
              setError(true);
            }
          }}
        >
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="PIN"
            className="focus-doom chamfer-sm w-44 border border-doom-border bg-doom-card px-4 py-3 text-center font-mono text-lg tracking-[0.4em] text-doom-silver placeholder:tracking-normal"
            autoFocus
          />
          <button
            type="submit"
            className="focus-doom chamfer-sm w-44 bg-doom-green py-3 font-display font-bold uppercase tracking-wide text-doom-black transition-colors hover:bg-doom-green-dark hover:text-doom-silver"
          >
            Entsperren
          </button>
          {error && <p className="text-sm text-red-500">Falscher PIN.</p>}
        </form>
      </div>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const [tab, setTab] = useState<"setup" | "spielbetrieb">("setup");

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 pb-16 pt-8">
      <header className="flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="focus-doom mb-1 flex items-center gap-1.5 text-sm text-doom-silver/50 hover:text-doom-silver"
          >
            <ArrowLeft size={14} /> Zur Spieler-Ansicht
          </Link>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Turnierleitung</h1>
        </div>
        <span className="chamfer-sm border border-doom-green/40 bg-doom-green/10 px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide text-doom-green">
          Entsperrt
        </span>
      </header>

      <div className="chamfer-sm flex w-fit gap-1 border border-doom-border bg-doom-card p-1">
        <TabButton active={tab === "setup"} onClick={() => setTab("setup")}>
          Setup
        </TabButton>
        <TabButton active={tab === "spielbetrieb"} onClick={() => setTab("spielbetrieb")}>
          Spielbetrieb
        </TabButton>
      </div>

      {tab === "setup" ? <SetupTab /> : <SpielbetriebTab />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`focus-doom rounded px-4 py-1.5 font-display text-sm font-semibold uppercase tracking-wide transition-colors ${
        active ? "bg-doom-green text-doom-black" : "text-doom-silver/60"
      }`}
    >
      {children}
    </button>
  );
}

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function SetupTab() {
  const {
    groups,
    teams,
    settings,
    addGroup,
    renameGroup,
    deleteGroup,
    addTeam,
    renameTeam,
    deleteTeam,
    shuffleGroups,
    addPlayer,
    deletePlayer,
    setTournamentStart,
    resetTournament,
  } = useTournament();

  const [newGroupName, setNewGroupName] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");

  return (
    <div className="flex flex-col gap-8">
      <section className="chamfer border border-doom-border bg-doom-card p-4">
        <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-doom-green">
          <CalendarClock size={16} /> Turnierstart
        </h2>
        <input
          type="datetime-local"
          value={toLocalInputValue(settings.startAt)}
          onChange={(e) => setTournamentStart(e.target.value ? new Date(e.target.value).toISOString() : null)}
          className="focus-doom rounded border border-doom-border bg-doom-black px-3 py-2 text-sm text-doom-silver"
        />
      </section>

      <section>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-doom-green">Teams</h2>
          <button
            onClick={shuffleGroups}
            className="focus-doom chamfer-sm flex items-center gap-1.5 border border-doom-border px-3 py-1.5 text-sm text-doom-silver transition-colors hover:border-doom-green hover:text-doom-green"
          >
            <Shuffle size={14} /> {groups.length === 0 ? "Gruppen bilden" : "Neu auslosen"}
          </button>
        </div>
        <p className="mb-3 text-xs text-doom-silver/40">
          Teams anlegen, dann oben klicken – das bildet die Gruppen automatisch und verteilt die Teams.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTeamName.trim()) return;
            addTeam(newTeamName.trim());
            setNewTeamName("");
          }}
          className="mb-3 flex gap-2"
        >
          <input
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Neuer Teamname, z.B. Team ABC"
            className="focus-doom chamfer-sm min-w-0 flex-1 border border-doom-border bg-doom-card px-3 py-2 text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="focus-doom chamfer-sm flex items-center gap-1.5 bg-doom-green px-3 py-2 font-display text-sm font-semibold uppercase tracking-wide text-doom-black transition-colors hover:bg-doom-green-dark hover:text-doom-silver"
          >
            <Plus size={14} /> Team
          </button>
        </form>

        {teams.length === 0 && <p className="text-sm text-doom-silver/40">Noch keine Teams angelegt.</p>}

        <div className="flex flex-col gap-2">
          {teams.map((team) => {
            const expanded = expandedTeamId === team.id;
            return (
              <div
                key={team.id}
                onClick={() => {
                  setExpandedTeamId(expanded ? null : team.id);
                  setNewPlayerName("");
                }}
                className="chamfer-sm cursor-pointer border border-doom-border bg-doom-card transition-colors hover:border-doom-green/50"
              >
                <div className="flex items-center gap-2 p-2.5">
                  <input
                    value={team.name}
                    onChange={(e) => renameTeam(team.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="focus-doom min-w-0 flex-1 rounded bg-transparent px-2 py-1 text-sm font-medium"
                  />
                  {team.groupId && (
                    <span className="shrink-0 rounded bg-doom-black px-2 py-1 text-xs text-doom-silver/50">
                      {groups.find((g) => g.id === team.groupId)?.name}
                    </span>
                  )}
                  <span
                    className={`focus-doom chamfer-sm flex shrink-0 items-center gap-1 border px-2.5 py-1.5 font-display text-xs font-semibold uppercase tracking-wide transition-colors ${
                      expanded ? "border-doom-green bg-doom-green/10 text-doom-green" : "border-doom-border text-doom-silver/70"
                    }`}
                  >
                    {team.players.length} Spieler {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Team "${team.name}" und alle zugehörigen Spiele wirklich löschen?`)) {
                        deleteTeam(team.id);
                      }
                    }}
                    className="focus-doom shrink-0 rounded p-1.5 text-doom-silver/50 hover:text-red-500"
                    aria-label={`Team ${team.name} löschen`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {expanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col gap-1.5 border-t border-doom-border p-2.5"
                  >
                    <p className="font-display text-[11px] font-semibold uppercase tracking-wide text-doom-silver/45">
                      Spieler*innen
                    </p>
                    {team.players.length === 0 && (
                      <p className="text-xs text-doom-silver/40">Noch keine Spieler*innen eingetragen.</p>
                    )}
                    {team.players.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-sm">
                        <span>{p.name}</span>
                        <button
                          onClick={() => deletePlayer(team.id, p.id)}
                          className="focus-doom rounded p-1 text-doom-silver/40 hover:text-red-500"
                          aria-label={`${p.name} entfernen`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newPlayerName.trim()) return;
                        addPlayer(team.id, newPlayerName.trim());
                        setNewPlayerName("");
                      }}
                      className="mt-1 flex gap-2"
                    >
                      <input
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="Spielername"
                        autoFocus
                        className="focus-doom min-w-0 flex-1 rounded border border-doom-border bg-doom-black px-2 py-1.5 text-sm"
                      />
                      <button
                        type="submit"
                        className="focus-doom shrink-0 rounded border border-doom-border px-2 py-1.5 text-doom-silver/70 hover:border-doom-green hover:text-doom-green"
                      >
                        <Plus size={14} />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 font-display text-sm font-semibold uppercase tracking-wide text-doom-green">
          Gruppen
        </h2>
        <p className="mb-3 text-xs text-doom-silver/40">
          Entstehen automatisch beim Auslosen oben. Hier nur für manuelle Umbenennung/Löschung/Ergänzung nötig.
        </p>
        <div className="flex flex-col gap-2">
          {groups.length === 0 && (
            <p className="text-sm text-doom-silver/40">Noch keine Gruppen – lege zuerst Teams an und lose aus.</p>
          )}
          {groups.map((g) => (
            <div key={g.id} className="chamfer-sm flex items-center gap-2 border border-doom-border bg-doom-card p-2.5">
              <input
                value={g.name}
                onChange={(e) => renameGroup(g.id, e.target.value)}
                className="focus-doom flex-1 rounded bg-transparent px-2 py-1 text-sm"
              />
              <button
                onClick={() => {
                  if (confirm(`Gruppe "${g.name}" löschen? Zugewiesene Teams werden auf "ohne Gruppe" gesetzt.`)) {
                    deleteGroup(g.id);
                  }
                }}
                className="focus-doom rounded p-1.5 text-doom-silver/50 hover:text-red-500"
                aria-label={`Gruppe ${g.name} löschen`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newGroupName.trim()) return;
            addGroup(newGroupName.trim());
            setNewGroupName("");
          }}
          className="mt-2 flex gap-2"
        >
          <input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Weitere Gruppe, z.B. Gruppe C"
            className="focus-doom chamfer-sm flex-1 border border-doom-border bg-doom-card px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="focus-doom chamfer-sm flex items-center gap-1.5 bg-doom-green px-3 py-2 font-display text-sm font-semibold uppercase tracking-wide text-doom-black transition-colors hover:bg-doom-green-dark hover:text-doom-silver"
          >
            <Plus size={14} /> Hinzufügen
          </button>
        </form>
      </section>

      <section className="chamfer border border-red-500/30 bg-red-500/5 p-4">
        <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wide text-red-500">Gefahrenzone</h2>
        <p className="mb-3 text-sm text-doom-silver/50">
          Löscht alle Teams, Spieler*innen, Gruppen und Spiele unwiderruflich.
        </p>
        <button
          onClick={() => {
            if (confirm("Wirklich das GESAMTE Turnier zurücksetzen? Das kann nicht rückgängig gemacht werden.")) {
              resetTournament();
            }
          }}
          className="focus-doom chamfer-sm flex items-center gap-1.5 border border-red-500/40 px-3 py-2 font-display text-sm font-semibold uppercase tracking-wide text-red-500 transition-colors hover:bg-red-500/10"
        >
          <RefreshCw size={14} /> Turnier zurücksetzen
        </button>
      </section>
    </div>
  );
}

function SpielbetriebTab() {
  const { groups, teams, matches, addMatch, updateMatch, deleteMatch, generateRoundRobin } = useTournament();

  const [newMatch, setNewMatch] = useState({ teamAId: "", teamBId: "", round: "Gruppenphase", table: "Tisch 1" });

  const setScore = (id: string, field: "cupsA" | "cupsB", value: string) => {
    updateMatch(id, { [field]: value === "" ? null : Number(value) });
  };

  const setStatus = (id: string, status: MatchStatus) => {
    updateMatch(id, { status });
  };

  if (teams.length === 0) {
    return <p className="text-sm text-doom-silver/40">Erst im Setup-Tab Teams anlegen.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {groups.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-doom-green">
            Gruppenspiele generieren
          </h2>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => generateRoundRobin(g.id)}
                className="focus-doom chamfer-sm flex items-center gap-1.5 border border-doom-border bg-doom-card px-3 py-2 text-sm text-doom-silver transition-colors hover:border-doom-green hover:text-doom-green"
              >
                <RefreshCw size={14} /> {g.name}: Jeder-gegen-Jeden
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-doom-green">
          Spiel hinzufügen
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newMatch.teamAId || !newMatch.teamBId || newMatch.teamAId === newMatch.teamBId) return;
            const teamA = teams.find((t) => t.id === newMatch.teamAId);
            const match: Omit<Match, "id"> = {
              groupId: teamA?.groupId ?? "",
              round: newMatch.round.trim() || "Gruppenphase",
              table: newMatch.table.trim() || "Tisch 1",
              teamAId: newMatch.teamAId,
              teamBId: newMatch.teamBId,
              cupsA: null,
              cupsB: null,
              status: "scheduled",
            };
            addMatch(match);
            setNewMatch({ teamAId: "", teamBId: "", round: "Gruppenphase", table: "Tisch 1" });
          }}
          className="flex flex-wrap gap-2"
        >
          <select
            value={newMatch.teamAId}
            onChange={(e) => setNewMatch((m) => ({ ...m, teamAId: e.target.value }))}
            className="focus-doom rounded border border-doom-border bg-doom-card px-2 py-2 text-sm"
          >
            <option value="">Team A</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            value={newMatch.teamBId}
            onChange={(e) => setNewMatch((m) => ({ ...m, teamBId: e.target.value }))}
            className="focus-doom rounded border border-doom-border bg-doom-card px-2 py-2 text-sm"
          >
            <option value="">Team B</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            value={newMatch.round}
            onChange={(e) => setNewMatch((m) => ({ ...m, round: e.target.value }))}
            placeholder="Runde"
            className="focus-doom chamfer-sm w-32 border border-doom-border bg-doom-card px-3 py-2 text-sm"
          />
          <input
            value={newMatch.table}
            onChange={(e) => setNewMatch((m) => ({ ...m, table: e.target.value }))}
            placeholder="Tisch"
            className="focus-doom chamfer-sm w-24 border border-doom-border bg-doom-card px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="focus-doom chamfer-sm flex items-center gap-1.5 bg-doom-green px-3 py-2 font-display text-sm font-semibold uppercase tracking-wide text-doom-black transition-colors hover:bg-doom-green-dark hover:text-doom-silver"
          >
            <Plus size={14} /> Spiel
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-doom-green">
          Ergebnisse eintragen
        </h2>
        {matches.length === 0 ? (
          <p className="text-sm text-doom-silver/40">Noch keine Spiele angelegt.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {matches.map((match) => {
              const teamA = teams.find((t) => t.id === match.teamAId);
              const teamB = teams.find((t) => t.id === match.teamBId);
              return (
                <div
                  key={match.id}
                  className="chamfer-sm flex flex-wrap items-center gap-2 border border-doom-border bg-doom-card p-3"
                >
                  <span className="w-28 shrink-0 truncate text-sm">{teamA?.name ?? "TBD"}</span>
                  <input
                    type="number"
                    min={0}
                    value={match.cupsA ?? ""}
                    onChange={(e) => setScore(match.id, "cupsA", e.target.value)}
                    className="focus-doom w-14 rounded border border-doom-border bg-doom-black px-2 py-1.5 text-center font-mono tabular"
                  />
                  <span className="text-doom-silver/40">:</span>
                  <input
                    type="number"
                    min={0}
                    value={match.cupsB ?? ""}
                    onChange={(e) => setScore(match.id, "cupsB", e.target.value)}
                    className="focus-doom w-14 rounded border border-doom-border bg-doom-black px-2 py-1.5 text-center font-mono tabular"
                  />
                  <span className="w-28 shrink-0 truncate text-right text-sm">{teamB?.name ?? "TBD"}</span>
                  <select
                    value={match.status}
                    onChange={(e) => setStatus(match.id, e.target.value as MatchStatus)}
                    className={`focus-doom rounded border px-2 py-1.5 font-display text-xs font-semibold uppercase tracking-wide ${
                      match.status === "live"
                        ? "border-doom-green text-doom-green"
                        : "border-doom-border text-doom-silver/70"
                    }`}
                  >
                    <option value="scheduled">Geplant</option>
                    <option value="live">Live</option>
                    <option value="finished">Beendet</option>
                  </select>
                  <button
                    onClick={() => {
                      if (confirm("Dieses Spiel löschen?")) deleteMatch(match.id);
                    }}
                    className="focus-doom ml-auto rounded p-1.5 text-doom-silver/50 hover:text-red-500"
                    aria-label="Spiel löschen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
