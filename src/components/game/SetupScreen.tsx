import type { ReactNode } from "react";
import { formations } from "@/lib/game-data";
import type { RatingMode } from "@/lib/game-engine";
import type { Difficulty, EraPreset } from "@/hooks/useDraftGame";
import type { FormationSlot, SpinRule } from "@/lib/types";

const formationMeta: Record<string, { label: string; description: string }> = {
  "433": { label: "4-3-3", description: "Lebar dan agresif. Cocok untuk winger cepat dan striker tajam." },
  "442": { label: "4-4-2", description: "Klasik dan seimbang. Dua striker memberi ancaman konstan." },
  "4231": { label: "4-2-3-1", description: "Stabil di tengah. Satu playmaker bebas di belakang striker." },
  "451": { label: "4-5-1", description: "Padat dan sabar. Cocok untuk mengunci laga tandang." },
  "343": { label: "3-4-3", description: "Menekan dari depan. Risiko tinggi, hadiah besar." },
  "352": { label: "3-5-2", description: "Dominasi lini tengah dengan dua penyerang di kotak penalti." },
  "541": { label: "5-4-1", description: "Bertahan rapat. Satu serangan balik bisa menentukan musim." },
};

export type SetupScreenProps = {
  formationKey: string;
  difficulty: Difficulty;
  showRatings: boolean;
  spinRule: SpinRule;
  ratingMode: RatingMode;
  eraPreset: EraPreset;
  includeGeneratedPlayers: boolean;
  onFormationChange: (value: string) => void;
  onDifficultyChange: (value: Difficulty) => void;
  onShowRatingsChange: (value: boolean) => void;
  onSpinRuleChange: (value: SpinRule) => void;
  onRatingModeChange: (value: RatingMode) => void;
  onEraPresetChange: (value: EraPreset) => void;
  onIncludeGeneratedPlayersChange: (value: boolean) => void;
  onStart: () => void;
};

