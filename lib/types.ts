export type Group = {
  id: string;
  name: string;
};

export type Player = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  groupId: string;
  players: Player[];
};

export type MatchStatus = "scheduled" | "live" | "finished";

export type Match = {
  id: string;
  groupId: string;
  round: string; // "Gruppenphase" | "Halbfinale" | "Finale" | ...
  table: string;
  teamAId: string;
  teamBId: string;
  cupsA: number | null;
  cupsB: number | null;
  status: MatchStatus;
};

export type Standing = {
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  cupsFor: number;
  cupsAgainst: number;
  cupDiff: number;
  points: number;
};

export type TournamentSettings = {
  startAt: string | null;
};
