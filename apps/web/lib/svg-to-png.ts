export type RasterOptions = {
  widthPx: number;
  heightPx: number;
  background?: string;
  scale?: number;
};

export async function svgElementToPngDataUrl(
  svg: SVGSVGElement,
  options: RasterOptions,
): Promise<{ dataUrl: string; widthPx: number; heightPx: number }> {
  const scale = options.scale ?? 2;
  const widthPx = options.widthPx;
  const heightPx = options.heightPx;

  const cloned = svg.cloneNode(true) as SVGSVGElement;
  if (!cloned.getAttribute("xmlns")) {
    cloned.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  cloned.setAttribute("width", String(widthPx));
  cloned.setAttribute("height", String(heightPx));

  const xml = new XMLSerializer().serializeToString(cloned);
  const svg64 = typeof window !== "undefined"
    ? window.btoa(unescape(encodeURIComponent(xml)))
    : Buffer.from(xml, "utf-8").toString("base64");
  const dataUrlSource = `data:image/svg+xml;base64,${svg64}`;

  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (event) => reject(event);
    image.src = dataUrlSource;
  });

  const canvas = document.createElement("canvas");
  canvas.width = widthPx * scale;
  canvas.height = heightPx * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No se pudo obtener contexto 2D para rasterizar SVG.");
  }
  if (options.background) {
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    widthPx,
    heightPx,
  };
}

export function findFirstSvg(host: HTMLElement | null): SVGSVGElement | null {
  if (!host) return null;
  return host.querySelector("svg");
}