export function SetupScreen({
  formationKey,
  difficulty,
  showRatings,
  spinRule,
  ratingMode,
  eraPreset,
  includeGeneratedPlayers,
  onFormationChange,
  onDifficultyChange,
  onShowRatingsChange,
  onSpinRuleChange,
  onRatingModeChange,
  onEraPresetChange,
  onIncludeGeneratedPlayersChange,
  onStart,
}: SetupScreenProps) {
  const selectedFormation = formations[formationKey] ?? formations["433"];
  const description = formationMeta[formationKey]?.description ?? "Pilih bentuk tim yang paling cocok dengan gaya draft kamu.";
  const eraIndex = eraPreset === "modern" ? 1 : 0;
  const eraStartLabel = eraPreset === "modern" ? "2021/22" : "2017";

  return (
    <section className="setup-builder">
      <div className="setup-title">
        <p>Draft XI terbaik sepakbola Indonesia dan kejar musim sempurna.</p>
      </div>

      <SetupBlock title="Formasi">
        <div className="formation-options" role="group" aria-label="Formasi">
          {Object.entries(formationMeta).map(([key, meta]) => (
            <button
              className={`setup-option formation-option ${formationKey === key ? "selected" : ""}`}
              key={key}
              onClick={() => onFormationChange(key)}
              type="button"
            >
              {meta.label}
            </button>
          ))}
        </div>
        <p className="setup-helper">{description}</p>
        <FormationPreview formation={selectedFormation} />
      </SetupBlock>

      <SetupBlock title="Kesulitan">
        <div className="setup-card-grid three">
          <OptionCard
            selected={difficulty === "easy"}
            title="Santai"
            text="3 reroll tersedia"
            onClick={() => onDifficultyChange("easy")}
          />
          <OptionCard
            selected={difficulty === "normal"}
            title="Normal"
            text="1 reroll tersedia"
            onClick={() => onDifficultyChange("normal")}
          />
          <OptionCard
            tone="gold"
            selected={difficulty === "hard"}
            title="Sulit"
            text="Tanpa reroll, rating disembunyikan"
            onClick={() => onDifficultyChange("hard")}
          />
        </div>
      </SetupBlock>

      <SetupBlock title="Tampilkan rating">
        <div className="setup-card-grid two">
          <OptionCard
            selected={showRatings && difficulty !== "hard"}
            disabled={difficulty === "hard"}
            title="Aktif"
            text="Overall pemain terlihat saat draft"
            onClick={() => onShowRatingsChange(true)}
          />
          <OptionCard
            tone="purple"
            selected={!showRatings || difficulty === "hard"}
            title="Mati"
            text="Mode insting, percaya mata bola"
            onClick={() => onShowRatingsChange(false)}
          />
        </div>
        {difficulty === "hard" && <p className="setup-warning">Rating selalu tersembunyi pada mode Sulit.</p>}
      </SetupBlock>

      <SetupBlock title="Mode draft">
        <div className="setup-card-grid two">
          <OptionCard
            selected={spinRule === "team"}
            title="Klub Dulu"
            text="Spin klub-musim, pilih pemain, lalu sistem taruh di posisi cocok."
            onClick={() => onSpinRuleChange("team")}
          />
          <OptionCard
            selected={spinRule === "position"}
            title="Posisi Dulu"
            text="Slot posisi dipilih dulu, lalu spin klub-musim untuk mengisinya."
            onClick={() => onSpinRuleChange("position")}
          />
        </div>
      </SetupBlock>

      <SetupBlock title="Rating pemain">
        <div className="setup-card-grid two">
          <OptionCard
            tone="blue"
            selected={ratingMode === "season"}
            title="Musim Karier"
            text="Pemain dinilai sesuai klub dan musim yang dispin."
            onClick={() => onRatingModeChange("season")}
          />
          <OptionCard
            selected={ratingMode === "prime"}
            title="Prime Mode"
            text="Pemain memakai rating terbaik dalam karier Liga Indonesia."
            onClick={() => onRatingModeChange("prime")}
          />
        </div>
      </SetupBlock>

      <SetupBlock title="Data pemain">
        <div className="setup-card-grid two">
          <OptionCard
            selected={includeGeneratedPlayers}
            title="Gunakan roster pelengkap"
            text="Membantu wheel tetap playable saat database verified/manual belum lengkap."
            onClick={() => onIncludeGeneratedPlayersChange(true)}
          />
          <OptionCard
            selected={!includeGeneratedPlayers}
            title="Verified/manual saja"
            text="Mode data lebih serius: wheel hanya memakai pemain verified dan manual."
            onClick={() => onIncludeGeneratedPlayersChange(false)}
          />
        </div>
        <p className="setup-helper">
          {includeGeneratedPlayers
            ? "Roster pelengkap membantu wheel tetap playable saat database belum lengkap. Data ini generated, bukan roster resmi lengkap."
            : "Mode ini memakai data verified/manual saja agar draft terasa lebih serius dan terkurasi."}
        </p>
      </SetupBlock>

      <SetupBlock title="Era">
        <div className="era-options" role="group" aria-label="Era database">
          <button className={`setup-option ${eraPreset === "all" ? "selected" : ""}`} type="button" onClick={() => onEraPresetChange("all")}>Semua era</button>
          <button className={`setup-option ${eraPreset === "modern" ? "selected" : ""}`} type="button" onClick={() => onEraPresetChange("modern")}>Modern</button>
        </div>
        <div className="era-range-wrap">
          <input
            aria-label="Geser pilihan era"
            className={`era-range ${eraPreset === "modern" ? "is-modern" : "is-all"}`}
            max={1}
            min={0}
            onChange={(event) => onEraPresetChange(event.target.value === "1" ? "modern" : "all")}
            step={1}
            type="range"
            value={eraIndex}
          />
        </div>
        <div className="era-labels">
          <strong>{eraStartLabel}</strong>
          <span>Database Liga Indonesia</span>
          <strong>2025/26</strong>
        </div>
        <p className="setup-helper">
          {eraPreset === "modern"
            ? "Mode Modern memakai klub-musim dari 2021/22 sampai musim terbaru di database."
            : "Semua era memakai klub-musim sejak awal Liga 1 pada 2017 sampai musim terbaru di database."}
        </p>
      </SetupBlock>

      <button className="primary-button setup-start-button" type="button" disabled={!formationKey} onClick={onStart}>
        Mulai Draft -&gt;
      </button>
    </section>
  );
}

function SetupBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="setup-block">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function OptionCard({
  title,
  text,
  selected,
  disabled = false,
  tone = "mint",
  onClick,
}: {
  title: string;
  text: string;
  selected: boolean;
  disabled?: boolean;
  tone?: "mint" | "gold" | "purple" | "blue";
  onClick: () => void;
}) {
  return (
    <button
      className={`setup-choice ${selected ? "selected" : ""} tone-${tone}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  );
}

function FormationPreview({ formation }: { formation: FormationSlot[] }) {
  return (
    <div className="formation-preview" aria-label="Preview formasi">
      <div className="preview-half-line" />
      <div className="preview-circle" />
      {formation.map((slot) => (
        <span className="preview-player" style={{ left: `${slot.x}%`, top: `${slot.y}%` }} key={slot.id}>
          {slot.id.replace(/[0-9]/g, "")}
        </span>
      ))}
    </div>
  );
}
