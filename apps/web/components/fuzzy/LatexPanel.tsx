"use client";

import { Sigma } from "lucide-react";
import { BlockMath } from "react-katex";
import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import { Section } from "@/components/ui/section";

type LatexPanelProps = {
  result: MamdaniResult;
};

function FormulaBlock({ label, math }: { label: string; math: string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <BlockMath math={math} />
    </div>
  );
}

export function LatexPanel({ result }: LatexPanelProps) {
  const liveCentroid = String.raw`y^*=\frac{${result.centroidNumerator.toFixed(3)}}{${result.centroidDenominator.toFixed(3)}}=${result.centroid.toFixed(3)}`;

  return (
    <Section
      title="Formulas LaTeX del sistema"
      description="Notacion matematica formal con valores en vivo."
      icon={<Sigma className="h-4 w-4" />}
      tone="muted"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <FormulaBlock
          label="Funcion triangular"
          math={String.raw`\mu_A(x)=\begin{cases}0,&x\leq a\\ \frac{x-a}{b-a},&a<x\leq b\\ \frac{c-x}{c-b},&b<x<c\\0,&x\geq c\end{cases}`}
        />
        <FormulaBlock
          label="Funcion trapezoidal"
          math={String.raw`\mu_A(x)=\begin{cases}0,&x\leq a\\ \frac{x-a}{b-a},&a<x\leq b\\1,&b<x\leq c\\ \frac{d-x}{d-c},&c<x<d\\0,&x\geq d\end{cases}`}
        />
        <FormulaBlock
          label="AND como minimo"
          math={String.raw`\alpha_r=\min(\mu_{A_1}(x_1),\mu_{A_2}(x_2),\ldots,\mu_{A_n}(x_n))`}
        />
        <FormulaBlock label="Implicacion Mamdani" math={String.raw`\mu_{B'_r}(y)=\min(\alpha_r,\mu_{B_r}(y))`} />
        <FormulaBlock label="Agregacion max" math={String.raw`\mu_B(y)=\max_{r=1}^{m}\mu_{B'_r}(y)`} />
        <FormulaBlock label="Centroide (continuo)" math={String.raw`y^*=\frac{\int y\mu_B(y)\,dy}{\int \mu_B(y)\,dy}`} />
        <div className="md:col-span-2 rounded-lg border border-primary/40 bg-primary/5 p-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">Centroide vivo del caso actual</p>
          <BlockMath math={liveCentroid} />
        </div>
      </div>
    </Section>
  );
}
