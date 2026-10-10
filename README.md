# BAYLENCIR PROPERTY

Website statis awal untuk marketplace pemasaran rumah, tanah, kebun, dan ruko di Bayung Lencir.

## Isi folder
- `index.html` — halaman utama
- `assets/css/style.css` — gaya dan responsivitas
- `assets/js/app.js` — pencarian, kartu properti contoh, berbagi, dan formulir pengajuan

## Penting sebelum promosi
1. Data properti dan harga pada versi ini adalah CONTOH. Hapus/ganti dengan iklan nyata yang telah mendapat izin pemilik.
2. Atur `ADMIN_WHATSAPP` di `assets/js/app.js` memakai nomor admin resmi dengan kode negara, tanpa tanda `+`.
3. Login Super Admin, database, pencatatan referral sales, dan pembagian komisi belum diimplementasikan pada versi statis ini.
4. Foto dimuat dari Unsplash dan membutuhkan koneksi internet.
5. Jangan menyimpan password, token, atau data pribadi sensitif di repository publik.

## Deploy Netlify
1. Upload folder proyek ini ke repository GitHub (jangan hanya upload file ZIP).
2. Di Netlify, pilih Add new site / Import an existing project dan hubungkan repository.
3. Build command: kosongkan. Publish directory: `.` (folder root yang berisi `index.html`).
