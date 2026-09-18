"use client";

import { Bracket } from "@/components/Bracket";
import { useTournament } from "@/lib/tournament-store";

export default function BaumPage() {
  const { matches } = useTournament();
  const koMatches = matches.filter((m) => m.round !== "Gruppenphase");

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight">KO-Baum</h1>
      {koMatches.length === 0 ? (
        <p className="text-sm text-doom-silver/40">Der KO-Baum steht noch nicht fest.</p>
      ) : (
        <Bracket matches={koMatches} />
      )}
    </div>
  );
}
