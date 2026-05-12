"use client";

import dynamic from "next/dynamic";
import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Salida agregada y centroide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-[330px] w-full">
          <DefuzzificationChartCanvas result={result} />
        </div>
        <div className="grid gap-2 text-sm md:grid-cols-3">
          <div className="rounded-md border p-2">
            <span className="text-muted-foreground">Numerador</span>
            <div className="font-semibold">{result.centroidNumerator.toFixed(3)}</div>
          </div>
          <div className="rounded-md border p-2">
            <span className="text-muted-foreground">Denominador</span>
            <div className="font-semibold">{result.centroidDenominator.toFixed(3)}</div>
          </div>
          <div className="rounded-md border p-2">
            <span className="text-muted-foreground">Crisp</span>
            <div className="font-semibold">{result.centroid.toFixed(3)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
