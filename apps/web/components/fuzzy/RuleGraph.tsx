"use client";

import { useMemo } from "react";
import { Background, Controls, MarkerType, ReactFlow, type Edge, type Node } from "@xyflow/react";
import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RuleGraphProps = {
  result: MamdaniResult;
};

const nodeClass = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm";

export function RuleGraph({ result }: RuleGraphProps) {
  const activeRules = result.ruleActivations.filter((activation) => activation.alpha > 0);

  const nodes = useMemo<Node[]>(
    () => [
      {
        id: "inputs",
        position: { x: 0, y: 95 },
        data: { label: "Entradas numericas" },
        className: nodeClass,
      },
      {
        id: "fuzzification",
        position: { x: 210, y: 95 },
        data: { label: "Fuzzificacion" },
        className: nodeClass,
      },
      {
        id: "degrees",
        position: { x: 420, y: 95 },
        data: { label: "Grados de pertenencia" },
        className: nodeClass,
      },
      {
        id: "rules",
        position: { x: 660, y: 30 },
        data: { label: `Reglas IF-THEN activas: ${activeRules.length}` },
        className: nodeClass,
      },
      {
        id: "alpha",
        position: { x: 660, y: 160 },
        data: { label: "Intensidad alpha por regla" },
        className: nodeClass,
      },
      {
        id: "clipping",
        position: { x: 920, y: 30 },
        data: { label: "Recorte de salidas" },
        className: nodeClass,
      },
      {
        id: "aggregation",
        position: { x: 920, y: 160 },
        data: { label: "Agregacion max" },
        className: nodeClass,
      },
      {
        id: "centroid",
        position: { x: 1160, y: 95 },
        data: { label: `Centroide: ${result.centroid.toFixed(2)}` },
        className: nodeClass,
      },
      {
        id: "result",
        position: { x: 1390, y: 95 },
        data: { label: `Riesgo final: ${result.label}` },
        className: `${nodeClass} border-primary bg-teal-50 font-semibold`,
      },
    ],
    [activeRules.length, result.centroid, result.label],
  );

  const edges = useMemo<Edge[]>(
    () => [
      ["inputs", "fuzzification"],
      ["fuzzification", "degrees"],
      ["degrees", "rules"],
      ["rules", "alpha"],
      ["rules", "clipping"],
      ["alpha", "clipping"],
      ["clipping", "aggregation"],
      ["aggregation", "centroid"],
      ["centroid", "result"],
    ].map(([source, target], index) => ({
      id: `${source}-${target}`,
      source,
      target,
      animated: index >= 2,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: index >= 2 ? "#0f766e" : "#64748b", strokeWidth: 2 },
    })),
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flujo visual del proceso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full rounded-lg border bg-white">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            minZoom={0.35}
            maxZoom={1.4}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
          >
            <Background gap={18} size={1} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}
