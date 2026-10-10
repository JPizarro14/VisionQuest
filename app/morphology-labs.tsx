"use client";

import { useMemo, useState, type CSSProperties } from "react";

import type { LessonLabId } from "@/app/course-data";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type MorphologyLabProps = { lab: LessonLabId };
type FootprintKind = "rect" | "cross" | "diamond";

export function MorphologyLab({ lab }: MorphologyLabProps) {
  if (lab === "morph-structuring") return <StructuringLab />;
  if (lab === "morph-erosion") return <ErosionLab />;
  if (lab === "morph-dilation") return <DilationLab />;
  if (lab === "morph-open-close") return <OpenCloseLab />;
  if (lab === "morph-residuals") return <ResidualLab />;
  if (lab === "morph-grayscale") return <GrayscaleMorphologyLab />;
  if (lab === "connected-components") return <ConnectedComponentsLab />;
  if (lab === "histogram-bins") return <HistogramBinsLab />;
  if (lab === "histogram-color") return <ColorHistogramLab />;
  if (lab === "histogram-equalization") return <EqualizationLab />;
  if (lab === "clahe") return <ClaheLab />;
  if (lab === "histogram-pipeline") return <HistogramPipelineLab />;
  return null;
}

function LabChoice({
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
        <Label key={option.value} htmlFor={name + "-" + option.value} className="console-choice">
          <RadioGroupItem id={name + "-" + option.value} value={option.value} />
          <span>{option.label}</span>
        </Label>
      ))}
    </RadioGroup>
  );
}

function BinaryFigure({
  title,
  values,
  labels,
  selected,
  covered,
  onCellClick,
}: {
  title: string;
  values: boolean[][];
  labels?: number[][];
  selected?: { x: number; y: number };
  covered?: Set<string>;
  onCellClick?: (x: number, y: number) => void;
}) {
  const columns = values[0]?.length ?? 1;
  return (
    <figure className="morph-figure">
      <figcaption>{title}</figcaption>
      <div
        className="morph-binary-grid"
        style={{ gridTemplateColumns: "repeat(" + columns + ", 1fr)" }}
        role="grid"
        aria-label={title.toLowerCase()}
      >
        {values.flatMap((row, y) => row.map((active, x) => {
          const component = labels?.[y]?.[x] ?? 0;
          const isSelected = selected?.x === x && selected.y === y;
          const isCovered = covered?.has(x + "-" + y) ?? false;
          const classes = [
            active ? "is-foreground" : "",
            isCovered ? "is-covered" : "",
            isSelected ? "is-anchor" : "",
          ].filter(Boolean).join(" ");
          const state = active
            ? "primer plano" + (component ? ", etiqueta " + component : "")
            : "fondo";
          return (
            <button
              key={x + "-" + y}
              type="button"
              tabIndex={onCellClick ? 0 : -1}
              className={classes}
              data-label={component || undefined}
              onClick={onCellClick ? () => onCellClick(x, y) : undefined}
              aria-label={"x " + x + ", y " + y + ": " + state}
            >
              {component > 0 ? component : ""}
            </button>
          );
        }))}
      </div>
    </figure>
  );
}

function GrayFigure({
  title,
  values,
  onCellClick,
  selected,
}: {
  title: string;
  values: number[][];
  onCellClick?: (x: number, y: number) => void;
  selected?: { x: number; y: number };
}) {
  const columns = values[0]?.length ?? 1;
  return (
    <figure className="morph-figure">
      <figcaption>{title}</figcaption>
      <div
        className="morph-gray-grid"
        style={{ gridTemplateColumns: "repeat(" + columns + ", 1fr)" }}
        role="grid"
        aria-label={title.toLowerCase()}
      >
        {values.flatMap((row, y) => row.map((raw, x) => {
          const value = clamp(raw);
          return (
            <button
              key={x + "-" + y}
              type="button"
              tabIndex={onCellClick ? 0 : -1}
              className={selected?.x === x && selected.y === y ? "is-selected" : ""}
              style={{
                backgroundColor: "rgb(" + value + " " + value + " " + value + ")",
                color: value > 142 ? "#132027" : "#f3efe5",
              }}
              onClick={onCellClick ? () => onCellClick(x, y) : undefined}
              aria-label={"x " + x + ", y " + y + ": intensidad " + Math.round(value)}
            >
              {Math.round(value)}
            </button>
          );
        }))}
      </div>
    </figure>
  );
}

function StructuringLab() {
  const image = useMemo(() => makeStructuringScene(), []);
  const [kind, setKind] = useState<FootprintKind>("cross");
  const [size, setSize] = useState(3);
  const [selected, setSelected] = useState({ x: 4, y: 3 });
  const kernel = makeFootprint(kind, size);
  const radius = Math.floor(size / 2);
  const covered = new Set<string>();
  let foreground = 0;
  let total = 0;

  kernel.forEach((row, ky) => row.forEach((active, kx) => {
    if (!active) return;
    const x = selected.x + kx - radius;
    const y = selected.y + ky - radius;
    if (x >= 0 && x < image[0].length && y >= 0 && y < image.length) {
      covered.add(x + "-" + y);
    }
    total += 1;
    if (sampleBinary(image, x, y, false)) foreground += 1;
  }));

  return (
    <>
      <LabChoice
        name="forma-footprint"
        value={kind}
        onChange={(value) => setKind(value as FootprintKind)}
        values={[
          { value: "rect", label: "Rectángulo" },
          { value: "cross", label: "Cruz" },
          { value: "diamond", label: "Diamante" },
        ]}
      />
      <div className="math-sliders">
        <div>
          <Label htmlFor="footprint-size">Tamaño = {size}×{size}</Label>
          <Slider id="footprint-size" min={3} max={5} step={2} value={[size]} onValueChange={(next) => setSize(next[0])} />
        </div>
      </div>
      <div className="morph-stage morph-stage-probe">
        <BinaryFigure
          title="MÁSCARA · PULSA EL ANCLA"
          values={image}
          selected={selected}
          covered={covered}
          onCellClick={(x, y) => setSelected({ x, y })}
        />
        <FootprintFigure values={kernel} />
      </div>
      <div className="metric-strip">
        <div><span>ACTIVOS CUBIERTOS</span><strong>{foreground} / {total}</strong></div>
        <div><span>EROSIÓN</span><strong>{foreground === total ? "1 · cabe" : "0 · no cabe"}</strong></div>
        <div><span>DILATACIÓN</span><strong>{foreground > 0 ? "1 · toca" : "0 · no toca"}</strong></div>
      </div>
      <p className="lab-caption">Fuera del marco usamos fondo = 0. El contorno ámbar marca las posiciones activas del footprint.</p>
    </>
  );
}

