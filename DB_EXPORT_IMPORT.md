# PostgreSQL Database Export & Neon Migration

## 1. Export Database dari PostgreSQL Local

### Opsi 1: Export dengan `pg_dump` (Recommended)

#### A. Export Schema + Data (Semua)
```bash
# Format SQL script (.sql)
pg_dump -U postgres -h localhost -p 5433 inventory > inventory_backup.sql

# Formula umum:
pg_dump -U <username> -h <host> -p <port> <database_name> > backup.sql
```

#### B. Export hanya Data (tanpa schema)
```bash
pg_dump -U postgres -h localhost -p 5433 --data-only inventory > inventory_data.sql
```

#### C. Export hanya Schema (tanpa data)
```bash
pg_dump -U postgres -h localhost -p 5433 --schema-only inventory > inventory_schema.sql
```

#### D. Export dalam format Custom (lebih cepat, lebih kecil)
```bash
pg_dump -U postgres -h localhost -p 5433 -Fc inventory > inventory_backup.dump
```

### Step-by-Step untuk Windows:

```bash
# 1. Buka PowerShell dan navigate ke folder backup
cd C:\Users\maula\backups  # atau foldermu

# 2. Export database
pg_dump -U postgres -h localhost -p 5433 inventory > inventory_backup.sql

# System akan prompt untuk password
# Enter password: Mazdatiga098
```

Jika `pg_dump` tidak recognize, perlu add PostgreSQL ke PATH:

```bash
# Cek lokasi PostgreSQL (biasanya):
"C:\Program Files\PostgreSQL\13\bin\pg_dump" -U postgres -h localhost -p 5433 inventory > inventory_backup.sql
```

---

## 2. Cek Backup File

```bash
# Lihat size file
ls -lh inventory_backup.sql

# Lihat isi first 20 lines
head -20 inventory_backup.sql

# Lihat jumlah lines
wc -l inventory_backup.sql
```

---

## 3. Import ke Neon Database

### Opsi A: Import via Neon Console (Easy)

1. Login ke https://neon.tech/console
2. Select project kamu
3. Go to "SQL Editor"
4. Buka file `inventory_backup.sql`
5. Copy semua content
6. Paste di SQL Editor
7. Klik "Execute"

### Opsi B: Import via psql Command (Recommended untuk file besar)

```bash
# Format:
psql -h <neon_host> -U <neon_user> -p 5432 -d <neon_database> < inventory_backup.sql

# Example dari Neon connection string:
# postgresql://user:password@ep-xyz.us-east-4.aws.neon.tech/inventory?sslmode=require

psql -h ep-xyz.us-east-4.aws.neon.tech -U user -d inventory < inventory_backup.sql
```

System akan prompt password (dari Neon connection string)

### Opsi C: Import via DBeaver (GUI - Easiest)

1. Download DBeaver: https://dbeaver.io
2. Create connection ke Neon database
3. Right-click database > "Import" > "Import Data"
4. Select `inventory_backup.sql`
5. Follow wizard

---

## 4. Verify Migration Success

### Di Neon Console (SQL Editor), jalankan:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check users count
SELECT COUNT(*) FROM users;

-- Check items count
SELECT COUNT(*) FROM items;

-- Check categories count
SELECT COUNT(*) FROM categories;

-- Check specific user
SELECT * FROM users LIMIT 1;

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('users', 'items', 'categories');
```

---

## 5. Complete Migration Checklist

- [ ] Backup local database dengan pg_dump
  ```bash
  pg_dump -U postgres -h localhost -p 5433 inventory > inventory_backup.sql
  ```

- [ ] Neon project sudah create
  ```
  1. Buka https://neon.tech/console
  2. Create project: "inventory-system"
  3. Copy connection string
  ```

- [ ] Import backup ke Neon
  ```bash
  psql -h <neon_host> -U <neon_user> -d inventory < inventory_backup.sql
  ```

- [ ] Verify di Neon console
  ```sql
  SELECT COUNT(*) FROM users, items, categories;
  ```

- [ ] Update DATABASE_URL di backend environment
  ```
  DATABASE_URL=postgresql://neon_user:password@neon_host/inventory?sslmode=require
  ```

- [ ] Test backend connections ke Neon
  ```bash
  npm run dev
  ```

- [ ] Test semua API endpoints

---

## 6. Backup Strategy untuk Production

Setelah go live di Neon:

### A. Daily Automated Backups
Neon otomatis backup setiap hari. Enable di Neon settings.

### B. Manual Regular Backups
```bash
# Cron job (Linux/Mac) atau Task Scheduler (Windows)
# Jalankan setiap hari pukul 2 AM:

pg_dump -h your-neon-host.neon.tech -U your_user -d inventory \
  > backups/inventory_$(date +%Y%m%d).sql
```

### C. Point-in-Time Recovery (PITR)
Neon provides PITR untuk restore ke snapshot sebelumnya.

---

## 7. Troubleshooting

### Error: "pg_dump: command not found"
```bash
# Add PostgreSQL bin folder ke PATH, atau gunakan full path:
"C:\Program Files\PostgreSQL\13\bin\pg_dump" -U postgres inventory > backup.sql
```

### Error: "database does not exist"
```bash
# Cek database dan users yang ada:
psql -U postgres -h localhost -p 5433 -c "\l"  # list databases
psql -U postgres -h localhost -p 5433 -c "\du" # list users
```

### Error: "password authentication failed"
```bash
# Pastikan password correct
# Untuk local: Mazdatiga098
# Untuk Neon: dari connection string
```

### Error: "SSL connection rejected"
```bash
# Neon require SSL. Tambahkan parameter:
pg_dump -h neon_host -U user -d inventory --ssl-mode=require > backup.sql

psql -h neon_host -U user -d inventory -c "..." --ssl-mode=require
```

---

## 8. Quick Commands Reference

```bash
# Export semua (recommended)
pg_dump -U postgres -h localhost -p 5433 inventory > backup.sql

# Export tanpa password prompt (masukkan .pgpass file)
pg_dump -U postgres -h ep-xyz.us-east-4.aws.neon.tech inventory > backup.sql

# Import dari backup
psql -h ep-xyz.us-east-4.aws.neon.tech -U postgres -d inventory < backup.sql

# Test koneksi ke database
psql -h ep-xyz.us-east-4.aws.neon.tech -U postgres -d inventory -c "SELECT NOW();"

# List semua databases
psql -U postgres -h localhost -p 5433 -c "\l"

# List semua tables
psql -h ep-xyz.us-east-4.aws.neon.tech -U postgres -d inventory -c "\dt"
```

---

## 9. Next Steps

1. Backup local database
2. Setup Neon project & get connection string
3. Import backup ke Neon
4. Test dengan query
5. Update DATABASE_URL di backend environment
6. Redeploy backend ke Vercel
7. Verify semua API working dengan Neon database

Siap to migrate? 🚀
