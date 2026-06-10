import { writeFile, mkdir } from "node:fs/promises";

const seasons = [
  { label: "2017", titlePrefix: "2017" },
  { label: "2018", titlePrefix: "2018" },
  { label: "2019", titlePrefix: "2019" },
  { label: "2020", titlePrefix: "2020" },
  { label: "2021/22", titlePrefix: "2021–22" },
  { label: "2022/23", titlePrefix: "2022–23" },
  { label: "2023/24", titlePrefix: "2023–24" },
  { label: "2024/25", titlePrefix: "2024–25" },
  { label: "2025/26", titlePrefix: "2025–26" },
];

const teamsBySeason = {
  "2017": ["Arema", "Bali United", "Barito Putera", "Bhayangkara", "Borneo", "Madura United", "Mitra Kukar", "Persegres", "Persela", "Perseru", "Persib Bandung", "Persiba Balikpapan", "Persija Jakarta", "Persipura Jayapura", "PS TNI", "PSM Makassar", "Semen Padang", "Sriwijaya"],
  "2018": ["Arema", "Bali United", "Barito Putera", "Bhayangkara", "Borneo", "Madura United", "Mitra Kukar", "Persebaya Surabaya", "Persela", "Perseru", "Persib Bandung", "Persija Jakarta", "Persipura Jayapura", "PS TIRA", "PSIS Semarang", "PSM Makassar", "PSMS Medan", "Sriwijaya"],
  "2019": ["Arema", "Bali United", "Barito Putera", "Bhayangkara", "Borneo", "Kalteng Putra", "Madura United", "Persebaya Surabaya", "Persela", "Perseru Badak Lampung", "Persib Bandung", "Persija Jakarta", "Persipura Jayapura", "PSS Sleman", "PSIS Semarang", "PSM Makassar", "Semen Padang", "Tira Persikabo"],
  "2020": ["Arema", "Bali United", "Barito Putera", "Bhayangkara", "Borneo", "Madura United", "Persebaya Surabaya", "Persela", "Persib Bandung", "Persija Jakarta", "Persik Kediri", "Persipura Jayapura", "Persiraja Banda Aceh", "Persita Tangerang", "PSM Makassar", "PSS Sleman", "PSIS Semarang", "Tira Persikabo"],
  "2021/22": ["Arema", "Bali United", "Barito Putera", "Bhayangkara", "Borneo", "Madura United", "Persebaya Surabaya", "Persela", "Persib Bandung", "Persija Jakarta", "Persik Kediri", "Persipura Jayapura", "Persiraja Banda Aceh", "Persita Tangerang", "PSM Makassar", "PSS Sleman", "PSIS Semarang", "Tira Persikabo"],
  "2022/23": ["Arema", "Bali United", "Barito Putera", "Bhayangkara", "Borneo", "Dewa United", "Madura United", "Persebaya Surabaya", "Persib Bandung", "Persija Jakarta", "Persik Kediri", "Persis Solo", "Persita Tangerang", "PSM Makassar", "PSS Sleman", "PSIS Semarang", "RANS Nusantara", "Tira Persikabo"],
  "2023/24": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Dewa United", "Madura United", "Persebaya Surabaya", "Persib Bandung", "Persija Jakarta", "Persik Kediri", "Persis Solo", "Persita Tangerang", "Persikabo 1973", "PSM Makassar", "PSS Sleman", "PSIS Semarang", "RANS Nusantara"],
  "2024/25": ["Arema", "Bali United", "Barito Putera", "Borneo Samarinda", "Dewa United", "Madura United", "Malut United", "Persebaya Surabaya", "Persib Bandung", "Persija Jakarta", "Persik Kediri", "Persis Solo", "Persita Tangerang", "PSBS Biak", "PSIS Semarang", "PSM Makassar", "PSS Sleman", "Semen Padang"],
  "2025/26": ["Arema", "Bali United", "Bhayangkara Presisi", "Borneo Samarinda", "Dewa United", "Madura United", "Malut United", "Persebaya Surabaya", "Persib Bandung", "Persija Jakarta", "Persijap Jepara", "Persik Kediri", "Persis Solo", "Persita Tangerang", "PSBS Biak", "PSIM Yogyakarta", "PSM Makassar", "Semen Padang"],
};