function FootprintFigure({ values }: { values: boolean[][] }) {
  const center = Math.floor(values.length / 2);
  return (
    <figure className="morph-figure footprint-figure">
      <figcaption>ELEMENTO ESTRUCTURANTE</figcaption>
      <div className="footprint-grid" style={{ gridTemplateColumns: "repeat(" + values.length + ", 1fr)" }}>
        {values.flatMap((row, y) => row.map((active, x) => (
          <span key={x + "-" + y} className={active ? "is-active" : ""} data-anchor={x === center && y === center}>
            {active ? "1" : "0"}
          </span>
        )))}
      </div>
    </figure>
  );
}

function ErosionLab() {
  const source = useMemo(() => makeErosionScene(), []);
  const [kind, setKind] = useState<FootprintKind>("rect");
  const [size, setSize] = useState(3);
  const [iterations, setIterations] = useState(1);
  const output = binaryMorph(source, makeFootprint(kind, size), "erode", iterations);
  const sourceArea = countForeground(source);
  const outputArea = countForeground(output);

  return (
    <>
      <LabChoice
        name="erosion-forma"
        value={kind}
        onChange={(value) => setKind(value as FootprintKind)}
        values={[
          { value: "rect", label: "Rectángulo" },
          { value: "cross", label: "Cruz" },
          { value: "diamond", label: "Diamante" },
        ]}
      />
      <div className="math-sliders compact-math-sliders">
        <div><Label htmlFor="erosion-size">Tamaño = {size}×{size}</Label><Slider id="erosion-size" min={3} max={5} step={2} value={[size]} onValueChange={(next) => setSize(next[0])} /></div>
        <div><Label htmlFor="erosion-iterations">Iteraciones = {iterations}</Label><Slider id="erosion-iterations" min={1} max={2} step={1} value={[iterations]} onValueChange={(next) => setIterations(next[0])} /></div>
      </div>
      <div className="morph-stage">
        <BinaryFigure title="ENTRADA" values={source} />
        <BinaryFigure title={"EROSIÓN · " + kind.toUpperCase()} values={output} />
      </div>
      <div className="metric-strip">
        <div><span>ÁREA BLANCA</span><strong>{sourceArea} → {outputArea}</strong></div>
        <div><span>COMPONENTES</span><strong>{labelComponents(source, 8).count} → {labelComponents(output, 8).count}</strong></div>
        <div><span>PÉRDIDA</span><strong>{sourceArea - outputArea} px</strong></div>
      </div>
    </>
  );
}

function DilationLab() {
  const source = useMemo(() => makeDilationScene(), []);
  const [kind, setKind] = useState<FootprintKind>("cross");
  const [size, setSize] = useState(3);
  const [iterations, setIterations] = useState(1);
  const output = binaryMorph(source, makeFootprint(kind, size), "dilate", iterations);
  const sourceLabels = labelComponents(source, 8);
  const outputLabels = labelComponents(output, 8);

  return (
    <>
      <LabChoice
        name="dilatacion-forma"
        value={kind}
        onChange={(value) => setKind(value as FootprintKind)}
        values={[
          { value: "rect", label: "Rectángulo" },
          { value: "cross", label: "Cruz" },
          { value: "diamond", label: "Diamante" },
        ]}
      />
      <div className="math-sliders compact-math-sliders">
        <div><Label htmlFor="dilation-size">Tamaño = {size}×{size}</Label><Slider id="dilation-size" min={3} max={5} step={2} value={[size]} onValueChange={(next) => setSize(next[0])} /></div>
        <div><Label htmlFor="dilation-iterations">Iteraciones = {iterations}</Label><Slider id="dilation-iterations" min={1} max={2} step={1} value={[iterations]} onValueChange={(next) => setIterations(next[0])} /></div>
      </div>
      <div className="morph-stage">
        <BinaryFigure title="PIEZAS SEPARADAS" values={source} />
        <BinaryFigure title={"DILATACIÓN · " + kind.toUpperCase()} values={output} />
      </div>
      <div className="metric-strip">
        <div><span>ÁREA BLANCA</span><strong>{countForeground(source)} → {countForeground(output)}</strong></div>
        <div><span>ISLAS</span><strong>{sourceLabels.count} → {outputLabels.count}</strong></div>
        <div><span>LECTURA</span><strong>{outputLabels.count < sourceLabels.count ? "se fusionaron" : "siguen separadas"}</strong></div>
      </div>
    </>
  );
}

function OpenCloseLab() {
  const source = useMemo(() => makeOpenCloseScene(), []);
  const [operation, setOperation] = useState("open");
  const [size, setSize] = useState(3);
  const kernel = makeFootprint("rect", size);
  const opened = binaryMorph(binaryMorph(source, kernel, "erode"), kernel, "dilate");
  const closed = binaryMorph(binaryMorph(source, kernel, "dilate"), kernel, "erode");
  const outputs: Record<string, boolean[][]> = {
    open: opened,
    close: closed,
    "open-close": binaryMorph(binaryMorph(opened, kernel, "dilate"), kernel, "erode"),
    "close-open": binaryMorph(binaryMorph(closed, kernel, "erode"), kernel, "dilate"),
  };
  const output = outputs[operation];

  return (
    <>
      <LabChoice
        name="operacion-compuesta"
        value={operation}
        onChange={setOperation}
        values={[
          { value: "open", label: "Apertura" },
          { value: "close", label: "Cierre" },
          { value: "open-close", label: "Abrir → cerrar" },
          { value: "close-open", label: "Cerrar → abrir" },
        ]}
      />
      <div className="math-sliders">
        <div><Label htmlFor="open-close-size">Footprint = {size}×{size}</Label><Slider id="open-close-size" min={3} max={5} step={2} value={[size]} onValueChange={(next) => setSize(next[0])} /></div>
      </div>
      <div className="morph-stage">
        <BinaryFigure title="MOTAS + HUECO + PUENTE" values={source} />
        <BinaryFigure title={operation.toUpperCase().replace("-", " → ")} values={output} />
      </div>
      <div className="metric-strip">
        <div><span>ÁREA</span><strong>{countForeground(source)} → {countForeground(output)}</strong></div>
        <div><span>ISLAS</span><strong>{labelComponents(source, 8).count} → {labelComponents(output, 8).count}</strong></div>
        <div><span>DIFERENCIA</span><strong>{binaryDifference(source, output)} px</strong></div>
      </div>
      <p className="lab-caption">El orden puede producir salidas distintas aunque uses exactamente el mismo footprint.</p>
    </>
  );
}

