# Xinergy 2026 — Sitio web

Sitio corporativo de Xinergy — consultoría en **eficiencias para el negocio** (consultoría, procurement, digital, managed services). Identidad de marca oficial.

## Paleta de marca

| Color | Hex | Uso |
|-------|-----|-----|
| Naranjo (principal) | `#FCA100` | CTAs, acentos, highlights |
| Morado pizarra | `#54526D` | Texto secundario, UI |
| Morado carbón | `#3F374B` | Fondos oscuros, headings |
| Beige | `#A28F6D` | Acentos suaves, tags |

## Tipografías

- **TT Fors Display** — titulares (`font-display`)
- **Univers** — cuerpo y UI

Coloque los `.woff2` licenciados en `public/fonts/` (ver `public/fonts/README.md`). Sin archivos, el sitio usa Helvetica/Arial como respaldo.

## Logos

- Marca: `public/brand/` — PNG **RGBA** generados desde los oficiales (`logo-white`, `logo-color`, etc.)
- Si actualizas los assets originales: `pip3 install pillow && python3 scripts/process-brand-logos.py`
- Clientes: `public/clients/` + listado en `src/lib/clients.ts`

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `/` — Home (estructura tipo Reverse: problema → valor → servicios → proceso → diagnóstico → casos → clientes → FAQ → CTA)
- `/nosotros` — About + ESG + stats
- `/servicios` + `/servicios/[slug]` — 7 líneas de servicio
- `/industrias` + `/industrias/[slug]` — 4 verticales
- `/casos` + `/casos/[slug]` — Challenge / Approach / Results
- `/insights` + `/insights/[slug]` — Thought leadership
- `/diagnostico` — **Calculadora de eficiencia** (industria, gasto, madurez, cash neutral)
- `/contacto` — Formulario + modelo comercial

Contenido editable en `src/lib/content.ts`.

## Build

```bash
npm run build
npm start
```
