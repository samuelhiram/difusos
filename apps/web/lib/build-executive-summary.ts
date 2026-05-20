import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ChartImage } from "@academic-risk/presentation";
import {
  academicRiskInputs,
  academicRiskOutput,
  defaultCaseStudy,
  type AcademicRiskInputValues,
  type MamdaniResult,
} from "@academic-risk/fuzzy-core";

export type ExecutiveSummaryOptions = {
  values: AcademicRiskInputValues;
  result: MamdaniResult;
  chartImages?: ChartImage[];
  authorName?: string;
  reportDate?: string;
};

const C = {
  ink: "#172033",
  inkSoft: "#2A3447",
  muted: "#5B667A",
  line: "#D6DEE8",
  bg: "#F7FAFC",
  teal: "#0F766E",
  gold: "#B45309",
  red: "#B91C1C",
  green: "#15803D",
  orange: "#C2410C",
  white: "#FFFFFF",
};

const riskColor: Record<string, string> = {
  low: C.green,
  medium: C.gold,
  high: C.orange,
  critical: C.red,
};

const variableLabels = [
  { key: "average" as const, label: "Promedio actual" },
  { key: "attendance" as const, label: "Asistencia" },
  { key: "assignments" as const, label: "Entregas realizadas" },
  { key: "participation" as const, label: "Participacion" },
  { key: "exams" as const, label: "Examenes recientes" },
];

function findChart(images: ChartImage[] | undefined, id: ChartImage["id"]) {
  return images?.find((image) => image.id === id);
}

function actionableInsight(result: MamdaniResult) {
  if (result.labelId === "critical") {
    return "Activar protocolo de intervencion inmediata. Asesoria personalizada, comunicacion con tutor academico y plan semanal de entregas.";
  }
  if (result.labelId === "high") {
    return "Programar reunion individual en la siguiente semana. Reforzar habitos de estudio y dar seguimiento a las entregas pendientes.";
  }
  if (result.labelId === "medium") {
    return "Monitoreo quincenal. Identificar la variable de menor grado positivo y aplicar refuerzo focalizado.";
  }
  return "Reforzar habitos actuales. Revisar al cierre del periodo con foco en la consistencia.";
}

function describeFuzzification(result: MamdaniResult) {
  return Object.entries(result.fuzzification).map(([variableId, degrees]) => {
    const variable = academicRiskInputs.find((item) => item.id === variableId);
    const active = Object.entries(degrees)
      .filter(([, value]) => value > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([term, value]) => `${term} (${value.toFixed(3)})`)
      .join(", ");
    return {
      variable: variable?.label ?? variableId,
      active: active || "sin conjunto activo",
    };
  });
}

