# EcoPoint — Backend

API REST del proyecto **EcoPoint** (plataforma de reciclaje con impacto en ODS 11 y 12), desarrollada con **Node.js**, **Express**, **TypeScript**, **PostgreSQL** y **arquitectura hexagonal** (puertos y adaptadores).

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) instalado y en ejecución
- Base de datos creada (por ejemplo: `ecopoint_db`)

---

## Instalación

```bash
cd backend
npm install
```

---

## Variables de entorno

Copia el archivo de ejemplo y completa tus valores locales:

```bash
cp .env.example .env
```

| Variable      | Descripción                          | Ejemplo        |
|---------------|--------------------------------------|----------------|
| `PORT`        | Puerto del servidor HTTP             | `4000`         |
| `DB_HOST`     | Host de PostgreSQL                   | `localhost`    |
| `DB_PORT`     | Puerto de PostgreSQL                 | `5432`         |
| `DB_USER`     | Usuario de la base de datos          | `postgres`     |
| `DB_PASSWORD` | Contraseña (puede ir vacía en local) |                |
| `DB_NAME`     | Nombre de la base de datos           | `ecopoint_db`  |

> El archivo `.env` **no se sube a GitHub**. Cada integrante del grupo debe configurarlo en su máquina.

---

## Ejecución

### Desarrollo (con recarga automática)

```bash
npm run dev
```

### Desarrollo (sin nodemon)

```bash
npx tsx src/index.ts
```

### Producción

```bash
npm run build
npm start
```

Si todo está bien configurado, deberías ver en consola:

```
Database connection established successfully.
Server is running on http://localhost:4000
```

---

## Endpoints disponibles

Base URL: `http://localhost:4000/api`

| Método | Ruta                      | Descripción                    |
|--------|---------------------------|--------------------------------|
| `POST` | `/users`                  | Registrar un usuario           |
| `GET`  | `/users`                  | Listar usuarios activos        |
| `GET`  | `/users/id/:id`           | Buscar usuario por ID          |
| `GET`  | `/users/email/:email`     | Buscar usuario por email       |

### Ejemplo: crear usuario

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Juan Perez\",\"email\":\"juan@email.com\",\"password\":\"abc123\",\"status\":1}"
```

**Respuesta exitosa (201):**

```json
{
  "messge": "Usiario creado con exito",
  "userId": 1
}
```

---

## Estructura del proyecto

```
backend/
├── src/
│   ├── index.ts                    # Punto de entrada (arranque BD + servidor)
│   ├── domain/                     # Capa de dominio (contratos y entidades)
│   ├── application/                # Lógica de negocio
│   └── infraestructure/            # Infraestructura técnica
│       ├── adapter/                # Implementación de puertos (TypeORM)
│       ├── bootstrap/              # Inicialización del servidor HTTP
│       ├── config/                 # Variables de entorno y conexión BD
│       ├── controller/             # Controladores HTTP
│       ├── entities/               # Entidades TypeORM (mapeo a tablas)
│       ├── routes/                 # Definición de rutas Express
│       ├── util/                   # Validaciones Joi de entrada
│       └── web/                    # Configuración de Express (app)
├── .env.example
├── package.json
└── tsconfig.json
```

Para el detalle de capas, flujos y responsabilidades, consulta **[ARQUITECTURA.md](./ARQUITECTURA.md)**.

---

## Stack tecnológico

| Tecnología | Uso                                      |
|------------|------------------------------------------|
| Express 5  | Servidor HTTP y rutas REST               |
| TypeScript | Tipado estático                          |
| TypeORM    | ORM para PostgreSQL                      |
| PostgreSQL | Base de datos relacional                 |
| Joi        | Validación de variables de entorno y datos |
| dotenv     | Carga de variables desde `.env`          |

---

## Scripts npm

| Script        | Comando                          |
|---------------|----------------------------------|
| `npm run dev` | Servidor en modo desarrollo      |
| `npm run build` | Compila TypeScript a `dist/`   |
| `npm start`   | Ejecuta la versión compilada     |

---

## Notas del proyecto académico

- El borrado de usuarios es **lógico** (`status_user = 0`), no físico.
- `synchronize: true` en TypeORM sincroniza el esquema en desarrollo. **No usar en producción.**
- Los métodos `updateUser` y `deleteUser` están implementados en el controlador, pero aún no tienen ruta HTTP registrada.

---

## Equipo

Proyecto grupal — Ingeniería Web I, UNIMINUTO.
