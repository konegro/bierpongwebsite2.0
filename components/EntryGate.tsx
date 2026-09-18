"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, ChevronLeft } from "lucide-react";
import { useTeam } from "@/lib/team-context";
import { useTournament } from "@/lib/tournament-store";
import { TeamList } from "@/components/TeamList";

export function EntryGate() {
  const [step, setStep] = useState<"role" | "team">("role");
  const { setTeamId } = useTeam();
  const { groups, teams } = useTournament();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-doom-black px-6 py-10">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center font-display text-3xl font-bold uppercase tracking-tight">
          Bierpong Elbe 2026
        </h1>
        <p className="mb-8 text-center text-sm text-doom-silver/50">
          {step === "role" ? "Wie möchtest du beitreten?" : "Wähle dein Team"}
        </p>

        {step === "role" ? (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setStep("team")}
              className="focus-doom chamfer flex items-center gap-3 border border-doom-green bg-doom-green/10 p-4 text-left transition-colors hover:bg-doom-green/15"
            >
              <User size={22} className="text-doom-green" />
              <span>
                <span className="block font-display font-semibold uppercase tracking-wide text-doom-green">
                  Spieler
                </span>
                <span className="block text-xs text-doom-silver/50">Team auswählen &amp; mitverfolgen</span>
              </span>
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="focus-doom chamfer flex items-center gap-3 border border-doom-border bg-doom-card p-4 text-left transition-colors hover:border-doom-silver/40"
            >
              <ShieldCheck size={22} className="text-doom-silver/70" />
              <span>
                <span className="block font-display font-semibold uppercase tracking-wide">
                  Admin
                </span>
                <span className="block text-xs text-doom-silver/50">Turnierleitung, PIN erforderlich</span>
              </span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setStep("role")}
              className="focus-doom flex items-center gap-1 self-start text-sm text-doom-silver/50 hover:text-doom-silver"
            >
              <ChevronLeft size={16} /> Zurück
            </button>
            <TeamList groups={groups} teams={teams} onSelect={setTeamId} />
          </div>
        )}
      </div>
    </div>
  );
}
