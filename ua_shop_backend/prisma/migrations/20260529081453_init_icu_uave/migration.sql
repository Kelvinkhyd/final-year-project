-- Step 1: Create Unicode-aware ICU collation
CREATE COLLATION IF NOT EXISTS ua_icu_collation (
    provider = icu,
    locale = 'und-u-ka-shifted',
    deterministic = false
);

-- Step 2: Users table (UA-compliant identity)
CREATE TABLE IF NOT EXISTS users (
    id               TEXT         PRIMARY KEY NOT NULL,
    username_unicode TEXT         NOT NULL,
    email_unicode    TEXT         NOT NULL,
    canonical_email  VARCHAR(255) COLLATE ua_icu_collation NOT NULL,
    ace_domain       TEXT         NOT NULL,
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Unique index on canonical_email
CREATE UNIQUE INDEX IF NOT EXISTS users_canonical_email_key
ON users(canonical_email);

-- Step 4: Products table (UA-Shop catalogue)
CREATE TABLE IF NOT EXISTS products (
    id          TEXT          PRIMARY KEY NOT NULL,
    name        TEXT          NOT NULL,
    description TEXT          NOT NULL,
    price       FLOAT         NOT NULL,
    category    TEXT          NOT NULL,
    image_url   TEXT          NOT NULL,
    stock       INTEGER       DEFAULT 10,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Orders table
CREATE TABLE IF NOT EXISTS orders (
    id           TEXT      PRIMARY KEY NOT NULL,
    user_id      TEXT      NOT NULL REFERENCES users(id),
    status       TEXT      DEFAULT 'pending',
    total_amount FLOAT     NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id         TEXT    PRIMARY KEY NOT NULL,
    order_id   TEXT    NOT NULL REFERENCES orders(id),
    product_id TEXT    NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL,
    price      FLOAT   NOT NULL
);
