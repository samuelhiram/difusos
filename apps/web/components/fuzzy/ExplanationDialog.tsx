"use client";

import * as React from "react";
import {
  AlertTriangle,
  BookOpen,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Crosshair,
  FileText,
  GraduationCap,
  Lightbulb,
  ListChecks,
  SlidersHorizontal,
  Workflow,
} from "lucide-react";
import { academicRiskInputs, academicRiskOutput, academicRiskRules } from "@academic-risk/fuzzy-core";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ExplanationKey =
  | "idea"
  | "context"
  | "problem"
  | "why-fuzzy"
  | "concepts"
  | "input-panel"
  | "math"
  | "variables"
  | "pipeline"
  | "rules"
  | "result"
  | "example"
  | "interpret"
  | "defense"
  | "limits";

type ExplanationSection = {
  key: ExplanationKey;
  label: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
};

const explanationSections: ExplanationSection[] = [
  { key: "idea", label: "Idea central", short: "Que es el sistema", icon: Lightbulb },
  { key: "context", label: "Contexto", short: "Por que importa", icon: FileText },
  { key: "problem", label: "Problema", short: "Que intenta resolver", icon: AlertTriangle },
  { key: "why-fuzzy", label: "Por que difusa", short: "Por que no si/no", icon: BrainCircuit },
  { key: "concepts", label: "Conceptos", short: "Crisp, mu, terminos", icon: BookOpen },
  { key: "input-panel", label: "Panel de entradas", short: "Slider, U, T(x_i), mu", icon: SlidersHorizontal },
  { key: "math", label: "Matematica simple", short: "Formulas sin miedo", icon: Calculator },
  { key: "variables", label: "Entradas", short: "Las 5 señales", icon: SlidersHorizontal },
  { key: "pipeline", label: "Funcionamiento", short: "Paso a paso Mamdani", icon: Workflow },
  { key: "rules", label: "Reglas", short: `Las ${academicRiskRules.length} decisiones`, icon: ListChecks },
  { key: "result", label: "Resultado", short: "Centroide y etiqueta", icon: Crosshair },
  { key: "example", label: "Caso ejemplo", short: "Lectura completa", icon: ClipboardList },
  { key: "interpret", label: "Interpretar", short: "Como leer un caso", icon: ClipboardList },
  { key: "defense", label: "Como explicarlo", short: "Guion para exponer", icon: GraduationCap },
  { key: "limits", label: "Limites", short: "Que no promete", icon: CircleHelp },
];

type ExplanationDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ExplanationDialog({ open, onOpenChange }: ExplanationDialogProps) {
  const [active, setActive] = React.useState<ExplanationKey>("idea");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 sm:rounded-2xl">
        <DialogTitle className="sr-only">Explicacion del sistema difuso</DialogTitle>
        <DialogDescription className="sr-only">
          Documentacion explicativa del sistema Mamdani de riesgo academico con analogias simples.
        </DialogDescription>

        <div className="flex h-[min(84vh,760px)] min-h-0 flex-col md:flex-row">
          <aside className="flex shrink-0 flex-col gap-2 border-b border-border/70 bg-muted/40 p-4 md:w-72 md:border-b-0 md:border-r">
            <div className="flex items-center gap-2 text-secondary-foreground">
              <Lightbulb className="h-4 w-4 text-secondary" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">Explicacion</span>
            </div>
            <h2 className="text-base font-semibold leading-tight">Entender el sistema completo</h2>
            <p className="text-[12px] leading-snug text-muted-foreground">
              Teoria, analogias y forma de defender cada seccion del tablero.
            </p>

            <nav data-snap="x" className="mt-3 flex max-h-[300px] flex-row gap-1 overflow-x-auto md:max-h-none md:flex-col md:overflow-x-visible md:overflow-y-auto">
              {explanationSections.map((section) => {
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
              {active === "idea" ? <IdeaSection /> : null}
              {active === "context" ? <ContextSection /> : null}
              {active === "problem" ? <ProblemSection /> : null}
              {active === "why-fuzzy" ? <WhyFuzzySection /> : null}
              {active === "concepts" ? <ConceptsSection /> : null}
              {active === "input-panel" ? <InputPanelExplanationSection /> : null}
              {active === "math" ? <MathSection /> : null}
              {active === "variables" ? <VariablesSection /> : null}
              {active === "pipeline" ? <PipelineSection /> : null}
              {active === "rules" ? <RulesExplanationSection /> : null}
              {active === "result" ? <ResultSection /> : null}
              {active === "example" ? <ExampleSection /> : null}
              {active === "interpret" ? <InterpretSection /> : null}
              {active === "defense" ? <DefenseSection /> : null}
              {active === "limits" ? <LimitsSection /> : null}
            </article>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Heading({
  icon: Icon,
  kicker,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <header className="flex items-start gap-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/20 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{kicker}</div>
        <h3 className="text-lg font-semibold leading-tight">{children}</h3>
      </div>
    </header>
  );
}

function SimpleCard({ title, children, tone = "default" }: { title: string; children: React.ReactNode; tone?: "default" | "good" | "warn" }) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 text-sm",
        tone === "good" ? "border-emerald-200 bg-emerald-50/60" : null,
        tone === "warn" ? "border-amber-300/70 bg-amber-50/60" : null,
        tone === "default" ? "bg-background" : null,
      )}
    >
      <div className="mb-1 font-semibold text-foreground">{title}</div>
      <div className="leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{children}</span>
    </li>
  );
}

