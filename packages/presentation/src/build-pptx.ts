import pptxgenModule from "pptxgenjs";
import type PptxGenJSType from "pptxgenjs";
import {
  academicRiskInputs,
  academicRiskOutput,
  academicRiskRules,
  defaultCaseStudy,
  inferAcademicRisk,
  sensitivityCases,
  type AcademicRiskInputValues,
  type MamdaniResult,
  type VariableDefinition,
} from "@academic-risk/fuzzy-core";
import {
  presentationFonts,
  presentationPalette as C,
  riskColorById,
  termPaletteByIndex,
} from "./theme";

type TableRow = PptxGenJSType.TableRow;
type TableCell = PptxGenJSType.TableCell;
type SlideLike = PptxGenJSType.Slide;

function tc(text: string | number, options?: PptxGenJSType.TableCellProps): TableCell {
  return { text: String(text), options };
}

function tcHead(text: string, fillColor: string, textColor: string): TableCell {
  return { text, options: { bold: true, fill: { color: fillColor }, color: textColor } };
}

const PptxGenJS = ((pptxgenModule as unknown as { default?: typeof pptxgenModule }).default ?? pptxgenModule) as typeof pptxgenModule;

export type ChartImageId =
  | "membership-average"
  | "membership-attendance"
  | "membership-assignments"
  | "membership-participation"
  | "membership-exams"
  | "membership-risk"
  | "defuzzification"
  | "rule-graph";

export type ChartImage = {
  id: ChartImageId;
  dataUrl: string;
  widthPx: number;
  heightPx: number;
};

export type BuildPresentationOptions = {
  inputs?: AcademicRiskInputValues;
  result?: MamdaniResult;
  caseLabel?: string;
  caseDescription?: string;
  authorName?: string;
  reportDate?: string;
  chartImages?: ChartImage[];
};

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const PAGE_MARGIN_X = 0.55;
const CONTENT_W = SLIDE_W - PAGE_MARGIN_X * 2;

const DEFAULT_AUTHOR = "Samuel Hiram Castro Martinez";
const DEFAULT_DATE = "12 de Mayo del 2026";

function findChart(images: ChartImage[] | undefined, id: ChartImageId): ChartImage | undefined {
  if (!images) return undefined;
  return images.find((image) => image.id === id);
}

function shapeLabel(shape: VariableDefinition["terms"][number]["shape"]) {
  if (shape.type === "triangular") {
    return `T(${shape.a}, ${shape.b}, ${shape.c})`;
  }
  return `Z(${shape.a}, ${shape.b}, ${shape.c}, ${shape.d})`;
}

function describeInputs(inputs: AcademicRiskInputValues) {
  return [
    { label: "Promedio actual", value: inputs.average },
    { label: "Asistencia", value: inputs.attendance },
    { label: "Entregas realizadas", value: inputs.assignments },
    { label: "Participacion", value: inputs.participation },
    { label: "Examenes recientes", value: inputs.exams },
  ];
}

function termLabel(variableId: string, termId: string) {
  const variable =
    academicRiskInputs.find((item) => item.id === variableId) ??
    (academicRiskOutput.id === variableId ? academicRiskOutput : undefined);
  return variable?.terms.find((term) => term.id === termId)?.label ?? termId;
}

function degreeText(variableId: string, degrees: Record<string, number>) {
  return Object.entries(degrees)
    .filter(([, value]) => value > 0.001)
    .sort(([, a], [, b]) => b - a)
    .map(([term, value]) => `${termLabel(variableId, term)} ${value.toFixed(2)}`)
    .join(", ");
}

function riskAction(labelId: string) {
  if (labelId === "critical") return "Intervencion inmediata: revisar asistencia, entregas y examenes esta semana.";
  if (labelId === "high") return "Apoyo temprano: plan de entregas, asesorias y seguimiento semanal.";
  if (labelId === "medium") return "Monitoreo: revisar variables debiles antes del siguiente corte.";
  return "Seguimiento normal: mantener habitos y revisar al cierre del periodo.";
}

function riskSummary(labelId: string) {
  if (labelId === "critical") return "Alerta severa. Varias evidencias empujan al riesgo maximo.";
  if (labelId === "high") return "Alerta alta. El caso necesita atencion antes de empeorar.";
  if (labelId === "medium") return "Caso intermedio. Hay señales mixtas; conviene vigilar.";
  return "Caso estable. No hay alerta fuerte con las reglas actuales.";
}