function ResidualLab() {
  const source = useMemo(() => makeResidualScene(), []);
  const [operation, setOperation] = useState("tophat");
  const [size, setSize] = useState(3);
  const opened = grayOpen(source, size);
  const closed = grayClose(source, size);
  const eroded = grayMorph(source, size, "min");
  const dilated = grayMorph(source, size, "max");
  const outputs: Record<string, number[][]> = {
    gradient: source.map((row, y) => row.map((_, x) => dilated[y][x] - eroded[y][x])),
    tophat: source.map((row, y) => row.map((value, x) => value - opened[y][x])),
    blackhat: source.map((row, y) => row.map((value, x) => closed[y][x] - value)),
  };
  const formulas: Record<string, string> = {
    gradient: "dilatación − erosión",
    tophat: "original − apertura",
    blackhat: "cierre − original",
  };
  const output = outputs[operation];
  const active = output.flat().filter((value) => value > 12).length;

  return (
    <>
      <LabChoice
        name="residuo-morfologico"
        value={operation}
        onChange={setOperation}
        values={[
          { value: "gradient", label: "Gradiente" },
          { value: "tophat", label: "White top-hat" },
          { value: "blackhat", label: "Black-hat" },
        ]}
      />
      <div className="math-sliders">
        <div><Label htmlFor="residual-size">Footprint = {size}×{size}</Label><Slider id="residual-size" min={3} max={5} step={2} value={[size]} onValueChange={(next) => setSize(next[0])} /></div>
      </div>
      <div className="morph-stage">
        <GrayFigure title="ORIGINAL" values={source} />
        <GrayFigure title={operation.toUpperCase()} values={output} />
      </div>
      <div className="metric-strip">
        <div><span>FÓRMULA</span><strong>{formulas[operation]}</strong></div>
        <div><span>RESPUESTA &gt; 12</span><strong>{active} px</strong></div>
        <div><span>ESCALA</span><strong>{size}×{size}</strong></div>
      </div>
    </>
  );
}

function GrayscaleMorphologyLab() {
  const source = useMemo(() => makeGrayscaleScene(), []);
  const [operation, setOperation] = useState("min");
  const [size, setSize] = useState(3);
  const [selected, setSelected] = useState({ x: 3, y: 3 });
  const eroded = grayMorph(source, size, "min");
  const dilated = grayMorph(source, size, "max");
  const output = operation === "min"
    ? eroded
    : operation === "max"
      ? dilated
      : dilated.map((row, y) => row.map((value, x) => value - eroded[y][x]));
  const neighborhood = grayNeighborhood(source, selected.x, selected.y, size);
  const minimum = Math.min(...neighborhood.flat());
  const maximum = Math.max(...neighborhood.flat());

  return (
    <>
      <LabChoice
        name="morfologia-grises"
        value={operation}
        onChange={setOperation}
        values={[
          { value: "min", label: "Erosión · mínimo" },
          { value: "max", label: "Dilatación · máximo" },
          { value: "range", label: "Gradiente · max−min" },
        ]}
      />
      <div className="math-sliders">
        <div><Label htmlFor="gray-morph-size">Footprint = {size}×{size}</Label><Slider id="gray-morph-size" min={3} max={5} step={2} value={[size]} onValueChange={(next) => setSize(next[0])} /></div>
      </div>
      <div className="morph-stage">
        <GrayFigure title="PULSA UN PÍXEL" values={source} selected={selected} onCellClick={(x, y) => setSelected({ x, y })} />
        <GrayFigure title="SALIDA" values={output} />
      </div>
      <div className="gray-neighborhood">
        <div>
          <span>VECINDARIO EN ({selected.x}, {selected.y})</span>
          <div style={{ gridTemplateColumns: "repeat(" + size + ", 1fr)" }}>
            {neighborhood.flatMap((row, y) => row.map((value, x) => <strong key={x + "-" + y}>{value}</strong>))}
          </div>
        </div>
        <dl>
          <div><dt>MÍNIMO</dt><dd>{minimum}</dd></div>
          <div><dt>MÁXIMO</dt><dd>{maximum}</dd></div>
          <div><dt>SALIDA AQUÍ</dt><dd>{Math.round(output[selected.y][selected.x])}</dd></div>
        </dl>
      </div>
    </>
  );
}

