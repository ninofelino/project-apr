# Integrasi MCP (Model Context Protocol) dengan Database Neon

Panduan ini menjelaskan cara menghubungkan klien MCP ke database Neon Postgres Anda dan menggunakannya secara efektif.

## 📋 Daftar Isi

- [Apa itu MCP?](#apa-itu-mcp)
- [Server MCP yang Tersedia](#server-mcp-yang-tersedia)
- [Petunjuk Setup](#petunjuk-setup)
- [Menggunakan MCP dengan Klien yang Berbeda](#menggunakan-mcp-dengan-klien-yang-berbeda)
- [Tool yang Tersedia](#tool-yang-tersedia)
- [Praktik Keamanan Terbaik](#praktik-keamanan-terbaik)
- [Pemecahan Masalah](#pemecahan-masalah)

---

## Apa itu MCP?

**Model Context Protocol (MCP)** memungkinkan asisten coding AI untuk berinteraksi langsung dengan database Anda, menyediakan:

- 📊 **Introspeksi database** - Memahami struktur tabel dan relasi
- 🔍 **Query data langsung** - Query data real untuk respons yang kontekstual
- ✅ **Validasi skema** - Memverifikasi query sebelum dijalankan
- 🐛 **Bantuan debugging** - Menguji dan debug query database

---

## Server MCP yang Tersedia

Proyek Anda menyertakan **dua opsi server MCP**:

### 1. **Server MCP PostgreSQL Standar** (Direkomendasikan untuk sebagian besar kasus)
- **Package**: `@modelcontextprotocol/server-postgres`
- **Tujuan**: Eksekusi query SQL langsung
- **Terbaik untuk**: Query cepat, eksplorasi data

### 2. **Server MCP Drizzle Kustom** (Lanjutan)
- **Lokasi**: `src/mcp/server.ts`
- **Tujuan**: Operasi database yang sadar Drizzle ORM
- **Terbaik untuk**: Query berbasis skema, integrasi Drizzle

---

## Petunjuk Setup

### Prasyarat

```bash
# Pastikan Node.js terinstall
node --version

# Install dependencies
npm install
```

### Opsi 1: Integrasi VS Code

1. **Install VS Code** (jika belum terinstall)
2. **Install ekstensi Claude Code** atau ekstensi lain yang kompatibel dengan MCP
3. File `.vscode/mcp.json` sudah dikonfigurasi di proyek Anda
4. Buka proyek Anda di VS Code
5. Server MCP akan terdeteksi secara otomatis

### Opsi 2: Integrasi Claude Desktop

1. **Lokasi config Claude Desktop**:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Salin konfigurasi**:
   ```bash
   # Salin dari config proyek
   cp .claude/claude_desktop_config.json ~/.config/Claude/claude_desktop_config.json
   # Sesuaikan path dengan OS Anda
   ```

3. **Restart Claude Desktop**

### Opsi 3: Integrasi Cursor

1. Buka pengaturan Cursor
2. Navigasi ke **MCP Servers**
3. Tambahkan konfigurasi dari `.vscode/mcp.json`
4. Restart Cursor

### Opsi 4: ChatGPT Desktop

1. Buka pengaturan ChatGPT
2. Pergi ke **Konfigurasi MCP**
3. Tambahkan konfigurasi server
4. Restart aplikasi

---

## Menggunakan MCP dengan Klien yang Berbeda

### VS Code

Setelah terhubung, Anda dapat meminta asisten AI untuk:

```
"Tabel apa saja ada di database saya?"
"Tampilkan skema untuk tabel users"
"Hitung jumlah baris di semua tabel"
"Query pesanan terbaru"
```

### Claude Desktop

Gunakan query dalam bahasa natural:

```
"Bisa cek berapa banyak user di database?"
"Apa struktur tabel products?"
"Tampilkan 10 pesanan terakhir"
```

### Cursor

Cursor dapat menggunakan MCP untuk:

- Memahami skema database saat menulis query
- Memvalidasi query Drizzle ORM
- Menghasilkan migrasi
- Debug masalah query

---

## Tool yang Tersedia

### Server MCP PostgreSQL Standar

| Tool | Deskripsi | Contoh |
|------|-------------|---------|
| `query` | Eksekusi query SQL | `SELECT * FROM users LIMIT 10` |
| `list_tables` | Daftar semua tabel | Menampilkan semua tabel di schema public |
| `describe_table` | Dapatkan skema tabel | Kolom, tipe, constraint |

### Server MCP Drizzle Kustom

| Tool | Deskripsi | Parameter |
|------|-------------|------------|
| `query_database` | Eksekusi SQL mentah | `sql`, `params` (opsional) |
| `list_tables` | Daftar tabel dengan kolom | Tidak ada |
| `get_table_schema` | Info skema detail | `table_name` |
| `get_drizzle_schema` | Skema Drizzle ORM | Tidak ada |
| `count_rows` | Hitung baris | `table_name` (opsional) |

#### Contoh Query

**Daftar semua tabel:**
```
Gunakan tool list_tables
```

**Dapatkan skema tabel:**
```
Gunakan get_table_schema dengan table_name="users"
```

**Eksekusi query kustom:**
```
Gunakan query_database dengan:
sql: "SELECT * FROM users WHERE role = $1 LIMIT 10"
params: ["admin"]
```

**Hitung baris:**
```
Gunakan count_rows (dengan atau tanpa table_name)
```

---

## Praktik Keamanan Terbaik

### ⚠️ Pedoman Keamanan Penting

1. **Jangan pernah commit kredensial**
   - `.env.local` sudah ada di `.gitignore`
   - Gunakan URL spesifik lingkungan (environment)

2. **Gunakan connection pooling**
   - URL Neon Anda sudah menggunakan `-pooler`
   - Mencegah kehabisan koneksi

3. **Pertimbangkan akses read-only**
   - Buat user database read-only untuk MCP:
   ```sql
   CREATE ROLE mcp_readonly WITH LOGIN PASSWORD 'your_password';
   GRANT CONNECT ON DATABASE neondb TO mcp_readonly;
   GRANT USAGE ON SCHEMA public TO mcp_readonly;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO mcp_readonly;
   ```

4. **Gunakan kredensial terpisah untuk development**
   - Jangan gunakan kredensial produksi di lokal
   - Buat file `.env.development`

5. **Audit query**
   - Monitor aktivitas query di dashboard Neon
   - Setup alert untuk aktivitas tidak biasa

---

## Pemecahan Masalah

### Server MCP Tidak Terhubung

**Periksa DATABASE_URL Anda:**
```bash
# Tes koneksi
psql "postgresql://neondb_owner:npg_vgWolr8ax7GJ@ep-lucky-fog-anntse4v-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

**Verifikasi environment variables:**
```bash
# Cek apakah .env.local ada
ls -la .env.local

# Verifikasi DATABASE_URL sudah diset
cat .env.local | grep DATABASE_URL
```

### Error Timeout

- Neon serverless mungkin memiliki cold start (1-3 detik)
- Tingkatkan timeout di pengaturan klien MCP
- Cek status database di dashboard Neon

### Permission Denied

Pastikan user database Anda memiliki permission yang benar:
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO neondb_owner;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO neondb_owner;
```

### Server MCP Kustom Tidak Bekerja

**Install dependencies yang diperlukan:**
```bash
npm install ts-node typescript @types/pg
```

**Tes server secara manual:**
```bash
# Jalankan server MCP
npx ts-node src/mcp/server.ts
```

---

## Skema Database Anda

Proyek Anda menyertakan **25+ tabel** termasuk:

- `users` - Akun pengguna
- `products` - Katalog produk
- `orders` - Manajemen pesanan
- `ponds` - Manajemen kolam ikan
- `iot_sensors` - Data sensor IoT
- `restaurant_orders` - POS restoran
- `warehouse_items` - Manajemen inventori
- `employees` - Data karyawan
- Dan lainnya...

Total skema: **631 baris** definisi Drizzle ORM

---

## Mulai Cepat

1. **Pilih klien MCP Anda** (VS Code, Claude Desktop, Cursor, dll)
2. **Konfigurasi menggunakan petunjuk di atas**
3. **Tes dengan query sederhana:**
   ```
   "Daftar semua tabel di database saya"
   ```
4. **Mulai membangun dengan bantuan AI!**

---

## Sumber Daya Tambahan

- [Dokumentasi Neon](https://neon.tech/docs)
- [Dokumentasi Drizzle ORM](https://orm.drizzle.team)
- [Spesifikasi MCP](https://modelcontextprotocol.io)
- [Perintah Drizzle Kit](https://orm.drizzle.team/kit-docs)

---

## Butuh Bantuan?

Untuk masalah atau pertanyaan:
1. Cek dashboard Neon: https://console.neon.tech
2. Review dokumen Drizzle: https://orm.drizzle.team/docs/overview
3. Cek log server MCP di aplikasi klien Anda
