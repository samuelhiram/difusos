"use client";

import { useRef, useState } from "react";
import { Download, FileText, Loader2, Presentation, ScrollText } from "lucide-react";
import type { AcademicRiskInputValues, MamdaniResult } from "@academic-risk/fuzzy-core";
import { defaultCaseStudy } from "@academic-risk/fuzzy-core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PresentationChartFarm,
  type PresentationChartFarmHandle,
} from "@/components/fuzzy/PresentationChartFarm";

type DownloadBarProps = {
  values: AcademicRiskInputValues;
  result: MamdaniResult;
};

type Status = "idle" | "pptx" | "report" | "summary";

function buildCaseDescription(values: AcademicRiskInputValues): string {
  return `Caso descargado desde la app web con entradas en vivo (promedio=${values.average}, asistencia=${values.attendance}, entregas=${values.assignments}, participacion=${values.participation}, examenes=${values.exams}).`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function timestampSlug() {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

export function DownloadBar({ values, result }: DownloadBarProps) {
  const farmRef = useRef<PresentationChartFarmHandle>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handlePresentation() {
    setStatus("pptx");
    setError(null);
    try {
      const { presentationToBlob } = await import("@academic-risk/presentation");
      const chartImages = (await farmRef.current?.captureAll()) ?? [];
      const blob = await presentationToBlob({
        inputs: values,
        result,
        chartImages,
        caseLabel: `Caso descargado ${new Date().toLocaleDateString("es-MX")}`,
        caseDescription: buildCaseDescription(values),
      });
      downloadBlob(blob, `sistema-difuso-mamdani-${timestampSlug()}.pptx`);
    } catch (caught) {
      console.error(caught);
      setError("No se pudo generar la presentacion. Revisa la consola.");
    } finally {
      setStatus("idle");
    }
  }

  async function handleStaticReport() {
    setStatus("report");
    setError(null);
    try {
      const response = await fetch("/sistema-difuso-mamdani.pdf", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      downloadBlob(blob, "sistema-difuso-mamdani.pdf");
    } catch (caught) {
      console.error(caught);
      setError(
        "No se encontro el PDF compilado. Corre 'pnpm report:publish' en el repositorio para regenerarlo.",
      );
    } finally {
      setStatus("idle");
    }
  }

  async function handleExecutiveSummary() {
    setStatus("summary");
    setError(null);
    try {
      const { buildExecutiveSummaryPdf } = await import("@/lib/build-executive-summary");
      const chartImages = (await farmRef.current?.captureAll()) ?? [];
      const blob = await buildExecutiveSummaryPdf({ values, result, chartImages });
      downloadBlob(blob, `resumen-caso-${timestampSlug()}.pdf`);
    } catch (caught) {
      console.error(caught);
      setError("No se pudo generar el resumen ejecutivo. Revisa la consola.");
    } finally {
      setStatus("idle");
    }
  }

  const isDefaultCase =
    values.average === defaultCaseStudy.inputs.average &&
    values.attendance === defaultCaseStudy.inputs.attendance &&
    values.assignments === defaultCaseStudy.inputs.assignments &&
    values.participation === defaultCaseStudy.inputs.participation &&
    values.exams === defaultCaseStudy.inputs.exams;

  return (
    <>
      <PresentationChartFarm ref={farmRef} values={values} result={result} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5 text-primary" />
              Exportar evidencia
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {isDefaultCase
                ? "Caso por defecto. Modifica los sliders para reflejar otro estudiante."
                : "Las descargas reflejan los valores actuales de los sliders."}
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <Button
            variant="default"
            onClick={handlePresentation}
            disabled={status !== "idle"}
            className="h-auto w-full justify-start gap-3 py-3 text-left"
            title="Descarga una presentacion PowerPoint editable con el caso actual"
          >
            {status === "pptx" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Presentation className="h-5 w-5" />
            )}
            <span className="flex flex-col">
              <span className="text-sm font-semibold">Presentacion (.pptx)</span>
              <span className="text-[11px] font-normal opacity-80">Editable, con charts e inputs vivos</span>
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={handleStaticReport}
            disabled={status !== "idle"}
            className="h-auto w-full justify-start gap-3 py-3 text-left"
            title="Descarga el reporte academico LaTeX precompilado"
          >
            {status === "report" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            <span className="flex flex-col">
              <span className="text-sm font-semibold">Reporte LaTeX (.pdf)</span>
              <span className="text-[11px] font-normal opacity-80">Documento academico oficial</span>
            </span>
          </Button>

          <Button
            variant="secondary"
            onClick={handleExecutiveSummary}
            disabled={status !== "idle"}
            className="h-auto w-full justify-start gap-3 py-3 text-left"
            title="Genera un resumen ejecutivo del caso actual en PDF"
          >
            {status === "summary" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ScrollText className="h-5 w-5" />
            )}
            <span className="flex flex-col">
              <span className="text-sm font-semibold">Resumen del caso (.pdf)</span>
              <span className="text-[11px] font-normal opacity-80">Generado al vuelo con inputs vivos</span>
            </span>
          </Button>

          {error ? (
            <div className="md:col-span-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
