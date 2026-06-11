# EcoPoint Backend

Backend de la Segunda Actividad Entregable usando **Node.js + Express + TypeScript**, arquitectura **hexagonal**, **JWT** y **PostgreSQL**.

## Estructura

- `src/domain`: entidades, servicios y repositorios (interfaces)
- `src/application`: DTOs y casos de uso
- `src/infrastructure`: adaptadores HTTP, persistencia y configuración
- `src/ports`: puertos de entrada y salida
- `database/schema.sql`: diseño físico y datos semilla
- `docs/`: artefactos Scrum

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Configuración

1. Copiar variables de entorno:
   ```bash
   cp .env.example .env
   ```
2. Ajustar `DATABASE_URL`, `JWT_SECRET`, `PORT`.
3. Ejecutar script SQL:
   ```bash
   psql "$DATABASE_URL" -f database/schema.sql
   ```

## Ejecución

```bash
npm install
npm run build
npm run dev
```

## Endpoints

- `/api/users`
- `/api/waste-categories`
- `/api/recycling-points`
- `/api/transactions`
- `/api/rewards`
- `/api/ratings`

Incluye **borrado lógico** (`deleted_at`) y DTOs de respuesta.
