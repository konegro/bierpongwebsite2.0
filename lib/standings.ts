import { Match, Standing, Team } from "./types";

export function computeStandings(groupTeams: Team[], matches: Match[]): Standing[] {
  const table = new Map<string, Standing>(
    groupTeams.map((team) => [
      team.id,
      { team, played: 0, wins: 0, draws: 0, losses: 0, cupsFor: 0, cupsAgainst: 0, cupDiff: 0, points: 0 },
    ])
  );

  for (const match of matches) {
    if (match.status !== "finished" || match.cupsA === null || match.cupsB === null) continue;
    const a = table.get(match.teamAId);
    const b = table.get(match.teamBId);
    if (!a || !b) continue;

    a.played++;
    b.played++;
    a.cupsFor += match.cupsA;
    a.cupsAgainst += match.cupsB;
    b.cupsFor += match.cupsB;
    b.cupsAgainst += match.cupsA;

    if (match.cupsA > match.cupsB) {
      a.wins++;
      a.points += 3;
      b.losses++;
    } else if (match.cupsA < match.cupsB) {
      b.wins++;
      b.points += 3;
      a.losses++;
    } else {
      a.draws++;
      b.draws++;
      a.points += 1;
      b.points += 1;
    }
  }

  for (const row of table.values()) {
    row.cupDiff = row.cupsFor - row.cupsAgainst;
  }

  return Array.from(table.values()).sort(
    (x, y) => y.points - x.points || y.cupDiff - x.cupDiff || y.cupsFor - x.cupsFor
  );
}
