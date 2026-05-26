"use client";

import { motion } from "motion/react";
import { Activity, BrainCircuit } from "lucide-react";
import { InlineMath } from "react-katex";
import type { MamdaniResult, RuleActivation } from "@academic-risk/fuzzy-core";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { inputIndex } from "@/lib/formal-notation";

type InferenceTimelineProps = {
  result: MamdaniResult;
  expanded?: boolean;
};

const steps = [
  "Datos",
  "Grados μ",
  "Reglas",
  "Fuerza α",
  "Union",
  "Numero final",
  "Etiqueta",
];

function formalAntecedent(a: RuleActivation["antecedentDegrees"][number]): string {
  const i = inputIndex(a.variable);
  return String.raw`\mu_{${a.term}}(x_${i})`;
}

function formalRule(activation: RuleActivation): string {
  const ants = activation.antecedentDegrees.map(formalAntecedent).join(String.raw`\wedge `);
  return String.raw`R_{${activation.rule.id.replace(/^R/, "")}}:\;${ants}\;\Rightarrow\;\mu_{${activation.rule.consequent.term}}(y)`;
}

function formalAlpha(activation: RuleActivation): string {
  const args = activation.antecedentDegrees.map((a) => a.degree.toFixed(2)).join(",\\,");
  return String.raw`\alpha_{${activation.rule.id.replace(/^R/, "")}}=\min(${args})=${activation.alpha.toFixed(2)}`;
}

export function InferenceTimeline({ result, expanded = false }: InferenceTimelineProps) {
  const activations = [...result.ruleActivations].sort((a, b) => b.alpha - a.alpha);
  const visibleActivations = expanded ? activations : activations.slice(0, 6);
  const activeCount = activations.filter((a) => a.alpha > 0).length;

  return (
    <Section
      title="Reglas que explican el resultado"
      description={`${activeCount} de ${activations.length} reglas aportan evidencia. La fuerza alpha dice cuanto pesa cada una.`}
      icon={<BrainCircuit className="h-4 w-4" />}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 xl:grid-cols-7">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              className="flex items-center justify-center gap-1.5 rounded-md border bg-background px-2 py-1.5 text-[11px] font-medium"
              animate={{ opacity: [0.5, 1, 0.7], y: [0, -2, 0] }}
              transition={{ duration: 1.6, delay: index * 0.14, repeat: Infinity, repeatDelay: 1.4 }}
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[9.5px] font-bold text-primary">
                {index + 1}
              </span>
              {step}
            </motion.div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-muted text-left text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-14 px-3 py-2">Regla</th>
                <th className="px-3 py-2">Que dice</th>
                <th className="w-36 px-3 py-2">Fuerza</th>
                <th className="w-24 px-3 py-2">Aporta</th>
              </tr>
            </thead>
            <tbody>
              {visibleActivations.map((activation) => {
                const pct = Math.round(activation.alpha * 100);
                const isActive = activation.alpha > 0;
                return (
                  <tr key={activation.rule.id} className={`border-t align-top ${isActive ? "" : "opacity-60"}`}>
                    <td className="px-3 py-2 font-mono text-[12px] font-semibold text-primary">
                      {activation.rule.id}
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-[12.5px] font-medium leading-snug text-foreground">{activation.rule.text}</div>
                      <div className="mt-1 text-[11.5px] leading-snug text-muted-foreground">{activation.rule.justification}</div>
                      <div className="mt-1.5 overflow-x-auto text-[11px] text-muted-foreground/80">
                        <InlineMath math={formalRule(activation)} /> · <InlineMath math={formalAlpha(activation)} />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={isActive ? "default" : "outline"} className="tabular-nums">
                          {activation.alpha.toFixed(3)}
                        </Badge>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="tabular-nums text-[12.5px] font-medium">{activation.clippedArea.toFixed(2)}</div>
                      <div className="text-[10.5px] text-muted-foreground">area</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-dashed bg-muted/30 px-2.5 py-1.5 text-[11.5px] text-muted-foreground">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <InlineMath math={String.raw`\alpha_r=\min_{i}\mu_{A_i}(x_i),\quad\mu'_{B_r}(y)=\min(\alpha_r,\mu_{B_r}(y))`} />
        </div>
      </div>
    </Section>
  );
}
