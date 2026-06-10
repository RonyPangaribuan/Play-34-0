# 34-0 Draft XI Indonesia

Game web draft XI sepakbola Indonesia. Versi ini sudah dimigrasikan dari prototype statis ke Next.js + TypeScript dengan game engine terpisah dari UI.

## Stack

- Next.js App Router
- React + TypeScript
- CSS global untuk UI game
- Prisma schema untuk model database produksi
- Supabase/PostgreSQL siap dipakai sebagai database berikutnya

## Cara menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` untuk landing page, atau `http://localhost:3000/game` untuk langsung masuk game.

## Data roster

Data pemain dibaca dari dua sumber:

- Seed awal di `src/lib/game-data.ts`
- Data roster eksternal di `src/data/player-seasons.manual.json`

Untuk mencoba import roster dari halaman Wikipedia club-season yang tersedia:

```bash
npm run data:import:wikipedia
```

Importer akan menulis:

- `src/data/player-seasons.wikipedia.json`
- `src/data/roster-coverage.wikipedia.json`

Catatan: Wikipedia tidak punya halaman squad lengkap untuk semua klub-musim Liga 1 2017-2026. File coverage dipakai untuk melihat klub-musim mana yang berhasil diimpor dan mana yang perlu sumber lain.

## Struktur penting

- `src/app/game/page.tsx` halaman game
- `src/app/page.tsx` landing page
- `src/components/GameClient.tsx` UI dan state draft
- `src/lib/game-data.ts` seed data klub, musim, formasi, dan pemain
- `src/data/player-seasons.manual.json` roster tambahan terverifikasi
- `scripts/import-wikipedia-rosters.mjs` importer roster dari halaman club-season Wikipedia
- `src/lib/game-engine.ts` spin, rating, pilihan pemain, dan simulasi
- `src/app/api/spin/route.ts` API spin dasar
- `src/app/api/simulate/route.ts` API simulasi dasar
- `prisma/schema.prisma` rancangan database

## Logika saat ini

- Alur game dipisah menjadi tiga layar: setup, draft, dan hasil musim.
- User wajib memilih formasi sebelum spin.
- Mode Normal menampilkan rating saat draft.
- Mode Hard menyembunyikan rating sampai simulasi akhir.
- Spin bisa berdasarkan posisi atau tim.
- Pada mode Tim, wheel hanya menampilkan klub + musim dan pilihan pemain berasal dari posisi yang masih kosong di formasi.
- Jika database berisi banyak pemain untuk klub-musim tersebut, semua kandidat yang cocok akan ditampilkan.
- Setelah 11 pemain terpilih, tim draft masuk jadwal 34 laga melawan tim Liga 1 musim 2025/26.

## Catatan data

`seasonTeams` sudah dipisah per musim 2017 sampai 2025/26. Pool pemain belum bisa dianggap resmi lengkap untuk semua klub-musim karena sumber publik tidak seragam. Jangan mengisi roster dengan nama perkiraan; gunakan data resmi klub/LIB atau halaman squad yang bisa diverifikasi.
