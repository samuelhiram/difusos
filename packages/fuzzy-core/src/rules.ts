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
    justification: "Bajo desempeño y poca participacion limitan recuperacion academica.",
  },
  {
    id: "R11",
    antecedents: [
      { variable: "average", term: "low" },
      { variable: "attendance", term: "medium" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF promedio es bajo AND asistencia es media THEN riesgo es alto",
    justification: "Aun con asistencia regular, el bajo desempeño academico mantiene el riesgo elevado.",
  },
  {
    id: "R12",
    antecedents: [
      { variable: "average", term: "low" },
      { variable: "assignments", term: "partial" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF promedio es bajo AND entregas son parciales THEN riesgo es alto",
    justification: "Cumplimiento parcial no compensa un promedio bajo en el periodo actual.",
  },
  {
    id: "R13",
    antecedents: [
      { variable: "average", term: "low" },
      { variable: "exams", term: "regular" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF promedio es bajo AND examenes son regulares THEN riesgo es alto",
    justification: "Examenes regulares sugieren mejora reciente, pero el historial bajo mantiene el riesgo.",
  },
  {
    id: "R14",
    antecedents: [
      { variable: "average", term: "regular" },
      { variable: "participation", term: "medium" },
    ],
    consequent: { variable: "risk", term: "medium" },
    text: "IF promedio es regular AND participacion es media THEN riesgo es medio",
    justification: "Caso intermedio en dos dimensiones produce riesgo medio por defecto.",
  },
  {
    id: "R15",
    antecedents: [
      { variable: "attendance", term: "high" },
      { variable: "assignments", term: "complete" },
    ],
    consequent: { variable: "risk", term: "low" },
    text: "IF asistencia es alta AND entregas son completas THEN riesgo es bajo",
    justification: "Asistencia y cumplimiento consistentes reducen el riesgo independientemente del promedio actual.",
  },
  {
    id: "R16",
    antecedents: [
      { variable: "attendance", term: "low" },
      { variable: "assignments", term: "insufficient" },
    ],
    consequent: { variable: "risk", term: "critical" },
    text: "IF asistencia es baja AND entregas son insuficientes THEN riesgo es critico",
    justification: "Ausentismo combinado con falta de entregas indica riesgo critico aunque el promedio sea aceptable.",
  },
  {
    id: "R17",
    antecedents: [
      { variable: "exams", term: "deficient" },
      { variable: "assignments", term: "insufficient" },
    ],
    consequent: { variable: "risk", term: "critical" },
    text: "IF examenes son deficientes AND entregas son insuficientes THEN riesgo es critico",
    justification: "Evaluaciones y entregas en cero confirman desconexion academica.",
  },
  {
    id: "R18",
    antecedents: [
      { variable: "participation", term: "low" },
      { variable: "attendance", term: "low" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF participacion es baja AND asistencia es baja THEN riesgo es alto",
    justification: "Aislamiento academico (sin asistir, sin participar) indica riesgo alto.",
  },
  {
    id: "R19",
    antecedents: [
      { variable: "exams", term: "deficient" },
      { variable: "participation", term: "low" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF examenes son deficientes AND participacion es baja THEN riesgo es alto",
    justification: "Evaluaciones bajas con poca participacion sugieren falta de involucramiento.",
  },
  {
    id: "R20",
    antecedents: [
      { variable: "assignments", term: "insufficient" },
      { variable: "participation", term: "low" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF entregas son insuficientes AND participacion es baja THEN riesgo es alto",
    justification: "Ausencia de entregas y de participacion indican abandono progresivo.",
  },
  {
    id: "R21",
    antecedents: [
      { variable: "exams", term: "deficient" },
      { variable: "attendance", term: "medium" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF examenes son deficientes AND asistencia es media THEN riesgo es alto",
    justification: "Asistir sin obtener resultados en evaluaciones sigue siendo riesgo alto.",
  },
  {
    id: "R22",
    antecedents: [
      { variable: "average", term: "regular" },
      { variable: "exams", term: "deficient" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF promedio es regular AND examenes son deficientes THEN riesgo es alto",
    justification: "Promedio sostenido pero evaluaciones recientes deficientes indican deterioro academico.",
  },
  {
    id: "R23",
    antecedents: [
      { variable: "average", term: "high" },
      { variable: "exams", term: "deficient" },
    ],
    consequent: { variable: "risk", term: "medium" },
    text: "IF promedio es alto AND examenes son deficientes THEN riesgo es medio",
    justification: "Promedio alto amortigua, pero examenes recientes en cero exigen seguimiento.",
  },
  {
    id: "R24",
    antecedents: [
      { variable: "average", term: "regular" },
      { variable: "assignments", term: "insufficient" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF promedio es regular AND entregas son insuficientes THEN riesgo es alto",
    justification: "Falta de evidencias de trabajo eleva el riesgo aun con promedio aceptable.",
  },
  {
    id: "R25",
    antecedents: [
      { variable: "average", term: "high" },
      { variable: "attendance", term: "low" },
    ],
    consequent: { variable: "risk", term: "medium" },
    text: "IF promedio es alto AND asistencia es baja THEN riesgo es medio",
    justification: "Buen promedio compensa parcialmente, pero ausentismo amerita seguimiento.",
  },
  {
    id: "R26",
    antecedents: [
      { variable: "average", term: "regular" },
      { variable: "attendance", term: "low" },
    ],
    consequent: { variable: "risk", term: "high" },
    text: "IF promedio es regular AND asistencia es baja THEN riesgo es alto",
    justification: "Sin asistencia consistente, el promedio regular puede deteriorarse rapidamente.",
  },
  {
    id: "R27",
    antecedents: [
      { variable: "average", term: "regular" },
      { variable: "attendance", term: "high" },
    ],
    consequent: { variable: "risk", term: "medium" },
    text: "IF promedio es regular AND asistencia es alta THEN riesgo es medio",
    justification: "Asistencia compensa parcialmente un promedio aceptable pero no sobresaliente.",
  },
  {
    id: "R28",
    antecedents: [
      { variable: "average", term: "high" },
      { variable: "attendance", term: "medium" },
    ],
    consequent: { variable: "risk", term: "low" },
    text: "IF promedio es alto AND asistencia es media THEN riesgo es bajo",
    justification: "Promedio alto con asistencia razonable es indicativo de bajo riesgo.",
  },
  {
    id: "R29",
    antecedents: [
      { variable: "participation", term: "medium" },
      { variable: "attendance", term: "medium" },
    ],
    consequent: { variable: "risk", term: "medium" },
    text: "IF participacion es media AND asistencia es media THEN riesgo es medio",
    justification: "Compromiso intermedio en aula sostiene riesgo en el punto medio.",
  },
  {
    id: "R30",
    antecedents: [
      { variable: "assignments", term: "partial" },
      { variable: "exams", term: "regular" },
    ],
    consequent: { variable: "risk", term: "medium" },
    text: "IF entregas son parciales AND examenes son regulares THEN riesgo es medio",
    justification: "Cumplimiento y resultados intermedios producen riesgo moderado.",
  },
];
