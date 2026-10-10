"use client";

import { useMemo, useState } from "react";

import type { LessonLabId } from "@/app/course-data";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type FilterLabProps = { lab: LessonLabId };

export function FilterLab({ lab }: FilterLabProps) {
  if (lab === "pixel-arithmetic") return <PixelArithmeticLab />;
  if (lab === "tone-curve") return <ToneCurveLab />;
  if (lab === "masks") return <MaskLab />;
  if (lab === "kernel-window") return <KernelWindowLab />;
  if (lab === "correlation") return <CorrelationLab />;
  if (lab === "linear-smoothing") return <LinearSmoothingLab />;
  if (lab === "edge-preserving") return <EdgePreservingLab />;
  if (lab === "sobel") return <SobelLab />;
  if (lab === "sharpen") return <SharpenLab />;
  if (lab === "canny") return <CannyLab />;
  if (lab === "frequency") return <FrequencyLab />;
  if (lab === "filter-pipeline") return <FilterPipelineLab />;
  return null;
}

function FilterChoice({
  name,
  value,
  values,
  onChange,
}: {
  name: string;
  value: string;
  values: Array<{ value: string; label: string }>;
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

function ImageGrid({
  values,
  label,
  signed = false,
}: {
  values: number[][];
  label: string;
  signed?: boolean;
}) {
  const columns = values[0]?.length ?? 1;
  return (
    <div
      className="filter-image-grid"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      role="img"
      aria-label={label}
    >
      {values.flatMap((row, y) => row.map((value, x) => {
        const display = signed ? clamp(value + 128) : clamp(value);
        return (
          <span
            key={`${x}-${y}`}
            style={{ backgroundColor: `rgb(${display} ${display} ${display})` }}
            title={`${Math.round(value)}`}
          />
        );
      }))}
    </div>
  );
}

function PixelArithmeticLab() {
  const source = [
    [18, 52, 92, 134, 190, 246],
    [28, 66, 108, 152, 208, 250],
    [40, 82, 126, 170, 222, 254],
    [24, 58, 102, 146, 202, 248],
  ];
  const [gain, setGain] = useState(1.2);
  const [offset, setOffset] = useState(20);
  const [wrap, setWrap] = useState(false);
  const raw = source.map((row) => row.map((value) => Math.round(value * gain + offset)));
  const output = raw.map((row) => row.map((value) => (
    wrap ? ((value % 256) + 256) % 256 : clamp(value)
  )));
  const overflow = raw.flat().filter((value) => value < 0 || value > 255).length;

  return (
    <>
      <div className="filter-grid-pair">
        <FigureGrid title="ENTRADA" values={source} />
        <FigureGrid title={wrap ? "UINT8 · MÓDULO" : "SALIDA · CLIP"} values={output} />
      </div>
      <div className="math-sliders compact-math-sliders">
        <div><Label htmlFor="pixel-gain">Ganancia α = {gain.toFixed(1)}</Label><Slider id="pixel-gain" min={0.5} max={2} step={0.1} value={[gain]} onValueChange={(next) => setGain(next[0])} /></div>
        <div><Label htmlFor="pixel-offset">Brillo β = {offset}</Label><Slider id="pixel-offset" min={-80} max={80} step={5} value={[offset]} onValueChange={(next) => setOffset(next[0])} /></div>
      </div>
      <Label htmlFor="overflow-mode" className="lab-switch-row">
        <Switch id="overflow-mode" checked={wrap} onCheckedChange={setWrap} />
        <span>Simular envoltura módulo 256</span>
      </Label>
      <div className="metric-strip">
        <div><span>FUERA DE RANGO</span><strong>{overflow}</strong></div>
        <div><span>POLÍTICA</span><strong>{wrap ? "envolver" : "saturar"}</strong></div>
        <div><span>RANGO FINAL</span><strong>0–255</strong></div>
      </div>
    </>
  );
}

function ToneCurveLab() {
  const [gamma, setGamma] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [brightness, setBrightness] = useState(0);
  const mapTone = (value: number) => {
    const curved = Math.pow(value / 255, gamma);
    return clamp(((curved - 0.5) * contrast + 0.5) * 255 + brightness);
  };
  const points = Array.from({ length: 65 }, (_, index) => {
    const input = index * 255 / 64;
    return `${20 + input * 200 / 255},${220 - mapTone(input) * 200 / 255}`;
  }).join(" ");
  const samples = [0, 32, 64, 128, 192, 224, 255];
  const clipped = samples.filter((value) => mapTone(value) <= 0 || mapTone(value) >= 255).length;

  return (
    <>
      <div className="tone-stage">
        <svg viewBox="0 0 240 240" role="img" aria-label="Curva que asigna intensidades de entrada a intensidades de salida">
          <path d="M20 220H224 M20 220V16" className="plot-axis" />
          <line x1="20" y1="220" x2="220" y2="20" className="tone-identity" />
          <polyline points={points} className="tone-curve-line" />
          <text x="160" y="236">ENTRADA</text><text x="24" y="14">SALIDA</text>
        </svg>
        <div className="tone-samples" aria-label="Ejemplos de mapeo tonal">
          {samples.map((value) => (
            <div key={value}>
              <span style={{ background: `rgb(${value} ${value} ${value})` }}>{value}</span>
              <small>→</small>
              <span style={{ background: `rgb(${mapTone(value)} ${mapTone(value)} ${mapTone(value)})` }}>{Math.round(mapTone(value))}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="math-sliders">
        <div><Label htmlFor="tone-gamma">Gamma = {gamma.toFixed(2)}</Label><Slider id="tone-gamma" min={0.35} max={2.5} step={0.05} value={[gamma]} onValueChange={(next) => setGamma(next[0])} /></div>
        <div><Label htmlFor="tone-contrast">Contraste = {contrast.toFixed(2)}</Label><Slider id="tone-contrast" min={0.5} max={2} step={0.05} value={[contrast]} onValueChange={(next) => setContrast(next[0])} /></div>
        <div><Label htmlFor="tone-brightness">Brillo = {brightness}</Label><Slider id="tone-brightness" min={-80} max={80} step={5} value={[brightness]} onValueChange={(next) => setBrightness(next[0])} /></div>
      </div>
      <p className="lab-caption">Orden del laboratorio: gamma → contraste alrededor del gris medio → brillo → recorte.</p>
      <div className="metric-strip"><div><span>MUESTRAS RECORTADAS</span><strong>{clipped} / {samples.length}</strong></div><div><span>γ &lt; 1</span><strong>levanta medios</strong></div><div><span>γ &gt; 1</span><strong>baja medios</strong></div></div>
    </>
  );
}

function MaskLab() {
  const width = 8;
  const height = 7;
  const [threshold, setThreshold] = useState(132);
  const [mode, setMode] = useState("manual");
  const [lightSlope, setLightSlope] = useState(45);
  const base = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => {
    const object = x >= 2 && x <= 5 && y >= 2 && y <= 5;
    const texture = ((x * 17 + y * 11) % 19) - 9;
    return (object ? 172 : 72) + texture;
  }));
  const observed = base.map((row) => row.map((value, x) => (
    Math.round(clamp(value + lightSlope * (x - (width - 1) / 2) / ((width - 1) / 2)))
  )));
  const histogram = Array(256).fill(0) as number[];
  observed.flat().forEach((value) => { histogram[value] += 1; });
  const total = width * height;
  const totalSum = histogram.reduce((sum, count, value) => sum + count * value, 0);
  let lowerCount = 0;
  let lowerSum = 0;
  let bestVariance = -1;
  let otsuThreshold = 0;
  for (let candidate = 0; candidate < 255; candidate += 1) {
    lowerCount += histogram[candidate];
    lowerSum += candidate * histogram[candidate];
    if (lowerCount === 0 || lowerCount === total) continue;
    const upperCount = total - lowerCount;
    const meanDifference = lowerSum / lowerCount - (totalSum - lowerSum) / upperCount;
    const betweenClassVariance = lowerCount * upperCount * meanDifference ** 2;
    if (betweenClassVariance > bestVariance) {
      bestVariance = betweenClassVariance;
      otsuThreshold = candidate;
    }
  }
  const effectiveThreshold = mode === "otsu" ? otsuThreshold : threshold;
  const selected = observed.map((row) => row.map((value) => value > effectiveThreshold));
  let truePositive = 0;
  let falsePositive = 0;
  let falseNegative = 0;
  selected.forEach((row, y) => row.forEach((value, x) => {
    const truth = x >= 2 && x <= 5 && y >= 2 && y <= 5;
    if (value && truth) truePositive += 1;
    if (value && !truth) falsePositive += 1;
    if (!value && truth) falseNegative += 1;
  }));

  return (
    <>
      <div className="filter-grid-pair">
        <FigureGrid title="IMAGEN OBSERVADA" values={observed} />
        <figure className="filter-figure"><figcaption>MÁSCARA · I &gt; {effectiveThreshold}</figcaption><div className="mask-grid" style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }} role="img" aria-label="Máscara creada por el umbral">{selected.flatMap((row, y) => row.map((active, x) => <span key={`${x}-${y}`} data-active={active} />))}</div></figure>
      </div>
      <FilterChoice name="modo-umbral" value={mode} onChange={setMode} values={[{ value: "manual", label: "Umbral manual" }, { value: "otsu", label: "Otsu automático" }]} />
      <div className="math-sliders compact-math-sliders">
        {mode === "manual" ? <div><Label htmlFor="mask-threshold">Umbral global T = {threshold}</Label><Slider id="mask-threshold" min={60} max={210} step={2} value={[threshold]} onValueChange={(next) => setThreshold(next[0])} /></div> : <p>Otsu ha elegido T = {otsuThreshold} a partir del histograma de los {total} píxeles.</p>}
        <div><Label htmlFor="mask-light">Desnivel de luz = {lightSlope}</Label><Slider id="mask-light" min={0} max={100} step={5} value={[lightSlope]} onValueChange={(next) => setLightSlope(next[0])} /></div>
      </div>
      <div className="metric-strip"><div><span>OBJETO CAPTURADO</span><strong>{truePositive} / 16</strong></div><div><span>FALSOS +</span><strong>{falsePositive}</strong></div><div><span>FALSOS −</span><strong>{falseNegative}</strong></div></div>
      <p className="lab-caption">La silueta real es el rectángulo central de 4×4. Otsu solo ve el histograma: desconoce tanto la silueta como la posición de cada píxel.</p>
    </>
  );
}

function KernelWindowLab() {
  const [kernelId, setKernelId] = useState("mean");
  const kernels: Record<string, { label: string; values: number[][] }> = {
    identity: { label: "Identidad", values: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] },
    mean: { label: "Promedio", values: Array.from({ length: 3 }, () => Array(3).fill(1 / 9)) },
    sharpen: { label: "Enfoque", values: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] },
    edge: { label: "Cambio en x", values: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] },
  };
  const neighborhood = [[20, 25, 34], [24, 118, 202], [28, 126, 210]];
  const kernel = kernels[kernelId].values;
  const products = neighborhood.map((row, y) => row.map((value, x) => value * kernel[y][x]));
  const response = products.flat().reduce((sum, value) => sum + value, 0);
  const weightSum = kernel.flat().reduce((sum, value) => sum + value, 0);

  return (
    <>
      <FilterChoice name="kernel" value={kernelId} onChange={setKernelId} values={Object.entries(kernels).map(([value, item]) => ({ value, label: item.label }))} />
      <div className="kernel-equation">
        <NumericMatrix title="VECINDARIO" values={neighborhood} />
        <strong>×</strong>
        <NumericMatrix title="KERNEL" values={kernel} digits={kernelId === "mean" ? 2 : 0} />
        <strong>→</strong>
        <NumericMatrix title="PRODUCTOS" values={products} digits={kernelId === "mean" ? 1 : 0} />
      </div>
      <div className="metric-strip"><div><span>SUMA DE PESOS</span><strong>{format(weightSum, 2)}</strong></div><div><span>RESPUESTA BRUTA</span><strong>{format(response, 1)}</strong></div><div><span>SI UINT8 + CLIP</span><strong>{Math.round(clamp(response))}</strong></div></div>
      <p className="lab-caption">Cada casilla del vecindario solo se multiplica por la casilla alineada del kernel.</p>
    </>
  );
}

