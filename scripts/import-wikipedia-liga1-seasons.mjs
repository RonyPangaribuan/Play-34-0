import { mkdir, writeFile } from "node:fs/promises";

const categoryTitle = "Category:Indonesian football club seasons by year";
const categorySource = "https://en.wikipedia.org/wiki/Category:Indonesian_football_club_seasons_by_year";
const outputPath = "src/data/player-seasons.wikipedia.liga1.json";
const reportPath = "src/data/wikipedia-import-report-liga1.json";
const apiBase = "https://en.wikipedia.org/w/api.php";

// Matches the current in-game seasonTeams list. Do not import clubs outside the competition season.
const teamsBySeason = {
  "2017": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Madura United", "Mitra Kukar", "Persegres", "Persela", "Perseru", "Persib", "Persiba Balikpapan", "Persija", "Persipura Jayapura", "PS TNI", "PSM", "Semen Padang", "Sriwijaya FC"],
  "2018": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Madura United", "Mitra Kukar", "Persebaya", "Persela", "Perseru", "Persib", "Persija", "Persipura Jayapura", "PS TIRA", "PSIS", "PSM", "PSMS Medan", "Sriwijaya FC"],
  "2019": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Kalteng Putra", "Madura United", "Persebaya", "Persela", "Perseru Badak Lampung", "Persib", "Persija", "Persipura Jayapura", "PSS", "PSIS", "PSM", "Semen Padang", "Tira Persikabo"],
  "2020": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Madura United", "Persebaya", "Persela", "Persib", "Persija", "Persik", "Persipura Jayapura", "Persiraja Banda Aceh", "Persita", "PSM", "PSS", "PSIS", "Tira Persikabo"],
  "2021/22": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Madura United", "Persebaya", "Persela", "Persib", "Persija", "Persik", "Persipura Jayapura", "Persiraja Banda Aceh", "Persita", "PSM", "PSS", "PSIS", "Tira Persikabo"],
  "2022/23": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Dewa United", "Madura United", "Persebaya", "Persib", "Persija", "Persik", "Persis", "Persita", "PSM", "PSS", "PSIS", "RANS Nusantara", "Tira Persikabo"],
  "2023/24": ["Arema", "Bali United", "Barito Putera", "Bhayangkara Presisi", "Borneo Samarinda", "Dewa United", "Madura United", "Persebaya", "Persib", "Persija", "Persik", "Persis", "Persita", "Persikabo 1973", "PSM", "PSS", "PSIS", "RANS Nusantara"],
  "2024/25": ["Arema", "Bali United", "Barito Putera", "Borneo Samarinda", "Dewa United", "Madura United", "Malut United", "Persebaya", "Persib", "Persija", "Persik", "Persis", "Persita", "PSBS", "PSIS", "PSM", "PSS", "Semen Padang"],
  "2025/26": ["Arema", "Bali United", "Bhayangkara Presisi", "Borneo Samarinda", "Dewa United", "Madura United", "Malut United", "Persebaya", "Persib", "Persija", "Persijap", "Persik", "Persis", "Persita", "PSBS", "PSIM", "PSM", "Semen Padang"],
};

