export type TriangularMembership = {
  type: "triangular";
  a: number;
  b: number;
  c: number;
};

export type TrapezoidalMembership = {
  type: "trapezoidal";
  a: number;
  b: number;
  c: number;
  d: number;
};

export type MembershipShape = TriangularMembership | TrapezoidalMembership;

export type TermDefinition = {
  id: string;
  label: string;
  shape: MembershipShape;
};

export type VariableDefinition = {
  id: string;
  label: string;
  min: number;
  max: number;
  terms: TermDefinition[];
};

export type FuzzifiedVariable = Record<string, number>;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function triangular(x: number, a: number, b: number, c: number): number {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x < b) return clamp01((x - a) / (b - a));
  return clamp01((c - x) / (c - b));
}

export function trapezoidal(x: number, a: number, b: number, c: number, d: number): number {
  if (x < a || x > d) return 0;
  if (a === b && x <= b) return 1;
  if (c === d && x >= c) return 1;
  if (x >= b && x <= c) return 1;
  if (x > a && x < b) return clamp01((x - a) / (b - a));
  if (x > c && x < d) return clamp01((d - x) / (d - c));
  return 0;
}

export function evaluateMembership(shape: MembershipShape, x: number): number {
  if (shape.type === "triangular") {
    return triangular(x, shape.a, shape.b, shape.c);
  }

  return trapezoidal(x, shape.a, shape.b, shape.c, shape.d);
}

export function fuzzifyVariable(variable: VariableDefinition, value: number): FuzzifiedVariable {
  return Object.fromEntries(
    variable.terms.map((term) => [term.id, evaluateMembership(term.shape, value)]),
  );
}

export function sampleVariable(variable: VariableDefinition, step = 1) {
  const samples: Array<Record<string, number>> = [];

  for (let x = variable.min; x <= variable.max; x += step) {
    const sample: Record<string, number> = { x };

    for (const term of variable.terms) {
      sample[term.id] = evaluateMembership(term.shape, x);
    }

    samples.push(sample);
  }

  return samples;
}
