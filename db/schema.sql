-- Órdenes de certificados. Idempotencia vía UPDATE condicional sobre `status`.
CREATE TABLE IF NOT EXISTS orders (
  reference        TEXT PRIMARY KEY,
  matricula        TEXT NOT NULL,
  oficina          TEXT NOT NULL,
  email            TEXT,
  phone            TEXT,
  amount_in_cents  BIGINT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'PENDING_PAYMENT'
                     CHECK (status IN ('PENDING_PAYMENT','PAID','GENERATING','DELIVERED','FAILED')),
  transaction_id   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
