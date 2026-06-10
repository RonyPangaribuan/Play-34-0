"use client";

import { useMemo, useState } from "react";
import { formations } from "@/lib/game-data";
import { findSlotForPlayer, playerOverall, simulateSeason, spinDraftSlot, teamMetrics } from "@/lib/game-engine";
import type { GameMode, PlayerSeason, SimulationResult, SpinResult, SpinRule } from "@/lib/types";

export default function GameClient() {
  const [formationKey, setFormationKey] = useState("");
  const [mode, setMode] = useState<GameMode>("normal");
  const [spinRule, setSpinRule] = useState<SpinRule>("position");
  const [lineup, setLineup] = useState<Record<string, PlayerSeason>>({});
  const [spin, setSpin] = useState<SpinResult | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [ratingRevealed, setRatingRevealed] = useState(false);

  const formation = formationKey ? formations[formationKey] : [];
  const draftedCount = Object.keys(lineup).length;
  const metrics = useMemo(() => teamMetrics(lineup), [lineup]);
  const hideRatings = mode === "hard" && !ratingRevealed;
  const complete = formation.length > 0 && draftedCount === formation.length;

  function selectFormation(nextFormation: string) {
    setFormationKey(nextFormation);
    setLineup({});
    setSpin(null);
    setResult(null);
    setRatingRevealed(false);
  }

  function spinSlot() {
    if (!formation.length || complete) return;
    setResult(null);
    setSpin(spinDraftSlot({ formation, lineup, spinRule }));
  }

  function draftPlayer(player: PlayerSeason) {
    if (!formation.length || !spin) return;
    const targetSlot = spinRule === "team"
      ? findSlotForPlayer(formation, lineup, player)
      : formation.find((slot) => slot.id === spin.slotId);
    if (!targetSlot) return;
    setLineup((current) => ({ ...current, [targetSlot.id]: player }));
    setSpin(null);
  }

  function runSimulation() {
    const simulation = simulateSeason(lineup);
    setRatingRevealed(true);
    setResult(simulation);
  }

  return (
    <main className="app-shell">
      <section className="topbar" aria-label="Game status">
        <div>
          <p className="eyebrow">Draft XI Sepakbola Indonesia</p>
          <h1>34-0</h1>
        </div>
        <div className="score-pill">
          <span>{formation.length ? (complete ? "XI lengkap" : `Pick ${draftedCount + 1}/11`) : "Pilih formasi"}</span>
          <strong>{hideRatings ? "Rating ?" : `Rating ${metrics.rating}`}</strong>
        </div>
      </section>

      <section className="game-grid">
        <aside className="control-panel" aria-label="Draft controls">
          <div className="setup-card">
            <p className="eyebrow">Setup</p>
            <label className="field-label" htmlFor="formationSelect">Formasi</label>
            <select id="formationSelect" value={formationKey} onChange={(event) => selectFormation(event.target.value)}>
              <option value="">Pilih formasi dulu</option>
              <option value="433">4-3-3</option>
              <option value="4231">4-2-3-1</option>
              <option value="352">3-5-2</option>
            </select>

            <span className="field-label">Mode rating</span>
            <div className="mode-row" role="group" aria-label="Mode">
              <button className={`mode-button ${mode === "normal" ? "active" : ""}`} onClick={() => setMode("normal")} type="button">Normal</button>
              <button className={`mode-button ${mode === "hard" ? "active" : ""}`} onClick={() => setMode("hard")} type="button">Hard</button>
            </div>

            <span className="field-label">Aturan spin</span>
            <div className="mode-row" role="group" aria-label="Aturan spin">
              <button className={`spin-rule-button ${spinRule === "position" ? "active" : ""}`} onClick={() => setSpinRule("position")} type="button">Posisi</button>
              <button className={`spin-rule-button ${spinRule === "team" ? "active" : ""}`} onClick={() => setSpinRule("team")} type="button">Tim</button>
            </div>
          </div>

          <div className="slot-card">
            <div className="slot-head">
              <p className="eyebrow">Slot</p>
              <span id="positionBadge">{spinRule === "team" ? "TIM" : spin?.slotLabel?.replace(/[0-9]/g, "").slice(0, 3).toUpperCase() || "SET"}</span>
            </div>
            <div className="reel">
              {spin ? (
                <span>{spin.team}<br />{spin.season}<br />{spin.slotLabel}</span>
              ) : (
                <span>{formation.length ? "Tekan Spin" : "Pilih formasi untuk mulai"}</span>
              )}
            </div>
            <button className="primary-button" type="button" disabled={!formation.length || complete} onClick={spinSlot}>
              Spin Slot
            </button>
          </div>

          <div className="choice-list" aria-live="polite">
            {!spin && (
              <div className="empty-state">
                {formation.length
                  ? "Wheel mengambil klub Liga 1 dan musim 2017-2026. Pilih pemain setelah spin berhenti."
                  : "Formasi wajib dipilih sebelum spin."}
              </div>
            )}
            {spin && (
              <>
                <div className="choice-summary">{spin.choices.length} pemain tersedia</div>
                {spin.choices.map((player) => (
                  <button className="choice-card" type="button" key={player.id} onClick={() => draftPlayer(player)}>
                    <div className="player-top">
                      <div>
                        <div className="player-name">{player.name}</div>
                        <div className="player-meta">{player.team} | {player.season} | {player.group}</div>
                      </div>
                      <strong>{hideRatings ? "?" : playerOverall(player)}</strong>
                    </div>
                    <div className="stat-row">
                      {hideRatings ? (
                        <>
                          <span>Rating</span><span>disimpan</span><span>sampai</span><span>akhir</span>
                        </>
                      ) : (
                        <>
                          <span>ATK {player.attack}</span><span>DEF {player.defense}</span><span>CRE {player.creative}</span><span>OVR {playerOverall(player)}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>

          <button className="simulate-button" type="button" disabled={!complete} onClick={runSimulation}>
            Simulasi 34 Laga
          </button>
        </aside>

        <section className="pitch-panel" aria-label="Starting eleven">
          <div className="pitch">
            <div className="pitch-line half" />
            <div className="pitch-line box top" />
            <div className="pitch-line box bottom" />
            <div className="center-circle" />
            <div className="formation">
              {!formation.length && <div className="pitch-placeholder">Pilih formasi</div>}
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

        <aside className="result-panel" aria-label="Simulation results">
          <div className="metric-card">
            <p className="eyebrow">Target</p>
            <h2>34 menang</h2>
            <p>Bangun XI seimbang, jaga chemistry, lalu kejar musim sempurna.</p>
          </div>

          <div className="metric-grid">
            <Metric label="Attack" value={hideRatings ? "?" : metrics.attack} />
            <Metric label="Defense" value={hideRatings ? "?" : metrics.defense} />
            <Metric label="Creative" value={hideRatings ? "?" : metrics.creative} />
            <Metric label="Chemistry" value={hideRatings ? "?" : metrics.chemistry} />
          </div>

          <div className="result-box">
            <p className="eyebrow">Hasil musim</p>
            {!result ? (
              <div className="empty-state compact">Draft 11 pemain untuk membuka simulasi.</div>
            ) : (
              <SeasonResult result={result} rating={metrics.rating} chemistry={metrics.chemistry} />
            )}
          </div>
        </aside>
      </section>
    </main>
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
