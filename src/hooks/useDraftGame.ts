"use client";

import { useMemo, useState } from "react";
import { formations, seasons } from "@/lib/game-data";
import { findSlotForPlayer, simulateSeason, spinDraftSlot, teamMetrics, type RatingMode } from "@/lib/game-engine";
import type { PlayerSeason, SimulationResult, SpinResult, SpinRule } from "@/lib/types";

export type GameStep = "setup" | "draft" | "result";
export type Difficulty = "easy" | "normal" | "hard";
export type EraPreset = "all" | "early" | "modern";

const rerollLimits: Record<Difficulty, number> = {
  easy: 3,
  normal: 1,
  hard: 0,
};

export function useDraftGame() {
  const [step, setStep] = useState<GameStep>("setup");
  const [formationKey, setFormationKey] = useState("433");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [showRatings, setShowRatings] = useState(true);
  const [spinRule, setSpinRule] = useState<SpinRule>("team");
  const [ratingMode, setRatingMode] = useState<RatingMode>("season");
  const [eraPreset, setEraPreset] = useState<EraPreset>("modern");
  const [includeGeneratedPlayers, setIncludeGeneratedPlayers] = useState(false);
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
  const ratingLabel = hideRatings ? "Rating ?" : `Rating ${metrics.rating}`;

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
    const previousSpinHadChoices = !!spin?.choices.length;
    if (previousSpinHadChoices && rerollsLeft <= 0) return;
    if (previousSpinHadChoices) setRerollsLeft((current) => Math.max(0, current - 1));
    setSpin(spinDraftSlot({ formation, lineup, spinRule, seasonFilter: selectedSeasons, ratingMode, includeGeneratedPlayers }));
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

  function changeFormation(value: string) {
    resetDraft(value);
  }

  function changeDifficulty(value: Difficulty) {
    setDifficulty(value);
    if (value === "hard") setShowRatings(false);
    setRerollsLeft(rerollLimits[value]);
  }

  function backToSetup() {
    setStep("setup");
  }

  function redraft() {
    resetDraft(formationKey);
    setStep("draft");
  }

  return {
    step,
    formationKey,
    difficulty,
    showRatings,
    spinRule,
    ratingMode,
    eraPreset,
    includeGeneratedPlayers,
    lineup,
    spin,
    result,
    formation,
    draftedCount,
    metrics,
    hideRatings,
    complete,
    rerollsLeft,
    ratingLabel,
    changeFormation,
    changeDifficulty,
    setShowRatings,
    setSpinRule,
    setRatingMode,
    setEraPreset,
    setIncludeGeneratedPlayers,
    startGame,
    spinSlot,
    draftPlayer,
    runSimulation,
    backToSetup,
    resetGame,
    redraft,
  };
}

function getEraSeasons(eraPreset: EraPreset) {
  if (eraPreset === "modern") return seasons.filter((season) => season >= "2021");
  if (eraPreset === "early") return seasons.filter((season) => season === "2017" || season === "2018" || season === "2019" || season === "2020");
  return seasons;
}
