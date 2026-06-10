const formations = {
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

const seasons = ["2017", "2018", "2019", "2020", "2021/22", "2022/23", "2023/24", "2024/25", "2025/26"];

const seasonTeams = {
  "2017": [
    "Arema",
    "Bali United",
    "Barito Putera",
    "Bhayangkara Presisi",
    "Borneo Samarinda",
    "Gresik United",
    "Madura United",
    "Mitra Kukar",
    "Persela",
    "Perseru",
    "Persib",
    "Persiba Balikpapan",
    "Persija",
    "Persipura",
    "PSM",
    "PS TNI",
    "Semen Padang",
    "Sriwijaya FC",
  ],
  "2018": [
    "Arema",
    "Bali United",
    "Barito Putera",
    "Bhayangkara Presisi",
    "Borneo Samarinda",
    "Madura United",
    "Mitra Kukar",
    "Persebaya",
    "Persela",
    "Perseru",
    "Persib",
    "Persija",
    "Persipura",
    "PS TIRA",
    "PSIS",
    "PSM",
    "PSMS",
    "Sriwijaya FC",
  ],
  "2019": [
    "Arema",
    "Bali United",
    "Barito Putera",
    "Bhayangkara Presisi",
    "Borneo Samarinda",
    "Kalteng Putra",
    "Madura United",
    "Persebaya",
    "Persela",
    "Perseru Badak Lampung",
    "Persib",
    "Persija",
    "Persipura",
    "PSS",
    "PSIS",
    "PSM",
    "Semen Padang",
    "Tira Persikabo",
  ],
  "2020": [
    "Arema",
    "Bali United",
    "Barito Putera",
    "Bhayangkara Presisi",
    "Borneo Samarinda",
    "Madura United",
    "Persebaya",
    "Persela",
    "Persib",
    "Persija",
    "Persik",
    "Persipura",
    "Persiraja",
    "Persita",
    "PSM",
    "PSS",
    "PSIS",
    "Tira Persikabo",
  ],
  "2021/22": [
    "Arema",
    "Bali United",
    "Barito Putera",
    "Bhayangkara Presisi",
    "Borneo Samarinda",
    "Madura United",
    "Persebaya",
    "Persela",
    "Persib",
    "Persija",
    "Persik",
    "Persipura",
    "Persiraja",
    "Persita",
    "PSM",
    "PSS",
    "PSIS",
    "Tira Persikabo",
  ],
  "2022/23": [
    "Arema",
    "Bali United",
    "Barito Putera",
    "Bhayangkara Presisi",
    "Borneo Samarinda",
    "Dewa United",
    "Madura United",
    "Persebaya",
    "Persib",
    "Persija",
    "Persik",
    "Persis",
    "Persita",
    "PSM",
    "PSS",
    "PSIS",
    "RANS Nusantara",
    "Tira Persikabo",
  ],
  "2023/24": [
    "Arema",
    "Bali United",
    "Barito Putera",
    "Bhayangkara Presisi",
    "Borneo Samarinda",
    "Dewa United",
    "Madura United",
    "Persebaya",
    "Persib",
    "Persija",
    "Persik",
    "Persis",
    "Persita",
    "Persikabo 1973",
    "PSM",
    "PSS",
    "PSIS",
    "RANS Nusantara",
  ],
  "2024/25": [
    "Arema",
    "Bali United",
    "Barito Putera",
    "Borneo Samarinda",
    "Dewa United",
    "Madura United",
    "Malut United",
    "Persebaya",
    "Persib",
    "Persija",
    "Persik",
    "Persis",
    "Persita",
    "PSBS",
    "PSIS",
    "PSM",
    "PSS",
    "Semen Padang",
  ],
  "2025/26": [
    "Arema",
    "Bali United",
    "Bhayangkara Presisi",
    "Borneo Samarinda",
    "Dewa United",
    "Madura United",
    "Malut United",
    "Persebaya",
    "Persib",
    "Persija",
    "Persijap",
    "Persik",
    "Persis",
    "Persita",
    "PSBS",
    "PSIM",
    "PSM",
    "Semen Padang",
  ],
};

const liga1Teams2026 = [
  "Arema",
  "Bali United",
  "Bhayangkara Presisi",
  "Borneo Samarinda",
  "Dewa United",
  "Madura United",
  "Malut United",
  "Persebaya",
  "Persib",
  "Persija",
  "Persijap",
  "Persik",
  "Persis",
  "Persita",
  "PSBS",
  "PSM",
  "PSIM",
  "Semen Padang",
];

const teamPower2026 = {
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

const players = [
  p("Teja Paku Alam", "Persib", "2021/22", "GK", 18, 82, 44, 78),
  p("Nick Kuipers", "Persib", "2025/26", "DEF", 42, 86, 55, 81),
  p("Marc Klok", "Persib", "2023/24", "MID", 74, 69, 84, 83),
  p("Ciro Alves", "Persib", "2024/25", "FWD", 88, 43, 80, 79),
  p("David da Silva", "Persib", "2023/24", "FWD", 91, 40, 70, 76),
  p("Febri Hariyadi", "Persib", "2018", "FWD", 79, 48, 76, 88),
  p("I Made Wirawan", "Persib", "2017", "GK", 14, 78, 42, 74),
  p("Andritany Ardhiyasa", "Persija", "2018", "GK", 15, 85, 48, 80),
  p("Rizky Ridho", "Persija", "2025/26", "DEF", 48, 87, 62, 84),
  p("Riko Simanjuntak", "Persija", "2019", "FWD", 79, 45, 83, 82),
  p("Witan Sulaeman", "Persija", "2025/26", "FWD", 81, 51, 82, 84),
  p("Gustavo Almeida", "Persija", "2024/25", "FWD", 89, 42, 69, 75),
  p("Marko Simic", "Persija", "2018", "FWD", 90, 38, 66, 75),
  p("Maman Abdurrahman", "Persija", "2018", "DEF", 38, 82, 54, 73),
  p("Nadeo Argawinata", "Borneo Samarinda", "2024/25", "GK", 19, 83, 52, 82),
  p("Stefano Lilipaly", "Borneo Samarinda", "2022/23", "MID", 82, 54, 88, 78),
  p("Terens Puhiri", "Borneo Samarinda", "2023/24", "FWD", 80, 48, 75, 90),
  p("Kei Hirose", "Borneo Samarinda", "2024/25", "MID", 69, 72, 81, 84),
  p("Mariano Peralta", "Borneo Samarinda", "2025/26", "FWD", 84, 44, 78, 82),
  p("Javlon Guseynov", "Borneo Samarinda", "2019", "DEF", 43, 83, 55, 75),
  p("Adilson Maringa", "Bali United", "2023/24", "GK", 18, 82, 45, 77),
  p("Ricky Fajrin", "Bali United", "2019", "DEF", 47, 83, 60, 80),
  p("Eber Bessa", "Bali United", "2021/22", "MID", 75, 58, 86, 77),
  p("Ilija Spasojevic", "Bali United", "2019", "FWD", 88, 45, 68, 70),
  p("Privat Mbarga", "Bali United", "2023/24", "FWD", 84, 47, 79, 88),
  p("Brwa Nouri", "Bali United", "2019", "MID", 70, 74, 82, 78),
  p("Ernando Ari", "Persebaya", "2023/24", "GK", 18, 80, 50, 84),
  p("Reva Adi", "Persebaya", "2023/24", "DEF", 45, 79, 62, 81),
  p("Ze Valente", "Persebaya", "2022/23", "MID", 74, 52, 87, 76),
  p("Bruno Moreira", "Persebaya", "2025/26", "FWD", 85, 44, 82, 83),
  p("Francisco Rivera", "Persebaya", "2024/25", "MID", 76, 55, 86, 78),
  p("Hansamu Yama", "Persebaya", "2018", "DEF", 41, 82, 55, 77),
  p("Hilmansyah", "PSM", "2025/26", "GK", 16, 78, 43, 77),
  p("Yuran Fernandes", "PSM", "2022/23", "DEF", 50, 86, 58, 79),
  p("Rizky Eka", "PSM", "2025/26", "FWD", 79, 50, 76, 84),
  p("Yakob Sayuri", "PSM", "2022/23", "FWD", 82, 54, 79, 88),
  p("Wiljan Pluim", "PSM", "2018", "MID", 80, 58, 91, 73),
  p("Rasyid Bakri", "PSM", "2017", "MID", 66, 70, 76, 78),
  p("Lucas Frigeri", "Arema", "2025/26", "GK", 14, 79, 44, 76),
  p("Johan Ahmat Farizi", "Arema", "2019", "DEF", 49, 82, 64, 79),
  p("Arkhan Fikri", "Arema", "2025/26", "MID", 70, 65, 82, 86),
  p("Dalberto", "Arema", "2025/26", "FWD", 84, 45, 72, 79),
  p("Dedik Setiawan", "Arema", "2021/22", "FWD", 81, 48, 72, 78),
  p("Arthur Cunha", "Arema", "2018", "DEF", 43, 83, 57, 75),
  p("Sonny Stevens", "Dewa United", "2024/25", "GK", 17, 82, 51, 77),
  p("Nick Kuipers", "Dewa United", "2025/26", "DEF", 41, 84, 55, 78),
  p("Alexis Messidoro", "Dewa United", "2025/26", "MID", 78, 54, 89, 76),
  p("Taisei Marukawa", "Dewa United", "2024/25", "FWD", 83, 50, 84, 84),
  p("Egy Maulana Vikri", "Dewa United", "2023/24", "FWD", 80, 49, 82, 83),
  p("Rangga Muslim", "Dewa United", "2022/23", "MID", 67, 62, 76, 79),
  p("Muhammad Riyandi", "Persis", "2022/23", "GK", 15, 77, 47, 79),
  p("Jaimerson Xavier", "Persis", "2023/24", "DEF", 44, 81, 54, 75),
  p("Sho Yamamoto", "Persis", "2025/26", "FWD", 82, 48, 81, 83),
  p("Sutanto Tan", "Persis", "2024/25", "MID", 68, 68, 76, 79),
  p("Kodai Tanaka", "Persis", "2025/26", "MID", 73, 56, 83, 80),
  p("Fabiano Beltrame", "Persis", "2022/23", "DEF", 40, 80, 54, 71),
  p("Igor Rodrigues", "Persita", "2025/26", "GK", 14, 78, 41, 75),
  p("Javlon Guseynov", "Persita", "2021/22", "DEF", 43, 82, 54, 74),
  p("Esal Sahrul", "Persita", "2024/25", "FWD", 78, 47, 76, 85),
  p("Hokky Caraka", "Persita", "2025/26", "FWD", 79, 43, 70, 82),
  p("Pablo Ganet", "Persita", "2025/26", "MID", 69, 72, 78, 78),
  p("Ezequiel Vidal", "Persita", "2022/23", "MID", 74, 55, 83, 76),
  p("Ciro Alves", "Malut United", "2025/26", "FWD", 86, 42, 80, 77),
  p("David da Silva", "Malut United", "2025/26", "FWD", 89, 40, 69, 74),
  p("Hendri Susilo", "Malut United", "2025/26", "MID", 67, 68, 78, 80),
  p("Tyronne del Pino", "Malut United", "2025/26", "MID", 76, 53, 86, 75),
  p("Gustavo Franca", "Malut United", "2025/26", "DEF", 46, 81, 57, 78),
  p("Cahya Supriadi", "PSIM", "2025/26", "GK", 13, 77, 46, 82),
  p("Raka Cahyana", "PSIM", "2025/26", "DEF", 47, 76, 65, 84),
  p("Jean-Paul van Gastel", "PSIM", "2025/26", "MID", 71, 66, 82, 79),
  p("Witan Sulaeman", "PSIM", "2024/25", "FWD", 80, 50, 81, 84),
  p("Yevhen Bokhashvili", "PSIM", "2025/26", "FWD", 82, 43, 68, 73),
  p("Dikri Yusron", "Persik", "2023/24", "GK", 12, 76, 42, 76),
  p("Arthur Felix", "Persik", "2023/24", "DEF", 43, 79, 55, 75),
  p("Zehir Mustafic", "Persik", "2024/25", "MID", 70, 65, 78, 80),
  p("Flavio Silva", "Persik", "2023/24", "FWD", 84, 42, 70, 77),
  p("Ezra Walian", "Persik", "2025/26", "FWD", 80, 46, 75, 78),
  p("Koko Ari", "Madura United", "2023/24", "DEF", 48, 78, 64, 82),
  p("Lulinha", "Madura United", "2025/26", "FWD", 82, 43, 79, 76),
  p("Jordy Wehrmann", "Madura United", "2025/26", "MID", 72, 64, 82, 79),
  p("Junior Brandao", "Madura United", "2023/24", "FWD", 84, 41, 68, 73),
  p("Awan Setho", "Bhayangkara Presisi", "2017", "GK", 13, 80, 44, 76),
  p("Sani Rizki", "Bhayangkara Presisi", "2025/26", "MID", 68, 68, 77, 83),
  p("Privat Mbarga", "Bhayangkara Presisi", "2025/26", "FWD", 84, 47, 78, 87),
  p("Anderson Salles", "Bhayangkara Presisi", "2019", "DEF", 48, 81, 59, 73),
  p("Rodrigo Moura", "Persijap", "2025/26", "FWD", 81, 42, 70, 75),
  p("Borja Herrera", "Persijap", "2025/26", "MID", 72, 60, 82, 77),
  p("Tiri", "Persijap", "2025/26", "DEF", 41, 80, 54, 74),
  p("Ruyery Blanco", "PSBS", "2025/26", "FWD", 78, 42, 73, 79),
  p("Divaldo Alves", "PSBS", "2025/26", "MID", 68, 62, 77, 76),
  p("Muhammad Tahir", "PSBS", "2024/25", "DEF", 40, 76, 55, 78),
  p("Vendry Mofu", "Semen Padang", "2017", "MID", 70, 61, 78, 76),
  p("Arthur", "Semen Padang", "2025/26", "GK", 12, 75, 40, 74),
  p("Irsyad Maulana", "Semen Padang", "2019", "FWD", 76, 45, 75, 82),
  p("Yevhen Bokhashvili", "PSS", "2019", "FWD", 83, 41, 67, 73),
  p("Kim Jeffrey Kurniawan", "PSS", "2021/22", "MID", 66, 70, 76, 77),
  p("Bagus Nirwanto", "PSS", "2019", "DEF", 43, 78, 58, 80),
  p("Rizky Pora", "Barito Putera", "2017", "MID", 73, 58, 82, 80),
  p("Bagas Kaffa", "Barito Putera", "2021/22", "DEF", 45, 77, 60, 83),
  p("Murilo Mendes", "Barito Putera", "2023/24", "FWD", 82, 43, 72, 76),
  p("Wallace Costa", "PSIS", "2019", "DEF", 42, 82, 55, 74),
  p("Septian David", "PSIS", "2021/22", "MID", 74, 55, 83, 78),
  p("Carlos Fortes", "PSIS", "2022/23", "FWD", 84, 42, 70, 74),
  p("Ciro Alves", "Tira Persikabo", "2019", "FWD", 86, 42, 80, 78),
  p("Manahati Lestusen", "Tira Persikabo", "2019", "DEF", 42, 80, 59, 77),
  p("Wawan Febrianto", "Tira Persikabo", "2019", "MID", 72, 57, 79, 80),
  p("Alberto Goncalves", "Sriwijaya FC", "2017", "FWD", 86, 39, 69, 71),
  p("Zalnando", "Sriwijaya FC", "2018", "DEF", 45, 77, 62, 81),
  p("Makan Konate", "Sriwijaya FC", "2018", "MID", 78, 56, 88, 76),
  p("Silvio Escobar", "Perseru", "2017", "FWD", 78, 42, 68, 76),
  p("Arthur Bonai", "Perseru", "2017", "MID", 68, 67, 76, 78),
  p("Boman Aimanda", "Perseru", "2017", "DEF", 39, 76, 52, 75),
];

const state = {
  formationKey: "",
  positions: [],
  pick: 0,
  mode: "normal",
  spinRule: "position",
  lineup: {},
  currentSlot: null,
  currentChoices: [],
  revealedFinalRating: false,
};

const formationEl = document.querySelector("#formation");
const choicesEl = document.querySelector("#choices");
const reelEl = document.querySelector("#reel");
const spinButton = document.querySelector("#spinButton");
const simulateButton = document.querySelector("#simulateButton");
const roundLabel = document.querySelector("#roundLabel");
const ratingLabel = document.querySelector("#ratingLabel");
const positionBadge = document.querySelector("#positionBadge");
const attackMetric = document.querySelector("#attackMetric");
const defenseMetric = document.querySelector("#defenseMetric");
const creativeMetric = document.querySelector("#creativeMetric");
const chemMetric = document.querySelector("#chemMetric");
const resultBox = document.querySelector("#resultBox");
const formationSelect = document.querySelector("#formationSelect");

function slot(id, label, x, y, group) {
  return { id, label, x, y, group };
}

function p(name, team, season, group, attack, defense, creative, stamina) {
  return { name, team, season, group, attack, defense, creative, stamina };
}

function init() {
  renderFormation();
  updateMetrics();
  bindEvents();
}

function bindEvents() {
  spinButton.addEventListener("click", spinSlot);
  simulateButton.addEventListener("click", simulateSeason);
  formationSelect.addEventListener("change", () => selectFormation(formationSelect.value));

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      document.querySelectorAll(".mode-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      updateMetrics();
      renderChoices();
    });
  });

  document.querySelectorAll(".spin-rule-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.spinRule = button.dataset.spinRule;
      document.querySelectorAll(".spin-rule-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      if (state.formationKey && state.pick < state.positions.length && !state.currentChoices.length) {
        positionBadge.textContent = state.spinRule === "team" ? "TIM" : cleanPosition(getNextPosition().id);
      }
      setReadyMessage();
    });
  });
}

