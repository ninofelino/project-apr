#!/bin/bash

# Configuration
VERCEL_EMAIL="tutyfelino@gmail.com"
APP_NAME=$(grep NEXT_PUBLIC_APP_NAME .env.local | cut -d '=' -f2)

echo "🚀 Memulai proses deployment untuk: $APP_NAME"

# 1. Cek apakah Vercel CLI sudah terinstall
if ! command -v vercel &> /dev/null
then
    echo "📦 Vercel CLI tidak ditemukan. Menginstall secara global..."
    npm install -g vercel
fi

# 2. Login ke Vercel
echo "🔐 Login ke Vercel dengan email: $VERCEL_EMAIL"
echo "Silakan cek email Anda untuk verifikasi jika diminta."
vercel login $VERCEL_EMAIL

# 3. Inisialisasi Project (jika belum)
echo "🏗️ Menghubungkan project ke Vercel..."
vercel link --yes

# 4. Push Environment Variables ke Vercel
echo "⚙️ Sinkronisasi Environment Variables dari .env.local ke Vercel..."

# Fungsi untuk menambah env var ke vercel
function add_env() {
    local key=$1
    local value=$2
    if [ ! -z "$value" ]; then
        echo "Menambahkan $key..."
        echo -n "$value" | vercel env add "$key" production --force &> /dev/null
    fi
}

# Baca .env.local dan upload ke Vercel
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Skip komentar dan baris kosong
    [[ $key =~ ^#.* ]] && continue
    [[ -z $key ]] && continue
    
    # Bersihkan key dan value
    key=$(echo $key | xargs)
    value=$(echo $value | xargs)
    
    add_env "$key" "$value"
done < .env.local

# 5. Deploy ke Production
echo "🛫 Melakukan deployment ke Production..."
vercel --prod --yes

echo "✅ Deployment selesai!"
