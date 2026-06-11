import { liga1Teams2026, players, seasons, seasonTeams, teamPower2026 } from "./game-data";
import type { FormationSlot, MatchResult, PlayerGroup, PlayerSeason, SimulationResult, SpinResult, SpinRule, TeamMetrics } from "./types";

export type RatingMode = "season" | "prime";

const minTeamRosterChoices = 8;

export function spinDraftSlot(options: {
  formation: FormationSlot[];
  lineup: Record<string, PlayerSeason>;
  spinRule: SpinRule;
  seasonFilter?: string[];
  ratingMode?: RatingMode;
}): SpinResult {
  const openSlots = options.formation.filter((slot) => !options.lineup[slot.id]);
  const target = options.spinRule === "position" ? randomItem(openSlots) : openSlots[0];
  const activeSeasons = options.seasonFilter?.length ? options.seasonFilter : seasons;
  const spin = randomSpinOutcome({
    target,
    openGroups: new Set(openSlots.map((slot) => slot.group)),
    lineup: options.lineup,
    spinRule: options.spinRule,
    activeSeasons,
  });
  const choices = buildChoices({
    target,
    team: spin.team,
    season: spin.season,
    openGroups: new Set(openSlots.map((slot) => slot.group)),
    lineup: options.lineup,
    spinRule: options.spinRule,
    activeSeasons,
    ratingMode: options.ratingMode ?? "season",
  });

  return {
    ...spin,
    slotId: options.spinRule === "position" ? target.id : null,
    slotLabel: options.spinRule === "position" ? target.label : "Semua posisi",
    choices,
  };
}

export function findSlotForPlayer(formation: FormationSlot[], lineup: Record<string, PlayerSeason>, player: PlayerSeason) {
  return formation.find((slot) => !lineup[slot.id] && slot.group === player.group) ?? null;
}

export function playerOverall(player: PlayerSeason, ratingMode: RatingMode = "season") {
  return rawOverall(ratingMode === "prime" ? primeVersion(player) : player);
}

function rawOverall(player: PlayerSeason) {
  if (player.group === "GK") return Math.round(player.defense * 0.72 + player.stamina * 0.16 + player.creative * 0.12);
  if (player.group === "DEF") return Math.round(player.defense * 0.62 + player.creative * 0.18 + player.stamina * 0.12 + player.attack * 0.08);
  if (player.group === "MID") return Math.round(player.creative * 0.42 + player.defense * 0.22 + player.attack * 0.22 + player.stamina * 0.14);
  return Math.round(player.attack * 0.52 + player.creative * 0.28 + player.stamina * 0.14 + player.defense * 0.06);
}

export function teamMetrics(lineup: Record<string, PlayerSeason>, ratingMode: RatingMode = "season"): TeamMetrics {
  const drafted = Object.values(lineup);
  if (!drafted.length) return { attack: 0, defense: 0, creative: 0, chemistry: 0, stamina: 0, rating: 0 };
  const rated = drafted.map((player) => (ratingMode === "prime" ? primeVersion(player) : player));
  const avg = (key: keyof Pick<PlayerSeason, "attack" | "defense" | "creative" | "stamina">) =>
    Math.round(rated.reduce((sum, player) => sum + player[key], 0) / rated.length);
  const teamCounts = countBy(drafted, "team");
  const seasonCounts = countBy(drafted, "season");
  const sameTeamBonus = Math.max(...Object.values(teamCounts)) * 2;
  const seasonSpreadBonus = Object.keys(seasonCounts).length * 3;
  const chemistry = Math.min(100, 28 + sameTeamBonus + seasonSpreadBonus + drafted.length * 3);
  const attack = avg("attack");
  const defense = avg("defense");
  const creative = avg("creative");
  const stamina = avg("stamina");
  const rating = Math.round(attack * 0.31 + defense * 0.29 + creative * 0.24 + stamina * 0.1 + chemistry * 0.06);
  return { attack, defense, creative, chemistry, stamina, rating };
}

export function simulateSeason(lineup: Record<string, PlayerSeason>, ratingMode: RatingMode = "season"): SimulationResult {
  const metrics = teamMetrics(lineup, ratingMode);
  const { opponents, replacedTeam } = buildSchedule(lineup);
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let gf = 0;
  let ga = 0;

  const matches: MatchResult[] = opponents.map((match, index) => {
    const base = teamPower2026[match.team] ?? 72;
    const opponentRating = clamp(base + Math.floor(Math.random() * 9) - 4, 62, 90);
    const homeBonus = match.home ? 3 : -2;
    const edge = metrics.rating - opponentRating + homeBonus;
    const attackPush = (metrics.attack + metrics.creative) / 2 - 70;
    const defensePush = metrics.defense - 70;
    const forGoals = clamp(Math.round(1.3 + edge / 18 + attackPush / 24 + Math.random() * 2), 0, 6);
    const againstGoals = clamp(Math.round(1.1 - edge / 24 - defensePush / 28 + Math.random() * 2), 0, 5);
    gf += forGoals;
    ga += againstGoals;
    if (forGoals > againstGoals) wins += 1;
    else if (forGoals === againstGoals) draws += 1;
    else losses += 1;
    return { matchday: index + 1, ...match, forGoals, againstGoals };
  });

  return { wins, draws, losses, points: wins * 3 + draws, gf, ga, replacedTeam, matches };
}

