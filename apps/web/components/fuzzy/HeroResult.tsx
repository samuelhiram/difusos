"use client";

import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import { Activity, AlertTriangle, FileText, GitMerge, Sigma, Sparkles, Target } from "lucide-react";
import { InlineMath } from "react-katex";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OperationTrace } from "@/components/fuzzy/OperationTrace";
import { cn } from "@/lib/utils";

type HeroResultProps = {
  result: MamdaniResult;
};

const riskMeta: Record<string, { bg: string; ring: string; chip: string; aura: string }> = {
  low: {
    bg: "bg-emerald-600",
    ring: "ring-emerald-200/70",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-300",
    aura: "from-emerald-500/15 via-transparent to-transparent",
  },
  medium: {
    bg: "bg-amber-500 text-slate-950",
    ring: "ring-amber-200/70",
    chip: "bg-amber-50 text-amber-700 border-amber-300",
    aura: "from-amber-400/15 via-transparent to-transparent",
  },
  high: {
    bg: "bg-orange-600",
    ring: "ring-orange-200/70",
    chip: "bg-orange-50 text-orange-700 border-orange-300",
    aura: "from-orange-500/20 via-transparent to-transparent",
  },
  critical: {
    bg: "bg-red-700",
    ring: "ring-red-200/70",
    chip: "bg-red-50 text-red-700 border-red-300",
    aura: "from-red-600/20 via-transparent to-transparent",
  },
};

const riskCopy: Record<string, { headline: string; action: string }> = {
  low: {
    headline: "Caso estable. No hay alerta fuerte.",
    action: "Mantener seguimiento normal.",
  },
  medium: {
    headline: "Caso intermedio. Hay señales mixtas.",
    action: "Revisar tareas, asistencia y examenes antes del siguiente corte.",
  },
  high: {
    headline: "Alerta alta. Varias reglas empujan el riesgo.",
    action: "Aplicar apoyo temprano y plan de recuperacion.",
  },
  critical: {
    headline: "Alerta severa. Atencion inmediata.",
    action: "Priorizar intervencion docente/tutor y seguimiento semanal.",
  },
};

const inputLabels: Record<string, string> = {
  average: "promedio",
  attendance: "asistencia",
  assignments: "entregas",
  participation: "participacion",
  exams: "examenes",
};

function Pill({ icon: Icon, label, value, hint }: { icon: typeof Activity; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex h-full items-center gap-2.5 rounded-lg border bg-background/80 px-3 py-2 backdrop-blur-sm">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-semibold leading-tight tabular-nums text-foreground">{value}</div>
        {hint ? <div className="truncate text-[10px] text-muted-foreground">{hint}</div> : null}
      </div>
    </div>
  );
}

