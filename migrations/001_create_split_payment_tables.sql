-- Split Payment tables (PostgreSQL)
-- Run once against your DB, e.g.:
--   psql "$DATABASE_URL" -f migrations/001_create_split_payment_tables.sql
--
-- Used only when QR amount is > 2000 AND < 5000 (split into 3 QRs, each ≤ 2000)

BEGIN;

CREATE TABLE IF NOT EXISTS user_split_payment_master (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES user_master (id) ON UPDATE CASCADE ON DELETE CASCADE,
    account_id      BIGINT NOT NULL REFERENCES user_account_master (id) ON UPDATE CASCADE ON DELETE CASCADE,
    owner_name      VARCHAR(100) NOT NULL,
    owner_upi_id    VARCHAR(255) NOT NULL,
    total_amount    DECIMAL(12, 2) NOT NULL,
    note            VARCHAR(255) NULL,
    split_count     INTEGER NOT NULL DEFAULT 3,
    created_by      INTEGER NULL,
    modified_by     INTEGER NULL,
    created_on      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_on     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active       BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_split_payment_user_id
    ON user_split_payment_master (user_id);

CREATE INDEX IF NOT EXISTS idx_split_payment_created_on
    ON user_split_payment_master (created_on DESC);

CREATE TABLE IF NOT EXISTS user_split_payment_item_master (
    id                  BIGSERIAL PRIMARY KEY,
    split_payment_id    BIGINT NOT NULL REFERENCES user_split_payment_master (id) ON UPDATE CASCADE ON DELETE CASCADE,
    sequence_no         INTEGER NOT NULL,
    amount              DECIMAL(12, 2) NOT NULL,
    note                VARCHAR(255) NULL,
    created_by          INTEGER NULL,
    modified_by         INTEGER NULL,
    created_on          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_on         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active           BOOLEAN DEFAULT TRUE,
    CONSTRAINT uq_split_payment_sequence UNIQUE (split_payment_id, sequence_no),
    CONSTRAINT chk_split_item_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_split_item_amount_max CHECK (amount <= 2000),
    CONSTRAINT chk_split_item_sequence CHECK (sequence_no >= 1 AND sequence_no <= 3)
);

CREATE INDEX IF NOT EXISTS idx_split_payment_item_parent
    ON user_split_payment_item_master (split_payment_id);

COMMIT;