function selectFormation(key) {
  state.formationKey = key;
  state.positions = key ? formations[key] : [];
  resetDraft();
  spinButton.disabled = !key;
  if (key) {
    roundLabel.textContent = "Pick 1/11";
    positionBadge.textContent = "XI";
    setReadyMessage();
  } else {
    roundLabel.textContent = "Pilih formasi";
    positionBadge.textContent = "SET";
    reelEl.innerHTML = `<span>Pilih formasi untuk mulai</span>`;
    choicesEl.innerHTML = `<div class="empty-state">Formasi wajib dipilih sebelum spin.</div>`;
  }
}

function resetDraft() {
  state.pick = 0;
  state.lineup = {};
  state.currentSlot = null;
  state.currentChoices = [];
  state.revealedFinalRating = false;
  simulateButton.disabled = true;
  renderFormation();
  updateMetrics();
  resultBox.innerHTML = `
    <p class="eyebrow">Hasil musim</p>
    <div class="empty-state compact">Draft 11 pemain untuk membuka simulasi.</div>
  `;
}

function setReadyMessage() {
  if (!state.formationKey || state.currentChoices.length) return;
  const label = state.spinRule === "position" ? "posisi kosong + klub + musim" : "klub + musim";
  reelEl.innerHTML = `<span>Spin berdasarkan ${label}</span>`;
  choicesEl.innerHTML = `<div class="empty-state">Wheel mengambil klub Liga 1 dan musim 2017-2026. Pilih pemain setelah spin berhenti.</div>`;
}

