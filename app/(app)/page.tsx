"use client";

import { MatchCard } from "@/components/MatchCard";
import { StatTile } from "@/components/StatTile";
import { MyTeamCard } from "@/components/MyTeamCard";
import { useTournament } from "@/lib/tournament-store";
import { Users, LayoutGrid, Radio, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const { teams, groups, matches } = useTournament();
  const liveMatches = matches.filter((m) => m.status === "live");
  const [heroMatch, ...restLive] = liveMatches;
  const upcomingMatches = matches.filter((m) => m.status === "scheduled").slice(0, 4);
  const finishedCount = matches.filter((m) => m.status === "finished").length;

  const heroTeamA = heroMatch ? teams.find((t) => t.id === heroMatch.teamAId) : null;
  const heroTeamB = heroMatch ? teams.find((t) => t.id === heroMatch.teamBId) : null;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-doom-green">
          Runde 1 · Gruppenphase
        </p>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight">Xenogenesis Cup</h1>
      </header>

      <MyTeamCard />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={Users} label="Teams" value={teams.length} />
        <StatTile icon={LayoutGrid} label="Gruppen" value={groups.length} />
        <StatTile icon={Radio} label="Live" value={liveMatches.length} />
        <StatTile icon={CheckCircle2} label="Beendet" value={finishedCount} />
      </section>

      {heroMatch && (
        <section className="chamfer glow-green-lg relative overflow-hidden border border-doom-green bg-doom-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-display text-xs font-semibold uppercase tracking-wider text-doom-silver/45">
              {heroMatch.table} · {heroMatch.round}
            </span>
            <span className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-doom-green">
              <Radio size={12} className="motion-safe:animate-pulse" /> Live jetzt
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 flex-1 truncate font-display text-xl font-semibold uppercase tracking-tight">
              {heroTeamA?.name ?? "TBD"}
            </span>
            <span className="font-mono tabular shrink-0 text-4xl font-bold text-doom-green">
              {heroMatch.cupsA ?? "–"}:{heroMatch.cupsB ?? "–"}
            </span>
            <span className="min-w-0 flex-1 truncate text-right font-display text-xl font-semibold uppercase tracking-tight">
              {heroTeamB?.name ?? "TBD"}
            </span>
          </div>
        </section>
      )}

      {restLive.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-xs font-semibold uppercase tracking-wide text-doom-silver/45">
            Weitere Live-Spiele
          </h2>
          {restLive.map((m) => (
            <MatchCard key={m.id} match={m} compact />
          ))}
        </section>
      )}

      <section className="flex flex-col gap-2.5">
        <h2 className="font-display text-xs font-semibold uppercase tracking-wide text-doom-silver/45">
          Als Nächstes
        </h2>
        {upcomingMatches.length === 0 ? (
          <p className="text-sm text-doom-silver/40">
            {teams.length === 0 ? "Die Turnierleitung legt gerade Teams an." : "Keine weiteren Spiele geplant."}
          </p>
        ) : (
          upcomingMatches.map((m) => <MatchCard key={m.id} match={m} compact />)
        )}
      </section>
    </div>
  );
}
