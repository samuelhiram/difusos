"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Crosshair, Gauge, ListChecks, Sigma, Workflow } from "lucide-react";
import { academicRiskInputs, inferAcademicRisk } from "@academic-risk/fuzzy-core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/fuzzy/AppHeader";
import { HeroResult } from "@/components/fuzzy/HeroResult";
import { InputPanel } from "@/components/fuzzy/InputPanel";
import { MembershipChart } from "@/components/fuzzy/MembershipChart";
import { RuleGraph } from "@/components/fuzzy/RuleGraph";
import { InferenceTimeline } from "@/components/fuzzy/InferenceTimeline";
import { DefuzzificationChart } from "@/components/fuzzy/DefuzzificationChart";
import { LatexPanel } from "@/components/fuzzy/LatexPanel";
import { InterpretationPanel } from "@/components/fuzzy/InterpretationPanel";
import { NotationLegend } from "@/components/fuzzy/NotationLegend";
import { GuidedTour, type GuidedTourStep } from "@/components/fuzzy/GuidedTour";
import { HowToUseDialog } from "@/components/fuzzy/HowToUseDialog";
import { ExplanationDialog } from "@/components/fuzzy/ExplanationDialog";
import { useFuzzyStore } from "@/lib/use-fuzzy-store";

const TOUR_STORAGE_KEY = "fuzzy-tour-seen-v1";

const tourSteps: GuidedTourStep[] = [
  {
    target: "app-header",
    title: "Bienvenido al sistema difuso Mamdani",
    placement: "center",
    body: (
      <span>
        Este tour de 6 pasos te guia por el tablero. En cualquier momento puedes abrir el manual completo con el boton{" "}
        <strong>Como usar?</strong>.
      </span>
    ),
  },
  {
    target: "hero-result",
    title: "1. Resultado del caso",
    placement: "bottom",
    body: (
      <span>
        El centroide y la etiqueta linguistica son lo primero que se ve. La barra muestra donde cae el caso en el
        espectro bajo-critico. Las pildoras de la derecha resumen reglas activas y centroide.
      </span>
    ),
  },
  {
    target: "input-panel",
    title: "2. Mueve las entradas",
    placement: "right",
    body: (
      <span>
        Los 5 sliders representan las variables academicas. Todo el sistema se recalcula en vivo, incluido el Hero de
        arriba.
      </span>
    ),
  },
  {
    target: "interpretation-panel",
    title: "3. Interpreta el caso",
    placement: "right",
    body: (
      <span>
        Aqui resumimos en lenguaje natural que significa el resultado, cuales fueron los factores mas bajos y que
        accion sugerimos.
      </span>
    ),
  },
  {
    target: "workspace-tabs",
    title: "4. Laboratorio de inspeccion",
    placement: "left",
    body: (
      <span>
        Las pestañas <strong>Mapa</strong>, <strong>Curvas</strong>, <strong>Reglas</strong> y{" "}
        <strong>Matematica</strong> te dejan profundizar en cada etapa del pipeline Mamdani.
      </span>
    ),
  },
  {
    target: "btn-export",
    title: "5. Exporta evidencia",
    placement: "bottom",
    body: (
      <span>
        Genera presentaciones PowerPoint, reporte academico LaTeX o resumen ejecutivo, todo con los valores actuales del
        caso.
      </span>
    ),
  },
  {
    target: "btn-how-to-use",
    title: "6. Manual interactivo siempre disponible",
    placement: "bottom",
    body: (
      <span>
        Abre el manual cuando quieras: trae diagramas, formulas, justificacion academica de cada operador y un FAQ.
      </span>
    ),
  },
];

export function FuzzyDashboard() {
  const { values, setValue, setValues, reset } = useFuzzyStore();
  const result = useMemo(() => inferAcademicRisk(values, 1), [values]);
  const [tourOpen, setTourOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(TOUR_STORAGE_KEY)) return;
    const id = window.setTimeout(() => setTourOpen(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  function closeTour() {
    setTourOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOUR_STORAGE_KEY, "1");
    }
  }

  function openTour() {
    setHelpOpen(false);
    setExplanationOpen(false);
    setTourOpen(true);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col gap-4 px-4 py-3 lg:px-6">
      <AppHeader
        values={values}
        result={result}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenExplanation={() => setExplanationOpen(true)}
        onStartTour={openTour}
        onReset={reset}
      />

      <HeroResult result={result} />

      <section className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-4">
          <InputPanel values={values} onValueChange={setValue} onValuesChange={setValues} fuzzification={result.fuzzification} />
          <InterpretationPanel result={result} />
          <NotationLegend />
        </div>

        <Tabs defaultValue="sistema" data-tour="workspace-tabs" className="min-w-0">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Explora el resultado</h2>
              <p className="text-[12px] text-muted-foreground">Empieza por el mapa, luego mira curvas y reglas.</p>
            </div>
          </div>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sistema" className="gap-1.5">
              <Workflow className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="funciones" className="gap-1.5">
              <Gauge className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Curvas</span>
            </TabsTrigger>
            <TabsTrigger value="reglas" className="gap-1.5">
              <ListChecks className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Reglas</span>
            </TabsTrigger>
            <TabsTrigger value="formulas" className="gap-1.5">
              <Sigma className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Matematica</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sistema" className="space-y-4">
            <RuleGraph result={result} />
            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <DefuzzificationChart result={result} />
              <InferenceTimeline result={result} />
            </div>
          </TabsContent>

          <TabsContent value="funciones">
            <div className="grid gap-4 2xl:grid-cols-2">
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

      <footer className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Crosshair className="h-3.5 w-3.5 text-primary" />
          Inferencia Mamdani - sin ML - resultados deterministicos
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ClipboardList className="h-3.5 w-3.5" />
          Estado: {result.ruleActivations.filter((r) => r.alpha > 0).length} reglas activas - centroide {result.centroid.toFixed(2)}
        </span>
      </footer>

      <HowToUseDialog open={helpOpen} onOpenChange={setHelpOpen} onStartTour={openTour} />
      <ExplanationDialog open={explanationOpen} onOpenChange={setExplanationOpen} />
      <GuidedTour open={tourOpen} steps={tourSteps} onClose={closeTour} />
    </main>
  );
}
