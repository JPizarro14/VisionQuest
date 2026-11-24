"use client";

import Link from "@/components/document-link";
import { ArrowDown, ArrowRight, BookOpen, Check, CircuitBoard, ClipboardCheck, Database, Focus, Layers3, LockKeyhole, RadioTower, ScanLine, SlidersHorizontal } from "lucide-react";
import { stages } from "./curriculum";
import { useNotebook } from "./notebook";
import { StationBanner } from "./station-banner";

export const stageIcons = [ScanLine, Database, SlidersHorizontal, Layers3, CircuitBoard, ClipboardCheck, RadioTower];
export const folio = (index: number) => String(index + 1).padStart(2, "0");

const legs = [
  { title: "Preparar la señal", start: 0, end: 3 },
  { title: "Construir el modelo", start: 3, end: 5 },
  { title: "Decidir y operar", start: 5, end: stages.length },
];

export function RouteMap() {
  const { pending, ready } = useNotebook();
  const complete = pending === stages.length;
  const target = stages[complete ? 0 : pending];
  return <main id="cuaderno" className="fb-wrap fb-home-body">
      <StationBanner variant="portada" code="00" eyebrow={<><Focus /> Estación de observación</>} title={<>De la imagen<br/><em>a la decisión.</em></>}>
        <p>Sigue una pieza por una línea de inspección. Aprende qué hace cada operación, cuándo elegirla y cómo comprobar si funciona.</p>
        <div className="fb-actions"><Link href={`/etapas/${target.id}`} className="fb-primary">{!ready || !pending ? "Empezar la primera etapa" : complete ? "Volver a estudiar" : `Continuar etapa ${folio(pending)}`} <ArrowRight /></Link>
          <a className="fb-text-link" href="#itinerario">Ver etapas <ArrowDown /></a></div>
      </StationBanner>
      <section className="fb-orientation" aria-label="Mapa de una página">
        <div><ScanLine aria-hidden="true"/><span className="fb-kicker">01 / Inferencia</span><h2>Seguir una imagen</h2><p>Cámara → tensor → modelo → predicción → decisión. Los pesos no cambian al usarlo.</p></div>
        <div><CircuitBoard aria-hidden="true"/><span className="fb-kicker">02 / Entrenamiento</span><h2>Seguir un lote</h2><p>Ejemplos y etiquetas → pérdida media → gradientes → actualización. El siguiente lote usa los pesos nuevos.</p></div>
      </section>
      <section id="itinerario" aria-labelledby="fb-map-title">
        <div className="fb-map-heading"><div><span className="fb-kicker">Guía de estudio</span><h2 id="fb-map-title">Tu recorrido por etapas</h2></div>
          <div className="fb-meter"><span>{pending} de {stages.length} superadas</span><progress value={pending} max={stages.length} aria-label="Etapas superadas" /></div></div>
        <p className="fb-intro">{complete ? "Has completado el recorrido. Vuelve a tus apuntes, repite un caso o explora la biblioteca." : "Lee, resuelve un caso con tus palabras, toma apuntes y compruébalo con un test. El avance depende de lo que entiendes, no de un calendario."}</p>
        <div className="fb-phases">{legs.map(({ title, start, end }, phase) => <section key={title} className="fb-phase" aria-label={title}>
          <header><span className="fb-kicker">Tramo {folio(phase)}</span><h3>{title}</h3></header>
          <ol className="fb-map-list" start={start + 1}>{stages.slice(start, end).map((stage, offset) => {
          const i = start + offset;
          const Icon = stageIcons[i]; const locked = i > pending; const done = i < pending;
          const content = <><span className="fb-stamp"><Icon /></span>
            <span className="fb-card-copy"><small>ETAPA {folio(i)}</small><strong>{stage.title}</strong><span>{stage.question}</span></span>
            <span className="fb-status">{locked ? <><LockKeyhole /> Pendiente</> : done ? <><Check /> Repasar</> : <>Estudiar <ArrowRight /></>}</span></>;
          return <li key={stage.id} data-state={locked ? "locked" : done ? "done" : "current"}>{locked
            ? <div className="fb-map-card" aria-label={`Etapa ${i + 1}, pendiente de la anterior`}>{content}</div>
            : <Link className="fb-map-card" href={`/etapas/${stage.id}`}>{content}</Link>}</li>;
        })}</ol></section>)}</div>
      </section>
      <aside className="fb-library-note"><div><span className="fb-kicker"><BookOpen /> Archivo de la estación</span><h2>Biblioteca y práctica libre</h2><p>Consulta las misiones clásicas, tus apuntes anteriores y los ejercicios por sector. No son requisitos para avanzar en esta ruta.</p></div><Link className="fb-secondary" href="/biblioteca">Explorar biblioteca <ArrowRight /></Link></aside>
  </main>;
}
