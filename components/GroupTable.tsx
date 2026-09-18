import { Standing } from "@/lib/types";

export function GroupTable({
  standings,
  dense = false,
  qualifySpots = 2,
}: {
  standings: Standing[];
  dense?: boolean;
  qualifySpots?: number;
}) {
  const cell = dense ? "px-2.5 py-2.5 text-base" : "px-3 py-2 text-sm";

  return (
    <div className="chamfer overflow-hidden border border-doom-border bg-doom-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left">
          <thead>
            <tr className="border-b border-doom-border font-display text-doom-silver/45 uppercase tracking-wide">
              <th className={`${cell} font-semibold`}>#</th>
              <th className={`${cell} font-semibold`}>Team</th>
              <th className={`${cell} font-semibold text-center`}>Sp</th>
              <th className={`${cell} font-semibold text-center`}>S</th>
              <th className={`${cell} font-semibold text-center`}>U</th>
              <th className={`${cell} font-semibold text-center`}>N</th>
              <th className={`${cell} font-semibold text-center`}>Becher</th>
              <th className={`${cell} font-semibold text-center`}>Diff</th>
              <th className={`${cell} font-semibold text-center`}>Pkt</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => {
              const qualified = i < qualifySpots;
              return (
                <tr
                  key={row.team.id}
                  className={`border-b border-doom-border/60 last:border-0 ${
                    qualified ? "bg-doom-green/[0.04]" : ""
                  }`}
                >
                  <td className={`${cell} relative text-doom-silver/50`}>
                    {qualified && <span className="absolute inset-y-0 left-0 w-[3px] bg-doom-green" />}
                    {i + 1}
                  </td>
                  <td className={`${cell} font-medium`}>{row.team.name}</td>
                  <td className={`${cell} text-center tabular`}>{row.played}</td>
                  <td className={`${cell} text-center tabular`}>{row.wins}</td>
                  <td className={`${cell} text-center tabular`}>{row.draws}</td>
                  <td className={`${cell} text-center tabular`}>{row.losses}</td>
                  <td className={`${cell} text-center tabular text-doom-silver/70`}>
                    {row.cupsFor}:{row.cupsAgainst}
                  </td>
                  <td
                    className={`${cell} text-center tabular ${
                      row.cupDiff > 0 ? "text-doom-green" : row.cupDiff < 0 ? "text-red-500" : ""
                    }`}
                  >
                    {row.cupDiff > 0 ? "+" : ""}
                    {row.cupDiff}
                  </td>
                  <td className={`${cell} text-center tabular font-bold text-doom-green`}>{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="flex items-center gap-1.5 border-t border-doom-border px-2.5 py-1.5 font-display text-[11px] uppercase tracking-wide text-doom-silver/40">
        <span className="h-1.5 w-1.5 rounded-full bg-doom-green" />
        Top {qualifySpots} qualifizieren sich für die KO-Phase
      </p>
    </div>
  );
}
