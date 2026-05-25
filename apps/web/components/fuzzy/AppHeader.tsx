"use client";

import * as React from "react";
import { BookOpen, BrainCircuit, RotateCcw, Sparkles } from "lucide-react";
import type { AcademicRiskInputValues, MamdaniResult } from "@academic-risk/fuzzy-core";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/fuzzy/ExportMenu";

type AppHeaderProps = {
  values: AcademicRiskInputValues;
  result: MamdaniResult;
  onOpenHelp: () => void;
  onStartTour: () => void;
  onReset: () => void;
};

export function AppHeader({ values, result, onOpenHelp, onStartTour, onReset }: AppHeaderProps) {
  return (
    <header
      data-tour="app-header"
      className="sticky top-0 z-30 -mx-4 mb-2 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-background/85 px-4 py-2.5 backdrop-blur-md lg:-mx-6 lg:px-6"
    >
      <div className="flex items-center gap-3">
        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal-700 text-primary-foreground shadow-lg shadow-primary/30">
          <BrainCircuit className="h-4.5 w-4.5" />
          <span className="absolute -bottom-1 -right-1 inline-flex h-3 w-3 items-center justify-center rounded-full border-2 border-background bg-amber-400" />
        </span>
        <div className="leading-tight">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <span>Sistema difuso Mamdani</span>
            <span className="inline-flex h-1 w-1 rounded-full bg-primary/60" />
            <span className="text-muted-foreground">v1.0</span>
          </div>
          <h1 className="text-base font-semibold tracking-tight text-foreground sm:text-[17px]">
            Evaluacion de riesgo academico
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant="ghost"
          size="default"
          onClick={onStartTour}
          className="gap-2 text-primary hover:bg-primary/10"
          data-tour="btn-tour"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Tour</span>
        </Button>
        <Button
          variant="outline"
          size="default"
          onClick={onOpenHelp}
          className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
          data-tour="btn-how-to-use"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Como usar?</span>
          <span className="sm:hidden">Ayuda</span>
        </Button>
        <ExportMenu values={values} result={result} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          title="Restablecer caso por defecto"
          aria-label="Restablecer caso por defecto"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
