"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileText, Loader2, Presentation, ScrollText } from "lucide-react";
import type { AcademicRiskInputValues, MamdaniResult } from "@academic-risk/fuzzy-core";
import { defaultCaseStudy } from "@academic-risk/fuzzy-core";
import { Button } from "@/components/ui/button";
import {
  PresentationChartFarm,
  type PresentationChartFarmHandle,
} from "@/components/fuzzy/PresentationChartFarm";
import { cn } from "@/lib/utils";

type ExportMenuProps = {
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

export function ExportMenu({ values, result }: ExportMenuProps) {
  const farmRef = useRef<PresentationChartFarmHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

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
      setOpen(false);
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
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      downloadBlob(blob, "sistema-difuso-mamdani.pdf");
      setOpen(false);
    } catch (caught) {
      console.error(caught);
      setError("No se encontro el PDF compilado. Corre 'pnpm report:publish' para regenerarlo.");
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
      setOpen(false);
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

  const busy = status !== "idle";

  return (
    <>
      <PresentationChartFarm ref={farmRef} values={values} result={result} />
      <div ref={containerRef} className="relative">
        <Button
          variant="default"
          onClick={() => setOpen((v) => !v)}
          className="gap-2"
          aria-haspopup="menu"
          aria-expanded={open}
          data-tour="btn-export"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden sm:inline">Exportar</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </Button>

        {open ? (
          <div
            role="menu"
            className="absolute right-0 top-full z-40 mt-2 w-[320px] origin-top-right animate-zoom-in rounded-xl border bg-popover p-1.5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2 px-2 py-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Exportar evidencia
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  isDefaultCase ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
                )}
              >
                {isDefaultCase ? "caso por defecto" : "caso editado"}
              </span>
            </div>

            <MenuItem
              icon={status === "pptx" ? Loader2 : Presentation}
              spinning={status === "pptx"}
              title="Presentacion .pptx"
              description="Editable con charts y datos vivos"
              onClick={handlePresentation}
              disabled={busy}
            />
            <MenuItem
              icon={status === "report" ? Loader2 : FileText}
              spinning={status === "report"}
              title="Reporte LaTeX .pdf"
              description="Documento academico oficial"
              onClick={handleStaticReport}
              disabled={busy}
            />
            <MenuItem
              icon={status === "summary" ? Loader2 : ScrollText}
              spinning={status === "summary"}
              title="Resumen del caso .pdf"
              description="Generado al vuelo con inputs actuales"
              onClick={handleExecutiveSummary}
              disabled={busy}
            />

            {error ? (
              <div className="mt-1 rounded-md border border-red-300 bg-red-50 px-2.5 py-1.5 text-[11px] text-red-700">
                {error}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}

function MenuItem({
  icon: Icon,
  spinning,
  title,
  description,
  onClick,
  disabled,
}: {
  icon: typeof Download;
  spinning?: boolean;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors",
        "hover:bg-muted focus:bg-muted focus:outline-none",
        "disabled:opacity-50 disabled:pointer-events-none",
      )}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className={cn("h-4 w-4", spinning && "animate-spin")} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold leading-tight">{title}</span>
        <span className="block text-[11px] leading-snug text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}
