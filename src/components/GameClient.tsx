"use client";

import { useMemo, useState, type ReactNode } from "react";
import { formations, seasons } from "@/lib/game-data";
import { findSlotForPlayer, playerOverall, simulateSeason, spinDraftSlot, teamMetrics, type RatingMode } from "@/lib/game-engine";
import type { FormationSlot, PlayerSeason, SimulationResult, SpinResult, SpinRule } from "@/lib/types";

type GameStep = "setup" | "draft" | "result";
type Difficulty = "easy" | "normal" | "hard";
type EraPreset = "all" | "early" | "modern";

const formationMeta: Record<string, { label: string; description: string }> = {
  "433": { label: "4-3-3", description: "Lebar dan agresif. Cocok untuk winger cepat dan striker tajam." },
  "442": { label: "4-4-2", description: "Klasik dan seimbang. Dua striker memberi ancaman konstan." },
  "4231": { label: "4-2-3-1", description: "Stabil di tengah. Satu playmaker bebas di belakang striker." },
  "451": { label: "4-5-1", description: "Padat dan sabar. Cocok untuk mengunci laga tandang." },
  "343": { label: "3-4-3", description: "Menekan dari depan. Risiko tinggi, hadiah besar." },
  "352": { label: "3-5-2", description: "Dominasi lini tengah dengan dua penyerang di kotak penalti." },
  "541": { label: "5-4-1", description: "Bertahan rapat. Satu serangan balik bisa menentukan musim." },
};

const rerollLimits: Record<Difficulty, number> = {
  easy: 3,
  normal: 1,
  hard: 0,
};

