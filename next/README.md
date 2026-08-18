# Faritno Zuliansyah — GitHub Pages

Paket ini adalah versi statis dari personal website Faritno Zuliansyah. Tidak memerlukan Node.js, npm, database, atau proses build.

## Cara memasang

1. Simpan backup isi repository GitHub Pages lama.
2. Ekstrak ZIP ini.
3. Salin seluruh isi folder hasil ekstrak ke root repository `djongfaritno.github.io`.
4. Pastikan file `index.html`, `styles.css`, `script.js`, `.nojekyll`, dan folder `assets` berada di root repository.
5. Commit dan push perubahan ke branch yang digunakan GitHub Pages.
6. Di GitHub, buka **Settings → Pages** dan pastikan sumber deployment menggunakan branch yang benar dengan folder `/ (root)`.
7. Tunggu proses deployment selesai, lalu buka `https://djongfaritno.github.io/` dan lakukan hard refresh.

## Struktur

- `index.html` — struktur dan seluruh konten EN/ID
- `styles.css` — desain responsif desktop dan mobile
- `script.js` — pergantian bahasa dan tahun otomatis
- `assets/kambium-logo.png` — logo transparan Kambium
- `.nojekyll` — mencegah pemrosesan Jekyll yang tidak diperlukan

## Catatan

- Bahasa awal adalah English. Pilihan EN/ID tersimpan pada browser pengunjung.
- Tombol kontak menggunakan email `tjongfaritno@gmail.com`.
- Tautan LinkedIn mengarah ke `linkedin.com/in/faritnozuliansyah`.
- Tidak ada analytics, tracking, cookie, atau dependensi eksternal.
