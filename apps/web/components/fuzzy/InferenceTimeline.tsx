"use client";

import { motion } from "motion/react";
import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InferenceTimelineProps = {
  result: MamdaniResult;
  expanded?: boolean;
};

const steps = [
  "Entradas",
  "Fuzzificacion",
  "Reglas",
  "Recorte",
  "Agregacion",
  "Centroide",
  "Resultado",
];

export function InferenceTimeline({ result, expanded = false }: InferenceTimelineProps) {
  const activations = [...result.ruleActivations].sort((a, b) => b.alpha - a.alpha);
  const visibleActivations = expanded ? activations : activations.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inferencia y trazabilidad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              className="rounded-md border bg-background p-2 text-center text-xs font-medium"
              animate={{ opacity: [0.45, 1, 0.75], y: [0, -2, 0] }}
              transition={{ duration: 1.4, delay: index * 0.12, repeat: Infinity, repeatDelay: 1.2 }}
            >
              {step}
            </motion.div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Regla</th>
                <th className="px-3 py-2">IF-THEN</th>
                <th className="px-3 py-2">alpha</th>
                <th className="px-3 py-2">Area recortada</th>
              </tr>
            </thead>
            <tbody>
              {visibleActivations.map((activation) => (
                <tr key={activation.rule.id} className="border-t">
                  <td className="px-3 py-2 font-semibold">{activation.rule.id}</td>
                  <td className="px-3 py-2">{activation.rule.text}</td>
                  <td className="px-3 py-2">
                    <Badge variant={activation.alpha > 0 ? "default" : "outline"}>
                      {activation.alpha.toFixed(3)}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">{activation.clippedArea.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
