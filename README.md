# Fuzzy Academic Risk System

> Classic Mamdani fuzzy inference that scores student academic risk from 0 to 100 — no machine learning.

A deterministic Mamdani fuzzy system that estimates academic risk from five inputs: grade average,
attendance, assignment submissions, participation and exams. It ships as an interactive Next.js app
that also generates its own deliverables — an editable PPTX deck, a LaTeX report compiled to PDF,
and an executive summary of whatever case is currently on screen.

**Status:** Complete · Coursework · **Stack:** TypeScript monorepo (Next.js + LaTeX + pptxgenjs)

## Why no machine learning

Triangular and trapezoidal membership functions, IF-THEN rules, `AND` as minimum, aggregation as
maximum, centroid defuzzification. Every output traces back to the rules that produced it — which is
the point of a classic fuzzy system, and the reason it is preferable to a black box when a human has
to justify the score to the student it describes.

## Quick start

Prerequisites: **Node.js 18+** and **pnpm** (`npm install -g pnpm`).

```bash
git clone <repo-url>
cd sistema-difuso-riesgo-academico

pnpm bootstrap    # deps + Tectonic + PDF + PPTX
pnpm start        # http://localhost:3000
```

`pnpm bootstrap` is idempotent — re-running it only redoes what changed. The first run takes about
two minutes because it downloads roughly 500 MB of LaTeX packages, which are then cached. If the
LaTeX report PDF is not needed, Tectonic can be skipped entirely; bootstrap only fetches it when a
compile is actually going to happen.

## Commands

| Command | What it does |
|---|---|
| `pnpm bootstrap` | Full setup: deps + Tectonic + PDF + PPTX |
| `pnpm start` | Dev server on `http://localhost:3000` |
| `pnpm build` | Production build of the web app |
| `pnpm typecheck` | `tsc` across every package |
| `pnpm report:publish` | Recompile the PDF and copy it into `apps/web/public/` |
| `pnpm presentation` | Regenerate the default `.pptx` |
| `pnpm report:open` | Open the compiled PDF |

## Architecture

```
apps/web                Next.js + Recharts + KaTeX (UI and downloads)
packages/fuzzy-core     Mamdani engine in TypeScript — single source of truth
packages/report         LaTeX + PGFPlots, compiled with Tectonic
packages/presentation   PPTX generator (pptxgenjs)
scripts/                setup.ps1, build-report.ps1, publish-report.ps1
```

The TypeScript engine is the source of truth. An `emit-data` script reads from `fuzzy-core` and
emits the tables, numeric data and curves that the LaTeX consumes. Change the engine, recompile, and
everything downstream regenerates in a chain — so the report can never drift from the implementation
it describes.

## Downloads from the UI

| Button | How it is generated | Needs a compiled PDF |
|---|---|---|
| Presentation (`.pptx`) | `pptxgenjs` in the browser, from live inputs | No |
| Case summary (`.pdf`) | `jsPDF` in the browser, from live inputs | No |
| LaTeX report (`.pdf`) | Served statically from `apps/web/public/` | Yes |

Before `pnpm bootstrap` or `pnpm report:publish` has run, the LaTeX report button cannot find its
PDF and says so explicitly rather than failing silently.
