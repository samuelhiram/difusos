import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  academicRiskInputs,
  academicRiskOutput,
  academicRiskRules,
  defaultCaseStudy,
  evaluateMembership,
  inferAcademicRisk,
  sampleVariable,
  sensitivityCases,
  type CaseStudy,
  type VariableDefinition,
} from "@academic-risk/fuzzy-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const dataDir = path.join(root, "data");
fs.mkdirSync(dataDir, { recursive: true });

function escapeLatex(value: string) {
  return value
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/#/g, "\\#")
    .replace(/\$/g, "\\$")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}");
}

function writeFile(filename: string, content: string) {
  const out = path.join(dataDir, filename);
  fs.writeFileSync(out, content, "utf8");
  console.log(`  ${filename} -> ${(content.length / 1024).toFixed(1)} KB`);
}

function membershipDat(variable: VariableDefinition): string {
  const samples = sampleVariable(variable, 0.5);
  const header = ["x", ...variable.terms.map((term) => term.id)].join(" ");
  const lines = samples.map((sample) => {
    const cells = [sample.x.toFixed(2), ...variable.terms.map((term) => sample[term.id].toFixed(6))];
    return cells.join(" ");
  });
  return [header, ...lines].join("\n") + "\n";
}

function shapeLabel(shape: VariableDefinition["terms"][number]["shape"]) {
  if (shape.type === "triangular") {
    return `$T(${shape.a},${shape.b},${shape.c})$`;
  }
  return `$Z(${shape.a},${shape.b},${shape.c},${shape.d})$`;
}

function rowsMacro(name: string, rows: string[]): string {
  // Patron estandar: definir macro con las filas, dejar que el longtable la expanda.
  // \input inside longtable rompe el scope; un macro no.
  const body = rows.join("\n  ");
  return `\\providecommand{\\${name}}{}\n\\renewcommand{\\${name}}{%\n  ${body}%\n}%\n`;
}

function variableParamsTable(): string {
  const all: VariableDefinition[] = [...academicRiskInputs, academicRiskOutput];
  const rows: string[] = [];
  for (const variable of all) {
    for (const term of variable.terms) {
      rows.push(
        `${escapeLatex(variable.label)} & ${escapeLatex(term.label)} & ${term.shape.type === "triangular" ? "triangular" : "trapezoidal"} & ${shapeLabel(term.shape)} \\\\`,
      );
    }
  }
  return rowsMacro("VariableParamsRows", rows);
}

function rulesTable(): string {
  return rowsMacro(
    "RulesRows",
    academicRiskRules.map(
      (rule) => `${rule.id} & ${escapeLatex(rule.text)} & ${escapeLatex(rule.consequent.term)} & ${escapeLatex(rule.justification)} \\\\`,
    ),
  );
}

