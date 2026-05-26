"use client";

import type { AcademicRiskInputValues, MamdaniResult } from "@academic-risk/fuzzy-core";
import { AlertTriangle, CheckCircle2, CircleAlert, Info } from "lucide-react";
import { Section } from "@/components/ui/section";

type InterpretationPanelProps = {
  result: MamdaniResult;
};

const levelCopy: Record<
  string,
  {
    title: string;
    meaning: string;
    action: string;
    icon: typeof Info;
    tone: string;
  }
> = {
  low: {
    title: "Riesgo bajo",
    meaning: "El estudiante muestra condiciones academicas estables. El sistema no detecta alerta fuerte.",
    action: "Mantener seguimiento ordinario.",
    icon: CheckCircle2,
    tone: "border-emerald-300/70 bg-emerald-50 text-emerald-800",
  },
  medium: {
    title: "Riesgo medio",
    meaning: "Hay señales mixtas. El desempeño no es critico, pero requiere observacion.",
    action: "Revisar tareas, examenes recientes y asistencia antes del siguiente corte.",
    icon: Info,
    tone: "border-amber-300/70 bg-amber-50 text-amber-800",
  },
  high: {
    title: "Riesgo alto",
    meaning: "El sistema detecta deterioro academico relevante. Hay reglas de alerta activas.",
    action: "Aplicar intervencion temprana: asesoria, plan de entregas y seguimiento semanal.",
    icon: AlertTriangle,
    tone: "border-orange-300/70 bg-orange-50 text-orange-800",
  },
  critical: {
    title: "Riesgo critico",
    meaning: "El estudiante esta en zona de alerta severa segun las reglas difusas activadas.",
    action: "Requiere intervencion inmediata: revisar asistencia, promedio y cumplimiento de entregas.",
    icon: CircleAlert,
    tone: "border-red-300/70 bg-red-50 text-red-800",
  },
};

const inputLabels: Record<keyof AcademicRiskInputValues, string> = {
  average: "promedio",
  attendance: "asistencia",
  assignments: "entregas",
  participation: "participacion",
  exams: "examenes",
};

function getMainFactors(result: MamdaniResult) {
  return Object.entries(result.inputs)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([key, value]) => `${inputLabels[key as keyof AcademicRiskInputValues]} ${value.toFixed(0)}`);
}

function FactRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="py-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{term}</div>
      <div className="mt-0.5 text-[12.5px] leading-snug text-foreground">{children}</div>
    </div>
  );
}

export function InterpretationPanel({ result }: InterpretationPanelProps) {
  const copy = levelCopy[result.labelId] ?? levelCopy.medium;
  const Icon = copy.icon;
  const activeRules = result.ruleActivations
    .filter((activation) => activation.alpha > 0)
    .sort((a, b) => b.alpha - a.alpha);
  const mainRules = activeRules.slice(0, 3).map((activation) => `${activation.rule.id} (${activation.alpha.toFixed(2)})`);
  const factors = getMainFactors(result);
  const dominant = activeRules[0];

  return (
    <Section
      data-tour="interpretation-panel"
      step={3}
      title="Lectura del caso"
      description="Que significa el riesgo, por que salio y que revisar primero."
      icon={<Icon className="h-4 w-4" />}
      tone="accent"
    >
      <div className="space-y-3">
        <div className={`rounded-lg border p-2.5 ${copy.tone}`}>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Icon className="h-4 w-4" />
            {copy.title}
            <span className="ml-auto tabular-nums text-[12px] opacity-80">{result.centroid.toFixed(2)} / 100</span>
          </div>
          <p className="mt-1 text-[12.5px] leading-snug opacity-90">{copy.meaning}</p>
        </div>

        <div className="divide-y divide-border/60 rounded-lg border bg-background px-2.5">
          <FactRow term="Factores bajos">{factors.join(", ")}.</FactRow>
          <FactRow term="Reglas dominantes">{mainRules.length ? mainRules.join(", ") : "sin reglas activas"}.</FactRow>
          {dominant ? (
            <FactRow term="Por que salio asi">
              <span>
                La regla <strong>{dominant.rule.id}</strong> aporta el mayor alpha (
                <span className="tabular-nums">{dominant.alpha.toFixed(2)}</span>) y empuja el centroide hacia el
                conjunto consecuente <em>{dominant.rule.consequent.term}</em>. Enunciado:{" "}
                <span className="italic text-muted-foreground">{dominant.rule.text}</span>
              </span>
            </FactRow>
          ) : null}
          <FactRow term="Accion sugerida">{copy.action}</FactRow>
          <FactRow term="Lectura formal">
            <span className="text-muted-foreground">
              y* es el centroide de mu_B(y), centro de masa de la curva agregada. La etiqueta proviene del conjunto de
              salida con mayor pertenencia en y*.
            </span>
          </FactRow>
          <FactRow term="Cuidado">
            mide nivel de alerta, no probabilidad estadistica ni sentencia final.
          </FactRow>
        </div>
      </div>
    </Section>
  );
}
