import type { FormationSlot, PlayerSeason } from "./types";
import manualPlayerSeasons from "@/data/player-seasons.manual.json";

export const formations: Record<string, FormationSlot[]> = {
  "433": [
    slot("GK", "Goalkeeper", 50, 92, "GK"),
    slot("LB", "Left Back", 18, 74, "DEF"),
    slot("CB1", "Centre Back", 38, 72, "DEF"),
    slot("CB2", "Centre Back", 62, 72, "DEF"),
    slot("RB", "Right Back", 82, 74, "DEF"),
    slot("DM", "Defensive Mid", 50, 56, "MID"),
    slot("CM", "Central Mid", 34, 43, "MID"),
    slot("AM", "Attacking Mid", 66, 39, "MID"),
    slot("LW", "Left Wing", 20, 22, "FWD"),
    slot("ST", "Striker", 50, 15, "FWD"),
    slot("RW", "Right Wing", 80, 22, "FWD"),
  ],
  "4231": [
    slot("GK", "Goalkeeper", 50, 92, "GK"),
    slot("LB", "Left Back", 18, 74, "DEF"),
    slot("CB1", "Centre Back", 38, 72, "DEF"),
    slot("CB2", "Centre Back", 62, 72, "DEF"),
    slot("RB", "Right Back", 82, 74, "DEF"),
    slot("DM1", "Defensive Mid", 39, 57, "MID"),
    slot("DM2", "Defensive Mid", 61, 57, "MID"),
    slot("LAM", "Left Attacking Mid", 25, 34, "MID"),
    slot("AM", "Attacking Mid", 50, 31, "MID"),
    slot("RAM", "Right Attacking Mid", 75, 34, "MID"),
    slot("ST", "Striker", 50, 15, "FWD"),
  ],
  "352": [
    slot("GK", "Goalkeeper", 50, 92, "GK"),
    slot("LCB", "Left Centre Back", 30, 72, "DEF"),
    slot("CB", "Centre Back", 50, 73, "DEF"),
    slot("RCB", "Right Centre Back", 70, 72, "DEF"),
    slot("LWB", "Left Wing Back", 16, 51, "DEF"),
    slot("DM", "Defensive Mid", 50, 55, "MID"),
    slot("CM1", "Central Mid", 34, 42, "MID"),
    slot("CM2", "Central Mid", 66, 42, "MID"),
    slot("RWB", "Right Wing Back", 84, 51, "DEF"),
    slot("ST1", "Striker", 40, 17, "FWD"),
    slot("ST2", "Striker", 60, 17, "FWD"),
  ],
};

export const seasons = ["2017", "2018", "2019", "2020", "2021/22", "2022/23", "2023/24", "2024/25", "2025/26"];

export const seasonTeams: Record<string, string[]> = {
  "2017": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Madura United", "Persib", "Persija", "PSM", "Semen Padang", "Sriwijaya FC", "Perseru"],
  "2018": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Madura United", "Persebaya", "Persib", "Persija", "PSIS", "PSM", "Sriwijaya FC"],
  "2019": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Madura United", "Persebaya", "Persib", "Persija", "PSS", "PSIS", "PSM", "Semen Padang", "Tira Persikabo"],
  "2020": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Madura United", "Persebaya", "Persib", "Persija", "Persik", "Persita", "PSM", "PSS", "PSIS", "Tira Persikabo"],
  "2021/22": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Madura United", "Persebaya", "Persib", "Persija", "Persik", "Persita", "PSM", "PSS", "PSIS", "Tira Persikabo"],
  "2022/23": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Dewa United", "Madura United", "Persebaya", "Persib", "Persija", "Persik", "Persis", "Persita", "PSM", "PSS", "PSIS", "Tira Persikabo"],
  "2023/24": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Dewa United", "Madura United", "Persebaya", "Persib", "Persija", "Persik", "Persis", "Persita", "Persikabo 1973", "PSM", "PSS", "PSIS"],
  "2024/25": ["Arema", "Bali United", "Barito Putera", "Borneo Samarinda", "Dewa United", "Madura United", "Malut United", "Persebaya", "Persib", "Persija", "Persik", "Persis", "Persita", "PSBS", "PSIS", "PSM", "PSS", "Semen Padang"],
  "2025/26": ["Arema", "Bali United", "Bhayangkara Presisi", "Borneo Samarinda", "Dewa United", "Madura United", "Malut United", "Persebaya", "Persib", "Persija", "Persijap", "Persik", "Persis", "Persita", "PSBS", "PSIM", "PSM", "Semen Padang"],
};

