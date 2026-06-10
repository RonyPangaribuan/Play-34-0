# 34-0 Draft XI Indonesia

Prototype game web static bertema sepakbola Indonesia, terinspirasi dari format draft season simulator seperti `38-0`.

## Cara menjalankan

Buka `index.html` langsung di browser.

## Logika saat ini

- User wajib memilih formasi sebelum spin.
- Mode Normal menampilkan rating saat draft.
- Mode Hard menyembunyikan rating sampai simulasi akhir.
- Spin bisa diarahkan berdasarkan posisi atau tim.
- Pada mode Tim, wheel hanya menampilkan klub + musim dan pilihan pemain berasal dari posisi yang masih kosong di formasi.
- Jika database berisi banyak pemain untuk klub-musim tersebut, semua kandidat yang cocok akan ditampilkan, bukan dibatasi 3 pemain.
- Wheel mengambil klub dari daftar peserta Liga 1 per musim 2017 sampai 2025/26.
- Setelah 11 pemain terpilih, tim draft masuk jadwal 34 laga melawan tim Liga 1 musim 2026.

## Catatan data

Daftar peserta per musim sudah dipisah di `seasonTeams`. Pool pemain dan rating di prototype ini masih seed/ilustratif untuk validasi gameplay, belum database resmi lengkap semua pemain Liga 1 2017-2026. Untuk versi produksi, ganti atau lengkapi `players` dengan dataset yang sudah diverifikasi dan pastikan penggunaan nama, logo, foto, serta atribut klub mengikuti izin/lisensi yang sesuai.
