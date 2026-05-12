import "@xyflow/react/dist/style.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema Difuso Mamdani | Riesgo Academico",
  description: "Evaluacion difusa Mamdani de riesgo academico en estudiantes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