export async function buildPresentation(options: BuildPresentationOptions = {}) {
  const inputs = options.inputs ?? defaultCaseStudy.inputs;
  const result = options.result ?? inferAcademicRisk(inputs, 1);
  const caseLabel = options.caseLabel ?? defaultCaseStudy.label;
  const caseDescription = options.caseDescription ?? defaultCaseStudy.description;
  const author = options.authorName ?? DEFAULT_AUTHOR;
  const date = options.reportDate ?? DEFAULT_DATE;

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.defineLayout({ name: "LAYOUT_WIDE", width: SLIDE_W, height: SLIDE_H });
  pptx.author = author;
  pptx.company = "Instituto Tecnologico de Tijuana";
  pptx.subject = "Sistema difuso Mamdani para riesgo academico";
  pptx.title = "Sistema Difuso Mamdani para la Evaluacion de Riesgo Academico en Estudiantes";
  pptx.theme = {
    headFontFace: presentationFonts.head,
    bodyFontFace: presentationFonts.body,
  };

  pptx.defineSlideMaster({
    title: "MASTER_CONTENT",
    background: { color: C.bg },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: SLIDE_W,
          h: 0.18,
          fill: { color: C.teal },
          line: { color: C.teal, width: 0 },
        },
      },
      {
        text: {
          text: "Sistema Difuso Mamdani | Riesgo Academico",
          options: {
            x: PAGE_MARGIN_X,
            y: 7.05,
            w: 6.6,
            h: 0.28,
            fontSize: 9,
            color: C.muted,
            margin: 0,
          },
        },
      },
      {
        text: {
          text: `${author} | Sistemas Difusos | ${date}`,
          options: {
            x: 6.8,
            y: 7.05,
            w: 6.0,
            h: 0.28,
            fontSize: 9,
            color: C.muted,
            align: "right",
            margin: 0,
          },
        },
      },
    ],
    slideNumber: {
      x: 12.85,
      y: 7.05,
      w: 0.3,
      h: 0.28,
      fontSize: 9,
      color: C.muted,
      align: "right",
    },
  });

  pptx.defineSlideMaster({
    title: "MASTER_COVER",
    background: { color: C.bg },
    objects: [
      {
        rect: {
          x: 0,
          y: 0,
          w: SLIDE_W,
          h: 0.32,
          fill: { color: C.teal },
          line: { color: C.teal, width: 0 },
        },
      },
      {
        rect: {
          x: 0,
          y: SLIDE_H - 0.32,
          w: SLIDE_W,
          h: 0.32,
          fill: { color: C.ink },
          line: { color: C.ink, width: 0 },
        },
      },
    ],
  });

  function addContentSlide() {
    return pptx.addSlide({ masterName: "MASTER_CONTENT" });
  }

  function addCoverSlide() {
    return pptx.addSlide({ masterName: "MASTER_COVER" });
  }

  function addHeader(slide: SlideLike, title: string, eyebrow: string) {
    slide.addText(eyebrow, {
      x: PAGE_MARGIN_X,
      y: 0.42,
      w: CONTENT_W,
      h: 0.28,
      fontSize: 9,
      bold: true,
      color: C.teal,
      margin: 0,
      breakLine: false,
      charSpacing: 3,
    });
    slide.addText(title, {
      x: PAGE_MARGIN_X,
      y: 0.7,
      w: CONTENT_W,
      h: 0.55,
      fontSize: 26,
      bold: true,
      color: C.ink,
      margin: 0,
      breakLine: false,
      fit: "shrink",
    });
    slide.addShape(pptx.ShapeType.line, {
      x: PAGE_MARGIN_X,
      y: 1.32,
      w: CONTENT_W,
      h: 0,
      line: { color: C.line, width: 1 },
    });
  }

  function addCard(
    slide: SlideLike,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    body: string,
    accent = C.teal,
  ) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w,
      h,
      rectRadius: 0.08,
      fill: { color: C.panel },
      line: { color: C.line, width: 1 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 0.1,
      h,
      fill: { color: accent },
      line: { color: accent, width: 0 },
    });
    slide.addText(title, {
      x: x + 0.28,
      y: y + 0.16,
      w: w - 0.42,
      h: 0.34,
      fontSize: 14,
      bold: true,
      color: C.ink,
      margin: 0,
      breakLine: false,
      fit: "shrink",
    });
    slide.addText(body, {
      x: x + 0.28,
      y: y + 0.54,
      w: w - 0.42,
      h: h - 0.7,
      fontSize: 12,
      color: C.inkSoft,
      margin: 0,
      breakLine: true,
      fit: "shrink",
      valign: "top",
    });
  }

  function addBullets(
    slide: SlideLike,
    lines: string[],
    x: number,
    y: number,
    w: number,
    h: number,
    fontSize = 15,
  ) {
    slide.addText(
      lines.map((text) => ({ text, options: { bullet: { indent: 14 }, paraSpaceAfter: 6 } })),
      {
        x,
        y,
        w,
        h,
        fontSize,
        color: C.ink,
        fit: "shrink",
        breakLine: false,
        valign: "top",
        margin: 0,
      },
    );
  }

  function addMembershipMiniChart(
    slide: SlideLike,
    variable: VariableDefinition,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    slide.addText(variable.label, {
      x,
      y,
      w,
      h: 0.26,
      fontSize: 11,
      bold: true,
      color: C.ink,
      margin: 0,
    });
    const baselineY = y + h;
    slide.addShape(pptx.ShapeType.line, {
      x,
      y: baselineY,
      w,
      h: 0,
      line: { color: C.line, width: 0.8 },
    });
    const plotHeight = h - 0.32;
    variable.terms.forEach((term, index) => {
      const color = termPaletteByIndex[index % termPaletteByIndex.length];
      const px = (value: number) => x + ((value - variable.min) / (variable.max - variable.min)) * w;
      const py = (mu: number) => baselineY - mu * plotHeight;
      const s = term.shape;
      const pts =
        s.type === "triangular"
          ? [
              [px(s.a), py(0)],
              [px(s.b), py(1)],
              [px(s.c), py(0)],
            ]
          : [
              [px(s.a), py(0)],
              [px(s.b), py(1)],
              [px(s.c), py(1)],
              [px(s.d), py(0)],
            ];
      for (let i = 0; i < pts.length - 1; i += 1) {
        slide.addShape(pptx.ShapeType.line, {
          x: pts[i][0],
          y: pts[i][1],
          w: pts[i + 1][0] - pts[i][0],
          h: pts[i + 1][1] - pts[i][1],
          line: { color, width: 1.6 },
        });
      }
      slide.addText(term.label, {
        x,
        y: baselineY + 0.04 + index * 0.18,
        w,
        h: 0.16,
        fontSize: 8,
        color,
        margin: 0,
      });
    });
  }

  function addVariableChart(
    slide: SlideLike,
    variable: VariableDefinition,
    chartId: ChartImageId,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    const image = findChart(options.chartImages, chartId);
    if (image) {
      slide.addImage({
        data: image.dataUrl,
        x,
        y,
        w,
        h,
        altText: `Funciones de pertenencia de ${variable.label}`,
      });
      return;
    }
    addMembershipMiniChart(slide, variable, x, y, w, h);
  }

  let pageNum = 0;
  pageNum += 1;
  {
    const slide = addCoverSlide();
    slide.addText("LOGICA DIFUSA EXPLICABLE", {
      x: 0.85,
      y: 1.4,
      w: 11.6,
      h: 0.7,
      fontSize: 18,
      bold: true,
      color: C.teal,
      charSpacing: 4,
    });
    slide.addText("Riesgo academico explicado paso a paso", {
      x: 0.85,
      y: 2.05,
      w: 11.6,
      h: 1.3,
      fontSize: 40,
      bold: true,
      color: C.ink,
      fit: "shrink",
    });
    slide.addText(
      "Sistema Mamdani para convertir señales academicas en una alerta entendible",
      {
        x: 0.85,
        y: 3.5,
        w: 11.6,
        h: 0.4,
        fontSize: 14,
        color: C.inkSoft,
      },
    );
    addCard(
      slide,
      0.85,
      4.25,
      5.65,
      1.85,
      "Que problema resuelve",
      "Un estudiante no es solo aprobado o reprobado. El sistema mira promedio, asistencia, entregas, participacion y examenes para estimar un nivel de alerta de 0 a 100.",
      C.teal,
    );
    addCard(
      slide,
      6.8,
      4.25,
      5.65,
      1.85,
      "Que lo hace claro",
      "No usa caja negra. Cada numero sale de curvas visibles, reglas IF-THEN y un centroide. Si alguien pregunta 'por que?', se puede seguir todo el camino.",
      C.red,
    );
    slide.addText(`${author}    -    Profesor: Prof. Oscar Castillo, Ph.D., D.Sc.    -    ${date}`, {
      x: 0.85,
      y: 6.4,
      w: 11.6,
      h: 0.35,
      fontSize: 12,
      color: C.muted,
    });
    slide.addNotes(
      "Abrir con la idea simple: no se predice magicamente; se ordenan evidencias academicas y se explica la alerta.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Ruta para entender el sistema", "GUIA SIMPLE");
    const agendaItems = [
      "1.  Que problema academico estamos resolviendo",
      "2.  Que significan las barras, x_i, T(x_i) y los valores mu",
      "3.  Como Mamdani transforma datos en reglas activadas",
      "4.  Como se obtiene el numero final y la etiqueta de riesgo",
      "5.  Como leer el caso de prueba sin perderse en formulas",
      "6.  Que ventajas, limites y evidencia quedan para defenderlo",
    ];
    addBullets(slide, agendaItems, 0.95, 1.7, 11.5, 4.7, 17);
    addCard(
      slide,
      0.95,
      6.05,
      11.5,
      0.75,
      "Idea central",
      "Numeros entran. Se vuelven grados como 'bajo 0.65'. Las reglas se activan. El centroide entrega el riesgo final.",
      C.teal,
    );
    slide.addNotes(
      "Presentar como historia. Primero el problema, luego la lectura de barras, despues el motor y finalmente el resultado.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "El problema real", "POR QUE NO BASTA UN IF");
    addBullets(
      slide,
      [
        "El riesgo academico aparece por mezcla de señales: promedio bajo, ausencias, tareas incompletas, poca participacion y examenes flojos.",
        "Un corte rigido crea decisiones raras: 59 y 60 pueden estar casi igual, pero un if los separa como mundos distintos.",
        "La logica difusa permite zonas grises: un valor puede ser 'algo bajo' y 'bastante regular' al mismo tiempo.",
        "El resultado no es una sentencia. Es una alerta explicable para decidir seguimiento.",
      ],
      0.95,
      1.65,
      11.5,
      3.0,
    );
    addCard(
      slide,
      0.95,
      4.85,
      5.55,
      1.7,
      "Pregunta guia",
      "Como convertir datos academicos mezclados en una alerta clara sin usar una caja negra?",
      C.gold,
    );
    addCard(
      slide,
      6.85,
      4.85,
      5.6,
      1.7,
      "Respuesta del sistema",
      "Usar etiquetas humanas, grados de pertenencia, reglas visibles y un numero final en escala 0-100.",
      C.teal,
    );
    slide.addNotes(
      "Contrastar if rigido contra lectura gradual. Un docente suele pensar en bajo, regular, alto; la logica difusa formaliza eso.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Piezas del sistema", "QUE HACE CADA PARTE");
    const rows: TableRow[] = [
      [
        tcHead("Pieza", C.teal, C.white),
        tcHead("Que hace", C.teal, C.white),
        tcHead("Por que ayuda a explicar", C.teal, C.white),
      ],
      [tc("Motor difuso"), tc("Calcula pertenencias, reglas, agregacion y centroide"), tc("Es la fuente de verdad: todo sale de las mismas reglas")],
      [tc("Interfaz web"), tc("Permite mover barras y ver el resultado en vivo"), tc("Muestra el camino completo, no solo el numero final")],
      [tc("Reporte PDF"), tc("Documenta teoria, parametros, tablas y resultados"), tc("Sirve como evidencia academica formal")],
      [tc("Presentacion PPTX"), tc("Resume el sistema en slides editables"), tc("Convierte la explicacion tecnica en historia visual")],
    ];
    slide.addTable(rows, {
      x: 0.95,
      y: 1.65,
      w: 11.45,
      h: 2.9,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.8 },
      margin: 0.1,
      valign: "middle",
      colW: [2.05, 4.6, 4.8],
    });
    addCard(
      slide,
      0.95,
      4.75,
      11.45,
      1.65,
      "Clave para defenderlo",
      "No hay tres versiones del sistema. Motor, web, reporte y PPT usan la misma definicion de variables, funciones y reglas. Eso evita contradicciones.",
      C.teal,
    );
    slide.addNotes(
      "Explicar que si cambia una regla en el motor, cambian los resultados que ve la web y la presentacion. Una sola fuente de verdad.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Mamdani en cinco pasos", "DEL DATO A LA ALERTA");
    const steps = [
      ["1. Datos", "Cada barra da un numero real: promedio, asistencia, entregas, participacion y examenes."],
      ["2. Grados", "Cada numero se traduce a etiquetas con fuerza: bajo 0.13, regular 0.65, alto 0.00."],
      ["3. Reglas", "Las reglas IF-THEN se prenden segun esos grados. La fuerza se llama alpha."],
      ["4. Union de evidencias", "Todas las reglas que apuntan al riesgo se juntan para formar una curva de salida."],
      ["5. Numero final", "El centroide busca el punto de equilibrio de esa curva y entrega el riesgo 0-100."],
    ];
    steps.forEach(([title, body], index) => {
      const accent = index % 2 === 0 ? C.teal : C.gold;
      addCard(slide, 0.95, 1.55 + index * 1.05, 11.45, 0.92, title, body, accent);
    });
    slide.addNotes(
      "Usar analogia: datos -> etiquetas con intensidad -> reglas -> area -> punto de equilibrio. Evitar arrancar con formulas.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Por que Mamdani", "ELECCION DEL MODELO");
    const rows: TableRow[] = [
      [
        tcHead("Modelo", C.teal, C.white),
        tcHead("Como entrega salida", C.teal, C.white),
        tcHead("Que tan facil se explica", C.teal, C.white),
        tcHead("Encaja aqui?", C.teal, C.white),
      ],
      [tc("Mamdani"), tc("Curva difusa de salida + centroide"), tc("Muy alta: se ve la curva y cada regla"), tc("Si")],
      [tc("Sugeno"), tc("Formula numerica por regla"), tc("Media: bueno para control, menos visual"), tc("No era el objetivo")],
      [tc("Tsukamoto"), tc("Valor crisp por regla monotona"), tc("Media: mas restrictivo"), tc("Menos intuitivo")],
    ];
    slide.addTable(rows, {
      x: 0.95,
      y: 1.6,
      w: 11.45,
      h: 2.6,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.8 },
      margin: 0.1,
      valign: "middle",
      colW: [1.95, 2.6, 2.9, 4.0],
    });
    addCard(
      slide,
      0.95,
      4.4,
      11.45,
      2.4,
      "Razon simple",
      "Mamdani mantiene palabras humanas hasta el final: riesgo bajo, medio, alto o critico. Despues convierte esa curva en numero. Por eso se puede enseñar, revisar y defender.",
      C.teal,
    );
    slide.addNotes(
      "Idea para exponer: usamos Mamdani porque el objetivo principal no es optimizar control numerico; es explicar una decision academica.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Como se combinan condiciones", "AND, OR Y FUERZA DE REGLA");
    const rows: TableRow[] = [
      [
        tcHead("Idea", C.teal, C.white),
        tcHead("Formula", C.teal, C.white),
        tcHead("Traduccion simple", C.teal, C.white),
        tcHead("Uso en el sistema", C.teal, C.white),
      ],
      [tc("AND difuso"), tc("min(a, b)"), tc("La regla pesa lo que pesa su condicion mas debil"), tc("Calcular alpha")],
      [tc("Union de reglas"), tc("max(a, b)"), tc("Si varias reglas alertan, se conserva la evidencia mas fuerte"), tc("Agregacion")],
      [tc("Alternativas"), tc("producto, Lukasiewicz"), tc("Validas, pero menos directas para explicar"), tc("No usadas")],
    ];
    slide.addTable(rows, {
      x: 0.95,
      y: 1.6,
      w: 11.45,
      h: 2.7,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.8 },
      margin: 0.1,
      valign: "middle",
      colW: [2.4, 3.3, 3.3, 2.45],
    });
    addCard(
      slide,
      0.95,
      4.5,
      5.55,
      2.25,
      "Analogía",
      "Una cadena aguanta lo que aguanta su eslabon mas debil. Por eso una regla con AND usa min: si una condicion esta floja, la regla completa no puede sonar fuerte.",
      C.teal,
    );
    addCard(
      slide,
      6.7,
      4.5,
      5.75,
      2.25,
      "Defensa tecnica",
      "Min y max son operadores clasicos de Zadeh. Son deterministas, faciles de auditar y mantienen los grados dentro de [0,1].",
      C.gold,
    );
    slide.addNotes(
      "Primero explicar con analogia. Luego mencionar que min/max son operadores formales, no una ocurrencia.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Como sale un solo numero", "CENTROIDE");
    const rows: TableRow[] = [
      [
        tcHead("Metodo", C.teal, C.white),
        tcHead("Idea simple", C.teal, C.white),
        tcHead("Por que importa", C.teal, C.white),
      ],
      [tc("Centroide"), tc("Punto de equilibrio del area"), tc("Usa toda la curva, no solo el pico")],
      [tc("Bisector"), tc("Corta el area en dos mitades"), tc("Estable, pero menos expresivo")],
      [tc("Mean of Maxima"), tc("Promedia los puntos mas altos"), tc("Puede saltar de golpe")],
      [tc("SoM / LoM"), tc("Toma extremo menor o mayor"), tc("Demasiado extremo para evaluacion")],
    ];
    slide.addTable(rows, {
      x: 0.95,
      y: 1.6,
      w: 11.45,
      h: 2.85,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.8 },
      margin: 0.1,
      valign: "middle",
      colW: [2.55, 4.0, 4.9],
    });
    addCard(
      slide,
      0.95,
      4.65,
      11.45,
      2.05,
      "Por que centroide",
      "Es como balancear una figura de carton con el dedo. Si el area se carga a la derecha, el riesgo sube. Si se carga a la izquierda, baja. Usa toda la evidencia acumulada por las reglas.",
      C.teal,
    );
    slide.addNotes(
      "No entrar pesado en integrales. La palabra clave es equilibrio: el centroide resume la forma completa de la salida.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Que significan las entradas", "LAS CINCO BARRAS");
    const rows: TableRow[] = [
      [
        tcHead("Barra", C.teal, C.white),
        tcHead("Rango", C.teal, C.white),
        tcHead("Lecturas posibles", C.teal, C.white),
      ],
      ...academicRiskInputs.map((variable): TableRow => [
        tc(variable.label),
        tc(`[${variable.min}, ${variable.max}]`),
        tc(variable.terms.map((term) => term.label).join(", ")),
      ]),
      [
        tc(academicRiskOutput.label),
        tc(`[${academicRiskOutput.min}, ${academicRiskOutput.max}]`),
        tc(academicRiskOutput.terms.map((term) => term.label).join(", ")),
      ],
    ];
    slide.addTable(rows, {
      x: 0.95,
      y: 1.6,
      w: 11.45,
      h: 4.6,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.8 },
      margin: 0.1,
      valign: "middle",
      colW: [3.2, 1.55, 6.7],
    });
    addCard(
      slide,
      0.95,
      6.3,
      11.45,
      0.55,
      "Lectura de la barra",
      "Cada barra vive en U=[0,100]. 0 significa peor señal, 100 mejor señal. T(x_i) es la escala donde se miden las etiquetas de esa variable.",
      C.gold,
    );
    slide.addNotes(
      "Explicar que x_i es el valor del slider. Las etiquetas bajo/regular/alto no reemplazan el numero: lo interpretan con grados mu.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Como leer una barra", "x_i, T(x_i) Y mu");
    const avg = inputs.average;
    const avgDegrees = result.fuzzification.average;
    const rows: TableRow[] = [
      [tcHead("Elemento en pantalla", C.teal, C.white), tcHead("Que significa", C.teal, C.white), tcHead("Ejemplo", C.teal, C.white)],
      [tc("x_1"), tc("Primer dato de entrada: promedio actual"), tc(`x_1 = ${avg}`)],
      [tc("U=[0,100]"), tc("Rango permitido de la barra"), tc("0 peor señal, 100 mejor señal")],
      [tc("T(x_1)"), tc("Escala donde se interpretan las etiquetas del promedio"), tc("bajo, regular, alto")],
      [tc("mu_bajo"), tc("Que tanto el promedio pertenece a 'bajo'"), tc((avgDegrees.low ?? 0).toFixed(2))],
      [tc("mu_regular"), tc("Que tanto pertenece a 'regular'"), tc((avgDegrees.regular ?? 0).toFixed(2))],
      [tc("mu_alto"), tc("Que tanto pertenece a 'alto'"), tc((avgDegrees.high ?? 0).toFixed(2))],
    ];
    slide.addTable(rows, {
      x: 0.75,
      y: 1.55,
      w: 11.85,
      h: 3.8,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.7 },
      margin: 0.08,
      valign: "middle",
      colW: [2.1, 6.2, 3.55],
    });
    addCard(
      slide,
      0.75,
      5.55,
      5.75,
      1.1,
      "Idea simple",
      "La barra no decide sola. La barra da el numero; las curvas dicen como leer ese numero.",
      C.teal,
    );
    addCard(
      slide,
      6.85,
      5.55,
      5.75,
      1.1,
      "Ejemplo verbal",
      `Promedio ${avg}: ${degreeText("average", avgDegrees)}. Puede ser mas de una cosa a la vez, con distinto grado.`,
      C.gold,
    );
    slide.addNotes(
      "Esta slide responde de donde salen los numeros del panel. La clave: x_i es el valor; mu es la lectura difusa del valor.",
    );
  }

  const allVariables: Array<{ variable: VariableDefinition; chartId: ChartImageId }> = [
    { variable: academicRiskInputs[0], chartId: "membership-average" },
    { variable: academicRiskInputs[1], chartId: "membership-attendance" },
    { variable: academicRiskInputs[2], chartId: "membership-assignments" },
    { variable: academicRiskInputs[3], chartId: "membership-participation" },
    { variable: academicRiskInputs[4], chartId: "membership-exams" },
    { variable: academicRiskOutput, chartId: "membership-risk" },
  ];

  for (const { variable, chartId } of allVariables) {
    pageNum += 1;
    const slide = addContentSlide();
    addHeader(slide, `Como se interpreta: ${variable.label}`, "CURVAS DE PERTENENCIA");
    addVariableChart(slide, variable, chartId, 0.95, 1.55, 7.7, 4.9);
    slide.addText("Etiquetas y puntos de corte", {
      x: 9.0,
      y: 1.55,
      w: 3.5,
      h: 0.3,
      fontSize: 13,
      bold: true,
      color: C.ink,
    });
    variable.terms.forEach((term, index) => {
      const color = termPaletteByIndex[index % termPaletteByIndex.length];
      slide.addShape(pptx.ShapeType.rect, {
        x: 9.0,
        y: 1.92 + index * 0.62,
        w: 0.18,
        h: 0.42,
        fill: { color },
        line: { color, width: 0 },
      });
      slide.addText(term.label, {
        x: 9.26,
        y: 1.92 + index * 0.62,
        w: 3.3,
        h: 0.22,
        fontSize: 12,
        bold: true,
        color: C.ink,
      });
      slide.addText(shapeLabel(term.shape), {
        x: 9.26,
        y: 2.14 + index * 0.62,
        w: 3.3,
        h: 0.22,
        fontSize: 10,
        color: C.muted,
        fontFace: presentationFonts.mono,
      });
    });
    addCard(
      slide,
      0.95,
      6.6,
      11.45,
      0.4,
      variable.id === academicRiskOutput.id ? "Espacio de salida" : "Lectura linguistica",
      variable.id === academicRiskOutput.id
        ? "Aqui caen las reglas: bajo, medio, alto o critico. El centroide resume esta salida en un numero."
        : `Si el valor cae entre dos curvas, activa ambas. Por eso el sistema acepta zonas grises en ${variable.label.toLowerCase()}.`,
      C.teal,
    );
    slide.addNotes(
      `Variable ${variable.label}: explicar que una curva alta significa mayor pertenencia. El solape evita cortes bruscos.`,
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Reglas IF-THEN", "COMO PIENSA EL SISTEMA");
    const ruleCounts = academicRiskOutput.terms.map((term) => ({
      label: term.label,
      count: academicRiskRules.filter((rule) => rule.consequent.term === term.id).length,
    }));
    const rows: TableRow[] = [
      [
        tcHead("Salida", C.teal, C.white),
        tcHead("Cuantas reglas apuntan aqui", C.teal, C.white),
        tcHead("Lectura humana", C.teal, C.white),
      ],
      ...ruleCounts.map((row): TableRow => [
        tc(row.label),
        tc(row.count),
        tc(
          row.label === "bajo"
            ? "Buen rendimiento o buena constancia reducen la alerta."
            : row.label === "medio"
              ? "Señales mixtas: no es grave, pero requiere vigilancia."
              : row.label === "alto"
                ? "Varias señales negativas empujan seguimiento temprano."
                : "Combinaciones severas activan atencion inmediata.",
        ),
      ]),
    ];
    slide.addTable(rows, {
      x: 0.75,
      y: 1.55,
      w: 11.85,
      h: 2.4,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.7 },
      margin: 0.08,
      valign: "middle",
      colW: [2.0, 2.4, 7.45],
    });
    addCard(
      slide,
      0.75,
      4.2,
      5.75,
      1.05,
      "Ejemplo de alerta",
      "IF promedio es bajo AND entregas son insuficientes THEN riesgo es critico.",
      C.red,
    );
    addCard(
      slide,
      6.85,
      4.2,
      5.75,
      1.05,
      "Ejemplo de estabilidad",
      "IF entregas son completas AND promedio es alto THEN riesgo es bajo.",
      C.green,
    );
    addCard(
      slide,
      0.75,
      5.55,
      11.85,
      0.9,
      "Como se activa una regla",
      "Cada condicion tiene un grado mu. La fuerza de la regla es alpha = min(condiciones). Si una condicion es debil, la regla completa baja.",
      C.teal,
    );
    slide.addNotes(
      "No leer 30 reglas. Explicar el patron: reglas positivas bajan riesgo, reglas negativas lo suben, y alpha mide cuanta fuerza tiene cada regla.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, `Caso de prueba: ${caseLabel}`, "LECTURA PASO A PASO");
    const inputRows: TableRow[] = [
      [
        tcHead("Dato", C.teal, C.white),
        tcHead("Valor del slider", C.teal, C.white),
      ],
      ...describeInputs(inputs).map((row): TableRow => [tc(row.label), tc(row.value)]),
    ];
    slide.addTable(inputRows, {
      x: 0.95,
      y: 1.6,
      w: 3.85,
      h: 3.3,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.7 },
      margin: 0.08,
      valign: "middle",
      colW: [2.55, 1.3],
    });
    const degreeRows: TableRow[] = [
      [
        tcHead("Variable", C.teal, C.white),
        tcHead("Como se lee difusamente", C.teal, C.white),
      ],
      ...Object.entries(result.fuzzification).map(([variableId, degrees]): TableRow => {
        const variable = academicRiskInputs.find((item) => item.id === variableId);
        const text = degreeText(variableId, degrees);
        return [tc(variable?.label ?? variableId), tc(text || "ningun conjunto activo")];
      }),
    ];
    slide.addTable(degreeRows, {
      x: 4.95,
      y: 1.6,
      w: 7.45,
      h: 3.3,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.7 },
      margin: 0.08,
      valign: "middle",
      colW: [2.6, 4.85],
    });
    addCard(
      slide,
      0.95,
      5.05,
      11.45,
      1.7,
      "Lectura general",
      `${caseDescription} La tabla derecha muestra por que un valor no cae en una sola caja: puede activar dos etiquetas con distinta fuerza.`,
      C.gold,
    );
    slide.addNotes(
      "Conectar con la UI: el numero del slider es x_i; los chips mu bajo, mu regular, etc. son estos grados.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Reglas que mas pesan", "INFERENCIA SOBRE EL CASO");
    const active = result.ruleActivations
      .filter((activation) => activation.alpha > 0)
      .sort((a, b) => b.alpha - a.alpha);
    const visibleActive = active.slice(0, 7);
    const ruleRows: TableRow[] = [
      [
        tcHead("Regla", C.teal, C.white),
        tcHead("Que dice", C.teal, C.white),
        tcHead("Fuerza", C.teal, C.white),
        tcHead("Empuja a", C.teal, C.white),
      ],
      ...visibleActive.map((activation): TableRow => [
        tc(activation.rule.id),
        tc(activation.rule.text),
        tc(`alpha ${activation.alpha.toFixed(2)}`),
        tc(termLabel("risk", activation.rule.consequent.term), {
          bold: true,
          color: riskColorById[activation.rule.consequent.term]?.fill ?? C.ink,
        }),
      ]),
    ];
    slide.addTable(ruleRows, {
      x: 0.95,
      y: 1.55,
      w: 5.6,
      h: 4.6,
      fontSize: 9.5,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.7 },
      margin: 0.08,
      valign: "middle",
      colW: [0.75, 3.15, 0.9, 0.8],
    });
    const defuzz = findChart(options.chartImages, "defuzzification");
    if (defuzz) {
      slide.addImage({
        data: defuzz.dataUrl,
        x: 6.75,
        y: 1.55,
        w: 5.7,
        h: 3.7,
        altText: "Curva de agregacion difusa con centroide marcado",
      });
    } else {
      addCard(
        slide,
        6.75,
        1.55,
        5.7,
        3.7,
        "Curva agregada",
        "La curva de salida se construye como max punto a punto de cada conjunto recortado por alpha. La aplicacion web la grafica en vivo.",
        C.teal,
      );
    }
    addCard(
      slide,
      6.75,
      5.4,
      5.7,
      0.85,
      "Centroide",
      `Riesgo final = ${result.centroid.toFixed(2)}. Sale del equilibrio de la curva agregada.`,
      C.gold,
    );
    slide.addNotes(
      "Mostrar solo las reglas mas fuertes. Alpha es fuerza de activacion. La curva de la derecha junta todas las evidencias.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Resultado final", "COMO SE INTERPRETA");
    const tone = riskColorById[result.labelId] ?? riskColorById.medium;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.95,
      y: 1.6,
      w: 4.7,
      h: 3.3,
      rectRadius: 0.12,
      fill: { color: tone.fill },
      line: { color: tone.fill, width: 0 },
    });
    slide.addText(result.centroid.toFixed(2), {
      x: 1.05,
      y: 1.95,
      w: 4.5,
      h: 1.5,
      fontSize: 80,
      bold: true,
      color: C.white,
      align: "center",
      margin: 0,
    });
    slide.addText(`Riesgo ${result.label}`, {
      x: 1.05,
      y: 3.45,
      w: 4.5,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: C.white,
      align: "center",
    });
    slide.addText("nivel de alerta en escala 0 - 100", {
      x: 1.05,
      y: 3.95,
      w: 4.5,
      h: 0.35,
      fontSize: 12,
      color: C.white,
      align: "center",
    });
    addCard(
      slide,
      5.95,
      1.6,
      6.55,
      2.05,
      "Lectura rapida",
      riskSummary(result.labelId),
      C.teal,
    );
    addCard(
      slide,
      5.95,
      3.75,
      6.55,
      1.15,
      "Accion sugerida",
      riskAction(result.labelId),
      C.gold,
    );
    addCard(
      slide,
      0.95,
      5.05,
      11.55,
      1.7,
      "Como defender este resultado",
      "No significa porcentaje de reprobar. Significa nivel de alerta segun entradas, curvas y reglas visibles. Se puede reproducir con los mismos cinco valores.",
      C.teal,
    );
    slide.addNotes(
      "Aclaracion importante: no vender como probabilidad. Es una escala difusa de alerta academica.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Prueba con tres perfiles", "QUE PASA SI CAMBIAN LOS DATOS");
    sensitivityCases.forEach((kase, index) => {
      const subResult = inferAcademicRisk(kase.inputs, 1);
      const tone = riskColorById[subResult.labelId] ?? riskColorById.medium;
      const x = 0.95 + index * 4.0;
      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y: 1.55,
        w: 3.7,
        h: 5.2,
        rectRadius: 0.1,
        fill: { color: C.panel },
        line: { color: C.line, width: 1 },
      });
      slide.addShape(pptx.ShapeType.rect, {
        x,
        y: 1.55,
        w: 3.7,
        h: 0.55,
        fill: { color: tone.fill },
        line: { color: tone.fill, width: 0 },
      });
      slide.addText(kase.label, {
        x: x + 0.15,
        y: 1.6,
        w: 3.4,
        h: 0.45,
        fontSize: 14,
        bold: true,
        color: C.white,
      });
      slide.addText(subResult.centroid.toFixed(2), {
        x: x + 0.15,
        y: 2.3,
        w: 3.4,
        h: 0.85,
        fontSize: 42,
        bold: true,
        color: tone.fill,
        align: "left",
      });
      slide.addText(`Riesgo ${subResult.label}`, {
        x: x + 0.15,
        y: 3.2,
        w: 3.4,
        h: 0.3,
        fontSize: 13,
        bold: true,
        color: C.inkSoft,
      });
      const inputLines = describeInputs(kase.inputs).map((row) => `${row.label}: ${row.value}`);
      addBullets(slide, inputLines, x + 0.15, 3.55, 3.4, 2.0, 11);
      slide.addText(kase.description, {
        x: x + 0.15,
        y: 5.7,
        w: 3.4,
        h: 0.95,
        fontSize: 11,
        color: C.muted,
        italic: true,
        fit: "shrink",
      });
    });
    slide.addNotes(
      "Mostrar que las mismas reglas responden distinto ante perfiles distintos. No hay trucos: cambian entradas, cambia la alerta.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Por que no usar reglas duras", "DIFUSO VS IF-ELSE");
    const compRows: TableRow[] = [
      [
        tcHead("Criterio", C.teal, C.white),
        tcHead("Reglas rigidas", C.teal, C.white),
        tcHead("Sistema difuso Mamdani", C.teal, C.white),
      ],
      [tc("Cambio cerca del limite"), tc("Salta de golpe"), tc("Cambia poco a poco")],
      [tc("Explicacion"), tc("Solo dice que umbral paso"), tc("Muestra grados y reglas activas")],
      [tc("Caso mixto"), tc("Cuesta combinar señales"), tc("Acepta varias etiquetas a la vez")],
      [tc("Datos historicos requeridos"), tc("Ninguno"), tc("Ninguno")],
      [tc("Auditabilidad"), tc("Limitada"), tc("Cada paso es reproducible")],
      [tc("Uso academico"), tc("Rigido para zonas grises"), tc("Natural para bajo/regular/alto")],
    ];
    slide.addTable(compRows, {
      x: 0.95,
      y: 1.55,
      w: 11.45,
      h: 4.4,
      fontSize: 12,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.7 },
      margin: 0.1,
      valign: "middle",
      colW: [3.05, 4.0, 4.4],
    });
    addCard(
      slide,
      0.95,
      6.1,
      11.45,
      0.75,
      "Conclusion",
      "Un if-else sirve para cortes simples. Este problema necesita gradualidad porque los estudiantes reales tienen señales mezcladas.",
      C.gold,
    );
    slide.addNotes(
      "Usar el ejemplo 59 vs 60. El sistema difuso evita que un punto de diferencia cambie toda la lectura.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Limites honestos", "QUE NO PROMETE");
    addBullets(
      slide,
      [
        "No predice el futuro. Evalua el caso actual con reglas definidas.",
        "No es probabilidad estadistica de reprobar. Es nivel de alerta.",
        "No reemplaza al docente o tutor. Ordena evidencia para decidir mejor.",
        "Depende de curvas y reglas calibradas. Si se ajustan, cambia el resultado.",
        "Trabajo futuro: conectar datos LMS, validar con expertos y ajustar parametros con evidencia historica.",
      ],
      0.95,
      1.6,
      11.45,
      4.5,
    );
    addCard(
      slide,
      0.95,
      6.2,
      11.45,
      0.7,
      "Recordatorio",
      "La fuerza del proyecto es explicabilidad. No intenta competir con ML; resuelve cuando importa poder justificar cada paso.",
      C.teal,
    );
    slide.addNotes(
      "Ser claro con limites hace mas defendible el sistema. No prometer prediccion, prometer trazabilidad.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Por que se puede confiar", "PROPIEDADES CLAVE");
    addBullets(
      slide,
      [
        "Determinista: mismas entradas producen el mismo resultado.",
        "Acotado: el riesgo siempre queda en [0,100].",
        "Gradual: mover un slider cambia el resultado suavemente.",
        "Explicable: se ven pertenencias, reglas, alpha, curva agregada y centroide.",
        "Sin zonas ciegas: las curvas se solapan para cubrir el rango.",
        "Rapido: solo usa operaciones min, max y sumas; no requiere entrenamiento.",
        "Auditable: el motor TypeScript, el reporte y la presentacion usan la misma fuente.",
      ],
      0.95,
      1.6,
      11.45,
      4.5,
      14,
    );
    addCard(
      slide,
      0.95,
      6.2,
      11.45,
      0.7,
      "Traduccion",
      "No pedimos fe en un modelo oculto. El comportamiento sale de reglas y funciones visibles.",
      C.teal,
    );
    slide.addNotes(
      "Enfatizar que estas propiedades no dependen de entrenamiento. Son consecuencia directa del diseño difuso.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Conclusiones", "MENSAJES PARA CERRAR");
    addBullets(
      slide,
      [
        "El riesgo academico es gradual; por eso la logica difusa encaja mejor que cortes rigidos.",
        "Cada barra se interpreta con grados mu, no con una sola etiqueta forzada.",
        "Las reglas IF-THEN convierten criterio docente en calculo reproducible.",
        "El centroide resume toda la evidencia en un numero claro de 0 a 100.",
        "El sistema es defendible porque muestra el camino completo desde dato hasta resultado.",
      ],
      0.95,
      1.6,
      11.45,
      3.6,
    );
    addCard(
      slide,
      0.95,
      5.4,
      5.5,
      1.4,
      "Frase final",
      "No es una caja negra: es una lupa ordenada para leer señales academicas mezcladas.",
      C.teal,
    );
    addCard(
      slide,
      6.65,
      5.4,
      5.75,
      1.4,
      "Entregables",
      `${author}\nMaestria En Ciencias Computacionales\nInstituto Tecnologico de Tijuana`,
      C.gold,
    );
    slide.addNotes(
      "Cerrar con una frase: el valor del sistema no es solo calcular, sino explicar por que calcula eso.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Referencias bibliograficas", "FUENTES PRIMARIAS");
    addBullets(
      slide,
      [
        "Zadeh, L. A. (1965). Fuzzy sets. Information and Control, 8(3), 338-353.",
        "Zadeh, L. A. (1975). The concept of a linguistic variable. Information Sciences, 8(3), 199-249.",
        "Mamdani, E. H. (1974). Application of fuzzy algorithms for control of a simple dynamic plant. Proc. IEE, 121(12).",
        "Mamdani, E. H. & Assilian, S. (1975). An experiment in linguistic synthesis with a fuzzy logic controller. IJMMS, 7(1).",
        "Ross, T. J. (2010). Fuzzy Logic with Engineering Applications. Wiley.",
        "Klir, G. J. & Yuan, B. (1995). Fuzzy Sets and Fuzzy Logic: Theory and Applications. Prentice Hall.",
        "Pedrycz, W. & Gomide, F. (1998). An Introduction to Fuzzy Sets. MIT Press.",
        "Castillo, O. & Melin, P. (2008). Type-2 Fuzzy Logic: Theory and Applications. Springer.",
      ],
      0.95,
      1.6,
      11.45,
      5.0,
      12,
    );
    slide.addNotes(
      "Citar siempre Zadeh 1965 como punto de partida y Mamdani 1975 como base del enfoque usado. Castillo se cita por relacion con el profesor de la materia.",
    );
  }

  return pptx;
}

export async function presentationToBlob(options: BuildPresentationOptions = {}): Promise<Blob> {
  const pptx = await buildPresentation(options);
  const data = await pptx.write({ outputType: "blob" });
  return data as Blob;
}

export async function presentationToBuffer(options: BuildPresentationOptions = {}): Promise<Buffer> {
  const pptx = await buildPresentation(options);
  const data = await pptx.write({ outputType: "nodebuffer" });
  return data as Buffer;
}

export async function presentationToFile(
  filePath: string,
  options: BuildPresentationOptions = {},
) {
  const pptx = await buildPresentation(options);
  await pptx.writeFile({ fileName: filePath });
}
