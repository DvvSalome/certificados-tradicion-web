-- Órdenes de certificados. Idempotencia vía UPDATE condicional sobre `status`.
CREATE TABLE IF NOT EXISTS orders (
  reference        TEXT PRIMARY KEY,
  matricula        TEXT NOT NULL,
  oficina          TEXT NOT NULL,
  email            TEXT,
  phone            TEXT,
  amount_in_cents  BIGINT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'PENDING_PAYMENT'
                     CHECK (status IN ('PENDING_PAYMENT','PAID','GENERATING','DELIVERED','FAILED','REFUND_PENDING','REFUNDED')),
  transaction_id   TEXT,
  plan             TEXT NOT NULL DEFAULT 'basico' CHECK (plan IN ('basico','express')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);

-- Bitácora de generaciones del robot. El panel la usa para "certificados generados",
-- costo real del SNR (columna Valor del historial) y estado del robot (última corrida).
CREATE TABLE IF NOT EXISTS generations (
  id            BIGSERIAL PRIMARY KEY,
  reference     TEXT,  -- liga a orders.reference (sin FK: es bitácora; tolera reportes sueltos)
  matricula     TEXT NOT NULL,
  oficina       TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('OK','FAILED')),
  cost_in_cents BIGINT,                 -- lo que cobró el SNR al saldo prepago (null si falló)
  error         TEXT,                   -- mensaje si status='FAILED'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS generations_created_idx ON generations (created_at DESC);

-- Snapshots del saldo prepago del SNR (lo escribe el robot/n8n periódicamente).
-- El panel muestra el último; si baja del umbral se dispara alerta WhatsApp+Email.
CREATE TABLE IF NOT EXISTS saldo_snapshots (
  id          BIGSERIAL PRIMARY KEY,
  saldo_cents BIGINT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS saldo_created_idx ON saldo_snapshots (created_at DESC);

-- Generación en LOTE iniciada por el cliente desde el panel. Se procesa en loop secuencial
-- (el robot toma 1 ítem a la vez con delay) para evitar bloqueo del SNR.
CREATE TABLE IF NOT EXISTS batches (
  id          BIGSERIAL PRIMARY KEY,
  created_by  TEXT NOT NULL,                         -- rol que lo lanzó (cliente|superadmin)
  status      TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED','RUNNING','DONE')),
  total       INT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS batch_items (
  id           BIGSERIAL PRIMARY KEY,
  batch_id     BIGINT NOT NULL REFERENCES batches (id) ON DELETE CASCADE,
  matricula    TEXT NOT NULL,
  oficina      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','RUNNING','OK','FAILED')),
  cost_cents   BIGINT,
  error        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS batch_items_batch_idx ON batch_items (batch_id);
CREATE INDEX IF NOT EXISTS batch_items_pending_idx ON batch_items (status, created_at) WHERE status = 'PENDING';

-- Caché de validación de matrícula (checkout valida ANTES de pagar). Evita re-consultar al SNR por
-- la misma matrícula repetida → protege la cuenta. PK = oficina+matrícula.
CREATE TABLE IF NOT EXISTS verificaciones (
  oficina     TEXT NOT NULL,
  matricula   TEXT NOT NULL,
  disponible  BOOLEAN,
  estado      TEXT,
  direccion   TEXT,
  circulo     TEXT,
  checked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (oficina, matricula)
);
