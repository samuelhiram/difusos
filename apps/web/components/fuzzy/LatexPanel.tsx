"use client";

import { BlockMath } from "react-katex";
import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LatexPanelProps = {
  result: MamdaniResult;
};

export function LatexPanel({ result }: LatexPanelProps) {
  const liveCentroid = String.raw`y^*=\frac{${result.centroidNumerator.toFixed(3)}}{${result.centroidDenominator.toFixed(3)}}=${result.centroid.toFixed(3)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulas LaTeX del sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <div>
          <p className="mb-2 font-medium">Funcion triangular</p>
          <BlockMath
            math={String.raw`\mu_A(x)=\begin{cases}0,&x\leq a\\ \frac{x-a}{b-a},&a<x\leq b\\ \frac{c-x}{c-b},&b<x<c\\0,&x\geq c\end{cases}`}
          />
        </div>
        <div>
          <p className="mb-2 font-medium">Funcion trapezoidal</p>
          <BlockMath
            math={String.raw`\mu_A(x)=\begin{cases}0,&x\leq a\\ \frac{x-a}{b-a},&a<x\leq b\\1,&b<x\leq c\\ \frac{d-x}{d-c},&c<x<d\\0,&x\geq d\end{cases}`}
          />
        </div>
        <div>
          <p className="mb-2 font-medium">Operador AND e implicacion Mamdani</p>
          <BlockMath
            math={String.raw`\alpha_r=\min(\mu_{A_1}(x_1),\mu_{A_2}(x_2),\ldots,\mu_{A_n}(x_n))`}
          />
          <BlockMath math={String.raw`\mu_{B'_r}(y)=\min(\alpha_r,\mu_{B_r}(y))`} />
        </div>
        <div>
          <p className="mb-2 font-medium">Agregacion y centroide</p>
          <BlockMath math={String.raw`\mu_B(y)=\max_{r=1}^{m}\mu_{B'_r}(y)`} />
          <BlockMath math={String.raw`y^*=\frac{\int y\mu_B(y)\,dy}{\int \mu_B(y)\,dy}`} />
          <BlockMath math={liveCentroid} />
        </div>
      </CardContent>
    </Card>
  );
}
