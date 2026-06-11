export type PlayerGroup = "GK" | "DEF" | "MID" | "FWD";

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
  generated?: boolean;
};

export type GameMode = "normal" | "hard";

export type SpinRule = "position" | "team";

export type SpinResult = {
  team: string;
  season: string;
  slotId: string | null;
  slotLabel: string;
  choices: PlayerSeason[];
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
  wins: number;
  draws: number;
  losses: number;
  points: number;
  gf: number;
  ga: number;
  replacedTeam: string;
  matches: MatchResult[];
};