function caseStudyArtifacts(caseStudy: CaseStudy) {
  const result = inferAcademicRisk(caseStudy.inputs, 1);

  const caseSlug = caseStudy.id.replace(/[-_]/g, "");

  const inputRows = rowsMacro(
    `CaseInputs${caseSlug}`,
    (
      [
        ["Promedio actual", caseStudy.inputs.average],
        ["Asistencia", caseStudy.inputs.attendance],
        ["Entregas realizadas", caseStudy.inputs.assignments],
        ["Participacion", caseStudy.inputs.participation],
        ["Examenes recientes", caseStudy.inputs.exams],
      ] as Array<[string, number]>
    ).map(([label, value]) => `${escapeLatex(label)} & ${value} \\\\`),
  );

  const fuzzRows = rowsMacro(
    `CaseFuzz${caseSlug}`,
    Object.entries(result.fuzzification).flatMap(([variableId, degrees]) => {
      const variable = academicRiskInputs.find((item) => item.id === variableId);
      return Object.entries(degrees)
        .filter(([, value]) => value > 0)
        .map(
          ([termId, value]) =>
            `${escapeLatex(variable?.label ?? variableId)} & ${escapeLatex(termId)} & ${value.toFixed(3)} \\\\`,
        );
    }),
  );

  const activeRules = result.ruleActivations
    .filter((activation) => activation.alpha > 0)
    .sort((a, b) => b.alpha - a.alpha);

  const ruleActivationRows = rowsMacro(
    `CaseRules${caseSlug}`,
    activeRules.map(
      (activation) =>
        `${activation.rule.id} & ${activation.alpha.toFixed(3)} & ${escapeLatex(activation.rule.consequent.term)} & ${activation.clippedArea.toFixed(3)} \\\\`,
    ),
  );

  const aggregationHeader = ["x", "agregada", ...academicRiskOutput.terms.map((term) => term.id)].join(" ");
  const aggregationLines = result.outputSamples.map((sample) => {
    return [sample.x.toFixed(2), sample.aggregated.toFixed(6), ...academicRiskOutput.terms.map((term) => (sample[term.id] ?? 0).toFixed(6))].join(" ");
  });
  const aggregationDat = [aggregationHeader, ...aggregationLines].join("\n") + "\n";

  const dominantTerm = academicRiskOutput.terms
    .map((term) => ({ term, mu: evaluateMembership(term.shape, result.centroid) }))
    .sort((a, b) => b.mu - a.mu)[0];

  const summaryTex = [
    `\\newcommand{\\CaseLabel${caseStudy.id.replace(/[-_]/g, "")}}{${escapeLatex(caseStudy.label)}}`,
    `\\newcommand{\\CaseDescription${caseStudy.id.replace(/[-_]/g, "")}}{${escapeLatex(caseStudy.description)}}`,
    `\\newcommand{\\CaseCentroid${caseStudy.id.replace(/[-_]/g, "")}}{${result.centroid.toFixed(2)}}`,
    `\\newcommand{\\CaseLabelId${caseStudy.id.replace(/[-_]/g, "")}}{${escapeLatex(result.label)}}`,
    `\\newcommand{\\CaseDominantMu${caseStudy.id.replace(/[-_]/g, "")}}{${dominantTerm.mu.toFixed(3)}}`,
    `\\newcommand{\\CaseDominantTerm${caseStudy.id.replace(/[-_]/g, "")}}{${escapeLatex(dominantTerm.term.label)}}`,
    `\\newcommand{\\CaseNumerator${caseStudy.id.replace(/[-_]/g, "")}}{${result.centroidNumerator.toFixed(3)}}`,
    `\\newcommand{\\CaseDenominator${caseStudy.id.replace(/[-_]/g, "")}}{${result.centroidDenominator.toFixed(3)}}`,
    `\\newcommand{\\CaseActiveRulesCount${caseStudy.id.replace(/[-_]/g, "")}}{${activeRules.length}}`,
  ].join("\n");

  return { inputRows, fuzzRows, ruleActivationRows, aggregationDat, summaryTex, result };
}

console.log("Generando datos derivados del motor TS:");

for (const variable of [...academicRiskInputs, academicRiskOutput]) {
  writeFile(`membership-${variable.id}.dat`, membershipDat(variable));
}

writeFile("variables-params.tex", variableParamsTable());
writeFile("rules.tex", rulesTable());

const allCases: CaseStudy[] = [defaultCaseStudy, ...sensitivityCases];
const sensitivityRows: string[] = [];

for (const caseStudy of allCases) {
  const artifacts = caseStudyArtifacts(caseStudy);
  writeFile(`case-${caseStudy.id}-inputs.tex`, artifacts.inputRows);
  writeFile(`case-${caseStudy.id}-fuzzification.tex`, artifacts.fuzzRows);
  writeFile(`case-${caseStudy.id}-rule-activations.tex`, artifacts.ruleActivationRows);
  writeFile(`case-${caseStudy.id}-aggregation.dat`, artifacts.aggregationDat);
  writeFile(`case-${caseStudy.id}-summary.tex`, artifacts.summaryTex + "\n");
  sensitivityRows.push(
    `${escapeLatex(caseStudy.label)} & ${artifacts.result.centroid.toFixed(2)} & ${escapeLatex(artifacts.result.label)} & ${artifacts.result.ruleActivations.filter((act) => act.alpha > 0).length} \\\\`,
  );
}

writeFile("sensitivity.tex", rowsMacro("SensitivityRows", sensitivityRows));

console.log("Listo. Re-ejecuta latexmk para tomar los datos actualizados.");
