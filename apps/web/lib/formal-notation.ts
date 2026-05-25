import type { AcademicRiskInputValues } from "@academic-risk/fuzzy-core";

export type InputId = keyof AcademicRiskInputValues;

export const inputOrder: InputId[] = [
  "average",
  "attendance",
  "assignments",
  "participation",
  "exams",
];

export const variableSymbol: Record<InputId, string> = {
  average: "x_1",
  attendance: "x_2",
  assignments: "x_3",
  participation: "x_4",
  exams: "x_5",
};

export const variableName: Record<InputId, string> = {
  average: "promedio",
  attendance: "asistencia",
  assignments: "entregas",
  participation: "participacion",
  exams: "examenes",
};

export const outputSymbol = "y";
export const universeOfDiscourse = "U=[0,100]";

export function symbolFor(variable: string): string {
  return variableSymbol[variable as InputId] ?? variable;
}

export function nameFor(variable: string): string {
  return variableName[variable as InputId] ?? variable;
}

export function inputIndex(variable: string): number {
  const i = inputOrder.indexOf(variable as InputId);
  return i === -1 ? 0 : i + 1;
}
