import { useMemo, useState } from "react";
import { Pitch } from "@/components/game/Pitch";
import { liga1Teams2026, teamPower2026 } from "@/lib/game-data";
import { playerOverall, type RatingMode } from "@/lib/game-engine";
import { createSeededRandom, type RandomGenerator } from "@/lib/random";
import type { FormationSlot, MatchResult, PlayerSeason, SimulationResult } from "@/lib/types";

export type ResultScreenProps = {
  formation: FormationSlot[];
  formationKey: string;
  lineup: Record<string, PlayerSeason>;
  result: SimulationResult;
  rating: number;
  chemistry: number;
  ratingMode: RatingMode;
  onPlayAgain: () => void;
  onRedraft: () => void;
};

export function ResultScreen({ formation, formationKey, lineup, result, rating, chemistry, ratingMode, onPlayAgain }: ResultScreenProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const [tableOpen, setTableOpen] = useState(false);
  const details = useMemo(() => buildSeasonDetails({ formation, lineup, result, rating, chemistry, ratingMode }), [
    chemistry,
    formation,
    lineup,
    rating,
    ratingMode,
    result,
  ]);
  const shareText = buildShareText(details, result);

  async function copyResult() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API tidak tersedia");
      await navigator.clipboard.writeText(shareText);
      setCopyStatus("success");
    } catch {
      window.prompt("Clipboard gagal. Salin hasil ini secara manual:", shareText);
      setCopyStatus("error");
    }
  }

  return (
    <section className="result-screen">
      <div className="result-game-layout">
        <aside className="result-pitch-column" aria-label="Formasi akhir">
          <ResultFormationStatus formationKey={formationKey} onReset={onPlayAgain} />
          <Pitch formation={formation} lineup={lineup} compact />
        </aside>

        <div className="result-page">
          <YourXi formationKey={formationKey} rating={rating} rows={details.squadRows} />
          <SeasonResults matches={details.matches} />
          <FinishSummary details={details} />
          <TeamStats result={result} />
          <button className="primary-button season-share-button" type="button" onClick={copyResult}>
            {copyStatus === "success" ? "Hasil disalin" : "Share musim"}
          </button>
          {copyStatus === "error" && <p className="copy-feedback">Clipboard gagal. Gunakan teks manual yang muncul.</p>}
          <SeasonAwards awards={details.awards} />
          <PlayerStatsTable stats={details.playerStats} />
          <SeasonExtras cleanSheets={details.cleanSheets} highestScoring={details.highestScoring} biggestWin={details.biggestWin} />
          <LeagueTable standings={details.standings} open={tableOpen} onToggle={() => setTableOpen((current) => !current)} />
          <div className="result-bottom-actions">
            <button className="ghost-button" type="button" onClick={copyResult}>
              {copyStatus === "success" ? "Hasil disalin" : "Share"}
            </button>
            <button className="primary-button" type="button" onClick={onPlayAgain}>
              New Run
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultFormationStatus({ formationKey, onReset }: { formationKey: string; onReset: () => void }) {
  return (
    <section className="result-formation-status" aria-label="Status formasi hasil">
      <div>
        <span>Formation</span>
        <strong>{formatFormationKey(formationKey)}</strong>
      </div>
      <div className="result-formation-meta">
        <span>Rerolls:</span>
        <div className="reroll-dots" aria-hidden="true">
          <i className="active" />
          <i className="active" />
          <i className="active" />
        </div>
        <strong>11/11</strong>
        <button aria-label="Mulai ulang" className="formation-reset-button" type="button" onClick={onReset}>
          &#8635;
        </button>
      </div>
      <div className="result-formation-line" />
    </section>
  );
}

function SeasonResults({ matches }: { matches: ScoredMatch[] }) {
  return (
    <section className="season-results-card">
      <p className="result-section-label">Season Results</p>
      <div className="season-result-list">
        {matches.map((match) => (
          <div className={`season-match-row ${match.status}`} key={`${match.matchday}-${match.team}-${match.home}`}>
            <div>
              <span className="match-status">{match.statusLabel}</span>
              <strong>
                {match.team} {match.home ? "(K)" : "(T)"}
              </strong>
            </div>
            <strong className="match-score">
              {match.forGoals}-{match.againstGoals}
            </strong>
            {match.scorers.length > 0 && (
              <p>
                {match.scorers.map((scorer) => `${scorer.name} ${scorer.minute}'`).join("  ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinishSummary({ details }: { details: SeasonDetails }) {
  return (
    <>
      <div className="finish-grid">
        <div>
          <span>Finished</span>
          <strong>{ordinal(details.finish)}</strong>
        </div>
        <div>
          <span>Projected</span>
          <strong>{ordinal(details.projection.finish)}</strong>
        </div>
        <div className={`performance-${details.performanceTone}`}>
          <strong>{details.performanceLabel}</strong>
        </div>
      </div>
      <section className="season-verdict-card">
        <h2>{details.verdictTitle}</h2>
        <p>{details.verdictText}</p>
        <small>
          Rating {details.rating}, chemistry {details.chemistry}. Ekspektasi awal: finis {ordinal(details.projection.finish)} dengan sekitar{" "}
          {details.projection.points} poin.
        </small>
      </section>
    </>
  );
}

function YourXi({ formationKey, rating, rows }: { formationKey: string; rating: number; rows: SquadRow[] }) {
  return (
    <section className="result-card result-xi-card">
      <div className="result-xi-title">
        <h2>XI Kamu</h2>
        <p>{formatFormationKey(formationKey)} - Overall {rating}</p>
      </div>
      <div className="result-xi-list">
        {rows.map(({ player, slot, overall }) => (
          <div className="result-xi-row" key={slot.id}>
            <span className={`slot-chip chip-${player.group.toLowerCase()}`}>{slotShortLabel(slot)}</span>
            <strong>{player.name}</strong>
            <span>{teamCode(player.team)} {player.season}</span>
            <b>{overall}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamStats({ result }: { result: SimulationResult }) {
  return (
    <div className="team-stat-grid">
      <StatBox label="Win" value={result.wins} tone="win" />
      <StatBox label="Draw" value={result.draws} tone="draw" />
      <StatBox label="Lose" value={result.losses} tone="loss" />
      <StatBox label="Point" value={result.points} />
      <StatBox label="Goal For" value={result.gf} tone="win" />
      <StatBox label="Goal Against" value={result.ga} tone="loss" />
    </div>
  );
}

function StatBox({ label, value, tone }: { label: string; value: number; tone?: "win" | "draw" | "loss" }) {
  return (
    <div className={tone ? `stat-${tone}` : ""}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function SeasonAwards({ awards }: { awards: SeasonAward[] }) {
  return (
    <section className="season-awards">
      <p className="result-section-label">Season Awards</p>
      <div className="award-grid">
        {awards.map((award) => (
          <div className={award.featured ? "featured" : ""} key={award.label}>
            <span>{award.label}</span>
            <strong>{award.player}</strong>
            <small>{award.detail}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlayerStatsTable({ stats }: { stats: PlayerStat[] }) {
  return (
    <section className="result-card player-stats-card">
      <div className="player-stats-head">
        <span>Player</span>
        <span>G</span>
        <span>A</span>
        <span>CS</span>
      </div>
      {stats.map((stat) => (
        <div className="player-stat-row" key={stat.player.id}>
          <span className={`slot-chip chip-${stat.player.group.toLowerCase()}`}>{slotShortLabel(stat.slot)}</span>
          <strong>{stat.player.name}</strong>
          <b>{stat.goals || "-"}</b>
          <b>{stat.assists || "-"}</b>
          <b>{stat.cleanSheets || "-"}</b>
        </div>
      ))}
    </section>
  );
}

function SeasonExtras({
  cleanSheets,
  highestScoring,
  biggestWin,
}: {
  cleanSheets: number;
  highestScoring: ScoredMatch | null;
  biggestWin: ScoredMatch | null;
}) {
  return (
    <div className="season-extra-grid">
      <div>
        <strong>{cleanSheets}</strong>
        <span>Clean Sheets</span>
      </div>
      <div>
        <strong>{biggestWin?.forGoals ?? 0}-{biggestWin?.againstGoals ?? 0}</strong>
        <span>Menang terbesar vs {biggestWin?.team ?? "-"}</span>
      </div>
      <div>
        <span>Highest Scoring</span>
        <strong>
          {highestScoring ? `${highestScoring.forGoals}-${highestScoring.againstGoals} vs ${highestScoring.team}` : "-"}
        </strong>
      </div>
    </div>
  );
}

function LeagueTable({
  standings,
  open,
  onToggle,
}: {
  standings: StandingRow[];
  open: boolean;
  onToggle: () => void;
}) {
  const visibleRows = open ? standings : standings.slice(0, 6);

  return (
    <section className="result-card league-table-card">
      <button className="league-table-toggle" type="button" onClick={onToggle}>
        <span>Final tabel klasemen</span>
        <b>{open ? "Tutup" : "Expand"}</b>
      </button>
      <div className="league-table">
        <div className="league-table-head">
          <span>#</span>
          <span>Tim</span>
          <span>W</span>
          <span>D</span>
          <span>L</span>
          <span>GD</span>
          <span>Pts</span>
        </div>
        {visibleRows.map((row) => (
          <div className={row.isUserTeam ? "user-team" : ""} key={row.team}>
            <span>{row.position}</span>
            <strong>{row.team}</strong>
            <span>{row.wins}</span>
            <span>{row.draws}</span>
            <span>{row.losses}</span>
            <span>{row.goalDifference >= 0 ? `+${row.goalDifference}` : row.goalDifference}</span>
            <b>{row.points}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildSeasonDetails({
  chemistry,
  formation,
  lineup,
  rating,
  ratingMode,
  result,
}: {
  chemistry: number;
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  rating: number;
  ratingMode: RatingMode;
  result: SimulationResult;
}): SeasonDetails {
  const squadRows = buildSquadRows(formation, lineup, ratingMode);
  const { matches, playerStats } = buildMatchScoring(result, squadRows);
  const standings = buildStandings(result);
  const finish = standings.find((row) => row.isUserTeam)?.position ?? 18;
  const projection = buildProjection(rating);
  const performanceDelta = projection.finish - finish;
  const performanceTone = performanceDelta >= 2 ? "over" : performanceDelta <= -2 ? "under" : "met";
  const performanceLabel = performanceTone === "over" ? "Overperformed" : performanceTone === "under" ? "Underperformed" : "Performed";
  const cleanSheets = result.matches.filter((match) => match.againstGoals === 0).length;
  const highestScoring = [...matches].sort((a, b) => b.forGoals + b.againstGoals - (a.forGoals + a.againstGoals))[0] ?? null;
  const biggestWin = [...matches].filter((match) => match.status === "win").sort((a, b) => b.forGoals - b.againstGoals - (a.forGoals - a.againstGoals))[0] ?? null;
  const awards = buildAwards(playerStats);
  const { verdictTitle, verdictText } = buildVerdict({ finish, performanceTone, result });

  return {
    awards,
    biggestWin,
    chemistry,
    cleanSheets,
    finish,
    highestScoring,
    matches,
    performanceLabel,
    performanceTone,
    playerStats,
    projection,
    rating,
    squadRows,
    standings,
    verdictText,
    verdictTitle,
  };
}

function buildSquadRows(formation: FormationSlot[], lineup: Record<string, PlayerSeason>, ratingMode: RatingMode): SquadRow[] {
  return formation.flatMap((slot) => {
    const player = lineup[slot.id];
    return player ? [{ slot, player, overall: playerOverall(player, ratingMode) }] : [];
  });
}

function buildMatchScoring(result: SimulationResult, squadRows: SquadRow[]) {
  const random = createSeededRandom(`${result.seed}:scorers`);
  const playerStats = squadRows.map((row) => ({
    ...row,
    assists: 0,
    cleanSheets: 0,
    goals: 0,
  }));
  const outfieldStats = playerStats.filter((stat) => stat.player.group !== "GK");
  const keeperAndDefenders = playerStats.filter((stat) => stat.player.group === "GK" || stat.player.group === "DEF");

  const matches = result.matches.map((match) => {
    const scorers: GoalEvent[] = [];
    for (let goal = 0; goal < match.forGoals; goal += 1) {
      const scorer = pickWeighted(outfieldStats, random, scoringWeight);
      if (!scorer) continue;
      scorer.goals += 1;
      const minute = Math.max(1, Math.min(90, Math.round(4 + random() * 86)));
      scorers.push({ name: scorer.player.name, minute });
      const assister = pickWeighted(
        outfieldStats.filter((stat) => stat.player.id !== scorer.player.id),
        random,
        assistWeight,
      );
      if (assister && random() > 0.12) assister.assists += 1;
    }

    if (match.againstGoals === 0) {
      keeperAndDefenders.forEach((stat) => {
        stat.cleanSheets += 1;
      });
    }

    const status = getMatchStatus(match);
    const statusLabel = getStatusLabel(status);
    return {
      ...match,
      scorers: scorers.sort((a, b) => a.minute - b.minute),
      status,
      statusLabel,
    };
  });

  return {
    matches,
    playerStats: playerStats.sort((a, b) => b.goals - a.goals || b.assists - a.assists || b.overall - a.overall),
  };
}

function buildStandings(result: SimulationResult): StandingRow[] {
  const random = createSeededRandom(`${result.seed}:table`);
  const opponentRows = liga1Teams2026
    .filter((team) => team !== result.replacedTeam)
    .map((team) => {
      const power = teamPower2026[team] ?? 70;
      const points = Math.round(clamp(30 + (power - 66) * 1.2 + random() * 24, 26, 74));
      const wins = Math.max(6, Math.min(22, Math.round(points / 3 - random() * 3)));
      const draws = Math.max(3, Math.min(15, points - wins * 3));
      const losses = Math.max(0, 34 - wins - draws);
      const gf = Math.round(clamp(33 + (power - 66) * 1.05 + random() * 26, 28, 78));
      const ga = Math.round(clamp(34 - (power - 70) * 0.8 + random() * 24, 24, 76));
      return { draws, ga, gf, isUserTeam: false, losses, points, team, wins };
    });
  const userRow = {
    draws: result.draws,
    ga: result.ga,
    gf: result.gf,
    isUserTeam: true,
    losses: result.losses,
    points: result.points,
    team: "34-0 XI",
    wins: result.wins,
  };

  return [...opponentRows, userRow]
    .sort((a, b) => b.points - a.points || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf)
    .map((row, index) => ({ ...row, goalDifference: row.gf - row.ga, position: index + 1 }));
}

function buildProjection(rating: number) {
  const normalized = clamp(rating || 0, 40, 92);
  return {
    finish: Math.round(clamp(18 - (normalized - 50) * 0.36, 1, 18)),
    points: Math.round(clamp(20 + normalized * 0.42, 26, 86)),
  };
}

function buildAwards(stats: PlayerStat[]): SeasonAward[] {
  const topScorer = [...stats].sort((a, b) => b.goals - a.goals || b.overall - a.overall)[0];
  const playmaker = [...stats].sort((a, b) => b.assists - a.assists || b.overall - a.overall)[0];
  const glove = [...stats].filter((stat) => stat.player.group === "GK").sort((a, b) => b.cleanSheets - a.cleanSheets)[0];
  const playerOfSeason = [...stats].sort((a, b) => awardScore(b) - awardScore(a))[0];

  return [
    { label: "Golden Boot", player: topScorer?.player.name ?? "-", detail: `${topScorer?.goals ?? 0} gol` },
    { label: "Playmaker", player: playmaker?.player.name ?? "-", detail: `${playmaker?.assists ?? 0} assist` },
    { label: "Golden Glove", player: glove?.player.name ?? "-", detail: `${glove?.cleanSheets ?? 0} clean sheet` },
    {
      label: "Player of the Season",
      player: playerOfSeason?.player.name ?? "-",
      detail: `${playerOfSeason?.goals ?? 0}G - ${playerOfSeason?.assists ?? 0}A`,
      featured: true,
    },
  ];
}

function buildVerdict({
  finish,
  performanceTone,
  result,
}: {
  finish: number;
  performanceTone: PerformanceTone;
  result: SimulationResult;
}) {
  if (finish === 1) {
    return {
      verdictTitle: "Juara, tidak ada debat.",
      verdictText: `${result.points} poin dan ${result.gf} gol. Draft ini langsung jadi cerita utama musim.`,
    };
  }
  if (finish <= 4) {
    return {
      verdictTitle: "Masuk papan atas.",
      verdictText: `Finis ${ordinal(finish)} dengan ${result.points} poin. Skuad ini cukup matang untuk mengejar Asia.`,
    };
  }
  if (finish <= 10) {
    return {
      verdictTitle: performanceTone === "over" ? "Melampaui prediksi." : "Musim yang solid.",
      verdictText: `Finis ${ordinal(finish)}. Ada fondasi bagus, tapi beberapa posisi masih butuh upgrade.`,
    };
  }
  return {
    verdictTitle: "Butuh transfer baru.",
    verdictText: `Finis ${ordinal(finish)} dengan ${result.losses} kekalahan. Tim ini bertahan, tapi belum cukup tajam untuk papan atas.`,
  };
}

function buildShareText(details: SeasonDetails, result: SimulationResult) {
  return [
    `34-0 Indonesia: finis ${ordinal(details.finish)} (${details.performanceLabel})`,
    `Record: ${result.wins}-${result.draws}-${result.losses}`,
    `Poin: ${result.points}`,
    `Gol: ${result.gf}-${result.ga}`,
    `Top scorer: ${details.awards[0]?.player ?? "-"} (${details.awards[0]?.detail ?? "-"})`,
    `Player of the Season: ${details.awards[3]?.player ?? "-"}`,
    `Seed: ${result.seed}`,
  ].join("\n");
}

function pickWeighted<T>(items: T[], random: RandomGenerator, weight: (item: T) => number): T | null {
  if (!items.length) return null;
  const total = items.reduce((sum, item) => sum + weight(item), 0);
  let cursor = random() * total;
  for (const item of items) {
    cursor -= weight(item);
    if (cursor <= 0) return item;
  }
  return items[items.length - 1] ?? null;
}

function scoringWeight(stat: PlayerStat) {
  const groupBonus = stat.player.group === "FWD" ? 1.6 : stat.player.group === "MID" ? 1 : 0.32;
  return Math.max(1, (stat.player.attack * 0.72 + stat.player.creative * 0.2 + stat.overall * 0.08) * groupBonus);
}

function assistWeight(stat: PlayerStat) {
  const groupBonus = stat.player.group === "MID" ? 1.4 : stat.player.group === "FWD" ? 0.9 : 0.42;
  return Math.max(1, (stat.player.creative * 0.72 + stat.player.attack * 0.18 + stat.overall * 0.1) * groupBonus);
}

function awardScore(stat: PlayerStat) {
  return stat.goals * 4 + stat.assists * 3 + stat.cleanSheets * 1.2 + stat.overall * 0.3;
}

function getMatchStatus(match: MatchResult): MatchStatus {
  if (match.forGoals > match.againstGoals) return "win";
  if (match.forGoals === match.againstGoals) return "draw";
  return "loss";
}

function getStatusLabel(status: MatchStatus): "W" | "D" | "L" {
  if (status === "win") return "W";
  if (status === "draw") return "D";
  return "L";
}

function slotShortLabel(slot: FormationSlot) {
  return slot.id.replace(/[0-9]/g, "");
}

function teamCode(team: string) {
  const words = team.split(/\s+/).filter(Boolean);
  if (words.length > 1) return words.map((word) => word[0]).join("").slice(0, 3).toUpperCase();
  return team.slice(0, 3).toUpperCase();
}

function formatFormationKey(value: string) {
  return value.split("").join("-");
}

function ordinal(value: number) {
  return `${value}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

type MatchStatus = "win" | "draw" | "loss";
type PerformanceTone = "over" | "under" | "met";

type GoalEvent = {
  name: string;
  minute: number;
};

type SquadRow = {
  overall: number;
  player: PlayerSeason;
  slot: FormationSlot;
};

type PlayerStat = SquadRow & {
  assists: number;
  cleanSheets: number;
  goals: number;
};

type ScoredMatch = MatchResult & {
  scorers: GoalEvent[];
  status: MatchStatus;
  statusLabel: "W" | "D" | "L";
};

type StandingRow = {
  draws: number;
  ga: number;
  gf: number;
  goalDifference: number;
  isUserTeam: boolean;
  losses: number;
  points: number;
  position: number;
  team: string;
  wins: number;
};

type SeasonAward = {
  detail: string;
  featured?: boolean;
  label: string;
  player: string;
};

type SeasonDetails = {
  awards: SeasonAward[];
  biggestWin: ScoredMatch | null;
  chemistry: number;
  cleanSheets: number;
  finish: number;
  highestScoring: ScoredMatch | null;
  matches: ScoredMatch[];
  performanceLabel: string;
  performanceTone: PerformanceTone;
  playerStats: PlayerStat[];
  projection: { finish: number; points: number };
  rating: number;
  squadRows: SquadRow[];
  standings: StandingRow[];
  verdictText: string;
  verdictTitle: string;
};
