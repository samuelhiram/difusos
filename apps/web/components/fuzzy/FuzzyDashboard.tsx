"use client";

import { useMemo } from "react";
import { BrainCircuit, RotateCcw } from "lucide-react";
import { academicRiskInputs, inferAcademicRisk } from "@academic-risk/fuzzy-core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputPanel } from "@/components/fuzzy/InputPanel";
import { MembershipChart } from "@/components/fuzzy/MembershipChart";
import { RuleGraph } from "@/components/fuzzy/RuleGraph";
import { InferenceTimeline } from "@/components/fuzzy/InferenceTimeline";
import { DefuzzificationChart } from "@/components/fuzzy/DefuzzificationChart";
import { LatexPanel } from "@/components/fuzzy/LatexPanel";
import { InterpretationPanel } from "@/components/fuzzy/InterpretationPanel";
import { useFuzzyStore } from "@/lib/use-fuzzy-store";

const riskTone: Record<string, string> = {
  low: "bg-emerald-600",
  medium: "bg-amber-500 text-slate-950",
  high: "bg-orange-600",
  critical: "bg-red-700",
};

export function FuzzyDashboard() {
  const { values, setValue, reset } = useFuzzyStore();
  const result = useMemo(() => inferAcademicRisk(values, 1), [values]);
  const activeRules = result.ruleActivations.filter((activation) => activation.alpha > 0);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-4 px-4 py-4 lg:px-6">
      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  Sistema Difuso Mamdani
                </CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Riesgo academico por reglas linguisticas. Sin ML.
                </p>
              </div>
              <Button size="icon" variant="outline" title="Restablecer" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border bg-muted/50 p-3">
                <div className="text-sm text-muted-foreground">Resultado crisp</div>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <div className="text-4xl font-semibold tracking-normal">{result.centroid.toFixed(2)}</div>
                  <span className={`rounded-md px-3 py-1 text-sm font-semibold text-white ${riskTone[result.labelId]}`}>
                    {result.label}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md border p-2">
                  <div className="text-muted-foreground">Reglas activas</div>
                  <div className="text-xl font-semibold">{activeRules.length}</div>
                </div>
                <div className="rounded-md border p-2">
                  <div className="text-muted-foreground">Centroide</div>
                  <div className="text-xl font-semibold">{result.centroid.toFixed(1)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <InterpretationPanel result={result} />
          <InputPanel values={values} onValueChange={setValue} />
        </div>

        <Tabs defaultValue="sistema" className="min-w-0">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
            <TabsTrigger value="funciones">Funciones</TabsTrigger>
            <TabsTrigger value="reglas">Reglas</TabsTrigger>
            <TabsTrigger value="formulas">Formulas</TabsTrigger>
          </TabsList>

          <TabsContent value="sistema" className="space-y-4">
            <RuleGraph result={result} />
            <div className="grid gap-4 xl:grid-cols-[1fr_460px]">
              <DefuzzificationChart result={result} />
              <InferenceTimeline result={result} />
            </div>
          </TabsContent>

          <TabsContent value="funciones">
            <div className="grid gap-4 xl:grid-cols-2">
              {academicRiskInputs.map((variable) => (
                <MembershipChart
                  key={variable.id}
                  variable={variable}
                  value={values[variable.id as keyof typeof values]}
                  degrees={result.fuzzification[variable.id]}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reglas">
            <InferenceTimeline result={result} expanded />
          </TabsContent>

          <TabsContent value="formulas">
            <LatexPanel result={result} />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
