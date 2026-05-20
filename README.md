# Sistema Difuso Mamdani para Riesgo Academico

Sistema difuso clasico Mamdani (sin ML) para estimar riesgo academico de 0 a 100 en cinco variables: promedio, asistencia, entregas, participacion, examenes.

App interactiva en Next.js con descargas integradas: **presentacion PPTX editable**, **reporte LaTeX en PDF** y **resumen ejecutivo del caso actual**.

## Requisitos

Una sola dependencia global: **pnpm**.

```powershell
npm install -g pnpm
```

(Node.js 18+. Si vas a generar el PDF del reporte LaTeX, el bootstrap descarga Tectonic automaticamente.)

## Arrancar en dos comandos

```powershell
pnpm bootstrap   # primera vez: instala deps, baja Tectonic, compila PDF y PPTX
pnpm start       # arranca http://localhost:3000
```

`pnpm bootstrap` es idempotente: si lo corres de nuevo, solo rehace lo que cambio. Primera vez tarda ~2 min (descarga ~500 MB de paquetes LaTeX, queda cacheado).

## Comandos

| Comando | Que hace |
|---|---|
| `pnpm bootstrap` | Setup completo: deps + Tectonic + PDF + PPTX |
| `pnpm start` | Dev server en `http://localhost:3000` |
| `pnpm build` | Production build del web |
| `pnpm typecheck` | tsc en todos los paquetes |
| `pnpm report:publish` | Recompila el PDF y lo copia a `apps/web/public/` |
| `pnpm presentation` | Regenera el `.pptx` por defecto |
| `pnpm report:open` | Abre el PDF compilado |

## Estructura

```
apps/web                    Next.js + Recharts + KaTeX (UI y descargas)
packages/fuzzy-core         Motor Mamdani TypeScript (fuente unica)
packages/report             LaTeX + PGFPlots, compilado con Tectonic
packages/presentation       Generador PPTX (pptxgenjs)
scripts/                    setup.ps1, build-report.ps1, publish-report.ps1
```

El motor TS es la fuente de verdad. Un script `emit-data` lee de `fuzzy-core` y emite las tablas, datos numericos y curvas que consume el LaTeX. Cambiar el motor y recompilar regenera todo en cadena.

## Descargas desde la UI

| Boton | Como se genera | Necesita PDF compilado |
|---|---|---|
| Presentacion (.pptx) | `pptxgenjs` en el navegador con los inputs vivos | No |
| Resumen del caso (.pdf) | `jsPDF` en el navegador con los inputs vivos | No |
| Reporte LaTeX (.pdf) | Estatico desde `apps/web/public/` | Si |

Si todavia no corriste `pnpm bootstrap` o `pnpm report:publish`, el boton del reporte LaTeX no encuentra el PDF y muestra un mensaje claro.

## No usa machine learning

Funciones triangulares y trapezoidales, reglas IF-THEN, AND minimo, agregacion maximo, defuzzificacion centroide. Todo determinista y auditable.
