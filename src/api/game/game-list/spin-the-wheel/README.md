# Spin The Wheel Game Module

Game edukatif berbasis multiple-choice question dengan sistem spin untuk memilih pertanyaan random.

## 📁 Struktur File

```
spin-the-wheel/
├── index.ts              # Export router
├── spin.router.ts        # Router config
├── spin.controller.ts    # Endpoint handlers
├── question-bank.ts      # Hardcoded questions
└── README.md            # Dokumentasi ini
```

## 🎮 Game Flow

1. User masuk ke game tanpa login (tanpa auth)
2. User memasukkan `displayName`
3. User memilih `topic` (math, language, history, programming)
4. User melakukan **5 spin** → setiap spin dapat 1 pertanyaan random
5. User menjawab pertanyaan:
   - **Benar** → +20 poin
   - **Salah** → +0 poin
6. Total maksimal: **100 poin** (5 pertanyaan × 20)
7. Setelah selesai, frontend submit: `displayName`, `topic`, `score`, `timeSpent`
8. User diarahkan ke **leaderboard**

## 🔌 API Endpoints

### Base URL
```
/api/game/game-type/spin-the-wheel
```

### 1. GET /topics
Mendapatkan daftar topik yang tersedia.

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "topics": ["math", "language", "history", "programming"]
  }
}
```

### 2. GET /question?topic=xxx
Mendapatkan 1 pertanyaan random dari topik yang dipilih.

**Query Params:**
- `topic` (string, required): `math` | `language` | `history` | `programming`

**Response:**
```json
{
  "question": "7 × 8 = ?",
  "options": ["54", "56", "58", "60"],
  "answerIndex": 1
}
```

### 3. POST /submit
Submit skor ke leaderboard.

**Body:**
```json
{
  "displayName": "Hanif",
  "topic": "math",
  "score": 100,
  "timeSpent": 42
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Submitted"
}
```

### 4. GET /leaderboard?topic=xxx
Mendapatkan leaderboard per topik.

**Query Params:**
- `topic` (string, required): `math` | `language` | `history` | `programming`

**Response:**
```json
{
  "leaderboard": [
    { "displayName": "Rara", "score": 100, "timeSpent": 38 },
    { "displayName": "Hanif", "score": 100, "timeSpent": 42 },
    { "displayName": "Dimas", "score": 80, "timeSpent": 55 }
  ]
}
```

**Sorting:**
1. Score tertinggi (DESC)
2. Jika score sama → Waktu tercepat (timeSpent ASC)
3. Jika score & waktu sama → Created first (created_at ASC)

## 💾 Database Schema

Model: `SpinTheWheelScore`

```prisma
model SpinTheWheelScore {
  id          Int      @id @default(autoincrement())
  displayName String
  topic       String
  score       Int
  timeSpent   Int      // dalam detik
  created_at  DateTime @default(now())
  
  @@index([topic, score, timeSpent])
}
```

## 📚 Question Bank

Pertanyaan disimpan hardcoded di `question-bank.ts`:

- **Math**: 5 pertanyaan (matematika dasar)
- **Language**: 5 pertanyaan (bahasa Indonesia & Inggris)
- **History**: 5 pertanyaan (sejarah Indonesia & dunia)
- **Programming**: 5 pertanyaan (coding basics)

Setiap topik memiliki minimal 5 pertanyaan untuk 5 kali spin.

## 🧪 Testing

Lihat file: `TESTING_SPIN_THE_WHEEL.md` di root project.

## 📄 Dokumentasi API

Lihat file: `APIDOG_SPIN_THE_WHEEL.md` di root project untuk format Apidog.

## ⚙️ Konfigurasi

Tidak ada konfigurasi khusus. Module ini:
- ✅ Tidak memerlukan authentication
- ✅ Tidak memerlukan file upload
- ✅ Tidak memerlukan external API
- ✅ Menggunakan database lokal PostgreSQL

## 🔄 Future Improvements

- [ ] Tambah lebih banyak pertanyaan per topik
- [ ] Tambah topik baru (science, geography, dll)
- [ ] Implementasi difficulty levels
- [ ] Tambah timer per pertanyaan
- [ ] Leaderboard global (all topics)
