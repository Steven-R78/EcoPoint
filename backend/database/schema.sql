CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(80) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS waste_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(80) UNIQUE NOT NULL,
  description VARCHAR(200) NOT NULL,
  points_per_kg NUMERIC(10,2) NOT NULL CHECK (points_per_kg > 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS recycling_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  address VARCHAR(150) NOT NULL,
  city VARCHAR(80) NOT NULL,
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  opening_hours VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(200) NOT NULL,
  points_cost INTEGER NOT NULL CHECK (points_cost > 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  recycling_point_id UUID NOT NULL REFERENCES recycling_points(id),
  waste_category_id UUID NOT NULL REFERENCES waste_categories(id),
  quantity_kg NUMERIC(10,2) NOT NULL CHECK (quantity_kg > 0),
  points_earned INTEGER NOT NULL CHECK (points_earned >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  recycling_point_id UUID NOT NULL REFERENCES recycling_points(id),
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment VARCHAR(200) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  UNIQUE (user_id, recycling_point_id)
);

INSERT INTO waste_categories (name, description, points_per_kg)
VALUES
  ('Plástico', 'Envases y botellas plásticas', 5),
  ('Papel', 'Papel y cartón limpio', 3),
  ('Vidrio', 'Botellas y frascos de vidrio', 4),
  ('Electrónica', 'Residuos de aparatos electrónicos', 12)
ON CONFLICT (name) DO NOTHING;

INSERT INTO rewards (name, description, points_cost, stock)
VALUES
  ('EcoBolsa', 'Bolsa reutilizable', 150, 50),
  ('Termo reciclado', 'Termo hecho con material reciclado', 300, 30)
ON CONFLICT DO NOTHING;
