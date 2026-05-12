"use client";

import type { AcademicRiskInputValues, MamdaniResult } from "@academic-risk/fuzzy-core";
import { AlertTriangle, CheckCircle2, CircleAlert, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  }
> = {
  low: {
    title: "Riesgo bajo",
    meaning: "El estudiante muestra condiciones academicas estables. El sistema no detecta alerta fuerte.",
    action: "Mantener seguimiento ordinario.",
    icon: CheckCircle2,
  },
  medium: {
    title: "Riesgo medio",
    meaning: "Hay senales mixtas. El desempeno no es critico, pero requiere observacion.",
    action: "Revisar tareas, examenes recientes y asistencia antes del siguiente corte.",
    icon: Info,
  },
  high: {
    title: "Riesgo alto",
    meaning: "El sistema detecta deterioro academico relevante. Hay reglas de alerta activas.",
    action: "Aplicar intervencion temprana: asesoria, plan de entregas y seguimiento semanal.",
    icon: AlertTriangle,
  },
  critical: {
    title: "Riesgo critico",
    meaning: "El estudiante esta en zona de alerta severa segun las reglas difusas activadas.",
    action: "Requiere intervencion inmediata: revisar asistencia, promedio y cumplimiento de entregas.",
    icon: CircleAlert,
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

export function InterpretationPanel({ result }: InterpretationPanelProps) {
  const copy = levelCopy[result.labelId] ?? levelCopy.medium;
  const Icon = copy.icon;
  const activeRules = result.ruleActivations
    .filter((activation) => activation.alpha > 0)
    .sort((a, b) => b.alpha - a.alpha);
  const mainRules = activeRules.slice(0, 3).map((activation) => `${activation.rule.id} (${activation.alpha.toFixed(2)})`);
  const factors = getMainFactors(result);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          Interpretacion academica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="rounded-md border bg-muted/40 p-3">
          <div className="font-semibold">
            {copy.title}: {result.centroid.toFixed(2)} / 100
          </div>
          <p className="mt-1 text-muted-foreground">{copy.meaning}</p>
        </div>

        <div className="grid gap-2">
          <div>
            <span className="font-medium">Contexto: </span>
            mide nivel de alerta de reprobacion, no probabilidad estadistica.
          </div>
          <div>
            <span className="font-medium">Problema que atiende: </span>
            decisiones academicas con datos imprecisos, sin cortar todo en aprobado/reprobado.
          </div>
          <div>
            <span className="font-medium">Factores bajos: </span>
            {factors.join(", ")}.
          </div>
          <div>
            <span className="font-medium">Reglas dominantes: </span>
            {mainRules.length ? mainRules.join(", ") : "sin reglas activas"}.
          </div>
          <div>
            <span className="font-medium">Accion sugerida: </span>
            {copy.action}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
