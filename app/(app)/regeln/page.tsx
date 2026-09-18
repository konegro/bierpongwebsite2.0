import {
  Layers,
  Beer,
  Swords,
  Target,
  LayoutGrid,
  Sparkles,
  Scale,
  type LucideIcon,
} from "lucide-react";

interface RuleItem {
  label: string;
  text: string;
}

interface RuleSection {
  title: string;
  icon: LucideIcon;
  items: RuleItem[];
}

const ruleSections: RuleSection[] = [
  {
    title: "I. Aufbau & Material",
    icon: Layers,
    items: [
      {
        label: "Spielfeld",
        text: "Gespielt wird auf einem regulären Bierpong-Tisch.",
      },
      {
        label: "Becher-Setup",
        text: "10 Becher pro Team, sauber als Pyramide/Dreieck an der Tischkante (bzw. auf den Markierungen) aufgestellt.",
      },
      {
        label: "Befüllung",
        text: "Alle Spielbecher werden mit Wasser befüllt. Die Getränkeeinnahme erfolgt über separate Behältnisse.",
      },
    ],
  },
  {
    title: "II. Wie wird getrunken?",
    icon: Beer,
    items: [
      {
        label: "Getränkewahl",
        text: "Jede/r Spieler/in trinkt während des Spiels ein Getränk freier Wahl.",
      },
      {
        label: "Richtwert",
        text: "1 Bier pro Spiel (~5 Vol-%). Andere Getränke sind mengenmäßig äquivalent dem Alkoholgehalt anzupassen.",
      },
      {
        label: "Wohlbefinden",
        text: "Bei Unwohlsein kann hiervon jederzeit abgewichen werden.",
      },
    ],
  },
  {
    title: "III. Grundlegender Spielablauf",
    icon: Swords,
    items: [
      {
        label: "Startrecht",
        text: "Je ein Wurf pro Team mit dem schwachen Arm. Wer trifft, beginnt. Treffen beide, entscheidet die Becherreihe näher zur Tischmitte. Bei erneutem Gleichstand werfen die anderen Teampartner, bis eine Entscheidung steht.",
      },
      {
        label: "Spielzüge",
        text: "Teams werfen abwechselnd. Pro Runde hat jedes Team 2 Würfe (1 Wurf pro Spieler/in).",
      },
      {
        label: "Treffer & Balls Back",
        text: "Getroffene Becher werden sofort vom Tisch genommen. Treffen beide Spieler/innen in einer Runde, gibt es 1 Ball zurück (das Team entscheidet, wer wirft).",
      },
      {
        label: "Spielende",
        text: "Es gewinnt das Team, das zuerst alle 10 Becher abräumt. Keine automatische letzte Chance (Rebuttal), da der Beginn ausgespielt wurde. Einvernehmliche Abweichungen sind vor Spielbeginn abzusprechen. Die Turnierleitung kann ab der K.O.-Phase ein einheitliches Ende vorgeben.",
      },
    ],
  },
  {
    title: "IV. Wurftechniken & Abwehr",
    icon: Target,
    items: [
      {
        label: "Grundsatz",
        text: "Ein Wurf gilt als abgeschlossen, sobald der Ball nach dem Anvisieren die Hand verlässt. Fehlwürfe dürfen nicht wiederholt werden.",
      },
      {
        label: "Direktwurf",
        text: "Fliegt direkt in den Becher und darf nicht abgewehrt werden.",
      },
      {
        label: "Aufsetzer",
        text: "Berührt min. 1x den Tisch vor dem Becher. Darf durch Wegschlagen abgewehrt werden. Bonus: Gelingt der Aufsetzer, erhält die/der Werfende persönlich einen Ball für einen Extraversuch zurück.",
      },
      {
        label: "Grenzen",
        text: "Keine Ellbogen-Regel. Es ist lediglich darauf zu achten, hinter der Tischplatte zu stehen (nicht längs daneben).",
      },
    ],
  },
  {
    title: "V. Formationen & Umstellen",
    icon: LayoutGrid,
    items: [
      {
        label: "Anzahl & Timing",
        text: "Jedes Team darf 1x im gesamten Spiel vor Beginn des ersten eigenen Teamwurfs ein Umstellen verlangen.",
      },
      {
        label: "Formen",
        text: "Beliebig auf den Markierungen bzw. Ursprungspositionen. Einzige erlaubte Ausnahme hiervon ist das „Gummibärchen“.",
      },
    ],
  },
  {
    title: "VI. Besondere Regelungen",
    icon: Sparkles,
    items: [
      {
        label: "Same Cup",
        text: "Treffen beide in denselben Becher, muss das gegnerische Team einen weiteren Becher nach freier Wahl wegstellen und trinken.",
      },
      {
        label: "Trick-Shot",
        text: "Rollt ein Fehlwurf ohne Bodenkontakt über die Tischmitte zurück, darf der Schütze einen Trick-Shot (z. B. rückwärts) ausführen. Das Gegnerteam darf das Zurückrollen bis zur Mittellinie verteidigen.",
      },
      {
        label: "Blasen / Fingern",
        text: "Streng verboten! Das Herausblasen rotierender Bälle wird mit dem sofortigen Wegstellen des Bechers geahndet.",
      },
      {
        label: "Pgh (Pech gehabt)",
        text: "Wird versehentlich ein teameigener Becher umgestoßen, zählt dies unabhängig vom Zeitpunkt als Treffer für das gegnerische Team.",
      },
    ],
  },
  {
    title: "VII. Schiedsordnung & Fairplay",
    icon: Scale,
    items: [
      {
        label: "Turnierleitung",
        text: "Es sind 5 Turnierleiter benannt. Deren Entscheidung ist verbindlich. Bei kniffligen Fragen können weitere Spielleiter konsultiert werden.",
      },
      {
        label: "Fairplay",
        text: "Im Zweifel geht der Spaß vor – findet gemeinsam an der Platte eine faire und sportliche Lösung!",
      },
    ],
  },
];

export default function RegelnPage() {
  return (
    <div className="flex flex-col gap-5 pb-16">
      <div>
        <div className="text-xs font-semibold tracking-wider text-doom-green uppercase">
          3. Elbe-Beerpongturnier • 18.09.2026
        </div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight">
          Turnierregeln
        </h1>
        <p className="mt-1 text-xs text-doom-silver/60">
          Offizielles Regelwerk für Spielablauf, Formationen und Schiedsordnung.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ruleSections.map((section) => (
          <section
            key={section.title}
            className="chamfer border border-doom-border bg-doom-card p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <section.icon size={18} className="text-doom-green shrink-0" />
              <h2 className="font-display text-base font-semibold uppercase tracking-wide text-doom-green">
                {section.title}
              </h2>
            </div>
            <ul className="flex flex-col gap-2.5 text-sm text-doom-silver/85">
              {section.items.map((item) => (
                <li key={item.label} className="flex gap-2">
                  <span className="mt-0.5 text-doom-green font-bold select-none">•</span>
                  <div>
                    <strong className="text-doom-silver font-semibold">
                      {item.label}:
                    </strong>{" "}
                    {item.text}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}