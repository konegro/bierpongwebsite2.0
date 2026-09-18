import type { Group, Team } from "@/lib/types";
import { Check } from "lucide-react";

export function TeamList({
  groups,
  teams,
  selectedId,
  onSelect,
}: {
  groups: Group[];
  teams: Team[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}) {
  if (teams.length === 0) {
    return (
      <p className="text-sm text-doom-silver/40">
        Noch keine Teams angelegt. Frag die Turnierleitung.
      </p>
    );
  }

  const ungrouped = teams.filter((t) => !t.groupId);

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => {
        const groupTeams = teams.filter((t) => t.groupId === group.id);
        if (groupTeams.length === 0) return null;
        return (
          <div key={group.id} className="flex flex-col gap-2">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-doom-silver/45">
              {group.name}
            </h3>
            {groupTeams.map((team) => (
              <TeamButton key={team.id} team={team} active={team.id === selectedId} onSelect={onSelect} />
            ))}
          </div>
        );
      })}
      {ungrouped.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-doom-silver/45">
            Ohne Gruppe
          </h3>
          {ungrouped.map((team) => (
            <TeamButton key={team.id} team={team} active={team.id === selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamButton({
  team,
  active,
  onSelect,
}: {
  team: Team;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(team.id)}
      className={`focus-doom chamfer-sm flex items-center justify-between border p-3 text-left transition-colors ${
        active
          ? "border-doom-green bg-doom-green/10 text-doom-green"
          : "border-doom-border bg-doom-card text-doom-silver hover:border-doom-green/50"
      }`}
    >
      <span className="font-medium">{team.name}</span>
      {active && <Check size={16} />}
    </button>
  );
}
