"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Crosshair, Grid3X3, ScanLine } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { SectorLesson } from "@/app/course-data";
import { FilterLab } from "@/app/filter-labs";
import { MathLab } from "@/app/math-labs";
import { MorphologyLab } from "@/app/morphology-labs";
import { GeometryLab } from "@/app/geometry-labs";
import { StudyLab } from "@/app/study-labs";
import { DetectionLab } from "@/app/detection-labs";
import { MaskIouLab } from "@/app/mask-iou-lab";

const initialPixels = [
  [18, 28, 44, 72, 98, 118],
  [26, 50, 86, 126, 150, 132],
  [44, 92, 148, 205, 228, 172],
  [58, 126, 202, 246, 220, 154],
  [36, 88, 160, 210, 176, 108],
  [20, 42, 78, 112, 94, 52],
];

type LessonLabProps = Pick<SectorLesson, "id" | "lab" | "labTitle" | "labInstruction">;

export function LessonLab({ id, lab, labTitle, labInstruction }: LessonLabProps) {
  return (
    <section className="pixel-lab" aria-labelledby={`lab-${lab}`}>
      <div className="lab-heading">
        <div>
          <span className="eyebrow">MICROLAB · EN VIVO</span>
          <h2 id={`lab-${lab}`}>{labTitle}</h2>
        </div>
        <Grid3X3 aria-hidden="true" />
      </div>
      <p className="lab-instruction">{labInstruction}</p>
      {lab === "matrix" && <MatrixLab />}
      {lab === "coordinates" && <CoordinateLab />}
      {lab === "bit-depth" && <BitDepthLab />}
      {lab === "channels" && <ChannelLab />}
      {lab === "color-space" && <ColorSpaceLab />}
      {lab === "sampling" && <SamplingLab />}
      {lab === "tensor" && <TensorLab />}
      <MathLab lab={lab} />
      <FilterLab lab={lab} />
      <MorphologyLab lab={lab} />
      <GeometryLab lab={lab} />
      <DetectionLab lab={lab} />
      {lab === "seg-mask-iou" && <MaskIouLab />}
      {lab === "study-simulation" && <StudyLab lessonId={id} />}
    </section>
  );
}

function MatrixLab() {
  const [pixels, setPixels] = useState(initialPixels);
  const [selected, setSelected] = useState({ row: 2, col: 3 });
  const value = pixels[selected.row][selected.col];

  function updatePixel(next: number[]) {
    setPixels((current) =>
      current.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === selected.row && colIndex === selected.col ? next[0] : cell,
        ),
      ),
    );
  }

  return (
    <>
      <div className="pixel-matrix" role="grid" aria-label="Matriz de intensidades">
        {pixels.map((row, rowIndex) => row.map((cell, colIndex) => {
          const isSelected = selected.row === rowIndex && selected.col === colIndex;
          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              aria-label={`Píxel ${colIndex}, ${rowIndex}: intensidad ${cell}`}
              className={isSelected ? "is-selected" : ""}
              style={{
                backgroundColor: `rgb(${cell} ${cell} ${cell})`,
                color: cell > 145 ? "#101719" : "#f4f1e8",
              }}
              onClick={() => setSelected({ row: rowIndex, col: colIndex })}
            >
              {cell}
            </button>
          );
        }))}
      </div>
      <div className="pixel-console">
        <div className="console-readout">
          <Crosshair aria-hidden="true" />
          <span>PÍXEL ({selected.col}, {selected.row})</span>
          <strong>{value}</strong>
        </div>
        <dl>
          <div><dt>Fila / y</dt><dd>{selected.row}</dd></div>
          <div><dt>Columna / x</dt><dd>{selected.col}</dd></div>
          <div><dt>Intensidad</dt><dd>{value} / 255</dd></div>
        </dl>
        <Label htmlFor="matrix-intensity">Oscuro ← intensidad → claro</Label>
        <Slider id="matrix-intensity" min={0} max={255} step={1} value={[value]} onValueChange={updatePixel} aria-label="Intensidad del píxel seleccionado" />
        <div className="intensity-scale" aria-hidden="true"><span>0</span><span>255</span></div>
      </div>
    </>
  );
}

