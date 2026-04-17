# Firebase Data Logger - Dokumentasi Aplikasi

## 📱 Gambaran Umum

Aplikasi web Next.js dengan tampilan mobile yang menampilkan data real-time dari Firebase Realtime Database. Aplikasi memonitor path `messages` di Firebase dan menampilkan pesan masuk dalam interface card yang bersih dan mobile-optimized dengan update otomatis secara real-time.

## 🎯 Tujuan

Aplikasi ini berfungsi sebagai **data logger/dashboard real-time** untuk Firebase Realtime Database. Dirancang untuk:
- Memonitor dan menampilkan pesan/data yang dikirim ke Firebase secara real-time
- Menyediakan interface yang mudah untuk konfigurasi kredensial Firebase
- Menampilkan data sensor IoT, pesan chat, logs, atau data terstruktur lainnya yang tersimpan di Firebase

## ✨ Fitur Utama

### 1. **Tampilan Data Real-Time**
   - Sinkronisasi langsung dengan Firebase Realtime Database
   - Update otomatis saat data baru masuk
   - Menampilkan messages dari path `messages`
   - Mendukung berbagai struktur data (bekerja dengan format message apapun)

### 2. **Manajemen Konfigurasi Firebase**
   - Modal Settings di aplikasi untuk kredensial Firebase
   - Konfigurasi disimpan ke localStorage
   - Mendukung fallback dari environment variable
   - Tidak perlu hardcode kredensial Firebase

### 3. **UI Mobile-Optimized**
   - Design mobile-first yang bersih dan modern
   - Interface yang touch-friendly
   - Layout card-based untuk messages
   - Header gradient ungu dengan animasi smooth
   - Responsif di mobile maupun desktop
   - Menu hamburger dengan sidebar compact
   - Bottom navigation untuk akses cepat
   - Dark theme minimalis

### 4. **Penanganan Data yang Cerdas**
   - Auto-format timestamps
   - Menampilkan message terbaru dulu (urutan kronologis terbalik)
   - Menampilkan jumlah message
   - Menangani empty states dengan baik
   - Flexible field mapping (text/message, sender/user/name)

## 🏗️ Arsitektur

```
Firebase Datalogger
├── Firebase Context (State Management)
│   ├── Inisialisasi Firebase
│   ├── Manajemen config (localStorage)
│   ├── Koneksi database
│   └── Hook useFirebase()
│
├── Halaman
│   ├── Home (Tampilan Messages)
│   │   ├── Real-time message listener
│   │   ├── Daftar message dengan cards
│   │   └── Tombol Settings
│   └── Settings Modal
│       ├── Form Firebase config
│       └── Input validation
│
├── Komponen UI
│   ├── HamburgerMenu.tsx (Sidebar)
│   ├── BottomNav.tsx (Navigasi bawah)
│   └── SettingsModal.tsx
│
├── API Endpoints
│   ├── /api/rtdb/[...path] (Akses RTDB dinamis)
│   └── /api/public-files (Scan file HTML)
│
├── Pages Statis (/public)
│   ├── devices.html (Monitor devices)
│   └── api-docs.html (Dokumentasi API)
│
└── Alur Data
    Firebase RTDB → onValue listener → React State → UI Update
```

## 🔧 Tech Stack

| Teknologi | Versi | Tujuan |
|-----------|-------|--------|
| Next.js | 16.x | React framework dengan App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Firebase SDK | 10.x | Realtime Database |
| React Context | - | Global state management |

## 📊 Struktur Database Firebase

Aplikasi mengharapkan data dalam format ini:

```json
{
  "messages": {
    "unique_key_1": {
      "timestamp": "2026-04-06T10:00:00Z",
      "text": "Temperature: 25°C",
      "user": "Sensor-01"
    },
    "unique_key_2": {
      "timestamp": "2026-04-06T10:05:00Z",
      "message": "Motion detected",
      "sender": "Camera-02"
    }
  }
}
```

**Field yang Didukung (fleksibel):**
- `timestamp` atau `createdAt` - Otomatis diformat
- `text`, `message`, atau konten lainnya - Ditampilkan sebagai body message
- `user`, `sender`, atau `name` - Ditampilkan sebagai identifier pengirim
- Field lainnya - Ditampilkan sebagai JSON

## 🚀 Use Cases

### 1. **IoT Data Logger**
   - Monitor pembacaan sensor dari perangkat ESP32/Arduino
   - Tampilkan data suhu, kelembaban, gerak, GPS
   - Dashboard real-time untuk perangkat smart home

### 2. **Message Monitor**
   - Lihat pesan chat atau notifikasi
   - Monitor alert dan logs sistem
   - Viewer tiket customer support

### 3. **Dashboard Pengumpulan Data**
   - Response survey
   - Submit form
   - Pengumpulan feedback user
   - Event analytics

## 🔐 Pertimbangan Keamanan

⚠️ **Implementasi Saat Ini:**
- Config Firebase disimpan di localStorage browser (client-side only)
- Tidak ada layer autentikasi
- Memerlukan Firebase Realtime Database rules yang dikonfigurasi dengan benar

🔒 **Rekomendasi untuk Production:**
- Implementasi Firebase Authentication
- Setup database security rules yang proper
- Gunakan environment variables untuk konfigurasi tetap
- Tambahkan HTTPS enforcement (ditangani hosting provider)
- Pertimbangkan akses read-only untuk public dashboards

