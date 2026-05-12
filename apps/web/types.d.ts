declare module "react-katex" {
  import type * as React from "react";
  import type { ComponentType } from "react";

  export const InlineMath: ComponentType<{ math: string; renderError?: (error: Error) => React.ReactNode }>;
  export const BlockMath: ComponentType<{ math: string; renderError?: (error: Error) => React.ReactNode }>;
}
