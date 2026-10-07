# Website DuoChat

Website statis, terpisah dari repository SocialMedia. Tidak membutuhkan npm, build, backend, atau koneksi internet untuk melihat halaman. Tautan unduhan tetap membutuhkan internet.

## Buka di komputer

Ekstrak ZIP, lalu buka index.html di folder duochat dengan browser.

Alternatif: jalankan python3 -m http.server 8080 dari folder induk duochat, lalu buka http://localhost:8080/duochat/.

## Pasang di GitHub Pages nanti

Salin seluruh folder duochat ke sumber website repository DjongFaritno/djongfaritno.github.io. Jika Pages menggunakan branch master dan folder root, letakkan folder duochat sejajar dengan index.html beranda. Jangan menimpa beranda. Jika sumber Pages adalah folder docs, salin ke docs/duochat.

Setelah kamu commit dan push di repository website serta deployment Pages selesai, alamatnya adalah https://djongfaritno.github.io/duochat/.

Paket ini belum diunggah atau dipublikasikan. Repository SocialMedia tidak diubah.

## Isi folder

- index.html: isi halaman, tautan unduhan, dan panduan pemasangan.
- style.css: tampilan responsif.
- app.js: tema pratinjau dan tab panduan sistem operasi.
- assets/duochat-icon.png: logo aplikasi.

Semua aset menggunakan path relatif sehingga bisa dibuka lewat file lokal maupun subfolder GitHub Pages.

## Sebelum dibagikan ke publik

Repository aplikasi SocialMedia saat ini privat, sehingga unduhan membutuhkan akun GitHub yang punya akses. Halaman menjelaskan batasan ini. Jika file rilis dipindahkan ke lokasi publik, perbarui tautan dan catatan akses di index.html.

Tautan paket menunjuk versi 0.1.4. Saat ada rilis baru, perbarui versi dan URL unduhan. Website tidak memakai analytics, font eksternal, atau layanan tambahan.
