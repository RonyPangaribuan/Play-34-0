import { playerOverall, type RatingMode } from "@/lib/game-engine";
import type { PlayerGroup, PlayerSeason } from "@/lib/types";

export type PlayerChoiceProps = {
  player: PlayerSeason;
  hideRatings: boolean;
  ratingMode: RatingMode;
  selected: boolean;
  slotOptions: Array<{ id: string; shortLabel: string; group: PlayerGroup }>;
  onSelect: (playerId: string) => void;
};

export function PlayerChoice({ player, hideRatings, ratingMode, selected, slotOptions, onSelect }: PlayerChoiceProps) {
  const canDraft = slotOptions.length > 0;

  return (
    <button
      className={`choice-card ${selected ? "selected" : ""} ${canDraft ? "" : "choice-card-disabled"}`}
      disabled={!canDraft}
      type="button"
      onClick={() => onSelect(player.id)}
    >
      <div className="player-top">
        <div className={`player-avatar avatar-${player.group.toLowerCase()}`}>?</div>
        <div className="player-copy">
          <div className="player-name">{player.name}</div>
          <div className="player-meta">{player.nationality || `${player.team} | ${player.season}`}</div>
        </div>
        <div className="slot-chip-row" aria-label="Posisi tersedia">
          {slotOptions.map((slot) => (
            <span className={`slot-chip chip-${slot.group.toLowerCase()}`} key={slot.id}>{slot.shortLabel}</span>
          ))}
          {hideRatings ? <span className="slot-chip muted">OVR ?</span> : <span className="slot-chip muted">OVR {playerOverall(player, ratingMode)}</span>}
        </div>
      </div>
      {player.dataStatus === "generated" && (
        <div className="slot-fit-row">
          <small>Roster pelengkap</small>
        </div>
      )}
    </button>
  );
}