function FormulaBox({ title, formula, children }: { title: string; formula: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3 text-sm">
      <div className="mb-1 font-semibold text-foreground">{title}</div>
      <div className="mb-2 overflow-x-auto rounded-md bg-background px-2 py-1.5 font-mono text-[12px] text-primary">
        {formula}
      </div>
      <p className="leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function AnalogyTable({
  rows,
}: {
  rows: Array<{
    technical: string;
    simple: string;
    analogy: string;
  }>;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="border-b bg-muted/60 text-[11px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-semibold">Tecnico</th>
            <th className="px-3 py-2 font-semibold">En palabras simples</th>
            <th className="px-3 py-2 font-semibold">Analogia</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.technical} className="border-b last:border-0">
              <td className="px-3 py-2 font-semibold text-foreground">{row.technical}</td>
              <td className="px-3 py-2 text-muted-foreground">{row.simple}</td>
              <td className="px-3 py-2 text-muted-foreground">{row.analogy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepList({ steps }: { steps: Array<[string, React.ReactNode]> }) {
  return (
    <ol className="space-y-2">
      {steps.map(([title, body], index) => (
        <li key={title} className="flex gap-3 rounded-lg border bg-background p-3 text-sm">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <span>
            <strong className="text-foreground">{title}.</strong> <span className="text-muted-foreground">{body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function IdeaSection() {
  return (
    <>
      <Heading icon={Lightbulb} kicker="Idea central">
        El sistema convierte datos academicos en una alerta entendible
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Este tablero estima el <strong className="text-foreground">riesgo academico</strong> de un estudiante en una
        escala de 0 a 100. No adivina el futuro. Ordena señales actuales: promedio, asistencia, entregas, participacion
        y examenes.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <SimpleCard title="Entrada">Numeros reales del estudiante. Ejemplo: promedio 62, asistencia 70.</SimpleCard>
        <SimpleCard title="Proceso">Reglas difusas tipo docente. Ejemplo: si promedio bajo y entregas pobres, riesgo sube.</SimpleCard>
        <SimpleCard title="Salida">Un numero de riesgo, una etiqueta y las reglas que lo explican.</SimpleCard>
      </div>
      <SimpleCard title="Explicacion para un niño" tone="good">
        Es como un semaforo escolar inteligente. No solo dice verde o rojo. Mira muchas pistas y decide si el estudiante
        esta tranquilo, necesita atencion o esta en peligro academico.
      </SimpleCard>
      <SimpleCard title="Mapa mental">
        El sistema no castiga ni premia. Solo traduce evidencia academica a una alerta. Primero mira datos, despues los
        vuelve grados, luego aplica reglas, junta conclusiones y al final entrega un numero defendible.
      </SimpleCard>
    </>
  );
}

function ContextSection() {
  return (
    <>
      <Heading icon={FileText} kicker="Contexto academico">
        Para que existe dentro de una escuela
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        En una clase real, el riesgo academico aparece antes de la calificacion final. Se nota en ausencias, tareas no
        entregadas, examenes bajos y poca participacion. El problema es que esas señales no pesan igual en todos los
        casos.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <SimpleCard title="Antes de este sistema">
          El docente mira muchos datos separados. Puede detectar patrones, pero cuesta justificar por que un estudiante
          esta peor que otro si ambos tienen valores mixtos.
        </SimpleCard>
        <SimpleCard title="Con este sistema">
          Los datos se convierten en una ruta visible: entrada, pertenencia, regla activada, salida agregada y resultado.
          Eso permite explicar la alerta paso a paso.
        </SimpleCard>
      </div>
      <StepList
        steps={[
          ["Detectar", "Encontrar estudiantes que necesitan seguimiento antes de que el problema sea irreversible."],
          ["Priorizar", "Distinguir riesgo bajo, medio, alto y critico para decidir a quien atender primero."],
          ["Explicar", "Mostrar que variables empujaron el resultado y que reglas fueron responsables."],
          ["Actuar", "Convertir el resultado en una recomendacion: asesorias, recuperacion de entregas o revision de examenes."],
        ]}
      />
      <SimpleCard title="Idea importante" tone="good">
        No se busca reemplazar la experiencia docente. Se busca ordenarla y hacerla explicable.
      </SimpleCard>
    </>
  );
}

function ProblemSection() {
  return (
    <>
      <Heading icon={AlertTriangle} kicker="Problema">
        La realidad academica no siempre cabe en aprobado o reprobado
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Un estudiante puede tener promedio regular, asistir poco, entregar tarde y aun asi mejorar en examenes. Otro
        puede tener buen promedio, pero abandonar clases. Esas mezclas no se leen bien con una regla dura.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <SimpleCard title="Regla dura" tone="warn">
          Si promedio &lt; 60, entonces riesgo alto. Problema: 59 y 60 quedan separados como mundos distintos.
        </SimpleCard>
        <SimpleCard title="Regla difusa" tone="good">
          Un 59 puede ser muy bajo y un 61 todavia puede ser algo bajo. El cambio es gradual, mas parecido a la vida real.
        </SimpleCard>
      </div>
      <AnalogyTable
        rows={[
          {
            technical: "Umbral rigido",
            simple: "Corta el mundo en dos",
            analogy: "Como decir que al segundo exacto de cumplir años ya eres otra persona",
          },
          {
            technical: "Riesgo gradual",
            simple: "Acepta zonas grises",
            analogy: "Como distinguir frio, tibio y caliente en una ducha",
          },
          {
            technical: "Sistema explicable",
            simple: "Muestra por que llego al resultado",
            analogy: "Como un maestro que enseña su procedimiento, no solo la respuesta",
          },
        ]}
      />
    </>
  );
}

function WhyFuzzySection() {
  return (
    <>
      <Heading icon={BrainCircuit} kicker="Justificacion">
        Por que usar logica difusa aqui
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        La logica difusa sirve cuando los conceptos son humanos y graduales: bajo, regular, alto, critico. En educacion,
        esos terminos importan mas que una frontera exacta.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <SimpleCard title="Contra promedio simple">
          Un promedio ponderado mezcla todo, pero no entiende combinaciones peligrosas. Ejemplo: muchos ceros en entregas
          y examenes malos no deben ocultarse detras de participacion alta.
        </SimpleCard>
        <SimpleCard title="Contra machine learning">
          ML necesita datos historicos y puede volverse caja negra. Aqui el objetivo es explicar cada decision, no solo
          acertar un numero.
        </SimpleCard>
      </div>
      <ul className="space-y-1.5">
        <Bullet>Permite terminos linguisticos que un docente entiende: bajo, medio, alto, critico.</Bullet>
        <Bullet>Maneja transiciones suaves: no castiga raro a quien queda cerca de un limite.</Bullet>
        <Bullet>Es auditable: puedes ver funciones, reglas, activaciones y centroide.</Bullet>
        <Bullet>Es deterministico: mismas entradas, mismo resultado.</Bullet>
      </ul>
    </>
  );
}

function ConceptsSection() {
  return (
    <>
      <Heading icon={BookOpen} kicker="Conceptos base">
        Diccionario minimo para entender todo
      </Heading>
      <AnalogyTable
        rows={[
          {
            technical: "Valor crisp",
            simple: "Numero exacto de entrada o salida",
            analogy: "La temperatura exacta: 27 grados",
          },
          {
            technical: "Termino linguistico",
            simple: "Etiqueta humana para un rango",
            analogy: "Frio, tibio, caliente",
          },
          {
            technical: "Pertenencia mu(x)",
            simple: "Que tanto un numero pertenece a una etiqueta, de 0 a 1",
            analogy: "Que tan caliente sientes el agua",
          },
          {
            technical: "Funcion de pertenencia",
            simple: "Curva que transforma numero en grado",
            analogy: "Una regla flexible que mide cercania",
          },
          {
            technical: "Regla IF-THEN",
            simple: "Frase de decision",
            analogy: "Si llueve y hay viento, llevo chamarra",
          },
          {
            technical: "Centroide",
            simple: "Punto de equilibrio de toda la salida",
            analogy: "Donde balanceas una figura de carton con el dedo",
          },
        ]}
      />
      <SimpleCard title="Clave mental" tone="good">
        La pregunta no es &quot;pertenece o no pertenece?&quot;. La pregunta es &quot;cuanto pertenece?&quot;.
      </SimpleCard>
    </>
  );
}

function InputPanelExplanationSection() {
  return (
    <>
      <Heading icon={SlidersHorizontal} kicker="Panel de entradas">
        De donde salen los numeros del slider y de μ
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Cada barra representa una variable academica <strong className="text-foreground">x_i</strong>. El numero de la
        derecha es el valor real que captura el usuario. El sistema no inventa ese dato: lo tomas del caso del estudiante
        o lo ajustas manualmente para probar escenarios.
      </p>
      <AnalogyTable
        rows={[
          {
            technical: "x_i",
            simple: "El dato numerico de una variable",
            analogy: "x_1 = promedio, x_2 = asistencia, x_3 = entregas",
          },
          {
            technical: "U = [0,100]",
            simple: "Universo de valores permitidos",
            analogy: "La regla solo mide de 0 a 100, no menos ni mas",
          },
          {
            technical: "T(x_i)",
            simple: "La escala donde se evalua la variable x_i",
            analogy: "La carretera de 0 a 100 por donde se mueve el punto del slider",
          },
          {
            technical: "μ_bajo, μ_regular",
            simple: "Grados de pertenencia a cada etiqueta",
            analogy: "Que tan bajo o regular es ese valor",
          },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <SimpleCard title="Que regula la barra">
          La barra mueve el valor crisp. Si en promedio pones 58, entonces el sistema usa x_1 = 58. Luego calcula cuanto
          pertenece ese 58 a bajo, regular y alto.
        </SimpleCard>
        <SimpleCard title="Por que aparecen varios μ">
          Porque un valor puede estar entre etiquetas. Un promedio 58 todavia es algo bajo, pero ya entra bastante en
          regular. No hay corte brutal.
        </SimpleCard>
      </div>
      <FormulaBox title="Ejemplo real del screenshot: Promedio = 58" formula="bajo = trap(0,0,45,60), regular = tri(45,65,80)">
        Para bajo: como 58 esta entre 45 y 60, se calcula (60 - 58) / (60 - 45) = 0.13. Para regular: como 58 esta entre
        45 y 65, se calcula (58 - 45) / (65 - 45) = 0.65. Alto da 0 porque 58 queda fuera de la zona alta.
      </FormulaBox>
      <FormulaBox title="Lectura verbal" formula="x_1 = 58 -> μ_bajo = 0.13, μ_regular = 0.65, μ_alto = 0.00">
        Traduccion: este promedio no es completamente bajo ni completamente regular. Es poquito bajo y bastante regular.
        Esos grados despues alimentan las reglas IF-THEN.
      </FormulaBox>
      <SimpleCard title="De donde salen los parametros">
        Los puntos como 45, 60, 65 u 80 estan definidos en el motor del sistema. Son la calibracion experta de las curvas:
        donde empieza una etiqueta, donde llega a fuerza maxima y donde termina.
      </SimpleCard>
    </>
  );
}

function MathSection() {
  return (
    <>
      <Heading icon={Calculator} kicker="Matematica simple">
        Las formulas, traducidas a lenguaje normal
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        La matematica del sistema no es una caja negra. Son comparaciones, minimos, maximos y un promedio ponderado por
        el area final.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormulaBox title="Pertenencia" formula="mu_A(x) va de 0 a 1">
          Mide que tanto el valor x pertenece a una etiqueta A. Si mu = 0, no pertenece. Si mu = 1, pertenece totalmente.
          Si mu = 0.4, pertenece parcialmente.
        </FormulaBox>
        <FormulaBox title="AND difuso" formula="alpha = min(mu_1, mu_2, ..., mu_n)">
          Una regla con varias condiciones se activa segun su condicion mas debil. Si una parte falla mucho, la regla no
          puede sonar fuerte.
        </FormulaBox>
        <FormulaBox title="Recorte Mamdani" formula="mu'_B(y) = min(alpha, mu_B(y))">
          La regla propone una salida, pero su fuerza alpha limita la altura. Como una alarma que suena al volumen que
          permite la evidencia.
        </FormulaBox>
        <FormulaBox title="Agregacion" formula="mu_B(y) = max(salidas recortadas)">
          Todas las reglas activas se juntan. Para cada punto del riesgo se conserva la evidencia mas fuerte.
        </FormulaBox>
      </div>
      <FormulaBox title="Centroide" formula="y* = suma(y * mu_B(y)) / suma(mu_B(y))">
        Convierte toda el area difusa en un solo numero. Si la masa queda hacia la derecha, el riesgo sube. Si queda a la
        izquierda, baja. Por eso el resultado es suave y explicable.
      </FormulaBox>
      <SimpleCard title="Traduccion brutal" tone="good">
        mu mide cuanto. min decide la fuerza. max junta evidencias. centroide da el numero final.
      </SimpleCard>
    </>
  );
}

function VariablesSection() {
  const variableNotes: Record<string, string> = {
    average: "Resume rendimiento acumulado del periodo.",
    attendance: "Mide exposicion a clase y continuidad.",
    assignments: "Mide evidencia de trabajo y cumplimiento.",
    participation: "Mide involucramiento en aula o actividades.",
    exams: "Mide desempeño reciente en evaluaciones.",
  };

  return (
    <>
      <Heading icon={SlidersHorizontal} kicker="Entradas">
        Las cinco señales que alimentan el sistema
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Todas usan escala 0 a 100 para comparar sin mezclar unidades. Cada una tiene etiquetas propias y curvas de
        pertenencia.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {academicRiskInputs.map((variable) => (
          <SimpleCard key={variable.id} title={variable.label}>
            <p>{variableNotes[variable.id]}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {variable.terms.map((term) => (
                <span key={term.id} className="rounded-md border bg-muted/50 px-2 py-0.5 text-[11px] text-foreground">
                  {term.label}
                </span>
              ))}
            </div>
          </SimpleCard>
        ))}
      </div>
      <SimpleCard title="Analogias rapidas">
        Promedio es el marcador del partido. Asistencia es estar presente en el entrenamiento. Entregas son tareas hechas.
        Participacion es levantar la mano y colaborar. Examenes son pruebas recientes de que el tema se entendio.
      </SimpleCard>
    </>
  );
}

function PipelineSection() {
  return (
    <>
      <Heading icon={Workflow} kicker="Funcionamiento">
        Como trabaja Mamdani de inicio a fin
      </Heading>
      <StepList
        steps={[
          [
            "Recibe entradas crisp",
            "Toma los cinco numeros del estudiante en escala 0 a 100. Son datos exactos, no etiquetas.",
          ],
          [
            "Fuzzifica",
            "Convierte cada numero en grados de pertenencia. Un 70 puede ser algo regular y algo alto al mismo tiempo.",
          ],
          [
            "Activa reglas",
            "Cada regla mira sus condiciones. Si una condicion es debil, la regla completa queda debil.",
          ],
          [
            "Recorta salidas",
            "La fuerza de la regla limita la altura del conjunto de salida. Es como bajar el volumen de una alarma.",
          ],
          [
            "Agrega evidencia",
            "Une todas las reglas activas y conserva la evidencia mas fuerte para cada punto del riesgo.",
          ],
          [
            "Defuzzifica",
            "Transforma el area final en un solo numero usando el centroide.",
          ],
          [
            "Etiqueta",
            "Ubica ese numero en bajo, medio, alto o critico para que sea facil explicarlo.",
          ],
        ]}
      />
      <SimpleCard title="Resumen cavernicola" tone="good">
        Numeros entran. Se vuelven palabras con grados. Reglas pelean. Se juntan evidencias. Sale un riesgo explicable.
      </SimpleCard>
    </>
  );
}

function RulesExplanationSection() {
  return (
    <>
      <Heading icon={ListChecks} kicker="Reglas">
        La base de conocimiento del sistema
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        El sistema usa <strong className="text-foreground">{academicRiskRules.length} reglas</strong>. Cada una imita
        una frase razonable de un docente: si pasan ciertas condiciones, entonces el riesgo toma una etiqueta.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <SimpleCard title="Ejemplo de riesgo critico" tone="warn">
          IF promedio es bajo AND asistencia es baja THEN riesgo es critico. Traduccion: si el estudiante entiende poco
          y ademas casi no esta presente, la alerta debe subir mucho.
        </SimpleCard>
        <SimpleCard title="Ejemplo de riesgo bajo" tone="good">
          IF entregas son completas AND promedio es alto THEN riesgo es bajo. Traduccion: hay evidencia de trabajo y
          buen resultado, entonces el riesgo baja.
        </SimpleCard>
      </div>
      <AnalogyTable
        rows={[
          {
            technical: "AND = minimo",
            simple: "La regla vale lo que vale su condicion mas debil",
            analogy: "Una cadena aguanta lo que aguanta su eslabon mas flojo",
          },
          {
            technical: "Alpha",
            simple: "Fuerza con la que se prende una regla",
            analogy: "Perilla de volumen de una alarma",
          },
          {
            technical: "Consecuente",
            simple: "Etiqueta de riesgo que propone la regla",
            analogy: "El aviso que lanza el semaforo",
          },
        ]}
      />
      <SimpleCard title="Por que esto es defendible">
        Las reglas no son magia. Estan escritas. Se pueden leer, discutir, corregir y auditar. Esa es la gracia del
        sistema.
      </SimpleCard>
    </>
  );
}

function ResultSection() {
  return (
    <>
      <Heading icon={Crosshair} kicker="Salida">
        Que significa el numero final
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        La salida es <strong className="text-foreground">{academicRiskOutput.label}</strong>, tambien en escala 0 a 100.
        Sus etiquetas son:
      </p>
      <div className="grid gap-2 sm:grid-cols-4">
        {academicRiskOutput.terms.map((term) => (
          <div key={term.id} className="rounded-lg border bg-background p-3 text-center">
            <div className="text-sm font-semibold capitalize text-foreground">{term.label}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">conjunto difuso</div>
          </div>
        ))}
      </div>
      <AnalogyTable
        rows={[
          {
            technical: "Agregacion max",
            simple: "Junta las reglas y conserva la evidencia mas fuerte",
            analogy: "Si varias personas alertan, escuchas la alerta mas clara",
          },
          {
            technical: "Defuzzificacion centroide",
            simple: "Busca el punto de equilibrio del area final",
            analogy: "Balancear una figura de carton",
          },
          {
            technical: "Etiqueta final",
            simple: "Traduce el numero a lenguaje humano",
            analogy: "Convertir 82 en rojo/critico",
          },
        ]}
      />
      <SimpleCard title="No confundas esto">
        Riesgo 72 no significa necesariamente 72% de reprobar. Significa que, segun las reglas y curvas definidas, el
        caso cae cerca de la zona alta del mapa de riesgo.
      </SimpleCard>
    </>
  );
}

function ExampleSection() {
  return (
    <>
      <Heading icon={ClipboardList} kicker="Caso ejemplo">
        Como narrar un caso de inicio a fin
      </Heading>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Usa este ejemplo como plantilla oral. No necesitas memorizar numeros exactos; necesitas explicar la ruta logica.
      </p>
      <div className="grid gap-3 sm:grid-cols-5">
        {[
          ["Promedio", "58"],
          ["Asistencia", "68"],
          ["Entregas", "55"],
          ["Participacion", "45"],
          ["Examenes", "52"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border bg-background p-3 text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-1 text-xl font-semibold text-foreground">{value}</div>
          </div>
        ))}
      </div>
      <StepList
        steps={[
          [
            "Lectura humana",
            "El estudiante no esta en cero, pero tiene varias señales flojas al mismo tiempo: promedio bajo-regular, asistencia media-baja, entregas parciales y examenes deficientes.",
          ],
          [
            "Fuzzificacion",
            "Cada valor cae parcialmente en terminos como bajo, regular, parcial o deficiente. No se obliga a una sola etiqueta.",
          ],
          [
            "Reglas esperadas",
            "Se activan reglas de riesgo alto o critico relacionadas con promedio bajo, entregas insuficientes, examenes deficientes y asistencia baja/media.",
          ],
          [
            "Agregacion",
            "Las reglas de riesgo alto acumulan mas fuerza que las de riesgo bajo. La forma final se desplaza hacia la zona alta.",
          ],
          [
            "Interpretacion",
            "La conclusion no es 'ya reprobo'. La conclusion es: necesita intervencion porque varias evidencias apuntan al mismo problema.",
          ],
        ]}
      />
      <SimpleCard title="Como decirlo en clase" tone="good">
        Con estos valores, el sistema no decide por una sola variable. Detecta un patron: rendimiento bajo, cumplimiento
        incompleto y evaluaciones debiles. Por eso la alerta sube y la accion recomendada es revisar entregas y examenes
        primero.
      </SimpleCard>
    </>
  );
}

function InterpretSection() {
  return (
    <>
      <Heading icon={ClipboardList} kicker="Lectura de caso">
        Como interpretar un resultado sin perderse
      </Heading>
      <StepList
        steps={[
          [
            "Mira el valor final",
            "Ubica si cae bajo, medio, alto o critico. Eso da la alerta principal.",
          ],
          [
            "Lee la etiqueta",
            "La etiqueta resume la zona dominante del resultado. Es la frase que puedes comunicar rapido.",
          ],
          [
            "Revisa reglas activas",
            "Las reglas con alpha mayor a 0 explican que combinaciones empujaron el resultado.",
          ],
          [
            "Busca variables debiles",
            "Si promedio, entregas o examenes tienen pertenencia alta en bajo/deficiente, ahi esta la causa fuerte.",
          ],
          [
            "Propone accion",
            "No digas solo riesgo alto. Di por que y que conviene atender primero.",
          ],
        ]}
      />
      <SimpleCard title="Frase modelo" tone="good">
        El estudiante presenta riesgo alto porque las reglas activas muestran bajo desempeño en examenes y cumplimiento
        parcial de entregas. La recomendacion es intervenir primero en evaluaciones y tareas pendientes.
      </SimpleCard>
    </>
  );
}

function DefenseSection() {
  return (
    <>
      <Heading icon={GraduationCap} kicker="Guion">
        Como explicarlo en una exposicion
      </Heading>
      <StepList
        steps={[
          [
            "Problema",
            "Evaluar riesgo academico no es blanco o negro. Hay estudiantes en zonas intermedias.",
          ],
          [
            "Solucion",
            "Uso logica difusa Mamdani porque permite trabajar con conceptos humanos y reglas transparentes.",
          ],
          [
            "Entradas",
            "El sistema mide promedio, asistencia, entregas, participacion y examenes en escala 0 a 100.",
          ],
          [
            "Fuzzificacion",
            "Cada numero se convierte en grados de pertenencia. No dice solo bajo o alto, dice que tanto.",
          ],
          [
            "Inferencia",
            "Las reglas IF-THEN se activan con AND minimo. La condicion mas debil limita la fuerza de la regla.",
          ],
          [
            "Salida",
            "Las reglas se agregan con max y se obtiene un numero final por centroide.",
          ],
          [
            "Valor",
            "El resultado es interpretable, auditable y estable. No depende de entrenamiento ni datos ocultos.",
          ],
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <SimpleCard title="Respuesta a: por que no un promedio?">
          Porque un promedio puede esconder combinaciones peligrosas. La logica difusa permite decir que ciertos patrones
          importan mas que una suma plana.
        </SimpleCard>
        <SimpleCard title="Respuesta a: por que no IA?">
          Porque aqui se necesita trazabilidad. El sistema debe mostrar que regla se activo y por que.
        </SimpleCard>
      </div>
    </>
  );
}

function LimitsSection() {
  return (
    <>
      <Heading icon={CircleHelp} kicker="Limites">
        Que no debes prometer
      </Heading>
      <div className="grid gap-3 sm:grid-cols-2">
        <SimpleCard title="No predice el futuro" tone="warn">
          Evalua el estado actual con reglas definidas. No garantiza que alguien apruebe o repruebe.
        </SimpleCard>
        <SimpleCard title="No es probabilidad" tone="warn">
          El numero final es una escala de riesgo, no una probabilidad estadistica.
        </SimpleCard>
        <SimpleCard title="No reemplaza al docente">
          Ayuda a ordenar evidencia. La decision pedagogica sigue siendo humana.
        </SimpleCard>
        <SimpleCard title="Depende del diseño">
          Si cambian curvas o reglas, cambia el comportamiento. Eso es normal y debe documentarse.
        </SimpleCard>
      </div>
      <SimpleCard title="Conclusion honesta" tone="good">
        El sistema sirve para explicar y priorizar riesgo academico con reglas transparentes. Es util porque muestra el
        camino completo desde los datos hasta la alerta final.
      </SimpleCard>
    </>
  );
}
