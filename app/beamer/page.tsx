"use client";

import { useEffect, useState } from "react";
import { GroupTable } from "@/components/GroupTable";
import { Bracket } from "@/components/Bracket";
import { useTournament } from "@/lib/tournament-store";
import { computeStandings } from "@/lib/standings";

const ROTATE_MS = 15_000;

export default function BeamerPage() {
  const { groups, teams, matches } = useTournament();
  const [view, setView] = useState<"gruppen" | "baum">("gruppen");

  useEffect(() => {
    const id = setInterval(() => {
      setView((v) => (v === "gruppen" ? "baum" : "gruppen"));
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const koMatches = matches.filter((m) => m.round !== "Gruppenphase");

  return (
    <div className="flex aspect-video min-h-screen w-full flex-col gap-8 bg-doom-black px-16 py-10">
      <header className="flex items-baseline justify-between">
        <h1 className="font-display glow-green-text text-5xl font-bold uppercase tracking-tight text-doom-green">
          Xenogenesis Cup
        </h1>
        <span className="font-display text-2xl font-semibold uppercase tracking-wide text-doom-silver/50">
          {view === "gruppen" ? "Gruppen-Übersicht" : "KO-Baum"}
        </span>
      </header>

      <div className="flex flex-1 flex-col justify-center">
        {view === "gruppen" ? (
          <div className="grid grid-cols-2 gap-14">
            {groups.map((group) => {
              const groupTeams = teams.filter((t) => t.groupId === group.id);
              const groupMatches = matches.filter((m) => m.groupId === group.id);
              const standings = computeStandings(groupTeams, groupMatches);
              return (
                <div key={group.id} className="flex flex-col gap-4">
                  <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-doom-green">
                    {group.name}
                  </h2>
                  <div className="[&_th]:!py-5 [&_td]:!py-5 [&_th]:!text-xl [&_td]:!text-2xl">
                    <GroupTable standings={standings} dense />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Bracket matches={koMatches} big />
        )}
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-doom-border/50">
        <div
          key={view}
          className="h-full bg-doom-green motion-reduce:w-full"
          style={{ animation: `beamer-progress ${ROTATE_MS}ms linear forwards` }}
        />
      </div>
    </div>
  );
}
