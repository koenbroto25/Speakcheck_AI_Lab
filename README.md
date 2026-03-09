# Speak Check AI Lab

Aplikasi latihan berbicara bahasa Inggris berbasis web untuk siswa SMP dengan AI-powered feedback berbasis Web Speech API.

## 📁 Struktur Folder

```
speakcheck-app/
├── public/                      # Static assets
│   └── robots.txt
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── globals.css          # Global styles (Tailwind + custom)
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main application page
│   ├── components/
│   │   └── speakcheck/          # UI Components
│   │       ├── AliceAvatar.tsx  # AI Coach avatar
│   │       ├── Dashboard.tsx    # Main hub
│   │       ├── GameCard.tsx     # Neumorphic UI components
│   │       ├── GameScreen.tsx   # Main game component
│   │       ├── Login.tsx        # Student authentication
│   │       ├── NoticingRoom.tsx # Noticing Hypothesis mode
│   │       ├── Results.tsx      # Performance summary
│   │       └── index.ts         # Exports
│   ├── hooks/
│   │   └── speakcheck/          # Custom React Hooks
│   │       ├── useGame.ts       # Game logic & Feedback Engine
│   │       ├── useSpeech.ts     # Web Speech API hook
│   │       ├── useTTS.ts        # Text-to-Speech hook
│   │       └── index.ts         # Exports
│   ├── lib/
│   │   └── speakcheck/          # Utilities
│   │       ├── api.ts           # Google Apps Script API
│   │       ├── styles.ts        # Neumorphism design tokens
│   │       └── utils.ts         # Helper functions
│   └── types/
│       └── speakcheck/          # TypeScript types
│           └── index.ts         # Type definitions
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── README.md                    # This file
└── code.gs                      # Google Apps Script backend
```

## 🚀 Panduan Instalasi Lokal

### Prasyarat
- Node.js 18+ 
- npm atau bun
- Akun Google (untuk backend)
- Browser Chrome atau Edge (untuk Web Speech API)

### Langkah 1: Download dan Extract

```bash
# Extract file ZIP yang didownload
unzip speakcheck-app.zip
cd speakcheck-app
```

### Langkah 2: Install Dependencies

Menggunakan npm:
```bash
npm install
```

Atau menggunakan bun (lebih cepat):
```bash
bun install
```

### Langkah 3: Setup Environment Variables

```bash
# Copy file contoh
cp .env.example .env.local

# Edit file .env.local dan masukkan URL Google Apps Script Anda
# NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Langkah 4: Setup Backend (Google Apps Script)

1. **Buat Google Spreadsheet**
   - Buka [Google Drive](https://drive.google.com)
   - Buat Spreadsheet baru, beri nama "SpeakCheck_Database"

2. **Tambahkan Apps Script**
   - Di Spreadsheet, klik `Extensions > Apps Script`
   - Hapus kode yang ada
   - Copy seluruh isi file `code.gs` ke editor
   - Simpan (Ctrl+S)

3. **Inisialisasi Database**
   - Pilih fungsi `initializeSystem` dari dropdown
   - Klik tombol "Run"
   - Berikan izin yang diperlukan
   - Cek Spreadsheet - harus ada 3 sheet baru: Content_Bank, Students, Progress_Log

4. **Deploy sebagai Web App**
   - Klik `Deploy > New deployment`
   - Pilih tipe "Web app"
   - Set "Execute as" = "Me"
   - Set "Who has access" = "Anyone"
   - Klik "Deploy"
   - **Copy URL yang muncul** - ini akan digunakan di `.env.local`

### Langkah 5: Jalankan Aplikasi

```bash
# Development mode
npm run dev

# Atau
bun run dev
```

Buka browser dan akses `http://localhost:3000`

## 🎮 Fitur Utama

### 4 Game Modes
| Mode | Deskripsi |
|------|-----------|
| 📚 Grammar Lab | Latihan tata bahasa melalui berbicara |
| 📖 Vocab Builder | Perluasan kosakata |
| 🎤 Pronunciation Clinic | Latihan pengucapan |
| 🔍 The Noticing Room | Identifikasi dan koreksi error |

### Feedback Engine
Aplikasi mengimplementasikan 5 strategi feedback berdasarkan SLA Research:

| Kondisi | Strategi |
|---------|----------|
| Minor Error | Recast (Implicit) |
| Major Error | Clarification Request |
| Repeated Error | Explicit Correction |
| Logic Check Needed | Metalinguistic Clue |
| Vocabulary Recall | Elicitation |

### Akurasi Threshold
- **Pass**: Confidence ≥ 0.85
- **Encourage**: 0.70 - 0.85
- **Fail**: < 0.70

## 🌐 Browser Support

| Browser | Speech Recognition | Speech Synthesis |
|---------|-------------------|------------------|
| Chrome | ✅ Full Support | ✅ Full Support |
| Edge | ✅ Full Support | ✅ Full Support |
| Safari | ⚠️ Limited | ✅ Full Support |
| Firefox | ❌ Not Supported | ✅ Full Support |

## 📤 Upload ke GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Speak Check AI Lab"

# Add remote repository
git remote add origin https://github.com/USERNAME/speakcheck-app.git

# Push to GitHub
git push -u origin main
```

## 🚀 Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik "Add New Project"
4. Import repository GitHub Anda
5. Tambahkan Environment Variable:
   - Name: `NEXT_PUBLIC_GAS_API_URL`
   - Value: URL Google Apps Script Anda
6. Klik "Deploy"

## 📝 Lisensi

MIT License - Untuk penggunaan edukasi.

## 👨‍💻 Pengembang

Dibangun untuk penelitian tesis tentang Feedback Quality dan Noticing Hypothesis dalam pembelajaran bahasa Inggris sebagai bahasa asing (EFL).