function renderFormation() {
  if (!state.positions.length) {
    formationEl.innerHTML = `<div class="pitch-placeholder">Pilih formasi</div>`;
    return;
  }

  formationEl.innerHTML = state.positions
    .map((position, index) => {
      const drafted = state.lineup[position.id];
      return `
        <div class="shirt-slot" style="left:${position.x}%; top:${position.y}%">
          <div class="shirt ${drafted ? "" : "empty"}">${cleanPosition(position.id)}</div>
          <span class="slot-name">${drafted ? drafted.name : position.label}</span>
          <span class="slot-team">${drafted ? `${drafted.team} | ${drafted.season}` : `Pick ${index + 1}`}</span>
        </div>
      `;
    })
    .join("");
}

function spinSlot() {
  if (!state.formationKey || state.pick >= state.positions.length) return;
  const target = getSpinTarget();
  const finalSpin = randomSpinOutcome(target);
  positionBadge.textContent = state.spinRule === "team" ? "TIM" : cleanPosition(target.id);
  reelEl.classList.add("spinning");
  spinButton.disabled = true;

  let ticks = 0;
  const ticker = window.setInterval(() => {
    const preview = randomSpinOutcome(target);
    const spinLabel = state.spinRule === "position" ? target.label : "Semua posisi";
    reelEl.innerHTML = `<span>${preview.team}<br>${preview.season}<br>${spinLabel}</span>`;
    ticks += 1;
    if (ticks >= 12) {
      window.clearInterval(ticker);
      openSlot(target, finalSpin);
    }
  }, 80);
}

