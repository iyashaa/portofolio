# Personal Data Science Portfolio

Konten portfolio dikelola dari JSON agar teks dan project bisa diubah tanpa menyentuh HTML atau JavaScript. Website tersedia dalam bahasa Inggris; tulisan yang terlihat dapat diedit di `portfolio.json`.

## Menjalankan website

Di folder project, jalankan:

```powershell
node server.js
```

Buka `http://localhost:4173`. Hentikan server dengan `Ctrl+C`. Pilihan dark mode tersimpan di browser dan akan tetap dipakai saat website dibuka lagi.

## Mengubah teks dan informasi diri

Buka `portfolio.json`:

- `profile`: nama, role, email, dan foto profil. File foto ada di `assets/ghiyyas-profile.png`; ubah `profile.photo` bila menggunakan nama/path lain.
- Tombol **Download resume** mengunduh `assets/ghiyyas-resume.pdf`. Taruh file PDF CV dengan nama itu di folder `assets/`. Jika nama/path berbeda, ganti `profile.resumeUrl` di `portfolio.json`.
- `hero`: headline, ringkasan final-year, quote, area fokus, status, dan label spesialisasi di bagian atas.
- `about.heading`, `about.paragraphs`, `about.approach`: judul, paragraf About, dan langkah kerja.
- `projectsIntro`: kalimat pembuka bagian Projects.
- `stack`: kategori dan daftar tech stack. Logo brand dipetakan di `toolIcons` pada `script.js`; tools tanpa logo brand khusus memakai monogram sebagai fallback.
- `experienceIntro`: teks pengantar Journey.
- `experience`: daftar pengalaman; satu entri placeholder disediakan agar Journey langsung terlihat. Ganti atau hapus placeholder, lalu salin object dari [`experience-template.json`](experience-template.json) untuk menambah entri dan susun ulang object untuk mengubah urutan.
- `education`: riwayat pendidikan opsional yang tampil di bagian Journey.
- `contact.heading`, `contact.copy`, `contact.socials`: teks dan tautan kontak.

## Menambah atau menghapus project

Semua project ada di array `projects` dalam `portfolio.json`. Untuk menambah, salin object dari [`project-template.json`](project-template.json) ke dalam array tersebut, pisahkan object dengan koma, lalu isi nilainya. Untuk menghapus, hapus object project yang dimaksud. Urutan object menentukan urutan tampil.

Field project:

- `title`, `category`, `phase`, `role`, `status`: nama, kategori, waktu, peran, dan status project.
- `featured`: `true` untuk menandai project sebagai featured; selain itu gunakan `false`.
- `description`: ringkasan masalah, pendekatan, dan hasil.
- `tags`: daftar teknologi atau metode.
- `sourceUrl`: URL repository/source code. Kosongkan (`""`) jika tidak ada.
- `demoUrl`: URL live demo. Isi URL publik untuk menampilkan tombol **Live demo**; kosongkan jika belum ada.
- `gallery`: daftar gambar/screenshots untuk carousel. Jika kosong, website menampilkan ilustrasi data otomatis. Gambar project dapat diubah dari template JSON ini; foto profil diatur terpisah lewat `profile.photo`.
- `chartLabel` dan `visual`: label dan ilustrasi pengganti; `visual` dapat berupa `trend`, `matrix`, atau `distribution`.

Contoh tautan demo dan source:

```json
"sourceUrl": "https://github.com/iyashaa/project-repository",
"demoUrl": "https://your-project-demo.example.com"
```

Contoh gallery (simpan file di folder `assets/projects/`):

```json
"gallery": [
  { "src": "assets/projects/model-dashboard.png", "alt": "Model evaluation dashboard" },
  { "src": "assets/projects/model-results.png", "alt": "Comparison of model results" }
]
```

Carousel dengan tombol previous/next tampil otomatis jika ada dua gambar atau lebih. Pastikan gambar benar-benar ada pada path yang dicantumkan dan gunakan JSON valid: tanda kutip ganda, tanpa koma setelah item terakhir.

## Menambah pengalaman ke Journey

Salin isi [`experience-template.json`](experience-template.json) ke dalam array `experience` di `portfolio.json`. Setiap entri mendukung `title`, `organization`, `period`, `location`, `workMode`, `description`, dan `skills`. Skills akan tampil tepat di bawah deskripsi sebagai daftar ringkas. Hapus entri dari array untuk menghilangkannya dari website; section dan tautan Journey otomatis disembunyikan jika tidak ada pengalaman maupun pendidikan.

Foto profil saat ini dibaca dari `assets/ghiyyas-profile.png`; bila mengganti foto atau nama file, sesuaikan `profile.photo` dan `profile.photoAlt`.
