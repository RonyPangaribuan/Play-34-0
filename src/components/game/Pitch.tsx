import type { FormationSlot, PlayerSeason } from "@/lib/types";

export type PitchProps = {
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  compact?: boolean;
};

export function Pitch({ formation, lineup, compact = false }: PitchProps) {
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