function ConnectedComponentsLab() {
  const [image, setImage] = useState(makeComponentsScene);
  const [connectivity, setConnectivity] = useState("4");
  const [selectedLabel, setSelectedLabel] = useState(1);
  const result = labelComponents(image, Number(connectivity) as 4 | 8);
  const safeLabel = Math.min(Math.max(1, selectedLabel), Math.max(1, result.count));
  const stats = componentStats(result.labels, safeLabel);

  function togglePixel(x: number, y: number) {
    setImage((current) => current.map((row, rowY) => row.map((value, colX) => (
      rowY === y && colX === x ? !value : value
    ))));
  }

  return (
    <>
      <LabChoice
        name="conectividad"
        value={connectivity}
        onChange={setConnectivity}
        values={[
          { value: "4", label: "4 vecinos" },
          { value: "8", label: "8 vecinos" },
        ]}
      />
      <div className="morph-stage">
        <BinaryFigure title="EDITA LA MÁSCARA" values={image} onCellClick={togglePixel} />
        <BinaryFigure
          title="ETIQUETAS · PULSA UNA ISLA"
          values={image}
          labels={result.labels}
          selected={stats ? { x: Math.round(stats.centroidX), y: Math.round(stats.centroidY) } : undefined}
          onCellClick={(x, y) => {
            const label = result.labels[y][x];
            if (label > 0) setSelectedLabel(label);
          }}
        />
      </div>
      <div className="metric-strip">
        <div><span>COMPONENTES</span><strong>{result.count}</strong></div>
        <div><span>SELECCIÓN</span><strong>{stats ? "#" + safeLabel + " · " + stats.area + " px" : "ninguna"}</strong></div>
        <div><span>CAJA x,y,w,h</span><strong>{stats ? [stats.left, stats.top, stats.width, stats.height].join(",") : "—"}</strong></div>
        <div><span>CENTROIDE</span><strong>{stats ? "(" + format(stats.centroidX, 1) + ", " + format(stats.centroidY, 1) + ")" : "—"}</strong></div>
      </div>
      <p className="lab-caption">El contorno visual marca el centroide redondeado, que no tiene por qué caer sobre un píxel del componente.</p>
    </>
  );
}

function HistogramBinsLab() {
  const values = useMemo(() => makeHistogramScene(), []);
  const [bins, setBins] = useState(8);
  const [shuffled, setShuffled] = useState(false);
  const arranged = shuffled ? reshape(deterministicShuffle(values.flat()), values.length, values[0].length) : values;
  const hist = calculateHistogram(arranged.flat(), bins);

  return (
    <>
      <div className="math-sliders">
        <div><Label htmlFor="hist-bins">Bins = {bins} · ancho tonal = {256 / bins}</Label><Slider id="hist-bins" min={4} max={16} step={4} value={[bins]} onValueChange={(next) => setBins(next[0])} /></div>
      </div>
      <Label htmlFor="shuffle-pixels" className="lab-switch-row">
        <Switch id="shuffle-pixels" checked={shuffled} onCheckedChange={setShuffled} />
        <span>{shuffled ? "Píxeles barajados" : "Píxeles en su posición original"}</span>
      </Label>
      <div className="histogram-stage">
        <GrayFigure title={shuffled ? "MISMOS VALORES · OTRA GEOMETRÍA" : "IMAGEN ORIGINAL"} values={arranged} />
        <HistogramBars values={hist} title="HISTOGRAMA GLOBAL" />
      </div>
      <div className="metric-strip">
        <div><span>PÍXELES</span><strong>{arranged.flat().length}</strong></div>
        <div><span>SUMA DE BINS</span><strong>{hist.reduce((sum, value) => sum + value, 0)}</strong></div>
        <div><span>INFORMACIÓN ESPACIAL</span><strong>0 coordenadas</strong></div>
      </div>
    </>
  );
}

function ColorHistogramLab() {
  const cells = useMemo(() => makeColorScene(), []);
  const [mode, setMode] = useState("h");
  const [masked, setMasked] = useState(false);
  const selected = cells.filter((cell) => !masked || cell.roi);
  const hueBins = Array(12).fill(0) as number[];
  const satBins = Array(5).fill(0) as number[];
  const joint = Array.from({ length: 5 }, () => Array(12).fill(0) as number[]);
  selected.forEach((cell) => {
    const h = Math.min(11, Math.floor(cell.h / 30));
    const s = Math.min(4, Math.floor(cell.s * 5));
    hueBins[h] += 1;
    satBins[s] += 1;
    joint[4 - s][h] += 1;
  });

  return (
    <>
      <LabChoice
        name="histograma-color"
        value={mode}
        onChange={setMode}
        values={[
          { value: "h", label: "Tono H" },
          { value: "s", label: "Saturación S" },
          { value: "hs", label: "Conjunto H-S" },
        ]}
      />
      <Label htmlFor="color-hist-mask" className="lab-switch-row">
        <Switch id="color-hist-mask" checked={masked} onCheckedChange={setMasked} />
        <span>{masked ? "Contar solo la prenda marcada" : "Contar toda la escena"}</span>
      </Label>
      <div className="color-hist-stage">
        <figure className="morph-figure">
          <figcaption>ESCENA · MARCO = ROI</figcaption>
          <div className="color-swatch-grid">
            {cells.map((cell, index) => (
              <span
                key={index}
                data-roi={cell.roi}
                style={{ backgroundColor: "hsl(" + cell.h + " " + Math.round(cell.s * 100) + "% " + cell.l + "%)" }}
                title={"H " + cell.h + "°, S " + Math.round(cell.s * 100) + "%"}
              />
            ))}
          </div>
        </figure>
        {mode === "h" && <HistogramBars values={hueBins} title="12 BINS DE TONO" colorful />}
        {mode === "s" && <HistogramBars values={satBins} title="5 BINS DE SATURACIÓN" />}
        {mode === "hs" && <JointHistogram values={joint} />}
      </div>
      <div className="metric-strip">
        <div><span>PÍXELES CONTADOS</span><strong>{selected.length} / {cells.length}</strong></div>
        <div><span>DIMENSIONES</span><strong>{mode === "hs" ? "12 × 5 = 60 bins" : mode === "h" ? "12 bins" : "5 bins"}</strong></div>
        <div><span>POSICIÓN x,y</span><strong>descartada</strong></div>
      </div>
    </>
  );
}

function HistogramBars({ values, title, colorful = false }: { values: number[]; title: string; colorful?: boolean }) {
  const maximum = Math.max(...values, 1);
  return (
    <figure className="histogram-figure">
      <figcaption>{title}</figcaption>
      <div className="histogram-bars" style={{ gridTemplateColumns: "repeat(" + values.length + ", minmax(0, 1fr))" }}>
        {values.map((value, index) => (
          <span key={index} style={{
            height: (8 + value * 92 / maximum) + "%",
            "--bar-hue": colorful ? index * 360 / values.length : undefined,
          } as CSSProperties}>
            <small>{value}</small>
          </span>
        ))}
      </div>
      <div className="histogram-axis"><span>BAJO</span><span>ALTO</span></div>
    </figure>
  );
}

