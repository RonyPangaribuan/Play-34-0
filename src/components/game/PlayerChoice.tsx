import { playerOverall, type RatingMode } from "@/lib/game-engine";
import type { PlayerSeason } from "@/lib/types";

export type PlayerChoiceProps = {
  player: PlayerSeason;
  hideRatings: boolean;
  ratingMode: RatingMode;
  slotLabels: string[];
  onDraft: (player: PlayerSeason) => void;
};

export function PlayerChoice({ player, hideRatings, ratingMode, slotLabels, onDraft }: PlayerChoiceProps) {
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
        {player.dataStatus === "generated" && <small>Roster pelengkap</small>}
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
