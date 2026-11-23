# Abigail Caricato — Portfolio

Portfolio de Abigail Caricato, diseño gráfico y dirección de arte. Sitio estático en español e inglés.

**Concepto: «En registro».** El sitio es un pliego de imprenta: marcas de corte, cruces de registro, barra de color CMYK
y el nombre impreso en tres tintas (cian, magenta y amarillo) que entran en registro al cargar. Papel y tinta como fondos,
magenta de proceso como única luz.

## Stack

Next.js (App Router, `output: 'export'`) + TypeScript + GSAP/ScrollTrigger. Tipografías autoalojadas con `next/font`:
Bodoni Moda (títulos), Hanken Grotesk (texto) y DM Mono (datos y rótulos); Poppins solo en la ficha tipográfica de
Cripta Dulce y Juicy. Sin otras dependencias.

## Comandos

```sh
npm ci
npm run dev        # http://localhost:3000/es/
npm run typecheck
npm test           # paridad de textos es/en
npm run build      # → out/
```

## Contenido

- Textos: `messages/es.json` y `messages/en.json` (mismas claves; lo verifica `npm test`).
- Contacto: `content/site.ts`. Vacío = no se muestra. **Completar con los datos reales de Abigail.**
- Proyectos: textos y bloques del brandboard en `messages/*.json` (`work.projects`); colores, portada y herramientas en
  `content/work.ts`; imágenes en `public/trabajo/`; ficha en `components/Work.tsx` y brandboard en `components/Brandboard.tsx`.
  Los celulares de Walking Time y las laptops de Juicy están recortados (`.webp` con fondo transparente) para apoyarlos
  sobre el color de cada proyecto; las fotos de Crema Bis usan `blend: multiply` para fundir el fondo blanco.

## Antes de compartirlo

- **La historia es un primer borrador inventado** («Seis pliegos»: la mesa de la cocina, Photoshop, Illustrator, InDesign,
  After Effects, hoy). Abigail tiene que revisarla y reemplazar lo que no sea cierto.
- **Trabajo:** los cinco proyectos son trabajos reales de Abigail (VelMar, Crema Bis, Cripta Dulce, Walking Time, Juicy). Walking Time y Juicy llevan el rótulo «Concepto».
- El sitio sale con `noindex` (no aparece en buscadores) hasta que el contenido esté aprobado: variable de repo `PAGES_NOINDEX=0` para indexarlo.

## Deploy

`.github/workflows/pages.yml`: en cada push a `main` corre typecheck, tests y build, y publica `out/` en GitHub Pages
(fuente: GitHub Actions). La ruta base sale de `actions/configure-pages`. Con dominio propio no hace falta ruta base.
