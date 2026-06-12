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
  onBackToSetup: () => void;
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
  onBackToSetup,
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
  const overallRows = useMemo(() => buildOverallRows(lineup, ratingMode), [lineup, ratingMode]);

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
        <Pitch formation={formation} lineup={lineup} compact />

        <aside className="draft-panel" aria-label="Draft controls">
          <OverallPanel rating={metrics.rating} rows={overallRows} />

          <div className="slot-card">
            <div className="slot-head">
              <p className="eyebrow">Slot</p>
              <span id="positionBadge">{spinRule === "team" ? "TIM" : spin?.slotLabel?.replace(/[0-9]/g, "").slice(0, 3).toUpperCase() || "SET"}</span>
            </div>
            <div className="reel">
              {isSpinning && spinPreview ? (
                <div className="spin-preview" aria-live="polite">
                  <div>
                    <span>Klub</span>
                    <strong>{spinPreview.team}</strong>
                  </div>
                  <b>x</b>
                  <div>
                    <span>Musim</span>
                    <strong>{spinPreview.season}</strong>
                  </div>
                </div>
              ) : spinIsEmpty ? (
                <span>Tidak ada kandidat<br />coba lagi atau ubah setup</span>
              ) : spin ? (
                <span>{spin.team}<br />{spin.season}<br />{spin.slotLabel}</span>
              ) : (
                <span>{complete ? "XI siap disimulasikan" : "Tekan Spin"}</span>
              )}
            </div>
            <button className="primary-button" type="button" disabled={spinButtonDisabled} onClick={startSpin}>
              {isSpinning ? "Memutar..." : spinIsEmpty && rerollsLeft > 0 ? "Reroll Slot" : spinIsEmpty ? "Ubah setup dulu" : spin ? "Reroll Slot" : "Spin Slot"}
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
                <div className="choice-summary">
                  <span>{spinRule === "team" ? "Squad spin" : "Position spin"}</span>
                  <strong>{spin.team || "-"} <em>{spin.season || ""}</em></strong>
                  <small>{spin.choices.length} pemain</small>
                </div>
                {spinIsEmpty && (
                  <div className="empty-state">
                    {emptySpinMessage}
                  </div>
                )}
                {selectedPlayer && (
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
                {spin.choices.map((player) => {
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

          <button className="simulate-button" type="button" disabled={!complete} onClick={onSimulate}>
            Simulasi 34 Laga
          </button>
        </aside>
      </div>
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

function buildOverallRows(lineup: Record<string, PlayerSeason>, ratingMode: RatingMode): OverallRow[] {
  const players = Object.values(lineup);
  return [
    { key: "attack", label: "Attack", icon: "A", value: averageGroupOverall(players, "FWD", ratingMode) },
    { key: "midfield", label: "Midfield", icon: "M", value: averageGroupOverall(players, "MID", ratingMode) },
    { key: "defence", label: "Defence", icon: "D", value: averageGroupOverall(players, "DEF", ratingMode) },
    { key: "gk", label: "GK", icon: "G", value: averageGroupOverall(players, "GK", ratingMode) },
  ];
}

function averageGroupOverall(players: PlayerSeason[], group: PlayerGroup, ratingMode: RatingMode) {
  const groupPlayers = players.filter((player) => player.group === group);
  if (!groupPlayers.length) return null;
  return Math.round(groupPlayers.reduce((sum, player) => sum + playerOverall(player, ratingMode), 0) / groupPlayers.length);
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
