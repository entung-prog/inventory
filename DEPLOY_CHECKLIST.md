# Deploy Checklist

Panduan step-by-step untuk deploy ke Vercel + Neon.

## Pre-Deployment Checklist

- [ ] Semua code sudah di-commit ke git
- [ ] Tidak ada console.log di production code
- [ ] Semua error handling sudah proper
- [ ] Environment variables sudah di-set locally untuk testing

## 1. Setup Neon Database

- [ ] Account Neon sudah dibuat (https://neon.tech)
- [ ] Database project sudah created
- [ ] Connection string sudah disalin (format: `postgresql://...`)
- [ ] Schema sudah exist:
  - [ ] `users` table
  - [ ] `categories` table
  - [ ] `items` table
- [ ] Test user sudah dibuat untuk login

### Generate JWT Secret
```bash
# Di terminal:
openssl rand -hex 32
```
Simpan hasil ini untuk `JWT_SECRET`

## 2. Backend Deployment (Vercel)

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Masuk ke backend directory: `cd backend`
- [ ] File `vercel.json` sudah ada
- [ ] File `api/index.js` sudah ada
- [ ] Update `package.json` dengan "start" script
- [ ] .env.example sudah dibuat

### Deploy Backend
```bash
cd backend
vercel --prod
```

- [ ] Vercel CLI sudah authentic dengan akun Vercel
- [ ] Project name confirm
- [ ] Build settings sudah benar
- [ ] Environment variables sudah di-set di Vercel dashboard:
  - [ ] `DATABASE_URL` (dari Neon)
  - [ ] `JWT_SECRET` (generate)
  - [ ] `CORS_ORIGIN` (tempat frontend akan di-deploy)

- [ ] Backend sudah di-redeploy setelah env vars
- [ ] Test health check: `curl https://your-backend.vercel.app/api/health`

### Notes
- Simpan backend URL: `https://your-backend.vercel.app`

## 3. Frontend Deployment (Vercel)

- [ ] Update `frontend/services/api.ts` dengan environment variable
- [ ] .env.example sudah dibuat
- [ ] Masuk ke frontend directory: `cd frontend`

### Deploy Frontend
```bash
cd frontend
vercel --prod
```

- [ ] Project name confirm
- [ ] Build settings sudah benar
- [ ] Environment variable sudah di-set di Vercel dashboard:
  - [ ] `NEXT_PUBLIC_API_URL` = `https://your-backend.vercel.app/api`

- [ ] Frontend sudah di-redeploy setelah env vars
- [ ] Frontend URL: `https://your-frontend.vercel.app`

## 4. Post-Deployment Testing

- [ ] Frontend bisa diakses: `https://your-frontend.vercel.app`
- [ ] Login page tampil dengan benar
- [ ] Bisa register user baru
- [ ] Bisa login dengan user
- [ ] Dashboard tampil dengan statistics
- [ ] Items list bisa di-load
- [ ] Create item bisa submit
- [ ] Edit item bisa submit
- [ ] Delete item dengan confirmation
- [ ] Categories list bisa di-load
- [ ] Create category bisa submit (admin only)
- [ ] Edit category bisa submit (admin only)
- [ ] Delete category dengan confirmation (admin only)
- [ ] Admin users panel accessible (admin only)
- [ ] User role bisa di-edit (admin only)
- [ ] User bisa di-delete (admin only)
- [ ] Logout bisa berfungsi
- [ ] Token auto-refresh jika perlu
- [ ] 401/403 error handling bekerja

## 5. Monitoring & Maintenance

- [ ] Setup error tracking (Vercel built-in)
- [ ] Setup performance monitoring
- [ ] Backup database di Neon
- [ ] Setup uptime monitoring
- [ ] Document current URLs di repo

### Important URLs
- Frontend: https://your-frontend.vercel.app
- Backend: https://your-backend.vercel.app
- Neon Database: https://console.neon.tech
- Vercel Dashboard: https://vercel.com/dashboard

## 6. Rollback Plan (Jika Ada Issues)

```bash
# Rollback backend
cd backend
vercel rollback

# Rollback frontend
cd frontend
vercel rollback
```

- [ ] Tahu cara rollback deployment
- [ ] Tahu cara check logs di Vercel
- [ ] Tahu cara check database di Neon console

## Common Issues & Solutions

### Issue: CORS Error
- Verify CORS_ORIGIN di backend environment variables
- Restart backend dengan vercel --prod
- Bersihkan browser cache (Ctrl+Shift+R)

### Issue: Database Connection Error
- Check DATABASE_URL format (harus dengan ?sslmode=require)
- Verify dapat connect ke Neon dari local untuk memastikan connection string valid
- Check Neon console untuk active connections

### Issue: 401/403 Errors
- Verify JWT_SECRET sama di local & production
- Check token di browser localStorage
- Verify Authorization header dikirim dengan format: `Bearer <token>`

### Issue: Build Error di Vercel
- Check deployment logs di Vercel dashboard
- Verify all dependencies di package.json
- Coba local build: `npm run build`

## Done! 🎉

Semuanya sudah live di production!

### Next Steps
1. Share backend & frontend URLs dengan team/users
2. Monitor untuk error logs minggu pertama
3. Collect feedback dari users
4. Plan untuk features tambahan
