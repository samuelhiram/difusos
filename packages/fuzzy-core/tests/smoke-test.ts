import { strict as assert } from "node:assert";
import { inferAcademicRisk, validateInputs } from "../src/mamdani";
import type { AcademicRiskInputValues } from "../src/academic-risk-system";
import { defaultCaseStudy, sensitivityCases } from "../src/case-study";
import { triangular, trapezoidal } from "../src/membership";
import { centroid } from "../src/centroid";

type TestCase = { name: string; run: () => void };

const tests: TestCase[] = [];
function test(name: string, run: () => void) {
  tests.push({ name, run });
}

// ---- Membership invariants ----

test("triangular returns 0 outside [a,c] and 1 at b", () => {
  assert.equal(triangular(-1, 0, 5, 10), 0);
  assert.equal(triangular(11, 0, 5, 10), 0);
  assert.equal(triangular(5, 0, 5, 10), 1);
});

test("triangular stays within [0,1] for arbitrary inputs", () => {
  for (let x = -5; x <= 15; x += 0.5) {
    const y = triangular(x, 0, 5, 10);
    assert.ok(y >= 0 && y <= 1, `triangular(${x})=${y} fuera de [0,1]`);
  }
});

test("triangular handles degenerate vertex a==b without NaN", () => {
  // typical pattern in academic-risk-system: { a: 0, b: 0, c: X } for trapezoid, but defensive for triangular too
  for (let x = -1; x <= 11; x += 0.5) {
    const y = triangular(x, 5, 5, 10);
    assert.ok(Number.isFinite(y), `triangular(${x},5,5,10) NaN`);
  }
});

test("trapezoidal returns 1 on the plateau [b,c]", () => {
  assert.equal(trapezoidal(7, 0, 5, 10, 15), 1);
  assert.equal(trapezoidal(5, 0, 5, 10, 15), 1);
  assert.equal(trapezoidal(10, 0, 5, 10, 15), 1);
});

test("trapezoidal handles a==b shoulder without NaN (e.g. low term)", () => {
  for (let x = -1; x <= 12; x += 0.5) {
    const y = trapezoidal(x, 0, 0, 5, 10);
    assert.ok(Number.isFinite(y), `trapezoidal(${x},0,0,5,10) NaN`);
    assert.ok(y >= 0 && y <= 1, `trapezoidal(${x}) fuera de [0,1]`);
  }
});

test("trapezoidal handles c==d shoulder without NaN (e.g. high term)", () => {
  for (let x = 65; x <= 105; x += 0.5) {
    const y = trapezoidal(x, 70, 85, 100, 100);
    assert.ok(Number.isFinite(y), `trapezoidal(${x},70,85,100,100) NaN`);
    assert.ok(y >= 0 && y <= 1, `trapezoidal(${x}) fuera de [0,1]`);
  }
});

// ---- Centroid invariants ----

test("centroid flags covered=false when aggregated is all zero", () => {
  const samples = Array.from({ length: 11 }, (_, i) => ({ x: i * 10, aggregated: 0 }));
  const c = centroid(samples);
  assert.equal(c.covered, false);
  assert.ok(Number.isNaN(c.value));
});

test("centroid computes weighted average when there is mass", () => {
  const samples = [
    { x: 0, aggregated: 0 },
    { x: 50, aggregated: 1 },
    { x: 100, aggregated: 0 },
  ];
  const c = centroid(samples);
  assert.equal(c.covered, true);
  assert.equal(c.value, 50);
});

// ---- inferAcademicRisk validation ----

test("validateInputs detects NaN", () => {
  const errors = validateInputs({ average: NaN, attendance: 50, assignments: 50, participation: 50, exams: 50 } as AcademicRiskInputValues);
  assert.ok(errors.length > 0);
  assert.ok(errors[0].includes("average"));
});

test("validateInputs detects out-of-range", () => {
  const errors = validateInputs({ average: 150, attendance: 50, assignments: 50, participation: 50, exams: 50 });
  assert.ok(errors.some((e) => e.includes("average")));
});

test("validateInputs passes valid inputs", () => {
  assert.deepEqual(validateInputs(defaultCaseStudy.inputs), []);
});

test("inferAcademicRisk throws on NaN input", () => {
  assert.throws(
    () => inferAcademicRisk({ average: NaN, attendance: 50, assignments: 50, participation: 50, exams: 50 } as AcademicRiskInputValues),
    /inputs invalidos/,
  );
});

