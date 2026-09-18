"use client";

import { useTeam } from "@/lib/team-context";
import { useTournament } from "@/lib/tournament-store";
import { computeStandings } from "@/lib/standings";
import { MatchCard } from "@/components/MatchCard";
import { Shirt } from "lucide-react";

export function MyTeamCard() {
  const { teamId, setTeamId } = useTeam();
  const { groups, teams, matches } = useTournament();
  const team = teamId ? teams.find((t) => t.id === teamId) : undefined;

  if (!team) return null;

  const group = groups.find((g) => g.id === team.groupId);
  const groupTeams = teams.filter((t) => t.groupId === team.groupId);
  const groupMatches = matches.filter((m) => m.groupId === team.groupId);
  const standings = computeStandings(groupTeams, groupMatches);
  const rank = standings.findIndex((s) => s.team.id === team.id) + 1;
  const myStanding = standings[rank - 1];

  const nextMatch =
    matches.find((m) => (m.teamAId === team.id || m.teamBId === team.id) && m.status === "live") ??
    matches.find((m) => (m.teamAId === team.id || m.teamBId === team.id) && m.status === "scheduled");

  return (
    <section className="chamfer flex flex-col gap-4 border border-doom-green/40 bg-doom-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Shirt size={18} className="shrink-0 text-doom-green" />
          <div className="min-w-0">
            <p className="font-display text-[11px] font-semibold uppercase tracking-wide text-doom-silver/45">
              Dein Team
            </p>
            <p className="truncate font-display text-lg font-bold uppercase tracking-tight text-doom-green">
              {team.name}
            </p>
          </div>
        </div>
        <select
          value={team.id}
          onChange={(e) => setTeamId(e.target.value)}
          className="focus-doom shrink-0 rounded border border-doom-border bg-doom-black px-2 py-1.5 text-xs text-doom-silver"
        >
          {groups.map((g) => (
            <optgroup key={g.id} label={g.name}>
              {teams
                .filter((t) => t.groupId === g.id)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      {myStanding && (
        <div className="grid grid-cols-4 gap-2 text-center">
          <StatBit label={`Platz`} value={`${rank}/${standings.length}`} />
          <StatBit label="Sp" value={myStanding.played} />
          <StatBit label="Diff" value={myStanding.cupDiff > 0 ? `+${myStanding.cupDiff}` : myStanding.cupDiff} />
          <StatBit label="Pkt" value={myStanding.points} highlight />
        </div>
      )}

      <div>
        <p className="mb-2 font-display text-[11px] font-semibold uppercase tracking-wide text-doom-silver/45">
          Nächstes Spiel {group ? `· ${group.name}` : ""}
        </p>
        {nextMatch ? (
          <MatchCard match={nextMatch} compact />
        ) : (
          <p className="text-sm text-doom-silver/40">Aktuell kein Spiel geplant.</p>
        )}
      </div>
    </section>
  );
}

function StatBit({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="chamfer-sm border border-doom-border bg-doom-black py-2">
      <p className={`font-mono tabular text-base font-bold ${highlight ? "text-doom-green" : "text-doom-silver"}`}>
        {value}
      </p>
      <p className="font-display text-[10px] font-semibold uppercase tracking-wide text-doom-silver/40">{label}</p>
    </div>
  );
}
