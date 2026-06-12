# 34-0 Draft XI Indonesia

[![CI](https://github.com/RonyPangaribuan/Play-34-0/actions/workflows/ci.yml/badge.svg)](https://github.com/RonyPangaribuan/Play-34-0/actions/workflows/ci.yml)

34-0 App adalah web game draft XI sepak bola Indonesia. Fokus saat ini adalah frontend-only MVP: flow setup, draft, simulasi musim, dan hasil share card berjalan di sisi aplikasi tanpa migrasi database.

## Stack

- Next.js App Router
- React + TypeScript
- CSS global untuk UI game
- Data lokal berbasis TypeScript/JSON
- Prisma schema masih tersedia untuk rancangan database berikutnya, tetapi belum menjadi fokus MVP

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` untuk landing page, atau `http://localhost:3000/game` untuk langsung masuk game.

## Deploy ke Vercel

Project ini aman dideploy sebagai Next.js frontend-only MVP. Prisma/Supabase belum aktif sebagai runtime, jadi build saat ini tidak membutuhkan `DATABASE_URL`, Supabase key, atau environment variable backend lain.

Langkah deploy:

1. Push branch ke GitHub.
2. Di Vercel, pilih **Add New Project** lalu import repository ini.
3. Gunakan framework preset **Next.js**.
4. Pastikan command berikut tetap default:
   - Install Command: `npm ci` jika `package-lock.json` ada, atau `npm install`.
   - Build Command: `npm run build`.
   - Output Directory: biarkan default Next.js.
5. Deploy. Setelah itu, setiap push ke branch production Vercel akan memicu build baru.

Sebelum deploy manual, jalankan validasi lokal:

```bash
npm run typecheck
npm run build
```

## Struktur Utama

- `src/components/GameClient.tsx`
  Orchestrator utama game. File ini menghubungkan hook state/game flow dengan layar setup, draft, dan result.

- `src/hooks/useDraftGame.ts`
  State dan game flow utama: pilihan setup, spin, draft pemain, reroll, simulasi, reset, dan transisi layar.

- `src/components/game/*`
  Komponen UI game:
  - `SetupScreen.tsx`
  - `DraftScreen.tsx`
  - `ResultScreen.tsx`
  - `Pitch.tsx`
  - `PlayerChoice.tsx`
  - `GameHeader.tsx`

- `src/lib/game-engine.ts`
  Logic game: spin wheel, pilihan pemain, rating pemain, chemistry, schedule, dan simulation engine.

- `src/lib/random.ts`
  Seeded random generator untuk simulasi reproducible. Seed yang sama dan lineup yang sama menghasilkan jadwal/skor simulasi yang sama.

- `src/lib/game-data.ts`
  Formasi, daftar musim, daftar klub untuk spin wheel, alias nama klub, seed player, data manual/verified, dan roster pelengkap generated.

- `src/lib/types.ts`
  Type utama game, termasuk `PlayerSeason`, `SimulationResult`, dan `dataStatus`.

- `src/data/player-seasons.manual.json`
  Data pemain tambahan yang bisa diberi sumber. Data bersumber dianggap `verified`; data tanpa sumber dianggap `manual`.

- `src/app/api/spin/route.ts`
  API spin dasar.

- `src/app/api/simulate/route.ts`
  API simulasi dasar, mendukung seed opsional.

## Data Pemain

Setiap `PlayerSeason` memiliki `dataStatus`:

- `verified`: data berasal dari sumber yang dicatat.
- `manual`: data seed/manual internal.
- `generated`: roster pelengkap untuk menjaga game tetap playable saat roster historis belum lengkap.

Field `generated` tetap didukung untuk backward compatibility, tetapi UI dan logic utama memakai `dataStatus`.

Di setup, user bisa memilih apakah ingin memakai **roster pelengkap**. Jika toggle dimatikan, spin hanya mengambil pemain non-generated.

## Logika Game

- Alur game terdiri dari `setup`, `draft`, dan `result`.
- User memilih formasi, kesulitan, mode rating, mode draft, era, dan opsi roster pelengkap.
- Mode draft bisa berbasis posisi atau klub-musim.
- Pada mode Tim, wheel menghasilkan klub-musim dan user memilih pemain dari roster yang tersedia untuk slot posisi yang masih kosong.
- Setelah 11 pemain terpilih, tim disimulasikan melawan klub musim 2025/26.
- Chemistry dihitung dari kedekatan klub, kedekatan musim, progres lineup, dan bonus kecil saat XI lengkap.
- Simulasi memakai seed. `SimulationResult` menyimpan seed sebagai kode share.

## Hasil dan Share

Result screen menampilkan share card berbahasa Indonesia:

- Achievement badge
- Record, poin, gol, rating, chemistry
- Pemain terbaik
- Top scorer simulasi sederhana
- Seed/kode share
- Tombol **Copy hasil** untuk menyalin ringkasan ke clipboard

## Data Import

Untuk memperbarui data pemain verified dari Wikipedia, gunakan importer Liga 1 berbasis kategori tahun:

```bash
npm run data:import:wikipedia:liga1
```

Importer akan menulis:

- `src/data/player-seasons.wikipedia.liga1.json`
- `src/data/wikipedia-import-report-liga1.json`

Importer memakai `Category:Indonesian football club seasons by year`, lalu tetap memfilter klub sesuai daftar peserta di `seasonTeams` untuk setiap musim. Jika halaman tidak punya squad jelas atau request Wikipedia terkena rate-limit, item dicatat sebagai `missing` atau `needs-review`; jangan mengarang nama pemain.

## Batasan Aset

Jangan memakai logo resmi klub, foto resmi pemain, atau aset berhak cipta. UI harus tetap menggunakan Bahasa Indonesia.

## Validasi

Sebelum menutup task, jalankan:

```bash
npm run typecheck
npm run build
```