function CoordinateLab() {
  const width = 8;
  const height = 6;
  const [selected, setSelected] = useState({ x: 5, y: 2 });
  const x1 = Math.min(selected.x, width - 3);
  const y1 = Math.min(selected.y, height - 3);

  return (
    <>
      <div className="coordinate-stage">
        <span className="axis-label axis-x">x / columnas →</span>
        <span className="axis-label axis-y">y / filas →</span>
        <div className="coordinate-grid" role="grid" aria-label="Cuadrícula de coordenadas" style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}>
          {Array.from({ length: width * height }, (_, index) => {
            const x = index % width;
            const y = Math.floor(index / width);
            const active = x === selected.x && y === selected.y;
            const inRoi = x >= x1 && x < x1 + 3 && y >= y1 && y < y1 + 3;
            return (
              <button
                key={`${x}-${y}`}
                type="button"
                role="gridcell"
                aria-label={`Coordenada x ${x}, y ${y}${inRoi ? ", dentro de la ROI" : ""}`}
                aria-selected={active}
                className={active ? "is-selected" : inRoi ? "in-roi" : ""}
                onClick={() => setSelected({ x, y })}
              >
                <span>{x},{y}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="lab-readout lab-readout-grid">
        <div><span>COORDENADA</span><strong>({selected.x}, {selected.y})</strong></div>
        <div><span>ACCESO MATRIZ</span><strong>img[{selected.y}, {selected.x}]</strong></div>
        <div><span>SHAPE (H, W)</span><strong>({height}, {width})</strong></div>
        <div><span>ÚLTIMO PÍXEL</span><strong>({width - 1}, {height - 1})</strong></div>
        <div><span>RECORTE ROI</span><strong>img[{y1}:{y1 + 3}, {x1}:{x1 + 3}]</strong></div>
        <div><span>ORIGEN GLOBAL ROI</span><strong>({x1}, {y1}) · local (0, 0)</strong></div>
      </div>
    </>
  );
}

function BitDepthLab() {
  const [bits, setBits] = useState("4");
  const [sourceValue, setSourceValue] = useState(173);
  const levelCount = 2 ** Number(bits);
  const step = 255 / (levelCount - 1);
  const quantized = Math.round(sourceValue / step) * step;
  const displayCount = Math.min(levelCount, 16);

  return (
    <>
      <RadioGroup value={bits} onValueChange={setBits} className="choice-row" aria-label="Profundidad de bits">
        {["1", "2", "4", "8"].map((option) => (
          <Label key={option} htmlFor={`bits-${option}`} className="console-choice">
            <RadioGroupItem id={`bits-${option}`} value={option} />
            <span>{option} bit{option === "1" ? "" : "s"}</span>
          </Label>
        ))}
      </RadioGroup>
      <div className="tone-ramp" aria-label={`${levelCount} niveles disponibles`}>
        {Array.from({ length: displayCount }, (_, index) => {
          const value = Math.round(index * 255 / Math.max(1, displayCount - 1));
          return <span key={index} style={{ background: `rgb(${value} ${value} ${value})` }} />;
        })}
      </div>
      <div className="pixel-console compact-console">
        <div className="console-stat"><span>NIVELES REALES</span><strong>{levelCount.toLocaleString("es-ES")}</strong></div>
        <Label htmlFor="source-value">Valor original: {sourceValue}</Label>
        <Slider id="source-value" min={0} max={255} step={1} value={[sourceValue]} onValueChange={(value) => setSourceValue(value[0])} />
        <div className="quantization-result">
          <div><span>ORIGINAL</span><strong>{sourceValue}</strong></div>
          <div aria-hidden="true">→</div>
          <div><span>CUANTIZADO</span><strong>{Math.round(quantized)}</strong></div>
        </div>
      </div>
      <p className="lab-caption">La rampa muestra como máximo 16 muestras para que pueda leerse; el contador indica todos los niveles disponibles.</p>
    </>
  );
}

function ChannelLab() {
  const [rgb, setRgb] = useState({ r: 190, g: 92, b: 42 });
  const channels = [
    { key: "r" as const, label: "Rojo", color: "#d75f55" },
    { key: "g" as const, label: "Verde", color: "#61a776" },
    { key: "b" as const, label: "Azul", color: "#5e86c7" },
  ];
  const hex = `#${[rgb.r, rgb.g, rgb.b].map((value) => value.toString(16).padStart(2, "0")).join("")}`.toUpperCase();

  return (
    <>
      <div className="color-result" style={{ backgroundColor: `rgb(${rgb.r} ${rgb.g} ${rgb.b})` }}>
        <span>RGB({rgb.r}, {rgb.g}, {rgb.b})</span>
        <strong>{hex}</strong>
      </div>
      <div className="channel-controls">
        {channels.map((channel) => (
          <div className="channel-control" key={channel.key}>
            <div><Label htmlFor={`channel-${channel.key}`}>{channel.label}</Label><strong>{rgb[channel.key]}</strong></div>
            <Slider
              id={`channel-${channel.key}`}
              min={0}
              max={255}
              value={[rgb[channel.key]]}
              onValueChange={(value) => setRgb((current) => ({ ...current, [channel.key]: value[0] }))}
              style={{ "--channel-color": channel.color } as CSSProperties}
            />
          </div>
        ))}
      </div>
      <div className="channel-plates" aria-label="Intensidad separada por canal">
        {channels.map((channel) => (
          <div key={channel.key} style={{ backgroundColor: `rgb(${channel.key === "r" ? rgb.r : 0} ${channel.key === "g" ? rgb.g : 0} ${channel.key === "b" ? rgb.b : 0})` }}>
            <span>{channel.key.toUpperCase()}</span><strong>{rgb[channel.key]}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

function ColorSpaceLab() {
  const [rgb, setRgb] = useState({ r: 52, g: 146, b: 132 });
  const hsv = useMemo(() => rgbToHsv(rgb.r, rgb.g, rgb.b), [rgb]);
  const luma = Math.round(0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b);

  return (
    <>
      <div className="color-result space-result" style={{ backgroundColor: `rgb(${rgb.r} ${rgb.g} ${rgb.b})` }}>
        <span>MISMO COLOR</span><strong>RGB({rgb.r}, {rgb.g}, {rgb.b})</strong>
      </div>
      <div className="channel-controls compact-channels">
        {(["r", "g", "b"] as const).map((channel) => (
          <div className="channel-control" key={channel}>
            <div><Label htmlFor={`space-${channel}`}>{channel.toUpperCase()}</Label><strong>{rgb[channel]}</strong></div>
            <Slider id={`space-${channel}`} min={0} max={255} value={[rgb[channel]]} onValueChange={(value) => setRgb((current) => ({ ...current, [channel]: value[0] }))} />
          </div>
        ))}
      </div>
      <div className="space-values">
        <div><span>TONO H</span><strong>{Math.round(hsv.h)}°</strong><small>OpenCV uint8: {Math.round(hsv.h / 2)}</small></div>
        <div><span>SATURACIÓN S</span><strong>{Math.round(hsv.s)}%</strong><small>pureza del color</small></div>
        <div><span>VALOR V</span><strong>{Math.round(hsv.v)}%</strong><small>brillo máximo</small></div>
        <div><span>LUMA APROX.</span><strong>{luma}</strong><small>peso perceptual</small></div>
      </div>
    </>
  );
}

function SamplingLab() {
  const [factor, setFactor] = useState("2");
  const [antiAlias, setAntiAlias] = useState(false);
  const sourceSize = 12;
  const step = Number(factor);
  const outputSize = sourceSize / step;
  const source = useMemo(() => Array.from({ length: sourceSize * sourceSize }, (_, index) => {
    const x = index % sourceSize;
    const y = Math.floor(index / sourceSize);
    return ((x * 2 + y) % 5) < 2 ? 238 : 22;
  }), []);
  const output = useMemo(() => {
    const values: number[] = [];
    for (let oy = 0; oy < outputSize; oy += 1) {
      for (let ox = 0; ox < outputSize; ox += 1) {
        const block: number[] = [];
        for (let y = 0; y < step; y += 1) {
          for (let x = 0; x < step; x += 1) {
            block.push(source[(oy * step + y) * sourceSize + (ox * step + x)]);
          }
        }
        values.push(antiAlias ? block.reduce((sum, value) => sum + value, 0) / block.length : block[0]);
      }
    }
    return values;
  }, [antiAlias, outputSize, source, step]);

  return (
    <>
      <div className="sampling-controls">
        <RadioGroup value={factor} onValueChange={setFactor} className="choice-row" aria-label="Factor de reducción">
          {["1", "2", "3", "4"].map((option) => (
            <Label key={option} htmlFor={`sample-${option}`} className="console-choice">
              <RadioGroupItem id={`sample-${option}`} value={option} />
              <span>÷ {option}</span>
            </Label>
          ))}
        </RadioGroup>
        <Label htmlFor="anti-alias" className="switch-label"><Switch id="anti-alias" checked={antiAlias} onCheckedChange={setAntiAlias} /> Suavizado previo</Label>
      </div>
      <div className="sampling-comparison">
        <div>
          <span className="mini-label">ORIGINAL · 12 × 12</span>
          <div className="sample-grid" style={{ gridTemplateColumns: `repeat(${sourceSize}, 1fr)` }}>
            {source.map((value, index) => <span key={index} style={{ background: `rgb(${value} ${value} ${value})` }} />)}
          </div>
        </div>
        <div className="sample-arrow" aria-hidden="true">→</div>
        <div>
          <span className="mini-label">MUESTRA · {outputSize} × {outputSize}</span>
          <div className="sample-grid output-grid" style={{ gridTemplateColumns: `repeat(${outputSize}, 1fr)` }}>
            {output.map((value, index) => <span key={index} style={{ background: `rgb(${value} ${value} ${value})` }} />)}
          </div>
        </div>
      </div>
      <p className="lab-caption">Sin suavizado se conserva una única muestra de cada bloque; con suavizado se representa su promedio.</p>
    </>
  );
}

function TensorLab() {
  const [layout, setLayout] = useState("NCHW");
  const [batch, setBatch] = useState("8");
  const dimensions: Record<string, string> = {
    HWC: "(224, 224, 3)",
    CHW: "(3, 224, 224)",
    NCHW: `(${batch}, 3, 224, 224)`,
    NHWC: `(${batch}, 224, 224, 3)`,
  };
  const labels: Record<string, string[]> = {
    HWC: ["Height (alto)", "Width (ancho)", "Channels (canales)"],
    CHW: ["Channels (canales)", "Height (alto)", "Width (ancho)"],
    NCHW: ["Batch (lote)", "Channels (canales)", "Height (alto)", "Width (ancho)"],
    NHWC: ["Batch (lote)", "Height (alto)", "Width (ancho)", "Channels (canales)"],
  };

  return (
    <>
      <span className="mini-label">DISPOSICIÓN</span>
      <RadioGroup value={layout} onValueChange={setLayout} className="choice-row layout-choices" aria-label="Disposición de ejes">
        {["HWC", "CHW", "NCHW", "NHWC"].map((option) => (
          <Label key={option} htmlFor={`layout-${option}`} className="console-choice">
            <RadioGroupItem id={`layout-${option}`} value={option} />
            <span>{option}</span>
          </Label>
        ))}
      </RadioGroup>
      {(layout === "NCHW" || layout === "NHWC") && (
        <div className="batch-row">
          <span className="mini-label">TAMAÑO DEL LOTE</span>
          <RadioGroup value={batch} onValueChange={setBatch} className="choice-row" aria-label="Tamaño del lote">
            {["1", "8", "16"].map((option) => (
              <Label key={option} htmlFor={`batch-${option}`} className="console-choice compact-choice">
                <RadioGroupItem id={`batch-${option}`} value={option} />
                <span>{option}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}
      <div className="tensor-display">
        <span>SHAPE RESULTANTE</span>
        <strong>{dimensions[layout]}</strong>
        <div className="axis-chips">
          {labels[layout].map((label, index) => <span key={`${label}-${index}`}>{layout[index]} · {label}</span>)}
        </div>
      </div>
      <div className="field-note inline-note">
        <ScanLine aria-hidden="true" />
        <p><strong>Contrato:</strong> imagen RGB de 224 × 224 con H = Height (alto), W = Width (ancho) y C = Channels (canales); uint8 o float según el pipeline. La shape por sí sola no especifica rango ni normalización.</p>
      </div>
    </>
  );
}

function rgbToHsv(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * ((blue - red) / delta + 2);
    else hue = 60 * ((red - green) / delta + 4);
  }
  if (hue < 0) hue += 360;

  return {
    h: hue,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  };
}
