"use client";

import dynamic from "next/dynamic";
import { Gauge } from "lucide-react";
import type { VariableDefinition } from "@academic-risk/fuzzy-core";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";

const colors = ["#0f766e", "#d97706", "#dc2626", "#2563eb", "#16a34a"];

const MembershipChartCanvas = dynamic(
  () => import("@/components/fuzzy/MembershipChartCanvas").then((module) => module.MembershipChartCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full rounded-md border bg-muted/30" />,
  },
);

type MembershipChartProps = {
  variable: VariableDefinition;
  value: number;
  degrees: Record<string, number>;
};

export function MembershipChart({ variable, value, degrees }: MembershipChartProps) {
  const strongest = variable.terms
    .map((term) => ({ term, grade: degrees[term.id] ?? 0 }))
    .sort((a, b) => b.grade - a.grade)[0];

  return (
    <Section
      title={variable.label}
      description={`El valor ${value.toFixed(0)} se lee principalmente como ${strongest?.term.label ?? "sin etiqueta"}.`}
      icon={<Gauge className="h-4 w-4" />}
      tone="default"
      actions={
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] tabular-nums text-foreground/80">
          x = {value.toFixed(0)}
        </span>
      }
    >
      <div className="space-y-3">
        <div className="h-56 w-full rounded-md border bg-background">
          <MembershipChartCanvas variable={variable} value={value} />
        </div>
        <div className="rounded-md border bg-muted/30 px-2.5 py-2 text-[12px] text-muted-foreground">
          La linea vertical es el valor actual. Mientras mas alta toca una curva, mas pertenece a esa etiqueta.
        </div>
        <div className="flex flex-wrap gap-2">
          {variable.terms.map((term, index) => {
            const grade = degrees[term.id] ?? 0;
            const color = colors[index % colors.length];
            const isActive = grade > 0.001;
            return (
              <Badge
                key={term.id}
                variant="outline"
                className={`gap-1.5 ${isActive ? "bg-background" : "opacity-60"}`}
                style={{ borderColor: color, color: isActive ? color : undefined }}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                {term.label}
                <span className="font-mono text-[10.5px] tabular-nums opacity-80">{grade.toFixed(3)}</span>
              </Badge>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