function CorrelationLab() {
  const signal = [20, 20, 30, 70, 150, 210, 210];
  const [position, setPosition] = useState(3);
  const [convolution, setConvolution] = useState(false);
  const [border, setBorder] = useState("replicate");
  const writtenKernel = [-1, 0, 1];
  const effectiveKernel = convolution ? [...writtenKernel].reverse() : writtenKernel;
  const samples = [-1, 0, 1].map((offset) => sample1d(signal, position + offset, border));
  const products = samples.map((value, index) => value * effectiveKernel[index]);
  const response = products.reduce((sum, value) => sum + value, 0);
  const responses = signal.map((_, center) => [-1, 0, 1].reduce((sum, offset, index) => (
    sum + sample1d(signal, center + offset, border) * effectiveKernel[index]
  ), 0));

  return (
    <>
      <div className="signal-strip" role="img" aria-label="Señal de intensidades y posición seleccionada">{signal.map((value, index) => <button type="button" key={index} className={index === position ? "is-active" : ""} onClick={() => setPosition(index)} style={{ height: `${32 + value * 0.35}px` }} aria-label={`Posición ${index}, valor ${value}`}>{value}</button>)}</div>
      <div className="math-sliders"><div><Label htmlFor="correlation-position">Centro = {position}</Label><Slider id="correlation-position" min={0} max={signal.length - 1} step={1} value={[position]} onValueChange={(next) => setPosition(next[0])} /></div></div>
      <div className="correlation-controls">
        <Label htmlFor="convolution-mode" className="lab-switch-row"><Switch id="convolution-mode" checked={convolution} onCheckedChange={setConvolution} /><span>{convolution ? "Convolución · kernel girado" : "Correlación · kernel tal cual"}</span></Label>
        <FilterChoice name="borde" value={border} onChange={setBorder} values={[{ value: "constant", label: "Cero" }, { value: "replicate", label: "Replicar" }, { value: "reflect", label: "Reflejar" }]} />
      </div>
      <div className="kernel-equation one-dimensional"><NumericMatrix title="MUESTRAS" values={[samples]} /><strong>×</strong><NumericMatrix title="K EFECTIVO" values={[effectiveKernel]} /><strong>=</strong><div className="single-response"><span>RESPUESTA</span><strong>{response}</strong></div></div>
      <div className="response-line" aria-label="Respuesta en todas las posiciones">{responses.map((value, index) => <span key={index} data-active={index === position}><small>{index}</small><strong>{value}</strong></span>)}</div>
    </>
  );
}

