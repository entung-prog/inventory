# Deployment Guide: Vercel + Neon PostgreSQL

## Overview
Panduan lengkap untuk deploy Smart Inventory System ke Vercel (frontend & backend serverless) dengan Neon PostgreSQL.

---

## 1. Setup Neon PostgreSQL Database

### 1.1 Create Neon Account & Database
1. Buka https://neon.tech
2. Sign up atau login
3. Click "Create a project"
4. Beri nama project: "inventory-system"
5. Pilih region terdekat
6. Copy connection string (PostgreSQL, node format)

### 1.2 Simpan Connection String
```
Contoh:
postgresql://user:password@ep-xyz.us-east-4.aws.neon.tech/inventory?sslmode=require
```

Gunakan format ini untuk `DATABASE_URL` di seksi environment variables.

---

## 2. Prepare Backend untuk Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Update package.json Backend
Tambahkan di bagian `"engines"`:
```json
{
  "name": "inventory-backend",
  "version": "1.0.0",
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^5.2.1",
    "pg": "^8.20.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  },
  "scripts": {
    "dev": "nodemon app.js",
    "start": "node app.js"
  }
}
```

### 2.3 Update Backend untuk Serverless
Buat file `backend/api/index.js`:

```javascript
// api/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../routes/authRoutes');
const itemRoutes = require('../routes/itemRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const userRoutes = require('../routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Export untuk Vercel
module.exports = app;
```

### 2.4 Create Vercel Config
Buat file `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret",
    "CORS_ORIGIN": "@cors_origin"
  }
}
```

---

## 3. Deploy Backend ke Vercel

### 3.1 Dari Backend Directory
```bash
cd backend
vercel --prod
```

### 3.2 Follow Setup Wizard
- Confirm project name
- Confirm directory: ./
- Build settings: default

### 3.3 Add Environment Variables
Di Vercel dashboard:
1. Pergi ke project settings
2. Buka "Environment Variables"
3. Tambahkan:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Connection string dari Neon |
| `JWT_SECRET` | Secret key (generate dari crypto: `openssl rand -hex 32`) |
| `CORS_ORIGIN` | `https://yourfrontend.vercel.app` |
| `NODE_ENV` | production |

### 3.4 Save & Redeploy
Klik "Redeploy" setelah menambahkan environment variables.

### 3.5 Test Backend URL
```bash
curl https://your-backend.vercel.app/api/health
```

Harus return `{ "status": "ok", ... }`

---

## 4. Deploy Frontend ke Vercel

### 4.1 Update API Base URL
Edit `frontend/services/api.ts`:

```typescript
const baseURL = 
  process.env.NEXT_PUBLIC_API_URL || 
  'https://your-backend.vercel.app/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### 4.2 Update next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
};

export default nextConfig;
```

### 4.3 Deploy Frontend
```bash
cd frontend
vercel --prod
```

### 4.4 Add Environment Variable
Di Vercel dashboard (frontend project):
1. Settings > Environment Variables
2. Tambahkan:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.vercel.app/api` |

### 4.5 Redeploy
Klik "Redeploy" setelah environment variable ditambahkan.

---

## 5. Database Setup di Neon

### 5.1 Create Tables
Jalankan SQL queries di Neon console:

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_items_category ON items(category_id);
```

### 5.2 Create Test User
```sql
INSERT INTO users (email, password, role) 
VALUES ('test@example.com', '$2b$10$...', 'admin');
```

---

## 6. Verifikasi Deployment

### 6.1 Test Login
1. Buka https://yourfrontend.vercel.app
2. Login dengan test account
3. Check browser console untuk API calls

### 6.2 Test API Endpoints
```bash
# Health check
curl https://your-backend.vercel.app/api/health

# Get items (dengan token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-backend.vercel.app/api/items
```

### 6.3 Check Logs
- **Backend logs**: Vercel dashboard > your-backend > Logs
- **Frontend logs**: Vercel dashboard > your-frontend > Logs

---

## 7. Domain Setup (Optional)

### 7.1 Custom Domain
1. Vercel dashboard > Settings > Domains
2. Add your custom domain
3. Update DNS records (Vercel akan provide instructions)

### 7.2 Update CORS_ORIGIN
Di backend environment variables, update `CORS_ORIGIN` ke domain baru.

---

## 8. Troubleshooting

### Problem: 500 Error di Backend
```
Solution:
1. Check DATABASE_URL format di Neon
2. Verify environment variables di Vercel
3. Check Vercel logs untuk error messages
4. Ensure DATABASE_URL include ?sslmode=require
```

### Problem: CORS Error
```
Solution:
1. Verify CORS_ORIGIN match frontend URL
2. Check api.ts baseURL correct
3. Redeploy both frontend & backend
```

### Problem: Database Connection Timeout
```
Solution:
1. Neon memiliki connection limits (free: 10 connections)
2. Implement connection pooling
3. Check SQL queries performance
```

### Problem: 401 Unauthorized
```
Solution:
1. Verify JWT_SECRET sama di development & production
2. Check token format di localStorage
3. Ensure API includes Bearer token
```

---

## 9. Performance Tips

1. **Connection Pooling**: Gunakan Neon connection pooling untuk serverless
2. **Query Optimization**: Add indexes pada frequently queried columns
3. **Caching**: Implement Redis atau CDN caching
4. **Rate Limiting**: Protect API dari abuse

---

## 10. Monitoring & Maintenance

### Setup Uptime Monitoring
1. https://status.vercel.com untuk Vercel status
2. https://neon.tech/docs/reference/monitoring untuk Neon monitoring

### Regular Backups
Neon automatically creates daily backups. Enable Point-in-Time Recovery (PITR) di settings.

### Monitor Costs
- Neon free tier: 0.5 GB storage, 5 concurrent connections
- Vercel free tier: 100GB bandwidth/month

---

## Rollback

Jika ada masalah:

```bash
# Backend
vercel rollback

# Frontend
vercel rollback
```

---

## Next Steps

1. Test semua flows (login, CRUD items, categories, admin)
2. Setup custom domain jika diperlukan
3. Setup monitoring & analytics
4. Configure backup & disaster recovery
5. Plan untuk scaling (membutuhkan paid tier)

Selamat deploy! 🚀
