# Product Requirements Document (PRD): Kebun Aksara

## 1. Ringkasan Produk

**Kebun Aksara** adalah platform edukasi web interaktif berbasis _gamification_ untuk anak usia dini (4–8 tahun) yang berfokus pada penguasaan literasi dasar (huruf, suku kata) dan numerasi dasar (angka, penjumlahan) tanpa tekanan skor atau hukuman. Aplikasi memisahkan pengalaman antara **Dashboard Orang Tua** (berbasis data, analitik, dan penetapan misi keluarga) dan **Dunia Anak** (eksplorasi peta, kuis adaptif, dan kebun virtual yang tumbuh seiring progres belajar).

### Prinsip Inti Desain (Non-Negotiable)

1. **Zero Punishment:** Tidak ada pengurangan poin, suara _buzzer_ negatif, atau _reset_ streak menjadi nol.
2. **Gentle Session Limit:** Sesi belajar otomatis diakhiri secara lembut setelah 10 menit dengan layar istirahat.
3. **Child-Safe Environment:** Bebas iklan, tanpa fitur _chat_ publik, dan tanpa papan peringkat (_leaderboard_) antaranak.
4. **Effort Over Perfection:** _Reward_ diberikan atas konsistensi usaha dan penyelesaian materi, bukan hanya nilai sempurna.

---

## 2. Persona Pengguna

1. **Orang Tua (Account Owner):**
   - Mengelola akun utama, membuat profil anak, mengatur PIN 4-digit, memantau perkembangan penguasaan huruf/angka, serta menetapkan misi keluarga dan hadiah dunia nyata.
2. **Anak (Sub-Profile Player):**
   - Masuk ke aplikasi melalui pemilihan avatar tanpa mengetik _password_, berinteraksi dengan maskot **Kiko si Kelinci**, menyelesaikan petualangan belajar, mengoleksi stiker, dan menata kebun virtual.

---

## 3. Spesifikasi Fitur & Fungsionalitas

### A. Landing Page (`/(marketing)`)

- **Hero Section:** Headline _"Tumbuhkan Kebun. Kuasai Aksara."_, CTA _"Mulai Bermain Gratis"_, 3 _trust badges_ (Tanpa Iklan, Kesulitan Adaptif, Laporan Orang Tua), dan ilustrasi _arch-frame_ Kiko di kebun[cite: 2].
- **Eksplorasi 4 Area Belajar:** Kartu identitas warna untuk **Hutan Huruf** (Sage), **Bukit Angka** (Sky Blue), **Sungai Kata** (Warm Amber), dan **Gua Tambah** (Terracotta)[cite: 2].
- **Banner Prinsip Belajar:** Highlight metrik `10 Menit/Hari`, `0 Hukuman`, `4 Area Kurikulum`[cite: 2].

### B. Dashboard Orang Tua (`/(parent)`)

- **Kontrol Akses:** Dilindungi JWT Authentication dan verifikasi **4-digit Parent PIN** saat beralih dari Mode Anak.
- **KPI Overview Cards:**
  - _Total Bintang & Level Anak_ (kartu sorotan gradasi hijau)[cite: 1].
  - _Rantai Bunga (Streak)_ beserta status kuota _Hari Libur_ mingguan[cite: 1].
  - _Tingkat Penguasaan Materi_ & daftar item yang masuk antrean pengulangan (_spaced repetition_)[cite: 1].
- **Status Area & Grafik Aktivitas:** Grid 2x2 progres 4 area belajar dan _bar chart_ durasi belajar harian (Mingguan/Bulanan)[cite: 1].
- **Misi Keluarga & Hadiah Dunia Nyata:** CRUD misi mingguan (misal: _"Hitung 10 sendok bersama Ayah"_), pelacak target bintang untuk hadiah dunia nyata, dan fitur kirim pesan/stiker penyemangat ke layar anak[cite: 1].

### C. Dunia Anak (`/(child)`)

- **Peta Petualangan & Cerita:** 4 area bertahap dengan tantangan "Penjaga Area" di ujung setiap jalur.
- **Mesin Kuis Adaptif & "Ajari Kiko":**
  - Menyesuaikan opsi jawaban secara otomatis jika anak salah 2x berturut-turut.
  - Mode _Ajari Kiko_: Anak berperan sebagai guru untuk membantu Kiko memilih jawaban yang tepat.
  - _Spaced Repetition_: Materi dengan skor penguasaan rendah otomatis muncul kembali di sesi berikutnya.
- **Kebun yang Hidup & Kustomisasi:**
  - Pertumbuhan tanaman (benih → tunas → bunga → pohon buah) dan kedatangan hewan (kupu-kupu, burung, kelinci) berdasarkan pencapaian.
  - Tata letak interaktif (_drag/tap to place_) untuk pohon, pagar, kolam, dan ayunan yang disimpan ke koordinat grid.
  - Siklus cuaca/waktu (Pagi, Sore, Hujan Pelangi) dan status _"Kebun Tidur Sebentar"_ (tanpa rasa bersalah) jika lama tidak dibuka.
- **Sistem Reward Bertingkat & Album Stiker:**
  - _Micro-reward_ tiap jawaban benar, kotak hadiah kejutan tiap misi harian selesai, dan hadiah besar tiap 7 hari belajar.
  - Album koleksi per tema (Buah, Hewan, Kendaraan, Profesi) dengan tingkat kelangkaan (_Common, Rare, Epic_) dan _anti-frustration logic_.
  - Kustomisasi aksesori Kiko (topi, kacamata, baju).
- **Mini-Game Selingan (MVP: 2 Game):**
  1. _Tangkap Huruf_: Menyentuh huruf yang jatuh sesuai instruksi audio.
  2. _Jembatan Kata_: Menyusun suku kata agar Kiko bisa menyeberangi sungai.

---

## 4. Arsitektur & Tech Stack

- **Backend:** Python 3.11+, Django 5.x, Django REST Framework (DRF), SimpleJWT.
- **Database:** PostgreSQL 15+ (memanfaatkan `JSONB` untuk `grid_layout`, `mascot_equipped`, dan `content_payload`).
- **Frontend:** Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion, Recharts, Lucide React, Canvas Confetti.

---

## 5. Non-Functional Requirements & Batasan MVP

- **Latensi Interaksi Anak:** Transisi antarsoal di bawah 150ms menggunakan _client-side state_ dan _asset preloading_.
- **Responsivitas:** _Mobile-first / Tablet-friendly_ untuk layar anak (target sentuh tombol minimal `48x48px`) dan _Desktop-optimized_ untuk Dashboard Orang Tua.
- **Pemangkasan MVP Fase 1:** Fitur _Video Ringkasan Mingguan (FFmpeg)_ diganti menjadi _Halaman Laporan Interaktif_, dan mini-game dibatasi 2 permainan utama terlebih dahulu.
