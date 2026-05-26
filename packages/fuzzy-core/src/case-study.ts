import type { AcademicRiskInputValues } from "./academic-risk-system";

export type CaseStudy = {
  id: string;
  label: string;
  description: string;
  inputs: AcademicRiskInputValues;
};

export const defaultCaseStudy: CaseStudy = {
  id: "estudiante-tipico-riesgo-alto",
  label: "Estudiante con riesgo alto",
  description:
    "Caso de prueba documentado: promedio bajo-regular, asistencia media, entregas parciales y participacion irregular.",
  inputs: {
    average: 58,
    attendance: 64,
    assignments: 55,
    participation: 48,
    exams: 52,
  },
};

export const sensitivityCases: CaseStudy[] = [
  {
    id: "estudiante-recuperando",
    label: "Estudiante en recuperacion",
    description: "Asistencia y participacion subiendo, examenes recientes mejorando.",
    inputs: { average: 68, attendance: 82, assignments: 72, participation: 65, exams: 70 },
  },
  {
    id: "estudiante-critico",
    label: "Estudiante critico",
    description: "Bajo en todas las dimensiones; intervencion urgente.",
    inputs: { average: 38, attendance: 42, assignments: 30, participation: 25, exams: 35 },
  },
  {
    id: "estudiante-solido",
    label: "Estudiante solido",
    description: "Alto desempeño consistente en todas las variables.",
    inputs: { average: 88, attendance: 95, assignments: 92, participation: 84, exams: 90 },
  },
];
