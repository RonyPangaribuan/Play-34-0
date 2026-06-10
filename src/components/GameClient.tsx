"use client";

import { useMemo, useState } from "react";
import { formations } from "@/lib/game-data";
import { findSlotForPlayer, playerOverall, simulateSeason, spinDraftSlot, teamMetrics } from "@/lib/game-engine";
import type { FormationSlot, GameMode, PlayerSeason, SimulationResult, SpinResult, SpinRule } from "@/lib/types";

type GameStep = "setup" | "draft" | "result";

export default function GameClient() {
  const [step, setStep] = useState<GameStep>("setup");
  const [formationKey, setFormationKey] = useState("");
  const [mode, setMode] = useState<GameMode>("normal");
  const [spinRule, setSpinRule] = useState<SpinRule>("position");
  const [lineup, setLineup] = useState<Record<string, PlayerSeason>>({});
  const [spin, setSpin] = useState<SpinResult | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [ratingRevealed, setRatingRevealed] = useState(false);

  const formation = formationKey ? formations[formationKey] : [];
  const draftedCount = Object.keys(lineup).length;
  const metrics = useMemo(() => teamMetrics(lineup), [lineup]);
  const hideRatings = mode === "hard" && !ratingRevealed;
  const complete = formation.length > 0 && draftedCount === formation.length;

  function resetDraft(nextFormation = formationKey) {
    setFormationKey(nextFormation);
    setLineup({});
    setSpin(null);
    setResult(null);
    setRatingRevealed(false);
  }

  function startGame() {
    if (!formationKey) return;
    resetDraft(formationKey);
    setStep("draft");
  }

  function resetGame() {
    setStep("setup");
    resetDraft("");
  }

  function spinSlot() {
    if (!formation.length || complete) return;
    setSpin(spinDraftSlot({ formation, lineup, spinRule }));
  }

  function draftPlayer(player: PlayerSeason) {
    if (!formation.length || !spin) return;
    const targetSlot =
      spinRule === "team"
        ? findSlotForPlayer(formation, lineup, player)
        : formation.find((slot) => slot.id === spin.slotId);
    if (!targetSlot) return;
    setLineup((current) => ({ ...current, [targetSlot.id]: player }));
    setSpin(null);
  }

  function runSimulation() {
    const simulation = simulateSeason(lineup);
    setRatingRevealed(true);
    setResult(simulation);
    setStep("result");
  }

  return (
    <main className="app-shell">
      <GameHeader
        step={step}
        draftedCount={draftedCount}
        complete={complete}
        ratingLabel={hideRatings ? "Rating ?" : `Rating ${metrics.rating}`}
      />

      {step === "setup" && (
        <SetupScreen
          formationKey={formationKey}
          mode={mode}
          spinRule={spinRule}
          onFormationChange={(value) => {
            setFormationKey(value);
            resetDraft(value);
          }}
          onModeChange={setMode}
          onSpinRuleChange={setSpinRule}
          onStart={startGame}
        />
      )}

      {step === "draft" && (
        <DraftScreen
          formation={formation}
          lineup={lineup}
          spin={spin}
          spinRule={spinRule}
          hideRatings={hideRatings}
          complete={complete}
          draftedCount={draftedCount}
          metrics={metrics}
          formationKey={formationKey}
          onSpin={spinSlot}
          onDraft={draftPlayer}
          onSimulate={runSimulation}
          onBackToSetup={() => setStep("setup")}
        />
      )}

      {step === "result" && result && (
        <ResultScreen
          formation={formation}
          lineup={lineup}
          result={result}
          rating={metrics.rating}
          chemistry={metrics.chemistry}
          onPlayAgain={resetGame}
          onRedraft={() => {
            resetDraft(formationKey);
            setStep("draft");
          }}
        />
      )}
    </main>
  );
}

function GameHeader({
  step,
  draftedCount,
  complete,
  ratingLabel,
}: {
  step: GameStep;
  draftedCount: number;
  complete: boolean;
  ratingLabel: string;
}) {
  const label = step === "setup" ? "Setup" : step === "result" ? "Hasil musim" : complete ? "XI lengkap" : `Pick ${draftedCount + 1}/11`;

  return (
    <section className="topbar" aria-label="Game status">
      <div>
        <p className="eyebrow">Draft XI Sepakbola Indonesia</p>
        <h1>34-0</h1>
      </div>
      <div className="score-pill">
        <span>{label}</span>
        <strong>{ratingLabel}</strong>
      </div>
    </section>
  );
}

