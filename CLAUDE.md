# Portfolio de Abigail Caricato

Next.js estático (`output: 'export'`) + TypeScript + GSAP. Español (`/es/`) e inglés (`/en/`). Ver README.md.

## Reglas

- **Honestidad:** la historia («Seis pliegos») es un borrador inventado a pedido, pendiente de que Abigail la apruebe; no sumar
  empleos, clientes, premios, métricas ni testimonios inventados. Los proyectos son trabajos reales de Abigail; los que son conceptos personales llevan
  su rótulo visible (`tag`). Sin logos de marcas (las
  herramientas se nombran en texto). Contacto solo con datos reales (`content/site.ts`).
- **Sin texto en componentes:** todo sale de `messages/{es,en}.json` (mismas claves; `npm test`).
- **Mobile-first:** sin scroll horizontal a 360 px, objetivos táctiles ≥ 44 px, texto ≥ 12 px.
- **Accesibilidad:** HTML semántico, teclado completo, foco visible, contraste AA (magenta de texto: `--m-deep` sobre papel,
  `--m-light` sobre tinta), `prefers-reduced-motion` en toda animación (estado final, sin movimiento).
- **Motion:** solo `transform`, `opacity`, `clip-path`, `stroke-dashoffset`. Nada en bucle fuera de pantalla (`useInView`).
  El recorrido horizontal de la historia solo con mouse/trackpad, ≥ 1024 px y movimiento permitido; en táctil se lee en vertical.
- **Dependencias:** no se agregan sin aprobación.

## Sistema

- Color: negro y papel cálidos de una misma familia, CMY de proceso ajustados al papel y un solo magenta como luz
  (`--m-deep` en papel, `--m-light` en tinta, `--velvet` en el manifiesto, `--glow` apenas en las hojas oscuras). Tokens en
  `app/globals.css`; los dibujos y estilos en línea usan `lib/palette.ts` con los mismos valores: nada de hex sueltos.
  Los fondos de la galería son tonales y de poco croma, para que el color lo ponga el trabajo. Marcas de imprenta en
  `components/print.tsx`.
- Cada sección declara `data-hdr="paper|ink|magenta"`: el header toma ese color.
- Entradas: `[data-reveal]` (o `data-reveal="clip"`, que sube con `clip-path`) y `<Lines>` con un solo IntersectionObserver
  (`components/Reveals.tsx`).
- Orden: portada → cinta → Trabajo (01) → Historia (02) → Proceso (03) → Herramientas (04) → manifiesto → Contacto (05);
  `SECTIONS` en `components/Chrome.tsx` sigue ese orden (el header marca la sección actual y se esconde al bajar).
- Galería de Trabajo: composición por proyecto en `content/work.ts` (`card`: foto, navegador, celulares o laptop;
  `size` tall/wide/full y `shift`), dibujada en `components/Cover.tsx`; las capas `data-depth` tienen parallax
  (GSAP, solo con movimiento permitido). `data-magnetic` (`components/Magnetic.tsx`) acerca un control al puntero fino.
- Textura de papel: `body::after` estático, se apaga con `prefers-contrast: more` / `forced-colors`.
- Carga (`Loader`) → `markReady()` → entrada de la portada (`onReady`, `lib/ready.ts`).
- Proyectos: ficha en `components/Work.tsx` (barra fija, intro, brandboard, siguiente proyecto) y brandboard en
  `components/Brandboard.tsx` (datos en `messages/*.json` y `content/work.ts`, mismo layout en es/en). Texto atenuado de la
  ficha con `--dim` (AA sobre los cinco colores), no con `opacity`. Dibujos de herramientas: `components/tools/ToolDemo.tsx`;
  ids de gradiente por instancia.
- En la ficha, las entradas al hacer scroll y la barra de progreso son CSS (`animation-timeline`), dentro de `@supports` y
  `prefers-reduced-motion: no-preference`; sin soporte se ven en su estado final.
