import type { VariableDefinition } from "./membership";
import { academicRiskRules } from "./rules";

export const academicRiskInputs: VariableDefinition[] = [
  {
    id: "average",
    label: "Promedio actual",
    min: 0,
    max: 100,
    terms: [
      { id: "low", label: "bajo", shape: { type: "trapezoidal", a: 0, b: 0, c: 45, d: 60 } },
      { id: "regular", label: "regular", shape: { type: "triangular", a: 45, b: 65, c: 80 } },
      { id: "high", label: "alto", shape: { type: "trapezoidal", a: 70, b: 85, c: 100, d: 100 } },
    ],
  },
  {
    id: "attendance",
    label: "Asistencia",
    min: 0,
    max: 100,
    terms: [
      { id: "low", label: "baja", shape: { type: "trapezoidal", a: 0, b: 0, c: 55, d: 70 } },
      { id: "medium", label: "media", shape: { type: "triangular", a: 60, b: 75, c: 88 } },
      { id: "high", label: "alta", shape: { type: "trapezoidal", a: 82, b: 92, c: 100, d: 100 } },
    ],
  },
  {
    id: "assignments",
    label: "Entregas realizadas",
    min: 0,
    max: 100,
    terms: [
      { id: "insufficient", label: "insuficientes", shape: { type: "trapezoidal", a: 0, b: 0, c: 45, d: 60 } },
      { id: "partial", label: "parciales", shape: { type: "triangular", a: 50, b: 70, c: 85 } },
      { id: "complete", label: "completas", shape: { type: "trapezoidal", a: 78, b: 90, c: 100, d: 100 } },
    ],
  },
  {
    id: "participation",
    label: "Participacion",
    min: 0,
    max: 100,
    terms: [
      { id: "low", label: "baja", shape: { type: "trapezoidal", a: 0, b: 0, c: 35, d: 50 } },
      { id: "medium", label: "media", shape: { type: "triangular", a: 40, b: 60, c: 78 } },
      { id: "high", label: "alta", shape: { type: "trapezoidal", a: 70, b: 85, c: 100, d: 100 } },
    ],
  },
  {
    id: "exams",
    label: "Examenes recientes",
    min: 0,
    max: 100,
    terms: [
      { id: "deficient", label: "deficientes", shape: { type: "trapezoidal", a: 0, b: 0, c: 45, d: 60 } },
      { id: "regular", label: "regulares", shape: { type: "triangular", a: 50, b: 68, c: 82 } },
      { id: "good", label: "buenos", shape: { type: "trapezoidal", a: 75, b: 88, c: 100, d: 100 } },
    ],
  },
];

export const academicRiskOutput: VariableDefinition = {
  id: "risk",
  label: "Riesgo academico",
  min: 0,
  max: 100,
  terms: [
    { id: "low", label: "bajo", shape: { type: "trapezoidal", a: 0, b: 0, c: 20, d: 35 } },
    { id: "medium", label: "medio", shape: { type: "triangular", a: 25, b: 45, c: 65 } },
    { id: "high", label: "alto", shape: { type: "triangular", a: 55, b: 72, c: 88 } },
    { id: "critical", label: "critico", shape: { type: "trapezoidal", a: 78, b: 90, c: 100, d: 100 } },
  ],
};

export const academicRiskSystem = {
  inputs: academicRiskInputs,
  output: academicRiskOutput,
  rules: academicRiskRules,
};

export type AcademicRiskInputValues = {
  average: number;
  attendance: number;
  assignments: number;
  participation: number;
  exams: number;
};