function LinearSmoothingLab() {
  const [kind, setKind] = useState("gaussian");
  const [size, setSize] = useState(3);
  const source = useMemo(() => makeNoisyEdge(9, false), []);
  const kernel = kind === "box" ? boxKernel(size) : gaussianKernel(size, Math.max(0.8, size / 3));
  const output = applyLinearFilter(source, kernel);
  const sourceStats = regionStats(source);
  const outputStats = regionStats(output);

  return (
    <>
      <FilterChoice name="suavizado" value={kind} onChange={setKind} values={[{ value: "box", label: "Promedio" }, { value: "gaussian", label: "Gaussian" }]} />
      <div className="filter-grid-pair"><FigureGrid title="ENTRADA RUIDOSA" values={source} /><FigureGrid title={`${kind === "box" ? "PROMEDIO" : "GAUSSIAN"} ${size}×${size}`} values={output} /></div>
      <div className="math-sliders"><div><Label htmlFor="smooth-size">Tamaño = {size}×{size}</Label><Slider id="smooth-size" min={3} max={7} step={2} value={[size]} onValueChange={(next) => setSize(next[0])} /></div></div>
      <div className="metric-strip"><div><span>RUIDO IZQUIERDA</span><strong>{format(sourceStats.noise, 1)} → {format(outputStats.noise, 1)}</strong></div><div><span>CONTRASTE BORDE</span><strong>{format(sourceStats.contrast, 0)} → {format(outputStats.contrast, 0)}</strong></div><div><span>SUMA KERNEL</span><strong>{format(kernel.flat().reduce((sum, value) => sum + value, 0), 2)}</strong></div></div>
    </>
  );
}

