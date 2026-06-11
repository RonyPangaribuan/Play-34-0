"use client";

import { DraftScreen } from "@/components/game/DraftScreen";
import { GameHeader } from "@/components/game/GameHeader";
import { ResultScreen } from "@/components/game/ResultScreen";
import { SetupScreen } from "@/components/game/SetupScreen";
import { useDraftGame } from "@/hooks/useDraftGame";

export default function GameClient() {
  const game = useDraftGame();

  return (
    <main className="app-shell">
      <GameHeader
        step={game.step}
        draftedCount={game.draftedCount}
        complete={game.complete}
        ratingLabel={game.ratingLabel}
      />

      {game.step === "setup" && (
        <SetupScreen
          formationKey={game.formationKey}
          difficulty={game.difficulty}
          showRatings={game.showRatings}
          spinRule={game.spinRule}
          ratingMode={game.ratingMode}
          eraPreset={game.eraPreset}
          includeGeneratedPlayers={game.includeGeneratedPlayers}
          onFormationChange={game.changeFormation}
          onDifficultyChange={game.changeDifficulty}
          onShowRatingsChange={game.setShowRatings}
          onSpinRuleChange={game.setSpinRule}
          onRatingModeChange={game.setRatingMode}
          onEraPresetChange={game.setEraPreset}
          onIncludeGeneratedPlayersChange={game.setIncludeGeneratedPlayers}
          onStart={game.startGame}
        />
      )}

      {game.step === "draft" && (
        <DraftScreen
          formation={game.formation}
          lineup={game.lineup}
          spin={game.spin}
          spinRule={game.spinRule}
          hideRatings={game.hideRatings}
          ratingMode={game.ratingMode}
          complete={game.complete}
          draftedCount={game.draftedCount}
          rerollsLeft={game.rerollsLeft}
          metrics={game.metrics}
          formationKey={game.formationKey}
          onSpin={game.spinSlot}
          onDraft={game.draftPlayer}
          onSimulate={game.runSimulation}
          onBackToSetup={game.backToSetup}
        />
      )}

      {game.step === "result" && game.result && (
        <ResultScreen
          formation={game.formation}
          lineup={game.lineup}
          result={game.result}
          rating={game.metrics.rating}
          chemistry={game.metrics.chemistry}
          ratingMode={game.ratingMode}
          onPlayAgain={game.resetGame}
          onRedraft={game.redraft}
        />
      )}
    </main>
  );
}