const titleAliases = {
  Arema: ["Arema F.C.", "Arema FC", "Arema"],
  "Bali United": ["Bali United F.C.", "Bali United"],
  "Barito Putera": ["PS Barito Putera", "Barito Putera"],
  "Bhayangkara Presisi": ["Bhayangkara F.C.", "Bhayangkara FC", "Bhayangkara Presisi Indonesia F.C.", "Bhayangkara"],
  "Borneo Samarinda": ["Borneo F.C. Samarinda", "Borneo Samarinda F.C.", "Borneo F.C.", "Borneo FC", "Borneo Samarinda", "Pusamania Borneo"],
  "Dewa United": ["Dewa United F.C.", "Dewa United"],
  "Kalteng Putra": ["Kalteng Putra F.C.", "Kalteng Putra"],
  "Madura United": ["Madura United F.C.", "Madura United"],
  "Malut United": ["Malut United F.C.", "Malut United"],
  "Mitra Kukar": ["Mitra Kukar F.C.", "Mitra Kukar"],
  Persebaya: ["Persebaya Surabaya", "Persebaya"],
  Persegres: ["Persegres Gresik United", "Gresik United", "Persegres"],
  Persela: ["Persela Lamongan", "Persela"],
  Perseru: ["Perseru Serui", "Perseru"],
  "Perseru Badak Lampung": ["Badak Lampung F.C.", "Perseru Badak Lampung", "Badak Lampung"],
  Persib: ["Persib Bandung", "Persib"],
  "Persiba Balikpapan": ["Persiba Balikpapan"],
  Persija: ["Persija Jakarta", "Persija"],
  "Persikabo 1973": ["Persikabo 1973", "Tira Persikabo", "PS TIRA"],
  Persijap: ["Persijap Jepara", "Persijap"],
  Persik: ["Persik Kediri", "Persik"],
  Persipura: ["Persipura Jayapura", "Persipura"],
  "Persipura Jayapura": ["Persipura Jayapura", "Persipura"],
  "Persiraja Banda Aceh": ["Persiraja Banda Aceh", "Persiraja"],
  Persis: ["Persis Solo", "Persis"],
  Persita: ["Persita Tangerang", "Persita"],
  PSBS: ["PSBS Biak", "PSBS Biak Numfor", "PSBS"],
  PSIM: ["PSIM Yogyakarta", "PSIM"],
  PSIS: ["PSIS Semarang", "PSIS"],
  "PSM": ["PSM Makassar", "PSM"],
  "PSMS Medan": ["PSMS Medan", "PSMS"],
  PSS: ["PSS Sleman", "PSS"],
  "PS TIRA": ["PS TIRA", "PS TNI", "TIRA-Persikabo"],
  "PS TNI": ["PS TNI", "TNI"],
  "RANS Nusantara": ["RANS Nusantara F.C.", "RANS Nusantara"],
  "Semen Padang": ["Semen Padang F.C.", "Semen Padang"],
  "Sriwijaya FC": ["Sriwijaya F.C.", "Sriwijaya FC", "Sriwijaya"],
  "Tira Persikabo": ["Tira Persikabo", "TIRA-Persikabo", "PS TIRA"],
};

const pageYearPrefixes = {
  "2017": ["2017"],
  "2018": ["2018"],
  "2019": ["2019"],
  "2020": ["2020"],
  "2021/22": ["2021\u201322", "2021-22"],
  "2022/23": ["2022\u201323", "2022-23"],
  "2023/24": ["2023\u201324", "2023-24"],
  "2024/25": ["2024\u201325", "2024-25"],
  "2025/26": ["2025\u201326", "2025-26"],
};

const groupHeadings = [
  { group: "GK", positionDetail: "Goalkeeper", match: /goalkeepers?|penjaga gawang/i },
  { group: "DEF", positionDetail: "Defender", match: /defenders?|bek/i },
  { group: "MID", positionDetail: "Midfielder", match: /midfielders?|gelandang/i },
  { group: "FWD", positionDetail: "Forward", match: /forwards?|strikers?|penyerang/i },
];

const positionPatterns = [
  { group: "GK", match: /^(gk|goalkeeper|keeper)$/i },
  { group: "DEF", match: /^(df|cb|lb|rb|lcb|rcb|defender|centre[- ]back|center[- ]back|left[- ]back|right[- ]back)$/i },
  { group: "MID", match: /^(mf|dm|cm|am|lm|rm|midfielder|defensive midfielder|attacking midfielder|winger)$/i },
  { group: "FWD", match: /^(fw|st|cf|lw|rw|forward|striker)$/i },
];

const categoryPages = await fetchAllCategoryPages();
const pageIndex = buildPageIndex(categoryPages);
const importedPlayers = [];
const report = [];