function FigureGrid({ title, values, signed = false }: { title: string; values: number[][]; signed?: boolean }) {
  return <figure className="filter-figure"><figcaption>{title}</figcaption><ImageGrid values={values} label={title.toLowerCase()} signed={signed} /></figure>;
}

function NumericMatrix({ title, values, digits = 0 }: { title: string; values: number[][]; digits?: number }) {
  return <figure className="numeric-matrix"><figcaption>{title}</figcaption><div style={{ gridTemplateColumns: `repeat(${values[0]?.length ?? 1}, 1fr)` }}>{values.flatMap((row, y) => row.map((value, x) => <span key={`${x}-${y}`}>{format(value, digits)}</span>))}</div></figure>;
}

function EdgePreservingLab() {
  const [kind, setKind] = useState("median");
  const [sigmaColor, setSigmaColor] = useState(35);
  const clean = useMemo(() => makeCleanEdge(9), []);
  const source = useMemo(() => makeNoisyEdge(9, true), []);
  const options: Record<string, number[][]> = {
    mean: applyLinearFilter(source, boxKernel(3)),
    median: medianFilter(source, 3),
    bilateral: bilateralFilter(source, 3, 1.2, sigmaColor),
  };
  const output = options[kind];
  const mae = output.flat().reduce((sum, value, index) => sum + Math.abs(value - clean.flat()[index]), 0) / (9 * 9);
  const contrast = regionStats(output).contrast;

  return (
    <>
      <FilterChoice name="filtro-robusto" value={kind} onChange={setKind} values={[{ value: "mean", label: "Promedio" }, { value: "median", label: "Mediana" }, { value: "bilateral", label: "Bilateral" }]} />
      <div className="filter-grid-pair"><FigureGrid title="BORDE + IMPULSOS" values={source} /><FigureGrid title={`SALIDA · ${kind.toUpperCase()}`} values={output} /></div>
      {kind === "bilateral" && <div className="math-sliders"><div><Label htmlFor="bilateral-color">SigmaColor = {sigmaColor}</Label><Slider id="bilateral-color" min={10} max={140} step={5} value={[sigmaColor]} onValueChange={(next) => setSigmaColor(next[0])} /></div></div>}
      <div className="metric-strip"><div><span>ERROR VS SEÑAL LIMPIA</span><strong>{format(mae, 1)}</strong></div><div><span>CONTRASTE CONSERVADO</span><strong>{format(contrast, 0)}</strong></div><div><span>TIPO</span><strong>{kind === "median" ? "no lineal" : kind === "mean" ? "lineal" : "adaptativo local"}</strong></div></div>
      <p className="lab-caption">El “mejor” resultado cambia con el ruido. Aquí conocemos la señal limpia solo para poder medir el experimento.</p>
    </>
  );
}

