"use client";

import * as React from "react";
import {
  BookOpen,
  BrainCircuit,
  Calculator,
  ClipboardList,
  Crosshair,
  Download,
  Gauge,
  GitMerge,
  GraduationCap,
  HelpCircle,
  Layers,
  ListChecks,
  MousePointerClick,
  Package,
  Scissors,
  SlidersHorizontal,
  Sparkles,
  Workflow,
} from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type SectionKey =
  | "overview"
  | "flow"
  | "inputs"
  | "fuzzification"
  | "rules"
  | "inference"
  | "aggregation"
  | "defuzzification"
  | "interpretation"
  | "theory"
  | "stack"
  | "exports"
  | "faq";

type SectionDef = {
  key: SectionKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  short: string;
};

const sections: SectionDef[] = [
  { key: "overview", label: "Vision general", icon: BookOpen, short: "Que es y para que sirve" },
  { key: "flow", label: "Flujo del sistema", icon: Workflow, short: "Diagrama de tuberia Mamdani" },
  { key: "inputs", label: "1. Entradas", icon: SlidersHorizontal, short: "Sliders y rangos" },
  { key: "fuzzification", label: "2. Fuzzificacion", icon: Gauge, short: "Grados de pertenencia mu(x)" },
  { key: "rules", label: "3. Reglas IF-THEN", icon: ListChecks, short: "Base de conocimiento" },
  { key: "inference", label: "4. Inferencia (alpha)", icon: BrainCircuit, short: "Activacion por min" },
  { key: "aggregation", label: "5. Recorte + Agregacion", icon: Layers, short: "Implicacion y max" },
  { key: "defuzzification", label: "6. Defuzzificacion", icon: Crosshair, short: "Centroide y* crisp" },
  { key: "interpretation", label: "7. Interpretacion", icon: ClipboardList, short: "Etiqueta linguistica" },
  { key: "theory", label: "Fundamentos teoricos", icon: GraduationCap, short: "Justificacion academica de operadores" },
  { key: "stack", label: "Stack tecnologico", icon: Package, short: "Por que cada libreria" },
  { key: "exports", label: "Exportar evidencia", icon: Download, short: "PPTX, PDF, resumen" },
  { key: "faq", label: "Preguntas frecuentes", icon: HelpCircle, short: "Dudas habituales" },
];

