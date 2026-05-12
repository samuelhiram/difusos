"use client";

import type { AcademicRiskInputValues } from "@academic-risk/fuzzy-core";
import { academicRiskInputs } from "@academic-risk/fuzzy-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

type InputPanelProps = {
  values: AcademicRiskInputValues;
  onValueChange: (key: keyof AcademicRiskInputValues, value: number) => void;
};

export function InputPanel({ values, onValueChange }: InputPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entradas numericas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {academicRiskInputs.map((variable) => {
          const key = variable.id as keyof AcademicRiskInputValues;
          const value = values[key];

          return (
            <div key={variable.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-medium" htmlFor={variable.id}>
                  {variable.label}
                </label>
                <input
                  id={variable.id}
                  type="number"
                  min={variable.min}
                  max={variable.max}
                  value={value}
                  onChange={(event) => onValueChange(key, Number(event.target.value))}
                  className="h-8 w-20 rounded-md border bg-background px-2 text-right text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Slider
                min={variable.min}
                max={variable.max}
                step={1}
                value={[value]}
                onValueChange={([nextValue]) => onValueChange(key, nextValue ?? 0)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{variable.min}</span>
                <span>{variable.max}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
