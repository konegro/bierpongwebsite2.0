"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { EntryGate } from "@/components/EntryGate";
import { TeamProvider, useTeam } from "@/lib/team-context";

// ponytail: temporärer Test-Zugang, damit Admin/Spieler-Ansicht auf einem
// Gerät hin- und hergeschaltet werden kann. Vor dem echten Turnier
// verstecken/entfernen, sonst findet jeder Gast den Admin-Bereich.
function AdminShortcut() {
  return (
    <Link
      href="/admin"
      className="focus-doom chamfer-sm fixed right-4 z-40 flex h-9 w-9 items-center justify-center border border-doom-border bg-doom-card/90 text-doom-silver/60 backdrop-blur transition-colors hover:border-doom-green hover:text-doom-green"
      style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
      aria-label="Zur Turnierleitung"
    >
      <ShieldCheck size={18} />
    </Link>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { teamId } = useTeam();

  if (!teamId) return <EntryGate />;

  return (
    <div className="flex min-h-screen flex-col">
      <AdminShortcut />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-6">{children}</main>
      <BottomNav />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeamProvider>
      <AppShell>{children}</AppShell>
    </TeamProvider>
  );
}