function JointHistogram({ values }: { values: number[][] }) {
  const maximum = Math.max(...values.flat(), 1);
  return (
    <figure className="histogram-figure joint-histogram-figure">
      <figcaption>HISTOGRAMA CONJUNTO · HORIZONTAL H / VERTICAL S</figcaption>
      <div className="joint-histogram">
        {values.flatMap((row, y) => row.map((value, x) => (
          <span
            key={x + "-" + y}
            style={{
              backgroundColor: "hsl(" + x * 30 + " 68% " + (12 + value * 58 / maximum) + "%)",
              color: value > maximum * 0.45 ? "#fff" : "#9caeaa",
            }}
            title={"H bin " + x + ", S bin " + (4 - y) + ": " + value}
          >
            {value || ""}
          </span>
        )))}
      </div>
    </figure>
  );
}

function EqualizationLab() {
  const [range, setRange] = useState(72);
  const [method, setMethod] = useState("equalize");
  const source = useMemo(() => makeLowContrastScene(range), [range]);
  const equalized = equalizeImage(source);
  const stretched = stretchImage(source);
  const output = method === "equalize" ? equalized : stretched;
  const sourceHist = calculateHistogram(source.flat(), 16);
  const outputHist = calculateHistogram(output.flat(), 16);
  const mapping = method === "equalize" ? equalizationMap(source.flat()) : stretchMap(source.flat());
  const polyline = Array.from({ length: 65 }, (_, index) => {
    const x = index * 255 / 64;
    return (12 + x * 216 / 255) + "," + (112 - mapping[Math.round(x)] * 92 / 255);
  }).join(" ");

  return (
    <>
      <LabChoice
        name="metodo-contraste"
        value={method}
        onChange={setMethod}
        values={[
          { value: "equalize", label: "Ecualización CDF" },
          { value: "stretch", label: "Estiramiento lineal" },
        ]}
      />
      <div className="math-sliders">
        <div><Label htmlFor="input-tone-range">Rango tonal de entrada ≈ {range}</Label><Slider id="input-tone-range" min={32} max={160} step={8} value={[range]} onValueChange={(next) => setRange(next[0])} /></div>
      </div>
      <div className="morph-stage">
        <GrayFigure title="BAJO CONTRASTE" values={source} />
        <GrayFigure title={method === "equalize" ? "ECUALIZADA" : "ESTIRADA"} values={output} />
      </div>
      <div className="equalization-analysis">
        <HistogramBars values={sourceHist} title="HISTOGRAMA · ENTRADA" />
        <figure className="mapping-figure">
          <figcaption>CURVA ENTRADA → SALIDA</figcaption>
          <svg viewBox="0 0 240 124" role="img" aria-label="Curva de remapeo tonal">
            <path d="M12 112H228 M12 112V20" className="plot-axis" />
            <line x1="12" y1="112" x2="228" y2="20" className="tone-identity" />
            <polyline points={polyline} className="tone-curve-line" />
          </svg>
        </figure>
        <HistogramBars values={outputHist} title="HISTOGRAMA · SALIDA" />
      </div>
      <div className="metric-strip">
        <div><span>RANGO ENTRADA</span><strong>{Math.min(...source.flat())}–{Math.max(...source.flat())}</strong></div>
        <div><span>RANGO SALIDA</span><strong>{Math.min(...output.flat())}–{Math.max(...output.flat())}</strong></div>
        <div><span>CURVA</span><strong>{method === "equalize" ? "CDF · no lineal" : "recta entre extremos"}</strong></div>
      </div>
    </>
  );
}

function ClaheLab() {
  const source = useMemo(() => makeClaheScene(), []);
  const [tiles, setTiles] = useState(3);
  const [clipLimit, setClipLimit] = useState(2);
  const [interpolate, setInterpolate] = useState(true);
  const output = applyEducationalClahe(source, tiles, clipLimit, interpolate);
  const seam = tileSeamScore(output, tiles);
  const sourceLocalContrast = localContrast(source);
  const outputLocalContrast = localContrast(output);

  return (
    <>
      <div className="math-sliders compact-math-sliders">
        <div><Label htmlFor="clahe-tiles">Teselas = {tiles}×{tiles}</Label><Slider id="clahe-tiles" min={2} max={4} step={1} value={[tiles]} onValueChange={(next) => setTiles(next[0])} /></div>
        <div><Label htmlFor="clahe-clip">Clip relativo = {clipLimit.toFixed(1)}</Label><Slider id="clahe-clip" min={1} max={5} step={0.5} value={[clipLimit]} onValueChange={(next) => setClipLimit(next[0])} /></div>
      </div>
      <Label htmlFor="clahe-interpolation" className="lab-switch-row">
        <Switch id="clahe-interpolation" checked={interpolate} onCheckedChange={setInterpolate} />
        <span>{interpolate ? "Interpolar mapeos vecinos" : "Usar solo el mapeo de cada tesela"}</span>
      </Label>
      <div className="morph-stage clahe-stage" style={{ "--tile-count": tiles } as CSSProperties}>
        <GrayFigure title="ILUMINACIÓN DESIGUAL" values={source} />
        <div className="clahe-output-frame">
          <GrayFigure title="CLAHE DIDÁCTICO · 16 BINS" values={output} />
          <div className="clahe-tile-overlay" aria-hidden="true">
            {Array.from({ length: tiles * tiles }, (_, index) => <span key={index} />)}
          </div>
        </div>
      </div>
      <div className="metric-strip">
        <div><span>CONTRASTE LOCAL</span><strong>{format(sourceLocalContrast, 1)} → {format(outputLocalContrast, 1)}</strong></div>
        <div><span>SALTO EN FRONTERAS</span><strong>{format(seam, 1)}</strong></div>
        <div><span>INTERPOLACIÓN</span><strong>{interpolate ? "activa" : "desactivada"}</strong></div>
      </div>
      <p className="lab-caption">Modelo educativo con 16 bins: conserva la lógica teselas → clipping → CDF → interpolación, pero no pretende igualar bit a bit una biblioteca concreta.</p>
    </>
  );
}

