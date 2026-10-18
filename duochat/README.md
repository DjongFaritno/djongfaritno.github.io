# Website DuoChat

Website produk di https://djongfaritno.github.io/duochat/ disimpan terpisah dari repository aplikasi SocialMedia.

Halaman menampilkan fitur yang tersedia pada DuoChat 0.4.0: 13 layanan, multiakun, dua panel, blur per panel dengan pilihan elemen bersama, password/Windows Hello/Touch ID, mode ringkas/sidebar hover, tema dan Bahasa Indonesia/English. Demo memakai pesan contoh; tombol Blur terpisah untuk masing-masing panel.

Unduhan memakai releases.js dan API GitHub publik. Hanya rilis stabil dengan keempat aset unduhan yang sudah terunggah dipilih; draft/prerelease/nomor bersufiks tidak menggantikan rilis publik. Saat API gagal, semua tombol mengarah ke daftar rilis tanpa menawarkan installer lama sebagai fallback. Tidak ada token, analytics atau font eksternal.

Panduan macOS menyimpan langkah Done → Privacy & Security → Open Anyway untuk paket ad-hoc yang belum dinotarize. Batas dukungan login, panggilan dan blur dijelaskan pada bagian layanan dan FAQ.

QC: unit pemilihan rilis dan pengujian Chromium desktop/mobile, tema, blur per panel, hover, mode ringkas, anchor dan tautan unduh. Jalankan workflow DuoChat website QC. Perubahan hanya pada folder duochat dan workflow QC-nya; website utama tetap terpisah.
