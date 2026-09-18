"use client";

import { useState } from "react";
import { GroupTable } from "@/components/GroupTable";
import { MatchCard } from "@/components/MatchCard";
import { useTournament } from "@/lib/tournament-store";
import { computeStandings } from "@/lib/standings";

export default function GruppenPage() {
  const { groups, teams, matches } = useTournament();
  const [manualActive, setManualActive] = useState<string | null>(null);
  const activeGroup = manualActive ?? groups[0]?.id ?? null;

  if (groups.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Gruppen</h1>
        <p className="text-sm text-doom-silver/40">Noch keine Gruppen angelegt.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Gruppen</h1>
        <div className="chamfer-sm flex gap-1 border border-doom-border bg-doom-card p-1 md:hidden">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setManualActive(group.id)}
              className={`focus-doom rounded px-3 py-1.5 font-display text-sm font-semibold uppercase tracking-wide transition-colors ${
                activeGroup === group.id ? "bg-doom-green text-doom-black" : "text-doom-silver/60"
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {groups.map((group) => {
          const groupTeams = teams.filter((t) => t.groupId === group.id);
          const groupMatches = matches.filter((m) => m.groupId === group.id);
          const standings = computeStandings(groupTeams, groupMatches);
          const visible = activeGroup === group.id;

          return (
            <section
              key={group.id}
              className={`flex flex-col gap-3 ${visible ? "flex" : "hidden md:flex"}`}
            >
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-doom-green">
                {group.name}
              </h2>
              {groupTeams.length === 0 ? (
                <p className="text-sm text-doom-silver/40">Noch keine Teams in dieser Gruppe.</p>
              ) : (
                <GroupTable standings={standings} />
              )}

              <div className="flex flex-col gap-2">
                {groupMatches.map((m) => (
                  <MatchCard key={m.id} match={m} compact />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