function HistogramPipelineLab() {
  const scenarios = {
    pills: {
      label: "Contar tabletas",
      signal: "tabletas claras de 18–26 px sobre cinta oscura",
      nuisance: "polvo claro + pequeños huecos impresos",
      metric: "error de conteo + precisión/recall por instancia",
      candidates: [
        { id: "balanced", label: "Umbral → apertura 3×3 → cierre 3×3 → componentes", fit: 3, verdict: "Baseline defendible", risk: "Verifica que la apertura no borra tabletas pequeñas y que el cierre no une las que se tocan." },
        { id: "close", label: "Cierre 9×9 → componentes", fit: 0, verdict: "Fusión probable", risk: "Una escala grande puede convertir varias tabletas cercanas en una sola isla." },
        { id: "hist", label: "Solo histograma global", fit: 0, verdict: "Falta geometría", risk: "Puede estimar tonos totales, pero no separa posiciones ni entrega instancias." },
      ],
    },
    document: {
      label: "Texto sombreado",
      signal: "trazos oscuros finos sobre papel con gradiente de luz",
      nuisance: "sombra lenta + motas negras",
      metric: "CER del OCR + componentes espurios",
      candidates: [
        { id: "blackhat", label: "Black-hat horizontal → umbral → apertura leve", fit: 3, verdict: "Hipótesis coherente", risk: "Alinea el footprint con los trazos y mide si las letras finas siguen conectadas." },
        { id: "global", label: "Ecualización global → umbral fijo", fit: 1, verdict: "Puede quedarse corto", risk: "Una sola curva y un umbral global pueden fallar entre zona iluminada y sombra." },
        { id: "erode", label: "Erosión 7×7 de texto negro", fit: 0, verdict: "Polaridad y escala dudosas", risk: "Sin declarar el primer plano, puedes engrosar el fondo y destruir los trazos de interés." },
      ],
    },
    color: {
      label: "Buscar casco",
      signal: "casco naranja con rango H-S conocido",
      nuisance: "paredes naranjas + reflejos de baja saturación",
      metric: "IoU/recall de región + falsos positivos por escena",
      candidates: [
        { id: "backproject", label: "Hist H-S en ROI → backprojection → morfología → componentes", fit: 3, verdict: "Baseline medible", risk: "El color no distingue pared y casco; añade geometría o un clasificador si los falsos positivos importan." },
        { id: "rgb", label: "Histogramas R/G/B separados → elegir caja", fit: 1, verdict: "Relación perdida", risk: "Los marginales no conservan las combinaciones de canal ni proporcionan una caja por sí solos." },
        { id: "clahe", label: "CLAHE fuerte → cualquier píxel naranja", fit: 0, verdict: "Cambio de dominio", risk: "Puede alterar la distribución cromática y amplificar reflejos sin aportar semántica." },
      ],
    },
  };
  const [scenarioId, setScenarioId] = useState<keyof typeof scenarios>("pills");
  const scenario = scenarios[scenarioId];
  const [candidateId, setCandidateId] = useState(scenario.candidates[0].id);
  const candidate = scenario.candidates.find((item) => item.id === candidateId) ?? scenario.candidates[0];

  function chooseScenario(value: string) {
    const next = value as keyof typeof scenarios;
    setScenarioId(next);
    setCandidateId(scenarios[next].candidates[0].id);
  }

  return (
    <>
      <LabChoice
        name="escenario-histograma"
        value={scenarioId}
        onChange={chooseScenario}
        values={Object.entries(scenarios).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className="pipeline-contract">
        <div><span>SEÑAL ÚTIL</span><strong>{scenario.signal}</strong></div>
        <div><span>PERTURBACIÓN</span><strong>{scenario.nuisance}</strong></div>
        <div><span>DECIDE CON</span><strong>{scenario.metric}</strong></div>
      </div>
      <LabChoice
        name={"candidato-" + scenarioId}
        value={candidate.id}
        onChange={setCandidateId}
        values={scenario.candidates.map((item) => ({ value: item.id, label: item.label }))}
      />
      <div className="pipeline-verdict" data-fit={candidate.fit}>
        <span>{candidate.verdict}</span>
        <strong>{candidate.label}</strong>
        <p>{candidate.risk}</p>
      </div>
      <div className="architecture-checklist">
        <span>01 · supuesto</span><span>02 · escala</span><span>03 · baseline</span><span>04 · ablación</span><span>05 · métrica final</span>
      </div>
      <p className="lab-caption">Una respuesta de entrevista sólida propone el experimento que decidirá, no solo una cadena de funciones.</p>
    </>
  );
}

function makeFootprint(kind: FootprintKind, size: number) {
  const radius = Math.floor(size / 2);
  return Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => {
    const dx = Math.abs(x - radius);
    const dy = Math.abs(y - radius);
    if (kind === "rect") return true;
    if (kind === "cross") return dx === 0 || dy === 0;
    return dx + dy <= radius;
  }));
}

function binaryMorph(
  image: boolean[][],
  footprint: boolean[][],
  operation: "erode" | "dilate",
  iterations = 1,
) {
  let current = image.map((row) => [...row]);
  const radiusY = Math.floor(footprint.length / 2);
  const radiusX = Math.floor(footprint[0].length / 2);
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    current = current.map((row, y) => row.map((_, x) => {
      const samples: boolean[] = [];
      footprint.forEach((kernelRow, ky) => kernelRow.forEach((active, kx) => {
        if (active) samples.push(sampleBinary(current, x + kx - radiusX, y + ky - radiusY, false));
      }));
      return operation === "erode" ? samples.every(Boolean) : samples.some(Boolean);
    }));
  }
  return current;
}

function sampleBinary(image: boolean[][], x: number, y: number, fallback: boolean) {
  if (y < 0 || y >= image.length || x < 0 || x >= image[0].length) return fallback;
  return image[y][x];
}

function grayMorph(image: number[][], size: number, operation: "min" | "max") {
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
    return operation === "min" ? Math.min(...values) : Math.max(...values);
  }));
}

function grayOpen(image: number[][], size: number) {
  return grayMorph(grayMorph(image, size, "min"), size, "max");
}

function grayClose(image: number[][], size: number) {
  return grayMorph(grayMorph(image, size, "max"), size, "min");
}

