# Bitácora Espacial

Portal de noticias de exploración espacial construido con React y Vite usando un sistema CSS propio (tokens de diseño, `@layer`, tipografía fluida, CSS Grid, `subgrid` y container queries).

## API utilizada

- [Spaceflight News API v4](https://api.spaceflightnewsapi.net/v4)

## Configuración y ejecución local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto a partir de `.env.example`:

   ```env
   VITE_API_URL=https://api.spaceflightnewsapi.net/v4
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

## Scripts disponibles

- `npm run dev` — Inicia el servidor local con Vite.
- `npm run build` — Genera la compilación de producción en `dist/`.
- `npm run preview` — Previsualiza la compilación de producción.
- `npm run lint` — Ejecuta `oxlint` sobre el proyecto.
