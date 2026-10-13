# Split Payment Migrations

## Tables

| Table | Purpose |
|-------|---------|
| `user_split_payment_master` | Parent record for a split payment (total amount) |
| `user_split_payment_item_master` | Individual QR parts (3 rows, each amount ≤ 2000) |

Regular single QRs still use `user_qr_history_master`.

## Rule

- Amount **> ₹2000** and **< ₹5000** → split into **3** random parts (each ≤ ₹2000)
- Otherwise → normal `/history` single QR

## Run migration (PostgreSQL)

From `dynamic-qr-pwa-backend`:

```bash
# Option A — using psql with DATABASE_URL from .env
psql "$DATABASE_URL" -f migrations/001_create_split_payment_tables.sql
```

On Windows PowerShell:

```powershell
# Load DATABASE_URL from .env first, or paste connection string:
psql "YOUR_DATABASE_URL_HERE" -f migrations/001_create_split_payment_tables.sql
```

Or open the SQL file in your DB GUI (Neon / Supabase / pgAdmin) and execute it.

## Verify

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name IN (
  'user_split_payment_master',
  'user_split_payment_item_master'
);
```

## After migration

1. Restart backend: `npm run dev`
2. Generate a QR with amount e.g. `2499` or `3500`
3. You should get 3 QRs; History shows a **Split** card
4. Amounts ≤ 2000 still save to normal history
