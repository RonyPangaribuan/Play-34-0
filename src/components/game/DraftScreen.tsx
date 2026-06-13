"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlayerChoice } from "@/components/game/PlayerChoice";
import { Pitch } from "@/components/game/Pitch";
import { seasonTeams, seasons } from "@/lib/game-data";
import { playerOverall, type RatingMode } from "@/lib/game-engine";
import type { FormationSlot, PlayerGroup, PlayerSeason, SpinResult, SpinRule, TeamMetrics } from "@/lib/types";

export type DraftScreenProps = {
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  spin: SpinResult | null;
  spinRule: SpinRule;
  hideRatings: boolean;
  ratingMode: RatingMode;
  complete: boolean;
  draftedCount: number;
  rerollsLeft: number;
  metrics: TeamMetrics;
  formationKey: string;
  onSpin: () => void;
  onDraft: (player: PlayerSeason, slotId?: string) => void;
  onSimulate: () => void;
  onResetGame: () => void;
};

export function DraftScreen({
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
  onResetGame,
}: DraftScreenProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPreview, setSpinPreview] = useState<{ team: string; season: string } | null>(null);
  const spinTimer = useRef<number | null>(null);
  const spinFinishTimer = useRef<number | null>(null);
  const spinHasChoices = !!spin?.choices.length;
  const spinIsEmpty = !!spin && !spinHasChoices;
  const spinButtonDisabled = isSpinning || complete || (!!spin && (spinHasChoices || spinIsEmpty) && rerollsLeft <= 0);
  const emptySpinMessage = spin ? getEmptySpinMessage(spin, rerollsLeft) : "";
  const selectedPlayer = useMemo(
    () => spin?.choices.find((player) => player.id === selectedPlayerId) ?? null,
    [selectedPlayerId, spin],
  );
  const displayedChoices = useMemo(() => {
    if (!spin) return [];
    if (hideRatings) return spin.choices;
    return [...spin.choices].sort((a, b) => playerOverall(b, ratingMode) - playerOverall(a, ratingMode));
  }, [hideRatings, ratingMode, spin]);
  const overallRows = useMemo(() => buildOverallRows(lineup, ratingMode), [lineup, ratingMode]);
  const completeRows = useMemo(() => buildSquadRows(formation, lineup), [formation, lineup]);

  useEffect(() => {
    setSelectedPlayerId(null);
  }, [spin?.team, spin?.season, spin?.slotId]);

  useEffect(() => {
    return () => {
      if (spinTimer.current) window.clearInterval(spinTimer.current);
      if (spinFinishTimer.current) window.clearTimeout(spinFinishTimer.current);
    };
  }, []);

  function startSpin() {
    if (spinButtonDisabled) return;
    setSelectedPlayerId(null);
    setIsSpinning(true);
    setSpinPreview(randomSpinPreview());
    spinTimer.current = window.setInterval(() => {
      setSpinPreview(randomSpinPreview());
    }, 110);
    spinFinishTimer.current = window.setTimeout(() => {
      if (spinTimer.current) window.clearInterval(spinTimer.current);
      spinTimer.current = null;
      setIsSpinning(false);
      setSpinPreview(null);
      onSpin();
    }, 900);
  }

  function draftIntoSlot(player: PlayerSeason, slotId: string) {
    onDraft(player, slotId);
    setSelectedPlayerId(null);
  }

  return (
    <section className="draft-screen">
      <div className="draft-layout">
        <div className="draft-formation-column">
          <FormationStatusCard
            draftedCount={draftedCount}
            formationKey={formationKey}
            maxRerolls={getMaxRerolls(rerollsLeft, spin)}
            onReset={onResetGame}
            rerollsLeft={rerollsLeft}
          />
          <Pitch formation={formation} lineup={lineup} compact />
          {draftedCount > 0 && <OverallPanel rating={metrics.rating} rows={overallRows} />}
        </div>

        <aside className="draft-panel" aria-label="Draft controls">
          {complete ? (
            <SquadCompletePanel
              formationKey={formationKey}
              metrics={metrics}
              rows={completeRows}
              onSimulate={onSimulate}
            />
          ) : (
            <>
              {!spin && (
                <div className="spin-card">
                  <div className={`spin-fields ${isSpinning ? "is-spinning" : ""}`} aria-live="polite">
                    <div className="spin-field">
                      <span>Club</span>
                      <strong><i>{isSpinning ? spinPreview?.team ?? "" : ""}</i></strong>
                    </div>
                    <b>x</b>
                    <div className="spin-field">
                      <span>Season</span>
                      <strong><i>{isSpinning ? spinPreview?.season ?? "" : ""}</i></strong>
                    </div>
                  </div>
                  <button className="primary-button spin-wheel-button" type="button" disabled={spinButtonDisabled} onClick={startSpin}>
                    {isSpinning ? "Spinning..." : "Spin the Wheel"}
                  </button>
                  <p>{spinRule === "team" ? "Spin untuk squad" : "Spin untuk posisi"}</p>
                </div>
              )}

              <div className="choice-list" aria-live="polite">
                {spin && (
                  <>
                    <div className="choice-summary-row">
                      <div className="choice-summary">
                        <span>{spinRule === "team" ? "Squad spin" : "Position spin"}</span>
                        <strong>{isSpinning ? spinPreview?.team ?? spin.team : spin.team || "-"} <em>{isSpinning ? spinPreview?.season ?? spin.season : spin.season || ""}</em></strong>
                        <small>{isSpinning ? "memutar..." : `${spin.choices.length} pemain`}</small>
                      </div>
                      {rerollsLeft > 0 && (
                        <button className="choice-reroll-button" type="button" disabled={spinButtonDisabled} onClick={startSpin}>
                          {isSpinning ? "Spinning..." : `Reroll (${rerollsLeft})`}
                        </button>
                      )}
                    </div>
                    {isSpinning && (
                      <div className="empty-state compact">
                        Wheel sedang memutar. Pilihan pemain akan muncul setelah spin berhenti.
                      </div>
                    )}
                    {!isSpinning && spinIsEmpty && (
                      <div className="empty-state">
                        {emptySpinMessage}
                      </div>
                    )}
                    {!isSpinning && selectedPlayer && (
                      <PlacementPanel
                        formation={formation}
                        lineup={lineup}
                        player={selectedPlayer}
                        spin={spin}
                        spinRule={spinRule}
                        onCancel={() => setSelectedPlayerId(null)}
                        onDraft={draftIntoSlot}
                      />
                    )}
                    {!isSpinning && displayedChoices.map((player) => {
                      const slotOptions = slotOptionsForPlayer({ formation, lineup, player, spin, spinRule });
                      return (
                        <PlayerChoice
                          key={player.id}
                          player={player}
                          hideRatings={hideRatings}
                          ratingMode={ratingMode}
                          selected={selectedPlayerId === player.id}
                          slotOptions={slotOptions.filter((slot) => slot.available)}
                          onSelect={setSelectedPlayerId}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

function FormationStatusCard({
  draftedCount,
  formationKey,
  maxRerolls,
  onReset,
  rerollsLeft,
}: {
  draftedCount: number;
  formationKey: string;
  maxRerolls: number;
  onReset: () => void;
  rerollsLeft: number;
}) {
  return (
    <section className="formation-status-card" aria-label="Status formasi">
      <div>
        <span>Formation</span>
        <strong>{formatFormationKey(formationKey)}</strong>
      </div>
      <div className="formation-status-meta">
        <span>Rerolls:</span>
        <div className="reroll-dots" aria-label={`${rerollsLeft} reroll tersisa`}>
          {Array.from({ length: maxRerolls }).map((_, index) => (
            <i className={index < rerollsLeft ? "active" : ""} key={index} />
          ))}
        </div>
        <strong>{draftedCount}/11</strong>
        <button aria-label="Ulang dari awal" className="formation-reset-button" type="button" onClick={onReset}>
          &#8635;
        </button>
      </div>
      <div className="formation-status-line" />
    </section>
  );
}

function OverallPanel({ rating, rows }: { rating: number; rows: OverallRow[] }) {
  return (
    <section className="overall-card" aria-label="Overall tim">
      <div className="overall-head">
        <span>Overall</span>
        <strong>{rating || "-"}</strong>
      </div>
      <div className="overall-rows">
        {rows.map((row) => (
          <div className="overall-row" key={row.key}>
            <div>
              <span className={`overall-icon icon-${row.key}`}>{row.icon}</span>
              <span>{row.label}</span>
              <strong>{row.value ?? "-"}</strong>
            </div>
            <div className="overall-track" aria-hidden="true">
              <span style={{ width: `${row.value ?? 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SquadCompletePanel({
  formationKey,
  metrics,
  rows,
  onSimulate,
}: {
  formationKey: string;
  metrics: TeamMetrics;
  rows: SquadRow[];
  onSimulate: () => void;
}) {
  const projection = buildProjection(metrics.rating);

  return (
    <div className="squad-complete-panel">
      <section className="your-xi-card" aria-label="XI yang sudah dipilih">
        <div className="your-xi-head">
          <h2>XI Kamu</h2>
          <p>{formatFormationKey(formationKey)} - Overall {metrics.rating}</p>
        </div>
        <div className="your-xi-list">
          {rows.map(({ player, slot }) => (
            <div className="xi-row" key={slot.id}>
              <span className={`slot-chip chip-${player.group.toLowerCase()}`}>{slotShortLabel(slot)}</span>
              <strong>{player.name}</strong>
              <span className="xi-row-meta">
                <i style={{ backgroundColor: teamColor(player.team) }} />
                {teamCode(player.team)} {player.season}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="squad-finish-card" aria-label="Proyeksi setelah skuad lengkap">
        <div className="trophy-mark" aria-hidden="true" />
        <h2>Skuad Lengkap</h2>
        <p>Inilah susunan XI kamu. Simulasikan musim dan lihat sejauh mana tim ini bisa melaju.</p>
        <div className="projection-card">
          <div className="projection-head">
            <span>Proyeksi pra-musim</span>
            <small>Berdasarkan kekuatan XI</small>
          </div>
          <div className="projection-grid">
            <div>
              <span>Prediksi finis</span>
              <strong>Ke-{projection.finish}</strong>
            </div>
            <div>
              <span>Ekspektasi poin</span>
              <strong>{projection.points}</strong>
            </div>
          </div>
          <div className="odds-list">
            {projection.odds.map((row) => (
              <div className="odds-row" key={row.label}>
                <div>
                  <span>{row.label}</span>
                  <strong>{formatPercent(row.value)}</strong>
                </div>
                <div className="odds-track" aria-hidden="true">
                  <span className={`odds-${row.tone}`} style={{ width: `${row.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="primary-button simulate-season-button" type="button" onClick={onSimulate}>
          Simulasi Musim -&gt;
        </button>
      </section>
    </div>
  );
}

function PlacementPanel({
  formation,
  lineup,
  player,
  spin,
  spinRule,
  onCancel,
  onDraft,
}: {
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  player: PlayerSeason;
  spin: SpinResult;
  spinRule: SpinRule;
  onCancel: () => void;
  onDraft: (player: PlayerSeason, slotId: string) => void;
}) {
  const options = slotOptionsForPlayer({ formation, lineup, player, spin, spinRule });
  const available = options.filter((slot) => slot.available);
  const unavailable = options.filter((slot) => !slot.available);

  return (
    <div className="placement-panel">
      <div className="placement-head">
        <strong>Tempatkan <span>{player.name}</span></strong>
        <button className="mini-button" type="button" onClick={onCancel}>Batal</button>
      </div>
      <p className="placement-label">Tersedia ({available.length})</p>
      <div className="placement-grid">
        {available.map((slot) => (
          <button className={`slot-pill slot-${slot.group.toLowerCase()}`} key={slot.id} type="button" onClick={() => onDraft(player, slot.id)}>
            {slot.label} ({slot.shortLabel})
          </button>
        ))}
      </div>
      <p className="placement-label muted">Tidak tersedia</p>
      <div className="placement-grid unavailable">
        {unavailable.map((slot) => (
          <span className="slot-pill" key={slot.id}>{slot.shortLabel} - N/A</span>
        ))}
      </div>
    </div>
  );
}

function getEmptySpinMessage(spin: SpinResult, rerollsLeft: number) {
  const reason = spin.unavailableReason ?? "Belum ada pemain yang cocok untuk pilihan ini.";
  if (rerollsLeft > 0) {
    return `${reason} Kamu masih punya ${rerollsLeft} reroll, coba reroll slot ini.`;
  }
  return `${reason} Kembali ke setup lalu aktifkan roster pelengkap atau pilih era yang lebih luas.`;
}

function slotOptionsForPlayer({
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
}): SlotOption[] {
  if (spinRule === "position") {
    return formation.map((slot) => ({
      id: slot.id,
      label: slot.label,
      shortLabel: slot.id.replace(/[0-9]/g, ""),
      group: slot.group,
      available: slot.id === spin.slotId && !lineup[slot.id] && slot.group === player.group,
    }));
  }

  return formation.map((slot) => ({
    id: slot.id,
    label: slot.label,
    shortLabel: slot.id.replace(/[0-9]/g, ""),
    group: slot.group,
    available: !lineup[slot.id] && slot.group === player.group,
  }));
}

function randomSpinPreview() {
  const season = seasons[Math.floor(Math.random() * seasons.length)] ?? "2025/26";
  const teams = seasonTeams[season] ?? [];
  const team = teams[Math.floor(Math.random() * teams.length)] ?? "Persib";
  return { team, season };
}

function formatFormationKey(value: string) {
  return value.split("").join("-");
}

function getMaxRerolls(rerollsLeft: number, spin: SpinResult | null) {
  if (rerollsLeft >= 3) return 3;
  if (rerollsLeft >= 1 || spin) return Math.max(1, rerollsLeft);
  return 0;
}

function buildOverallRows(lineup: Record<string, PlayerSeason>, ratingMode: RatingMode): OverallRow[] {
  const players = Object.values(lineup);
  return [
    { key: "attack", label: "Attack", icon: "A", value: averageGroupOverall(players, "FWD", ratingMode) },
    { key: "midfield", label: "Midfield", icon: "M", value: averageGroupOverall(players, "MID", ratingMode) },
    { key: "defence", label: "Defence", icon: "D", value: averageGroupOverall(players, "DEF", ratingMode) },
    { key: "gk", label: "GK", icon: "G", value: averageGroupOverall(players, "GK", ratingMode) },
  ];
}

function buildSquadRows(formation: FormationSlot[], lineup: Record<string, PlayerSeason>): SquadRow[] {
  return formation.flatMap((slot) => {
    const player = lineup[slot.id];
    return player ? [{ slot, player }] : [];
  });
}

function averageGroupOverall(players: PlayerSeason[], group: PlayerGroup, ratingMode: RatingMode) {
  const groupPlayers = players.filter((player) => player.group === group);
  if (!groupPlayers.length) return null;
  return Math.round(groupPlayers.reduce((sum, player) => sum + playerOverall(player, ratingMode), 0) / groupPlayers.length);
}

function buildProjection(rating: number) {
  const normalized = clampNumber(rating || 0, 40, 92);
  const finish = clampNumber(Math.round(18 - (normalized - 50) * 0.36), 1, 18);
  const points = clampNumber(Math.round(20 + normalized * 0.42), 26, 86);
  const winLeague = clampNumber((normalized - 75) * 0.22, 0.1, 72);
  const topFour = clampNumber((normalized - 66) * 0.78, 2, 98);
  const topSix = clampNumber((normalized - 58) * 1.18, 6, 99);
  const topTen = clampNumber((normalized - 45) * 1.75, 15, 99);
  const relegation = clampNumber(44 - (normalized - 45) * 1.25, 0.2, 52);

  return {
    finish,
    points,
    odds: [
      { label: "Juara liga", value: winLeague, tone: "gold" },
      { label: "Top 4", value: topFour, tone: "mint" },
      { label: "Top 6", value: topSix, tone: "blue" },
      { label: "Top 10", value: topTen, tone: "purple" },
      { label: "Zona degradasi", value: relegation, tone: "red" },
    ],
  };
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatPercent(value: number) {
  return value < 1 ? `${value.toFixed(1)}%` : `${Math.round(value)}%`;
}

function slotShortLabel(slot: FormationSlot) {
  return slot.id.replace(/[0-9]/g, "");
}

function teamCode(team: string) {
  const words = team.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words.map((word) => word[0]).join("").slice(0, 3).toUpperCase();
  }
  return team.slice(0, 3).toUpperCase();
}

function teamColor(team: string) {
  let hash = 0;
  for (let index = 0; index < team.length; index += 1) {
    hash = (hash * 31 + team.charCodeAt(index)) % 360;
  }
  return `hsl(${hash} 82% 58%)`;
}

type SlotOption = {
  id: string;
  label: string;
  shortLabel: string;
  group: PlayerGroup;
  available: boolean;
};

type OverallRow = {
  key: "attack" | "midfield" | "defence" | "gk";
  label: string;
  icon: string;
  value: number | null;
};

type SquadRow = {
  slot: FormationSlot;
  player: PlayerSeason;
};
