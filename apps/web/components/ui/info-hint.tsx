"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type InfoHintProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom";
  size?: "sm" | "md";
};

export function InfoHint({ label, children, className, side = "top", size = "sm" }: InfoHintProps) {
  return (
    <span className={cn("group/info relative inline-flex items-center", className)}>
      <button
        type="button"
        aria-label={typeof label === "string" ? label : "ayuda"}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
        )}
      >
        <HelpCircle className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none invisible absolute left-1/2 z-50 w-64 -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-[12px] leading-snug text-popover-foreground opacity-0 shadow-xl transition-all duration-150 group-hover/info:visible group-hover/info:opacity-100 group-focus-within/info:visible group-focus-within/info:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
        )}
      >
        <span className="block font-semibold text-foreground">{label}</span>
        <span className="mt-1 block text-muted-foreground">{children}</span>
      </span>
    </span>
  );
}
