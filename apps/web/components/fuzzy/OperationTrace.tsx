"use client";

import {
  academicRiskInputs,
  academicRiskOutput,
  evaluateMembership,
  type AcademicRiskInputValues,
  type MamdaniResult,
} from "@academic-risk/fuzzy-core";
import { BlockMath } from "react-katex";
import { DefuzzificationChartCanvas } from "@/components/fuzzy/DefuzzificationChartCanvas";

type OperationTraceProps = {
  result: MamdaniResult;
};

const variableLabels: Record<string, string> = {
  average: "promedio",
  attendance: "asistencia",
  assignments: "entregas",
  participation: "participacion",
  exams: "examenes",
};

function round(value: number) {
  return value.toFixed(3);
}

function FormulaBox({ math }: { math: string }) {
  return (
    <div className="my-2 rounded-md border bg-muted/30 px-2 py-1">
      <BlockMath math={math} />
    </div>
  );
}

export function OperationTrace({ result }: OperationTraceProps) {
  const outputDegrees = academicRiskOutput.terms.map((term) => ({
    label: term.label,
    degree: evaluateMembership(term.shape, result.centroid),
  }));

  return (
    <div className="space-y-4 rounded-lg border bg-background p-3 text-sm">
      <div>
        <div className="font-semibold">1. Entradas</div>
        <FormulaBox math={String.raw`X=(x_1,x_2,x_3,x_4,x_5)`} />
        <div className="mt-1 grid gap-1 text-muted-foreground">
          {Object.entries(result.inputs).map(([key, value]) => (
            <div key={key}>
              {variableLabels[key]} = {value.toFixed(0)}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-semibold">2. Fuzzificacion</div>
        <FormulaBox
          math={String.raw`\mu_A(x)=\begin{cases}0,&x\leq a\\ \frac{x-a}{b-a},&a<x\leq b\\ \frac{c-x}{c-b},&b<x<c\\0,&x\geq c\end{cases}`}
        />
        <FormulaBox
          math={String.raw`\mu_A(x)=\begin{cases}0,&x\leq a\\ \frac{x-a}{b-a},&a<x\leq b\\1,&b<x\leq c\\ \frac{d-x}{d-c},&c<x<d\\0,&x\geq d\end{cases}`}
        />
        <div className="mt-1 grid gap-1">
          {academicRiskInputs.map((variable) => (
            <div key={variable.id} className="rounded-md border p-2">
              <div className="font-medium">{variable.label}</div>
              <div className="mt-1 grid gap-1 text-muted-foreground">
                {variable.terms.map((term) => (
                  <div key={term.id}>
                    mu_{term.label}({result.inputs[variable.id as keyof AcademicRiskInputValues].toFixed(0)}) ={" "}
                    {round(result.fuzzification[variable.id][term.id] ?? 0)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-semibold">3. Activacion de reglas con AND = minimo</div>
        <FormulaBox
          math={String.raw`\alpha_r=\min(\mu_{A_1}(x_1),\mu_{A_2}(x_2),\ldots,\mu_{A_n}(x_n))`}
        />
        <div className="mt-1 max-h-72 space-y-2 overflow-auto pr-1">
          {result.ruleActivations.map((activation) => {
            const numericParts = activation.antecedentDegrees.map((item) => round(item.degree)).join(",");
            const textParts = activation.antecedentDegrees
              .map((item) => `mu_${item.term} = ${round(item.degree)}`)
              .join(", ");

            return (
              <div key={activation.rule.id} className="rounded-md border p-2">
                <div className="font-medium">{activation.rule.text}</div>
                <div className="mt-1 text-muted-foreground">
                  {textParts}
                </div>
                <FormulaBox
                  math={String.raw`\alpha_{${activation.rule.id}}=\min(${numericParts})=${round(activation.alpha)}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="font-semibold">4. Implicacion Mamdani</div>
        <FormulaBox math={String.raw`\mu_{B'_r}(y)=\min(\alpha_r,\mu_{B_r}(y))`} />
        <div className="mt-1 grid gap-1 text-muted-foreground">
          {result.ruleActivations
            .filter((activation) => activation.alpha > 0)
            .map((activation) => (
              <div key={activation.rule.id}>
                {activation.rule.id}: salida {activation.rule.consequent.term} recortada con alpha ={" "}
                {round(activation.alpha)}
                <FormulaBox
                  math={String.raw`\mu'_{${activation.rule.consequent.term}}(y)=\min(${round(
                    activation.alpha,
                  )},\mu_{${activation.rule.consequent.term}}(y))`}
                />
              </div>
            ))}
        </div>
      </div>

      <div>
        <div className="font-semibold">5. Agregacion</div>
        <FormulaBox math={String.raw`\mu_B(y)=\max_{r=1}^{m}\mu_{B'_r}(y)`} />
        <div className="mt-1 text-muted-foreground">
          mu_B(y) = max de todas las salidas recortadas activas. Paso numerico: Delta y = 1 en [0,100].
        </div>
      </div>

      <div>
        <div className="font-semibold">6. Centroide</div>
        <FormulaBox math={String.raw`y^*=\frac{\int y\mu_B(y)\,dy}{\int \mu_B(y)\,dy}`} />
        <FormulaBox math={String.raw`y^*\approx\frac{\sum_i y_i\mu_B(y_i)}{\sum_i\mu_B(y_i)}`} />
        <div className="my-2 h-80 rounded-md border bg-white p-2">
          <DefuzzificationChartCanvas result={result} />
        </div>
        <div className="mt-1 rounded-md border bg-muted/40 p-2">
          y* = sum(y mu_B(y)) / sum(mu_B(y)) = {round(result.centroidNumerator)} /{" "}
          {round(result.centroidDenominator)} = <span className="font-semibold">{round(result.centroid)}</span>
        </div>
      </div>

      <div>
        <div className="font-semibold">7. Interpretacion linguistica final</div>
        <FormulaBox math={String.raw`L=\arg\max_k \mu_{B_k}(y^*)`} />
        <div className="mt-1 grid gap-1 text-muted-foreground">
          {outputDegrees.map((item) => (
            <div key={item.label}>
              mu_{item.label}({round(result.centroid)}) = {round(item.degree)}
            </div>
          ))}
          <div className="font-medium text-foreground">Etiqueta dominante: {result.label}</div>
        </div>
      </div>
    </div>
  );
}
