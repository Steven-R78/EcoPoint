-- EcoPoint - Modelo físico PostgreSQL
-- Instalación NUEVA (base vacía). Si Ecopoint_db ya tiene datos, usa alter-movil.sql
--
-- Relaciones:
--   roles (1) --------< (N) users
--   users (1) --------< (N) auth_sessions
--   users (1) --------< (N) recycling_records
--   users (N) >-------< (N) medals            via user_medals
--   materials (1) ----< (N) recycling_points  (material principal, compat. web)
--   recycling_points (N) >--< (N) materials   via point_materials
--   recycling_points (1) ----< (N) recycling_records

CREATE SCHEMA IF NOT EXISTS public;
SET search_path TO public;

DROP SCHEMA IF EXISTS users CASCADE;
SET search_path TO public;

-- ========== ROLES ==========
CREATE TABLE IF NOT EXISTS public.roles (
    id_role       SERIAL PRIMARY KEY,
    name_role     VARCHAR(50) NOT NULL,
    status_role   INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT uq_roles_name UNIQUE (name_role)
);

INSERT INTO roles (id_role, name_role) VALUES
    (1, 'admin'),
    (2, 'reciclador')
ON CONFLICT (id_role) DO NOTHING;

-- ========== USUARIOS ==========
CREATE TABLE IF NOT EXISTS public.users (
    id_user           SERIAL PRIMARY KEY,
    name_user         VARCHAR(255) NOT NULL,
    email_user        VARCHAR(255) NOT NULL,
    password_user     VARCHAR(255) NOT NULL,
    status_user       INTEGER NOT NULL DEFAULT 1,
    role_id           INTEGER NOT NULL DEFAULT 2,
    document_type     VARCHAR(50),
    document_number   VARCHAR(30),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email_user),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES public.roles(id_role)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users (role_id);

-- ========== SESIONES AUTH (JWT) ==========
CREATE TABLE IF NOT EXISTS public.auth_sessions (
    id_session      SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    token           VARCHAR(500),
    expires_at      TIMESTAMP NOT NULL,
    status_session  INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT fk_auth_sessions_user
        FOREIGN KEY (user_id) REFERENCES public.users(id_user)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON public.auth_sessions (user_id);

-- ========== MATERIALES ==========
CREATE TABLE IF NOT EXISTS public.materials (
    id_material       SERIAL PRIMARY KEY,
    name_material     VARCHAR(100) NOT NULL,
    category_material VARCHAR(100),
    status_material   INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT uq_materials_name UNIQUE (name_material)
);

-- ========== PUNTOS DE RECICLAJE ==========
CREATE TABLE IF NOT EXISTS public.recycling_points (
    id_point        SERIAL PRIMARY KEY,
    material_id     INTEGER,
    name_point      VARCHAR(255) NOT NULL,
    address_point   VARCHAR(500),
    latitude        DECIMAL(10, 8) NOT NULL,
    longitude       DECIMAL(11, 8) NOT NULL,
    status_point    INTEGER NOT NULL DEFAULT 1,
    schedule_point  VARCHAR(120),
    photo_url       VARCHAR(500),
    CONSTRAINT fk_points_material
        FOREIGN KEY (material_id) REFERENCES public.materials(id_material)
        ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_recycling_points_material_id
    ON public.recycling_points (material_id);

-- Punto N:M Material (Figma: varios materiales por punto)
CREATE TABLE IF NOT EXISTS public.point_materials (
    point_id    INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    CONSTRAINT pk_point_materials PRIMARY KEY (point_id, material_id),
    CONSTRAINT fk_point_materials_point
        FOREIGN KEY (point_id) REFERENCES public.recycling_points(id_point)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_point_materials_material
        FOREIGN KEY (material_id) REFERENCES public.materials(id_material)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_point_materials_material_id
    ON public.point_materials (material_id);

-- ========== REGISTROS DE RECICLAJE ==========
CREATE TABLE IF NOT EXISTS public.recycling_records (
    id_record     SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL,
    point_id      INTEGER NOT NULL,
    points_earned INTEGER NOT NULL DEFAULT 0,
    recycled_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_record INTEGER NOT NULL DEFAULT 1,
    photo_url     VARCHAR(500),
    CONSTRAINT fk_records_user
        FOREIGN KEY (user_id) REFERENCES public.users(id_user)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_records_point
        FOREIGN KEY (point_id) REFERENCES public.recycling_points(id_point)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_recycling_records_user_id
    ON public.recycling_records (user_id);
CREATE INDEX IF NOT EXISTS idx_recycling_records_point_id
    ON public.recycling_records (point_id);

-- ========== MEDALLAS ==========
CREATE TABLE IF NOT EXISTS public.medals (
    id_medal         SERIAL PRIMARY KEY,
    name_medal       VARCHAR(100) NOT NULL,
    points_required  INTEGER NOT NULL,
    status_medal     INTEGER NOT NULL DEFAULT 1
);

-- ========== USUARIO - MEDALLA (N:M) ==========
CREATE TABLE IF NOT EXISTS public.user_medals (
    user_id    INTEGER NOT NULL,
    medal_id   INTEGER NOT NULL,
    earned_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user_medals PRIMARY KEY (user_id, medal_id),
    CONSTRAINT fk_user_medals_user
        FOREIGN KEY (user_id) REFERENCES public.users(id_user)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_user_medals_medal
        FOREIGN KEY (medal_id) REFERENCES public.medals(id_medal)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_user_medals_medal_id ON public.user_medals (medal_id);

INSERT INTO materials (name_material, category_material) VALUES
    ('Plastico', 'Envases'),
    ('Papel y carton', 'Papel'),
    ('Vidrio', 'Envases'),
    ('Metal', 'Latas'),
    ('Organicos', 'Organicos'),
    ('RAEE', 'Electronicos'),
    ('Carton', 'Papel')
ON CONFLICT (name_material) DO NOTHING;

INSERT INTO medals (name_medal, points_required)
SELECT v.name_medal, v.points_required
FROM (VALUES
    ('Primera reciclada', 50),
    ('Reciclador activo', 200),
    ('Heroe verde', 500)
) AS v(name_medal, points_required)
WHERE NOT EXISTS (
    SELECT 1 FROM medals m WHERE m.name_medal = v.name_medal
);
