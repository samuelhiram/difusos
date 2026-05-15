import fs from "node:fs";
import path from "node:path";
import pptxgenModule from "pptxgenjs";
import {
  academicRiskInputs,
  academicRiskOutput,
  academicRiskRules,
  inferAcademicRisk,
  type VariableDefinition,
} from "@academic-risk/fuzzy-core";

const outDir = path.resolve("dist");
const outFile = path.join(outDir, "sistema-difuso-mamdani.pptx");

const sampleInput = {
  average: 58,
  attendance: 64,
  assignments: 55,
  participation: 48,
  exams: 52,
};

const result = inferAcademicRisk(sampleInput, 1);

const PptxGenJS = ((pptxgenModule as unknown as { default?: typeof pptxgenModule }).default ?? pptxgenModule) as typeof pptxgenModule;
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Samuel Hiram Castro Martinez";
pptx.company = "Instituto Tecnologico de Tijuana";
pptx.subject = "Sistema difuso Mamdani para riesgo academico";
pptx.title = "Sistema Difuso Mamdani para la Evaluacion de Riesgo Academico en Estudiantes";
pptx.lang = "es-MX";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "es-MX",
};
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });

const C = {
  ink: "172033",
  muted: "5B667A",
  line: "D6DEE8",
  bg: "F7FAFC",
  teal: "0F766E",
  gold: "D97706",
  red: "DC2626",
  orange: "EA580C",
  green: "16A34A",
  white: "FFFFFF",
};

function addHeader(slide: pptxgen.Slide, title: string, section?: string) {
  slide.addText(section ?? "Sistema Difuso Mamdani", {
    x: 0.55,
    y: 0.25,
    w: 4.8,
    h: 0.25,
    fontSize: 8,
    bold: true,
    color: C.teal,
    margin: 0,
    breakLine: false,
  });
  slide.addText(title, {
    x: 0.55,
    y: 0.58,
    w: 11.9,
    h: 0.42,
    fontSize: 21,
    bold: true,
    color: C.ink,
    margin: 0,
    breakLine: false,
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0.55,
    y: 1.15,
    w: 12.2,
    h: 0,
    line: { color: C.line, width: 1 },
  });
}

function addFooter(slide: pptxgen.Slide, n: number) {
  slide.addText(`Samuel Hiram Castro Martinez | Sistemas Difusos | ${n}`, {
    x: 0.55,
    y: 7.14,
    w: 12.2,
    h: 0.18,
    fontSize: 7,
    color: C.muted,
    margin: 0,
    breakLine: false,
  });
}

function bullet(slide: pptxgen.Slide, lines: string[], x: number, y: number, w: number, h: number, fontSize = 15) {
  slide.addText(lines.map((text) => ({ text, options: { bullet: { indent: 14 }, hanging: 4 } })), {
    x,
    y,
    w,
    h,
    fontSize,
    color: C.ink,
    fit: "shrink",
    breakLine: false,
    valign: "mid",
  });
}

function card(slide: pptxgen.Slide, x: number, y: number, w: number, h: number, title: string, body: string, color = C.teal) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: C.white },
    line: { color: C.line, width: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.08, h, fill: { color }, line: { color } });
  slide.addText(title, {
    x: x + 0.22,
    y: y + 0.2,
    w: w - 0.38,
    h: 0.28,
    fontSize: 13,
    bold: true,
    color: C.ink,
    margin: 0,
    breakLine: false,
  });
  slide.addText(body, {
    x: x + 0.22,
    y: y + 0.55,
    w: w - 0.38,
    h: h - 0.7,
    fontSize: 10.8,
    color: C.muted,
    fit: "shrink",
    margin: 0,
    breakLine: false,
  });
}

function shapeLabel(shape: VariableDefinition["terms"][number]["shape"]) {
  if (shape.type === "triangular") return `T(${shape.a}, ${shape.b}, ${shape.c})`;
  return `Z(${shape.a}, ${shape.b}, ${shape.c}, ${shape.d})`;
}

