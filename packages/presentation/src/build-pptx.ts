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
    slide.addText("Sistema Difuso Mamdani", {
      x: 0.85,
      y: 1.4,
      w: 11.6,
      h: 0.7,
      fontSize: 18,
      bold: true,
      color: C.teal,
      charSpacing: 4,
    });
    slide.addText("Evaluacion de Riesgo Academico en Estudiantes", {
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
      "Instituto Tecnologico de Tijuana  |  Maestria En Ciencias Computacionales  |  Sistemas Difusos",
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
      "Objetivo",
      "Estimar el riesgo de reprobacion con logica difusa clasica: variables linguisticas, reglas IF-THEN, inferencia Mamdani y centroide. Todo el resultado es determinista y auditable.",
      C.teal,
    );
    addCard(
      slide,
      6.8,
      4.25,
      5.65,
      1.85,
      "Restriccion clave",
      "Sin machine learning, redes neuronales, regresion o estadistica predictiva. Solo conjuntos difusos, min, max y centroide.",
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
      "Slide de portada. Mencionar que el sistema no usa ML y que cada paso del razonamiento queda visible. Presentar profesor y materia.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Agenda", "GUIA DE LA PRESENTACION");
    const agendaItems = [
      "1.  Problema y contexto: por que evitar umbrales rigidos",
      "2.  Modelo Mamdani: fuzzificacion, inferencia, agregacion y centroide",
      "3.  Variables linguisticas y funciones de pertenencia",
      "4.  Base de reglas IF-THEN",
      "5.  Caso de prueba en vivo y resultado crisp",
      "6.  Analisis de sensibilidad: tres escenarios contrastantes",
      "7.  Comparacion contra reglas rigidas",
      "8.  Limitaciones, conclusiones y trabajo futuro",
    ];
    addBullets(slide, agendaItems, 0.95, 1.7, 11.5, 4.7, 17);
    addCard(
      slide,
      0.95,
      6.05,
      11.5,
      0.75,
      "Idea central",
      "El sistema convierte evidencias academicas imprecisas en un riesgo explicable de 0 a 100. Cada paso se puede auditar.",
      C.teal,
    );
    slide.addNotes(
      "Recorrer la agenda en menos de 30 segundos. Subrayar que cada bloque resuelve una duda especifica: por que difuso, como funciona, como se aplica y como se valida.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Problema y contexto", "MOTIVACION");
    addBullets(
      slide,
      [
        "La evaluacion academica contiene incertidumbre: promedio, asistencia y entregas no son estados binarios.",
        "Los umbrales duros generan saltos artificiales: 59 critico vs 60 regular, cuando ambos casos son muy similares.",
        "Necesitamos un sistema gradual, explicable y reproducible que no dependa de datos historicos masivos.",
        "El sistema convierte cinco evidencias academicas en un riesgo de 0 a 100 acompanado de etiqueta linguistica.",
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
      "Como estimar riesgo academico de forma gradual, transparente y defendible sin entrenar modelos ni recolectar datos historicos?",
      C.gold,
    );
    addCard(
      slide,
      6.85,
      4.85,
      5.6,
      1.7,
      "Promesa de la solucion",
      "Resultado 0-100 con etiqueta linguistica + lista de reglas activadas + curva de agregacion + centroide. Todo trazable y reproducible.",
      C.teal,
    );
    slide.addNotes(
      "Insistir en el contraste: umbrales rigidos vs transicion gradual. Mencionar que la auditoria de cada regla es clave en un contexto academico real.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Arquitectura del proyecto", "VISTA GENERAL");
    const rows: TableRow[] = [
      [
        tcHead("Capa", C.teal, C.white),
        tcHead("Elemento", C.teal, C.white),
        tcHead("Uso", C.teal, C.white),
      ],
      [tc("apps/web"), tc("Next.js + React Flow + Recharts + KaTeX"), tc("Interfaz visual, grafo de reglas, formulas, descargas")],
      [tc("packages/fuzzy-core"), tc("TypeScript puro"), tc("Motor Mamdani determinista")],
      [tc("packages/report"), tc("LaTeX + PGFPlots + BibLaTeX"), tc("Documento academico con figuras vectoriales")],
      [tc("packages/presentation"), tc("PptxGenJS"), tc("Presentacion editable generada al vuelo")],
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
      "Sincronia",
      "El motor TypeScript es la unica fuente de verdad. La interfaz, el reporte LaTeX y la presentacion consumen las mismas reglas, variables y caso de prueba. Cambiar el motor cambia todos los entregables.",
      C.teal,
    );
    slide.addNotes(
      "Explicar que el monorepo permite que cualquier cambio en la base de reglas se refleje automaticamente en los tres entregables. No hay duplicacion de logica.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Modelo difuso Mamdani", "PROCESO MATEMATICO");
    const steps = [
      ["1. Fuzzificacion", "Cada entrada se transforma en grados mu_A(x) usando funciones triangulares y trapezoidales."],
      ["2. Operador AND", "alpha_r = min(mu_A1(x1), mu_A2(x2), ..., mu_An(xn)) por cada regla activada."],
      ["3. Implicacion", "mu_B'_r(y) = min(alpha_r, mu_B_r(y)) recorta el conjunto consecuente."],
      ["4. Agregacion", "mu_B(y) = max_r mu_B'_r(y) une todas las salidas recortadas."],
      ["5. Defuzzificacion", "y* = integral(y * mu_B(y)) dy / integral(mu_B(y)) dy mediante centroide."],
    ];
    steps.forEach(([title, body], index) => {
      const accent = index % 2 === 0 ? C.teal : C.gold;
      addCard(slide, 0.95, 1.55 + index * 1.05, 11.45, 0.92, title, body, accent);
    });
    slide.addNotes(
      "Recorrer cada paso explicando que ninguno requiere entrenamiento: son operaciones aritmeticas y de minimo/maximo sobre conjuntos definidos manualmente.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Variables linguisticas", "DOMINIO DEL SISTEMA");
    const rows: TableRow[] = [
      [
        tcHead("Variable", C.teal, C.white),
        tcHead("Rango", C.teal, C.white),
        tcHead("Conjuntos linguisticos", C.teal, C.white),
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
      "Salida",
      "El motor agrega las salidas recortadas y aplica centroide en el universo [0, 100] con paso 1.",
      C.gold,
    );
    slide.addNotes(
      "Mencionar que las cinco entradas modelan dimensiones independientes pero correlacionadas. La salida es la unica variable difusa de respuesta.",
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
    addHeader(slide, `Funciones de pertenencia: ${variable.label}`, "FUZZIFICACION");
    addVariableChart(slide, variable, chartId, 0.95, 1.55, 7.7, 4.9);
    slide.addText("Parametros formales", {
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
        ? "Universo donde se aplica la agregacion max y la defuzzificacion por centroide."
        : `Cada valor de ${variable.label.toLowerCase()} activa simultaneamente uno o mas conjuntos con grado parcial.`,
      C.teal,
    );
    slide.addNotes(
      `Variable ${variable.label}: explicar que las funciones triangulares y trapezoidales permiten transiciones suaves. Senalar el solape entre conjuntos.`,
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Base de reglas IF-THEN", "MOTOR DE INFERENCIA");
    const rows: TableRow[] = [
      [
        tcHead("Regla", C.teal, C.white),
        tcHead("Enunciado", C.teal, C.white),
        tcHead("Consecuente", C.teal, C.white),
      ],
      ...academicRiskRules.map((rule): TableRow => [
        tc(rule.id),
        tc(rule.text),
        tc(rule.consequent.term, { bold: true, color: riskColorById[rule.consequent.term]?.fill ?? C.ink }),
      ]),
    ];
    slide.addTable(rows, {
      x: 0.6,
      y: 1.55,
      w: 12.15,
      h: 5.05,
      fontSize: 11,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.7 },
      margin: 0.08,
      valign: "middle",
      colW: [1.0, 9.6, 1.55],
    });
    slide.addNotes(
      "Recorrer brevemente las reglas. Senalar que son simetricas: cada combinacion negativa empuja a alto/critico y cada combinacion positiva empuja a bajo.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, `Caso de prueba: ${caseLabel}`, "EJECUCION EN VIVO");
    const inputRows: TableRow[] = [
      [
        tcHead("Entrada", C.teal, C.white),
        tcHead("Valor", C.teal, C.white),
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
        tcHead("Conjuntos activos (grado)", C.teal, C.white),
      ],
      ...Object.entries(result.fuzzification).map(([variableId, degrees]): TableRow => {
        const variable = academicRiskInputs.find((item) => item.id === variableId);
        const text = Object.entries(degrees)
          .filter(([, value]) => value > 0)
          .map(([term, value]) => `${term}=${value.toFixed(3)}`)
          .join(", ");
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
      "Lectura",
      caseDescription,
      C.gold,
    );
    slide.addNotes(
      "Insistir en que los valores no se redondean a categorias rigidas: pueden activar simultaneamente dos o tres conjuntos. La columna derecha muestra esa coactivacion.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Reglas activadas y agregacion", "INFERENCIA SOBRE EL CASO");
    const active = result.ruleActivations
      .filter((activation) => activation.alpha > 0)
      .sort((a, b) => b.alpha - a.alpha);
    const ruleRows: TableRow[] = [
      [
        tcHead("Regla", C.teal, C.white),
        tcHead("alpha", C.teal, C.white),
        tcHead("Consec.", C.teal, C.white),
        tcHead("Area", C.teal, C.white),
      ],
      ...active.map((activation): TableRow => [
        tc(activation.rule.id),
        tc(activation.alpha.toFixed(3)),
        tc(activation.rule.consequent.term, {
          bold: true,
          color: riskColorById[activation.rule.consequent.term]?.fill ?? C.ink,
        }),
        tc(activation.clippedArea.toFixed(2)),
      ]),
    ];
    slide.addTable(ruleRows, {
      x: 0.95,
      y: 1.55,
      w: 5.6,
      h: 4.6,
      fontSize: 11,
      color: C.ink,
      fill: { color: C.panel },
      border: { type: "solid", color: C.line, pt: 0.7 },
      margin: 0.08,
      valign: "middle",
      colW: [1.0, 1.2, 1.95, 1.45],
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
      `y* = ${result.centroidNumerator.toFixed(2)} / ${result.centroidDenominator.toFixed(2)} = ${result.centroid.toFixed(2)}`,
      C.gold,
    );
    slide.addNotes(
      "Comentar la regla dominante. Mencionar que el area recortada de cada regla es la masa que entra al numerador del centroide.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Resultado crisp e interpretacion", "DEFUZZIFICACION");
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
    slide.addText("Resultado crisp en escala 0 - 100", {
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
      "Interpretacion",
      "El sistema entrega un nivel de alerta academica, no una probabilidad estadistica. La etiqueta linguistica viene del conjunto difuso con mayor grado de pertenencia para y*.",
      C.teal,
    );
    addCard(
      slide,
      5.95,
      3.75,
      6.55,
      1.15,
      "Acciones sugeridas",
      result.labelId === "critical" || result.labelId === "high"
        ? "Intervencion temprana: asesoria personalizada, plan de entregas y seguimiento semanal."
        : result.labelId === "medium"
          ? "Monitoreo quincenal con foco en las variables con menor grado de pertenencia positiva."
          : "Reforzar habitos actuales; revisar al cierre del periodo.",
      C.gold,
    );
    addCard(
      slide,
      0.95,
      5.05,
      11.55,
      1.7,
      "Trazabilidad",
      "Cualquier persona puede reproducir el resultado: las cinco entradas se publican, los conjuntos difusos estan definidos en el repositorio y las reglas son visibles en la presentacion. No hay caja negra.",
      C.teal,
    );
    slide.addNotes(
      "Esta es la slide de cierre tecnico del caso. Senalar que el numero no es estadistico sino un nivel de alerta calculado deterministamente.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Analisis de sensibilidad", "TRES ESCENARIOS CONTRASTANTES");
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
      slide.addText(`Etiqueta: ${subResult.label}`, {
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
      "Mostrar que con la misma base de reglas obtenemos resultados muy distintos. Sirve para defender que el modelo discrimina escenarios reales.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Difuso vs umbrales rigidos", "VALIDACION CONCEPTUAL");
    const compRows: TableRow[] = [
      [
        tcHead("Criterio", C.teal, C.white),
        tcHead("Reglas rigidas", C.teal, C.white),
        tcHead("Sistema difuso Mamdani", C.teal, C.white),
      ],
      [tc("Granularidad"), tc("Salto discreto entre clases"), tc("Transicion suave entre conjuntos")],
      [tc("Trazabilidad"), tc("Solo el umbral disparado"), tc("Todas las reglas activadas con su grado")],
      [tc("Sensibilidad a cambios pequenos"), tc("Alta cerca del umbral"), tc("Baja: cambios graduales en la salida")],
      [tc("Datos historicos requeridos"), tc("Ninguno"), tc("Ninguno")],
      [tc("Auditabilidad academica"), tc("Limitada"), tc("Total: cada paso es reproducible")],
      [tc("Explicabilidad a stakeholders"), tc("Dificil cuando hay multiples variables"), tc("Inmediata: reglas en lenguaje natural")],
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
      "Ambos enfoques son deterministas, pero solo el difuso entrega graduacion, coactivacion de reglas y trazabilidad completa para uso academico.",
      C.gold,
    );
    slide.addNotes(
      "Sirve para anticipar la pregunta 'por que no un if-else simple'. Insistir en que un if-else falla en la zona de frontera entre clases.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Limitaciones y trabajo futuro", "HONESTIDAD INTELECTUAL");
    addBullets(
      slide,
      [
        "Las funciones de pertenencia se calibran con criterio experto, no con datos. Necesitan revision periodica.",
        "La base de reglas crece de forma combinatoria; mas variables exigirian metareglas o jerarquias.",
        "El sistema no reemplaza al tutor: produce alertas que requieren validacion humana.",
        "El centroide puede ser sensible si la curva agregada es muy plana; conviene reportar tambien el grado dominante.",
        "Trabajo futuro: tuning automatico (ANFIS), integracion con datos de plataforma LMS, evaluacion longitudinal por semestre.",
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
      "El alcance del proyecto es producir un sistema explicable. No compite con modelos de ML: complementa cuando se necesita defensibilidad.",
      C.teal,
    );
    slide.addNotes(
      "Aceptar limites refuerza la credibilidad. Senalar el camino hacia ANFIS como evolucion natural sin abandonar el principio difuso.",
    );
  }

  pageNum += 1;
  {
    const slide = addContentSlide();
    addHeader(slide, "Conclusiones", "MENSAJES A LLEVAR");
    addBullets(
      slide,
      [
        "La logica difusa permite representar transiciones graduales entre niveles academicos.",
        "El sistema es transparente: cada regla, grado y recorte es visible.",
        "La arquitectura separa motor, interfaz, reporte LaTeX y presentacion PPTX sin duplicar logica.",
        "El proyecto queda defendible porque no usa aprendizaje automatico ni prediccion estadistica.",
        "Tres entregables se generan al vuelo desde el mismo motor: web, PDF academico y presentacion.",
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
      "Entregables automatizados",
      "App web interactiva, motor TypeScript determinista, reporte LaTeX validado y presentacion PowerPoint editable.",
      C.teal,
    );
    addCard(
      slide,
      6.65,
      5.4,
      5.75,
      1.4,
      "Contacto",
      `${author}\nMaestria En Ciencias Computacionales\nInstituto Tecnologico de Tijuana`,
      C.gold,
    );
    slide.addNotes(
      "Slide final. Resumir en una frase: 'es difuso, es transparente y se entrega completo'. Cerrar con disposicion a preguntas.",
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
