# 🌱 Kebun Aksara

Platform pembelajaran literasi dan numerasi interaktif berbasis _gamification_ untuk anak usia dini, dilengkapi dengan sistem kesulitan adaptif (_spaced repetition_), kebun virtual yang tumbuh secara dinamis, serta dashboard analitik untuk orang tua.

---

## 🏗️ Arsitektur Proyek

Proyek ini menggunakan pendekatan **Decoupled Full-Stack Architecture** dalam struktur monorepo:

```text
kebun-aksara/
├── backend/                  # Django REST Framework API & Rule Engine
│   ├── config/               # Konfigurasi proyek, settings, & routing utama
│   └── apps/
│       ├── users/            # Manajemen akun orang tua, PIN, & profil anak
│       ├── curriculum/       # Kurikulum, master soal, & AdaptiveQuizService
│       ├── garden/           # State kebun (JSONB), inventaris, & RewardGachaService
│       └── engagement/       # Log harian, StreakEvaluationService, & misi keluarga
└── frontend/                 # Next.js (App Router) + TypeScript + Tailwind CSS
    └── src/
        ├── app/
        │   ├── (marketing)/  # Landing Page publik
        │   ├── (parent)/     # Dashboard Orang Tua & manajemen misi
        │   └── (child)/      # Dunia Anak (Peta, Kuis Adaptif, Kebun Hidup)
        ├── components/       # Komponen UI modular
        └── lib/              # API client, state helpers, & Web Audio manager
```