function SobelLab() {
  const [orientation, setOrientation] = useState("vertical");
  const image = makeEdgePattern(orientation);
  const patch = image.slice(1, 4).map((row) => row.slice(1, 4));
  const gxKernel = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const gyKernel = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  const gx = dotMatrices(patch, gxKernel);
  const gy = dotMatrices(patch, gyKernel);
  const magnitude = Math.hypot(gx, gy);
  const angle = magnitude === 0 ? 0 : Math.atan2(gy, gx) * 180 / Math.PI;

  return (
    <>
      <FilterChoice name="orientacion-borde" value={orientation} onChange={setOrientation} values={[{ value: "vertical", label: "Borde vertical" }, { value: "horizontal", label: "Borde horizontal" }, { value: "diagonal", label: "Borde diagonal" }, { value: "flat", label: "Zona plana" }]} />
      <div className="sobel-stage">
        <FigureGrid title="PATRÓN 5×5" values={image} />
        <div className="gradient-vector">
          <svg viewBox="0 0 180 180" role="img" aria-label={`Vector gradiente con ángulo ${Math.round(angle)} grados`}>
            <path d="M18 90H162 M90 18V162" className="plot-axis" />
            {magnitude > 0 && <g transform={`rotate(${-angle} 90 90)`}><line x1="90" y1="90" x2="148" y2="90" className="gradient-arrow" /><path d="M148 90l-12-7v14z" className="gradient-head" /></g>}
            <circle cx="90" cy="90" r="4" className="gradient-origin" />
          </svg>
          <small>El vector apunta hacia el aumento de intensidad.</small>
        </div>
      </div>
      <div className="metric-strip"><div><span>Gx</span><strong>{gx}</strong></div><div><span>Gy</span><strong>{gy}</strong></div><div><span>|G|</span><strong>{format(magnitude, 0)}</strong></div><div><span>ÁNGULO</span><strong>{format(angle, 0)}°</strong></div></div>
    </>
  );
}

function SharpenLab() {
  const [amount, setAmount] = useState(1.2);
  const original = useMemo(() => makeSoftFeature(9), []);
  const blurred = applyLinearFilter(original, gaussianKernel(3, 0.9));
  const detail = original.map((row, y) => row.map((value, x) => value - blurred[y][x]));
  const raw = original.map((row, y) => row.map((value, x) => value + amount * detail[y][x]));
  const enhanced = raw.map((row) => row.map(clamp));
  const clipped = raw.flat().filter((value) => value < 0 || value > 255).length;
  const detailPeak = Math.max(...detail.flat().map(Math.abs));

  return (
    <>
      <div className="filter-grid-triple"><FigureGrid title="ORIGINAL" values={original} /><FigureGrid title="DETALLE · +128" values={detail} signed /><FigureGrid title="MEJORADA" values={enhanced} /></div>
      <div className="math-sliders"><div><Label htmlFor="unsharp-amount">Cantidad a = {amount.toFixed(1)}</Label><Slider id="unsharp-amount" min={0} max={4} step={0.1} value={[amount]} onValueChange={(next) => setAmount(next[0])} /></div></div>
      <div className="unsharp-equation"><span>original</span><strong>+</strong><span>{amount.toFixed(1)} × detalle</span><strong>=</strong><span>mejorada</span></div>
      <div className="metric-strip"><div><span>PICO DE DETALLE</span><strong>{format(detailPeak, 1)}</strong></div><div><span>PÍXELES RECORTADOS</span><strong>{clipped}</strong></div><div><span>RIESGO AL SUBIR</span><strong>halo + ruido</strong></div></div>
    </>
  );
}

function CannyLab() {
  const width = 8;
  const [low, setLow] = useState(55);
  const [high, setHigh] = useState(135);
  const strengths = useMemo(() => makeHysteresisMap(width), []);
  const strong = strengths.map((value) => value >= high);
  const eligible = strengths.map((value) => value >= low);
  const connected = connectEligibleToStrong(eligible, strong, width);
  const statuses = strengths.map((value, index) => strong[index] ? "strong" : connected[index] ? "weak" : value >= low ? "isolated" : "discarded");
  const counts = statuses.reduce<Record<string, number>>((acc, status) => ({ ...acc, [status]: (acc[status] ?? 0) + 1 }), {});

  return (
    <>
      <div className="canny-grid" style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }} role="img" aria-label="Mapa de gradiente clasificado por histéresis">{strengths.map((value, index) => <span key={index} data-status={statuses[index]} title={`fuerza ${value}`}>{value}</span>)}</div>
      <div className="canny-legend"><span data-status="strong">Fuerte</span><span data-status="weak">Débil conectado</span><span data-status="isolated">Débil aislado</span><span data-status="discarded">Descartado</span></div>
      <div className="math-sliders compact-math-sliders">
        <div><Label htmlFor="canny-low">Umbral bajo = {low}</Label><Slider id="canny-low" min={20} max={Math.max(25, high - 5)} step={5} value={[Math.min(low, high - 5)]} onValueChange={(next) => setLow(Math.min(next[0], high - 5))} /></div>
        <div><Label htmlFor="canny-high">Umbral alto = {high}</Label><Slider id="canny-high" min={Math.min(210, low + 5)} max={220} step={5} value={[Math.max(high, low + 5)]} onValueChange={(next) => setHigh(Math.max(next[0], low + 5))} /></div>
      </div>
      <div className="metric-strip"><div><span>FUERTES</span><strong>{counts.strong ?? 0}</strong></div><div><span>DÉBILES RESCATADOS</span><strong>{counts.weak ?? 0}</strong></div><div><span>DÉBILES AISLADOS</span><strong>{counts.isolated ?? 0}</strong></div></div>
      <p className="lab-caption">Este tablero comienza después del gradiente y la supresión de no máximos: aquí solo simulamos la histéresis.</p>
    </>
  );
}

