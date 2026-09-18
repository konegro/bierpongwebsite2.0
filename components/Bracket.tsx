"use client";

import { Match } from "@/lib/types";
import { useTournament } from "@/lib/tournament-store";
import { Trophy } from "lucide-react";

export function Bracket({ matches, big = false }: { matches: Match[]; big?: boolean }) {
  const { teams } = useTournament();
  const teamById = (id: string) => teams.find((t) => t.id === id);
  const rounds = Array.from(new Set(matches.map((m) => m.round)));

  return (
    <div className="flex gap-8 overflow-x-auto pb-2">
      {rounds.map((round, roundIndex) => {
        const roundMatches = matches.filter((m) => m.round === round);
        const isFirst = roundIndex === 0;
        const isLast = roundIndex === rounds.length - 1;
        const isFinal = round === "Finale";

        return (
          <div key={round} className="flex min-w-[230px] flex-1 flex-col gap-4">
            <h3
              className={`text-center font-display font-semibold uppercase tracking-wide text-doom-silver/45 ${
                big ? "text-xl" : "text-xs"
              }`}
            >
              {round}
            </h3>
            <div className="flex flex-1 flex-col justify-around gap-6">
              {roundMatches.map((match) => {
                const teamA = teamById(match.teamAId);
                const teamB = teamById(match.teamBId);
                const winner =
                  match.status === "finished" && match.cupsA !== null && match.cupsB !== null
                    ? match.cupsA > match.cupsB
                      ? teamA
                      : teamB
                    : null;

                return (
                  <div key={match.id} className="relative">
                    {!isFirst && (
                      <span className="absolute right-full top-1/2 h-px w-8 -translate-y-1/2 bg-doom-border" />
                    )}
                    {!isLast && (
                      <span className="absolute left-full top-1/2 h-px w-8 -translate-y-1/2 bg-doom-border" />
                    )}
                    <div
                      className={`chamfer border p-3 ${
                        isFinal ? "border-doom-green glow-green" : "border-doom-border bg-doom-card"
                      }`}
                    >
                      {winner && (
                        <div
                          className={`mb-1.5 flex items-center gap-1 font-display font-semibold uppercase tracking-wide text-doom-green ${
                            big ? "text-sm" : "text-[11px]"
                          }`}
                        >
                          <Trophy size={big ? 16 : 11} /> Gewinner
                        </div>
                      )}
                      {[teamA, teamB].map((team, i) => {
                        const isWinner = winner && team?.id === winner.id;
                        return (
                          <div
                            key={i}
                            className={`flex items-center justify-between border-doom-border py-1.5 ${
                              i === 0 ? "border-b" : ""
                            } ${big ? "text-lg" : "text-sm"} ${
                              isWinner ? "font-bold text-doom-green" : "text-doom-silver"
                            }`}
                          >
                            <span className="min-w-0 truncate">{team?.name ?? "TBD"}</span>
                            <span className="font-mono tabular">
                              {i === 0 ? (match.cupsA ?? "–") : (match.cupsB ?? "–")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
