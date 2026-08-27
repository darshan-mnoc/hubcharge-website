"use client";

import { powerAtSoc, STATION_KW } from "@/lib/charging-math";
import type { EvModel } from "@/lib/ev-models";

/**
 * Thumbnail of a car's charging curve with our ceiling drawn across it.
 * Shaded area is what actually reaches the battery here.
 */
export function CurveSpark({
  model,
  className = "",
}: {
  model: EvModel;
  className?: string;
}) {
  const w = 160;
  const h = 44;
  const max = Math.max(model.peakKw, STATION_KW);
  const line: string[] = [];
  const fill: string[] = [];
  for (let soc = 0; soc <= 100; soc += 2) {
    const kw = powerAtSoc(model, soc);
    const px = (soc / 100) * w;
    line.push(`${px.toFixed(1)},${(h - (kw / max) * h).toFixed(1)}`);
    fill.push(`${px.toFixed(1)},${(h - (Math.min(kw, STATION_KW) / max) * h).toFixed(1)}`);
  }
  const capY = h - (STATION_KW / max) * h;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden preserveAspectRatio="none">
      <polygon points={`0,${h} ${fill.join(" ")} ${w},${h}`} fill="#FF7A00" fillOpacity="0.14" />
      <line
        x1="0" x2={w} y1={capY} y2={capY}
        stroke="#B34D00" strokeWidth="1" strokeDasharray="3 3"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={line.join(" ")}
        fill="none" stroke="#0A192F" strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