function grayNeighborhood(image: number[][], x: number, y: number, size: number) {
  const radius = Math.floor(size / 2);
  return Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => {
    const sy = Math.max(0, Math.min(image.length - 1, y + row - radius));
    const sx = Math.max(0, Math.min(image[0].length - 1, x + col - radius));
    return image[sy][sx];
  }));
}

function labelComponents(image: boolean[][], connectivity: 4 | 8) {
  const labels = image.map((row) => row.map(() => 0));
  const directions = connectivity === 4
    ? [[0, -1], [-1, 0], [1, 0], [0, 1]]
    : [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  let count = 0;
  image.forEach((row, y) => row.forEach((active, x) => {
    if (!active || labels[y][x] !== 0) return;
    count += 1;
    labels[y][x] = count;
    const queue: Array<[number, number]> = [[x, y]];
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const [cx, cy] = queue[cursor];
      directions.forEach(([dx, dy]) => {
        const nx = cx + dx;
        const ny = cy + dy;
        if (ny < 0 || ny >= image.length || nx < 0 || nx >= row.length) return;
        if (!image[ny][nx] || labels[ny][nx] !== 0) return;
        labels[ny][nx] = count;
        queue.push([nx, ny]);
      });
    }
  }));
  return { labels, count };
}

function componentStats(labels: number[][], target: number) {
  const coordinates: Array<{ x: number; y: number }> = [];
  labels.forEach((row, y) => row.forEach((label, x) => {
    if (label === target) coordinates.push({ x, y });
  }));
  if (coordinates.length === 0) return null;
  const xs = coordinates.map((item) => item.x);
  const ys = coordinates.map((item) => item.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return {
    area: coordinates.length,
    left,
    top,
    width: Math.max(...xs) - left + 1,
    height: Math.max(...ys) - top + 1,
    centroidX: xs.reduce((sum, value) => sum + value, 0) / xs.length,
    centroidY: ys.reduce((sum, value) => sum + value, 0) / ys.length,
  };
}

function calculateHistogram(values: number[], bins: number) {
  const histogram = Array(bins).fill(0) as number[];
  values.forEach((value) => {
    const index = Math.min(bins - 1, Math.max(0, Math.floor(clamp(value) * bins / 256)));
    histogram[index] += 1;
  });
  return histogram;
}

function equalizationMap(values: number[]) {
  const histogram = calculateHistogram(values, 256);
  const cdf: number[] = [];
  histogram.reduce((sum, value, index) => {
    cdf[index] = sum + value;
    return cdf[index];
  }, 0);
  const first = cdf.find((value) => value > 0) ?? 0;
  const denominator = Math.max(1, values.length - first);
  return cdf.map((value) => clamp(Math.round((value - first) * 255 / denominator)));
}

function equalizeImage(image: number[][]) {
  const map = equalizationMap(image.flat());
  return image.map((row) => row.map((value) => map[clamp(Math.round(value))]));
}

function stretchMap(values: number[]) {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const denominator = Math.max(1, maximum - minimum);
  return Array.from({ length: 256 }, (_, value) => clamp(Math.round((value - minimum) * 255 / denominator)));
}

function stretchImage(image: number[][]) {
  const map = stretchMap(image.flat());
  return image.map((row) => row.map((value) => map[clamp(Math.round(value))]));
}

function applyEducationalClahe(image: number[][], tileCount: number, clipLimit: number, interpolate: boolean) {
  const height = image.length;
  const width = image[0].length;
  const bins = 16;
  const tileWidth = width / tileCount;
  const tileHeight = height / tileCount;
  const maps = Array.from({ length: tileCount }, (_, ty) => Array.from({ length: tileCount }, (_, tx) => {
    const values: number[] = [];
    const startY = Math.floor(ty * tileHeight);
    const endY = Math.floor((ty + 1) * tileHeight);
    const startX = Math.floor(tx * tileWidth);
    const endX = Math.floor((tx + 1) * tileWidth);
    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) values.push(image[y][x]);
    }
    const histogram = calculateHistogram(values, bins);
    const threshold = Math.max(1, clipLimit * values.length / bins);
    let excess = 0;
    const clipped = histogram.map((value) => {
      excess += Math.max(0, value - threshold);
      return Math.min(value, threshold);
    });
    const shared = excess / bins;
    let cumulative = 0;
    return clipped.map((value) => {
      cumulative += value + shared;
      return clamp(cumulative * 255 / values.length);
    });
  }));

  const lookup = (tx: number, ty: number, value: number) => {
    const safeX = Math.max(0, Math.min(tileCount - 1, tx));
    const safeY = Math.max(0, Math.min(tileCount - 1, ty));
    const bin = Math.min(bins - 1, Math.floor(clamp(value) * bins / 256));
    return maps[safeY][safeX][bin];
  };

  return image.map((row, y) => row.map((value, x) => {
    if (!interpolate) {
      return lookup(Math.floor(x / tileWidth), Math.floor(y / tileHeight), value);
    }
    const gx = (x + 0.5) / tileWidth - 0.5;
    const gy = (y + 0.5) / tileHeight - 0.5;
    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const fx = gx - x0;
    const fy = gy - y0;
    const top = lookup(x0, y0, value) * (1 - fx) + lookup(x0 + 1, y0, value) * fx;
    const bottom = lookup(x0, y0 + 1, value) * (1 - fx) + lookup(x0 + 1, y0 + 1, value) * fx;
    return top * (1 - fy) + bottom * fy;
  }));
}

function tileSeamScore(image: number[][], tiles: number) {
  const boundariesX = Array.from({ length: tiles - 1 }, (_, index) => Math.floor((index + 1) * image[0].length / tiles));
  const boundariesY = Array.from({ length: tiles - 1 }, (_, index) => Math.floor((index + 1) * image.length / tiles));
  const differences: number[] = [];
  boundariesX.forEach((x) => image.forEach((row) => differences.push(Math.abs(row[x] - row[x - 1]))));
  boundariesY.forEach((y) => image[0].forEach((_, x) => differences.push(Math.abs(image[y][x] - image[y - 1][x]))));
  return differences.reduce((sum, value) => sum + value, 0) / Math.max(1, differences.length);
}