function getSpinTarget() {
  const emptyPositions = state.positions.filter((position) => !state.lineup[position.id]);
  return state.spinRule === "position" ? randomItem(emptyPositions) : emptyPositions[0];
}

function randomSpinOutcome(target) {
  const candidates = seasons.flatMap((season) =>
    seasonTeams[season]
      .filter((team) => hasExactCandidate(team, season, target))
      .map((team) => ({ team, season })),
  );
  return randomItem(candidates.length ? candidates : fallbackSpinOutcomes());
}

function hasExactCandidate(team, season, target) {
  const openGroups = getOpenGroups();
  return players.some((player) => {
    const fitsRule = state.spinRule === "team" ? openGroups.has(player.group) : player.group === target.group;
    return player.team === team && player.season === season && fitsRule && !isDrafted(player);
  });
}

function fallbackSpinOutcomes() {
  return players
    .filter((player) => !isDrafted(player))
    .map((player) => ({ team: player.team, season: player.season }))
    .filter(uniqueSpinOutcome);
}

function openSlot(target, spin) {
  const team = spin.team;
  const season = spin.season;
  state.currentSlot = state.spinRule === "team" ? { team, season, group: null, id: null } : { ...target, team, season };
  state.currentChoices = buildChoices(target, team, season);
  reelEl.classList.remove("spinning");
  const slotLabel = state.spinRule === "team" ? "Semua posisi" : target.label;
  reelEl.innerHTML = `<span>${team}<br>${season}<br>${slotLabel}</span>`;
  renderChoices();
}

