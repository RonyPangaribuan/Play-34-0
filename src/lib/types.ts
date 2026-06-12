export type PlayerGroup = "GK" | "DEF" | "MID" | "FWD";
export type PlayerDataStatus = "verified" | "manual" | "generated";
export type PlayerReviewStatus = "reviewed" | "needs-review";

export type FormationSlot = {
  id: string;
  label: string;
  x: number;
  y: number;
  group: PlayerGroup;
};

export type PlayerSeason = {
  id: string;
  name: string;
  team: string;
  season: string;
  group: PlayerGroup;
  attack: number;
  defense: number;
  creative: number;
  stamina: number;
  dataStatus: PlayerDataStatus;
  generated?: boolean;
  positionDetail?: string;
  nationality?: string;
  reviewStatus?: PlayerReviewStatus;
  source?: string;
  sourceTitle?: string;
  note?: string;
};

export type GameMode = "normal" | "hard";

export type SpinRule = "position" | "team";

export type SpinResult = {
  team: string;
  season: string;
  slotId: string | null;
  slotLabel: string;
  choices: PlayerSeason[];
  unavailableReason?: string;
};

export type TeamMetrics = {
  attack: number;
  defense: number;
  creative: number;
  chemistry: number;
  stamina: number;
  rating: number;
};

export type MatchResult = {
  matchday: number;
  team: string;
  home: boolean;
  forGoals: number;
  againstGoals: number;
};

export type SimulationResult = {
  seed: string;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  gf: number;
  ga: number;
  replacedTeam: string;
  matches: MatchResult[];
};