function localContrast(image: number[][]) {
  const differences: number[] = [];
  image.forEach((row, y) => row.forEach((value, x) => {
    if (x > 0) differences.push(Math.abs(value - row[x - 1]));
    if (y > 0) differences.push(Math.abs(value - image[y - 1][x]));
  }));
  return differences.reduce((sum, value) => sum + value, 0) / differences.length;
}

function makeStructuringScene() {
  return Array.from({ length: 7 }, (_, y) => Array.from({ length: 9 }, (_, x) => (
    x >= 2 && x <= 6 && y >= 1 && y <= 5
    && !(x === 2 && y === 1)
    && !(x === 6 && y === 5)
  )));
}

function makeErosionScene() {
  const image = Array.from({ length: 9 }, () => Array(11).fill(false) as boolean[]);
  for (let y = 2; y <= 6; y += 1) {
    for (let x = 2; x <= 8; x += 1) image[y][x] = true;
  }
  image[4][5] = false;
  image[1][1] = true;
  image[7][9] = true;
  image[4][9] = true;
  return image;
}

function makeDilationScene() {
  const image = Array.from({ length: 9 }, () => Array(11).fill(false) as boolean[]);
  for (let y = 2; y <= 4; y += 1) {
    for (let x = 1; x <= 3; x += 1) image[y][x] = true;
    for (let x = 6; x <= 8; x += 1) image[y][x] = true;
  }
  for (let x = 3; x <= 7; x += 1) {
    if (x !== 5) image[7][x] = true;
  }
  image[1][10] = true;
  return image;
}

function makeOpenCloseScene() {
  const image = Array.from({ length: 9 }, () => Array(11).fill(false) as boolean[]);
  for (let y = 2; y <= 6; y += 1) {
    for (let x = 2; x <= 8; x += 1) image[y][x] = true;
  }
  image[4][5] = false;
  image[1][1] = true;
  image[7][9] = true;
  image[4][9] = true;
  image[4][10] = true;
  return image;
}

function makeResidualScene() {
  return Array.from({ length: 8 }, (_, y) => Array.from({ length: 11 }, (_, x) => {
    let value = 46 + x * 4 + y * 2;
    if (x >= 3 && x <= 8 && y >= 2 && y <= 6) value += 72;
    if ((x === 2 && y === 1) || (x === 9 && y === 3)) value += 120;
    if ((x === 5 && y === 4) || (x === 7 && y === 5)) value -= 105;
    return clamp(value);
  }));
}

function makeGrayscaleScene() {
  return [
    [32, 38, 44, 52, 61, 70, 78],
    [36, 46, 58, 74, 86, 92, 84],
    [42, 55, 82, 128, 112, 96, 88],
    [48, 70, 118, 242, 150, 104, 92],
    [44, 62, 94, 140, 18, 98, 86],
    [38, 52, 68, 82, 90, 84, 76],
    [30, 40, 48, 56, 64, 68, 70],
  ];
}

function makeComponentsScene() {
  return [
    [false, true, true, false, false, false, false, false, false],
    [false, true, true, false, true, false, false, true, false],
    [false, false, false, true, false, false, true, true, false],
    [true, true, false, false, false, false, false, false, false],
    [true, true, false, false, true, true, false, false, false],
    [false, false, false, false, true, true, false, true, false],
    [false, true, true, false, false, false, true, false, false],
    [false, true, true, false, false, false, false, false, false],
  ];
}

function makeHistogramScene() {
  const palette = [28, 62, 98, 132, 166, 198, 224, 246];
  return Array.from({ length: 8 }, (_, y) => Array.from({ length: 8 }, (_, x) => (
    palette[(Math.floor(x / 2) + Math.floor(y / 2) * 2) % palette.length]
  )));
}

function deterministicShuffle(values: number[]) {
  return values.map((_, index) => values[(index * 37 + 11) % values.length]);
}

function reshape(values: number[], rows: number, columns: number) {
  return Array.from({ length: rows }, (_, y) => values.slice(y * columns, (y + 1) * columns));
}

function makeColorScene() {
  return Array.from({ length: 48 }, (_, index) => {
    const x = index % 8;
    const y = Math.floor(index / 8);
    const roi = x >= 2 && x <= 5 && y >= 2 && y <= 4;
    if (roi) {
      return {
        h: 18 + ((x + y) % 4) * 4,
        s: 0.72 + ((x * 3 + y) % 3) * 0.08,
        l: 44 + ((x + y) % 2) * 8,
        roi,
      };
    }
    const hues = [205, 190, 42, 28, 214, 152, 25, 330];
    return {
      h: hues[(x + y * 3) % hues.length],
      s: 0.16 + ((x * 5 + y * 7) % 7) * 0.1,
      l: 32 + ((x + y) % 4) * 10,
      roi,
    };
  });
}

function makeLowContrastScene(range: number) {
  const low = 128 - range / 2;
  return Array.from({ length: 8 }, (_, y) => Array.from({ length: 8 }, (_, x) => {
    const radial = Math.max(0, 1 - Math.hypot(x - 3.5, y - 3.5) / 5);
    const bands = ((x * 7 + y * 11) % 9) / 9;
    return Math.round(low + range * (0.16 + 0.62 * radial + 0.22 * bands));
  }));
}

function makeClaheScene() {
  return Array.from({ length: 12 }, (_, y) => Array.from({ length: 12 }, (_, x) => {
    const illumination = 28 + x * 12;
    const object = x >= 3 && x <= 8 && y >= 3 && y <= 8 ? 28 : 0;
    const darkDetail = x >= 5 && x <= 6 && y >= 5 && y <= 6 ? -18 : 0;
    const noise = ((x * 13 + y * 17) % 13) - 6;
    return clamp(illumination + object + darkDetail + noise);
  }));
}

function countForeground(image: boolean[][]) {
  return image.flat().filter(Boolean).length;
}

function binaryDifference(left: boolean[][], right: boolean[][]) {
  const rightValues = right.flat();
  return left.flat().filter((value, index) => value !== rightValues[index]).length;
}

function clamp(value: number) {
  return Math.max(0, Math.min(255, value));
}

function format(value: number, digits = 1) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
