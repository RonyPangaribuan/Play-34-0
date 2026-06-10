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

Buka `http://localhost:3000/game`.

## Struktur penting

- `src/app/game/page.tsx` halaman game
- `src/components/GameClient.tsx` UI dan state draft
- `src/lib/game-data.ts` seed data klub, musim, formasi, dan pemain
- `src/lib/game-engine.ts` spin, rating, pilihan pemain, dan simulasi
- `src/app/api/spin/route.ts` API spin dasar
- `src/app/api/simulate/route.ts` API simulasi dasar
- `prisma/schema.prisma` rancangan database

## Logika saat ini

- User wajib memilih formasi sebelum spin.
- Mode Normal menampilkan rating saat draft.
- Mode Hard menyembunyikan rating sampai simulasi akhir.
- Spin bisa berdasarkan posisi atau tim.
- Pada mode Tim, wheel hanya menampilkan klub + musim dan pilihan pemain berasal dari posisi yang masih kosong di formasi.
- Jika database berisi banyak pemain untuk klub-musim tersebut, semua kandidat yang cocok akan ditampilkan.
- Setelah 11 pemain terpilih, tim draft masuk jadwal 34 laga melawan tim Liga 1 musim 2025/26.

## Catatan data

`seasonTeams` sudah dipisah per musim 2017 sampai 2025/26. Pool `players` masih seed awal, belum database resmi lengkap semua pemain Liga 1 2017-2026. Langkah berikutnya adalah import roster lengkap ke tabel Prisma/Supabase.