export const liga1Teams2026 = seasonTeams["2025/26"];

export const teamPower2026: Record<string, number> = {
  Persib: 84,
  "Borneo Samarinda": 83,
  Persija: 81,
  "Dewa United": 79,
  "Bali United": 78,
  Persebaya: 78,
  PSM: 77,
  Arema: 76,
  "Malut United": 76,
  Persita: 74,
  Persik: 74,
  PSIM: 73,
  Persis: 72,
  "Madura United": 72,
  "Bhayangkara Presisi": 71,
  Persijap: 70,
  PSBS: 68,
  "Semen Padang": 67,
};

const seedPlayers: PlayerSeason[] = [
  player("Teja Paku Alam", "Persib", "2021/22", "GK", 18, 82, 44, 78),
  player("Nick Kuipers", "Persib", "2025/26", "DEF", 42, 86, 55, 81),
  player("Marc Klok", "Persib", "2023/24", "MID", 74, 69, 84, 83),
  player("Ciro Alves", "Persib", "2024/25", "FWD", 88, 43, 80, 79),
  player("David da Silva", "Persib", "2023/24", "FWD", 91, 40, 70, 76),
  player("Febri Hariyadi", "Persib", "2018", "FWD", 79, 48, 76, 88),
  player("Andritany Ardhiyasa", "Persija", "2018", "GK", 15, 85, 48, 80),
  player("Rizky Ridho", "Persija", "2025/26", "DEF", 48, 87, 62, 84),
  player("Riko Simanjuntak", "Persija", "2019", "FWD", 79, 45, 83, 82),
  player("Witan Sulaeman", "Persija", "2025/26", "FWD", 81, 51, 82, 84),
  player("Marko Simic", "Persija", "2018", "FWD", 90, 38, 66, 75),
  player("Nadeo Argawinata", "Borneo Samarinda", "2024/25", "GK", 19, 83, 52, 82),
  player("Stefano Lilipaly", "Borneo Samarinda", "2022/23", "MID", 82, 54, 88, 78),
  player("Terens Puhiri", "Borneo Samarinda", "2023/24", "FWD", 80, 48, 75, 90),
  player("Kei Hirose", "Borneo Samarinda", "2024/25", "MID", 69, 72, 81, 84),
  player("Adilson Maringa", "Bali United", "2023/24", "GK", 18, 82, 45, 77),
  player("Ricky Fajrin", "Bali United", "2019", "DEF", 47, 83, 60, 80),
  player("Eber Bessa", "Bali United", "2021/22", "MID", 75, 58, 86, 77),
  player("Ilija Spasojevic", "Bali United", "2019", "FWD", 88, 45, 68, 70),
  player("Privat Mbarga", "Bali United", "2023/24", "FWD", 84, 47, 79, 88),
  player("Ernando Ari", "Persebaya", "2023/24", "GK", 18, 80, 50, 84),
  player("Reva Adi", "Persebaya", "2023/24", "DEF", 45, 79, 62, 81),
  player("Ze Valente", "Persebaya", "2022/23", "MID", 74, 52, 87, 76),
  player("Bruno Moreira", "Persebaya", "2025/26", "FWD", 85, 44, 82, 83),
  player("Hilmansyah", "PSM", "2025/26", "GK", 16, 78, 43, 77),
  player("Yuran Fernandes", "PSM", "2022/23", "DEF", 50, 86, 58, 79),
  player("Yakob Sayuri", "PSM", "2022/23", "FWD", 82, 54, 79, 88),
  player("Wiljan Pluim", "PSM", "2018", "MID", 80, 58, 91, 73),
  player("Lucas Frigeri", "Arema", "2025/26", "GK", 14, 79, 44, 76),
  player("Johan Ahmat Farizi", "Arema", "2019", "DEF", 49, 82, 64, 79),
  player("Arkhan Fikri", "Arema", "2025/26", "MID", 70, 65, 82, 86),
  player("Dalberto", "Arema", "2025/26", "FWD", 84, 45, 72, 79),
  player("Sonny Stevens", "Dewa United", "2024/25", "GK", 17, 82, 51, 77),
  player("Alexis Messidoro", "Dewa United", "2025/26", "MID", 78, 54, 89, 76),
  player("Taisei Marukawa", "Dewa United", "2024/25", "FWD", 83, 50, 84, 84),
  player("Muhammad Riyandi", "Persis", "2022/23", "GK", 15, 77, 47, 79),
  player("Jaimerson Xavier", "Persis", "2023/24", "DEF", 44, 81, 54, 75),
  player("Sho Yamamoto", "Persis", "2025/26", "FWD", 82, 48, 81, 83),
  player("Igor Rodrigues", "Persita", "2025/26", "GK", 14, 78, 41, 75),
  player("Esal Sahrul", "Persita", "2024/25", "FWD", 78, 47, 76, 85),
  player("Pablo Ganet", "Persita", "2025/26", "MID", 69, 72, 78, 78),
  player("Hokky Caraka", "Persita", "2025/26", "FWD", 79, 43, 70, 82),
  player("Ciro Alves", "Malut United", "2025/26", "FWD", 86, 42, 80, 77),
  player("David da Silva", "Malut United", "2025/26", "FWD", 89, 40, 69, 74),
  player("Tyronne del Pino", "Malut United", "2025/26", "MID", 76, 53, 86, 75),
  player("Cahya Supriadi", "PSIM", "2025/26", "GK", 13, 77, 46, 82),
  player("Raka Cahyana", "PSIM", "2025/26", "DEF", 47, 76, 65, 84),
  player("Yevhen Bokhashvili", "PSIM", "2025/26", "FWD", 82, 43, 68, 73),
  player("Dikri Yusron", "Persik", "2023/24", "GK", 12, 76, 42, 76),
  player("Flavio Silva", "Persik", "2023/24", "FWD", 84, 42, 70, 77),
  player("Lulinha", "Madura United", "2025/26", "FWD", 82, 43, 79, 76),
  player("Jordy Wehrmann", "Madura United", "2025/26", "MID", 72, 64, 82, 79),
  player("Awan Setho", "Bhayangkara Presisi", "2017", "GK", 13, 80, 44, 76),
  player("Sani Rizki", "Bhayangkara Presisi", "2025/26", "MID", 68, 68, 77, 83),
  player("Rodrigo Moura", "Persijap", "2025/26", "FWD", 81, 42, 70, 75),
  player("Borja Herrera", "Persijap", "2025/26", "MID", 72, 60, 82, 77),
  player("Ruyery Blanco", "PSBS", "2025/26", "FWD", 78, 42, 73, 79),
  player("Vendry Mofu", "Semen Padang", "2017", "MID", 70, 61, 78, 76),
  player("Arthur", "Semen Padang", "2025/26", "GK", 12, 75, 40, 74),
  player("Rizky Pora", "Barito Putera", "2017", "MID", 73, 58, 82, 80),
  player("Wallace Costa", "PSIS", "2019", "DEF", 42, 82, 55, 74),
  player("Carlos Fortes", "PSIS", "2022/23", "FWD", 84, 42, 70, 74),
  player("Ciro Alves", "Tira Persikabo", "2019", "FWD", 86, 42, 80, 78),
  player("Alberto Goncalves", "Sriwijaya FC", "2017", "FWD", 86, 39, 69, 71),
  player("Silvio Escobar", "Perseru", "2017", "FWD", 78, 42, 68, 76),
];

export const players: PlayerSeason[] = mergePlayerData([
  ...seedPlayers,
  ...manualPlayerSeasons.map((player) => ({
    id: player.id,
    name: player.name,
    team: player.team,
    season: player.season,
    group: player.group as PlayerSeason["group"],
    attack: player.attack,
    defense: player.defense,
    creative: player.creative,
    stamina: player.stamina,
  })),
]);

function slot(id: string, label: string, x: number, y: number, group: FormationSlot["group"]): FormationSlot {
  return { id, label, x, y, group };
}

function player(
  name: string,
  team: string,
  season: string,
  group: PlayerSeason["group"],
  attack: number,
  defense: number,
  creative: number,
  stamina: number,
): PlayerSeason {
  return {
    id: `${team}-${season}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    team,
    season,
    group,
    attack,
    defense,
    creative,
    stamina,
  };
}

function mergePlayerData(items: PlayerSeason[]) {
  const map = new Map<string, PlayerSeason>();
  for (const item of items) {
    map.set(`${item.team}|${item.season}|${item.name}`, item);
  }
  return [...map.values()];
}
