import { centroid, type OutputSample } from "./centroid";
import {
  academicRiskInputs,
  academicRiskOutput,
  academicRiskSystem,
  type AcademicRiskInputValues,
} from "./academic-risk-system";
import { evaluateMembership, fuzzifyVariable } from "./membership";
import type { FuzzyRule } from "./rules";

export type RuleActivation = {
  rule: FuzzyRule;
  alpha: number;
  antecedentDegrees: Array<{
    variable: string;
    term: string;
    degree: number;
  }>;
  clippedArea: number;
};

export type MamdaniResult = {
  inputs: AcademicRiskInputValues;
  fuzzification: Record<string, Record<string, number>>;
  ruleActivations: RuleActivation[];
  outputSamples: OutputSample[];
  centroid: number;
  centroidNumerator: number;
  centroidDenominator: number;
  covered: boolean;
  label: string;
  labelId: string;
};

function classifyRisk(value: number) {
  const fallback = academicRiskOutput.terms[0];
  if (!Number.isFinite(value)) {
    return { id: fallback.id, label: fallback.label, degree: 0 };
  }
  return academicRiskOutput.terms
    .map((term) => ({
      id: term.id,
      label: term.label,
      degree: evaluateMembership(term.shape, value),
    }))
    .sort((a, b) => b.degree - a.degree)[0];
}

export function validateInputs(inputs: AcademicRiskInputValues): string[] {
  const errors: string[] = [];
  for (const variable of academicRiskInputs) {
    const value = inputs[variable.id as keyof AcademicRiskInputValues];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      errors.push(`Input '${variable.id}' debe ser un numero finito (recibido: ${String(value)})`);
      continue;
    }
    if (value < variable.min || value > variable.max) {
      errors.push(`Input '${variable.id}' fuera de rango [${variable.min}, ${variable.max}] (recibido: ${value})`);
    }
  }
  return errors;
}

export function inferAcademicRisk(
  inputs: AcademicRiskInputValues,
  resolution = 1,
): MamdaniResult {
  const errors = validateInputs(inputs);
  if (errors.length > 0) {
    throw new Error(`inferAcademicRisk: inputs invalidos\n  - ${errors.join("\n  - ")}`);
  }
  if (!Number.isFinite(resolution) || resolution <= 0) {
    throw new Error(`inferAcademicRisk: resolution debe ser un numero positivo (recibido: ${resolution})`);
  }

  const fuzzification = Object.fromEntries(
    academicRiskSystem.inputs.map((variable) => [
      variable.id,
      fuzzifyVariable(variable, inputs[variable.id as keyof AcademicRiskInputValues]),
    ]),
  ) as Record<string, Record<string, number>>;

  const ruleActivations: RuleActivation[] = academicRiskSystem.rules.map((rule) => {
    const antecedentDegrees = rule.antecedents.map((antecedent) => {
      const variableTerms = fuzzification[antecedent.variable];
      if (!variableTerms) {
        throw new Error(
          `inferAcademicRisk: regla '${rule.id}' referencia variable desconocida '${antecedent.variable}'`,
        );
      }
      const degree = variableTerms[antecedent.term];
      if (degree === undefined) {
        throw new Error(
          `inferAcademicRisk: regla '${rule.id}' referencia termino desconocido '${antecedent.variable}.${antecedent.term}'`,
        );
      }
      return {
        variable: antecedent.variable,
        term: antecedent.term,
        degree,
      };
    });

    const alpha = antecedentDegrees.length
      ? Math.min(...antecedentDegrees.map((item) => item.degree))
      : 0;
    const consequent = academicRiskOutput.terms.find((term) => term.id === rule.consequent.term);
    const clippedArea = consequent
      ? Array.from({ length: Math.floor((academicRiskOutput.max - academicRiskOutput.min) / resolution) + 1 })
          .map((_, index) => academicRiskOutput.min + index * resolution)
          .reduce((area, x) => area + Math.min(alpha, evaluateMembership(consequent.shape, x)) * resolution, 0)
      : 0;

    return {
      rule,
      alpha,
      antecedentDegrees,
      clippedArea,
    };
  });

  const outputSamples: OutputSample[] = [];

  for (let x = academicRiskOutput.min; x <= academicRiskOutput.max; x += resolution) {
    const sample: OutputSample = { x, aggregated: 0 };

    for (const term of academicRiskOutput.terms) {
      const termAlpha = Math.max(
        0,
        ...ruleActivations
          .filter((activation) => activation.rule.consequent.term === term.id)
          .map((activation) => activation.alpha),
      );
      sample[term.id] = Math.min(termAlpha, evaluateMembership(term.shape, x));
      sample.aggregated = Math.max(sample.aggregated, sample[term.id]);
    }

    outputSamples.push(sample);
  }

  const crisp = centroid(outputSamples);
  const label = classifyRisk(crisp.value);

  return {
    inputs,
    fuzzification,
    ruleActivations,
    outputSamples,
    centroid: crisp.value,
    centroidNumerator: crisp.numerator,
    centroidDenominator: crisp.denominator,
    covered: crisp.covered,
    label: label.label,
    labelId: label.id,
  };
}
