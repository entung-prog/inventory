# Connection Guide: Frontend, Backend, dan Neon Database

## Overview Flow

```
Frontend (Next.js @ Vercel)
    ↓ (API calls via Axios)
Backend (Express @ Vercel Serverless)
    ↓ (SQL queries)
Database (PostgreSQL @ Neon)
```

---

## 1. Setup Neon Database

### Step 1.1: Create Neon Project
1. Buka https://neon.tech
2. Sign up / Login
3. Click **"New Project"**
4. Beri nama: `inventory-system`
5. Pilih region terdekat
6. Click **"Create Project"**

### Step 1.2: Get Connection String
1. Di console, cari bagian **"Connection string"**
2. Copy connection string format PostgreSQL (Node.js)
3. Contoh:
```
postgresql://neon_user:password@ep-xyz.us-east-4.aws.neon.tech/inventory?sslmode=require
```

### Step 1.3: Import Database
1. Buka **"SQL Editor"** di Neon
2. Copy-paste isi dari `init-db.sql` atau `inventory_backup.sql`
3. Click **"Execute"**
4. Verify dengan run queries:
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM items;
SELECT COUNT(*) FROM categories;
```

---

## 2. Backend Setup (Express + Neon)

### Step 2.1: Update Backend .env

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://neon_user:password@ep-xyz.us-east-4.aws.neon.tech/inventory?sslmode=require
PORT=5000
JWT_SECRET=your_secret_key_generate_with_openssl_rand_hex_32
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Step 2.2: Update Database Config

Edit `backend/config/db.js`:
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Diperlukan untuk Neon
  }
});

pool.on('error', (err) => {
  console.error('Pool error:', err);
});

module.exports = pool;
```

### Step 2.3: Test Backend Connect

```bash
cd backend
npm run dev
```

Buka di browser atau Postman:
```
http://localhost:5000/api/health
```

Harus return:
```json
{
  "status": "ok",
  "timestamp": "2026-04-08T...",
  "environment": "development"
}
```

---

## 3. Frontend Setup (Next.js + API Integration)

### Step 3.1: Update Frontend .env.local

Buat/edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3.2: Verify API Service

Cek `frontend/services/api.ts`:
```typescript
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Request interceptor
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
```

### Step 3.3: Test Frontend Connect

```bash
cd frontend
npm run dev
```

Buka http://localhost:3000

Test flow:
1. Click **"Login"**
2. Gunakan test user:
   - Email: `maula@mail.com`
   - Password: (apa password aslinya? - perlu test secara manual)

Atau register user baru untuk test.

---

## 4. Test All Connections

### Flow Testing:

#### A. Login
```
Frontend Form Input → API POST /auth/login 
→ Backend validate email/password 
→ Database query users table 
→ JWT token generated 
→ Token saved to localStorage
```

#### B. Get Items
```
Frontend GET /items
→ Backend check Bearer token
→ Query items dari DB
→ Return data to Frontend
→ Display di table
```

#### C. Create Item
```
Frontend Form → POST /items with token
→ Backend verify token & role
→ Insert ke items table
→ Return success/error
→ Frontend refresh list
```

### Via Postman (Test Backend Direct):

```
1. POST http://localhost:5000/api/auth/login
   Body: {
     "email": "maula@mail.com",
     "password": "your_password"
   }
   
2. Copy token dari response
   
3. GET http://localhost:5000/api/items
   Header: Authorization: Bearer {token}
```

---

## 5. Deploy to Vercel

### Step 5.1: Deploy Backend

```bash
cd backend
vercel --prod
```

Setelah deploy, catat backend URL:
```
https://your-backend-name.vercel.app
```

### Step 5.2: Set Backend Environment Variables

Di Vercel Dashboard → Backend Project → Settings → Environment Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://...` | Dari Neon |
| `JWT_SECRET` | Your secret key | Generate: `openssl rand -hex 32` |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` | Frontend URL (set later) |
| `NODE_ENV` | `production` | Important untuk Vercel |

Klik **Redeploy** setelah setup.

### Step 5.3: Deploy Frontend

```bash
cd frontend
vercel --prod
```

Catat frontend URL:
```
https://your-frontend-name.vercel.app
```

### Step 5.4: Set Frontend Environment Variables

Di Vercel Dashboard → Frontend Project → Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.vercel.app/api` |

