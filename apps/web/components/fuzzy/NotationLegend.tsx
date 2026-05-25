"use client";

import * as React from "react";
import { BookText, ChevronDown } from "lucide-react";
import { InlineMath } from "react-katex";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { inputOrder, variableName } from "@/lib/formal-notation";

type Entry = {
  symbol: string;
  meaning: React.ReactNode;
  ui: React.ReactNode;
};

function buildEntries(): Entry[] {
  const variableRows: Entry[] = inputOrder.map((id, i) => ({
    symbol: `x_${i + 1}\\in[0,100]`,
    meaning: <span>Variable difusa &quot;{variableName[id]}&quot;</span>,
    ui: (
      <span>
        Slider <strong>{variableName[id]}</strong> en el panel <em>Entradas</em>
      </span>
    ),
  }));

  const core: Entry[] = [
    {
      symbol: "X=(x_1,\\ldots,x_5)",
      meaning: <span>Vector crisp de entradas</span>,
      ui: <span>Los 5 sliders del panel <em>Entradas</em></span>,
    },
    {
      symbol: "T(x_i)=\\{A_1,A_2,\\ldots\\}",
      meaning: <span>Conjunto de terminos linguisticos de x<sub>i</sub></span>,
      ui: <span>Chips bajo cada slider (ej. bajo / regular / alto)</span>,
    },
    {
      symbol: "\\mu_{A}(x):X\\to[0,1]",
      meaning: <span>Funcion de pertenencia del termino A</span>,
      ui: <span>Curvas en la pestana <em>Funciones</em></span>,
    },
    {
      symbol: "\\mu_{term}(x_i)",
      meaning: <span>Grado de pertenencia en vivo</span>,
      ui: <span>Pills <code>μ<sub>term</sub>=0.xx</code> bajo cada slider</span>,
    },
    {
      symbol: "R_r:\\bigwedge_i\\mu_{A_i}(x_i)\\Rightarrow\\mu_{B_r}(y)",
      meaning: <span>Regla difusa r-esima IF-THEN</span>,
      ui: <span>Cada fila en <em>Inferencia y trazabilidad</em></span>,
    },
    {
      symbol: "\\alpha_r=\\min_i\\mu_{A_i}(x_i)",
      meaning: <span>Nivel de activacion (AND=min) de R<sub>r</sub></span>,
      ui: <span>Columna <code>α<sub>r</sub></code> + barra de la regla</span>,
    },
    {
      symbol: "\\mu'_{B_r}(y)=\\min(\\alpha_r,\\mu_{B_r}(y))",
      meaning: <span>Salida recortada por implicacion Mamdani</span>,
      ui: <span>Areas con sombra en el chart de defuzzificacion</span>,
    },
    {
      symbol: "\\mu_B(y)=\\max_r\\mu'_{B_r}(y)",
      meaning: <span>Agregacion por t-conorma max</span>,
      ui: <span>Envolvente superior en el chart de defuzzificacion</span>,
    },
    {
      symbol: "y^*=\\dfrac{\\int y\\,\\mu_B(y)dy}{\\int\\mu_B(y)dy}",
      meaning: <span>Centroide (defuzzificacion CoG)</span>,
      ui: <span>Numero grande en el banner Hero (60.37, 42.10, etc.)</span>,
    },
    {
      symbol: "L=\\arg\\max_k\\mu_{B_k}(y^*)",
      meaning: <span>Etiqueta linguistica dominante</span>,
      ui: <span>Badge de color (RIESGO ALTO, MEDIO, etc.)</span>,
    },
  ];

  return [...variableRows, ...core];
}

const ENTRIES = buildEntries();

export function NotationLegend({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Section
      title="Notacion formal"
      description="Mapeo simbolo academico ↔ elemento de la interfaz"
      icon={<BookText className="h-4 w-4" />}
      tone="muted"
      dense
      actions={
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Contraer notacion" : "Expandir notacion"}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border bg-background hover:bg-muted"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
      }
    >
      {open ? (
        <div className="space-y-1.5">
          {ENTRIES.map((entry, i) => (
            <div
              key={i}
              className="grid grid-cols-[minmax(0,1fr)] gap-1 rounded-md border bg-background px-2 py-1.5 text-[11.5px] leading-snug sm:grid-cols-[120px_minmax(0,1fr)]"
            >
              <div className="overflow-x-auto py-0.5">
                <InlineMath math={entry.symbol} />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="font-medium text-foreground">{entry.meaning}</div>
                <div className="text-[10.5px] text-muted-foreground">↦ {entry.ui}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-md border border-dashed bg-background/60 px-2.5 py-2 text-left text-[12px] text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <span>
            <InlineMath math={`X,\\;\\mu_{A_i}(x_i),\\;\\alpha_r,\\;\\mu_B(y),\\;y^*,\\;L`} />
          </span>
          <span className="text-[10.5px] uppercase tracking-wider">Expandir</span>
        </button>
      )}
    </Section>
  );
}
