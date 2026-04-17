# Dokumentasi CRUD IoT Sensors

Panduan lengkap untuk menggunakan API dan UI CRUD IoT Sensors.

## 📋 Daftar Isi

- [Overview](#overview)
- [Struktur Tabel](#struktur-tabel)
- [API Endpoints](#api-endpoints)
- [Contoh Penggunaan](#contoh-penggunaan)
- [UI Dashboard](#ui-dashboard)
- [Filter & Pencarian](#filter--pencarian)
- [Pagination](#pagination)

---

## Overview

CRUD IoT Sensors adalah sistem manajemen untuk sensor-sensor IoT yang terhubung dengan kolam ikan. Sistem ini memungkinkan Anda untuk:

- ✅ Menambah sensor baru
- ✅ Melihat daftar sensor
- ✅ Mengedit data sensor
- ✅ Menghapus sensor
- ✅ Filter berdasarkan status, jenis, dan kolam
- ✅ Pagination untuk data besar

---

## Struktur Tabel

Tabel `iot_sensors` memiliki kolom-kolom berikut:

| Kolom | Tipe | Wajib | Deskripsi |
|-------|------|-------|-----------|
| `id` | serial | Ya | Primary key, auto increment |
| `pond_id` | integer | Ya | ID kolam yang terhubung dengan sensor |
| `device_id` | varchar(100) | Ya | ID unik device (harus unik) |
| `sensor_type` | varchar(50) | Ya | Jenis sensor (temperature, ph, dissolved_oxygen, dll) |
| `status` | varchar(20) | Ya | Status sensor: active, inactive, maintenance, error |
| `last_reading` | numeric(10,2) | Tidak | Bacaan terakhir dari sensor |
| `unit` | varchar(20) | Tidak | Satuan pengukuran (°C, pH, mg/L, dll) |
| `installed_at` | timestamp | Tidak | Tanggal instalasi |
| `last_maintenance` | timestamp | Tidak | Tanggal maintenance terakhir |
| `next_maintenance` | timestamp | Tidak | Tanggal maintenance berikutnya |
| `created_at` | timestamp | Ya | Otomatis saat record dibuat |
| `updated_at` | timestamp | Ya | Otomatis saat record diupdate |

---

## API Endpoints

Base URL: `/api/iot-sensors`

### 1. **GET - Ambil Semua Sensor**

**Endpoint:** `GET /api/iot-sensors`

**Query Parameters:**

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `limit` | integer | Tidak | Jumlah data per halaman (default: 100) |
| `offset` | integer | Tidak | Jumlah data yang dilewati (default: 0) |
| `pond_id` | integer | Tidak | Filter berdasarkan ID kolam |
| `status` | string | Tidak | Filter berdasarkan status |
| `sensor_type` | string | Tidak | Filter berdasarkan jenis sensor |

**Contoh Request:**
```bash
GET /api/iot-sensors?limit=10&offset=0&status=active
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pond_id": 5,
      "device_id": "SENSOR-TEMP-001",
      "sensor_type": "temperature",
      "status": "active",
      "last_reading": "28.50",
      "unit": "°C",
      "installed_at": "2025-01-15T08:00:00.000Z",
      "last_maintenance": "2025-03-01T10:00:00.000Z",
      "next_maintenance": "2025-04-01T10:00:00.000Z",
      "created_at": "2025-01-15T08:00:00.000Z",
      "updated_at": "2025-03-20T14:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0
  }
}
```

---

### 2. **GET - Ambil Sensor Berdasarkan ID**

**Endpoint:** `GET /api/iot-sensors?id={id}`

**Contoh Request:**
```bash
GET /api/iot-sensors?id=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "pond_id": 5,
    "device_id": "SENSOR-TEMP-001",
    "sensor_type": "temperature",
    "status": "active",
    "last_reading": "28.50",
    "unit": "°C",
    "installed_at": "2025-01-15T08:00:00.000Z",
    "last_maintenance": "2025-03-01T10:00:00.000Z",
    "next_maintenance": "2025-04-01T10:00:00.000Z",
    "created_at": "2025-01-15T08:00:00.000Z",
    "updated_at": "2025-03-20T14:30:00.000Z"
  }
}
```

---

### 3. **POST - Buat Sensor Baru**

**Endpoint:** `POST /api/iot-sensors`

**Body (JSON):**

| Field | Tipe | Wajib | Deskripsi |
|-------|------|-------|-----------|
| `pond_id` | integer | Ya | ID kolam |
| `device_id` | string | Ya | Device ID (harus unik) |
| `sensor_type` | string | Ya | Jenis sensor |
| `status` | string | Tidak | Status (default: "active") |
| `last_reading` | number | Tidak | Bacaan terakhir |
| `unit` | string | Tidak | Satuan |
| `installed_at` | string | Tidak | Tanggal instalasi (ISO 8601) |
| `last_maintenance` | string | Tidak | Tanggal maintenance terakhir |
| `next_maintenance` | string | Tidak | Tanggal maintenance berikutnya |

**Contoh Request:**
```bash
POST /api/iot-sensors
Content-Type: application/json

{
  "pond_id": 5,
  "device_id": "SENSOR-PH-002",
  "sensor_type": "ph",
  "status": "active",
  "last_reading": 7.2,
  "unit": "pH",
  "installed_at": "2025-03-20T08:00:00.000Z"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Sensor berhasil dibuat",
  "data": {
    "id": 2,
    "pond_id": 5,
    "device_id": "SENSOR-PH-002",
    "sensor_type": "ph",
    "status": "active",
    "last_reading": "7.20",
    "unit": "pH",
    "installed_at": "2025-03-20T08:00:00.000Z",
    "last_maintenance": null,
    "next_maintenance": null,
    "created_at": "2025-03-20T08:00:00.000Z",
    "updated_at": "2025-03-20T08:00:00.000Z"
  }
}
```

**Response (Error - 409 Conflict):**
```json
{
  "success": false,
  "error": "Device ID sudah terdaftar"
}
```

---

### 4. **PUT - Update Sensor**

**Endpoint:** `PUT /api/iot-sensors?id={id}`

**Body (JSON):** Sama seperti POST, tapi semua field opsional

**Contoh Request:**
```bash
PUT /api/iot-sensors?id=1
Content-Type: application/json

{
  "status": "maintenance",
  "last_reading": 29.1,
  "next_maintenance": "2025-05-01T10:00:00.000Z"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Sensor berhasil diupdate",
  "data": {
    "id": 1,
    "pond_id": 5,
    "device_id": "SENSOR-TEMP-001",
    "sensor_type": "temperature",
    "status": "maintenance",
    "last_reading": "29.10",
    "unit": "°C",
    "installed_at": "2025-01-15T08:00:00.000Z",
    "last_maintenance": "2025-03-01T10:00:00.000Z",
    "next_maintenance": "2025-05-01T10:00:00.000Z",
    "created_at": "2025-01-15T08:00:00.000Z",
    "updated_at": "2025-03-20T15:00:00.000Z"
  }
}
```

---

### 5. **DELETE - Hapus Sensor**

**Endpoint:** `DELETE /api/iot-sensors?id={id}`

**Contoh Request:**
```bash
DELETE /api/iot-sensors?id=1
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Sensor berhasil dihapus"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Sensor tidak ditemukan"
}
```

---

## UI Dashboard

Akses dashboard IoT Sensors di:

```
http://localhost:3000/iot-sensors
```

### Fitur UI:

1. **Statistik Real-time**
   - Total sensor
   - Sensor aktif
   - Sensor perlu maintenance

2. **Filter Cepat**
   - Filter berdasarkan status
   - Filter berdasarkan jenis sensor
   - Filter berdasarkan ID kolam

3. **Tabel Data**
   - Menampilkan semua sensor
   - Pagination otomatis
   - Badge status dengan warna
   - Tombol Edit dan Hapus

4. **Form Modal**
   - Tambah sensor baru
   - Edit sensor existing
   - Validasi input
   - Date picker untuk tanggal

---

## Filter & Pencarian

### Status yang Tersedia:

| Status | Deskripsi | Warna Badge |
|--------|-----------|-------------|
| `active` | Sensor aktif dan berfungsi | 🟢 Hijau |
| `inactive` | Sensor tidak aktif | ⚪ Abu-abu |
| `maintenance` | Sensor sedang maintenance | 🟡 Kuning |
| `error` | Sensor error/rusak | 🔴 Merah |

### Jenis Sensor Umum:

- `temperature` - Sensor suhu
- `ph` - Sensor pH (keasaman)
- `dissolved_oxygen` - Sensor oksigen terlarut
- `turbidity` - Sensor kekeruhan
- `water_level` - Sensor ketinggian air
- `ammonia` - Sensor amonia
- `salinity` - Sensor salinitas

---

## Pagination

Pagination digunakan untuk performa saat data banyak:

**Parameter:**
- `limit`: Jumlah data per halaman (default: 100)
- `offset`: Data yang dilewati (default: 0)

**Contoh Pagination:**

```bash
# Halaman 1 (data 1-10)
GET /api/iot-sensors?limit=10&offset=0

# Halaman 2 (data 11-20)
GET /api/iot-sensors?limit=10&offset=10

# Halaman 3 (data 21-30)
GET /api/iot-sensors?limit=10&offset=20
```

**Response Pagination:**
```json
{
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0
  }
}
```

---

## Contoh Penggunaan dengan cURL

### 1. Tambah Sensor Baru

```bash
curl -X POST http://localhost:3000/api/iot-sensors \
  -H "Content-Type: application/json" \
  -d '{
    "pond_id": 1,
    "device_id": "SENSOR-TEMP-001",
    "sensor_type": "temperature",
    "status": "active",
    "last_reading": 28.5,
    "unit": "°C"
  }'
```

### 2. Lihat Semua Sensor

```bash
curl http://localhost:3000/api/iot-sensors
```

### 3. Filter Sensor Aktif

```bash
curl "http://localhost:3000/api/iot-sensors?status=active"
```

### 4. Update Sensor

```bash
curl -X PUT "http://localhost:3000/api/iot-sensors?id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance",
    "next_maintenance": "2025-05-01T10:00:00.000Z"
  }'
```

### 5. Hapus Sensor

```bash
curl -X DELETE "http://localhost:3000/api/iot-sensors?id=1"
```

---

## Error Handling

Semua response API memiliki format standar:

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Pesan error",
  "message": "Detail error (opsional)"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created (POST berhasil)
- `400` - Bad Request (validasi gagal)
- `404` - Not Found (sensor tidak ditemukan)
- `409` - Conflict (device_id sudah ada)
- `500` - Internal Server Error

---

## Tips & Best Practices

1. **Gunakan Filter**: Untuk data banyak, gunakan filter untuk mempercepat query
2. **Pagination**: Gunakan limit kecil (10-50) untuk performa optimal
3. **Device ID Unik**: Pastikan device_id selalu unik
4. **Update Berkala**: Update `last_reading` secara berkala via API
5. **Maintenance Schedule**: Gunakan `next_maintenance` untuk tracking jadwal maintenance

---

## Troubleshooting

### Error: "Device ID sudah terdaftar"
- Device ID harus unik
- Gunakan device_id yang berbeda atau update sensor yang sudah ada

### Error: "Sensor tidak ditemukan"
- Pastikan ID sensor benar
- Sensor mungkin sudah dihapus

### Error: "Field wajib tidak lengkap"
- Pastikan `pond_id`, `device_id`, dan `sensor_type` diisi

---

## Butuh Bantuan?

Untuk pertanyaan atau masalah:
1. Cek log di terminal server
2. Lihat dokumentasi Drizzle ORM: https://orm.drizzle.team
3. Cek database langsung via Neon dashboard