function buildChoices(options: {
  target: FormationSlot;
  team: string;
  season: string;
  openGroups: Set<PlayerGroup>;
  lineup: Record<string, PlayerSeason>;
  spinRule: SpinRule;
  activeSeasons: string[];
  ratingMode: RatingMode;
}) {
  if (options.spinRule === "team") {
    const roster = players.filter(
      (player) => player.team === options.team && player.season === options.season && !isDrafted(player, options.lineup),
    );
    if (roster.length) return sortRoster(roster, options.ratingMode).filter(uniquePlayer);
  }

  const eligible = (player: PlayerSeason) => {
    return player.group === options.target.group && !isDrafted(player, options.lineup);
  };
  const strict = players.filter((player) => eligible(player) && player.team === options.team && player.season === options.season);
  if (strict.length) return sortRoster(strict, options.ratingMode).filter(uniquePlayer);

  const sameTeam = players.filter((player) => eligible(player) && player.team === options.team && options.activeSeasons.includes(player.season));
  const sameSeason = players.filter((player) => eligible(player) && player.season === options.season && options.activeSeasons.includes(player.season));
  const fallback = players.filter((player) => eligible(player) && options.activeSeasons.includes(player.season) && seasonTeams[player.season]?.includes(player.team));
  return sortRoster([...sameTeam, ...sameSeason, ...fallback].filter(uniquePlayer), options.ratingMode);
}

function randomSpinOutcome(options: {
  target: FormationSlot;
  openGroups: Set<PlayerGroup>;
  lineup: Record<string, PlayerSeason>;
  spinRule: SpinRule;
  activeSeasons: string[];
}) {
  const candidates = options.activeSeasons.flatMap((season) =>
    (seasonTeams[season] ?? [])
      .filter((team) => hasExactCandidate(team, season, options))
      .map((team) => ({ team, season })),
  );
  return randomItem(
    candidates.length
      ? candidates
      : players
        .filter((player) => options.activeSeasons.includes(player.season))
        .map((player) => ({ team: player.team, season: player.season }))
        .filter(uniqueSpinOutcome),
  );
}

function hasExactCandidate(
  team: string,
  season: string,
  options: { target: FormationSlot; openGroups: Set<PlayerGroup>; lineup: Record<string, PlayerSeason>; spinRule: SpinRule },
) {
  if (options.spinRule === "team") {
    return players.filter((player) => player.team === team && player.season === season && !isDrafted(player, options.lineup)).length >= minTeamRosterChoices;
  }

  return players.some((player) => {
    return player.team === team && player.season === season && player.group === options.target.group && !isDrafted(player, options.lineup);
  });
}

function buildSchedule(lineup: Record<string, PlayerSeason>) {
  const teamCounts = countBy(Object.values(lineup), "team");
  const dominantTeam = Object.entries(teamCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const replacedTeam = dominantTeam && liga1Teams2026.includes(dominantTeam) ? dominantTeam : liga1Teams2026[liga1Teams2026.length - 1];
  const opponents = liga1Teams2026
    .filter((team) => team !== replacedTeam)
    .flatMap((team) => [
      { team, home: true },
      { team, home: false },
    ]);
  return { opponents: shuffle(opponents), replacedTeam };
}

function sortRoster(roster: PlayerSeason[], ratingMode: RatingMode) {
  const order: Record<PlayerGroup, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
  return [...roster].sort((a, b) => order[a.group] - order[b.group] || playerOverall(b, ratingMode) - playerOverall(a, ratingMode));
}

function primeVersion(player: PlayerSeason) {
  return players
    .filter((candidate) => candidate.name === player.name && candidate.group === player.group)
    .sort((a, b) => rawOverall(b) - rawOverall(a))[0] ?? player;
}

function isDrafted(player: PlayerSeason, lineup: Record<string, PlayerSeason>) {
  return Object.values(lineup).some((drafted) => drafted.name === player.name);
}

function uniquePlayer(player: PlayerSeason, index: number, list: PlayerSeason[]) {
  return list.findIndex((item) => item.name === player.name) === index;
}

function uniqueSpinOutcome(outcome: { team: string; season: string }, index: number, list: { team: string; season: string }[]) {
  return list.findIndex((item) => item.team === outcome.team && item.season === outcome.season) === index;
}

function countBy<T extends Record<K, string>, K extends keyof T>(items: T[], key: K) {
  return items.reduce<Record<string, number>>((result, item) => {
    result[item[key]] = (result[item[key]] ?? 0) + 1;
    return result;
  }, {});
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
