import { Pitch } from "@/components/game/Pitch";
import { playerOverall, type RatingMode } from "@/lib/game-engine";
import type { FormationSlot, PlayerSeason, SimulationResult } from "@/lib/types";

export type ResultScreenProps = {
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  result: SimulationResult;
  rating: number;
  chemistry: number;
  ratingMode: RatingMode;
  onPlayAgain: () => void;
  onRedraft: () => void;
};

export function ResultScreen({ formation, lineup, result, rating, chemistry, ratingMode, onPlayAgain, onRedraft }: ResultScreenProps) {
  const achievement = getAchievement(result);
  const bestPlayer = getBestPlayer(lineup, ratingMode);
  const topScorer = getTopScorer(lineup, result);
  const shareText = buildShareText({ result, rating, chemistry, achievement, bestPlayer, topScorer });

  async function copyResult() {
    await navigator.clipboard.writeText(shareText);
  }

  return (
    <section className="result-screen">
      <div className="result-main result-box">
        <ShareCard
          achievement={achievement}
          bestPlayer={bestPlayer}
          chemistry={chemistry}
          rating={rating}
          result={result}
          topScorer={topScorer}
        />
        <div className="result-actions">
          <button className="primary-button" type="button" onClick={copyResult}>Copy hasil</button>
          <button className="primary-button" type="button" onClick={onRedraft}>Draft ulang</button>
          <button className="ghost-button" type="button" onClick={onPlayAgain}>Setup baru</button>
        </div>
      </div>

      <div className="result-side">
        <div className="metric-grid">
          <Metric label="Rating" value={rating} />
          <Metric label="Chemistry" value={chemistry} />
          <Metric label="Poin" value={result.points} />
          <Metric label="Gol" value={`${result.gf}-${result.ga}`} />
        </div>
        <div className="metric-card">
          <p className="eyebrow">Kode share</p>
          <h2>{result.seed}</h2>
          <p className="player-meta">Seed ini menghasilkan ulang jadwal dan skor simulasi yang sama.</p>
        </div>
        <Pitch formation={formation} lineup={lineup} compact />
      </div>
    </section>
  );
}

function ShareCard({
  achievement,
  bestPlayer,
  chemistry,
  rating,
  result,
  topScorer,
}: {
  achievement: string;
  bestPlayer: PlayerHighlight | null;
  chemistry: number;
  rating: number;
  result: SimulationResult;
  topScorer: PlayerHighlight | null;
}) {
  const goalDiff = result.gf - result.ga;

  return (
    <>
      <div className="share-card-head">
        <p className="eyebrow">Hasil musim</p>
        <span className="achievement-badge">{achievement}</span>
      </div>
      <h2>{getHeadline(result)}</h2>
      <div className="share-summary-grid">
        <SummaryMetric label="Record" value={`${result.wins}-${result.draws}-${result.losses}`} />
        <SummaryMetric label="Poin" value={result.points} />
        <SummaryMetric label="Gol" value={`${result.gf}-${result.ga}`} detail={`GD ${goalDiff >= 0 ? "+" : ""}${goalDiff}`} />
        <SummaryMetric label="Rating" value={rating} />
        <SummaryMetric label="Chemistry" value={chemistry} />
      </div>
      <div className="highlight-grid">
        <HighlightCard title="Pemain terbaik" player={bestPlayer} />
        <HighlightCard title="Top scorer" player={topScorer} />
      </div>
      <p className="player-meta">Kode share: {result.seed}</p>
      <p className="player-meta">Tim draft masuk liga dengan menggantikan slot {result.replacedTeam}.</p>
      <div className="match-list">
        {result.matches.map((match) => {
          const status = match.forGoals > match.againstGoals ? "win" : match.forGoals === match.againstGoals ? "draw" : "loss";
          return (
            <div className={`match-row ${status}`} key={`${match.matchday}-${match.team}-${match.home}`}>
              <span>MD{match.matchday} {match.home ? "Kandang" : "Tandang"} vs {match.team}</span>
              <strong>{match.forGoals}-{match.againstGoals}</strong>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SummaryMetric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function HighlightCard({ title, player }: { title: string; player: PlayerHighlight | null }) {
  return (
    <div className="highlight-card">
      <span>{title}</span>
      <strong>{player?.name ?? "-"}</strong>
      <small>{player ? `${player.team} | ${player.valueLabel}` : "Belum ada data"}</small>
    </div>
  );
}

type PlayerHighlight = {
  name: string;
  team: string;
  valueLabel: string;
  value: number;
};

function getAchievement(result: SimulationResult) {
  if (result.wins === 34) return "34-0 Sempurna";
  if (result.losses === 0) return "Invincible";
  if (result.points >= 72) return "Juara";
  if (result.points >= 62) return "Nyaris Juara";
  return "Butuh Transfer Baru";
}

function getHeadline(result: SimulationResult) {
  if (result.wins === 34) return "34-0-0. Musim sempurna.";
  if (result.losses === 0) return "Tak terkalahkan, tapi belum sempurna.";
  if (result.points >= 72) return "Skuad ini layak juara.";
  if (result.points >= 62) return "Nyaris, tinggal satu dua transfer.";
  return "Skuad kuat, masih bisa di-upgrade.";
}

function getBestPlayer(lineup: Record<string, PlayerSeason>, ratingMode: RatingMode): PlayerHighlight | null {
  const player = Object.values(lineup).sort((a, b) => playerOverall(b, ratingMode) - playerOverall(a, ratingMode))[0];
  if (!player) return null;
  const value = playerOverall(player, ratingMode);
  return {
    name: player.name,
    team: player.team,
    value,
    valueLabel: `OVR ${value}`,
  };
}

function getTopScorer(lineup: Record<string, PlayerSeason>, result: SimulationResult): PlayerHighlight | null {
  const candidates = Object.values(lineup).filter((player) => player.group === "FWD" || player.group === "MID");
  const player = candidates.sort((a, b) => scorerScore(b) - scorerScore(a))[0];
  if (!player) return null;
  const share = Math.max(1, scorerScore(player) / Math.max(1, candidates.reduce((sum, candidate) => sum + scorerScore(candidate), 0)));
  const goals = Math.max(1, Math.round(result.gf * Math.min(0.45, share)));
  return {
    name: player.name,
    team: player.team,
    value: goals,
    valueLabel: `${goals} gol`,
  };
}

function scorerScore(player: PlayerSeason) {
  return Math.round(player.attack * 0.6 + player.creative * 0.28 + player.stamina * 0.12);
}

function buildShareText({
  achievement,
  bestPlayer,
  chemistry,
  rating,
  result,
  topScorer,
}: {
  achievement: string;
  bestPlayer: PlayerHighlight | null;
  chemistry: number;
  rating: number;
  result: SimulationResult;
  topScorer: PlayerHighlight | null;
}) {
  return [
    `34-0 Indonesia: ${achievement}`,
    `Record: ${result.wins}-${result.draws}-${result.losses}`,
    `Poin: ${result.points}`,
    `Gol: ${result.gf}-${result.ga}`,
    `Rating: ${rating}`,
    `Chemistry: ${chemistry}`,
    `Pemain terbaik: ${bestPlayer ? `${bestPlayer.name} (${bestPlayer.valueLabel})` : "-"}`,
    `Top scorer: ${topScorer ? `${topScorer.name} (${topScorer.valueLabel})` : "-"}`,
    `Kode share: ${result.seed}`,
  ].join("\n");
}