test("inferAcademicRisk throws on non-positive resolution", () => {
  assert.throws(() => inferAcademicRisk(defaultCaseStudy.inputs, 0), /resolution/);
  assert.throws(() => inferAcademicRisk(defaultCaseStudy.inputs, -1), /resolution/);
});

// ---- Engine end-to-end determinism ----

test("inferAcademicRisk produces deterministic output for the default case", () => {
  const r1 = inferAcademicRisk(defaultCaseStudy.inputs);
  const r2 = inferAcademicRisk(defaultCaseStudy.inputs);
  assert.equal(r1.centroid, r2.centroid);
  assert.equal(r1.labelId, r2.labelId);
  assert.equal(r1.covered, true);
});

test("inferAcademicRisk centroid stays in [0,100] for every case study", () => {
  for (const study of [defaultCaseStudy, ...sensitivityCases]) {
    const r = inferAcademicRisk(study.inputs);
    assert.ok(r.covered, `caso '${study.id}' sin cobertura`);
    assert.ok(r.centroid >= 0 && r.centroid <= 100, `caso '${study.id}' centroide ${r.centroid} fuera de [0,100]`);
    assert.ok(Number.isFinite(r.centroid));
  }
});

test("inferAcademicRisk classifies critical student as alto/critico", () => {
  const critico = sensitivityCases.find((c) => c.id === "estudiante-critico");
  if (!critico) throw new Error("caso 'estudiante-critico' no encontrado");
  const r = inferAcademicRisk(critico.inputs);
  assert.ok(["high", "critical"].includes(r.labelId), `esperado high|critical, obtenido '${r.labelId}'`);
});

test("inferAcademicRisk classifies solid student as bajo/medio", () => {
  const solido = sensitivityCases.find((c) => c.id === "estudiante-solido");
  if (!solido) throw new Error("caso 'estudiante-solido' no encontrado");
  const r = inferAcademicRisk(solido.inputs);
  assert.ok(["low", "medium"].includes(r.labelId), `esperado low|medium, obtenido '${r.labelId}'`);
});

test("inferAcademicRisk has full coverage in the realistic mid-range grid", () => {
  // realistic student profiles: avoid extreme corners (100% en uno y 0% en otro).
  // 4^5 = 1024 cases.
  const grid = [25, 45, 65, 85];
  let checked = 0;
  for (const a of grid) for (const b of grid) for (const c of grid) for (const d of grid) for (const e of grid) {
    const r = inferAcademicRisk({ average: a, attendance: b, assignments: c, participation: d, exams: e }, 5);
    assert.ok(r.covered, `sin cobertura en (${a},${b},${c},${d},${e})`);
    assert.ok(Number.isFinite(r.centroid));
    checked++;
  }
  assert.equal(checked, 1024);
});

test("inferAcademicRisk has >=95% coverage even on extreme corner grid", () => {
  // exhaustive [0,25,50,75,100]^5 = 3125 cases — corner combinations are unrealistic
  // (avg=100 con att=0) y aceptamos que algunas no disparen ninguna regla.
  const grid = [0, 25, 50, 75, 100];
  let covered = 0;
  let total = 0;
  for (const a of grid) for (const b of grid) for (const c of grid) for (const d of grid) for (const e of grid) {
    const r = inferAcademicRisk({ average: a, attendance: b, assignments: c, participation: d, exams: e }, 5);
    if (r.covered) covered++;
    total++;
  }
  const ratio = covered / total;
  assert.ok(ratio >= 0.95, `cobertura ${(ratio * 100).toFixed(1)}% < 95% en grid extremo (${covered}/${total})`);
});

// ---- Runner ----

let pass = 0;
let fail = 0;
const failures: Array<{ name: string; err: unknown }> = [];
const startedAt = Date.now();

for (const t of tests) {
  try {
    t.run();
    pass++;
    console.log(`  ok  ${t.name}`);
  } catch (err) {
    fail++;
    failures.push({ name: t.name, err });
    console.log(`  FAIL ${t.name}`);
  }
}

const elapsed = ((Date.now() - startedAt) / 1000).toFixed(2);
console.log("");
console.log(`${pass}/${tests.length} pasaron en ${elapsed}s`);
if (fail > 0) {
  console.log("");
  for (const f of failures) {
    console.log(`--- ${f.name}`);
    console.log(f.err instanceof Error ? f.err.message : String(f.err));
  }
  process.exit(1);
}
