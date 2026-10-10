"use client";

import { useMemo, useState } from "react";

import type { LessonLabId } from "@/app/course-data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type MathLabProps = {
  lab: LessonLabId;
};

export function MathLab({ lab }: MathLabProps) {
  if (lab === "structures") return <StructuresLab />;
  if (lab === "broadcasting") return <BroadcastingLab />;
  if (lab === "distances") return <DistancesLab />;
  if (lab === "similarity") return <SimilarityLab />;
  if (lab === "linear-transform") return <LinearTransformLab />;
  if (lab === "matrix-properties") return <MatrixPropertiesLab />;
  if (lab === "pca") return <PcaLab />;
  if (lab === "gradient") return <GradientLab />;
  if (lab === "chain-rule") return <ChainRuleLab />;
  if (lab === "probability") return <ProbabilityLab />;
  if (lab === "statistics") return <StatisticsLab />;
  if (lab === "stability") return <StabilityLab />;
  return null;
}

function LabChoice({
  name,
  values,
  value,
  onChange,
}: {
  name: string;
  values: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="choice-row" aria-label={name}>
      {values.map((option) => (
        <Label key={option.value} htmlFor={`${name}-${option.value}`} className="console-choice">
          <RadioGroupItem id={`${name}-${option.value}`} value={option.value} />
          <span>{option.label}</span>
        </Label>
      ))}
    </RadioGroup>
  );
}

function StructuresLab() {
  const [kind, setKind] = useState("matrix");
  const structures: Record<string, { label: string; shape: string; axes: number; values: number[]; columns: number }> = {
    scalar: { label: "Escalar", shape: "()", axes: 0, values: [7], columns: 1 },
    vector: { label: "Vector", shape: "(4,)", axes: 1, values: [2, 5, 1, 8], columns: 4 },
    matrix: { label: "Matriz", shape: "(3, 4)", axes: 2, values: [2, 5, 1, 8, 4, 3, 9, 6, 7, 2, 0, 5], columns: 4 },
    tensor: { label: "Tensor", shape: "(2, 3, 4)", axes: 3, values: Array.from({ length: 24 }, (_, index) => (index * 3 + 2) % 10), columns: 4 },
  };
  const selected = structures[kind];

  return (
    <>
      <LabChoice
        name="estructura"
        value={kind}
        onChange={setKind}
        values={Object.entries(structures).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className={`structure-stage is-${kind}`}>
        {kind === "tensor" && <span className="stack-label">2 planos</span>}
        <div className="structure-grid" style={{ gridTemplateColumns: `repeat(${selected.columns}, 1fr)` }}>
          {selected.values.map((item, index) => <span key={index}>{item}</span>)}
        </div>
      </div>
      <div className="lab-readout lab-readout-grid">
        <div><span>TIPO</span><strong>{selected.label}</strong></div>
        <div><span>SHAPE</span><strong>{selected.shape}</strong></div>
        <div><span>EJES</span><strong>{selected.axes}</strong></div>
        <div><span>VALORES</span><strong>{selected.values.length}</strong></div>
      </div>
    </>
  );
}

function BroadcastingLab() {
  const cases = [
    { id: "rgb", left: [4, 3], right: [3], result: [4, 3], label: "Filas RGB + color", valid: true },
    { id: "bad", left: [2, 3], right: [3, 2], result: [], label: "Ejes cruzados", valid: false },
    { id: "batch", left: [8, 1, 3], right: [5, 3], result: [8, 5, 3], label: "Lote + cinco colores", valid: true },
    { id: "bias", left: [6, 4, 3], right: [1, 1, 3], result: [6, 4, 3], label: "Imagen + sesgo RGB", valid: true },
  ];
  const [caseId, setCaseId] = useState("rgb");
  const selected = cases.find((item) => item.id === caseId) ?? cases[0];
  const width = Math.max(selected.left.length, selected.right.length);
  const pad = (shape: number[]) => [...Array(width - shape.length).fill(1), ...shape];
  const left = pad(selected.left);
  const right = pad(selected.right);

  return (
    <>
      <LabChoice
        name="broadcast"
        value={caseId}
        onChange={setCaseId}
        values={cases.map((item) => ({ value: item.id, label: item.label }))}
      />
      <div className="broadcast-board">
        <div className="shape-equation">
          <strong>({selected.left.join(", ")})</strong><span>+</span><strong>({selected.right.join(", ")})</strong>
        </div>
        <div className="axis-match" style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}>
          {left.map((axis, index) => {
            const compatible = axis === right[index] || axis === 1 || right[index] === 1;
            return (
              <div key={index} data-compatible={compatible}>
                <span>{axis}</span><small>{compatible ? "↕" : "×"}</small><span>{right[index]}</span>
              </div>
            );
          })}
        </div>
        <div className={`broadcast-result ${selected.valid ? "is-valid" : "is-invalid"}`}>
          <span>{selected.valid ? "RESULTADO" : "INCOMPATIBLE"}</span>
          <strong>{selected.valid ? `(${selected.result.join(", ")})` : "Error de shape"}</strong>
        </div>
      </div>
      <p className="lab-caption">La comparación empieza siempre por el eje situado más a la derecha.</p>
    </>
  );
}