function SetupScreen({
  formationKey,
  mode,
  spinRule,
  onFormationChange,
  onModeChange,
  onSpinRuleChange,
  onStart,
}: {
  formationKey: string;
  mode: GameMode;
  spinRule: SpinRule;
  onFormationChange: (value: string) => void;
  onModeChange: (value: GameMode) => void;
  onSpinRuleChange: (value: SpinRule) => void;
  onStart: () => void;
}) {
  return (
    <section className="setup-screen">
      <div className="setup-copy">
        <p className="eyebrow">Mulai draft</p>
        <h2>Atur challenge dulu, baru masuk ke wheel.</h2>
        <p>
          Pilih formasi, mode rating, dan aturan spin. Setelah itu game masuk ke layar draft yang fokus
          ke wheel dan pilihan pemain.
        </p>
      </div>

      <div className="setup-card setup-card-large">
        <label className="field-label" htmlFor="formationSelect">Formasi</label>
        <select id="formationSelect" value={formationKey} onChange={(event) => onFormationChange(event.target.value)}>
          <option value="">Pilih formasi dulu</option>
          <option value="433">4-3-3</option>
          <option value="4231">4-2-3-1</option>
          <option value="352">3-5-2</option>
        </select>

        <span className="field-label">Mode rating</span>
        <div className="mode-row" role="group" aria-label="Mode">
          <button className={`mode-button ${mode === "normal" ? "active" : ""}`} onClick={() => onModeChange("normal")} type="button">Normal</button>
          <button className={`mode-button ${mode === "hard" ? "active" : ""}`} onClick={() => onModeChange("hard")} type="button">Hard</button>
        </div>

        <span className="field-label">Aturan spin</span>
        <div className="mode-row" role="group" aria-label="Aturan spin">
          <button className={`spin-rule-button ${spinRule === "position" ? "active" : ""}`} onClick={() => onSpinRuleChange("position")} type="button">Posisi</button>
          <button className={`spin-rule-button ${spinRule === "team" ? "active" : ""}`} onClick={() => onSpinRuleChange("team")} type="button">Tim</button>
        </div>

        <button className="primary-button start-button" type="button" disabled={!formationKey} onClick={onStart}>
          Mulai Draft
        </button>
      </div>
    </section>
  );
}

function DraftScreen({
  formation,
  lineup,
  spin,
  spinRule,
  hideRatings,
  complete,
  draftedCount,
  metrics,
  formationKey,
  onSpin,
  onDraft,
  onSimulate,
  onBackToSetup,
}: {
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  spin: SpinResult | null;
  spinRule: SpinRule;
  hideRatings: boolean;
  complete: boolean;
  draftedCount: number;
  metrics: ReturnType<typeof teamMetrics>;
  formationKey: string;
  onSpin: () => void;
  onDraft: (player: PlayerSeason) => void;
  onSimulate: () => void;
  onBackToSetup: () => void;
}) {
  return (
    <section className="draft-screen">
      <div className="draft-toolbar">
        <button className="ghost-button" type="button" onClick={onBackToSetup}>Ubah setup</button>
        <div className="mini-metrics">
          <span>Formasi {formationKey}</span>
          <span>{draftedCount}/11 pemain</span>
          <span>{hideRatings ? "Rating ?" : `Rating ${metrics.rating}`}</span>
        </div>
      </div>

      <div className="draft-layout">
        <aside className="draft-panel" aria-label="Draft controls">
          <div className="slot-card">
            <div className="slot-head">
              <p className="eyebrow">Slot</p>
              <span id="positionBadge">{spinRule === "team" ? "TIM" : spin?.slotLabel?.replace(/[0-9]/g, "").slice(0, 3).toUpperCase() || "SET"}</span>
            </div>
            <div className="reel">
              {spin ? (
                <span>{spin.team}<br />{spin.season}<br />{spin.slotLabel}</span>
              ) : (
                <span>{complete ? "XI siap disimulasikan" : "Tekan Spin"}</span>
              )}
            </div>
            <button className="primary-button" type="button" disabled={complete} onClick={onSpin}>
              Spin Slot
            </button>
          </div>

          <div className="choice-list" aria-live="polite">
            {!spin && (
              <div className="empty-state">
                {complete
                  ? "Draft selesai. Jalankan simulasi untuk melihat hasil musim."
                  : "Wheel mengambil klub Liga 1 dan musim 2017-2026. Pilih pemain setelah spin berhenti."}
              </div>
            )}
            {spin && (
              <>
                <div className="choice-summary">{spin.choices.length} pemain tersedia</div>
                {spin.choices.map((player) => (
                  <PlayerChoice key={player.id} player={player} hideRatings={hideRatings} onDraft={onDraft} />
                ))}
              </>
            )}
          </div>

          <button className="simulate-button" type="button" disabled={!complete} onClick={onSimulate}>
            Simulasi 34 Laga
          </button>
        </aside>

        <Pitch formation={formation} lineup={lineup} />
      </div>
    </section>
  );
}

