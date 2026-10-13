# Website DuoChat

Website statis, terpisah dari repository SocialMedia. Tidak membutuhkan npm, build, backend, atau koneksi internet untuk melihat halaman. Tautan unduhan tetap membutuhkan internet.

## Buka di komputer

Ekstrak ZIP, lalu buka index.html di folder duochat dengan browser.

Alternatif: jalankan python3 -m http.server 8080 dari folder induk duochat, lalu buka http://localhost:8080/duochat/.

## Pasang di GitHub Pages nanti

Salin seluruh folder duochat ke sumber website repository DjongFaritno/djongfaritno.github.io. Jika Pages menggunakan branch master dan folder root, letakkan folder duochat sejajar dengan index.html beranda. Jangan menimpa beranda. Jika sumber Pages adalah folder docs, salin ke docs/duochat.

Setelah kamu commit dan push di repository website serta deployment Pages selesai, alamatnya adalah https://djongfaritno.github.io/duochat/.

Source website berada di repository djongfaritno.github.io, terpisah dari aplikasi SocialMedia. ZIP tetap bisa dibuka secara lokal.

## Isi folder

- index.html: isi halaman, tautan unduhan, dan panduan pemasangan.
- style.css: tampilan responsif.
- app.js: tema pratinjau dan tab panduan sistem operasi.
- assets/duochat-icon.png: logo aplikasi.

Semua aset menggunakan path relatif sehingga bisa dibuka lewat file lokal maupun subfolder GitHub Pages.

## Sebelum dibagikan ke publik

Repository aplikasi SocialMedia sudah publik. Unduhan AppImage dan installer Fedora terbaru tersedia bersama paket Windows dan macOS di GitHub Release.

Nomor versi, tautan unduhan, checksum, dan nama file pada panduan otomatis mengikuti rilis lengkap terbaru melalui GitHub Releases API publik. Prerelease juga dibaca. Tidak membutuhkan token atau backend. Paket Windows x64, macOS universal, Linux AppImage, dan install-fedora.sh harus selesai diunggah dalam rilis yang sama sebelum website beralih, sehingga versi panduan dan installer selalu selaras.

Saat pemeriksaan GitHub gagal (misalnya offline atau kuota API habis), tombol unduh mengarah ke halaman GitHub Releases. Website tidak menawarkan tautan versi lama sebagai fallback. Nama file dan perintah Linux baru ditampilkan setelah rilis lengkap yang sesuai ditemukan. Batas API tanpa autentikasi berlaku per IP. Tidak ada token yang ditanam di website.

File releases.js menangani pemilihan rilis dan pembaruan tampilan. Website tidak memakai analytics atau font eksternal.

## Big update beta

Halaman memperkenalkan 0.2.0-beta.2 sebagai kandidat yang terpisah dari rilis publik. Tombol beta menuju artifact build ketiga OS dari workflow 38412864751; artifact tersebut kedaluwarsa 27 Oktober 2026 dan GitHub dapat meminta login untuk mengunduh. Perbarui bagian beta ketika kandidat/rilis berikutnya siap atau masa artifact habis.

Tombol pada bagian Rilis publik tetap memakai releases.js untuk memilih rilis lengkap terbaru. Nomor beta pada hero tidak mengikuti nomor rilis publik agar status keduanya tidak tercampur. Demo Ringkas menyembunyikan header/sidebar ilustrasi; hover tepi kiri menampilkan sidebar contoh. Demo tidak terhubung ke akun layanan.

Website dipublikasikan melalui GitHub Pages dari folder duochat pada repository djongfaritno.github.io.
