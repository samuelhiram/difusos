"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type GuidedTourStep = {
  target: string;
  title: string;
  body: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right" | "center";
};

type GuidedTourProps = {
  open: boolean;
  steps: GuidedTourStep[];
  onClose: () => void;
};

const PADDING = 12;
const POPOVER_W = 360;
const POPOVER_GAP = 16;

type Rect = { top: number; left: number; width: number; height: number };

function readRect(target: string): Rect | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
  if (!el) return null;
  el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function GuidedTour({ open, steps, onClose }: GuidedTourProps) {
  if (!open || typeof document === "undefined") return null;
  return <TourOverlay steps={steps} onClose={onClose} />;
}

function TourOverlay({ steps, onClose }: { steps: GuidedTourStep[]; onClose: () => void }) {
  const [index, setIndex] = React.useState(0);
  const [rect, setRect] = React.useState<Rect | null>(null);
  const step = steps[index];

  React.useEffect(() => {
    let cancelled = false;
    const update = () => {
      if (cancelled) return;
      if (!step || step.placement === "center") {
        setRect(null);
        return;
      }
      setRect(readRect(step.target));
    };
    const id = window.setTimeout(update, 0);
    const id2 = window.setTimeout(update, 240);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
      window.clearTimeout(id2);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step]);

  if (!step) return null;
  const total = steps.length;
  const isLast = index === total - 1;
  const isFirst = index === 0;

  let popoverStyle: React.CSSProperties;
  let arrowSide: GuidedTourStep["placement"] = step.placement ?? "bottom";
  let cutoutStyle: React.CSSProperties = {};

  if (rect && step.placement !== "center") {
    cutoutStyle = {
      top: rect.top - PADDING,
      left: rect.left - PADDING,
      width: rect.width + PADDING * 2,
      height: rect.height + PADDING * 2,
    };
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const placement = step.placement ?? (rect.top > vh / 2 ? "top" : "bottom");
    arrowSide = placement;
    if (placement === "bottom") {
      const top = rect.top + rect.height + PADDING + POPOVER_GAP;
      const left = Math.max(16, Math.min(vw - POPOVER_W - 16, rect.left + rect.width / 2 - POPOVER_W / 2));
      popoverStyle = { top, left, width: POPOVER_W };
    } else if (placement === "top") {
      const top = rect.top - PADDING - POPOVER_GAP;
      const left = Math.max(16, Math.min(vw - POPOVER_W - 16, rect.left + rect.width / 2 - POPOVER_W / 2));
      popoverStyle = { top, left, width: POPOVER_W, transform: "translateY(-100%)" };
    } else if (placement === "right") {
      const top = Math.max(16, rect.top + rect.height / 2 - 80);
      const left = Math.min(vw - POPOVER_W - 16, rect.left + rect.width + PADDING + POPOVER_GAP);
      popoverStyle = { top, left, width: POPOVER_W };
    } else {
      const top = Math.max(16, rect.top + rect.height / 2 - 80);
      const left = Math.max(16, rect.left - PADDING - POPOVER_GAP);
      popoverStyle = { top, left, width: POPOVER_W, transform: "translateX(-100%)" };
    }
  } else {
    popoverStyle = {
      top: "50%",
      left: "50%",
      width: Math.min(POPOVER_W + 60, (typeof window !== "undefined" ? window.innerWidth : 800) - 32),
      transform: "translate(-50%, -50%)",
    };
    arrowSide = "center";
  }

  const node = (
    <div className="pointer-events-none fixed inset-0 z-[80]">
      <svg className="pointer-events-auto absolute inset-0 h-full w-full" aria-hidden onClick={onClose}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {rect && step.placement !== "center" ? (
              <rect
                x={Math.max(0, rect.left - PADDING)}
                y={Math.max(0, rect.top - PADDING)}
                width={rect.width + PADDING * 2}
                height={rect.height + PADDING * 2}
                rx={12}
                ry={12}
                fill="black"
              />
            ) : null}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(15,23,42,0.55)" mask="url(#tour-mask)" />
      </svg>

      {rect && step.placement !== "center" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-background transition-all duration-200"
          style={cutoutStyle}
        />
      ) : null}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-tour-title"
        className={cn(
          "pointer-events-auto absolute rounded-xl border border-primary/30 bg-card p-4 text-card-foreground shadow-2xl",
          "animate-zoom-in",
        )}
        style={popoverStyle}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Paso {index + 1} de {total}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar tutorial"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 id="guided-tour-title" className="mt-2 text-base font-semibold leading-tight">
          {step.title}
        </h3>
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</div>

        <div className="mt-3 flex items-center gap-1.5" aria-hidden>
          {steps.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : i < index ? "w-3 bg-primary/40" : "w-3 bg-muted",
              )}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <Button variant="ghost" size="default" onClick={onClose} className="text-xs">
            Saltar tour
          </Button>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={isFirst}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              aria-label="Anterior"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {isLast ? (
              <Button onClick={onClose}>Entendido</Button>
            ) : (
              <Button onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}>
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {arrowSide === "bottom" || arrowSide === "top" || arrowSide === "left" || arrowSide === "right" ? (
          <span
            aria-hidden
            className={cn(
              "absolute h-3 w-3 rotate-45 border border-primary/30 bg-card",
              arrowSide === "bottom" && "-top-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0",
              arrowSide === "top" && "-bottom-1.5 left-1/2 -translate-x-1/2 border-l-0 border-t-0",
              arrowSide === "right" && "-left-1.5 top-1/2 -translate-y-1/2 border-b-0 border-r-0",
              arrowSide === "left" && "-right-1.5 top-1/2 -translate-y-1/2 border-l-0 border-t-0",
            )}
          />
        ) : null}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
