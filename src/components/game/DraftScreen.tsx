import { PlayerChoice } from "@/components/game/PlayerChoice";
import { Pitch } from "@/components/game/Pitch";
import type { RatingMode } from "@/lib/game-engine";
import type { FormationSlot, PlayerSeason, SpinResult, SpinRule, TeamMetrics } from "@/lib/types";

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
  onDraft: (player: PlayerSeason) => void;
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
  const spinHasChoices = !!spin?.choices.length;
  const spinIsEmpty = !!spin && !spinHasChoices;
  const spinButtonDisabled = complete || (!!spin && (spinHasChoices || spinIsEmpty) && rerollsLeft <= 0);
  const emptySpinMessage = spin ? getEmptySpinMessage(spin, rerollsLeft) : "";

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
              {spinIsEmpty ? (
                <span>Tidak ada kandidat<br />coba lagi atau ubah setup</span>
              ) : spin ? (
                <span>{spin.team}<br />{spin.season}<br />{spin.slotLabel}</span>
              ) : (
                <span>{complete ? "XI siap disimulasikan" : "Tekan Spin"}</span>
              )}
            </div>
            <button className="primary-button" type="button" disabled={spinButtonDisabled} onClick={onSpin}>
              {spinIsEmpty && rerollsLeft > 0 ? "Reroll Slot" : spinIsEmpty ? "Ubah setup dulu" : spin ? "Reroll Slot" : "Spin Slot"}
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
                {spinIsEmpty && (
                  <div className="empty-state">
                    {emptySpinMessage}
                  </div>
                )}
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

function getEmptySpinMessage(spin: SpinResult, rerollsLeft: number) {
  const reason = spin.unavailableReason ?? "Belum ada pemain yang cocok untuk pilihan ini.";
  if (rerollsLeft > 0) {
    return `${reason} Kamu masih punya ${rerollsLeft} reroll, coba reroll slot ini.`;
  }
  return `${reason} Kembali ke setup lalu aktifkan roster pelengkap atau pilih era yang lebih luas.`;
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