export function HeroResult({ result }: HeroResultProps) {
  const meta = riskMeta[result.labelId] ?? riskMeta.medium;
  const activeRules = result.ruleActivations.filter((a) => a.alpha > 0);
  const dominantRule = activeRules.sort((a, b) => b.alpha - a.alpha)[0];
  const safeCentroid = Number.isFinite(result.centroid) ? result.centroid : 0;
  const pct = Math.min(100, Math.max(0, safeCentroid));
  const markerPos = `calc(${pct}% - 6px)`;
  const copy = riskCopy[result.labelId] ?? riskCopy.medium;
  const weakestInputs = Object.entries(result.inputs)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([key, value]) => `${inputLabels[key] ?? key} ${value.toFixed(0)}`)
    .join(", ");

  return (
    <section
      data-tour="hero-result"
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br ring-1 shadow-[0_1px_0_rgba(15,23,42,0.05),0_20px_40px_-20px_rgba(15,118,110,0.35)]",
        "from-card via-card to-card",
        meta.ring,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", meta.aura)} aria-hidden />
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-primary/10 blur-3xl" aria-hidden />

      <div className="relative grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Target className="h-3.5 w-3.5" />
              Resultado del caso actual
            </div>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", meta.chip)}>
              <span className={cn("inline-block h-1.5 w-1.5 rounded-full", meta.bg)} />
              Riesgo {result.label}
            </span>
          </div>

          <div className="grid items-end gap-4 lg:grid-cols-[auto_minmax(0,1fr)]">
            <div className="leading-none">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-muted-foreground">
                  <InlineMath math="y^*=" />
                </span>
                <span className="font-semibold tracking-tight tabular-nums text-foreground [font-size:clamp(2.5rem,5vw,3.75rem)]">
                  {result.covered ? result.centroid.toFixed(2) : "—"}
                </span>
                <span className="text-base font-normal text-muted-foreground">/100</span>
              </div>
              <div className="mt-1 overflow-x-auto text-[12px] text-muted-foreground">
                <InlineMath
                  math={String.raw`y^*=\dfrac{\sum y_i\,\mu_B(y_i)}{\sum\mu_B(y_i)}=\dfrac{${result.centroidNumerator.toFixed(2)}}{${result.centroidDenominator.toFixed(2)}}=${result.covered ? result.centroid.toFixed(2) : "\\text{indef.}"}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Pill
                icon={Activity}
                label="Reglas que influyen"
                value={`${activeRules.length} / ${result.ruleActivations.length}`}
                hint="detectaron evidencia"
              />
              <Pill
                icon={Sigma}
                label="Peso del riesgo"
                value={result.centroidNumerator.toFixed(2)}
                hint="suma ponderada"
              />
              <Pill
                icon={GitMerge}
                label="Evidencia total"
                value={result.centroidDenominator.toFixed(2)}
                hint="area acumulada"
              />
              {dominantRule ? (
                <Pill
                  icon={Sparkles}
                  label="Regla que mas pesa"
                  value={dominantRule.rule.id}
                  hint={`alpha=${dominantRule.alpha.toFixed(2)} hacia ${dominantRule.rule.consequent.term}`}
                />
              ) : (
                <div className="hidden h-full rounded-lg border border-dashed border-border/60 bg-background/40 sm:block" aria-hidden />
              )}
            </div>
          </div>

          <div className="grid gap-2 text-sm md:grid-cols-3">
            <div className="rounded-lg border bg-background/85 p-3">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Lectura rapida</div>
              <div className="mt-1 font-medium text-foreground">{copy.headline}</div>
            </div>
            <div className="rounded-lg border bg-background/85 p-3">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Primero revisar</div>
              <div className="mt-1 font-medium text-foreground">{weakestInputs}</div>
            </div>
            <div className="rounded-lg border bg-background/85 p-3">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Siguiente accion</div>
              <div className="mt-1 font-medium text-foreground">{copy.action}</div>
            </div>
          </div>

          {!result.covered ? (
            <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Sin cobertura: ninguna regla disparo con alpha &gt; 0 para este caso. Revisa las funciones de membresia y la
                base de reglas — los inputs cayeron en una zona sin soporte difuso.
              </span>
            </div>
          ) : null}

          <div className="space-y-1.5">
            <div className="relative h-3 overflow-hidden rounded-full border border-border/70 bg-muted">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-400 to-red-600" />
              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex" aria-hidden>
                <span className="h-full w-1/4 border-r border-background/50" />
                <span className="h-full w-1/4 border-r border-background/50" />
                <span className="h-full w-1/4 border-r border-background/50" />
                <span className="h-full w-1/4" />
              </div>
              <div className="absolute inset-y-0 left-0 bg-foreground/5 backdrop-blur-[1px]" style={{ width: `${pct}%` }} aria-hidden />
              <div
                className="absolute top-1/2 h-5 w-3 -translate-y-1/2 rounded-sm border-2 border-background bg-foreground shadow-md transition-[left] duration-500"
                style={{ left: markerPos }}
                aria-hidden
              />
            </div>
            <div className="grid grid-cols-4 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <span>bajo · 0-25</span>
              <span>medio · 25-50</span>
              <span>alto · 50-75</span>
              <span>critico · 75-100</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 lg:flex-col lg:items-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 whitespace-nowrap">
                <FileText className="h-4 w-4" />
                Ver trazado matematico
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Historial de operacion difusa</DialogTitle>
                <DialogDescription>
                  Origen matematico del resultado crisp {result.centroid.toFixed(2)}.
                </DialogDescription>
              </DialogHeader>
              <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                <OperationTrace result={result} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
