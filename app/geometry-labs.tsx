"use client";

import { useState } from "react";
import type { LessonLabId } from "@/app/course-data";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function GeometryLab({ lab }: { lab: LessonLabId }) {
  switch (lab) {
    case "geo-affine": return <AffineLab />;
    case "geo-interpolate": return <InterpolationLab />;
    case "geo-homogeneous": return <HomogeneousLab />;
    case "geo-homography": return <HomographyLab />;
    case "geo-camera": return <CameraLab />;
    case "geo-features": return <FeaturesLab />;
    case "geo-ransac": return <RansacLab />;
    case "geo-flow": return <FlowLab />;
    case "geo-tiles": return <TileLab />;
    case "geo-shifted-grid": return <ShiftedGridLab />;
    default: return null;
  }
}

function Range({ id, label, value, min, max, onChange }: {
  id: string; label: string; value: number; min: number; max: number; onChange: (value: number) => void;
}) {
  return <div><Label htmlFor={id}>{label}: {value}</Label><Slider id={id} min={min} max={max} step={1} value={[value]} onValueChange={([next]) => onChange(next)} /></div>;
}
function Readout({ values }: { values: [string, string][] }) {
  return <div className="lab-readout lab-readout-grid">{values.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
function DotStage({ points, label }: { points: { x: number; y: number; name: string; kind?: string }[]; label: string }) {
  return <div className="geo-stage" role="img" aria-label={label}>
    <span className="geo-axis-x">x →</span><span className="geo-axis-y">y ↓</span>
    {points.map((p) => <span key={p.name} className={`geo-dot ${p.kind ?? ""}`} style={{ left: `${10 + p.x * 8}%`, top: `${10 + p.y * 8}%` }} title={`${p.name} (${p.x}, ${p.y})`}>{p.name}</span>)}
  </div>;
}
function AffineLab() {
  const [scale, setScale] = useState(2), [shift, setShift] = useState(2);
  const x = 2 * scale + shift, y = 2 * scale;
  return <><DotStage label={`Punto inicial 2,2 y punto transformado ${x},${y}`} points={[{ x: 2, y: 2, name: "A" }, { x, y, name: "A′", kind: "secondary" }]} />
    <div className="math-sliders"><Range id="geo-scale" label="Escala uniforme" value={scale} min={1} max={3} onChange={setScale} /><Range id="geo-shift" label="Traslación x" value={shift} min={-2} max={3} onChange={setShift} /></div>
    <Readout values={[["REGLA", "(x′, y′) = (s·x + tx, s·y)"], ["RESULTADO", `(${x}, ${y})`]]} />
  </>;
}
function InterpolationLab() {
  const [position, setPosition] = useState(3);
  const t = position / 10, nearest = t < 0.5 ? 40 : 220, linear = Math.round(40 * (1 - t) + 220 * t);
  return <><div className="geo-samples"><span style={{ background: "rgb(40 40 40)", color: "white" }}>40</span><strong>posición {t.toFixed(1)}</strong><span style={{ background: "rgb(220 220 220)", color: "black" }}>220</span></div>
    <div className="math-sliders"><Range id="geo-interpolation" label="Posición × 0,1" value={position} min={0} max={10} onChange={setPosition} /></div>
    <Readout values={[["NEAREST", `${nearest} · copia una muestra`], ["LINEAL 1D", `${linear} · mezcla dos muestras`]]} />
    <p className="lab-caption">Esta fila ilustra la interpolación lineal en un eje. Bilineal aplica esa idea en dos ejes y usa cuatro píxeles.</p>
  </>;
}
function HomogeneousLab() {
  const [factor, setFactor] = useState(2);
  return <><DotStage label="Punto euclídeo 3,2" points={[{ x: 3, y: 2, name: "P" }]} />
    <div className="math-sliders"><Range id="geo-factor" label="Factor homogéneo w" value={factor} min={1} max={5} onChange={setFactor} /></div>
    <Readout values={[["TRÍO HOMOGÉNEO", `(${3 * factor}, ${2 * factor}, ${factor})`], ["DIVISIÓN POR w", `(${3 * factor}/${factor}, ${2 * factor}/${factor}) = (3, 2)`]]} />
    <p className="lab-caption">Cambian los tres números, pero todos los tríos representan el mismo punto finito.</p>
  </>;
}
function HomographyLab() {
  const [inset, setInset] = useState(14);
  return <><div className="geo-panel"><div className="geo-document" style={{ clipPath: `polygon(${inset}% 0, ${100 - inset}% 0, 100% 100%, 0 100%)` }}>PLANO</div><span className="geo-arrow">→</span><div className="geo-document rectified">RECTIFICADO</div></div>
    <div className="math-sliders"><Range id="geo-perspective" label="Estrechamiento superior (%)" value={inset} min={0} max={35} onChange={setInset} /></div>
    <Readout values={[["ANCHO SUPERIOR APARENTE", `${100 - inset * 2}%`], ["SUPUESTO", "Las cuatro esquinas pertenecen al mismo plano"]]} />
    <p className="lab-caption">El dibujo muestra el efecto visual de un plano en perspectiva; no calcula una homografía a partir de píxeles.</p>
  </>;
}
function CameraLab() {
  const [depth, setDepth] = useState(4), [focal, setFocal] = useState(6);
  const projected = focal / depth;
  return <><DotStage label={`Proyección de X igual a 1 a x igual a ${projected.toFixed(2)}`} points={[{ x: 1, y: 4, name: "c" }, { x: 1 + projected, y: 4, name: "p", kind: "secondary" }]} />
    <div className="math-sliders"><Range id="geo-depth" label="Profundidad Z" value={depth} min={1} max={8} onChange={setDepth} /><Range id="geo-focal" label="Focal f" value={focal} min={2} max={8} onChange={setFocal} /></div>
    <Readout values={[["PROYECCIÓN IDEAL", `x = f·X/Z = ${focal}·1/${depth}`], ["DISTANCIA AL CENTRO", `${projected.toFixed(2)} unidades de imagen`]]} />
    <p className="lab-caption">Modelo pinhole simplificado, sin distorsión y con centro principal en cero.</p>
  </>;
}
function FeaturesLab() {
  const [kind, setKind] = useState<"flat" | "edge" | "corner">("corner");
  const grids = { flat: [[40,40,40],[40,40,40],[40,40,40]], edge: [[40,200,200],[40,200,200],[40,200,200]], corner: [[40,40,40],[40,200,200],[40,200,200]] };
  return <><div className="geo-choice" role="group" aria-label="Estructura local">{(["flat", "edge", "corner"] as const).map((v) => <button key={v} type="button" aria-pressed={kind===v} onClick={() => setKind(v)}>{({flat:"Uniforme",edge:"Borde",corner:"Esquina"})[v]}</button>)}</div>
    <div className="geo-pixel-grid" role="img" aria-label={`Patrón ${kind}`}>{grids[kind].flat().map((v,i) => <span key={i} style={{ background: `rgb(${v} ${v} ${v})` }} />)}</div>
    <Readout values={[["CAMBIO HORIZONTAL", kind === "flat" ? "bajo" : "alto"], ["CAMBIO VERTICAL", kind === "corner" ? "alto" : "bajo"]]} />
    <p className="lab-caption">Modelo conceptual de respuesta en dos direcciones; Harris calcula gradientes y una matriz de estructura, no esta etiqueta manual.</p>
  </>;
}
function RansacLab() {
  const [threshold, setThreshold] = useState(3);
  const errors = [0.4, 1.2, 2.4, 6.8, 0.9, 8.2, 3.6];
  const count = errors.filter((e) => e <= threshold).length;
  return <><div className="geo-residuals" aria-label="Errores de reproyección de siete correspondencias">{errors.map((e,i) => <span key={i} data-inlier={e<=threshold}>{e.toFixed(1)} px</span>)}</div>
    <div className="math-sliders"><Range id="geo-ransac-threshold" label="Umbral de reproyección (px)" value={threshold} min={1} max={9} onChange={setThreshold} /></div>
    <Readout values={[["INLIERS DEL MODELO FIJO", `${count} / ${errors.length}`], ["ADVERTENCIA", "Más inliers con umbral alto no implica mejor modelo"]]} />
    <p className="lab-caption">Aquí el modelo candidato ya está fijado: modificas solo el criterio de consenso. RANSAC real también vuelve a estimar modelos.</p>
  </>;
}
function FlowLab() {
  const [dx, setDx] = useState(3), [dy, setDy] = useState(1);
  return <><DotStage label={`Punto se mueve ${dx} píxeles en x y ${dy} en y`} points={[{ x: 3, y: 3, name: "t" }, { x: 3 + dx, y: 3 + dy, name: "t+1", kind: "secondary" }]} />
    <div className="math-sliders"><Range id="geo-flow-x" label="Desplazamiento x" value={dx} min={-2} max={5} onChange={setDx} /><Range id="geo-flow-y" label="Desplazamiento y" value={dy} min={-2} max={5} onChange={setDy} /></div>
    <Readout values={[["FLUJO APARENTE", `(${dx}, ${dy}) px/fotograma`], ["MÓDULO", `${Math.hypot(dx,dy).toFixed(2)} px/fotograma`]]} />
  </>;
}
function TileLab() {
  const [size, setSize] = useState(4), [stride, setStride] = useState(3);
  const width = 12, starts: number[] = [];
  for (let x = 0; x + size <= width; x += stride) starts.push(x);
  const counts = Array.from({ length: width }, (_, i) => starts.filter((x) => i >= x && i < x + size).length);
  return <><div className="geo-pixel-row" role="img" aria-label={`Cobertura por píxel: ${counts.join(", ")}`}>{counts.map((v,i)=><span key={i} data-empty={v===0} data-overlap={v>1}>{i}<small>{v}×</small></span>)}</div>
    <div className="math-sliders"><Range id="geo-tile-size" label="Tamaño del tile" value={size} min={2} max={6} onChange={setSize} /><Range id="geo-tile-stride" label="Stride" value={stride} min={1} max={7} onChange={setStride} /></div>
    <Readout values={[["ORÍGENES", starts.join(", ")], ["SOLAPAMIENTO INTERIOR", stride <= size ? `${size-stride} px` : `hueco interior de ${stride-size} px`], ["PÍXELES SIN CUBRIR", `${counts.filter((v)=>v===0).length} / ${width}`]]} />
    <p className="lab-caption">Corte horizontal de una imagen; sin política especial de borde. Observa qué ocurre al cambiar tamaño o stride.</p>
  </>;
}
function ShiftedGridLab() {
  const [start, setStart] = useState(3), [shifted, setShifted] = useState(false);
  const base = [0, 4, 8], alternate = [0, 2, 6, 8], object = [start, start+1, start+2];
  const complete = (origin: number) => start >= origin && start+2 < origin+4;
  const canSeeBase = base.some(complete), canSeeShifted = alternate.some(complete);
  return <><div className="geo-pixel-row" role="img" aria-label={`Objeto en columnas ${object.join(", ")}`}>{Array.from({length:12},(_,i)=><span key={i} data-object={object.includes(i)}>{i}</span>)}</div>
    <div className="math-sliders"><Range id="geo-object-x" label="Primera columna del objeto (3 px)" value={start} min={0} max={9} onChange={setStart} /><div className="geo-switch"><Label htmlFor="geo-second-grid">Añadir segunda rejilla corrida 2 px</Label><Switch id="geo-second-grid" checked={shifted} onCheckedChange={setShifted} /></div></div>
    <Readout values={[["REJILLA BASE · 0, 4, 8", canSeeBase ? "Objeto completo en algún tile" : "Objeto partido en todas las vistas"], ["CON REJILLA CORRIDA", shifted ? (canSeeShifted ? "Objeto completo en algún tile" : "Sigue partido") : "Actívala para comparar"]]} />
    <p className="lab-caption">Tiles de 4 px en una fila de 12. La rejilla adicional aumenta ventanas y puede duplicar predicciones.</p>
  </>;
}