function buildChoices(target, team, season) {
  const draftedNames = new Set(Object.values(state.lineup).map((player) => player.name));
  const openGroups = getOpenGroups();
  const eligible = (player) => {
    const fitsOpenSlot = state.spinRule === "team" ? openGroups.has(player.group) : player.group === target.group;
    return fitsOpenSlot && !draftedNames.has(player.name);
  };
  const strict = players.filter((player) => eligible(player) && player.team === team && player.season === season);
  if (strict.length) {
    return sortRoster(strict).filter(uniquePlayer);
  }

  const sameTeam = players.filter((player) => eligible(player) && player.team === team);
  const sameSeason = players.filter((player) => eligible(player) && player.season === season);
  const fallback = players.filter((player) => eligible(player) && seasonTeams[season].includes(player.team));
  const ranked =
    state.spinRule === "team"
      ? [...shuffle(strict), ...shuffle(sameTeam), ...shuffle(sameSeason), ...shuffle(fallback)]
      : [...shuffle(strict), ...shuffle(sameSeason), ...shuffle(sameTeam), ...shuffle(fallback)];

  return sortRoster(ranked.filter(uniquePlayer));
}

function isDrafted(player) {
  return Object.values(state.lineup).some((drafted) => drafted.name === player.name);
}

function getOpenGroups() {
  return new Set(state.positions.filter((position) => !state.lineup[position.id]).map((position) => position.group));
}

