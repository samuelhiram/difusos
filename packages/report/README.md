# Flujo LaTeX en VS Code

Archivo raiz:

```text
packages/report/main.tex
```

Compilar una vez:

```powershell
pnpm report
```

Compilar y validar calidad visual:

```powershell
pnpm report:check
```

Modo paralelo continuo:

```powershell
pnpm report:watch
```

En VS Code:

1. Abrir `packages/report/main.tex`.
2. `Ctrl + Alt + B` compila con `latexmk`.
3. Abrir PDF preview de LaTeX Workshop.
4. Editar secciones; cada seccion tiene `% !TEX root = ../main.tex`.

Reglas del proyecto:

- `latexmk` decide pasadas necesarias.
- `BibTeX` corre cuando referencias cambian.
- `SyncTeX` queda activo para saltar entre PDF y fuente.
- `report:check` falla si hay `Overfull`, `Underfull`, citas indefinidas o errores.
