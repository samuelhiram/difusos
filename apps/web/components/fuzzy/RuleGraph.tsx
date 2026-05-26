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
      { id: "inputs", position: { x: 0, y: 95 }, data: { label: "1. Datos del alumno" }, className: nodeClass },
      { id: "fuzzification", position: { x: 210, y: 95 }, data: { label: "2. Convertir a grados" }, className: nodeClass },
      { id: "degrees", position: { x: 420, y: 95 }, data: { label: "3. Que tan bajo/alto" }, className: nodeClass },
      { id: "rules", position: { x: 660, y: 30 }, data: { label: `4. Reglas activas: ${activeRules.length}` }, className: nodeClass },
      { id: "alpha", position: { x: 660, y: 160 }, data: { label: "5. Fuerza de cada regla" }, className: nodeClass },
      { id: "clipping", position: { x: 920, y: 30 }, data: { label: "6. Recortar salidas" }, className: nodeClass },
      { id: "aggregation", position: { x: 920, y: 160 }, data: { label: "7. Unir evidencias" }, className: nodeClass },
      { id: "centroid", position: { x: 1160, y: 95 }, data: { label: `8. Numero final: ${result.centroid.toFixed(2)}` }, className: nodeClass },
      { id: "result", position: { x: 1390, y: 95 }, data: { label: `9. Riesgo ${result.label}` }, className: `${nodeClass} border-primary bg-teal-50 font-semibold` },
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
      title="Mapa del proceso"
      description="Sigue el camino desde datos del alumno hasta etiqueta final."
      icon={<Workflow className="h-4 w-4" />}
    >
      <div className="h-[340px] w-full rounded-lg border bg-white">
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
