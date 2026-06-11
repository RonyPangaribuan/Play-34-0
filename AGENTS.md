# AGENTS.md

Instruksi permanen untuk Codex saat bekerja di repo ini:

1. Project ini adalah **34-0 App**, web game draft XI sepak bola Indonesia.
2. UI wajib menggunakan **Bahasa Indonesia**.
3. Jangan gunakan logo resmi klub, foto pemain resmi, atau aset berhak cipta.
4. Data pemain boleh dummy/placeholder hanya jika diberi tanda jelas sebagai `generated` atau `data pelengkap`.
5. Prioritas saat ini adalah **frontend-only MVP**, bukan backend/database.
6. Pisahkan UI dari game logic. Komponen tampilan berada di layer UI, sedangkan aturan draft, rating, spin, dan simulasi berada di layer logic/library.
7. Jangan membuat file terlalu besar. Pecah komponen, helper, atau data ke file terpisah jika mulai sulit dibaca.
8. Setiap task harus menjalankan:
   - `npm run typecheck`
   - `npm run build`
9. Jangan menghapus fitur yang sudah ada tanpa alasan yang jelas dan relevan dengan task.
10. Setelah selesai, tulis ringkasan perubahan dan cara testing yang sudah dilakukan.
