import { Medal, Beer, Trophy, type LucideIcon } from "lucide-react";

const rules: { title: string; icon: LucideIcon; items: string[] }[] = [
  {
    title: "Punktesystem",
    icon: Medal,
    items: [
      "Sieg: 3 Punkte",
      "Unentschieden: 1 Punkt",
      "Niederlage: 0 Punkte",
      "Bei Gleichstand entscheidet die Becher-Differenz",
    ],
  },
  {
    title: "Spielablauf",
    icon: Beer,
    items: [
      "10 Becher im Dreieck pro Team",
      "Re-Racks nach Ansage der Turnierleitung",
      "Eis-Cup zählt nicht, muss aber getrunken werden",
      "Rebuttal (letzter Wurf) ist erlaubt",
    ],
  },
  {
    title: "Turnierformat",
    icon: Trophy,
    items: [
      "Gruppenphase: Jeder gegen Jeden innerhalb der Gruppe",
      "Die besten zwei Teams pro Gruppe ziehen in die KO-Phase ein",
      "KO-Phase: Einfaches Ausscheidungssystem bis zum Finale",
    ],
  },
];

export default function RegelnPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Regeln</h1>
      <div className="flex flex-col gap-4">
        {rules.map((section) => (
          <section key={section.title} className="chamfer border border-doom-border bg-doom-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <section.icon size={18} className="text-doom-green" />
              <h2 className="font-display text-base font-semibold uppercase tracking-wide text-doom-green">
                {section.title}
              </h2>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-doom-silver/80">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 text-doom-green">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
