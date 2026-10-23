# Publicar el avance en Vercel

Este proyecto es una página estática. La carpeta `dist` contiene solo los archivos públicos de la página.

## Configuración de Vercel

- Project name: `enlace`
- Framework preset: Other
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

Conecta el repositorio privado de GitHub a Vercel. Cada actualización enviada a `main` publica una nueva versión del proyecto; las demás ramas producen enlaces de preview.

Comparte el enlace de Vercel con los dueños para que revisen el avance. El repositorio y el historial de cambios quedan privados. La página estática que se envía al navegador (HTML, CSS y JavaScript) puede inspeccionarse desde el navegador.
