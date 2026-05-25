"use client";

import dynamic from "next/dynamic";
import { Crosshair } from "lucide-react";
import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import { Section, Stat } from "@/components/ui/section";

const DefuzzificationChartCanvas = dynamic(
  () => import("@/components/fuzzy/DefuzzificationChartCanvas").then((module) => module.DefuzzificationChartCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full rounded-md border bg-muted/30" />,
  },
);

type DefuzzificationChartProps = {
  result: MamdaniResult;
};

export function DefuzzificationChart({ result }: DefuzzificationChartProps) {
  return (
    <Section
      data-tour="defuzz-chart"
      title="Salida agregada y centroide"
      description="Area mu_B(y) tras recorte y agregacion. El centroide condensa todo en un numero."
      icon={<Crosshair className="h-4 w-4" />}
    >
      <div className="space-y-3">
        <div className="h-[330px] w-full rounded-md border bg-background">
          <DefuzzificationChartCanvas result={result} />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <Stat label="Numerador" value={result.centroidNumerator.toFixed(3)} hint="sum y mu(y)" />
          <Stat label="Denominador" value={result.centroidDenominator.toFixed(3)} hint="sum mu(y)" />
          <Stat label="Crisp y*" value={result.centroid.toFixed(3)} tone="primary" hint="CoG" />
        </div>
      </div>
    </Section>
  );
}
