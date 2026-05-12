# Sistema Difuso Mamdani para Riesgo Academico

Monorepo con:

- `apps/web`: interfaz Next.js.
- `packages/fuzzy-core`: motor Mamdani en TypeScript puro.
- `packages/report`: documento academico LaTeX.

Comandos:

```bash
pnpm install
pnpm dev
pnpm build
pnpm report
```

No usa machine learning. Solo fuzzificacion, reglas IF-THEN, min, max y centroide.

Para generar PDF del reporte instala `latexmk` o usa un entorno LaTeX equivalente.