function addMembershipMiniChart(slide: pptxgen.Slide, variable: VariableDefinition, x: number, y: number, w: number, h: number) {
  slide.addText(variable.label, { x, y, w, h: 0.22, fontSize: 9, bold: true, color: C.ink, margin: 0 });
  slide.addShape(pptx.ShapeType.line, { x, y: y + h, w, h: 0, line: { color: C.line, width: 0.7 } });

  const colors = [C.teal, C.gold, C.red, C.green];
  variable.terms.forEach((term, index) => {
    const color = colors[index % colors.length];
    const s = term.shape;
    const px = (value: number) => x + ((value - variable.min) / (variable.max - variable.min)) * w;
    const py = (mu: number) => y + h - mu * (h - 0.35);

    if (s.type === "triangular") {
      slide.addShape(pptx.ShapeType.chevron, {
        x: px(s.a),
        y: py(1),
        w: Math.max(0.22, px(s.c) - px(s.a)),
        h: h - 0.35,
        rotate: 90,
        fill: { color, transparency: 82 },
        line: { color, width: 1 },
      });
    } else {
      const points = [
        [px(s.a), py(0)],
        [px(s.b), py(1)],
        [px(s.c), py(1)],
        [px(s.d), py(0)],
      ];
      for (let i = 0; i < points.length - 1; i += 1) {
        slide.addShape(pptx.ShapeType.line, {
          x: points[i][0],
          y: points[i][1],
          w: points[i + 1][0] - points[i][0],
          h: points[i + 1][1] - points[i][1],
          line: { color, width: 1.5 },
        });
      }
    }
    slide.addText(term.label, { x, y: y + h + 0.06 + index * 0.16, w, h: 0.15, fontSize: 6.8, color, margin: 0 });
  });
}

let page = 1;