function PlayerChoice({
  player,
  hideRatings,
  onDraft,
}: {
  player: PlayerSeason;
  hideRatings: boolean;
  onDraft: (player: PlayerSeason) => void;
}) {
  return (
    <button className="choice-card" type="button" onClick={() => onDraft(player)}>
      <div className="player-top">
        <div>
          <div className="player-name">{player.name}</div>
          <div className="player-meta">{player.team} | {player.season} | {player.group}</div>
        </div>
        <strong>{hideRatings ? "?" : playerOverall(player)}</strong>
      </div>
      <div className="stat-row">
        {hideRatings ? (
          <>
            <span>Rating</span><span>disimpan</span><span>sampai</span><span>akhir</span>
          </>
        ) : (
          <>
            <span>ATK {player.attack}</span><span>DEF {player.defense}</span><span>CRE {player.creative}</span><span>OVR {playerOverall(player)}</span>
          </>
        )}
      </div>
    </button>
  );
}

function ResultScreen({
  formation,
  lineup,
  result,
  rating,
  chemistry,
  onPlayAgain,
  onRedraft,
}: {
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  result: SimulationResult;
  rating: number;
  chemistry: number;
  onPlayAgain: () => void;
  onRedraft: () => void;
}) {
  return (
    <section className="result-screen">
      <div className="result-main result-box">
        <p className="eyebrow">Hasil musim</p>
        <SeasonResult result={result} rating={rating} chemistry={chemistry} />
        <div className="result-actions">
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
        <Pitch formation={formation} lineup={lineup} compact />
      </div>
    </section>
  );
}

function Pitch({
  formation,
  lineup,
  compact = false,
}: {
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  compact?: boolean;
}) {
  return (
    <section className={`pitch-panel ${compact ? "pitch-panel-compact" : ""}`} aria-label="Starting eleven">
      <div className="pitch">
        <div className="pitch-line half" />
        <div className="pitch-line box top" />
        <div className="pitch-line box bottom" />
        <div className="center-circle" />
        <div className="formation">
          {formation.map((slot, index) => {
            const drafted = lineup[slot.id];
            return (
              <div className="shirt-slot" style={{ left: `${slot.x}%`, top: `${slot.y}%` }} key={slot.id}>
                <div className={`shirt ${drafted ? "" : "empty"}`}>{slot.id.replace(/[0-9]/g, "")}</div>
                <span className="slot-name">{drafted ? drafted.name : slot.label}</span>
                <span className="slot-team">{drafted ? `${drafted.team} | ${drafted.season}` : `Pick ${index + 1}`}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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

function SeasonResult({ result, rating, chemistry }: { result: SimulationResult; rating: number; chemistry: number }) {
  const headline = result.wins === 34
    ? "34-0-0. Musim sempurna."
    : result.losses === 0
      ? "Tak terkalahkan, tapi belum sempurna."
      : "Skuad kuat, masih bisa di-upgrade.";

  return (
    <>
      <h2>{headline}</h2>
      <div className="season-record">
        <div><span>Menang</span><strong>{result.wins}</strong></div>
        <div><span>Seri</span><strong>{result.draws}</strong></div>
        <div><span>Kalah</span><strong>{result.losses}</strong></div>
      </div>
      <p className="player-meta">{result.points} poin | Gol {result.gf}-{result.ga} | Rating akhir {rating} | Chemistry {chemistry}</p>
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
