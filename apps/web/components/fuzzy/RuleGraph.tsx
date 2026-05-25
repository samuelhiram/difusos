"use client";

import { useMemo } from "react";
import { Workflow } from "lucide-react";
import { Background, Controls, MarkerType, ReactFlow, type Edge, type Node } from "@xyflow/react";
import type { MamdaniResult } from "@academic-risk/fuzzy-core";
import { Section } from "@/components/ui/section";

type RuleGraphProps = {
  result: MamdaniResult;
};

const nodeClass = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm";

export function RuleGraph({ result }: RuleGraphProps) {
  const activeRules = result.ruleActivations.filter((activation) => activation.alpha > 0);

  const nodes = useMemo<Node[]>(
    () => [
      { id: "inputs", position: { x: 0, y: 95 }, data: { label: "X = (x1..x5)" }, className: nodeClass },
      { id: "fuzzification", position: { x: 210, y: 95 }, data: { label: "Fuzzificacion mu_A(x)" }, className: nodeClass },
      { id: "degrees", position: { x: 420, y: 95 }, data: { label: "Grados mu in [0,1]" }, className: nodeClass },
      { id: "rules", position: { x: 660, y: 30 }, data: { label: `Reglas R_r activas: ${activeRules.length}` }, className: nodeClass },
      { id: "alpha", position: { x: 660, y: 160 }, data: { label: "alpha_r = min(mu_Ai)" }, className: nodeClass },
      { id: "clipping", position: { x: 920, y: 30 }, data: { label: "mu'_B = min(alpha, mu_B)" }, className: nodeClass },
      { id: "aggregation", position: { x: 920, y: 160 }, data: { label: "mu_B = max_r mu'_Br" }, className: nodeClass },
      { id: "centroid", position: { x: 1160, y: 95 }, data: { label: `y* = ${result.centroid.toFixed(2)}` }, className: nodeClass },
      { id: "result", position: { x: 1390, y: 95 }, data: { label: `L = ${result.label}` }, className: `${nodeClass} border-primary bg-teal-50 font-semibold` },
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
    <Section
      data-tour="rule-graph"
      title="Flujo visual del proceso"
      description="Cada nodo es una etapa de la inferencia Mamdani. Las aristas verdes son inferencia en vivo."
      icon={<Workflow className="h-4 w-4" />}
    >
      <div className="h-[360px] w-full rounded-lg border bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.2}
          maxZoom={1.6}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={18} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </Section>
  );
}