function DistancesLab() {
  const origin = { x: 1, y: 2 };
  const [point, setPoint] = useState({ x: 4, y: 6 });
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  const l1 = Math.abs(dx) + Math.abs(dy);
  const l2 = Math.hypot(dx, dy);
  const linf = Math.max(Math.abs(dx), Math.abs(dy));
  const mapX = (value: number) => 28 + ((value + 5) / 13) * 190;
  const mapY = (value: number) => 158 - ((value + 5) / 13) * 132;

  return (
    <>
      <div className="math-plot">
        <svg viewBox="0 0 240 180" role="img" aria-label="Dos puntos en un plano">
          <path d="M28 92H220 M101 20V160" className="plot-axis" />
          <path d={`M${mapX(origin.x)} ${mapY(origin.y)}H${mapX(point.x)}V${mapY(point.y)}`} className="plot-l1" />
          <line x1={mapX(origin.x)} y1={mapY(origin.y)} x2={mapX(point.x)} y2={mapY(point.y)} className="plot-l2" />
          <circle cx={mapX(origin.x)} cy={mapY(origin.y)} r="5" className="plot-point point-a" />
          <circle cx={mapX(point.x)} cy={mapY(point.y)} r="6" className="plot-point point-b" />
          <text x={mapX(origin.x) + 8} y={mapY(origin.y) - 8}>A (1, 2)</text>
          <text x={mapX(point.x) + 8} y={mapY(point.y) - 8}>B</text>
        </svg>
      </div>
      <div className="math-sliders">
        <div><Label htmlFor="distance-x">B.x = {point.x}</Label><Slider id="distance-x" min={-5} max={8} step={1} value={[point.x]} onValueChange={(value) => setPoint((current) => ({ ...current, x: value[0] }))} /></div>
        <div><Label htmlFor="distance-y">B.y = {point.y}</Label><Slider id="distance-y" min={-5} max={8} step={1} value={[point.y]} onValueChange={(value) => setPoint((current) => ({ ...current, y: value[0] }))} /></div>
      </div>
      <div className="metric-strip">
        <div><span>L1</span><strong>{format(l1)}</strong></div>
        <div><span>L2</span><strong>{format(l2)}</strong></div>
        <div><span>L∞</span><strong>{format(linf)}</strong></div>
      </div>
    </>
  );
}