## 📝 Instruksi Setup

### Prasyarat
- Node.js 18+ (tested with Node.js 24)
- Firebase project dengan Realtime Database enabled
- Kredensial konfigurasi Firebase web app

### Instalasi
```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Jalankan production server
npm start
```

### Konfigurasi Firebase

**Opsi 1: Settings di Aplikasi (Recommended)**
1. Buka http://localhost:3000
2. Klik tombol ⚙️ Settings
3. Masukkan kredensial Firebase
4. Klik "Done" untuk menyimpan

**Opsi 2: Environment Variables**
Buat `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Mendapatkan Kredensial Firebase
1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project → Project Settings (⚙️)
3. Scroll ke "Your apps" → Web app (</>)
4. Copy nilai config object

## 🎨 Komponen UI

### Header
- Background gradient ungu (#667eea → #764ba2)
- Judul aplikasi dan subtitle
- Tombol hamburger dan settings
- Rounded corners dengan shadow

### Message Cards
- Background gelap dengan subtle border
- Border accent kiri (ungu)
- Timestamp (atas, abu-abu)
- Konten message (teks utama)
- Info pengirim (opsional, badge ungu)

### Settings Modal
- Slide up dari bawah (mobile-style)
- Input fields untuk semua opsi config Firebase
- Tombol save dengan gradient styling
- Overlay backdrop semi-transparan

### Empty States
- ⚙️ Saat Firebase belum dikonfigurasi
- 📭 Saat tidak ada messages
- Teks guidance yang membantu

## 🔌 API & Alur Data

```
User Membuka Aplikasi
    ↓
Cek localStorage untuk Config Firebase
    ↓
Inisialisasi Firebase SDK
    ↓
Connect ke Firebase Realtime Database
    ↓
Subscribe ke path 'messages' (onValue listener)
    ↓
Terima data snapshot
    ↓
Transform ke array & reverse (terbaru dulu)
    ↓
Render message cards
    ↓
Auto-update saat ada perubahan data (real-time)
```

## 🐛 Troubleshooting

**Issue: "Firebase Not Configured"**
- Solusi: Klik Settings dan masukkan kredensial Firebase

**Issue: Tidak ada messages yang muncul**
- Cek apakah data ada di path `messages` di Firebase
- Verifikasi URL database benar
- Cek browser console untuk errors

**Issue: Dev server tidak mau start**
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

**Issue: Tidak bisa connect ke Firebase**
- Verifikasi format URL database: `https://PROJECT_ID.firebaseio.com`
- Cek kredensial di Firebase console
- Pastikan Realtime Database sudah enabled di Firebase project

## 📦 Struktur Project

```
firebase-datalogger/
├── app/
│   ├── layout.tsx              # Root layout + Firebase provider wrapper
│   ├── page.tsx                # Halaman utama messages
│   ├── globals.css             # Tailwind + custom styles
│   ├── report/
│   │   └── page.tsx            # Halaman laporan harian
│   └── api/
│       ├── rtdb/
│       │   └── [...path]/      # API dinamis untuk akses RTDB
│       └── public-files/       # API untuk scan file HTML
├── components/
│   ├── HamburgerMenu.tsx       # Component sidebar menu
│   ├── BottomNav.tsx           # Component navigasi bawah
│   └── SettingsModal.tsx       # Modal konfigurasi Firebase
├── lib/
│   └── firebase-context.tsx    # Firebase context & hooks
├── public/
│   ├── devices.html            # Halaman monitor devices
│   └── api-docs.html           # Dokumentasi API
├── package.json                # Dependencies & scripts
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS setup
├── netlify.toml                # Konfigurasi Netlify
├── tsconfig.json               # TypeScript config
└── .env.local                  # Environment variables (gitignored)
```

## 🔄 Update Real-Time

Aplikasi menggunakan Firebase `onValue` listener yang:
- Otomatis menerima update saat data berubah
- Mempertahankan koneksi WebSocket
- Menangani offline/rekoneksi dengan baik
- Tidak perlu polling manual

## 🎯 Peningkatan Mendatang (Ide)

- [ ] Filter dan search messages
- [ ] Export messages ke CSV/JSON
- [ ] Pagination untuk dataset besar
- [ ] Custom color themes
- [ ] Dark mode support (sudah ada!)
- [ ] Integrasi Firebase Authentication
- [ ] Tulis/hapus messages
- [ ] Visualisasi data dengan charts
- [ ] Push notifications untuk messages baru
- [ ] Monitoring multiple database paths

## 📄 License

MIT License - Bebas digunakan, dimodifikasi, dan didistribusikan

## 👨‍💻 Catatan Developer

- Dibangun dengan Next.js App Router
- Menggunakan React Context untuk state management
- Mobile-first responsive design
- Tidak ada library UI eksternal
- Codebase yang bersih dan minimal
- Arsitektur production-ready

## 🔗 Link Berguna

- [Firebase Console](https://console.firebase.google.com)
- [Dokumentasi Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Dokumentasi Next.js](https://nextjs.org/docs)
- [Dokumentasi React](https://react.dev)

---

**Quick Start:**
```bash
npm install && npm run dev
```
Buka http://localhost:3000 → Konfigurasi Firebase → Lihat messages! 🚀
