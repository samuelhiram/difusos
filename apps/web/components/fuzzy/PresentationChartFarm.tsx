"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { ChartImage, ChartImageId } from "@academic-risk/presentation";
import {
  academicRiskInputs,
  academicRiskOutput,
  type AcademicRiskInputValues,
  type MamdaniResult,
  type VariableDefinition,
} from "@academic-risk/fuzzy-core";
import { MembershipChartCanvas } from "@/components/fuzzy/MembershipChartCanvas";
import { DefuzzificationChartCanvas } from "@/components/fuzzy/DefuzzificationChartCanvas";
import { findFirstSvg, svgElementToPngDataUrl } from "@/lib/svg-to-png";

const TARGETS: Array<{ id: ChartImageId; variable?: VariableDefinition; isDefuzz?: boolean }> = [
  { id: "membership-average", variable: academicRiskInputs[0] },
  { id: "membership-attendance", variable: academicRiskInputs[1] },
  { id: "membership-assignments", variable: academicRiskInputs[2] },
  { id: "membership-participation", variable: academicRiskInputs[3] },
  { id: "membership-exams", variable: academicRiskInputs[4] },
  { id: "membership-risk", variable: academicRiskOutput },
  { id: "defuzzification", isDefuzz: true },
];

const CHART_WIDTH = 960;
const CHART_HEIGHT = 540;

export type PresentationChartFarmHandle = {
  captureAll: () => Promise<ChartImage[]>;
};

type PresentationChartFarmProps = {
  values: AcademicRiskInputValues;
  result: MamdaniResult;
};

export const PresentationChartFarm = forwardRef<PresentationChartFarmHandle, PresentationChartFarmProps>(
  function PresentationChartFarm({ values, result }, ref) {
    const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        async captureAll() {
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

          const captured: ChartImage[] = [];
          for (const target of TARGETS) {
            const host = containerRefs.current[target.id];
            const svg = findFirstSvg(host);
            if (!svg) continue;
            const { dataUrl, widthPx, heightPx } = await svgElementToPngDataUrl(svg, {
              widthPx: CHART_WIDTH,
              heightPx: CHART_HEIGHT,
              background: "#ffffff",
              scale: 2,
            });
            captured.push({ id: target.id, dataUrl, widthPx, heightPx });
          }
          return captured;
        },
      }),
      [],
    );

    const sampleValues = useMemo(
      () => ({
        average: values.average,
        attendance: values.attendance,
        assignments: values.assignments,
        participation: values.participation,
        exams: values.exams,
      }),
      [values.average, values.attendance, values.assignments, values.participation, values.exams],
    );

    if (!isMounted) {
      return null;
    }

    return (
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: -20000,
          top: -20000,
          width: CHART_WIDTH,
          height: TARGETS.length * (CHART_HEIGHT + 20),
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        {TARGETS.map((target) => {
          const isDefuzz = Boolean(target.isDefuzz);
          const value = target.variable ? sampleValues[target.variable.id as keyof AcademicRiskInputValues] ?? 0 : 0;
          return (
            <div
              key={target.id}
              ref={(node) => {
                containerRefs.current[target.id] = node;
              }}
              style={{ width: CHART_WIDTH, height: CHART_HEIGHT, background: "#ffffff" }}
            >
              {isDefuzz ? (
                <DefuzzificationChartCanvas result={result} />
              ) : target.variable ? (
                <MembershipChartCanvas variable={target.variable} value={value} />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  },
);
