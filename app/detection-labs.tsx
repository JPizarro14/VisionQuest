"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { LessonLabId } from "@/app/course-data";

function Readout({ values, note }: { values: [string, string][]; note: string }) {
  return <>
    <div className="lab-readout lab-readout-grid">{values.map(([label, value]) =>
      <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <p className="lab-caption">{note}</p>
  </>;
}

export function DetectionLab({ lab }: { lab: LessonLabId }) {
  if (lab === "det-iou") return <IouLab />;
  if (lab === "det-nms") return <NmsLab />;
  if (lab === "det-tiles") return <TilesLab />;
  return null;
}

function IouLab() {
  const [offset, setOffset] = useState(3);
  // GT [0,10]×[0,10], predicted [offset,offset+10]×[0,10].
  const intersection = 10 * Math.max(0, 10 - offset);
  const union = 200 - intersection;
  const iou = intersection / union;
  return <>
    <div className="math-sliders"><div><Label htmlFor="det-offset">Desplazamiento horizontal: {offset} px</Label>
      <Slider id="det-offset" min={0} max={15} step={1} value={[offset]} onValueChange={([n]) => setOffset(n)} /></div></div>
    <svg viewBox="0 0 240 135" role="img" aria-label={`Caja real de 10 por 10 y predicha desplazada ${offset} píxeles a la derecha; IoU ${iou.toFixed(3)}`} style={{ width: "100%", maxWidth: 420, margin: "14px 0" }}>
      <rect x="12" y="12" width="216" height="111" fill="none" stroke="currentColor" opacity="0.25" />
      <rect x="25" y="27" width="60" height="60" fill="#448e73" fillOpacity="0.45" stroke="#448e73" strokeWidth="2" />
      <rect x={25+offset*6} y="27" width="60" height="60" fill="#b57945" fillOpacity="0.45" stroke="#b57945" strokeWidth="2" />
      <text x="29" y="22" fill="#448e73" fontSize="10">REAL</text>
      <text x={29+offset*6} y="119" fill="#b57945" fontSize="10">PREDICHA</text>
    </svg>
    <Readout values={[["ÁREA GT / PREDICCIÓN", "100 / 100 px²"], ["INTERSECCIÓN", intersection + " px²"], ["UNIÓN", union + " px²"], ["IoU", iou.toFixed(3)]]}
      note="Cajas de 10×10 px; mover solo en x cambia el solapamiento. IoU no es el score del detector." />
  </>;
}

function NmsLab() {
  const [threshold, setThreshold] = useState(50);
  const boxes = [
    { id: "A", score: .95, x: 0 },
    { id: "B", score: .85, x: 2 },
    { id: "C", score: .70, x: 8 },
  ];
  const iou = (a: number, b: number) => {
    const overlap = Math.max(0, 10 - Math.abs(a - b));
    return overlap / (20 - overlap);
  };
  const kept: typeof boxes = [];
  for (const box of boxes) {
    if (kept.every(prev => iou(prev.x, box.x) <= threshold / 100)) kept.push(box);
  }
  return <>
    <div className="math-sliders"><div><Label htmlFor="nms-threshold">Umbral de supresión IoU: {(threshold / 100).toFixed(2)}</Label>
      <Slider id="nms-threshold" min={0} max={100} step={5} value={[threshold]} onValueChange={([n]) => setThreshold(n)} /></div></div>
    <Readout values={[["CANDIDATAS · MISMA CLASE", "A 0,95 · B 0,85 · C 0,70"], ["IoU A–B / A–C", iou(0, 2).toFixed(3) + " / " + iou(0, 8).toFixed(3)], ["CONSERVADAS", kept.map(b => b.id).join(" · ")]]}
      note="Cada caja mide 10×10 px y comparte la misma altura. NMS recorre scores descendentes y suprime si IoU supera estrictamente el umbral." />
  </>;
}

function TilesLab() {
  const [origin, setOrigin] = useState(80);
  const first = [100, 110];
  const second = [origin + 20, origin + 30];
  const overlap = Math.max(0, Math.min(first[1], second[1]) - Math.max(first[0], second[0]));
  const iou = overlap / (20 - overlap);
  return <>
    <div className="math-sliders"><div><Label htmlFor="tile-origin">Origen x del segundo tile: {origin} px</Label>
      <Slider id="tile-origin" min={65} max={110} step={1} value={[origin]} onValueChange={([n]) => setOrigin(n)} /></div></div>
    <Readout values={[["CAJA 1 GLOBAL", "[100, 110)"], ["CAJA 2 LOCAL", "[20, 30)"], ["CAJA 2 GLOBAL", "[" + second.join(", ") + ")"], ["IoU GLOBAL", iou.toFixed(3)]]}
      note="Ambas cajas tienen ancho 10 y altura idéntica de 10. Primero se suma el origen; después se compara o fusiona." />
  </>;
}