export async function buildExecutiveSummaryPdf(options: ExecutiveSummaryOptions): Promise<Blob> {
  const { values, result, chartImages } = options;
  const author = options.authorName ?? "Samuel Hiram Castro Martinez";
  const date = options.reportDate ?? new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 50;

  doc.setFillColor(C.teal);
  doc.rect(0, 0, pageW, 14, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(C.teal);
  doc.text("SISTEMA DIFUSO MAMDANI", marginX, 38);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(C.ink);
  doc.text("Resumen ejecutivo de riesgo academico", marginX, 60);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(C.muted);
  doc.text(`Generado: ${date}  |  Autor: ${author}`, marginX, 78);

  doc.setDrawColor(C.line);
  doc.setLineWidth(0.8);
  doc.line(marginX, 92, pageW - marginX, 92);

  const tone = riskColor[result.labelId] ?? C.gold;
  doc.setFillColor(tone);
  doc.roundedRect(marginX, 108, 220, 110, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(46);
  doc.setTextColor(C.white);
  doc.text(result.centroid.toFixed(2), marginX + 110, 168, { align: "center" });
  doc.setFontSize(13);
  doc.text(`Riesgo ${result.label.toUpperCase()}`, marginX + 110, 198, { align: "center" });

  doc.setFillColor(C.white);
  doc.setDrawColor(C.line);
  doc.roundedRect(marginX + 240, 108, pageW - marginX * 2 - 240, 110, 8, 8, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(C.ink);
  doc.text("Lectura", marginX + 256, 130);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(C.inkSoft);
  const reading = doc.splitTextToSize(
    "El sistema entrega un nivel de alerta determinista basado en cinco evidencias academicas. El valor crisp viene de la defuzzificacion por centroide sobre la curva agregada.",
    pageW - marginX * 2 - 268,
  );
  doc.text(reading, marginX + 256, 150);

  autoTable(doc, {
    head: [["Entrada", "Valor", "Escala"]],
    body: variableLabels.map(({ key, label }) => [
      label,
      String(values[key]),
      "0 - 100",
    ]),
    startY: 240,
    margin: { left: marginX, right: marginX },
    headStyles: { fillColor: C.teal, textColor: C.white, halign: "left", fontSize: 10 },
    bodyStyles: { fontSize: 10, textColor: C.ink },
    styles: { lineColor: C.line, lineWidth: 0.4, cellPadding: 6 },
    columnStyles: { 1: { halign: "right", cellWidth: 70 }, 2: { halign: "right", cellWidth: 70 } },
    theme: "grid",
  });

  const afterInputsY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 360;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(C.ink);
  doc.text("Fuzzificacion", marginX, afterInputsY + 24);
  autoTable(doc, {
    head: [["Variable", "Conjuntos activos (grado)"]],
    body: describeFuzzification(result).map((row) => [row.variable, row.active]),
    startY: afterInputsY + 32,
    margin: { left: marginX, right: marginX },
    headStyles: { fillColor: C.teal, textColor: C.white, halign: "left", fontSize: 10 },
    bodyStyles: { fontSize: 10, textColor: C.ink },
    styles: { lineColor: C.line, lineWidth: 0.4, cellPadding: 6 },
    columnStyles: { 0: { cellWidth: 130 } },
    theme: "grid",
  });

  const afterFuzzY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? afterInputsY + 200;

  const activeRules = result.ruleActivations
    .filter((activation) => activation.alpha > 0)
    .sort((a, b) => b.alpha - a.alpha);

  if (afterFuzzY > pageH - 220) {
    doc.addPage();
  }
  const rulesStartY = afterFuzzY > pageH - 220 ? 60 : afterFuzzY + 24;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(C.ink);
  doc.text("Reglas activadas", marginX, rulesStartY);
  autoTable(doc, {
    head: [["Regla", "Alpha", "Consecuente", "Area recortada"]],
    body: activeRules.map((activation) => [
      activation.rule.id,
      activation.alpha.toFixed(3),
      activation.rule.consequent.term,
      activation.clippedArea.toFixed(2),
    ]),
    startY: rulesStartY + 8,
    margin: { left: marginX, right: marginX },
    headStyles: { fillColor: C.teal, textColor: C.white, halign: "left", fontSize: 10 },
    bodyStyles: { fontSize: 10, textColor: C.ink },
    styles: { lineColor: C.line, lineWidth: 0.4, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { halign: "right", cellWidth: 60 },
      2: { cellWidth: 90 },
      3: { halign: "right", cellWidth: 100 },
    },
    theme: "grid",
    didParseCell: (cell) => {
      if (cell.section === "body" && cell.column.index === 2) {
        const raw = cell.row.raw as unknown;
        const consequent = Array.isArray(raw) ? (raw[2] as string | undefined) : undefined;
        if (consequent && riskColor[consequent]) {
          cell.cell.styles.textColor = riskColor[consequent];
          cell.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  const afterRulesY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? rulesStartY + 200;

  const defuzz = findChart(chartImages, "defuzzification");
  if (defuzz) {
    if (afterRulesY > pageH - 260) {
      doc.addPage();
    }
    const chartY = afterRulesY > pageH - 260 ? 60 : afterRulesY + 24;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(C.ink);
    doc.text("Curva de agregacion y centroide", marginX, chartY);
    const chartW = pageW - marginX * 2;
    const chartH = chartW * 0.5;
    doc.setDrawColor(C.line);
    doc.roundedRect(marginX, chartY + 8, chartW, chartH, 6, 6, "S");
    doc.addImage(defuzz.dataUrl, "PNG", marginX + 4, chartY + 12, chartW - 8, chartH - 8);
  }

  doc.addPage();
  doc.setFillColor(C.teal);
  doc.rect(0, 0, pageW, 14, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(C.ink);
  doc.text("Funciones de pertenencia activadas en este caso", marginX, 50);

  const membershipMap: Array<{ id: ChartImage["id"]; label: string }> = [
    { id: "membership-average", label: academicRiskInputs[0].label },
    { id: "membership-attendance", label: academicRiskInputs[1].label },
    { id: "membership-assignments", label: academicRiskInputs[2].label },
    { id: "membership-participation", label: academicRiskInputs[3].label },
    { id: "membership-exams", label: academicRiskInputs[4].label },
    { id: "membership-risk", label: academicRiskOutput.label },
  ];

  const colW = (pageW - marginX * 2 - 16) / 2;
  const rowH = (pageH - 110) / 3;
  membershipMap.forEach(({ id, label }, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = marginX + col * (colW + 16);
    const y = 70 + row * rowH;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(C.ink);
    doc.text(label, x + 4, y + 12);
    const chart = findChart(chartImages, id);
    if (chart) {
      doc.setDrawColor(C.line);
      doc.roundedRect(x, y + 16, colW, rowH - 26, 4, 4, "S");
      doc.addImage(chart.dataUrl, "PNG", x + 4, y + 20, colW - 8, rowH - 34);
    } else {
      doc.setDrawColor(C.line);
      doc.setFillColor(C.bg);
      doc.roundedRect(x, y + 16, colW, rowH - 26, 4, 4, "FD");
      doc.setFontSize(9);
      doc.setTextColor(C.muted);
      doc.text("Chart no capturado", x + colW / 2, y + 16 + (rowH - 26) / 2, { align: "center" });
    }
  });

  doc.addPage();
  doc.setFillColor(C.teal);
  doc.rect(0, 0, pageW, 14, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(C.ink);
  doc.text("Recomendaciones y siguientes pasos", marginX, 50);

  doc.setFillColor(C.bg);
  doc.setDrawColor(C.line);
  doc.roundedRect(marginX, 70, pageW - marginX * 2, 110, 6, 6, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(C.ink);
  doc.text("Accion sugerida", marginX + 14, 92);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(C.inkSoft);
  doc.text(doc.splitTextToSize(actionableInsight(result), pageW - marginX * 2 - 28), marginX + 14, 112);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(C.ink);
  doc.text("Metricas del centroide", marginX, 210);
  autoTable(doc, {
    body: [
      ["Numerador integral", result.centroidNumerator.toFixed(3)],
      ["Denominador integral", result.centroidDenominator.toFixed(3)],
      ["Centroide y*", result.centroid.toFixed(3)],
      ["Etiqueta dominante", result.label],
      ["Reglas activadas", String(activeRules.length)],
      ["Reglas totales en el sistema", String(result.ruleActivations.length)],
    ],
    startY: 220,
    margin: { left: marginX, right: marginX },
    bodyStyles: { fontSize: 10, textColor: C.ink },
    styles: { lineColor: C.line, lineWidth: 0.4, cellPadding: 6 },
    columnStyles: { 0: { cellWidth: 220, fontStyle: "bold" }, 1: { halign: "right" } },
    theme: "grid",
  });

  const afterMetricsY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 360;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(C.muted);
  doc.text(
    doc.splitTextToSize(
      "Este resumen es un nivel de alerta determinista, no una probabilidad estadistica. La decisión final corresponde al docente y al tutor academico.",
      pageW - marginX * 2,
    ),
    marginX,
    afterMetricsY + 24,
  );

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i += 1) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(C.muted);
    doc.text(
      `Sistema difuso Mamdani  |  Riesgo academico  |  Pagina ${i} de ${totalPages}`,
      pageW / 2,
      pageH - 24,
      { align: "center" },
    );
  }

  void defaultCaseStudy;
  return doc.output("blob");
}
