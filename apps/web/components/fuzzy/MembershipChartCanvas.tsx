"use client";

import { useMemo } from "react";
import type { VariableDefinition } from "@academic-risk/fuzzy-core";
import { sampleVariable } from "@academic-risk/fuzzy-core";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = ["#0f766e", "#d97706", "#dc2626", "#2563eb", "#16a34a"];
const formatTooltipValue = (value: unknown) => (typeof value === "number" ? value.toFixed(3) : String(value ?? ""));

type MembershipChartCanvasProps = {
  variable: VariableDefinition;
  value: number;
};

export function MembershipChartCanvas({ variable, value }: MembershipChartCanvasProps) {
  const data = useMemo(() => sampleVariable(variable, 1), [variable]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -24, right: 18, top: 6, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" domain={[variable.min, variable.max]} tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
        <Tooltip formatter={formatTooltipValue} />
        {variable.terms.map((term, index) => (
          <Line
            key={term.id}
            type="monotone"
            dataKey={term.id}
            name={term.label}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
        <ReferenceLine x={value} stroke="#111827" strokeDasharray="4 4" label="x" />
      </LineChart>
    </ResponsiveContainer>
  );
}
