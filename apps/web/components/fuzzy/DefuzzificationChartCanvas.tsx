"use client";

import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const outputColors: Record<string, string> = {
  low: "#16a34a",
  medium: "#d97706",
  high: "#ea580c",
  critical: "#dc2626",
};
const formatTooltipValue = (value: unknown) => (typeof value === "number" ? value.toFixed(3) : String(value ?? ""));

type DefuzzificationChartCanvasProps = {
  result: MamdaniResult;
};

export function DefuzzificationChartCanvas({ result }: DefuzzificationChartCanvasProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={result.outputSamples} margin={{ left: -24, right: 24, top: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
        <Tooltip formatter={formatTooltipValue} />
        <Area
          type="monotone"
          dataKey="aggregated"
          name="agregada"
          fill="#0f766e"
          fillOpacity={0.3}
          stroke="#0f766e"
          strokeWidth={3}
          isAnimationActive
        />
        {Object.entries(outputColors).map(([key, color]) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            strokeWidth={1.6}
            dot={false}
            name={key}
            isAnimationActive={false}
          />
        ))}
        <ReferenceLine
          x={result.centroid}
          stroke="#111827"
          strokeWidth={2}
          label={{ value: `y* ${result.centroid.toFixed(2)}`, position: "insideTopRight" }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
