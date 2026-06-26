# EcoPoint — Frontend

Interfaz web del proyecto **EcoPoint** (plataforma de reciclaje alineada con ODS 11 y 12). Es una **SPA ligera** en HTML, CSS y JavaScript vanilla que consume la API REST del backend.

---

## Requisitos previos

- Navegador moderno (Chrome, Edge, Firefox)
- **Backend** de EcoPoint en ejecución (`http://localhost:4000`)
- Extensión **Live Server** en VS Code (recomendado) u otro servidor HTTP local

> No uses `file://` para abrir el HTML directamente: las peticiones `fetch` a la API fallarán por CORS y restricciones del navegador.

---

## Instalación

No hay dependencias npm. Clona el repositorio y abre la carpeta `frontend/` en VS Code.

---

## Configuración

La URL del backend se define en `js/config.js`:

```javascript
const API_BASE = 'http://localhost:4000/api';
const AUTH_TOKEN_KEY = 'ecopoint_token';
```

| Constante | Descripción |
|-----------|-------------|
| `API_BASE` | Base de todos los endpoints consumidos |
| `AUTH_TOKEN_KEY` | Clave en `localStorage` donde se guarda el JWT |

Si el backend corre en otro puerto o host, modifica solo `API_BASE`.

---

## Ejecución

1. Levanta el backend:

```bash
cd backend
npm run dev
```

2. Abre `frontend/proyecto ecopoint.html` con **Live Server** (clic derecho → *Open with Live Server*).

3. Verifica en consola del navegador que no haya errores de red al cargar la página.

La app quedará disponible en una URL similar a `http://127.0.0.1:5500/frontend/proyecto%20ecopoint.html`.

---

## Secciones de la aplicación

| Sección | Ancla | Descripción |
|---------|-------|-------------|
| Inicio | `#inicio` | Hero y llamada a la acción |
| Mapa | `#mapa` | Mapa embebido + lista de puntos desde la API |
| Guía | `#guia` | Tarjetas educativas con modal |
| Comunidad | `#comunidad` | Sistema de recompensas (puntos, medallas, ranking) |
| ODS | `#impacto` | Impacto social y ambiental |
| Mi Perfil | `#registro` | Login, registro y panel de perfil |

---

## Funcionalidades conectadas a la API

| Funcionalidad | Endpoint | Método |
|---------------|----------|--------|
| Registro de usuario | `/users` | `POST` |
| Inicio de sesión | `/auth/login` | `POST` |
| Perfil del usuario | `/auth/me` | `GET` |
| Listar puntos de reciclaje | `/recycling-points` | `GET` |
| Catálogo de medallas | `/medals` | `GET` |
| Puntos del usuario | `/recycling-records/user/:userId` | `GET` |

El token JWT se envía automáticamente en el header `Authorization: Bearer <token>` cuando existe sesión activa.

---

## Autenticación

- Al iniciar sesión, el token se guarda en `localStorage`.
- El botón del header cambia a **Cerrar sesión** y se muestra el panel de perfil.
- Sin sesión: se ocultan **Mi Perfil** (nav) y la tarjeta **Tus Puntos** en recompensas.
- Medallas y Top Recicladores permanecen visibles para todos los visitantes.

### Validaciones del registro (frontend)

| Campo | Regla |
|-------|-------|
| Nombre | Mínimo 3 caracteres |
| Correo | Debe incluir `@` y terminar en `.com` |
| Contraseña | Mínimo 6 caracteres, letras y números |
| Confirmar contraseña | Debe coincidir con la contraseña |

---

## Estructura del proyecto

```
frontend/
├── proyecto ecopoint.html    # Página principal (SPA)
├── css/
│   └── style.css             # Estilos globales y por sección
├── js/
│   ├── config.js             # URL de la API y clave del token
│   ├── api.js                # Cliente HTTP (fetch + JWT)
│   ├── auth.js               # Login, registro, perfil, UI de sesión
│   ├── points.js             # Listado de puntos de reciclaje
│   └── rewards.js            # Medallas y puntos del usuario
├── assets/
│   └── img/                  # Logos e imágenes
├── ARQUITECTURA.md           # Detalle técnico del frontend
└── README.md
```

---

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica y secciones ancladas |
| CSS3 | Layout responsive, grid, componentes visuales |
| JavaScript (ES6+) | Lógica, `fetch`, `async/await`, `localStorage` |
| Google Maps (iframe) | Mapa de referencia en la sección Mapa |
| Live Server | Servidor de desarrollo local |

---

## Flujo de prueba recomendado

1. Abre la app sin sesión → no debe aparecer **Tus Puntos** ni **Mi Perfil** en el menú.
2. Ve a **Registrarse**, crea una cuenta con correo `...@....com`.
3. Inicia sesión → debe mostrarse el perfil y la tarjeta de puntos.
4. En **Mapa**, verifica que carguen los puntos de reciclaje del backend.
5. En **Comunidad**, revisa el catálogo de medallas y tu total de puntos (0 si no hay registros).
6. Cierra sesión → la tarjeta de puntos debe ocultarse de nuevo.

Para sumar puntos de prueba, crea registros con Postman en `POST /api/recycling-records` y recarga la sección Comunidad.

---

## Notas del proyecto académico

- El **Top Recicladores** usa datos estáticos en el HTML (sin endpoint de ranking aún).
- Los filtros del mapa (Plástico, Papel, etc.) son visuales; el listado API no se filtra por material todavía.
- El frontend cumple el requisito de **login + consumo de al menos 2 CRUD** del proyecto final.

---

## Equipo

Proyecto grupal — Ingeniería Web I, UNIMINUTO.

Para la arquitectura interna, módulos JS y flujos de datos, consulta **[ARQUITECTURA.md](./ARQUITECTURA.md)**.
