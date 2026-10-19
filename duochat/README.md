# Website DuoChat

Website produk di https://djongfaritno.github.io/duochat/ disimpan terpisah dari repository aplikasi SocialMedia.

Halaman menampilkan fitur yang tersedia pada DuoChat 2.0.6: 11 layanan, multiakun, dua panel, blur per panel dengan pilihan elemen bersama, password/Windows Hello/Touch ID, mode ringkas/sidebar hover, tema dan Bahasa Indonesia/English. Demo memakai pesan contoh; tombol Blur terpisah untuk masing-masing panel.

Unduhan memakai releases.js dan API GitHub publik. Hanya rilis stabil dengan keempat aset unduhan yang sudah terunggah dipilih; draft/prerelease/nomor bersufiks tidak menggantikan rilis publik. Saat API gagal, semua tombol mengarah ke daftar rilis tanpa menawarkan installer lama sebagai fallback. Tidak ada token, analytics atau font eksternal.

Panduan macOS menyimpan langkah Done → Privacy & Security → Open Anyway untuk paket ad-hoc yang belum dinotarize. Batas dukungan login, panggilan dan blur dijelaskan pada bagian layanan dan FAQ.

QC: unit pemilihan rilis dan pengujian Chromium desktop/mobile, tema, blur per panel, hover, mode ringkas, anchor dan tautan unduh. Jalankan workflow DuoChat website QC. Perubahan hanya pada folder duochat dan workflow QC-nya; website utama tetap terpisah.


## Demo fitur interaktif

Enam kartu fitur memakai ilustrasi mini UI langsung di HTML/CSS: ganti layanan panel kanan, blur pesan/foto per panel, kunci/buka contoh, mode ringkas dengan sidebar hover/ketuk, tema White/Dark/Auto dan bahasa, serta akun aktif/dijeda. Semua data fiktif; tidak ada akun, izin notifikasi, password atau biometrik sungguhan. Kontrol demo tidak mengubah pengaturan aplikasi maupun kartu lain. Gambar pegunungan berupa SVG inline; tanpa video autoplay, iframe atau dependensi tambahan. Animasi mengikuti prefers-reduced-motion.

Referensi pola interaksi: [Apple iPhone](https://www.apple.com/iphone-17/) (pilihan warna yang mengubah visual, highlights) dan [MacBook Air](https://www.apple.com/macbook-air/). Aset dan identitas Apple tidak digunakan.

QC Chromium mencakup enam demo, pemisahan state antar panel, hover/fokus dan ketuk untuk reveal, fokus saat kunci/buka, sidebar hover/ketuk/Escape, Auto mengikuti skema OS, bahasa, jeda akun, reduced motion, serta lebar desktop/mobile. Screenshot kartu tersimpan sebagai artifact workflow.