Klik **Redeploy**.

### Step 5.5: Update Backend CORS_ORIGIN

Kembali ke Backend environment variables:

| Key | Value |
|-----|-------|
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` |

Klik **Redeploy** lagi.

---

## 6. Verify Production Connection

### A. Test Backend Health
```bash
curl https://your-backend.vercel.app/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-08T...",
  "environment": "production"
}
```

### B. Test Frontend
1. Buka https://your-frontend.vercel.app
2. Login dengan user dari database
3. Check browser console untuk API calls
4. Verify data load dari backend

### C. Network Tab Testing
1. Open DevTools (F12)
2. Go to Network tab
3. Do login
4. Check request/response dari `/api/auth/login`
5. Verify Authorization header sent

---

## 7. Connection Architecture

```
┌─────────────────────────────────────────────┐
│         Frontend (Next.js)                  │
│    https://frontend.vercel.app              │
│  - Login page                               │
│  - Dashboard with statistics                │
│  - Items/Categories CRUD                    │
│  - Admin users panel                        │
└────────────────┬────────────────────────────┘
                 │
         API Calls (Axios)
         Bearer Token in Header
                 │
┌────────────────▼────────────────────────────┐
│      Backend (Express Serverless)           │
│   https://backend.vercel.app/api            │
│  - /auth/login - /auth/register             │
│  - /items (CRUD) - protected routes         │
│  - /categories (CRUD) - admin only          │
│  - /users (CRUD) - admin only               │
│  - JWT verification middleware              │
└────────────────┬────────────────────────────┘
                 │
         SQL Queries (pg library)
         SSL Connection
                 │
┌────────────────▼────────────────────────────┐
│   Database (PostgreSQL @ Neon)              │
│   ep-xyz.neon.tech                          │
│  - users table (with email unique constraint)
│  - categories table                         │
│  - items table (with FK constraints)        │
└─────────────────────────────────────────────┘
```

---

## 8. Troubleshooting Connection Issues

### Frontend → Backend API Error
```
Problem: 404 / Connection Refused
Solution:
1. Cek NEXT_PUBLIC_API_URL environment variable
2. Cek backend sudah deployed & running
3. Cek CORS_ORIGIN di backend match frontend URL
4. Clear browser cache (Ctrl+Shift+R)
```

### Backend → Database Connection Error
```
Problem: Error: connect ECONNREFUSED / FATAL: database does not exist
Solution:
1. Verify DATABASE_URL correct di Vercel env vars
2. Check connection string format (harus dengan ?sslmode=require)
3. Verify database sudah di-create & tables ada di Neon
4. Check Neon connection active (max 10 connections free tier)
```

### Login Failed
```
Problem: 401 Unauthorized
Solution:
1. Verify user exist di database
2. Check password hash correct
3. Verify JWT_SECRET sama di backend
4. Check token di localStorage frontend
```

### CORS Error
```
Problem: Access to XMLHttpRequest blocked by CORS policy
Solution:
1. Verify CORS_ORIGIN di backend match frontend URL exactly
2. Redeploy backend setelah ubah CORS
3. Check origin header di request
```

---

## 9. Quick Deployment Checklist

- [ ] Neon project created
- [ ] Database initialized dengan `init-db.sql`
- [ ] Backend `.env` setup dengan DATABASE_URL
- [ ] Backend tested locally → works
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set (DATABASE_URL, JWT_SECRET)
- [ ] Frontend `.env.local` setup dengan local backend URL
- [ ] Frontend tested locally → can login & crud
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set (NEXT_PUBLIC_API_URL)
- [ ] Backend CORS_ORIGIN updated dengan production frontend URL
- [ ] Backend redeployed
- [ ] Production test: login, CRUD items, admin panel all working

---

## 10. Log into Production

### Backend Logs (Debug Issues)
Vercel Dashboard → Backend Project → Logs

### Frontend Logs
Vercel Dashboard → Frontend Project → Logs

### Database Logs
Neon Console → Project → Monitoring → Queries

---

**Semuanya siap! Step-by-step execute dan let me know kalo ada error.** 🚀