function renderChoices() {
  if (!state.currentChoices.length) {
    if (!state.formationKey) {
      choicesEl.innerHTML = `<div class="empty-state">Formasi wajib dipilih sebelum spin.</div>`;
    } else if (state.currentSlot) {
      choicesEl.innerHTML = `<div class="empty-state">Tidak ada pemain yang cocok untuk ${state.currentSlot.team} ${state.currentSlot.season} pada slot formasi yang masih kosong.</div>`;
    }
    return;
  }

  const hideRatings = state.mode === "hard" && !state.revealedFinalRating;
  choicesEl.innerHTML = `
    <div class="choice-summary">${state.currentChoices.length} pemain tersedia</div>
    ${state.currentChoices
      .map((player, index) => {
        const overall = playerOverall(player);
        const statLine = hideRatings
          ? `<div class="stat-row"><span>Rating</span><span>disimpan</span><span>sampai</span><span>akhir</span></div>`
          : `<div class="stat-row">
              <span>ATK ${player.attack}</span>
              <span>DEF ${player.defense}</span>
              <span>CRE ${player.creative}</span>
              <span>OVR ${overall}</span>
            </div>`;
        return `
          <button class="choice-card" type="button" data-choice="${index}">
            <div class="player-top">
              <div>
                <div class="player-name">${player.name}</div>
                <div class="player-meta">${player.team} | ${player.season} | ${player.group}</div>
              </div>
              <strong>${hideRatings ? "?" : overall}</strong>
            </div>
            ${statLine}
          </button>
        `;
      })
      .join("")}
  `;

  choicesEl.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => draftPlayer(Number(card.dataset.choice)));
  });
}