for (const [season, teams] of Object.entries(teamsBySeason)) {
  for (const team of teams) {
    const match = findPageForTeamSeason(pageIndex, season, team);
    if (!match) {
      report.push({
        season,
        team,
        pageTitle: "",
        sourceUrl: "",
        sourceCategory: categorySource,
        status: "missing",
        players: 0,
        notes: "No matching Wikipedia season page in Indonesian football club seasons category.",
      });
      continue;
    }

    const sourceUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(match.title.replaceAll(" ", "_"))}`;
    try {
      const wikitext = await fetchWikitext(match.title);
      const players = uniquePlayers(parsePlayers(wikitext, { season, team, pageTitle: match.title, sourceUrl }));
      importedPlayers.push(...players);
      report.push({
        season,
        team,
        pageTitle: match.title,
        sourceUrl,
        sourceCategory: match.categoryUrl,
        status: players.length ? "imported" : "needs-review",
        players: players.length,
        notes: players.length ? "Imported from Wikipedia squad section." : "No clear squad/player section found.",
      });
      console.log(`${season} ${team}: ${players.length} players from ${match.title}`);
    } catch (error) {
      report.push({
        season,
        team,
        pageTitle: match.title,
        sourceUrl,
        sourceCategory: match.categoryUrl,
        status: "needs-review",
        players: 0,
        notes: error.message,
      });
      console.warn(`${season} ${team}: ${error.message}`);
    }
    await sleep(1000);
  }
}

const unique = uniquePlayers(importedPlayers);
await mkdir("src/data", { recursive: true });
await writeFile(outputPath, `${JSON.stringify(unique, null, 2)}\n`);
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Imported ${unique.length} verified Liga 1 player seasons.`);
console.log(`Imported pages: ${report.filter((row) => row.status === "imported").length}`);
console.log(`Missing pages: ${report.filter((row) => row.status === "missing").length}`);
console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${reportPath}`);

async function fetchAllCategoryPages() {
  const yearCategories = await fetchYearCategories();
  const pages = [];
  for (const category of yearCategories) {
    let cmcontinue;
    do {
      const url = new URL(apiBase);
      url.search = new URLSearchParams({
        action: "query",
        list: "categorymembers",
        cmtitle: category.title,
        cmlimit: "500",
        format: "json",
        origin: "*",
        ...(cmcontinue ? { cmcontinue } : {}),
      });
      const json = await fetchJson(url);
      pages.push(
        ...(json.query?.categorymembers ?? [])
          .filter((member) => member.ns === 0)
          .map((member) => ({ ...member, categoryTitle: category.title, categoryUrl: category.url })),
      );
      cmcontinue = json.continue?.cmcontinue;
      await sleep(250);
    } while (cmcontinue);
  }
  return pages;
}

async function fetchYearCategories() {
  const members = [];
  let cmcontinue;
  do {
    const url = new URL(apiBase);
    url.search = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: categoryTitle,
      cmlimit: "500",
      format: "json",
      origin: "*",
      ...(cmcontinue ? { cmcontinue } : {}),
    });
    const json = await fetchJson(url);
    members.push(...(json.query?.categorymembers ?? []));
    cmcontinue = json.continue?.cmcontinue;
    await sleep(250);
  } while (cmcontinue);

  const wantedYears = new Set(Object.values(pageYearPrefixes).flat());
  return members
    .filter((member) => member.ns === 14)
    .filter((member) => wantedYears.has(extractYearPrefix(member.title)))
    .map((member) => ({
      title: member.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(member.title.replaceAll(" ", "_"))}`,
    }));
}

function extractYearPrefix(title) {
  const match = title.match(/Category:Indonesian football clubs (\d{4}(?:[\u2013-]\d{2})?) season/);
  return match?.[1] ?? "";
}

function buildPageIndex(pages) {
  return pages.map((page) => ({
    title: page.title,
    normalized: normalizeText(page.title),
    categoryTitle: page.categoryTitle,
    categoryUrl: page.categoryUrl,
  }));
}

function findPageForTeamSeason(pageIndex, season, team) {
  const prefixes = pageYearPrefixes[season] ?? [];
  const aliases = titleAliases[team] ?? [team];
  const candidates = [];

  for (const prefix of prefixes) {
    for (const alias of aliases) {
      candidates.push(`${prefix} ${alias} season`);
    }
  }

  const normalizedCandidates = candidates.map(normalizeText);
  return pageIndex.find((page) => normalizedCandidates.includes(page.normalized)) ?? null;
}

