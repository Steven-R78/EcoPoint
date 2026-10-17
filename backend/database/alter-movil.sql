-- EcoPoint Móvil: actualizar Ecopoint_db EXISTENTE
-- Ejecutar SOLO este archivo (no lo pegues junto con schema.sql)
-- Conserva materials, users, puntos y FKs que ya existan.

SET search_path TO public;

-- ---------- columnas nuevas ----------
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS document_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS document_number VARCHAR(30);

ALTER TABLE recycling_points
    ADD COLUMN IF NOT EXISTS schedule_point VARCHAR(120),
    ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);

ALTER TABLE recycling_records
    ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);

-- ---------- N:M punto-material ----------
CREATE TABLE IF NOT EXISTS point_materials (
    point_id    INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    CONSTRAINT pk_point_materials PRIMARY KEY (point_id, material_id)
);

-- ---------- FKs (solo si esa columna aún no tiene una) ----------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'users'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'role_id'
    ) THEN
        ALTER TABLE users
            ADD CONSTRAINT fk_users_role
            FOREIGN KEY (role_id) REFERENCES roles(id_role)
            ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'auth_sessions'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'user_id'
    ) THEN
        ALTER TABLE auth_sessions
            ADD CONSTRAINT fk_auth_sessions_user
            FOREIGN KEY (user_id) REFERENCES users(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'recycling_points'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'material_id'
    ) THEN
        ALTER TABLE recycling_points
            ADD CONSTRAINT fk_points_material
            FOREIGN KEY (material_id) REFERENCES materials(id_material)
            ON UPDATE CASCADE ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_point_materials_point'
    ) THEN
        ALTER TABLE point_materials
            ADD CONSTRAINT fk_point_materials_point
            FOREIGN KEY (point_id) REFERENCES recycling_points(id_point)
            ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_point_materials_material'
    ) THEN
        ALTER TABLE point_materials
            ADD CONSTRAINT fk_point_materials_material
            FOREIGN KEY (material_id) REFERENCES materials(id_material)
            ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'recycling_records'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'user_id'
    ) THEN
        ALTER TABLE recycling_records
            ADD CONSTRAINT fk_records_user
            FOREIGN KEY (user_id) REFERENCES users(id_user)
            ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'recycling_records'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'point_id'
    ) THEN
        ALTER TABLE recycling_records
            ADD CONSTRAINT fk_records_point
            FOREIGN KEY (point_id) REFERENCES recycling_points(id_point)
            ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'user_medals'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'user_id'
    ) THEN
        ALTER TABLE user_medals
            ADD CONSTRAINT fk_user_medals_user
            FOREIGN KEY (user_id) REFERENCES users(id_user)
            ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'user_medals'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'medal_id'
    ) THEN
        ALTER TABLE user_medals
            ADD CONSTRAINT fk_user_medals_medal
            FOREIGN KEY (medal_id) REFERENCES medals(id_medal)
            ON UPDATE CASCADE ON DELETE RESTRICT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_role_id ON users (role_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_recycling_points_material_id ON recycling_points (material_id);
CREATE INDEX IF NOT EXISTS idx_point_materials_material_id ON point_materials (material_id);
CREATE INDEX IF NOT EXISTS idx_recycling_records_user_id ON recycling_records (user_id);
CREATE INDEX IF NOT EXISTS idx_recycling_records_point_id ON recycling_records (point_id);
CREATE INDEX IF NOT EXISTS idx_user_medals_medal_id ON user_medals (medal_id);

-- Materiales extra (no toca Plástico, Papel y cartón, Vidrio, Metal)
INSERT INTO materials (name_material, category_material)
SELECT 'Organicos', 'Organicos'
WHERE NOT EXISTS (SELECT 1 FROM materials WHERE name_material = 'Organicos');

INSERT INTO materials (name_material, category_material)
SELECT 'RAEE', 'Electronicos'
WHERE NOT EXISTS (SELECT 1 FROM materials WHERE name_material = 'RAEE');

INSERT INTO materials (name_material, category_material)
SELECT 'Carton', 'Papel'
WHERE NOT EXISTS (SELECT 1 FROM materials WHERE name_material = 'Carton');

-- Copia el material principal de cada punto hacia la N:M
INSERT INTO point_materials (point_id, material_id)
SELECT id_point, material_id
FROM recycling_points
WHERE material_id IS NOT NULL
ON CONFLICT DO NOTHING;
