import { centroid, type OutputSample } from "./centroid";
import {
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
  label: string;
  labelId: string;
};

function classifyRisk(value: number) {
  return academicRiskOutput.terms
    .map((term) => ({
      id: term.id,
      label: term.label,
      degree: evaluateMembership(term.shape, value),
    }))
    .sort((a, b) => b.degree - a.degree)[0];
}

export function inferAcademicRisk(
  inputs: AcademicRiskInputValues,
  resolution = 1,
): MamdaniResult {
  const fuzzification = Object.fromEntries(
    academicRiskSystem.inputs.map((variable) => [
      variable.id,
      fuzzifyVariable(variable, inputs[variable.id as keyof AcademicRiskInputValues]),
    ]),
  ) as Record<string, Record<string, number>>;

  const ruleActivations: RuleActivation[] = academicRiskSystem.rules.map((rule) => {
    const antecedentDegrees = rule.antecedents.map((antecedent) => ({
      variable: antecedent.variable,
      term: antecedent.term,
      degree: fuzzification[antecedent.variable][antecedent.term] ?? 0,
    }));

    const alpha = Math.min(...antecedentDegrees.map((item) => item.degree));
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
    label: label.label,
    labelId: label.id,
  };
}