function FrequencyLab() {
  const [signalId, setSignalId] = useState("mixed");
  const [cutoff, setCutoff] = useState(4);
  const size = 32;
  const signals: Record<string, number[]> = {
    smooth: Array.from({ length: size }, (_, i) => 128 + 72 * Math.sin(2 * Math.PI * i / size)),
    stripes: Array.from({ length: size }, (_, i) => 128 + 72 * Math.sin(2 * Math.PI * 8 * i / size)),
    mixed: Array.from({ length: size }, (_, i) => 128 + 52 * Math.sin(2 * Math.PI * 2 * i / size) + 28 * Math.sin(2 * Math.PI * 8 * i / size)),
    step: Array.from({ length: size }, (_, i) => i < size / 2 ? 55 : 205),
  };
  const signal = signals[signalId];
  const spectrum = dft(signal);
  const filtered = spectrum.map((item, index) => {
    const frequency = Math.min(index, size - index);
    return frequency <= cutoff ? item : { re: 0, im: 0 };
  });
  const reconstructed = idft(filtered).map(clamp);
  const magnitudes = spectrum.slice(0, size / 2 + 1).map((item) => Math.hypot(item.re, item.im));
  const maxMagnitude = Math.max(...magnitudes.slice(1), 1);
  const rmse = Math.sqrt(signal.reduce((sum, value, index) => sum + (value - reconstructed[index]) ** 2, 0) / size);

  return (
    <>
      <FilterChoice name="senal-frecuencia" value={signalId} onChange={setSignalId} values={[{ value: "smooth", label: "Onda suave" }, { value: "stripes", label: "Rayas finas" }, { value: "mixed", label: "Mezcla" }, { value: "step", label: "Escalón" }]} />
      <div className="frequency-stage">
        <SignalPlot title="FILA ORIGINAL" values={signal} />
        <SignalPlot title={`RECONSTRUCCIÓN · f ≤ ${cutoff}`} values={reconstructed} />
      </div>
      <div className="spectrum-bars" aria-label="Magnitud por frecuencia, sin mostrar la componente media">{magnitudes.slice(1).map((value, index) => <span key={index} data-kept={index + 1 <= cutoff} style={{ height: `${8 + 70 * value / maxMagnitude}px` }}><small>{index + 1}</small></span>)}</div>
      <div className="math-sliders"><div><Label htmlFor="frequency-cutoff">Paso bajo: conservar hasta frecuencia {cutoff}</Label><Slider id="frequency-cutoff" min={0} max={16} step={1} value={[cutoff]} onValueChange={(next) => setCutoff(next[0])} /></div></div>
      <div className="metric-strip"><div><span>RMSE RECONSTRUCCIÓN</span><strong>{format(rmse, 1)}</strong></div><div><span>COMPONENTES + DC</span><strong>{cutoff + 1}</strong></div><div><span>MODELO</span><strong>DFT exacta 1D</strong></div></div>
      <p className="lab-caption">Representamos una fila de imagen. En una imagen completa, la DFT utiliza dos ejes espaciales.</p>
    </>
  );
}