async function fetchWikitext(pageTitle) {
  const url = new URL(apiBase);
  url.search = new URLSearchParams({
    action: "parse",
    page: pageTitle,
    prop: "wikitext",
    format: "json",
    origin: "*",
  });
  const json = await fetchJson(url);
  return json.parse?.wikitext?.["*"] ?? "";
}

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "34-0-app-liga1-wikipedia-import/0.1 (fan-made verified data import)",
        },
      });
      if (response.ok) return response.json();
      if (response.status !== 429 || attempt === 5) throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (attempt === 5) throw new Error(`Wikipedia request failed for ${url}: ${error.message}`);
    }
    await sleep(3000 * attempt);
  }
  return {};
}

function parsePlayers(wikitext, context) {
  const sections = findSquadSections(wikitext);
  const parsed = [];
  for (const section of sections) {
    parsed.push(...parseSquadTemplates(section, context));
    parsed.push(...parseSquadTables(section, context));
  }
  return parsed;
}

function findSquadSections(wikitext) {
  const squadSections = findSections(wikitext, /squad|first[- ]team|skuad/i);
  return squadSections.length ? squadSections : findSections(wikitext, /players|pemain/i);
}

function findSections(wikitext, titlePattern) {
  const headings = [...wikitext.matchAll(/^(={2,6})\s*(.*?)\s*\1\s*$/gm)];
  const sections = [];
  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    const title = heading[2].trim();
    const level = heading[1].length;
    if (!titlePattern.test(title)) continue;
    const start = heading.index + heading[0].length;
    let end = wikitext.length;
    for (let next = index + 1; next < headings.length; next += 1) {
      if (headings[next][1].length <= level) {
        end = headings[next].index;
        break;
      }
    }
    sections.push(wikitext.slice(start, end));
  }
  return sections;
}

function parseSquadTemplates(section, context) {
  const templates = section.match(/\{\{(?:Fs player|Football squad player|football squad player|Nat fs player)[\s\S]*?\}\}/gi) ?? [];
  return templates
    .map((template) => {
      const fields = parseTemplateFields(template);
      const name = cleanName(fields.name ?? fields.player ?? fields[3] ?? "");
      const position = normalizePosition(fields.pos ?? fields.position ?? fields[2] ?? "");
      const nationality = cleanNationality(fields.nat ?? fields.nationality ?? "");
      if (!isLikelyPlayerName(name)) return null;
      return makePlayer({ name, position, nationality, context });
    })
    .filter(Boolean);
}

function parseSquadTables(section, context) {
  const blocks = section.split(/\n\|-\n/g);
  const parsed = [];
  let currentPosition = null;

  for (const block of blocks) {
    const heading = groupHeadings.find((item) => item.match.test(stripMarkup(block)));
    if (heading) {
      currentPosition = { group: heading.group, raw: heading.positionDetail, reviewStatus: "reviewed" };
      continue;
    }

    if (!block.includes("[[")) continue;
    const cells = block.split(/\n[|!]/g).map(cleanCell).filter(Boolean);
    const position = cells.map(normalizePosition).find((item) => item.reviewStatus === "reviewed") ?? currentPosition ?? normalizePosition("");
    const name = findPlayerName(cells);
    if (!isLikelyPlayerName(name)) continue;
    const nationality = cells.map(cleanNationality).find(Boolean) ?? "";
    parsed.push(makePlayer({ name, position, nationality, context }));
  }

  return parsed;
}

function makePlayer({ name, position, nationality, context }) {
  const stats = baseline(position.group, `${context.team}-${context.season}-${name}`);
  return {
    id: makeId(context.team, context.season, name),
    name,
    team: context.team,
    season: context.season,
    group: position.group,
    positionDetail: position.raw,
    nationality,
    attack: stats.attack,
    defense: stats.defense,
    creative: stats.creative,
    stamina: stats.stamina,
    dataStatus: "verified",
    reviewStatus: position.reviewStatus,
    source: context.sourceUrl,
    sourceTitle: context.pageTitle,
    note: position.reviewStatus === "reviewed" ? "Imported from Wikipedia squad table" : "position needs review",
  };
}