const aliases = {
  Arema: ["Arema F.C.", "Arema FC", "Arema"],
  "Bali United": ["Bali United F.C.", "Bali United"],
  Bhayangkara: ["Bhayangkara F.C.", "Bhayangkara"],
  "Bhayangkara Presisi": ["Bhayangkara Presisi Indonesia F.C.", "Bhayangkara Presisi", "Bhayangkara F.C."],
  Borneo: ["Borneo F.C.", "Borneo"],
  "Borneo Samarinda": ["Borneo Samarinda F.C.", "Borneo Samarinda", "Borneo F.C."],
  "Dewa United": ["Dewa United F.C.", "Dewa United"],
  "Madura United": ["Madura United F.C.", "Madura United"],
  "Malut United": ["Malut United F.C.", "Malut United"],
  "Persebaya Surabaya": ["Persebaya Surabaya", "Persebaya"],
  "Persib Bandung": ["Persib Bandung", "Persib"],
  "Persija Jakarta": ["Persija Jakarta", "Persija"],
  "Persik Kediri": ["Persik Kediri", "Persik"],
  "Persis Solo": ["Persis Solo", "Persis"],
  "Persita Tangerang": ["Persita Tangerang", "Persita"],
  "PSBS Biak": ["PSBS Biak", "PSBS Biak Numfor"],
  "PSIM Yogyakarta": ["PSIM Yogyakarta", "PSIM"],
  "PSIS Semarang": ["PSIS Semarang", "PSIS"],
  "PSM Makassar": ["PSM Makassar", "PSM"],
  "PSS Sleman": ["PSS Sleman", "PSS"],
  "Semen Padang": ["Semen Padang F.C.", "Semen Padang"],
};

const groupByHeading = [
  ["Goalkeepers", "GK"],
  ["Defenders", "DEF"],
  ["Midfielders", "MID"],
  ["Forwards", "FWD"],
  ["Strikers", "FWD"],
];

const outputDir = "src/data";

const imported = [];
const coverage = [];

