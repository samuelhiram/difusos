"use client";

import { SlidersHorizontal } from "lucide-react";
import { InlineMath } from "react-katex";
import type { AcademicRiskInputValues, MamdaniResult } from "@academic-risk/fuzzy-core";
import { academicRiskInputs } from "@academic-risk/fuzzy-core";
import { InfoHint } from "@/components/ui/info-hint";
import { Section } from "@/components/ui/section";
import { Slider } from "@/components/ui/slider";
import { inputIndex, variableSymbol } from "@/lib/formal-notation";

type InputPanelProps = {
  values: AcademicRiskInputValues;
  onValueChange: (key: keyof AcademicRiskInputValues, value: number) => void;
  fuzzification?: MamdaniResult["fuzzification"];
};

const variableHints: Record<string, string> = {
  average: "Calificacion ponderada del periodo en escala 0-100.",
  attendance: "Porcentaje de sesiones cubiertas hasta hoy.",
  assignments: "Porcentaje de tareas entregadas a tiempo.",
  participation: "Aporte en clase, foros y trabajos colaborativos.",
  exams: "Promedio de examenes o quices recientes.",
};

const termColors = ["text-emerald-700 bg-emerald-50 border-emerald-200", "text-amber-700 bg-amber-50 border-amber-200", "text-orange-700 bg-orange-50 border-orange-200", "text-blue-700 bg-blue-50 border-blue-200"];

function valueTone(value: number) {
  if (value >= 75) return "text-emerald-600";
  if (value >= 55) return "text-amber-600";
  if (value >= 35) return "text-orange-600";
  return "text-red-600";
}

export function InputPanel({ values, onValueChange, fuzzification }: InputPanelProps) {
  return (
    <Section
      data-tour="input-panel"
      step={1}
      title="Entradas del sistema"
      description={
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <InlineMath math="X=(x_1,x_2,x_3,x_4,x_5)\in U^5,\;U=[0,100]" />
        </span>
      }
      icon={<SlidersHorizontal className="h-4 w-4" />}
      tone="primary"
    >
      <div className="space-y-4">
        {academicRiskInputs.map((variable) => {
          const key = variable.id as keyof AcademicRiskInputValues;
          const value = values[key];
          const tone = valueTone(value);
          const symbol = variableSymbol[key];
          const index = inputIndex(variable.id);
          const degrees = fuzzification?.[variable.id];

          return (
            <div key={variable.id} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <label className="inline-flex min-w-0 items-baseline gap-1.5" htmlFor={variable.id}>
                  <span className="font-mono text-[11px] font-semibold text-primary">
                    <InlineMath math={symbol} />
                  </span>
                  <span className="text-[12.5px] font-medium text-foreground">{variable.label}</span>
                  <InfoHint label={variable.label}>{variableHints[variable.id] ?? "Variable difusa de entrada."}</InfoHint>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className={`tabular-nums text-[13px] font-semibold ${tone}`}>{value.toFixed(0)}</span>
                  <input
                    id={variable.id}
                    type="number"
                    min={variable.min}
                    max={variable.max}
                    value={value}
                    onChange={(event) => onValueChange(key, Number(event.target.value))}
                    className="h-7 w-12 rounded-md border bg-background px-1.5 text-right text-[12px] outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <Slider
                min={variable.min}
                max={variable.max}
                step={1}
                value={[value]}
                onValueChange={([nextValue]) => onValueChange(key, nextValue ?? 0)}
              />
              <div className="flex items-center justify-between gap-1 text-[10px] tabular-nums text-muted-foreground">
                <span className="font-mono">0</span>
                <span className="text-[9.5px] uppercase tracking-wider opacity-80">
                  <InlineMath math={`T(x_${index})`} />
                </span>
                <span className="font-mono">100</span>
              </div>
              {degrees ? (
                <div className="flex flex-wrap gap-1">
                  {variable.terms.map((term, ti) => {
                    const grade = degrees[term.id] ?? 0;
                    const active = grade > 0.001;
                    return (
                      <span
                        key={term.id}
                        className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-mono tabular-nums transition-opacity ${
                          active ? termColors[ti % termColors.length] : "border-border bg-muted/50 text-muted-foreground/70 opacity-60"
                        }`}
                        title={`mu_${term.label}(${symbol.replace("x_", "x")}) = ${grade.toFixed(3)}`}
                      >
                        <span className="text-[10px]">μ<sub>{term.label}</sub>={grade.toFixed(2)}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {variable.terms.map((term) => (
                    <span key={term.id} className="rounded-sm bg-muted px-1 py-px text-[10px] font-medium text-foreground/70">
                      {term.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
