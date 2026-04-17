# Quick Start Guide

## 🚀 Cara Menjalankan Aplikasi

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment
Environment variables sudah dikonfigurasi di `.env.local`:
- **OpenRouter AI** - Chat dengan database (gratis!)
- **Database** - Neon PostgreSQL connection
- **Google OAuth** - Google Tasks authentication
- **Prompts API** - External app access

### 3. Jalankan Development Server
```bash
npm run dev
```

Server akan berjalan di: http://localhost:3000

## 📱 Pages & Features

| Page | URL | Description |
|------|-----|-------------|
| **Home** | `/` | API documentation dashboard |
| **AI Chat** | `/chat` | 💬 Chat dengan database |
| **Google Tasks** | `/google-tasks` | 📋 Manage Google Tasks |
| **Prompts** | `/prompts` | 💬 Manage AI & music prompts |
| **IoT Sensors** | `/iot-sensors` | 🌐 Manage IoT devices |
| **Favorite URLs** | `/favorite-urls` | ⭐ Bookmark API endpoints |

## 🤖 AI Chat - Natural Language Database Queries

Buka: http://localhost:3000/chat

### Contoh Pertanyaan:
```
"List all tables in the database"
"Show me data from users table"
"How many iot_sensors are there?"
"Show schema for iot_sensors"
"Get sensor readings with limit 5"
```

### Cara Kerja:
1. Ketik pertanyaan dalam bahasa natural
2. AI otomatis mendeteksi intent (table, action)
3. Query database dijalankan
4. AI menjelaskan hasilnya

### Model AI Gratis:
- MiniMax M2.5 (default) - Cepat & gratis
- Gemma 4 26B/31B - Google
- Nemotron 3 120B - NVIDIA
- Qwen3 Next 80B - Alibaba
- Dan 4 model gratis lainnya

## 📡 Test API

### General Data API

#### Lihat dokumentasi help:
```
http://localhost:3000/api/data?help=true
```

#### List semua tabel:
```
http://localhost:3000/api/data?action=tables
```

#### Ambil data dari tabel users:
```
http://localhost:3000/api/data?action=fetch&table=users
```

#### Ambil data dengan pagination:
```
http://localhost:3000/api/data?action=fetch&table=users&limit=10&offset=0
```

#### Ambil user berdasarkan ID:
```
http://localhost:3000/api/data?action=fetch&table=users&id=1
```

#### Lihat struktur tabel:
```
http://localhost:3000/api/data?action=schema&table=users
```

#### Hitung jumlah record:
```
http://localhost:3000/api/data?action=count&table=users
```

## 🌐 IoT Sensors API

### GET - Ambil Data Sensor
```
http://localhost:3000/api/iot-sensors              # Semua sensor
http://localhost:3000/api/iot-sensors?id=1         # Berdasarkan ID
http://localhost:3000/api/iot-sensors?status=active  # Filter status
http://localhost:3000/api/iot-sensors?pond_id=1    # Filter by pond
```

### POST - Buat Sensor Baru
```bash
curl -X POST http://localhost:3000/api/iot-sensors \
  -H "Content-Type: application/json" \
  -d '{
    "pond_id": 1,
    "device_id": "SENSOR_001",
    "sensor_type": "temperature",
    "status": "active"
  }'
```

### PUT - Update Sensor
```bash
curl -X PUT "http://localhost:3000/api/iot-sensors?id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance"
  }'
```

### DELETE - Hapus Sensor
```bash
curl -X DELETE "http://localhost:3000/api/iot-sensors?id=1"
```

## ⭐ Favorite URLs API

### GET - Ambil Favorite URLs
```
http://localhost:3000/api/favorite-urls              # Semua favorites
http://localhost:3000/api/favorite-urls?is_api=true  # API saja
http://localhost:3000/api/favorite-urls?category=api # Filter kategori
```

### POST - Tambah Favorite
```bash
curl -X POST http://localhost:3000/api/favorite-urls \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My API",
    "url": "https://api.example.com",
    "is_api": true
  }'
```

### PUT - Update Favorite
```bash
curl -X PUT "http://localhost:3000/api/favorite-urls?id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

### DELETE - Hapus Favorite
```bash
curl -X DELETE "http://localhost:3000/api/favorite-urls?id=1"
```

## 🤖 Test AI Connection

```bash
./test-openrouter.sh
```

Expected output: `✅ OpenRouter API test successful!`

## 📋 API Parameters Reference

### General Data API
| Parameter | Required | Description |
|-----------|----------|-------------|
| `action` | Yes | `tables`, `fetch`, `schema`, `count` |
| `table` | For most actions | Nama tabel database |
| `limit` | No | Jumlah data maksimal (default: 100) |
| `offset` | No | Jumlah data yang dilewati (default: 0) |
| `id` | No | Ambil data berdasarkan ID |
| `help` | No | Tampilkan dokumentasi |

### AI Chat API
| Parameter | Required | Description |
|-----------|----------|-------------|
| `message` | Yes | Pertanyaan user |
| `model` | No | Model AI (default: minimax/minimax-m2.5:free) |
| `conversationHistory` | No | Array pesan sebelumnya |

### IoT Sensors API
| Parameter | Method | Description |
|-----------|--------|-------------|
| `id` | GET/PUT/DELETE | Sensor ID |
| `pond_id` | GET | Filter berdasarkan pond |
| `status` | GET | Filter status (active/inactive/maintenance) |
| `sensor_type` | GET | Filter tipe sensor |
| `limit` | GET | Max data (default: 100) |
| `offset` | GET | Pagination offset |

### Favorite URLs API
| Parameter | Method | Description |
|-----------|--------|-------------|
| `id` | GET/PUT/DELETE | Favorite URL ID |
| `category` | GET | Filter kategori |
| `is_api` | GET | Filter tipe (true/false) |
| `limit` | GET | Max data (default: 100) |
| `offset` | GET | Pagination offset |

## 🗄️ Database Schema

Aplikasi mengintrospeksi database Neon dan menemukan 43+ tabel, termasuk:

- `users` - Data pengguna
- `fish_products` - Produk ikan
- `fish_auctions` - Lelang ikan
- `iot_sensors` - Device sensor IoT
- `sensor_readings` - Data pembacaan sensor
- `favorite_urls` - URL dan API endpoint favorit
- Dan lainnya...

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
./test-openrouter.sh # Test AI connection
./drizzle-studio.sh  # Buka Drizzle Studio
npm run db:studio    # Buka Drizzle Studio
npm run db:introspect  # Introspeksi database
npm run db:generate  # Generate migrasi
npm run db:migrate   # Jalankan migrasi
```

## 🏗️ Build untuk Production

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

**AI Chat tidak bekerja:**
```bash
./test-openrouter.sh  # Test koneksi
```

**Server tidak mau start:**
```bash
rm -rf node_modules && npm install
npm run dev
```

**Port 3000 sudah digunakan:**
```bash
lsof -ti:3000 | xargs kill -9
# atau
PORT=3001 npm run dev
```

Lihat [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) untuk solusi lengkap.
