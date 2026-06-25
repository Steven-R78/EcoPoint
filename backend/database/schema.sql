-- EcoPoint - Modelo físico PostgreSQL
-- Ejecutar en pgAdmin sobre la base Ecopoint_db (recrear si solo hay datos de prueba)

-- Usar schema public (el backend TypeORM apunta aqui)
CREATE SCHEMA IF NOT EXISTS public;
SET search_path TO public;

-- Limpiar schema viejo del curso (si existe)
DROP SCHEMA IF EXISTS users CASCADE;

-- Volver a fijar public por si el DROP altero el search_path
SET search_path TO public;

-- ========== ROLES ==========
CREATE TABLE IF NOT EXISTS public.roles (
    id_role       SERIAL PRIMARY KEY,
    name_role     VARCHAR(50) NOT NULL UNIQUE,
    status_role   INTEGER NOT NULL DEFAULT 1
);

INSERT INTO roles (id_role, name_role) VALUES
    (1, 'admin'),
    (2, 'reciclador')
ON CONFLICT (id_role) DO NOTHING;

-- ========== USUARIOS ==========
CREATE TABLE IF NOT EXISTS public.users (
    id_user       SERIAL PRIMARY KEY,
    name_user     VARCHAR(255) NOT NULL,
    email_user    VARCHAR(255) NOT NULL UNIQUE,
    password_user VARCHAR(255) NOT NULL,
    status_user   INTEGER NOT NULL DEFAULT 1,
    role_id       INTEGER NOT NULL DEFAULT 2 REFERENCES roles(id_role),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========== SESIONES AUTH (JWT) ==========
CREATE TABLE IF NOT EXISTS public.auth_sessions (
    id_session      SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id_user),
    token           VARCHAR(500),
    expires_at      TIMESTAMP NOT NULL,
    status_session  INTEGER NOT NULL DEFAULT 1
);

-- ========== MATERIALES ==========
CREATE TABLE IF NOT EXISTS public.materials (
    id_material       SERIAL PRIMARY KEY,
    name_material     VARCHAR(100) NOT NULL,
    category_material VARCHAR(100),
    status_material   INTEGER NOT NULL DEFAULT 1
);

-- ========== PUNTOS DE RECICLAJE ==========
CREATE TABLE IF NOT EXISTS public.recycling_points (
    id_point        SERIAL PRIMARY KEY,
    material_id     INTEGER REFERENCES materials(id_material),
    name_point      VARCHAR(255) NOT NULL,
    address_point   VARCHAR(500),
    latitude        DECIMAL(10, 8) NOT NULL,
    longitude       DECIMAL(11, 8) NOT NULL,
    status_point    INTEGER NOT NULL DEFAULT 1
);

-- ========== REGISTROS DE RECICLAJE ==========
CREATE TABLE IF NOT EXISTS public.recycling_records (
    id_record     SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id_user),
    point_id      INTEGER NOT NULL REFERENCES recycling_points(id_point),
    points_earned INTEGER NOT NULL DEFAULT 0,
    recycled_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_record INTEGER NOT NULL DEFAULT 1
);

-- ========== MEDALLAS ==========
CREATE TABLE IF NOT EXISTS public.medals (
    id_medal         SERIAL PRIMARY KEY,
    name_medal       VARCHAR(100) NOT NULL,
    points_required  INTEGER NOT NULL,
    status_medal     INTEGER NOT NULL DEFAULT 1
);

-- ========== USUARIO - MEDALLA (N:M) ==========
CREATE TABLE IF NOT EXISTS public.user_medals (
    user_id    INTEGER NOT NULL REFERENCES users(id_user),
    medal_id   INTEGER NOT NULL REFERENCES medals(id_medal),
    earned_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, medal_id)
);

-- Datos iniciales de ejemplo
INSERT INTO materials (name_material, category_material) VALUES
    ('Plastico', 'Envases'),
    ('Papel y carton', 'Papel'),
    ('Vidrio', 'Envases'),
    ('Metal', 'Latas');

INSERT INTO medals (name_medal, points_required) VALUES
    ('Primera reciclada', 50),
    ('Reciclador activo', 200),
    ('Heroe verde', 500);
