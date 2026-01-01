# Postman Setup untuk JelantikAPI

## 📁 Files

| File | Deskripsi |
|------|-----------|
| `JelantikAPI.postman_collection.json` | Collection dengan semua endpoints |
| `JelantikAPI.postman_environment.json` | Environment variables |
| `seed_packages.sql` | SQL script untuk seed data packages |

---

## 🚀 Setup di Postman

### 1. Import Collection & Environment

1. Buka Postman
2. Klik **Import** (kiri atas)
3. Pilih file:
   - `JelantikAPI.postman_collection.json`
   - `JelantikAPI.postman_environment.json`
4. Pilih environment **"JelantikAPI - Local"** di dropdown kanan atas

---

## 🔐 Cara Dapatkan Supabase Token

### Opsi A: Dari Frontend (React Native)

Di app JelantikApps, setelah login, token bisa diambil dari:

```javascript
import { getSession } from './lib/supabase';

const session = await getSession();
const token = session.access_token;  // Copy ini ke Postman
```

### Opsi B: Dari Supabase Dashboard

1. Buka https://supabase.com/dashboard/project/goymyoyfqoyaotjmdpcb
2. Masuk ke **SQL Editor**
3. Jalankan query ini (ganti email dengan email user yang sudah terdaftar):
```sql
SELECT access_token, expires_at
FROM auth.sessions
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'your@email.com')
ORDER BY created_at DESC
LIMIT 1;
```

### Opsi C: Manual dari Frontend

1. Login di app React Native
2. Buka **DevTools** → **Network**
3. Cari request ke Supabase
4. Copy `Authorization: Bearer <token>` header

---

## 📝 Set Token di Postman

1. Pilih environment **"JelantikAPI - Local"**
2. Klik **eye icon** (Quick Look)
3. Edit `supabaseToken` value
4. Paste token dari Supabase (tanpa "Bearer " prefix)

---

## 🌱 Seed Data Packages

Sebelum test API, seed dulu package data:

### Via pgAdmin:
1. Buka http://localhost:5050
2. Login: `admin@jelantik.com` / `Admin@2025!`
3. Klik **Query Tool**
4. Paste isi `seed_packages.sql`
5. Klik **Execute/Run**

### Via psql:
```bash
docker exec -it jelantik-postgres psql -U jelantik -d jelantik_db
```
Lalu paste isi `seed_packages.sql`

---

## 🧪 Test Endpoints

### Tanpa Auth (Public):
- ✅ `GET /health` - Health check
- ✅ `GET /api/v1/packages` - List packages
- ✅ `GET /api/v1/packages/:id` - Package detail

### Dengan Auth (Butuh Token):
- ✅ `GET /api/v1/users/me` - Profile user
- ✅ `POST /api/v1/users/sync` - Sync dari Supabase
- ✅ `PUT /api/v1/users/me` - Update profile
- ✅ `POST /api/v1/admin/packages` - Create package (Admin)
- ✅ `PUT /api/v1/admin/packages/:id` - Update package (Admin)
- ✅ `DELETE /api/v1/admin/packages/:id` - Delete package (Admin)

---

## 📦 Contoh Response

### Health Check
```json
{
  "status": "ok",
  "service": "jelantik-api"
}
```

### Get All Packages
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Basic",
      "speed": "10 Mbps",
      "price": 150000,
      "description": "Paket internet cocok untuk rumahan",
      "features": ["1-2 Perangkat", "Streaming SD"],
      "is_promo": false,
      "is_active": true
    }
  ]
}
```

---

## 🔍 Troubleshooting

### Error 401 Unauthorized
- Pastikan `supabaseToken` sudah di-set di environment
- Token harus masih valid (belum expired)

### Error 404 Not Found
- Pastikan backend server jalan (`./run.sh`)
- Cek `baseUrl` di environment = `http://localhost:8080`

### Packages kosong
- Jalankan `seed_packages.sql` dulu di pgAdmin

### Token expired
- Login ulang di frontend untuk dapat token baru
- Atau buat user baru di Supabase Dashboard
