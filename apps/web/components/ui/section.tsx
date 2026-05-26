import * as React from "react";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  step?: string | number;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  tone?: "default" | "primary" | "accent" | "muted";
  dense?: boolean;
};

const toneStyles: Record<NonNullable<SectionProps["tone"]>, string> = {
  default: "border-border/70 bg-card",
  primary: "border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card",
  accent: "border-accent/30 bg-gradient-to-br from-accent/5 via-card to-card",
  muted: "border-border/60 bg-muted/40",
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, step, icon, title, description, actions, tone = "default", dense = false, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        "group rounded-xl border shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,118,110,0.18)] transition-shadow hover:shadow-[0_1px_0_rgba(15,23,42,0.05),0_16px_30px_-16px_rgba(15,118,110,0.28)]",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      <header
        className={cn(
          "flex items-center justify-between gap-3 border-b border-border/60 px-4",
          dense ? "py-2.5" : "py-3",
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {step !== undefined ? (
            <span
              aria-hidden
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold leading-none text-primary-foreground shadow-sm"
            >
              {step}
            </span>
          ) : null}
          {icon ? (
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-tight tracking-tight text-foreground">{title}</h3>
            {description ? (
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-1.5">{actions}</div> : null}
      </header>
      <div className={cn(dense ? "p-3" : "p-4")}>{children}</div>
    </section>
  ),
);
Section.displayName = "Section";

export type StatProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
};

const statTone: Record<NonNullable<StatProps["tone"]>, string> = {
  default: "border-border/70 bg-background",
  primary: "border-primary/30 bg-primary/5",
  success: "border-emerald-300/60 bg-emerald-50",
  warning: "border-amber-300/70 bg-amber-50",
  danger: "border-red-300/70 bg-red-50",
};

export function Stat({ label, value, hint, tone = "default", className }: StatProps) {
  return (
    <div className={cn("rounded-lg border px-2.5 py-2", statTone[tone], className)}>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-base font-semibold leading-tight text-foreground">{value}</div>
      {hint ? <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export type StepBadgeProps = {
  index: number;
  label: React.ReactNode;
  active?: boolean;
  className?: string;
};

export function StepBadge({ index, label, active, className }: StepBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
          active ? "bg-primary-foreground text-primary" : "bg-muted text-foreground",
        )}
      >
        {index}
      </span>
      <span>{label}</span>
    </div>
  );
}
