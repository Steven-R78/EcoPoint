# EcoPoint Móvil (`frontend_mob`)

Cliente React Native (Expo) del curso de Computación Móvil. Consume la API de `backend/` (PostgreSQL).

## Cómo correrlo

1. En `backend/`: `npm run dev` (puerto **4000**).
2. En `frontend_mob/`: `npm start` o `npm run android`.
3. Si usas **Expo Go en el celular**, en `src/data/sources/remote/api/ApiDelivery.tsx` cambia el host a tu IPv4 (`ipconfig`). El emulador Android usa `10.0.2.2`.

## Registro (validación de la API actual)

- Nombre: solo letras y **un** espacio (ej. `María López`).
- Contraseña: letras **y** números, mínimo 6 (ej. `eco123`).