function parseTemplateFields(template) {
  const inner = template.replace(/^\{\{|\}\}$/g, "");
  const parts = inner.split("|").map((part) => part.trim());
  const fields = {};
  for (let index = 1; index < parts.length; index += 1) {
    const part = parts[index];
    const equalIndex = part.indexOf("=");
    if (equalIndex >= 0) fields[part.slice(0, equalIndex).trim().toLowerCase()] = part.slice(equalIndex + 1).trim();
    else fields[index] = part;
  }
  return fields;
}

function findPlayerName(cells) {
  for (const cell of cells) {
    const name = cleanName(cell);
    if (isLikelyPlayerName(name)) return name;
  }
  return "";
}

function cleanCell(cell) {
  return cell
    .replace(/^\s*(?:rowspan|colspan)\s*=\s*["']?\d+["']?\s*\|/i, "")
    .replace(/<ref[\s\S]*?<\/ref>/g, "")
    .replace(/<ref[^>]*\/>/g, "")
    .trim();
}

function cleanName(value) {
  const link = value.match(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/);
  const ill = value.match(/\{\{ill\|([^|}]+)/);
  return stripMarkup(link?.[1] ?? ill?.[1] ?? value)
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/^\d+\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanNationality(value) {
  const flag = value.match(/\{\{(?:flagicon|flag|fb|nat)\|([^|}]+)/i);
  if (!flag) return "";
  const code = flag[1].trim().toUpperCase();
  const map = {
    IDN: "Indonesia",
    INA: "Indonesia",
    BRA: "Brazil",
    GHA: "Ghana",
    MNE: "Montenegro",
    AUS: "Australia",
    JPN: "Japan",
    TCD: "Chad",
    NED: "Netherlands",
    ESP: "Spain",
    PHI: "Philippines",
    ARG: "Argentina",
    SWE: "Sweden",
    ITA: "Italy",
    FRA: "France",
    NGA: "Nigeria",
    SRB: "Serbia",
    CRO: "Croatia",
    KOR: "South Korea",
  };
  return map[code] ?? stripMarkup(flag[1]);
}

function normalizePosition(value) {
  const abbr = value.match(/\{\{Abbr\|([^|}]+)/i);
  const raw = stripMarkup(abbr?.[1] ?? value).trim();
  const normalized = raw.toLowerCase().replace(/\s+/g, " ");
  const found = positionPatterns.find((item) => item.match.test(normalized));
  if (found) return { raw, group: found.group, reviewStatus: "reviewed" };
  return { raw: "", group: "MID", reviewStatus: "needs-review" };
}

function stripMarkup(value) {
  return value
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\[\[|\]\]/g, "")
    .replace(/''/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isLikelyPlayerName(name) {
  if (!name || name.length < 3) return false;
  if (/^(no|name|nat|date|signed|contract|from|fee|notes|goalkeepers?|defenders?|midfielders?|forwards?)$/i.test(name)) return false;
  if (/indonesia|stadium|league|season|source|updated|coach|manager|captain|president|owner|eligibility|rules|players may hold/i.test(name)) return false;
  return /[A-Za-z]/.test(name);
}

function baseline(group, seed) {
  const offset = stableNumber(seed) % 9;
  const ranges = {
    GK: { attack: [15, 25], defense: [72, 82], creative: [40, 55], stamina: [68, 78] },
    DEF: { attack: [35, 55], defense: [68, 82], creative: [45, 65], stamina: [68, 80] },
    MID: { attack: [55, 72], defense: [50, 70], creative: [68, 82], stamina: [70, 82] },
    FWD: { attack: [70, 84], defense: [35, 55], creative: [55, 75], stamina: [68, 80] },
  };
  const range = ranges[group];
  return {
    attack: within(range.attack, offset),
    defense: within(range.defense, offset + 3),
    creative: within(range.creative, offset + 5),
    stamina: within(range.stamina, offset + 7),
  };
}

function within([min, max], offset) {
  return min + (offset % (max - min + 1));
}

function makeId(team, season, name) {
  return `${team}-${season}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function uniquePlayers(items) {
  const map = new Map();
  for (const item of items) {
    map.set(`${item.team}|${item.season}|${item.name}`, item);
  }
  return [...map.values()];
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/\u2013/g, "-")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stableNumber(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
