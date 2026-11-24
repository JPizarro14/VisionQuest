"use client";

import { useState } from "react";

const width = 24, height = 14;
const patch = Array.from({ length: width * height }, (_, i) => {
  const x = i % width, y = Math.floor(i / width);
  if (i === 78 || i === 231) return 250;
  if (x === 8 + Math.floor(y / 3) && y > 1 && y < 12) return 95;
  return 110 + (x + y) % 5;
});
const stretch = patch.map(v => Math.min(255, Math.max(0, Math.round((v - 90) * 255 / 40))));
const median = patch.map((_, i) => {
  const neighbors = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    const x = Math.max(0, Math.min(width - 1, i % width + dx));
    const y = Math.max(0, Math.min(height - 1, Math.floor(i / width) + dy));
    neighbors.push(patch[y * width + x]);
  }
  return neighbors.sort((a,b) => a-b)[4];
});
function Sample({ values, caption }: { values: number[]; caption: string }) {
  return <figure><svg viewBox={`0 0 ${width} ${height}`} shapeRendering="crispEdges" role="img" aria-label={caption}>
    {values.map((v,i) => <rect key={i} x={i % width} y={Math.floor(i / width)} width="1" height="1" fill={`rgb(${v},${v},${v})`} />)}
  </svg><figcaption>{caption}</figcaption></figure>;
}
export function FilterExample() {
  const [contrast, setContrast] = useState(true);
  return <section className="fb-demo"><span className="fb-kicker">Laboratorio visual / Misma entrada</span>
    <h3>Contraste no es lo mismo que quitar ruido</h3>
    <p>Esta muestra sintética contiene una grieta de un píxel y dos puntos blancos aislados. Elige una operación y compara la misma región.</p>
    <div className="fb-switches">
      <button type="button" aria-pressed={contrast} onClick={() => setContrast(true)}>Estirar contraste</button>
      <button type="button" aria-pressed={!contrast} onClick={() => setContrast(false)}>Mediana 3 × 3</button>
    </div><div className="fb-samples"><Sample values={patch} caption="Antes · original" />
      <Sample values={contrast ? stretch : median} caption={contrast ? "Después · contraste" : "Después · mediana"} /></div>
    <p aria-live="polite">{contrast
      ? "El estiramiento lineal lleva 90 a negro y 130 a blanco, limitando los extremos. Resalta la grieta, pero también la variación del fondo. No es CLAHE: aquí usamos el mismo intervalo en toda la imagen."
      : "La mediana conserva el valor central del vecindario ordenado. Los puntos blancos desaparecen, pero la grieta también: casi todos sus vecinos son fondo."}</p></section>;
}
const scores = [2, 1, -1];
const defects = ["Grieta", "Óxido", "Golpe"];
export function OutputExample() {
  const [exclusive, setExclusive] = useState(true);
  const exps = scores.map(z => Math.exp(z - Math.max(...scores)));
  const sum = exps.reduce((a,b) => a+b, 0);
  const values = exclusive ? exps.map(n => n / sum) : scores.map(z => 1 / (1 + Math.exp(-z)));
  return <section className="fb-demo"><span className="fb-kicker">Laboratorio visual / Misma puntuación</span>
    <h3>Cambia lo que preguntas a la salida</h3>
    <p>Mismos logits de ejemplo: [2, 1, −1]. Lo que cambia es el significado de las etiquetas.</p>
    <div className="fb-switches">
      <button type="button" aria-pressed={exclusive} onClick={() => setExclusive(true)}>Un defecto principal</button>
      <button type="button" aria-pressed={!exclusive} onClick={() => setExclusive(false)}>Pueden coexistir</button>
    </div><div aria-live="polite">{values.map((v,i) => <div className="fb-bar" key={defects[i]}><span>{defects[i]}</span>
      <meter min={0} max={1} value={v} aria-label={defects[i]} /><strong>{(100*v).toFixed(1).replace(".", ",")} %</strong></div>)}
    <p>{exclusive ? "Softmax reparte el 100 % entre clases excluyentes." : "Con sigmoides independientes pueden superarse a la vez los umbrales de grieta y óxido."} La transformación no garantiza calibración.</p></div></section>;
}