function FilterPipelineLab() {
  const scenarios = {
    scratch: {
      label: "Arañazo de 2 px",
      signal: "línea fina de bajo contraste",
      nuisance: "ruido aproximadamente Gaussian",
      validation: "recall por anchura del defecto + falsos positivos",
      candidates: [
        { id: "mild", label: "Gaussian leve → Scharr → umbral", verdict: "Candidato razonable", risk: "Ajustar sigma por debajo de la escala del arañazo y comparar con no filtrar.", fit: 3 },
        { id: "strong", label: "Mediana 7×7 → Canny alto", verdict: "Riesgo crítico", risk: "La ventana puede borrar por completo la señal de dos píxeles.", fit: 0 },
        { id: "pretty", label: "Unsharp fuerte → umbral", verdict: "Hipótesis frágil", risk: "Puede crear halos y falsas rayas alrededor de textura y compresión.", fit: 1 },
      ],
    },
    impulse: {
      label: "Documento con impulsos",
      signal: "trazos de texto oscuros",
      nuisance: "puntos sal y pimienta",
      validation: "caracteres recuperados + componentes espurios",
      candidates: [
        { id: "median", label: "Mediana 3×3 → umbral adaptativo", verdict: "Candidato razonable", risk: "Comprobar que los trazos más finos sobreviven a la ventana.", fit: 3 },
        { id: "box", label: "Promedio 9×9 → umbral global", verdict: "Riesgo crítico", risk: "Difumina letras y un único umbral sufre con iluminación desigual.", fit: 0 },
        { id: "gamma", label: "Gamma → Canny", verdict: "Incompleto", risk: "Remapear tonos no elimina los impulsos ni entrega regiones de texto rellenas.", fit: 1 },
      ],
    },
    realtime: {
      label: "Cámara en tiempo real",
      signal: "contorno de pieza grande",
      nuisance: "ruido moderado del sensor",
      validation: "latencia p95 + continuidad de borde",
      candidates: [
        { id: "separable", label: "Gaussian separable 5×5 → Sobel", verdict: "Candidato razonable", risk: "Medir latencia real y sensibilidad del borde al cambio de exposición.", fit: 3 },
        { id: "bilateral", label: "Bilateral grande → Canny", verdict: "Posible, pero caro", risk: "Puede conservar bordes, pero amenaza el presupuesto de tiempo por frame.", fit: 2 },
        { id: "none", label: "Sin suavizado → umbral muy bajo", verdict: "Riesgo de ruido", risk: "El derivador puede convertir textura del sensor en numerosos contornos.", fit: 1 },
      ],
    },
  };
  const [scenarioId, setScenarioId] = useState<keyof typeof scenarios>("scratch");
  const scenario = scenarios[scenarioId];
  const [candidateId, setCandidateId] = useState("mild");
  const candidate = scenario.candidates.find((item) => item.id === candidateId) ?? scenario.candidates[0];

  function chooseScenario(value: string) {
    const nextId = value as keyof typeof scenarios;
    setScenarioId(nextId);
    setCandidateId(scenarios[nextId].candidates[0].id);
  }

  return (
    <>
      <FilterChoice name="escenario-pipeline" value={scenarioId} onChange={chooseScenario} values={Object.entries(scenarios).map(([value, item]) => ({ value, label: item.label }))} />
      <div className="pipeline-contract"><div><span>SEÑAL ÚTIL</span><strong>{scenario.signal}</strong></div><div><span>PERTURBACIÓN</span><strong>{scenario.nuisance}</strong></div><div><span>VALIDAR CON</span><strong>{scenario.validation}</strong></div></div>
      <FilterChoice name={`pipeline-${scenarioId}`} value={candidate.id} onChange={setCandidateId} values={scenario.candidates.map((item) => ({ value: item.id, label: item.label }))} />
      <div className="pipeline-verdict" data-fit={candidate.fit}><span>{candidate.verdict}</span><strong>{candidate.label}</strong><p>{candidate.risk}</p></div>
      <p className="lab-caption">Es una hipótesis inicial, no una receta universal. La decisión final exige una ablación sobre datos representativos.</p>
    </>
  );
}

function SignalPlot({ title, values }: { title: string; values: number[] }) {
  const path = values.map((value, index) => `${12 + index * 216 / (values.length - 1)},${112 - value * 92 / 255}`).join(" ");
  return <figure className="signal-plot"><figcaption>{title}</figcaption><svg viewBox="0 0 240 124" role="img" aria-label={title.toLowerCase()}><path d="M12 112H228" className="plot-axis" /><polyline points={path} className="signal-line" /></svg></figure>;
}

function clamp(value: number) {
  return Math.max(0, Math.min(255, value));
}

function format(value: number, digits = 1) {
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

function sample1d(signal: number[], index: number, mode: string) {
  if (index >= 0 && index < signal.length) return signal[index];
  if (mode === "constant") return 0;
  if (mode === "replicate") return signal[Math.max(0, Math.min(signal.length - 1, index))];
  const reflected = index < 0 ? -index : 2 * signal.length - index - 2;
  return signal[Math.max(0, Math.min(signal.length - 1, reflected))];
}

function boxKernel(size: number) {
  return Array.from({ length: size }, () => Array(size).fill(1 / (size * size)) as number[]);
}

function gaussianKernel(size: number, sigma: number) {
  const radius = Math.floor(size / 2);
  const kernel = Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => {
    const dx = x - radius;
    const dy = y - radius;
    return Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
  }));
  const total = kernel.flat().reduce((sum, value) => sum + value, 0);
  return kernel.map((row) => row.map((value) => value / total));
}

function applyLinearFilter(image: number[][], kernel: number[][]) {
  const radiusY = Math.floor(kernel.length / 2);
  const radiusX = Math.floor(kernel[0].length / 2);
  return image.map((row, y) => row.map((_, x) => {
    let result = 0;
    kernel.forEach((kernelRow, ky) => kernelRow.forEach((weight, kx) => {
      const sy = Math.max(0, Math.min(image.length - 1, y + ky - radiusY));
      const sx = Math.max(0, Math.min(row.length - 1, x + kx - radiusX));
      result += image[sy][sx] * weight;
    }));
    return result;
  }));
}