function SimilarityLab() {
  const [angle, setAngle] = useState(35);
  const [magnitude, setMagnitude] = useState(6);
  const radians = angle * Math.PI / 180;
  const vectorA = { x: 5, y: 0 };
  const vectorB = { x: magnitude * Math.cos(radians), y: magnitude * Math.sin(radians) };
  const dot = vectorA.x * vectorB.x;
  const cosine = magnitude === 0 ? null : Math.cos(radians);
  const center = { x: 120, y: 92 };
  const scale = 12;

  return (
    <>
      <div className="math-plot vector-plot">
        <svg viewBox="0 0 240 180" role="img" aria-label="Dos vectores con ángulo ajustable">
          <path d="M20 92H222 M120 18V162" className="plot-axis" />
          <line x1={center.x} y1={center.y} x2={center.x + vectorA.x * scale} y2={center.y} className="vector-a" />
          <circle cx={center.x + vectorA.x * scale} cy={center.y} r="4" className="point-a" />
          <line x1={center.x} y1={center.y} x2={center.x + vectorB.x * scale} y2={center.y - vectorB.y * scale} className="vector-b" />
          <circle cx={center.x + vectorB.x * scale} cy={center.y - vectorB.y * scale} r="4" className="point-b" />
          <text x="184" y="85">a</text><text x={center.x + vectorB.x * scale + 7} y={center.y - vectorB.y * scale}>b</text>
        </svg>
      </div>
      <div className="math-sliders">
        <div><Label htmlFor="vector-angle">Ángulo de b = {angle}°</Label><Slider id="vector-angle" min={-180} max={180} step={5} value={[angle]} onValueChange={(value) => setAngle(value[0])} /></div>
        <div><Label htmlFor="vector-magnitude">Longitud de b = {magnitude}</Label><Slider id="vector-magnitude" min={0} max={8} step={1} value={[magnitude]} onValueChange={(value) => setMagnitude(value[0])} /></div>
      </div>
      <div className="metric-strip">
        <div><span>a · b</span><strong>{format(dot)}</strong></div>
        <div><span>COSENO</span><strong>{cosine === null ? "indef." : format(cosine)}</strong></div>
        <div><span>ÁNGULO</span><strong>{magnitude === 0 ? "—" : `${angle}°`}</strong></div>
      </div>
    </>
  );
}

