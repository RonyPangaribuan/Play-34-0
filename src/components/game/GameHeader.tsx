import type { GameStep } from "@/hooks/useDraftGame";

export type GameHeaderProps = {
  step: GameStep;
  draftedCount: number;
  complete: boolean;
  ratingLabel: string;
};

export function GameHeader({ step, draftedCount, complete, ratingLabel }: GameHeaderProps) {
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
