# Presentacion PowerPoint automatica

Genera una presentacion editable `.pptx` desde el motor real `@academic-risk/fuzzy-core`.

Comandos:

```powershell
pnpm presentation
pnpm presentation:watch
pnpm presentation:open
```

Salida:

```text
packages/presentation/dist/sistema-difuso-mamdani.pptx
```

La presentacion se actualiza si cambian:

- variables linguisticas
- funciones de pertenencia
- reglas IF-THEN
- caso de prueba
- resultado crisp del motor

`presentation:watch` vigila `packages/fuzzy-core/src` y `packages/presentation/src`.

No exporta imagen plana. Genera slides editables en PowerPoint.