function LinearTransformLab() {
  const [transform, setTransform] = useState("rotate");
  const [point, setPoint] = useState({ x: 3, y: 2 });
  const matrices: Record<string, { label: string; values: [[number, number], [number, number]] }> = {
    identity: { label: "Identidad", values: [[1, 0], [0, 1]] },
    scale: { label: "Escala", values: [[1.6, 0], [0, 0.7]] },
    rotate: { label: "Giro 45°", values: [[0.707, -0.707], [0.707, 0.707]] },
    shear: { label: "Cizalla", values: [[1, 0.8], [0, 1]] },
  };
  const matrix = matrices[transform].values;
  const output = {
    x: matrix[0][0] * point.x + matrix[0][1] * point.y,
    y: matrix[1][0] * point.x + matrix[1][1] * point.y,
  };
  const mapX = (value: number) => 120 + value * 16;
  const mapY = (value: number) => 92 - value * 16;

  return (
    <>
      <LabChoice
        name="transformación"
        value={transform}
        onChange={setTransform}
        values={Object.entries(matrices).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className="math-plot">
        <svg viewBox="0 0 240 180" role="img" aria-label="Vector antes y después de una transformación lineal">
          <path d="M20 92H220 M120 15V165" className="plot-axis" />
          <line x1="120" y1="92" x2={mapX(point.x)} y2={mapY(point.y)} className="vector-a" />
          <circle cx={mapX(point.x)} cy={mapY(point.y)} r="5" className="point-a" />
          <line x1="120" y1="92" x2={mapX(output.x)} y2={mapY(output.y)} className="vector-b" />
          <circle cx={mapX(output.x)} cy={mapY(output.y)} r="6" className="point-b" />
          <text x={mapX(point.x) + 7} y={mapY(point.y)}>x</text>
          <text x={mapX(output.x) + 7} y={mapY(output.y)}>Ax</text>
        </svg>
      </div>
      <div className="math-sliders compact-math-sliders">
        <div><Label htmlFor="linear-x">x₁ = {point.x}</Label><Slider id="linear-x" min={-4} max={4} step={1} value={[point.x]} onValueChange={(value) => setPoint((current) => ({ ...current, x: value[0] }))} /></div>
        <div><Label htmlFor="linear-y">x₂ = {point.y}</Label><Slider id="linear-y" min={-4} max={4} step={1} value={[point.y]} onValueChange={(value) => setPoint((current) => ({ ...current, y: value[0] }))} /></div>
      </div>
      <div className="matrix-equation">
        <div className="matrix-box">{matrix.flat().map((value, index) => <span key={index}>{format(value)}</span>)}</div>
        <span>×</span><div className="vector-box"><span>{point.x}</span><span>{point.y}</span></div>
        <span>=</span><div className="vector-box result"><span>{format(output.x)}</span><span>{format(output.y)}</span></div>
      </div>
    </>
  );
}

function MatrixPropertiesLab() {
  const [preset, setPreset] = useState("near");
  const matrices: Record<string, { label: string; values: [[number, number], [number, number]] }> = {
    identity: { label: "Identidad", values: [[1, 0], [0, 1]] },
    rotation: { label: "Giro", values: [[0, -1], [1, 0]] },
    singular: { label: "Singular", values: [[1, 2], [2, 4]] },
    near: { label: "Casi singular", values: [[1, 1], [1, 1.01]] },
  };
  const matrix = matrices[preset].values;
  const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  const rank = Math.abs(det) > 1e-9 ? 2 : matrix.flat().some((value) => Math.abs(value) > 1e-9) ? 1 : 0;
  const condition = conditionNumber2x2(matrix);

  return (
    <>
      <LabChoice
        name="matriz"
        value={preset}
        onChange={setPreset}
        values={Object.entries(matrices).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className="matrix-inspector">
        <div className="matrix-box large">{matrix.flat().map((value, index) => <span key={index}>{value}</span>)}</div>
        <div className={`stability-signal ${rank < 2 ? "is-danger" : condition > 100 ? "is-warning" : "is-safe"}`}>
          <span>{rank < 2 ? "INFORMACIÓN COLAPSADA" : condition > 100 ? "MUY SENSIBLE" : "TRANSFORMACIÓN ESTABLE"}</span>
        </div>
      </div>
      <div className="metric-strip">
        <div><span>det(A)</span><strong>{format(det, 3)}</strong></div>
        <div><span>RANGO</span><strong>{rank}</strong></div>
        <div><span>CONDICIÓN</span><strong>{Number.isFinite(condition) ? format(condition, 1) : "∞"}</strong></div>
      </div>
    </>
  );
}

function PcaLab() {
  const [angle, setAngle] = useState(30);
  const [noise, setNoise] = useState(0.8);
  const analysis = useMemo(() => {
    const radians = angle * Math.PI / 180;
    const along = [-4.5, -3.8, -3, -2.3, -1.6, -0.8, 0, 0.7, 1.5, 2.2, 3, 3.7, 4.4];
    const jitter = [0.2, -0.8, 0.6, -0.3, 0.9, -0.5, 0.1, 0.7, -0.9, 0.4, -0.2, 0.8, -0.4];
    const points = along.map((distance, index) => ({
      x: distance * Math.cos(radians) - jitter[index] * noise * Math.sin(radians),
      y: distance * Math.sin(radians) + jitter[index] * noise * Math.cos(radians),
    }));
    const mean = points.reduce((sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
    mean.x /= points.length;
    mean.y /= points.length;
    const covariance = points.reduce((sum, point) => {
      const x = point.x - mean.x;
      const y = point.y - mean.y;
      return { xx: sum.xx + x * x, yy: sum.yy + y * y, xy: sum.xy + x * y };
    }, { xx: 0, yy: 0, xy: 0 });
    covariance.xx /= points.length;
    covariance.yy /= points.length;
    covariance.xy /= points.length;
    const principalAngle = 0.5 * Math.atan2(2 * covariance.xy, covariance.xx - covariance.yy);
    const trace = covariance.xx + covariance.yy;
    const gap = Math.sqrt((covariance.xx - covariance.yy) ** 2 + 4 * covariance.xy ** 2);
    const first = (trace + gap) / 2;
    const second = (trace - gap) / 2;
    return { points, principalAngle, explained: first / Math.max(first + second, 1e-9) };
  }, [angle, noise]);
  const mapX = (value: number) => 120 + value * 18;
  const mapY = (value: number) => 92 - value * 18;
  const lineX = Math.cos(analysis.principalAngle) * 5.2;
  const lineY = Math.sin(analysis.principalAngle) * 5.2;

  return (
    <>
      <div className="math-plot pca-plot">
        <svg viewBox="0 0 240 180" role="img" aria-label="Nube de puntos y primera componente principal">
          <path d="M20 92H220 M120 15V165" className="plot-axis" />
          <line x1={mapX(-lineX)} y1={mapY(-lineY)} x2={mapX(lineX)} y2={mapY(lineY)} className="pca-line" />
          {analysis.points.map((point, index) => <circle key={index} cx={mapX(point.x)} cy={mapY(point.y)} r="4" className="pca-point" />)}
        </svg>
      </div>
      <div className="math-sliders">
        <div><Label htmlFor="pca-angle">Orientación = {angle}°</Label><Slider id="pca-angle" min={0} max={170} step={5} value={[angle]} onValueChange={(value) => setAngle(value[0])} /></div>
        <div><Label htmlFor="pca-noise">Dispersión lateral = {format(noise, 1)}</Label><Slider id="pca-noise" min={0} max={3} step={0.1} value={[noise]} onValueChange={(value) => setNoise(value[0])} /></div>
      </div>
      <div className="lab-readout lab-readout-grid">
        <div><span>PC1</span><strong>{format(analysis.principalAngle * 180 / Math.PI, 1)}°</strong></div>
        <div><span>VARIANZA EXPLICADA</span><strong>{format(analysis.explained * 100, 1)}%</strong></div>
      </div>
    </>
  );
}

function GradientLab() {
  const [x, setX] = useState(7);
  const [rate, setRate] = useState("0.2");
  const target = 3;
  const loss = (x - target) ** 2;
  const gradient = 2 * (x - target);
  const next = x - Number(rate) * gradient;
  const curve = Array.from({ length: 61 }, (_, index) => {
    const current = -2 + index / 6;
    const y = (current - target) ** 2;
    return `${20 + (current + 2) * 20},${160 - Math.min(y, 36) * 3.7}`;
  }).join(" ");
  const mapX = (value: number) => 20 + (value + 2) * 20;
  const mapY = (value: number) => 160 - Math.min((value - target) ** 2, 36) * 3.7;

  return (
    <>
      <div className="math-plot gradient-plot">
        <svg viewBox="0 0 240 180" role="img" aria-label="Curva de pérdida cuadrática">
          <path d="M18 160H225 M20 18V162" className="plot-axis" />
          <polyline points={curve} className="loss-curve" />
          <line x1={mapX(x)} y1={mapY(x)} x2={mapX(next)} y2={mapY(next)} className="gradient-step" />
          <circle cx={mapX(x)} cy={mapY(x)} r="6" className="point-b" />
          <circle cx={mapX(next)} cy={mapY(next)} r="4" className="next-point" />
        </svg>
      </div>
      <div className="math-sliders">
        <div><Label htmlFor="gradient-x">Parámetro θ = {format(x, 2)}</Label><Slider id="gradient-x" min={-2} max={8} step={0.1} value={[x]} onValueChange={(value) => setX(value[0])} /></div>
      </div>
      <LabChoice
        name="learning-rate"
        value={rate}
        onChange={setRate}
        values={[{ value: "0.05", label: "η 0,05" }, { value: "0.2", label: "η 0,2" }, { value: "0.8", label: "η 0,8" }]}
      />
      <div className="metric-strip">
        <div><span>PÉRDIDA</span><strong>{format(loss)}</strong></div>
        <div><span>GRADIENTE</span><strong>{format(gradient)}</strong></div>
        <div><span>SIGUIENTE θ</span><strong>{format(next)}</strong></div>
      </div>
      <div className="lab-button-row">
        <Button type="button" onClick={() => setX(Math.max(-2, Math.min(8, next)))}>Aplicar un paso</Button>
        <Button type="button" variant="outline" onClick={() => setX(7)}>Reiniciar</Button>
      </div>
    </>
  );
}

function ChainRuleLab() {
  const [x, setX] = useState(1);
  const [weight, setWeight] = useState(2);
  const [branch, setBranch] = useState(false);
  const u = weight * x + 1;
  const y = u ** 2 + (branch ? u : 0);
  const dydu = 2 * u + (branch ? 1 : 0);
  const dudx = weight;
  const dydx = dydu * dudx;

  return (
    <>
      <div className="graph-flow">
        <div><span>x</span><strong>{format(x)}</strong></div>
        <i>× w + 1</i>
        <div><span>u</span><strong>{format(u)}</strong></div>
        <i>{branch ? "u² + u" : "u²"}</i>
        <div><span>y</span><strong>{format(y)}</strong></div>
      </div>
      <div className="math-sliders compact-math-sliders">
        <div><Label htmlFor="chain-x">x = {format(x, 1)}</Label><Slider id="chain-x" min={-3} max={3} step={0.5} value={[x]} onValueChange={(value) => setX(value[0])} /></div>
        <div><Label htmlFor="chain-w">w = {format(weight, 1)}</Label><Slider id="chain-w" min={-3} max={3} step={0.5} value={[weight]} onValueChange={(value) => setWeight(value[0])} /></div>
      </div>
      <Label htmlFor="chain-branch" className="switch-label lab-switch"><Switch id="chain-branch" checked={branch} onCheckedChange={setBranch} /> Añadir una rama paralela +u</Label>
      <div className="backward-flow">
        <span>dy/dx</span>
        <strong>{format(dydx)}</strong>
        <div><code>{format(dydu)}</code><small>dy/du</small></div>
        <b>×</b>
        <div><code>{format(dudx)}</code><small>du/dx</small></div>
      </div>
      <p className="lab-caption">{branch ? "La derivada de u² + u suma las contribuciones 2u y 1 antes de continuar hacia x." : "Cada nodo multiplica el gradiente recibido por su derivada local."}</p>
    </>
  );
}

function ProbabilityLab() {
  const [prevalence, setPrevalence] = useState(2);
  const [sensitivity, setSensitivity] = useState(90);
  const [falsePositiveRate, setFalsePositiveRate] = useState(5);
  const population = 10000;
  const positives = population * prevalence / 100;
  const negatives = population - positives;
  const tp = positives * sensitivity / 100;
  const fn = positives - tp;
  const fp = negatives * falsePositiveRate / 100;
  const tn = negatives - fp;
  const precision = tp / Math.max(tp + fp, 1);

  return (
    <>
      <div className="math-sliders">
        <div><Label htmlFor="prob-prevalence">Defectos reales = {prevalence}%</Label><Slider id="prob-prevalence" min={1} max={30} step={1} value={[prevalence]} onValueChange={(value) => setPrevalence(value[0])} /></div>
        <div><Label htmlFor="prob-sensitivity">Sensibilidad = {sensitivity}%</Label><Slider id="prob-sensitivity" min={50} max={100} step={1} value={[sensitivity]} onValueChange={(value) => setSensitivity(value[0])} /></div>
        <div><Label htmlFor="prob-fpr">Tasa de falsos positivos = {falsePositiveRate}%</Label><Slider id="prob-fpr" min={0} max={20} step={1} value={[falsePositiveRate]} onValueChange={(value) => setFalsePositiveRate(value[0])} /></div>
      </div>
      <div className="confusion-grid">
        <div className="confusion-corner"><span>10.000 casos</span></div>
        <div className="confusion-head">DEFECTO</div><div className="confusion-head">SIN DEFECTO</div>
        <div className="confusion-side">ALARMA</div>
        <div className="confusion-cell is-good"><span>VP</span><strong>{Math.round(tp)}</strong></div>
        <div className="confusion-cell is-alert"><span>FP</span><strong>{Math.round(fp)}</strong></div>
        <div className="confusion-side">SIN ALARMA</div>
        <div className="confusion-cell is-alert"><span>FN</span><strong>{Math.round(fn)}</strong></div>
        <div className="confusion-cell"><span>VN</span><strong>{Math.round(tn)}</strong></div>
      </div>
      <div className="probability-result">
        <span>DE CADA 100 ALARMAS, SERÍAN DEFECTOS</span>
        <strong>{format(precision * 100, 1)}</strong><small>precisión resultante</small>
      </div>
    </>
  );
}

function StatisticsLab() {
  const [outlier, setOutlier] = useState(false);
  const values = outlier ? [8, 9, 10, 10, 11, 12, 40] : [8, 9, 10, 10, 11, 12];
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const deviation = Math.sqrt(variance);

  return (
    <>
      <Label htmlFor="outlier" className="switch-label lab-switch"><Switch id="outlier" checked={outlier} onCheckedChange={setOutlier} /> Añadir el valor extremo 40</Label>
      <div className="stats-bars" aria-label="Valores del conjunto">
        {values.map((value, index) => (
          <div key={index}><span style={{ height: `${Math.max(12, value / 40 * 100)}%` }} /><small>{value}</small></div>
        ))}
      </div>
      <div className="metric-strip">
        <div><span>MEDIA</span><strong>{format(mean)}</strong></div>
        <div><span>MEDIANA</span><strong>{format(median)}</strong></div>
        <div><span>DESV. EST.</span><strong>{format(deviation)}</strong></div>
      </div>
      <div className="zscore-row">
        <span>z-scores</span>
        <div>{values.map((value, index) => <code key={index}>{deviation === 0 ? "0" : format((value - mean) / deviation, 1)}</code>)}</div>
      </div>
      <p className="lab-caption">El outlier desplaza la media y aumenta mucho la dispersión; la mediana apenas se mueve.</p>
    </>
  );
}

function StabilityLab() {
  const [base, setBase] = useState(20);
  const logits = [base, base - 1, base - 2];
  const naiveExp = logits.map((value) => Math.exp(value));
  const naiveSum = naiveExp.reduce((sum, value) => sum + value, 0);
  const naive = naiveExp.map((value) => value / naiveSum);
  const max = Math.max(...logits);
  const stableExp = logits.map((value) => Math.exp(value - max));
  const stableSum = stableExp.reduce((sum, value) => sum + value, 0);
  const stable = stableExp.map((value) => value / stableSum);
  const naiveBroken = naive.some((value) => !Number.isFinite(value));

  return (
    <>
      <div className="math-sliders">
        <div><Label htmlFor="logit-base">Logit mayor = {base}</Label><Slider id="logit-base" min={0} max={1000} step={10} value={[base]} onValueChange={(value) => setBase(value[0])} /></div>
      </div>
      <div className="logit-row">
        {logits.map((value, index) => <div key={index}><span>z{index + 1}</span><strong>{value}</strong></div>)}
      </div>
      <div className="softmax-comparison">
        <div className={naiveBroken ? "is-broken" : ""}>
          <span>SOFTMAX INGENUO</span>
          <strong>{naiveBroken ? "NaN" : naive.map((value) => format(value, 3)).join(" · ")}</strong>
          <small>{naiveBroken ? "exp desbordó a infinito" : "todavía representable"}</small>
        </div>
        <div className="is-stable">
          <span>RESTANDO EL MÁXIMO</span>
          <strong>{stable.map((value) => format(value, 3)).join(" · ")}</strong>
          <small>misma distribución teórica</small>
        </div>
      </div>
      <p className="lab-caption">Mueve el control hacia 1.000: las diferencias entre logits siguen siendo 1, pero el cálculo ingenuo deja de ser representable.</p>
    </>
  );
}

function conditionNumber2x2(matrix: [[number, number], [number, number]]) {
  const [a, b, c, d] = matrix.flat();
  const trace = a * a + b * b + c * c + d * d;
  const determinant = (a * d - b * c) ** 2;
  const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * determinant));
  const largest = (trace + discriminant) / 2;
  const smallest = (trace - discriminant) / 2;
  if (smallest < 1e-12) return Number.POSITIVE_INFINITY;
  return Math.sqrt(largest / smallest);
}

function format(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "∞";
  const rounded = Math.abs(value) < 1e-10 ? 0 : value;
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(rounded);
}