export default function GameClient() {
  const [step, setStep] = useState<GameStep>("setup");
  const [formationKey, setFormationKey] = useState("433");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [showRatings, setShowRatings] = useState(true);
  const [spinRule, setSpinRule] = useState<SpinRule>("team");
  const [ratingMode, setRatingMode] = useState<RatingMode>("season");
  const [eraPreset, setEraPreset] = useState<EraPreset>("modern");
  const [lineup, setLineup] = useState<Record<string, PlayerSeason>>({});
  const [spin, setSpin] = useState<SpinResult | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [ratingRevealed, setRatingRevealed] = useState(false);
  const [rerollsLeft, setRerollsLeft] = useState(rerollLimits.normal);

  const formation = formationKey ? formations[formationKey] : [];
  const selectedSeasons = useMemo(() => getEraSeasons(eraPreset), [eraPreset]);
  const draftedCount = Object.keys(lineup).length;
  const metrics = useMemo(() => teamMetrics(lineup, ratingMode), [lineup, ratingMode]);
  const hideRatings = (difficulty === "hard" || !showRatings) && !ratingRevealed;
  const complete = formation.length > 0 && draftedCount === formation.length;

  function resetDraft(nextFormation = formationKey, nextDifficulty = difficulty) {
    setFormationKey(nextFormation);
    setLineup({});
    setSpin(null);
    setResult(null);
    setRatingRevealed(false);
    setRerollsLeft(rerollLimits[nextDifficulty]);
  }

  function startGame() {
    if (!formationKey) return;
    resetDraft(formationKey);
    setStep("draft");
  }

  function resetGame() {
    setStep("setup");
    resetDraft("433", difficulty);
  }

  function spinSlot() {
    if (!formation.length || complete) return;
    if (spin && rerollsLeft <= 0) return;
    if (spin) setRerollsLeft((current) => Math.max(0, current - 1));
    setSpin(spinDraftSlot({ formation, lineup, spinRule, seasonFilter: selectedSeasons, ratingMode }));
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
    const simulation = simulateSeason(lineup, ratingMode);
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
          difficulty={difficulty}
          showRatings={showRatings}
          spinRule={spinRule}
          ratingMode={ratingMode}
          eraPreset={eraPreset}
          onFormationChange={(value) => {
            setFormationKey(value);
            resetDraft(value);
          }}
          onDifficultyChange={(value) => {
            setDifficulty(value);
            if (value === "hard") setShowRatings(false);
            setRerollsLeft(rerollLimits[value]);
          }}
          onShowRatingsChange={setShowRatings}
          onSpinRuleChange={setSpinRule}
          onRatingModeChange={setRatingMode}
          onEraPresetChange={setEraPreset}
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
          ratingMode={ratingMode}
          complete={complete}
          draftedCount={draftedCount}
          rerollsLeft={rerollsLeft}
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
    <section className={`topbar ${step === "setup" ? "setup-game-header" : ""}`} aria-label="Game status">
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
  difficulty,
  showRatings,
  spinRule,
  ratingMode,
  eraPreset,
  onFormationChange,
  onDifficultyChange,
  onShowRatingsChange,
  onSpinRuleChange,
  onRatingModeChange,
  onEraPresetChange,
  onStart,
}: {
  formationKey: string;
  difficulty: Difficulty;
  showRatings: boolean;
  spinRule: SpinRule;
  ratingMode: RatingMode;
  eraPreset: EraPreset;
  onFormationChange: (value: string) => void;
  onDifficultyChange: (value: Difficulty) => void;
  onShowRatingsChange: (value: boolean) => void;
  onSpinRuleChange: (value: SpinRule) => void;
  onRatingModeChange: (value: RatingMode) => void;
  onEraPresetChange: (value: EraPreset) => void;
  onStart: () => void;
}) {
  const selectedFormation = formations[formationKey] ?? formations["433"];
  const description = formationMeta[formationKey]?.description ?? "Pilih bentuk tim yang paling cocok dengan gaya draft kamu.";

  return (
    <section className="setup-builder">
      <div className="setup-title">
        <p>Draft XI terbaik sepakbola Indonesia dan kejar musim sempurna.</p>
      </div>

      <SetupBlock title="Formasi">
        <div className="formation-options" role="group" aria-label="Formasi">
          {Object.entries(formationMeta).map(([key, meta]) => (
            <button
              className={`setup-option formation-option ${formationKey === key ? "selected" : ""}`}
              key={key}
              onClick={() => onFormationChange(key)}
              type="button"
            >
              {meta.label}
            </button>
          ))}
        </div>
        <p className="setup-helper">{description}</p>
        <FormationPreview formation={selectedFormation} />
      </SetupBlock>

      <SetupBlock title="Kesulitan">
        <div className="setup-card-grid three">
          <OptionCard
            selected={difficulty === "easy"}
            title="Santai"
            text="3 reroll tersedia"
            onClick={() => onDifficultyChange("easy")}
          />
          <OptionCard
            selected={difficulty === "normal"}
            title="Normal"
            text="1 reroll tersedia"
            onClick={() => onDifficultyChange("normal")}
          />
          <OptionCard
            tone="gold"
            selected={difficulty === "hard"}
            title="Sulit"
            text="Tanpa reroll, rating disembunyikan"
            onClick={() => onDifficultyChange("hard")}
          />
        </div>
      </SetupBlock>

      <SetupBlock title="Tampilkan rating">
        <div className="setup-card-grid two">
          <OptionCard
            selected={showRatings && difficulty !== "hard"}
            disabled={difficulty === "hard"}
            title="Aktif"
            text="Overall pemain terlihat saat draft"
            onClick={() => onShowRatingsChange(true)}
          />
          <OptionCard
            tone="purple"
            selected={!showRatings || difficulty === "hard"}
            title="Mati"
            text="Mode insting, percaya mata bola"
            onClick={() => onShowRatingsChange(false)}
          />
        </div>
        {difficulty === "hard" && <p className="setup-warning">Rating selalu tersembunyi pada mode Sulit.</p>}
      </SetupBlock>

      <SetupBlock title="Mode draft">
        <div className="setup-card-grid two">
          <OptionCard
            selected={spinRule === "team"}
            title="Klub Dulu"
            text="Spin klub-musim, pilih pemain, lalu sistem taruh di posisi cocok."
            onClick={() => onSpinRuleChange("team")}
          />
          <OptionCard
            selected={spinRule === "position"}
            title="Posisi Dulu"
            text="Slot posisi dipilih dulu, lalu spin klub-musim untuk mengisinya."
            onClick={() => onSpinRuleChange("position")}
          />
        </div>
      </SetupBlock>

      <SetupBlock title="Rating pemain">
        <div className="setup-card-grid two">
          <OptionCard
            tone="blue"
            selected={ratingMode === "season"}
            title="Musim Karier"
            text="Pemain dinilai sesuai klub dan musim yang dispin."
            onClick={() => onRatingModeChange("season")}
          />
          <OptionCard
            selected={ratingMode === "prime"}
            title="Prime Mode"
            text="Pemain memakai rating terbaik dalam karier Liga Indonesia."
            onClick={() => onRatingModeChange("prime")}
          />
        </div>
      </SetupBlock>

      <SetupBlock title="Era">
        <div className="era-options">
          <button className={`setup-option ${eraPreset === "all" ? "selected" : ""}`} type="button" onClick={() => onEraPresetChange("all")}>Semua era</button>
          <button className={`setup-option ${eraPreset === "early" ? "selected" : ""}`} type="button" onClick={() => onEraPresetChange("early")}>Liga 1 awal</button>
          <button className={`setup-option ${eraPreset === "modern" ? "selected" : ""}`} type="button" onClick={() => onEraPresetChange("modern")}>Modern</button>
        </div>
        <div className="era-track">
          <span className={eraPreset !== "modern" ? "active" : ""} />
          <span className={eraPreset === "modern" ? "active" : ""} />
        </div>
        <div className="era-labels">
          <strong>{eraPreset === "modern" ? "2021/22" : "2017"}</strong>
          <span>Database Liga Indonesia</span>
          <strong>2025/26</strong>
        </div>
        <p className="setup-helper">Hanya klub-musim dalam rentang ini yang akan muncul di wheel.</p>
      </SetupBlock>

      <button className="primary-button setup-start-button" type="button" disabled={!formationKey} onClick={onStart}>
        Mulai Draft -&gt;
      </button>
    </section>
  );
}

function SetupBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="setup-block">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function OptionCard({
  title,
  text,
  selected,
  disabled = false,
  tone = "mint",
  onClick,
}: {
  title: string;
  text: string;
  selected: boolean;
  disabled?: boolean;
  tone?: "mint" | "gold" | "purple" | "blue";
  onClick: () => void;
}) {
  return (
    <button
      className={`setup-choice ${selected ? "selected" : ""} tone-${tone}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  );
}

function FormationPreview({ formation }: { formation: FormationSlot[] }) {
  return (
    <div className="formation-preview" aria-label="Preview formasi">
      <div className="preview-half-line" />
      <div className="preview-circle" />
      {formation.map((slot) => (
        <span className="preview-player" style={{ left: `${slot.x}%`, top: `${slot.y}%` }} key={slot.id}>
          {slot.id.replace(/[0-9]/g, "")}
        </span>
      ))}
    </div>
  );
}

function DraftScreen({
  formation,
  lineup,
  spin,
  spinRule,
  hideRatings,
  ratingMode,
  complete,
  draftedCount,
  rerollsLeft,
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
  ratingMode: RatingMode;
  complete: boolean;
  draftedCount: number;
  rerollsLeft: number;
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
          <span>Reroll {rerollsLeft}</span>
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
            <button className="primary-button" type="button" disabled={complete || (!!spin && rerollsLeft <= 0)} onClick={onSpin}>
              {spin ? "Reroll Slot" : "Spin Slot"}
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
                {spin.choices.map((player) => {
                  const slotLabels = availableSlotLabels({ formation, lineup, player, spin, spinRule });
                  return (
                    <PlayerChoice
                      key={player.id}
                      player={player}
                      hideRatings={hideRatings}
                      ratingMode={ratingMode}
                      slotLabels={slotLabels}
                      onDraft={onDraft}
                    />
                  );
                })}
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

function availableSlotLabels({
  formation,
  lineup,
  player,
  spin,
  spinRule,
}: {
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  player: PlayerSeason;
  spin: SpinResult;
  spinRule: SpinRule;
}) {
  if (spinRule === "position") {
    const target = formation.find((slot) => slot.id === spin.slotId && !lineup[slot.id]);
    return target && target.group === player.group ? [target.label] : [];
  }

  return formation
    .filter((slot) => !lineup[slot.id] && slot.group === player.group)
    .map((slot) => slot.label);
}

function PlayerChoice({
  player,
  hideRatings,
  ratingMode,
  slotLabels,
  onDraft,
}: {
  player: PlayerSeason;
  hideRatings: boolean;
  ratingMode: RatingMode;
  slotLabels: string[];
  onDraft: (player: PlayerSeason) => void;
}) {
  const canDraft = slotLabels.length > 0;

  return (
    <button className={`choice-card ${canDraft ? "" : "choice-card-disabled"}`} disabled={!canDraft} type="button" onClick={() => onDraft(player)}>
      <div className="player-top">
        <div>
          <div className="player-name">{player.name}</div>
          <div className="player-meta">{player.team} | {player.season} | {player.group}</div>
        </div>
        <strong>{hideRatings ? "?" : playerOverall(player, ratingMode)}</strong>
      </div>
      <div className="slot-fit-row">
        <span>{canDraft ? `Bisa masuk: ${slotLabels.join(", ")}` : "Slot posisi ini sudah penuh"}</span>
      </div>
      <div className="stat-row">
        {hideRatings ? (
          <>
            <span>Rating</span><span>disimpan</span><span>sampai</span><span>akhir</span>
          </>
        ) : (
          <>
            <span>ATK {player.attack}</span><span>DEF {player.defense}</span><span>CRE {player.creative}</span><span>OVR {playerOverall(player, ratingMode)}</span>
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

function getEraSeasons(eraPreset: EraPreset) {
  if (eraPreset === "modern") return seasons.filter((season) => season >= "2021");
  if (eraPreset === "early") return seasons.filter((season) => season === "2017" || season === "2018" || season === "2019" || season === "2020");
  return seasons;
}
