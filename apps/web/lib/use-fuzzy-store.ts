"use client";

import type { AcademicRiskInputValues } from "@academic-risk/fuzzy-core";
import { create } from "zustand";

const defaults: AcademicRiskInputValues = {
  average: 58,
  attendance: 64,
  assignments: 55,
  participation: 48,
  exams: 52,
};

type FuzzyStore = {
  values: AcademicRiskInputValues;
  setValue: (key: keyof AcademicRiskInputValues, value: number) => void;
  reset: () => void;
};

export const useFuzzyStore = create<FuzzyStore>((set) => ({
  values: defaults,
  setValue: (key, value) =>
    set((state) => ({
      values: {
        ...state.values,
        [key]: Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0)),
      },
    })),
  reset: () => set({ values: defaults }),
}));