function draftPlayer(choiceIndex) {
  const selectedPlayer = state.currentChoices[choiceIndex];
  const targetSlot =
    state.spinRule === "team" ? findOpenSlotForPlayer(selectedPlayer) : state.currentSlot;
  if (!targetSlot) {
    choicesEl.innerHTML = `<div class="empty-state">Tidak ada slot formasi yang cocok untuk pemain ini.</div>`;
    spinButton.disabled = false;
    return;
  }
  state.lineup[targetSlot.id] = selectedPlayer;
  state.pick += 1;
  state.currentChoices = [];
  state.currentSlot = null;
  spinButton.disabled = state.pick >= state.positions.length;
  simulateButton.disabled = state.pick < state.positions.length;
  roundLabel.textContent = state.pick >= state.positions.length ? "XI lengkap" : `Pick ${state.pick + 1}/11`;
  positionBadge.textContent =
    state.pick >= state.positions.length ? "XI" : state.spinRule === "team" ? "TIM" : cleanPosition(getNextPosition().id);
  choicesEl.innerHTML = `<div class="empty-state">Pemain masuk starting XI. Spin slot berikutnya.</div>`;
  reelEl.innerHTML = `<span>${state.pick >= state.positions.length ? "Siap simulasi" : "Tekan Spin"}</span>`;
  renderFormation();
  updateMetrics();
}

function getNextPosition() {
  return state.positions.find((position) => !state.lineup[position.id]) || state.positions[0];
}

function findOpenSlotForPlayer(player) {
  return state.positions.find((position) => !state.lineup[position.id] && position.group === player.group);
}

function updateMetrics() {
  const metrics = teamMetrics();
  const hidden = state.mode === "hard" && !state.revealedFinalRating;
  attackMetric.textContent = hidden ? "?" : metrics.attack;
  defenseMetric.textContent = hidden ? "?" : metrics.defense;
  creativeMetric.textContent = hidden ? "?" : metrics.creative;
  chemMetric.textContent = hidden ? "?" : metrics.chemistry;
  ratingLabel.textContent = hidden ? "Rating ?" : `Rating ${metrics.rating}`;
}

function teamMetrics() {
  const drafted = Object.values(state.lineup);
  if (!drafted.length) return { attack: 0, defense: 0, creative: 0, chemistry: 0, stamina: 0, rating: 0 };
  const avg = (key) => Math.round(drafted.reduce((sum, player) => sum + player[key], 0) / drafted.length);
  const teamCounts = countBy(drafted, "team");
  const seasonCounts = countBy(drafted, "season");
  const sameTeamBonus = Math.max(...Object.values(teamCounts)) * 2;
  const eraSpreadBonus = Object.keys(seasonCounts).length * 3;
  const chemistry = Math.min(100, 28 + sameTeamBonus + eraSpreadBonus + drafted.length * 3);
  const attack = avg("attack");
  const defense = avg("defense");
  const creative = avg("creative");
  const stamina = avg("stamina");
  const rating = Math.round(attack * 0.31 + defense * 0.29 + creative * 0.24 + stamina * 0.1 + chemistry * 0.06);
  return { attack, defense, creative, chemistry, stamina, rating };
}