type HowToUseDialogProps = {
  trigger?: React.ReactNode;
  onStartTour?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function HowToUseDialog({ trigger, onStartTour, open, onOpenChange }: HowToUseDialogProps) {
  const [active, setActive] = React.useState<SectionKey>("overview");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-6xl p-0 sm:rounded-2xl">
        <div className="flex h-[min(82vh,720px)] min-h-0 flex-col md:flex-row">
          <aside className="flex shrink-0 flex-col gap-2 border-b border-border/70 bg-muted/40 p-4 md:w-64 md:border-b-0 md:border-r">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Manual interactivo</span>
            </div>
            <h2 className="text-base font-semibold leading-tight">Como usar este sistema difuso</h2>
            <p className="text-[12px] leading-snug text-muted-foreground">
              Guia visual y matematica del proceso Mamdani aplicado a riesgo academico.
            </p>
            {onStartTour ? (
              <Button
                size="default"
                className="mt-2 w-full justify-start gap-2"
                onClick={() => {
                  onOpenChange?.(false);
                  onStartTour();
                }}
              >
                <Sparkles className="h-4 w-4" />
                Tour guiado en pantalla
              </Button>
            ) : null}
            <nav className="mt-3 flex max-h-[260px] flex-row gap-1 overflow-x-auto md:max-h-none md:flex-col md:overflow-x-visible md:overflow-y-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = section.key === active;
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => setActive(section.key)}
                    className={cn(
                      "flex shrink-0 items-start gap-2 rounded-md border border-transparent px-2.5 py-2 text-left text-[12px] transition-colors md:shrink",
                      isActive
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-background hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span className="min-w-0">
                      <span className="block font-semibold leading-tight">{section.label}</span>
                      <span className="block text-[11px] leading-snug text-muted-foreground">{section.short}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 flex-1 overflow-y-auto">
            <article className="space-y-5 p-6">
              {active === "overview" ? <OverviewSection /> : null}
              {active === "flow" ? <FlowSection /> : null}
              {active === "inputs" ? <InputsSection /> : null}
              {active === "fuzzification" ? <FuzzificationSection /> : null}
              {active === "rules" ? <RulesSection /> : null}
              {active === "inference" ? <InferenceSection /> : null}
              {active === "aggregation" ? <AggregationSection /> : null}
              {active === "defuzzification" ? <DefuzzificationSection /> : null}
              {active === "interpretation" ? <InterpretationSection /> : null}
              {active === "theory" ? <TheorySection /> : null}
              {active === "stack" ? <StackSection /> : null}
              {active === "exports" ? <ExportsSection /> : null}
              {active === "faq" ? <FaqSection /> : null}
            </article>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Heading({ icon: Icon, children, kicker }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; kicker?: string }) {
  return (
    <header className="flex items-start gap-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        {kicker ? <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{kicker}</div> : null}
        <h3 className="text-lg font-semibold leading-tight">{children}</h3>
      </div>
    </header>
  );
}

function FormulaCard({ math, caption }: { math: string; caption?: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
      <BlockMath math={math} />
      {caption ? <p className="mt-1 text-[12px] text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  );
}

function OverviewSection() {
  return (
    <>
      <Heading icon={BookOpen} kicker="Vision general">
        Que problema resuelve este sistema
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Este tablero implementa un <strong className="text-foreground">sistema difuso Mamdani</strong> para evaluar el
        <strong className="text-foreground"> riesgo academico</strong> de un estudiante. A diferencia de un clasificador
        rigido (aprobado/reprobado), el sistema modela <em>grados</em> de pertenencia a categorias linguisticas como
        &quot;promedio bajo&quot; o &quot;asistencia alta&quot;, y combina reglas tipo IF-THEN escritas por un experto
        humano. No usa machine learning ni datos historicos.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-emerald-50/60 p-3 text-sm">
          <div className="mb-1 flex items-center gap-2 font-semibold text-emerald-700">
            <Sparkles className="h-4 w-4" /> Que SI hace
          </div>
          <ul className="space-y-1">
            <Bullet>Mide nivel de alerta sobre 5 variables academicas.</Bullet>
            <Bullet>Aplica reglas IF-THEN linguisticas y transparentes.</Bullet>
            <Bullet>Devuelve un valor crisp 0-100 + etiqueta cualitativa.</Bullet>
            <Bullet>Muestra cada paso matematico de forma trazable.</Bullet>
          </ul>
        </div>
        <div className="rounded-lg border bg-red-50/60 p-3 text-sm">
          <div className="mb-1 flex items-center gap-2 font-semibold text-red-700">
            <Crosshair className="h-4 w-4" /> Que NO hace
          </div>
          <ul className="space-y-1">
            <Bullet>No es una probabilidad estadistica de reprobar.</Bullet>
            <Bullet>No reemplaza el juicio del docente.</Bullet>
            <Bullet>No aprende automaticamente de casos previos.</Bullet>
            <Bullet>No predice calificaciones futuras.</Bullet>
          </ul>
        </div>
      </div>
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
        <div className="mb-1 flex items-center gap-2 font-semibold text-primary">
          <MousePointerClick className="h-4 w-4" />
          Primer paso recomendado
        </div>
        <p className="text-muted-foreground">
          Mueve cualquier slider en el panel <strong className="text-foreground">&quot;Entradas&quot;</strong>. Todos los
          paneles se recalculan en vivo. Despues abre el <strong className="text-foreground">tour guiado</strong> para
          recorrer cada bloque con explicacion contextual.
        </p>
      </div>
    </>
  );
}

function PipelineDiagram() {
  const blocks = [
    { id: "in", title: "Entradas", sub: "x1..x5", tone: "bg-slate-100 border-slate-300" },
    { id: "fz", title: "Fuzzificacion", sub: "mu(x)", tone: "bg-emerald-50 border-emerald-300" },
    { id: "rg", title: "Reglas IF-THEN", sub: "AND = min", tone: "bg-amber-50 border-amber-300" },
    { id: "cl", title: "Recorte", sub: "min(alpha, mu_B)", tone: "bg-orange-50 border-orange-300" },
    { id: "ag", title: "Agregacion", sub: "max", tone: "bg-purple-50 border-purple-300" },
    { id: "df", title: "Centroide", sub: "y*", tone: "bg-teal-50 border-teal-300" },
    { id: "out", title: "Etiqueta", sub: "bajo/critico", tone: "bg-primary text-primary-foreground border-primary" },
  ];
  return (
    <div className="overflow-x-auto rounded-lg border bg-background p-3">
      <div className="flex min-w-max items-center gap-1.5">
        {blocks.map((b, i) => (
          <React.Fragment key={b.id}>
            <div className={cn("min-w-[110px] rounded-md border px-2.5 py-2 text-center shadow-sm", b.tone)}>
              <div className="text-[12px] font-semibold leading-tight">{b.title}</div>
              <div className={cn("text-[10px] leading-tight", b.id === "out" ? "text-primary-foreground/80" : "text-muted-foreground")}>{b.sub}</div>
            </div>
            {i < blocks.length - 1 ? (
              <svg width="22" height="14" viewBox="0 0 22 14" className="shrink-0 text-primary">
                <path d="M0 7 H18 M14 3 L18 7 L14 11" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function FlowSection() {
  return (
    <>
      <Heading icon={Workflow} kicker="Pipeline">
        El flujo completo Mamdani
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Mamdani es una arquitectura clasica de sistemas difusos: convierte numeros a grados linguisticos, evalua reglas
        humanas, agrega salidas y vuelve a un numero. Este es el flujo que ejecuta cada vez que mueves un slider:
      </p>
      <PipelineDiagram />
      <ol className="space-y-2 text-sm">
        {[
          ["Entradas crisp", "5 valores numericos (0-100) provistos por los sliders."],
          ["Fuzzificacion", "Cada valor se proyecta sobre funciones triangulares/trapezoidales y se obtiene mu(x) por termino."],
          ["Activacion de reglas", "Para cada regla IF-THEN se calcula alpha = min de sus antecedentes."],
          ["Recorte (implicacion)", "La salida de cada regla se recorta verticalmente al nivel alpha."],
          ["Agregacion", "Todas las salidas recortadas se combinan con max para obtener mu_B(y)."],
          ["Defuzzificacion", "Se calcula el centroide y* del area resultante: un valor crisp en [0,100]."],
          ["Interpretacion", "El termino del consecuente con mayor mu(y*) define la etiqueta final."],
        ].map(([title, desc], i) => (
          <li key={i} className="flex gap-3 rounded-md border bg-background p-2.5">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {i + 1}
            </span>
            <span>
              <strong className="text-foreground">{title}.</strong>{" "}
              <span className="text-muted-foreground">{desc}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

function InputsSection() {
  const variables = [
    ["Promedio actual", "Calificacion ponderada del periodo, escala 0-100.", "average"],
    ["Asistencia", "Porcentaje de sesiones cubiertas hasta la fecha.", "attendance"],
    ["Entregas", "Porcentaje de tareas y trabajos entregados a tiempo.", "assignments"],
    ["Participacion", "Aporte en clase, foros y actividades colaborativas.", "participation"],
    ["Examenes recientes", "Promedio de los examenes/quices del corte.", "exams"],
  ];
  return (
    <>
      <Heading icon={SlidersHorizontal} kicker="Paso 1">
        Entradas numericas (crisp)
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        El sistema acepta 5 variables. Todas estan normalizadas a la escala <InlineMath math="[0,100]" /> para mantener
        comparabilidad. Usa los sliders o el input numerico; los limites se aplican automaticamente.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {variables.map(([label, desc, id]) => (
          <div key={id} className="rounded-lg border bg-background p-3">
            <div className="text-sm font-semibold leading-tight">{label}</div>
            <div className="text-[12px] text-muted-foreground">{desc}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-amber-300/70 bg-amber-50/60 p-3 text-sm">
        <strong className="text-amber-800">Tip docente:</strong>{" "}
        <span className="text-amber-900/80">
          Para reproducir un caso real, captura los valores tal como aparecen en el sistema de control escolar; no los
          redondees a multiplos de 10.
        </span>
      </div>
    </>
  );
}

function MembershipDiagram() {
  return (
    <svg viewBox="0 0 320 140" className="h-32 w-full">
      <line x1="20" y1="120" x2="310" y2="120" stroke="#94a3b8" strokeWidth="1" />
      <line x1="20" y1="20" x2="20" y2="120" stroke="#94a3b8" strokeWidth="1" />
      <polyline points="20,120 60,120 120,30 180,120" fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth="2" />
      <polyline points="120,120 180,40 240,120" fill="rgba(217,119,6,0.15)" stroke="#d97706" strokeWidth="2" />
      <polyline points="180,120 240,40 290,40 290,120" fill="rgba(15,118,110,0.15)" stroke="#0f766e" strokeWidth="2" />
      <text x="80" y="135" fontSize="9" fill="#64748b">bajo</text>
      <text x="170" y="135" fontSize="9" fill="#64748b">regular</text>
      <text x="255" y="135" fontSize="9" fill="#64748b">alto</text>
      <text x="305" y="128" fontSize="9" fill="#64748b">x</text>
      <text x="6" y="22" fontSize="9" fill="#64748b">1.0</text>
      <line x1="150" y1="20" x2="150" y2="120" stroke="#0f172a" strokeDasharray="3 3" strokeWidth="1" />
      <circle cx="150" cy="68" r="3.5" fill="#0f172a" />
      <text x="156" y="64" fontSize="9" fill="#0f172a">mu_regular(x)=0.65</text>
    </svg>
  );
}

function FuzzificationSection() {
  return (
    <>
      <Heading icon={Gauge} kicker="Paso 2">
        Fuzzificacion: numero a grado linguistico
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Cada variable se evalua contra sus terminos linguisticos (bajo, regular, alto, etc.) usando funciones de
        pertenencia. Se usan dos formas estandar:
      </p>
      <FormulaCard
        math={String.raw`\mu_{tri}(x)=\max\!\left(0,\;\min\!\left(\tfrac{x-a}{b-a},\;\tfrac{c-x}{c-b}\right)\right)`}
        caption="Triangular - tres puntos (a, b, c)."
      />
      <FormulaCard
        math={String.raw`\mu_{trap}(x)=\max\!\left(0,\;\min\!\left(\tfrac{x-a}{b-a},\;1,\;\tfrac{d-x}{d-c}\right)\right)`}
        caption="Trapezoidal - cuatro puntos (a, b, c, d)."
      />
      <div className="rounded-lg border bg-background p-3">
        <div className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          Ejemplo visual (Promedio = 65)
        </div>
        <MembershipDiagram />
      </div>
      <ul className="space-y-1.5">
        <Bullet>Un mismo valor puede pertenecer a varios terminos con distinto grado.</Bullet>
        <Bullet>Los grados estan acotados en [0, 1]; suelen NO sumar 1.</Bullet>
        <Bullet>La pestana &quot;Funciones&quot; muestra las curvas reales del sistema.</Bullet>
      </ul>
    </>
  );
}

function RulesSection() {
  return (
    <>
      <Heading icon={ListChecks} kicker="Paso 3">
        Reglas IF-THEN (base de conocimiento)
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Las reglas son el corazon del sistema: codifican la heuristica del experto humano. Cada regla tiene un{" "}
        <em>antecedente</em> (condiciones unidas por AND) y un <em>consecuente</em> (etiqueta de salida).
      </p>
      <div className="rounded-lg border bg-muted/30 p-3 font-mono text-[12px] leading-relaxed text-foreground">
        <div>
          <span className="text-primary">IF</span> promedio is bajo <span className="text-primary">AND</span> entregas is
          insuficientes
        </div>
        <div className="pl-4">
          <span className="text-primary">THEN</span> riesgo is critico
        </div>
      </div>
      <FormulaCard
        math={String.raw`\alpha_r=\min(\mu_{A_1}(x_1),\;\mu_{A_2}(x_2),\;\ldots,\;\mu_{A_n}(x_n))`}
        caption="alpha_r = nivel de activacion de la regla r usando AND interpretado como minimo."
      />
      <ul className="space-y-1.5">
        <Bullet>Si alpha = 0, la regla no aporta nada al resultado.</Bullet>
        <Bullet>Si alpha = 1, la regla se aplica con maxima intensidad.</Bullet>
        <Bullet>Puedes inspeccionar las reglas activas en la pestana &quot;Reglas&quot; o en la &quot;Trazabilidad&quot;.</Bullet>
      </ul>
    </>
  );
}

function InferenceSection() {
  return (
    <>
      <Heading icon={BrainCircuit} kicker="Paso 4">
        Inferencia: cuanto activa cada regla
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Por cada regla calculamos su intensidad <InlineMath math="\alpha" />. La pestana &quot;Reglas&quot; lista todas
        las activaciones ordenadas y el panel &quot;Resultado&quot; resume cuantas estan vivas (<InlineMath math="\alpha>0" />).
      </p>
      <div className="rounded-lg border bg-background p-3">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          Mini-ejemplo
        </div>
        <pre className="mt-2 overflow-x-auto rounded-md bg-muted/50 p-2 text-[11.5px] leading-snug text-foreground">{`mu_bajo(promedio=58)        = 0.13
mu_insuficientes(entregas=55) = 0.33
alpha_R1 = min(0.13, 0.33)  = 0.13`}</pre>
      </div>
    </>
  );
}

function ClippingDiagram() {
  return (
    <svg viewBox="0 0 320 140" className="h-32 w-full">
      <line x1="20" y1="120" x2="310" y2="120" stroke="#94a3b8" />
      <line x1="20" y1="20" x2="20" y2="120" stroke="#94a3b8" />
      <polygon points="40,120 130,40 220,120" fill="rgba(15,118,110,0.12)" stroke="#0f766e" strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points="40,120 95,80 175,80 220,120" fill="rgba(15,118,110,0.45)" stroke="#0f766e" strokeWidth="2" />
      <line x1="20" y1="80" x2="310" y2="80" stroke="#dc2626" strokeDasharray="4 3" strokeWidth="1" />
      <text x="260" y="76" fontSize="9" fill="#dc2626">alpha = 0.55</text>
      <text x="6" y="22" fontSize="9" fill="#64748b">1.0</text>
      <text x="305" y="128" fontSize="9" fill="#64748b">y</text>
    </svg>
  );
}

function AggregationSection() {
  return (
    <>
      <Heading icon={Layers} kicker="Paso 5">
        Recorte (implicacion) + Agregacion
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        La salida de cada regla activa se <strong className="text-foreground">recorta</strong> a su nivel
        <InlineMath math="\;\alpha_r" /> (Mamdani usa <code>min</code> como operador de implicacion). Luego todas las
        salidas recortadas se <strong className="text-foreground">agregan</strong> con <code>max</code>.
      </p>
      <FormulaCard math={String.raw`\mu'_{B_r}(y)=\min(\alpha_r,\;\mu_{B_r}(y))`} caption="Implicacion - recorte vertical." />
      <div className="rounded-lg border bg-background p-3">
        <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Scissors className="h-3.5 w-3.5" /> Recorte visual
        </div>
        <ClippingDiagram />
      </div>
      <FormulaCard math={String.raw`\mu_B(y)=\max_{r=1}^{m}\mu'_{B_r}(y)`} caption="Agregacion - envolvente superior de todas las regiones activas." />
    </>
  );
}

function CentroidDiagram() {
  return (
    <svg viewBox="0 0 320 140" className="h-32 w-full">
      <line x1="20" y1="120" x2="310" y2="120" stroke="#94a3b8" />
      <line x1="20" y1="20" x2="20" y2="120" stroke="#94a3b8" />
      <path d="M40,120 L70,80 L150,80 L185,55 L240,55 L260,120 Z" fill="rgba(13,148,136,0.25)" stroke="#0d9488" strokeWidth="1.8" />
      <line x1="172" y1="20" x2="172" y2="120" stroke="#0f172a" strokeWidth="1.4" />
      <circle cx="172" cy="120" r="3" fill="#0f172a" />
      <text x="178" y="32" fontSize="10" fill="#0f172a" fontWeight="600">y* = 64.2</text>
      <text x="178" y="44" fontSize="9" fill="#64748b">centroide</text>
      <text x="305" y="128" fontSize="9" fill="#64748b">y</text>
    </svg>
  );
}

function DefuzzificationSection() {
  return (
    <>
      <Heading icon={Crosshair} kicker="Paso 6">
        Defuzzificacion por centroide
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        El area <InlineMath math="\mu_B(y)" /> se condensa a <strong className="text-foreground">un solo numero</strong> con el
        metodo del centroide (CoG):
      </p>
      <FormulaCard math={String.raw`y^*=\frac{\int y\,\mu_B(y)\,dy}{\int \mu_B(y)\,dy}\;\approx\;\frac{\sum_i y_i\mu_B(y_i)}{\sum_i\mu_B(y_i)}`} caption="Se aproxima numericamente con paso Delta y = 1 en el dominio [0, 100]." />
      <div className="rounded-lg border bg-background p-3">
        <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          <GitMerge className="h-3.5 w-3.5" /> Donde &quot;cae&quot; el centroide
        </div>
        <CentroidDiagram />
      </div>
      <ul className="space-y-1.5">
        <Bullet>El resultado es estable: pequenos cambios en sliders mueven y* suavemente.</Bullet>
        <Bullet>Es el numero grande mostrado en el panel &quot;Sistema Difuso Mamdani&quot;.</Bullet>
      </ul>
    </>
  );
}

function InterpretationSection() {
  return (
    <>
      <Heading icon={ClipboardList} kicker="Paso 7">
        Etiqueta linguistica e interpretacion
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Para reportar el resultado a un humano, se elige la etiqueta de salida cuyo grado en{" "}
        <InlineMath math="y^*" /> es maximo:
      </p>
      <FormulaCard math={String.raw`L=\arg\max_k \mu_{B_k}(y^*)`} caption="L es la etiqueta dominante (bajo / medio / alto / critico)." />
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          ["bajo", "0 - 25", "Seguimiento ordinario.", "bg-emerald-50 border-emerald-300 text-emerald-700"],
          ["medio", "25 - 50", "Observar antes del siguiente corte.", "bg-amber-50 border-amber-300 text-amber-700"],
          ["alto", "50 - 75", "Intervencion temprana semanal.", "bg-orange-50 border-orange-300 text-orange-700"],
          ["critico", "75 - 100", "Intervencion inmediata.", "bg-red-50 border-red-300 text-red-700"],
        ].map(([label, range, action, tone]) => (
          <div key={label} className={cn("rounded-lg border p-2.5 text-sm", tone)}>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Riesgo {range}</div>
            <div className="text-base font-semibold capitalize leading-tight">{label}</div>
            <div className="text-[12px] opacity-90">{action}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function ExportsSection() {
  return (
    <>
      <Heading icon={Download} kicker="Documentar">
        Exportar evidencia del caso
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Toda exportacion captura el estado actual de los sliders y los graficos resultantes. Usalo para entregar tareas,
        actas o material de clase.
      </p>
      <ul className="space-y-2">
        <li className="rounded-lg border bg-background p-3 text-sm">
          <div className="font-semibold">Presentacion (.pptx)</div>
          <div className="text-muted-foreground">PowerPoint editable con cada chart capturado a alta resolucion y resumen del caso.</div>
        </li>
        <li className="rounded-lg border bg-background p-3 text-sm">
          <div className="font-semibold">Reporte LaTeX (.pdf)</div>
          <div className="text-muted-foreground">Documento academico oficial precompilado (formal, con formulas). Requiere
            <code className="mx-1 rounded bg-muted px-1">pnpm report:publish</code> en repo si falta.</div>
        </li>
        <li className="rounded-lg border bg-background p-3 text-sm">
          <div className="font-semibold">Resumen del caso (.pdf)</div>
          <div className="text-muted-foreground">Generado al vuelo con inputs vivos. Util para anexar al expediente del estudiante.</div>
        </li>
      </ul>
    </>
  );
}

function FaqSection() {
  const items = [
    [
      "Por que mi resultado no cambia mucho al mover un solo slider?",
      "Las reglas combinan varias variables con AND=min. Si otra variable esta en un termino con grado bajo, ese minimo limita la regla. Mueve dos o tres a la vez para ver desplazamientos mas grandes.",
    ],
    [
      "Que pasa si todos los sliders estan al maximo?",
      "Se activan reglas de riesgo bajo y el centroide cae cerca de 10-20. La etiqueta dominante sera 'bajo'.",
    ],
    [
      "Donde estan las definiciones de cada termino?",
      "En la pestana 'Funciones' del panel derecho. Veras las curvas reales y la pertenencia de la x actual.",
    ],
    [
      "Puedo ver el desarrollo matematico paso a paso?",
      "Si. En el panel 'Sistema Difuso Mamdani' pulsa 'Ver trazado completo' o abre la pestana 'Formulas'.",
    ],
    [
      "Reinicia los valores el sistema?",
      "Usa el boton circular con la flecha en el panel 'Sistema Difuso Mamdani' para volver al caso por defecto.",
    ],
  ];
  return (
    <>
      <Heading icon={HelpCircle} kicker="FAQ">
        Preguntas frecuentes
      </Heading>
      <div className="space-y-2">
        {items.map(([q, a]) => (
          <details key={q} className="group rounded-lg border bg-background p-3 text-sm open:shadow-sm">
            <summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden">
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-90">
                  <Calculator className="h-2.5 w-2.5" />
                </span>
                {q}
              </span>
            </summary>
            <p className="mt-2 pl-6 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </>
  );
}

function Citation({ children }: { children: React.ReactNode }) {
  return (
    <cite className="not-italic font-medium text-foreground">{children}</cite>
  );
}

function RefList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-2 list-decimal space-y-1 pl-5 text-[12px] leading-snug text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  );
}

function ComparisonTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      {caption ? (
        <div className="border-b bg-muted/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {caption}
        </div>
      ) : null}
      <table className="w-full min-w-[520px] text-[12.5px]">
        <thead className="bg-muted/30 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-foreground/90">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TheorySection() {
  return (
    <>
      <Heading icon={GraduationCap} kicker="Justificacion academica">
        Fundamentos teoricos del modelo
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Este sistema NO es una eleccion arbitraria de operadores: cada componente esta tomado de la formulacion
        clasica de <Citation>Mamdani y Assilian (1975)</Citation> sobre la teoria de conjuntos difusos introducida por
        <Citation> Zadeh (1965)</Citation>. A continuacion se justifica, paso a paso, por que cada funcion y operador es
        la opcion adecuada para el problema de <em>evaluacion de riesgo academico bajo incertidumbre linguistica</em>.
      </p>

      <h4 className="mt-4 text-sm font-semibold text-foreground">1. Por que logica difusa y no clasica?</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        La logica bivalente obliga a definir umbrales rigidos (p.ej. &quot;reprobado si promedio &lt; 70&quot;). Un
        estudiante con 69.9 se clasifica igual que uno con 30, lo cual es academicamente injusto. Zadeh demostro que
        usando funciones de pertenencia <InlineMath math="\mu_A:X\to[0,1]" /> los conjuntos pueden tener fronteras graduales,
        reflejando mejor la <strong className="text-foreground">imprecision linguistica</strong> con la que los docentes
        razonan (&quot;tiene promedio bajito&quot;, &quot;asiste casi siempre&quot;).
      </p>
      <FormulaCard
        math={String.raw`A=\{(x,\mu_A(x))\mid x\in X\},\quad \mu_A:X\to[0,1]`}
        caption="Definicion de conjunto difuso (Zadeh, 1965)."
      />

      <h4 className="mt-4 text-sm font-semibold text-foreground">2. Por que Mamdani y no Sugeno o Tsukamoto?</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        El controlador de Mamdani es el <strong className="text-foreground">unico de los tres</strong> cuyas reglas
        producen conjuntos difusos como consecuente, manteniendo la trazabilidad linguistica de extremo a extremo. Es la
        eleccion estandar cuando el objetivo es <em>explicable a humanos</em> (sistemas de apoyo a decisiones, control
        de procesos, evaluacion academica). Sugeno produce salidas crisp directas, mas comun en control automatico; Tsukamoto
        requiere consecuentes monotonos, lo cual restringe el modelado.
      </p>
      <ComparisonTable
        caption="Arquitecturas de inferencia difusa"
        headers={["Modelo", "Consecuente", "Defuzzificacion", "Uso tipico"]}
        rows={[
          ["Mamdani (1975)", "Conjunto difuso", "Centroide / MoM", "Sistemas explicables a humanos"],
          ["Sugeno (1985)", "Funcion crisp f(x)", "Promedio ponderado", "Control y prediccion numerica"],
          ["Tsukamoto", "Conjunto monotono", "Promedio ponderado", "Casos especiales"],
        ]}
      />

      <h4 className="mt-4 text-sm font-semibold text-foreground">3. Por que funciones triangular y trapezoidal?</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Existen muchas familias (gaussiana, sigmoidal, generalizada de Bell, etc.) pero las funciones piecewise-lineales
        son las preferidas por tres razones:
      </p>
      <ul className="space-y-1">
        <Bullet>
          <strong className="text-foreground">Interpretabilidad parametrica:</strong> cada esquina (a, b, c, d)
          corresponde a un umbral linguistico verbal (&quot;empieza a ser regular en 50&quot;).
        </Bullet>
        <Bullet>
          <strong className="text-foreground">Costo computacional O(1):</strong> evaluar mu(x) son 2 restas y 1 division,
          permitiendo re-inferir todo el sistema con cada movimiento de slider sin lag.
        </Bullet>
        <Bullet>
          <strong className="text-foreground">Convencion academica:</strong> el 90% de los textos introductorios
          (<Citation>Ross, 2010</Citation>; <Citation>Jang, Sun &amp; Mizutani, 1997</Citation>) las usan como caso base.
          Las gaussianas son preferibles cuando se requiere derivabilidad C^infinito (ANFIS), no aplica aqui.
        </Bullet>
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">
        En este sistema usamos <strong className="text-foreground">trapezoidal en los extremos</strong>
        (&quot;bajo&quot;, &quot;alto&quot;, &quot;critico&quot;) porque codifican saturacion: cualquier valor mas alla
        del umbral es totalmente alto. Usamos <strong className="text-foreground">triangular en el centro</strong>
        (&quot;regular&quot;, &quot;medio&quot;) porque modelan un pico ideal de la categoria.
      </p>
      <FormulaCard
        math={String.raw`\mu_{tri}(x;a,b,c)=\max\!\left(0,\;\min\!\left(\tfrac{x-a}{b-a},\;\tfrac{c-x}{c-b}\right)\right)`}
      />
      <FormulaCard
        math={String.raw`\mu_{trap}(x;a,b,c,d)=\max\!\left(0,\;\min\!\left(\tfrac{x-a}{b-a},\;1,\;\tfrac{d-x}{d-c}\right)\right)`}
      />

      <h4 className="mt-4 text-sm font-semibold text-foreground">4. Por que AND = min (t-norma de Zadeh)?</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Toda t-norma <InlineMath math="T:[0,1]^2\to[0,1]" /> es candidata valida para implementar AND difuso. Las tres
        clasicas son:
      </p>
      <ComparisonTable
        caption="t-normas (operador AND)"
        headers={["Familia", "Definicion", "Caracteristica"]}
        rows={[
          [<Citation key="z">Zadeh / Godel</Citation>, <InlineMath key="m" math={String.raw`T(a,b)=\min(a,b)`} />, "Conservadora, idempotente, sensible solo al minimo."],
          [<Citation key="p">Producto algebraico</Citation>, <InlineMath key="p2" math={String.raw`T(a,b)=a\cdot b`} />, "Penaliza ambos; usado en Sugeno y redes probabilisticas."],
          [<Citation key="l">Lukasiewicz</Citation>, <InlineMath key="l2" math={String.raw`T(a,b)=\max(0,a+b-1)`} />, "Estricta; produce ceros con facilidad."],
        ]}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Se elige <strong className="text-foreground">min</strong> por tres razones concretas al problema academico:
        (1) <em>conservadurismo deseado</em> - si un solo factor del estudiante esta bien (alpha alta en un antecedente)
        pero otro esta muy mal (alpha baja en otro), debemos reportar el factor critico, no su promedio; (2) es la
        formulacion original de Mamdani; (3) genera salidas robustas ante pequenas variaciones en los datos de entrada,
        propiedad estudiada en <Citation>Klir &amp; Yuan (1995)</Citation>.
      </p>

      <h4 className="mt-4 text-sm font-semibold text-foreground">5. Por que implicacion Mamdani (recorte)?</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Hay dos esquemas dominantes para la implicacion difusa <InlineMath math="\alpha \Rightarrow B" />:
      </p>
      <ComparisonTable
        caption="Operadores de implicacion"
        headers={["Operador", "Formula", "Geometria"]}
        rows={[
          [<Citation key="m">Mamdani (min)</Citation>, <InlineMath key="m" math={String.raw`\mu'_B(y)=\min(\alpha,\mu_B(y))`} />, "Recorte vertical - conserva la forma del conjunto base."],
          [<Citation key="la">Larsen (producto)</Citation>, <InlineMath key="l" math={String.raw`\mu'_B(y)=\alpha\cdot\mu_B(y)`} />, "Escalado - reduce la altura proporcionalmente."],
        ]}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Se elige <strong className="text-foreground">Mamdani-min</strong> porque (a) preserva la silueta linguistica
        original de la salida y por tanto es mas facil interpretar visualmente en la grafica de defuzzificacion, (b) es
        el estandar didactico, y (c) computacionalmente cuesta una sola comparacion. Larsen es preferible cuando las
        salidas tienen sentido probabilistico, lo que NO aplica al riesgo academico.
      </p>

      <h4 className="mt-4 text-sm font-semibold text-foreground">6. Por que agregacion = max (t-conorma)?</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Las reglas son <strong className="text-foreground">disyuntivas</strong>: si la regla R1 dice &quot;riesgo
        critico&quot; con alpha = 0.6 Y la R2 dice tambien &quot;riesgo critico&quot; con alpha = 0.3, ambas apuntan al
        mismo conjunto y debemos quedarnos con la evidencia mas fuerte. El operador max (t-conorma de Zadeh) es el dual
        natural de min, mantiene la idempotencia, y produce la envolvente superior:
      </p>
      <FormulaCard
        math={String.raw`\mu_B(y)=\bigvee_{r=1}^{m}\mu'_{B_r}(y)=\max_{r=1}^{m}\min(\alpha_r,\mu_{B_r}(y))`}
        caption="Agregacion Mamdani estandar: max sobre todas las salidas recortadas."
      />
      <p className="text-sm text-muted-foreground">
        Alternativas como suma acotada o producto probabilistico se usan en aplicaciones donde se necesita acumular
        evidencia (ej. fusion de sensores), pero introducen dependencia del orden de reglas y rompen la cota mu &lt;= 1.
      </p>

      <h4 className="mt-4 text-sm font-semibold text-foreground">7. Por que defuzzificacion por centroide (CoG)?</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">
        La literatura reconoce al menos cinco metodos de defuzzificacion. Sus propiedades comparadas:
      </p>
      <ComparisonTable
        caption="Metodos de defuzzificacion"
        headers={["Metodo", "Idea", "Comportamiento"]}
        rows={[
          ["CoG / Centroide", "Centro de masa del area", "Continuo, suave, sensible a toda la curva."],
          ["Bisector", "Divide el area en dos mitades iguales", "Estable, ignora forma fina."],
          ["MoM (mean of max)", "Promedio de y donde mu es maxima", "Discontinuo, util en control on/off."],
          ["SoM / LoM", "Menor / mayor y donde mu es maxima", "Decisiones extremas, no recomendado para evaluacion."],
        ]}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Se elige el <strong className="text-foreground">centroide</strong> porque: (1) produce una salida
        <strong className="text-foreground"> continua y diferenciable</strong> respecto a las entradas (clave para que
        mover los sliders provoque desplazamientos suaves del numero); (2) integra <em>toda</em> la informacion de las
        reglas activas (no descarta partes del area); (3) es el metodo mas citado en evaluaciones difusas pedagogicas
        (<Citation>Mendel, 2017</Citation>).
      </p>
      <FormulaCard
        math={String.raw`y^*=\frac{\int_{Y} y\,\mu_B(y)\,dy}{\int_{Y}\mu_B(y)\,dy}\;\approx\;\frac{\sum_{i=0}^{N} y_i\,\mu_B(y_i)\,\Delta y}{\sum_{i=0}^{N}\mu_B(y_i)\,\Delta y}`}
        caption="Forma continua y su aproximacion discreta por rectangulos (N = 100, Delta y = 1)."
      />
      <p className="text-sm text-muted-foreground">
        Implementacion: se discretiza el dominio <InlineMath math="[0,100]" /> con paso 1, garantizando error de
        cuadratura O(Delta y^2). Al ser todos los <InlineMath math="\mu_{B_r}" /> piecewise-lineales, el integrando es
        polinomico por trozos y la regla del rectangulo es suficiente; usar Simpson no aporta precision adicional.
      </p>

      <h4 className="mt-4 text-sm font-semibold text-foreground">8. Garantias matematicas del sistema</h4>
      <ul className="space-y-1">
        <Bullet>
          <strong className="text-foreground">Determinismo:</strong> dadas las mismas entradas, la salida es identica
          siempre. No hay estocasticidad ni dependencia de inicializaciones.
        </Bullet>
        <Bullet>
          <strong className="text-foreground">Cota acotada:</strong> <InlineMath math="y^*\in[0,100]" /> por
          construccion, porque mu_B esta soportado en [0,100].
        </Bullet>
        <Bullet>
          <strong className="text-foreground">Continuidad:</strong> y* es continuo en las entradas, ya que tanto las
          funciones de pertenencia como min/max y la integral son continuas.
        </Bullet>
        <Bullet>
          <strong className="text-foreground">Cobertura completa:</strong> las funciones de pertenencia se solapan; para
          todo x in [0,100] existe al menos un termino con mu(x) &gt; 0 (epsilon-completeness, <Citation>Lee, 1990</Citation>).
        </Bullet>
      </ul>

      <h4 className="mt-4 text-sm font-semibold text-foreground">Referencias clave</h4>
      <RefList
        items={[
          <span key="zadeh">
            <Citation>Zadeh, L. A. (1965).</Citation> Fuzzy sets. <em>Information and Control</em>, 8(3), 338-353.
          </span>,
          <span key="mam">
            <Citation>Mamdani, E. H., &amp; Assilian, S. (1975).</Citation> An experiment in linguistic synthesis with a
            fuzzy logic controller. <em>International Journal of Man-Machine Studies</em>, 7(1), 1-13.
          </span>,
          <span key="klir">
            <Citation>Klir, G. J., &amp; Yuan, B. (1995).</Citation> Fuzzy Sets and Fuzzy Logic: Theory and Applications.
            Prentice Hall.
          </span>,
          <span key="ross">
            <Citation>Ross, T. J. (2010).</Citation> Fuzzy Logic with Engineering Applications (3rd ed.). Wiley.
          </span>,
          <span key="jang">
            <Citation>Jang, J.-S. R., Sun, C.-T., &amp; Mizutani, E. (1997).</Citation> Neuro-Fuzzy and Soft Computing.
            Prentice Hall.
          </span>,
          <span key="lee">
            <Citation>Lee, C. C. (1990).</Citation> Fuzzy logic in control systems: Fuzzy logic controller. <em>IEEE
              Transactions on Systems, Man, and Cybernetics</em>, 20(2), 404-435.
          </span>,
          <span key="mendel">
            <Citation>Mendel, J. M. (2017).</Citation> Uncertain Rule-Based Fuzzy Systems (2nd ed.). Springer.
          </span>,
        ]}
      />
    </>
  );
}

type StackItem = {
  name: string;
  role: string;
  why: React.ReactNode;
  alternatives?: string;
};

const stackItems: { group: string; items: StackItem[] }[] = [
  {
    group: "Nucleo de inferencia (logica difusa)",
    items: [
      {
        name: "@academic-risk/fuzzy-core (workspace)",
        role: "Implementacion propia del motor Mamdani.",
        why: (
          <>
            Se escribio desde cero en TypeScript puro (sin dependencias) para tener control total del trazado
            matematico y poder exportar cada paso intermedio (fuzzificacion, alphas, area, centroide) hacia la UI y los
            reportes. Librerias como <code>fuzzylite</code> o <code>fuzzyjs</code> son cajas negras que no exponen los
            estados intermedios necesarios para la evidencia academica.
          </>
        ),
        alternatives: "fuzzylite, jfuzzylite, scikit-fuzzy",
      },
    ],
  },
  {
    group: "Framework y UI",
    items: [
      {
        name: "Next.js 16",
        role: "Framework React con SSR/SSG y rendimiento de produccion.",
        why: (
          <>
            Permite servir el tablero como sitio estatico (idoneo para entregas academicas y demos sin servidor),
            ofrece routing por archivos y bundling optimizado (Turbopack). Frente a Vite puro, anade convenciones de
            estructura y deploy en un solo click.
          </>
        ),
        alternatives: "Vite + React, Remix, Astro",
      },
      {
        name: "React 19",
        role: "Biblioteca declarativa para construir la UI reactiva.",
        why: (
          <>
            Los 5 sliders disparan re-renders del calculo difuso y de cada panel; el modelo declarativo de React encaja
            naturalmente con esta reactividad. <em>useMemo</em> ya evita recomputos innecesarios.
          </>
        ),
      },
      {
        name: "Tailwind CSS",
        role: "Sistema de utilidades CSS con tokens de diseno.",
        why: (
          <>
            Permite construir un sistema visual normalizado (colores, espaciado, sombras) con consistencia automatica;
            las variables CSS de los tokens (<code>--primary</code>, <code>--ring</code>) garantizan que cada panel
            comparta la misma paleta sin duplicar estilos.
          </>
        ),
      },
      {
        name: "Radix UI (Dialog, Slider, Tabs, Slot)",
        role: "Primitivas accesibles sin estilo.",
        why: (
          <>
            Implementan WAI-ARIA correctamente (focus trap en dialogos, navegacion por teclado en tabs, soporte de
            screen readers) - critico en una herramienta educativa. Construirlo a mano duplicaria codigo y romperia
            accesibilidad.
          </>
        ),
      },
      {
        name: "lucide-react",
        role: "Iconografia consistente.",
        why: (
          <>
            Set abierto (ISC), trazos uniformes a 24px, tree-shakeable: solo entran al bundle los iconos importados.
            Refuerza la jerarquia visual y la identidad academica del tablero.
          </>
        ),
      },
      {
        name: "class-variance-authority + clsx + tailwind-merge",
        role: "Composicion type-safe de variantes Tailwind.",
        why: (
          <>
            <code>cva</code> declara variantes (variant, size, tone) con tipos TS; <code>tailwind-merge</code> resuelve
            conflictos de utilidades duplicadas. Patron estandar en el ecosistema shadcn/Radix.
          </>
        ),
      },
    ],
  },
  {
    group: "Estado y datos",
    items: [
      {
        name: "Zustand",
        role: "Store reactivo minimo para los valores de los sliders.",
        why: (
          <>
            La logica de estado es trivial (5 numeros + reset). Zustand pesa ~1KB, no requiere Provider y se integra
            con Server Components sin friccion. Redux/Recoil serian sobre-ingenieria.
          </>
        ),
        alternatives: "Redux Toolkit, Jotai, Context API",
      },
    ],
  },
  {
    group: "Visualizacion matematica",
    items: [
      {
        name: "react-katex + katex",
        role: "Renderizado de formulas LaTeX en HTML.",
        why: (
          <>
            KaTeX es <strong className="text-foreground">~10x mas rapido que MathJax</strong> y renderiza
            sincronicamente (sin saltos de layout). Esencial para mostrar las formulas del trazado matematico sin
            penalizar el TTI del tablero. Usado por Khan Academy, StackExchange y Notion.
          </>
        ),
        alternatives: "MathJax, mathlive",
      },
      {
        name: "recharts",
        role: "Graficos declarativos para las funciones de pertenencia y defuzzificacion.",
        why: (
          <>
            Construido sobre D3 con API React-friendly. Permite componer ejes, lineas, areas y tooltips como
            componentes JSX, evitando manipular el DOM directamente.
          </>
        ),
        alternatives: "Plotly.js, Chart.js, visx",
      },
      {
        name: "@xyflow/react (React Flow)",
        role: "Grafo del flujo Mamdani como DAG visual.",
        why: (
          <>
            El pipeline Mamdani es por naturaleza un grafo dirigido aciclico. React Flow es el estandar de facto en el
            ecosistema React para diagramas de nodos con aristas animadas, minimap y zoom.
          </>
        ),
      },
      {
        name: "motion (Framer Motion)",
        role: "Animaciones declarativas en la linea de tiempo de inferencia.",
        why: (
          <>
            Las transiciones basadas en spring/physics dan una sensacion premium con un API muy simple (
            <code>animate</code> prop). Las pulsaciones en los pasos del pipeline mejoran la lectura del flujo en vivo.
          </>
        ),
      },
    ],
  },
  {
    group: "Exportacion academica",
    items: [
      {
        name: "jspdf + jspdf-autotable",
        role: "Generacion de PDF en el cliente para el resumen ejecutivo.",
        why: (
          <>
            Permite descargar evidencia <strong className="text-foreground">sin necesidad de backend</strong>: el caso
            actual se imprime junto con los charts capturados a PNG. Ideal para entregas en aula y anexos al expediente
            del estudiante.
          </>
        ),
      },
      {
        name: "@academic-risk/presentation (workspace)",
        role: "Generador de PowerPoint editable con el caso vivo.",
        why: (
          <>
            Aprovecha pptxgenjs internamente; cada chart se renderiza a PNG via <code>html-to-image</code> /
            <code> svg-to-png</code> y se incrusta en slides plantilla. La presentacion sirve como material de clase
            instantaneo.
          </>
        ),
      },
      {
        name: "@academic-risk/report (workspace, LaTeX)",
        role: "Reporte academico oficial precompilado.",
        why: (
          <>
            Documento formal en LaTeX con todas las definiciones formales, tablas de reglas y referencias. Compilado
            con <code>pnpm report:publish</code> y servido como PDF estatico.
          </>
        ),
      },
    ],
  },
  {
    group: "Calidad y monorepo",
    items: [
      {
        name: "TypeScript",
        role: "Tipado estatico end-to-end.",
        why: (
          <>
            Los tipos del nucleo difuso (<code>VariableDefinition</code>, <code>MamdaniResult</code>) viajan sin
            cambios desde el motor hasta la UI, garantizando que cualquier renombrado de termino o regla rompa el build
            antes de producir un reporte erroneo.
          </>
        ),
      },
      {
        name: "pnpm + Turborepo",
        role: "Workspace y orquestador de tareas.",
        why: (
          <>
            <code>pnpm</code> instala dependencias en un store compartido (ahorro disco), y <code>turbo</code> cachea
            resultados de build por hash, ejecutando solo los paquetes afectados.
          </>
        ),
      },
      {
        name: "ESLint 9 + Next ESLint config",
        role: "Reglas modernas de React y hooks.",
        why: (
          <>
            La regla <code>react-hooks/set-state-in-effect</code> evita patrones que provocan re-renders en cascada
            (relevante en un dashboard con re-inferencia en cada slider).
          </>
        ),
      },
    ],
  },
];

function StackSection() {
  return (
    <>
      <Heading icon={Package} kicker="Stack tecnologico">
        Por que cada libreria y como contribuye al problema
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Toda dependencia introduce superficie de mantenimiento; por eso se eligieron las minimas necesarias y se
        prefirieron primitivas compositorias sobre frameworks &quot;todo-en-uno&quot;. Cada paquete responde a una
        necesidad concreta del problema: <em>inferir, visualizar, explicar y exportar</em>.
      </p>
      <div className="space-y-4">
        {stackItems.map((group) => (
          <div key={group.group}>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-primary">{group.group}</h4>
            <div className="mt-1 grid gap-2">
              {group.items.map((item) => (
                <div key={item.name} className="rounded-lg border bg-background p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-[13px] font-semibold text-foreground">{item.name}</span>
                    <span className="text-[11.5px] italic text-muted-foreground">{item.role}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{item.why}</p>
                  {item.alternatives ? (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                      <span className="font-semibold uppercase tracking-wider text-foreground/70">Alternativas:</span>
                      <span>{item.alternatives}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
        <strong className="text-primary">Sintesis:</strong>{" "}
        <span className="text-muted-foreground">
          el stack esta deliberadamente <em>orientado a explicabilidad</em>: el motor es propio para exponer la
          trazabilidad, las primitivas Radix garantizan accesibilidad, KaTeX permite mostrar la matematica formal en
          vivo y los workspaces de reporte/presentacion convierten el dashboard en una herramienta entregable.
        </span>
      </div>
    </>
  );
}
