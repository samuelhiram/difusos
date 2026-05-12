"use client";

import dynamic from "next/dynamic";
import type { VariableDefinition } from "@academic-risk/fuzzy-core";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = ["#0f766e", "#d97706", "#dc2626", "#2563eb", "#16a34a"];

const MembershipChartCanvas = dynamic(
  () => import("@/components/fuzzy/MembershipChartCanvas").then((module) => module.MembershipChartCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full rounded-md border bg-muted/30" />,
  },
);

type MembershipChartProps = {
  variable: VariableDefinition;
  value: number;
  degrees: Record<string, number>;
};

export function MembershipChart({ variable, value, degrees }: MembershipChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <span>{variable.label}</span>
          <span className="text-sm font-normal text-muted-foreground">x = {value.toFixed(0)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-56 w-full">
          <MembershipChartCanvas variable={variable} value={value} />
        </div>
        <div className="flex flex-wrap gap-2">
          {variable.terms.map((term, index) => (
            <Badge key={term.id} variant="outline" style={{ borderColor: colors[index % colors.length] }}>
              {term.label}: {(degrees[term.id] ?? 0).toFixed(3)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
