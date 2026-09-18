"use client";

import { Match } from "@/lib/types";
import { useTournament } from "@/lib/tournament-store";
import { Radio } from "lucide-react";

export function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const { teams } = useTournament();
  const teamA = teams.find((t) => t.id === match.teamAId);
  const teamB = teams.find((t) => t.id === match.teamBId);
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const aWins = isFinished && match.cupsA !== null && match.cupsB !== null && match.cupsA > match.cupsB;
  const bWins = isFinished && match.cupsA !== null && match.cupsB !== null && match.cupsB > match.cupsA;

  return (
    <div
      className={`chamfer relative border p-3.5 ${
        isLive ? "glow-green border-doom-green bg-doom-card" : "border-doom-border bg-doom-card"
      } ${compact ? "py-2.5" : ""}`}
    >
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-display text-xs font-semibold uppercase tracking-wider text-doom-silver/45">
          {match.table} · {match.round}
        </span>
        {isLive && (
          <span className="flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-doom-green">
            <Radio size={11} className="motion-safe:animate-pulse" /> Live
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`min-w-0 flex-1 truncate font-medium ${compact ? "text-sm" : "text-base"} ${
            aWins ? "text-doom-green" : "text-doom-silver"
          }`}
        >
          {teamA?.name ?? "TBD"}
        </span>
        <span className="font-mono tabular flex shrink-0 items-baseline gap-1.5 text-lg font-bold text-doom-silver">
          <span className={aWins ? "text-doom-green" : ""}>{match.cupsA ?? "–"}</span>
          <span className="text-xs font-normal text-doom-silver/30">:</span>
          <span className={bWins ? "text-doom-green" : ""}>{match.cupsB ?? "–"}</span>
        </span>
        <span
          className={`min-w-0 flex-1 truncate text-right font-medium ${compact ? "text-sm" : "text-base"} ${
            bWins ? "text-doom-green" : "text-doom-silver"
          }`}
        >
          {teamB?.name ?? "TBD"}
        </span>
      </div>
    </div>
  );
}
