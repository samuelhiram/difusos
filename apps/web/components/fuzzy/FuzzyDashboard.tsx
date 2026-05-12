"use client";

import { useMemo } from "react";
import { academicRiskInputs, inferAcademicRisk } from "@academic-risk/fuzzy-core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputPanel } from "@/components/fuzzy/InputPanel";
import { MembershipChart } from "@/components/fuzzy/MembershipChart";
import { RuleGraph } from "@/components/fuzzy/RuleGraph";
import { InferenceTimeline } from "@/components/fuzzy/InferenceTimeline";
import { DefuzzificationChart } from "@/components/fuzzy/DefuzzificationChart";
import { LatexPanel } from "@/components/fuzzy/LatexPanel";
import { InterpretationPanel } from "@/components/fuzzy/InterpretationPanel";
import { ResultPanel } from "@/components/fuzzy/ResultPanel";
import { useFuzzyStore } from "@/lib/use-fuzzy-store";

export function FuzzyDashboard() {
  const { values, setValue, reset } = useFuzzyStore();
  const result = useMemo(() => inferAcademicRisk(values, 1), [values]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col gap-4 px-4 py-4 lg:px-6">
      <section className="grid gap-4 xl:grid-cols-[360px_390px_minmax(0,1fr)]">
        <div className="space-y-4">
          <InputPanel values={values} onValueChange={setValue} />
        </div>

        <div className="space-y-4">
          <ResultPanel result={result} onReset={reset} />
          <InterpretationPanel result={result} />
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
