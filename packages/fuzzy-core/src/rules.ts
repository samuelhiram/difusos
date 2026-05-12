export type InputId = "average" | "attendance" | "assignments" | "participation" | "exams";
export type OutputId = "risk";

export type RuleAntecedent = {
  variable: InputId;
  term: string;
};

export type RuleConsequent = {
  variable: OutputId;
  term: "low" | "medium" | "high" | "critical";
};

export type FuzzyRule = {
  id: string;
  antecedents: RuleAntecedent[];
  consequent: RuleConsequent;
  text: string;
  justification: string;
};

export const academicRiskRules: FuzzyRule[] = [
  {
    id: "R1",
    antecedents: [
      { variable: "average", term: "low" },
      { variable: "attendance", term: "low" },
    ],
    consequent: { variable: "risk", term: "critical" },
    text: "IF promedio es bajo AND asistencia es baja THEN riesgo es critico",
    justification: "Bajo rendimiento junto con poca exposicion a clase indica riesgo extremo.",
  },
  {
    id: "R2",
    antecedents: [
      { variable: "average", term: "low" },
      { variable: "assignments", term: "insufficient" },
    ],
    consequent: { variable: "risk", term: "critical" },
    text: "IF promedio es bajo AND entregas son insuficientes THEN riesgo es critico",
    justification: "La falta de evidencias de trabajo refuerza el riesgo de reprobacion.",
  },
  {
    id: "R3",
    antecedents: [
      { variable: "exams", term: "deficient" },
      { variable: "average", term: "low" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF examenes son deficientes AND promedio es bajo THEN riesgo es alto",
    justification: "Los examenes recientes validan que el bajo promedio no es aislado.",
  },
  {
    id: "R4",
    antecedents: [
      { variable: "attendance", term: "medium" },
      { variable: "average", term: "regular" },
    ],
    consequent: { variable: "risk", term: "medium" },
    text: "IF asistencia es media AND promedio es regular THEN riesgo es medio",
    justification: "Condiciones intermedias producen riesgo moderado.",
  },
  {
    id: "R5",
    antecedents: [
      { variable: "assignments", term: "complete" },
      { variable: "average", term: "high" },
    ],
    consequent: { variable: "risk", term: "low" },
    text: "IF entregas son completas AND promedio es alto THEN riesgo es bajo",
    justification: "Buen promedio y cumplimiento reducen el riesgo academico.",
  },
  {
    id: "R6",
    antecedents: [
      { variable: "participation", term: "high" },
      { variable: "attendance", term: "high" },
      { variable: "exams", term: "good" },
    ],
    consequent: { variable: "risk", term: "low" },
    text: "IF participacion es alta AND asistencia es alta AND examenes son buenos THEN riesgo es bajo",
    justification: "Participacion, asistencia y evaluaciones favorables apuntan a estabilidad.",
  },
  {
    id: "R7",
    antecedents: [
      { variable: "average", term: "regular" },
      { variable: "exams", term: "regular" },
    ],
    consequent: { variable: "risk", term: "medium" },
    text: "IF promedio es regular AND examenes son regulares THEN riesgo es medio",
    justification: "Desempeno aceptable pero no solido mantiene incertidumbre academica.",
  },
  {
    id: "R8",
    antecedents: [
      { variable: "attendance", term: "low" },
      { variable: "assignments", term: "partial" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF asistencia es baja AND entregas son parciales THEN riesgo es alto",
    justification: "Ausencia y trabajo incompleto elevan el riesgo aunque existan entregas.",
  },
  {
    id: "R9",
    antecedents: [
      { variable: "average", term: "high" },
      { variable: "exams", term: "good" },
    ],
    consequent: { variable: "risk", term: "low" },
    text: "IF promedio es alto AND examenes son buenos THEN riesgo es bajo",
    justification: "Rendimiento sostenido y examenes buenos son evidencia de bajo riesgo.",
  },
  {
    id: "R10",
    antecedents: [
      { variable: "average", term: "low" },
      { variable: "participation", term: "low" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF promedio es bajo AND participacion es baja THEN riesgo es alto",
    justification: "Bajo desempeno y poca participacion limitan recuperacion academica.",
  },
];