function medianFilter(image: number[][], size: number) {
  const radius = Math.floor(size / 2);
  return image.map((row, y) => row.map((_, x) => {
    const values: number[] = [];
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const sy = Math.max(0, Math.min(image.length - 1, y + dy));
        const sx = Math.max(0, Math.min(row.length - 1, x + dx));
        values.push(image[sy][sx]);
      }
    }
    values.sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  }));
}

function bilateralFilter(image: number[][], size: number, sigmaSpace: number, sigmaColor: number) {
  const radius = Math.floor(size / 2);
  return image.map((row, y) => row.map((center, x) => {
    let weighted = 0;
    let total = 0;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const sy = Math.max(0, Math.min(image.length - 1, y + dy));
        const sx = Math.max(0, Math.min(row.length - 1, x + dx));
        const value = image[sy][sx];
        const spatial = Math.exp(-(dx * dx + dy * dy) / (2 * sigmaSpace * sigmaSpace));
        const tonal = Math.exp(-((value - center) ** 2) / (2 * sigmaColor * sigmaColor));
        const weight = spatial * tonal;
        weighted += value * weight;
        total += weight;
      }
    }
    return weighted / total;
  }));
}

function makeCleanEdge(size: number) {
  return Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => {
    const base = x < Math.floor(size / 2) ? 55 : 190;
    return base + ((x * 5 + y * 3) % 7) - 3;
  }));
}

function makeNoisyEdge(size: number, impulses: boolean) {
  const image = makeCleanEdge(size).map((row, y) => row.map((value, x) => clamp(value + (((x * 29 + y * 17) % 31) - 15))));
  if (impulses) {
    [[1, 1, 255], [2, 6, 0], [5, 2, 255], [6, 7, 0], [7, 4, 255]].forEach(([y, x, value]) => { image[y][x] = value; });
  }
  return image;
}

function regionStats(image: number[][]) {
  const midpoint = Math.floor(image[0].length / 2);
  const left = image.flatMap((row) => row.slice(0, Math.max(1, midpoint - 1)));
  const right = image.flatMap((row) => row.slice(midpoint + 1));
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const leftMean = mean(left);
  const rightMean = mean(right);
  const noise = Math.sqrt(left.reduce((sum, value) => sum + (value - leftMean) ** 2, 0) / left.length);
  return { noise, contrast: rightMean - leftMean };
}

function makeEdgePattern(kind: string) {
  return Array.from({ length: 5 }, (_, y) => Array.from({ length: 5 }, (_, x) => {
    if (kind === "vertical") return x < 2 ? 30 : 220;
    if (kind === "horizontal") return y < 2 ? 30 : 220;
    if (kind === "diagonal") return x + y < 4 ? 30 : 220;
    return 120;
  }));
}

function dotMatrices(left: number[][], right: number[][]) {
  return left.reduce((sum, row, y) => sum + row.reduce((rowSum, value, x) => rowSum + value * right[y][x], 0), 0);
}

function makeSoftFeature(size: number) {
  const center = (size - 1) / 2;
  return Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => {
    const distance = Math.hypot(x - center, y - center);
    const feature = 52 + 155 / (1 + Math.exp((distance - 2.5) * 2));
    const texture = ((x * 11 + y * 7) % 9) - 4;
    return clamp(feature + texture);
  }));
}

function makeHysteresisMap(width: number) {
  const values = Array.from({ length: width * width }, (_, index) => 8 + (index * 17) % 29);
  const put = (x: number, y: number, value: number) => { values[y * width + x] = value; };
  [[3, 0, 165], [3, 1, 118], [3, 2, 92], [3, 3, 148], [3, 4, 75], [3, 5, 142], [3, 6, 105], [3, 7, 172], [4, 4, 84], [5, 4, 73], [6, 4, 155], [1, 6, 96], [6, 1, 122]].forEach(([x, y, value]) => put(x, y, value));
  return values;
}

function connectEligibleToStrong(eligible: boolean[], strong: boolean[], width: number) {
  const connected = [...strong];
  const queue = strong.flatMap((active, index) => active ? [index] : []);
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor];
    const x = index % width;
    const y = Math.floor(index / width);
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= width) continue;
        const neighbor = ny * width + nx;
        if (eligible[neighbor] && !connected[neighbor]) {
          connected[neighbor] = true;
          queue.push(neighbor);
        }
      }
    }
  }
  return connected;
}

function dft(signal: number[]) {
  const size = signal.length;
  return Array.from({ length: size }, (_, frequency) => signal.reduce((acc, value, sample) => {
    const angle = -2 * Math.PI * frequency * sample / size;
    return { re: acc.re + value * Math.cos(angle), im: acc.im + value * Math.sin(angle) };
  }, { re: 0, im: 0 }));
}

function idft(spectrum: Array<{ re: number; im: number }>) {
  const size = spectrum.length;
  return Array.from({ length: size }, (_, sample) => spectrum.reduce((sum, value, frequency) => {
    const angle = 2 * Math.PI * frequency * sample / size;
    return sum + value.re * Math.cos(angle) - value.im * Math.sin(angle);
  }, 0) / size);
}
