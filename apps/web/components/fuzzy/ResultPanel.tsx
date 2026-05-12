"use client";

import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import { BrainCircuit, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OperationTrace } from "@/components/fuzzy/OperationTrace";

type ResultPanelProps = {
  result: MamdaniResult;
  onReset: () => void;
};

const riskTone: Record<string, string> = {
  low: "bg-emerald-600",
  medium: "bg-amber-500 text-slate-950",
  high: "bg-orange-600",
  critical: "bg-red-700",
};

export function ResultPanel({ result, onReset }: ResultPanelProps) {
  const activeRules = result.ruleActivations.filter((activation) => activation.alpha > 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Sistema Difuso Mamdani
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">Riesgo academico por reglas linguisticas. Sin ML.</p>
        </div>
        <Button size="icon" variant="outline" title="Restablecer" onClick={onReset}>
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

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <FileText className="h-4 w-4" />
              Ver trazado completo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Historial de operacion difusa</DialogTitle>
              <DialogDescription>
                Origen matematico del resultado crisp {result.centroid.toFixed(2)}.
              </DialogDescription>
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-y-auto pr-2">
              <OperationTrace result={result} />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