for (const season of seasons) {
  for (const team of teamsBySeason[season.label]) {
    const page = await findSeasonPage(season.titlePrefix, team);
    if (!page) {
      coverage.push({ season: season.label, team: normalizeTeamName(team), status: "missing-page", players: 0 });
      continue;
    }

    const wikitext = await fetchWikitext(page);
    const players = parseSquad(wikitext).map((player) => ({
      ...player,
      id: makeId(normalizeTeamName(team), season.label, player.name),
      team: normalizeTeamName(team),
      season: season.label,
      source: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.replaceAll(" ", "_"))}`,
    }));

    imported.push(...players);
    coverage.push({
      season: season.label,
      team: normalizeTeamName(team),
      status: players.length ? "imported" : "no-squad-table",
      page,
      players: players.length,
    });
  }
}

await mkdir(outputDir, { recursive: true });
await writeFile(`${outputDir}/player-seasons.wikipedia.json`, `${JSON.stringify(imported, null, 2)}\n`);
await writeFile(`${outputDir}/roster-coverage.wikipedia.json`, `${JSON.stringify(coverage, null, 2)}\n`);

console.log(`Imported ${imported.length} player seasons from ${coverage.filter((row) => row.status === "imported").length} club-season pages.`);
console.log(`Coverage report written to ${outputDir}/roster-coverage.wikipedia.json`);

async function findSeasonPage(prefix, team) {
  const names = aliases[team] ?? [team];
  for (const name of names) {
    const candidates = [
      `${prefix} ${name} season`,
      `${prefix} ${name.replace("F.C.", "").trim()} season`,
    ];
    for (const candidate of candidates) {
      const found = await pageExists(candidate);
      if (found) return candidate;
    }
  }
  return null;
}

async function pageExists(title) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    titles: title,
    format: "json",
    origin: "*",
  });
  const json = await fetchJson(url);
  const pages = Object.values(json.query.pages);
  return pages.some((page) => !page.missing) ? title : null;
}

async function fetchWikitext(page) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "parse",
    page,
    prop: "wikitext",
    format: "json",
    origin: "*",
  });
  const json = await fetchJson(url);
  return json.parse?.wikitext?.["*"] ?? "";
}

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    await sleep(350 * attempt);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "34-0-draft-data-importer/0.1 (local development)",
      },
    });
    if (response.ok) return response.json();
    if (response.status !== 429 || attempt === 5) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    await sleep(1200 * attempt);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseSquad(wikitext) {
  const squadStart = findSectionStart(wikitext, ["== Squad ==", "== Current squad ==", "== First team squad ==", "=== First team squad ==="]);
  if (squadStart < 0) return [];
  const nextSection = wikitext.indexOf("\n==", squadStart + 4);
  const section = wikitext.slice(squadStart, nextSection > squadStart ? nextSection : undefined);
  const rows = section.split(/\n\|-\n/g);
  const roster = [];
  let group = null;

  for (const row of rows) {
    const heading = groupByHeading.find(([label]) => row.includes(label));
    if (heading) {
      group = heading[1];
      continue;
    }
    if (!group || !row.includes("|")) continue;
    const cells = row
      .split(/\n\|/g)
      .map((cell) => cleanCell(cell))
      .filter(Boolean);
    if (cells.length < 2) continue;
    const name = extractName(cells[1]);
    if (!name || name.length < 2 || /name|nat\.|date of birth/i.test(name)) continue;
    roster.push({
      name,
      group,
      attack: baseline(group, "attack"),
      defense: baseline(group, "defense"),
      creative: baseline(group, "creative"),
      stamina: baseline(group, "stamina"),
    });
  }

  return uniqueByName(roster);
}

function findSectionStart(text, headings) {
  return headings.reduce((found, heading) => {
    const index = text.indexOf(heading);
    if (index >= 0 && (found < 0 || index < found)) return index;
    return found;
  }, -1);
}

function cleanCell(cell) {
  return cell
    .replace(/^\s*!.*?\|\s*/s, "")
    .replace(/^\s*!/s, "")
    .replace(/<ref[\s\S]*?<\/ref>/g, "")
    .replace(/<ref[^>]*\/>/g, "")
    .replace(/\{\{flagicon\|[^}]+\}\}/g, "")
    .replace(/\{\{Abbr\|([^|}]+)[^}]*\}\}/g, "$1")
    .trim();
}

function extractName(cell) {
  const link = cell.match(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/);
  const ill = cell.match(/\{\{ill\|([^|}]+)/);
  return stripMarkup((link?.[1] ?? ill?.[1] ?? cell).split("\n")[0]);
}

function stripMarkup(value) {
  return value
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\[\[|\]\]/g, "")
    .replace(/''/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function baseline(group, stat) {
  const table = {
    GK: { attack: 14, defense: 72, creative: 42, stamina: 72 },
    DEF: { attack: 42, defense: 72, creative: 55, stamina: 74 },
    MID: { attack: 62, defense: 62, creative: 72, stamina: 76 },
    FWD: { attack: 72, defense: 42, creative: 64, stamina: 74 },
  };
  return table[group][stat];
}

function normalizeTeamName(team) {
  return team
    .replace("Persib Bandung", "Persib")
    .replace("Persija Jakarta", "Persija")
    .replace("Persebaya Surabaya", "Persebaya")
    .replace("Persik Kediri", "Persik")
    .replace("Persis Solo", "Persis")
    .replace("Persita Tangerang", "Persita")
    .replace("PSIS Semarang", "PSIS")
    .replace("PSM Makassar", "PSM")
    .replace("PSS Sleman", "PSS")
    .replace("Semen Padang F.C.", "Semen Padang")
    .replace("Borneo F.C.", "Borneo Samarinda")
    .replace("Borneo", "Borneo Samarinda")
    .replace("Bhayangkara F.C.", "Bhayangkara Presisi")
    .replace("Bhayangkara", "Bhayangkara Presisi");
}

function makeId(team, season, name) {
  return `${team}-${season}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function uniqueByName(items) {
  return items.filter((item, index) => items.findIndex((other) => other.name === item.name) === index);
}
