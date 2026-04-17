# 📘 Panduan Penggunaan AI Chat - UMKM Perikanan

Dokumen ini menjelaskan cara menggunakan fitur AI Chat untuk mengelola dan menanyakan data dari dua sumber database yang terintegrasi: **Neon (PostgreSQL)** dan **Firebase Realtime Database (RTDB)**.

---

## 1. Integrasi Database

Aplikasi ini terhubung ke dua jenis database:
1.  **PostgreSQL (Neon)**: Database utama untuk data relasional (tabel, transaksi, master data).
2.  **Firebase RTDB**: Database real-time untuk data live (log sensor, pesan masuk cepat).

AI akan secara otomatis mendeteksi database mana yang perlu diakses berdasarkan konteks pertanyaan Anda.

---

## 2. Cara Chat dengan PostgreSQL (Neon)

Gunakan ini untuk menanyakan data yang bersifat terstruktur di dalam tabel.

*   **Kata Kunci Utama**: Sebutkan nama tabel (misal: `users`, `fish_products`) atau gunakan kata "tabel", "database", "kolom".
*   **Contoh Pertanyaan**:
    *   `"List semua tabel yang tersedia"`
    *   `"Tampilkan data dari tabel users"`
    *   `"Berapa jumlah produk di tabel fish_products?"`
    *   `"Tunjukkan struktur kolom tabel iot_sensors"`
    *   `"Cari data dengan ID 5 di tabel fish_auctions"`

---

## 3. Cara Chat dengan Firebase (RTDB)

Gunakan ini untuk menganalisis data real-time yang sedang muncul di sidebar kiri/menu aplikasi.

*   **Penting**: AI akan menjawab berdasarkan **Path Database** yang sedang aktif dipilih di sidebar.
*   **Kata Kunci Utama**: "RTDB", "Firebase", "Live data", "Pesan", "Sensor live".
*   **Contoh Pertanyaan**:
    *   `"Apa isi pesan terbaru di RTDB?"`
    *   `"Ringkas data live yang ada di Firebase saat ini"`
    *   `"Siapa pengirim terakhir di data RTDB?"`
    *   `"Ada berapa banyak log masuk di path ini?"`

---

## 4. Pengaturan Format Respon (Modern UI)

Di dekat kotak input chat, terdapat opsi format respon yang bisa Anda pilih sebelum mengirim pesan:

| Format | Ikon | Kegunaan |
| :--- | :--- | :--- |
| **Natural** | `Type` | Respon dalam bentuk percakapan manusia biasa. |
| **Table** | `Table` | Menampilkan data dalam bentuk tabel Markdown yang rapi. |
| **JSON** | `Code` | Menampilkan data mentah dalam blok kode berwarna (Syntax Highlighting). |
| **Markdown** | `File` | Respon dengan format teks kaya (header, list, bold). |

---

## 5. Fitur Tambahan

*   **Attach File (+)**: Gunakan tombol plus untuk melampirkan file. AI akan mendapatkan konteks dari file yang Anda lampirkan.
*   **Sidebar RTDB**: Di HP, klik menu di pojok kiri atas untuk melihat data live. Di desktop, sidebar akan selalu terlihat di sisi kiri.
*   **Quick Path Select**: Di sidebar, Anda bisa menekan tombol cepat seperti `messages` atau `logs` untuk berpindah sumber data RTDB secara instan.

---

## 6. Tips Troubleshooting

*   **Tampilan Tanpa Style**: Jika tampilan terlihat berantakan, pastikan Anda telah menjalankan `npm install` dan Tailwind CSS sudah terkonfigurasi.
*   **Firebase Not Configured**: Pastikan file `.env.local` sudah berisi kredensial `NEXT_PUBLIC_FIREBASE_*`.
*   **JSON Terlalu Lebar**: Gunakan fitur scroll horizontal pada blok kode jika JSON melebihi lebar layar.

---

*Dokumen ini dibuat secara otomatis oleh Gemini CLI - April 2026*
