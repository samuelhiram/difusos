import fs from "node:fs";
import path from "node:path";
import { defaultCaseStudy, inferAcademicRisk } from "@academic-risk/fuzzy-core";
import { presentationToFile } from "./build-pptx";

const outDir = path.resolve("dist");
const outFile = path.join(outDir, "sistema-difuso-mamdani.pptx");

fs.mkdirSync(outDir, { recursive: true });

const inputs = defaultCaseStudy.inputs;
const result = inferAcademicRisk(inputs, 1);

await presentationToFile(outFile, {
  inputs,
  result,
  caseLabel: defaultCaseStudy.label,
  caseDescription: defaultCaseStudy.description,
});

console.log(`PPTX generado: ${outFile}`);