{
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  slide.addText("Sistema Difuso Mamdani para la Evaluacion de Riesgo Academico en Estudiantes", {
    x: 0.75,
    y: 1.0,
    w: 11.7,
    h: 1.05,
    fontSize: 30,
    bold: true,
    color: C.ink,
    fit: "shrink",
    margin: 0,
  });
  slide.addText("Instituto Tecnologico de Tijuana | Maestria En Ciencias Computacionales", {
    x: 0.78,
    y: 2.25,
    w: 10.8,
    h: 0.3,
    fontSize: 14,
    color: C.teal,
    bold: true,
    margin: 0,
  });
  card(slide, 0.78, 3.0, 5.55, 1.65, "Objetivo", "Estimar riesgo de reprobacion con logica difusa clasica: variables linguisticas, reglas IF-THEN, inferencia Mamdani y centroide.", C.teal);
  card(slide, 6.65, 3.0, 5.55, 1.65, "Restriccion clave", "Sin machine learning, redes neuronales, regresion, estadistica predictiva ni APIs externas. Todo es determinista y explicable.", C.red);
  slide.addText("Samuel Hiram Castro Martinez | Sistemas Difusos | 12 de Mayo del 2026", {
    x: 0.78,
    y: 6.55,
    w: 11.7,
    h: 0.25,
    fontSize: 11,
    color: C.muted,
    margin: 0,
  });
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Problema y contexto");
  bullet(
    slide,
    [
      "La evaluacion academica contiene incertidumbre: promedio, asistencia y entregas no son estados binarios.",
      "Los umbrales duros generan saltos artificiales entre bajo, regular y alto.",
      "El sistema convierte evidencias academicas imprecisas en un riesgo explicable de 0 a 100.",
      "Cada regla, grado de pertenencia y salida recortada puede auditarse.",
    ],
    0.85,
    1.65,
    11.75,
    3.3,
  );
  card(slide, 0.85, 5.25, 11.2, 1.05, "Pregunta guia", "Como estimar riesgo academico de forma gradual, transparente y defendible, sin modelos probabilisticos ni entrenamiento?", C.gold);
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Arquitectura del monorepo");
  const rows = [
    ["Capa", "Elemento", "Uso"],
    ["apps/web", "Next.js + React Flow + Recharts + KaTeX", "Interfaz visual, grafo, formulas y trazabilidad"],
    ["packages/fuzzy-core", "TypeScript puro", "Motor Mamdani clasico"],
    ["packages/report", "LaTeX + BibTeX", "Documento academico"],
    ["packages/presentation", "PptxGenJS", "Presentacion PowerPoint editable automatica"],
  ];
  slide.addTable(rows, {
    x: 0.75,
    y: 1.55,
    w: 11.85,
    h: 3.2,
    border: { color: C.line, width: 1 },
    fontSize: 11,
    color: C.ink,
    fill: { color: C.white },
    margin: 0.08,
    autoFit: false,
    fit: "shrink",
    valign: "mid",
    rowH: 0.58,
    colW: [2.1, 4.4, 5.35],
  });
  card(slide, 0.75, 5.2, 11.85, 0.95, "Automatizacion", "La presentacion toma variables, reglas y caso de prueba desde fuzzy-core. Si cambia el sistema, cambia el PPTX.", C.teal);
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Modelo difuso Mamdani");
  const formulas = [
    ["Fuzzificacion", "mu_A(x) con funciones triangulares y trapezoidales"],
    ["AND", "alpha_r = min(mu_A1(x1), ..., mu_An(xn))"],
    ["Implicacion", "mu_Br'(y) = min(alpha_r, mu_Br(y))"],
    ["Agregacion", "mu_B(y) = max_r mu_Br'(y)"],
    ["Centroide", "y* = integral y mu_B(y) dy / integral mu_B(y) dy"],
  ];
  formulas.forEach(([title, text], i) => {
    card(slide, 0.85, 1.45 + i * 0.92, 11.45, 0.68, title, text, i % 2 === 0 ? C.teal : C.gold);
  });
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Variables linguisticas");
  const rows = [
    ["Variable", "Rango", "Conjuntos"],
    ...academicRiskInputs.map((variable) => [variable.label, "[0,100]", variable.terms.map((term) => term.label).join(", ")]),
    [academicRiskOutput.label, "[0,100]", academicRiskOutput.terms.map((term) => term.label).join(", ")],
  ];
  slide.addTable(rows, {
    x: 0.75,
    y: 1.45,
    w: 11.85,
    h: 4.6,
    border: { color: C.line, width: 1 },
    fontSize: 10.8,
    color: C.ink,
    fill: { color: C.white },
    margin: 0.08,
    fit: "shrink",
    valign: "mid",
    rowH: 0.55,
    colW: [3.0, 1.6, 7.25],
  });
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Funciones de pertenencia");
  const variables = [...academicRiskInputs, academicRiskOutput];
  variables.forEach((variable, index) => {
    const x = index % 2 === 0 ? 0.75 : 6.85;
    const y = 1.45 + Math.floor(index / 2) * 1.72;
    addMembershipMiniChart(slide, variable, x, y, 5.1, 0.98);
    slide.addText(variable.terms.map((term) => `${term.label}: ${shapeLabel(term.shape)}`).join(" | "), {
      x,
      y: y + 1.27,
      w: 5.45,
      h: 0.26,
      fontSize: 6.8,
      color: C.muted,
      fit: "shrink",
      margin: 0,
    });
  });
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Base de reglas IF-THEN");
  const rows = [
    ["Regla", "Enunciado", "Salida"],
    ...academicRiskRules.map((rule) => [rule.id, rule.text, rule.consequent.term]),
  ];
  slide.addTable(rows, {
    x: 0.55,
    y: 1.35,
    w: 12.25,
    h: 5.55,
    border: { color: C.line, width: 0.7 },
    fontSize: 8.5,
    color: C.ink,
    fill: { color: C.white },
    margin: 0.06,
    fit: "shrink",
    valign: "mid",
    rowH: 0.43,
    colW: [0.75, 9.9, 1.6],
  });
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Caso de prueba y fuzzificacion");
  const inputRows = [
    ["Entrada", "Valor"],
    ["Promedio", String(sampleInput.average)],
    ["Asistencia", String(sampleInput.attendance)],
    ["Entregas", String(sampleInput.assignments)],
    ["Participacion", String(sampleInput.participation)],
    ["Examenes", String(sampleInput.exams)],
  ];
  slide.addTable(inputRows, {
    x: 0.75,
    y: 1.45,
    w: 3.4,
    h: 2.6,
    border: { color: C.line, width: 1 },
    fontSize: 11,
    color: C.ink,
    margin: 0.08,
    fit: "shrink",
    rowH: 0.42,
  });
  const degreeText = Object.entries(result.fuzzification)
    .map(([variable, degrees]) => {
      const label = academicRiskInputs.find((item) => item.id === variable)?.label ?? variable;
      const terms = Object.entries(degrees)
        .filter(([, value]) => value > 0)
        .map(([term, value]) => `${term}=${value.toFixed(3)}`)
        .join(", ");
      return `${label}: ${terms || "0"}`;
    })
    .join("\n");
  card(slide, 4.65, 1.45, 7.6, 3.05, "Grados de pertenencia activos", degreeText, C.teal);
  card(slide, 0.75, 4.85, 11.5, 1.15, "Lectura", "Los valores no entran como categorias rigidas. Cada entrada activa uno o mas conjuntos con grados parciales.", C.gold);
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Reglas activadas");
  const active = result.ruleActivations.filter((activation) => activation.alpha > 0);
  const rows = [
    ["Regla", "alpha", "Consecuente", "Area recortada"],
    ...active.map((activation) => [
      activation.rule.id,
      activation.alpha.toFixed(3),
      activation.rule.consequent.term,
      activation.clippedArea.toFixed(2),
    ]),
  ];
  slide.addTable(rows, {
    x: 0.8,
    y: 1.45,
    w: 5.4,
    h: 3.8,
    border: { color: C.line, width: 1 },
    fontSize: 10,
    color: C.ink,
    margin: 0.08,
    fit: "shrink",
    rowH: 0.44,
  });
  const topRules = active
    .sort((a, b) => b.alpha - a.alpha)
    .slice(0, 4)
    .map((activation) => `${activation.rule.id}: ${activation.rule.text}`)
    .join("\n");
  card(slide, 6.65, 1.45, 5.75, 3.8, "Reglas dominantes", topRules, C.orange);
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Resultado crisp e interpretacion");
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.85,
    y: 1.55,
    w: 4.1,
    h: 2.0,
    rectRadius: 0.12,
    fill: { color: result.labelId === "critical" ? C.red : C.teal },
    line: { color: result.labelId === "critical" ? C.red : C.teal },
  });
  slide.addText(result.centroid.toFixed(2), {
    x: 1.08,
    y: 1.88,
    w: 3.6,
    h: 0.78,
    fontSize: 42,
    bold: true,
    color: C.white,
    margin: 0,
  });
  slide.addText(`Riesgo ${result.label}`, {
    x: 1.1,
    y: 2.75,
    w: 3.4,
    h: 0.28,
    fontSize: 15,
    bold: true,
    color: C.white,
    margin: 0,
  });
  card(slide, 5.55, 1.55, 6.55, 2.0, "Interpretacion", "El sistema estima nivel de alerta academica, no probabilidad estadistica. El resultado se explica por reglas activadas, recortes y agregacion max.", C.teal);
  card(slide, 0.85, 4.05, 11.25, 1.35, "Accion sugerida", "Aplicar intervencion temprana: asesoria, plan de entregas y seguimiento semanal cuando el riesgo sea alto o critico.", C.gold);
  addFooter(slide, page++);
}

{
  const slide = pptx.addSlide();
  addHeader(slide, "Conclusiones");
  bullet(
    slide,
    [
      "La logica difusa permite representar transiciones graduales entre niveles academicos.",
      "El sistema es transparente: cada regla y grado de activacion es visible.",
      "La arquitectura separa motor, interfaz, reporte LaTeX y presentacion PPTX.",
      "El proyecto queda defendible porque no usa aprendizaje automatico ni prediccion estadistica.",
    ],
    0.9,
    1.6,
    11.4,
    3.4,
  );
  card(slide, 0.9, 5.35, 11.4, 0.95, "Entregables automatizados", "App web, motor TypeScript, reporte LaTeX validado y presentacion PowerPoint editable.", C.teal);
  addFooter(slide, page++);
}

fs.mkdirSync(outDir, { recursive: true });
await pptx.writeFile({ fileName: outFile });
console.log(`PPTX generado: ${outFile}`);