function simulateSeason() {
  state.revealedFinalRating = true;
  updateMetrics();
  renderChoices();

  const metrics = teamMetrics();
  const { opponents, replacedTeam } = buildSchedule();
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let gf = 0;
  let ga = 0;

  const rows = opponents.map((match, index) => {
    const base = teamPower2026[match.team] || 72;
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
    return { ...match, forGoals, againstGoals, opponentRating, index };
  });

  const points = wins * 3 + draws;
  const perfect = wins === 34;
  const invincible = losses === 0;
  const headline = perfect
    ? "34-0-0. Musim sempurna."
    : invincible
      ? "Tak terkalahkan, tapi belum sempurna."
      : "Skuad kuat, masih bisa di-upgrade.";

  resultBox.innerHTML = `
    <p class="eyebrow">Hasil musim</p>
    <h2>${headline}</h2>
    <div class="season-record">
      <div><span>Menang</span><strong>${wins}</strong></div>
      <div><span>Seri</span><strong>${draws}</strong></div>
      <div><span>Kalah</span><strong>${losses}</strong></div>
    </div>
    <p class="player-meta">${points} poin | Gol ${gf}-${ga} | Rating akhir ${metrics.rating} | Chemistry ${metrics.chemistry}</p>
    <p class="player-meta">Tim draft masuk liga dengan menggantikan slot ${replacedTeam}.</p>
    <div class="match-list">
      ${rows
        .map((row) => {
          const status = row.forGoals > row.againstGoals ? "win" : row.forGoals === row.againstGoals ? "draw" : "loss";
          const venue = row.home ? "Kandang" : "Tandang";
          return `<div class="match-row ${status}"><span>MD${row.index + 1} ${venue} vs ${row.team}</span><strong>${row.forGoals}-${row.againstGoals}</strong></div>`;
        })
        .join("")}
    </div>
  `;
}

function buildSchedule() {
  const drafted = Object.values(state.lineup);
  const teamCounts = countBy(drafted, "team");
  const dominantTeam = Object.entries(teamCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const replacedTeam = liga1Teams2026.includes(dominantTeam) ? dominantTeam : liga1Teams2026[liga1Teams2026.length - 1];
  const leagueOpponents = liga1Teams2026.filter((team) => team !== replacedTeam);
  const homeAway = leagueOpponents.flatMap((team) => [
    { team, home: true },
    { team, home: false },
  ]);
  return { opponents: shuffle(homeAway), replacedTeam };
}

function playerOverall(player) {
  if (player.group === "GK") return Math.round(player.defense * 0.72 + player.stamina * 0.16 + player.creative * 0.12);
  if (player.group === "DEF") return Math.round(player.defense * 0.62 + player.creative * 0.18 + player.stamina * 0.12 + player.attack * 0.08);
  if (player.group === "MID") return Math.round(player.creative * 0.42 + player.defense * 0.22 + player.attack * 0.22 + player.stamina * 0.14);
  return Math.round(player.attack * 0.52 + player.creative * 0.28 + player.stamina * 0.14 + player.defense * 0.06);
}

function sortRoster(roster) {
  const order = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
  return [...roster].sort((a, b) => {
    const groupDiff = order[a.group] - order[b.group];
    if (groupDiff !== 0) return groupDiff;
    return playerOverall(b) - playerOverall(a);
  });
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function uniquePlayer(player, index, list) {
  return list.findIndex((item) => item.name === player.name) === index;
}

function uniqueSpinOutcome(outcome, index, list) {
  return list.findIndex((item) => item.team === outcome.team && item.season === outcome.season) === index;
}

function countBy(items, key) {
  return items.reduce((result, item) => {
    result[item[key]] = (result[item[key]] || 0) + 1;
    return result;
  }, {});
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function cleanPosition(id) {
  return id.replace(/[0-9]/g, "");
}

init();
