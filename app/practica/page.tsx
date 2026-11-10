"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, RotateCcw, Target, XCircle } from "lucide-react";
import { allLessons, availableSectors } from "@/app/course-map";
import { practiceCounts, practiceItems } from "@/app/practice-bank";
import {
  createPracticeSession, getPracticeCandidates, PracticeHistoryError, restorePracticeHistory,
  type PracticeHistory, type PracticeMode,
} from "@/app/practice-session";
import type { PracticeItem } from "@/app/practice-types";
import "./practice.css";

type StoredProgress = { history: PracticeHistory; canSave: boolean; notice: string | null };
const historyKey = "visionquest-practice-history-v1";
const lessonNames = new Map(allLessons.map(lesson => [lesson.id, lesson.navTitle]));
const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

function readStoredProgress(): StoredProgress {
  if (typeof window === "undefined") return { history: {}, canSave: true, notice: null };
  try {
    const stored: unknown = JSON.parse(window.localStorage.getItem(historyKey) ?? "{}");
    return { history: restorePracticeHistory(stored, practiceItems), canSave: true, notice: null };
  } catch (error) {
    if (!(error instanceof SyntaxError) && !(error instanceof PracticeHistoryError) &&
        !(error instanceof DOMException)) throw error;
    return {
      history: {}, canSave: false,
      notice: `No se pudo recuperar el historial: ${error instanceof Error ? error.message : String(error)} Puedes practicar, pero el progreso de esta sesión no se guardará para no sobrescribirlo.`,
    };
  }
}

export default function PracticePage() {
  const [progress, setProgress] = useState<StoredProgress>(readStoredProgress);
  const loaded = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  const history = progress.history;
  const [sector, setSector] = useState("todos");
  const [mode, setMode] = useState<PracticeMode>("tema");
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [amount, setAmount] = useState(10);
  const [session, setSession] = useState<PracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState(0);
  const setupRef = useRef<HTMLHeadingElement>(null);
  const promptRef = useRef<HTMLHeadingElement>(null);
  const finishRef = useRef<HTMLHeadingElement>(null);

  const candidates = useMemo(
    () => getPracticeCandidates(practiceItems, sector, mode, history, unseenOnly),
    [sector, mode, history, unseenOnly],
  );
  const pending = practiceItems.filter(item => history[item.id]?.needsReview).length;
  const practiced = practiceItems.filter(item => history[item.id]?.attempts > 0).length;
  const active = session[index];
  const activeId = active?.id;
  const finished = session.length > 0 && index >= session.length;
  const studying = session.length > 0;
  const completeTopic = mode === "tema";
  const selectedSector = availableSectors.find(item => item.id === sector);

  useEffect(() => {
    if (!loaded) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    const heading = activeId ? promptRef.current : finished ? finishRef.current : setupRef.current;
    heading?.focus({ preventScroll: true });
  }, [activeId, finished, studying, loaded]);

  function start() {
    setSession(createPracticeSession(candidates, mode, amount));
    setIndex(0);
    setScore(0);
    setAnswer(null);
    setDraft("");
    setRevealed(false);
    setEvaluated(false);
  }
  function record(item: PracticeItem, mastered: boolean) {
    const old = history[item.id] ?? { attempts: 0, mistakes: 0, needsReview: false };
    const nextHistory: PracticeHistory = {
      ...history,
      [item.id]: {
        attempts: old.attempts + 1,
        mistakes: old.mistakes + Number(!mastered),
        needsReview: !mastered,
      },
    };
    let notice = progress.notice;
    if (progress.canSave) {
      try {
        window.localStorage.setItem(historyKey, JSON.stringify(nextHistory));
        notice = null;
      } catch (error) {
        if (!(error instanceof DOMException)) throw error;
        notice = `No se pudo guardar el progreso: ${error.message} Tus respuestas se mantienen durante esta sesión.`;
      }
    }
    setProgress({ history: nextHistory, canSave: progress.canSave, notice });
    if (mastered) setScore(current => current + 1);
  }
  function checkChoice() {
    if (!active || active.kind !== "choice" || answer === null || revealed) return;
    setRevealed(true);
    record(active, answer === active.correctIndex);
  }
  function assessOpen(mastered: boolean) {
    if (!active || active.kind !== "open" || !revealed || evaluated) return;
    setEvaluated(true);
    record(active, mastered);
  }
  function next() {
    if (!active || !(active.kind === "choice" ? revealed : evaluated)) return;
    setIndex(current => current + 1);
    setAnswer(null);
    setDraft("");
    setRevealed(false);
    setEvaluated(false);
  }
  function configure() {
    setSession([]);
    setIndex(0);
    setAnswer(null);
    setDraft("");
    setRevealed(false);
    setEvaluated(false);
  }

  return (
    <main className="practice-shell">
      <header className="practice-topbar">
        <Link className="practice-brand" href="/"><span className="brand-glyph">VQ</span><strong>VISIONQUEST</strong></Link>
        {studying
          ? <button className="practice-back" type="button" onClick={configure}><ArrowLeft aria-hidden="true" /> Configurar otra sesión</button>
          : <Link className="practice-back" href="/"><ArrowLeft aria-hidden="true" /> Volver al temario</Link>}
      </header>
      <div className={"practice-frame" + (studying ? " practice-frame-study" : "")}>
        {!loaded ? <p role="status">Cargando tu historial de práctica…</p> : <>
        {progress.notice && <p className="practice-storage-notice" role="alert">{progress.notice}</p>}
        {!studying && <>
        <div className="practice-heading">
          <span className="practice-eyebrow"><Target aria-hidden="true" /> ESTACIÓN DE ENTRENAMIENTO</span>
          <h1>Practica hasta poder explicarlo.</h1>
          <p>Preguntas de todo el curso, cálculos sin variantes repetidas, lectura y revisión de código, y casos para defender tus decisiones. Tu respuesta importa tanto como el acierto.</p>
        </div>
        <div className="practice-stats" aria-label="Contenido y progreso">
          <div><strong>{practiceCounts.total.toLocaleString("es-ES")}</strong><span>ejercicios disponibles</span></div>
          <div><strong>{practiceCounts.numerical}</strong><span>problemas de cálculo diferentes</span></div>
          <div><strong>{practiced}</strong><span>practicados en este navegador</span></div>
          <div><strong>{pending}</strong><span>por repasar</span></div>
        </div>

        <section className="practice-panel practice-config" aria-labelledby="practice-setup">
          <div>
            <span className="practice-eyebrow">CONFIGURA TU ESTUDIO</span>
            <h2 id="practice-setup" ref={setupRef} tabIndex={-1}>Tu sesión de práctica</h2>
            <p>Elige una ronda breve o estudia un tema completo. Hay un ejemplo por familia de cálculo y {practiceCounts.codeChoices} retos de lectura o revisión de código.</p>
          </div>
          <div className="practice-filters" data-complete-topic={completeTopic}>
            <label htmlFor="practice-sector">Sector
              <select id="practice-sector" value={sector} onChange={event => setSector(event.target.value)}>
                <option value="todos">Todos los sectores</option>
                {availableSectors.map(item => <option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}
              </select>
            </label>
            <label htmlFor="practice-mode">Formato
              <select id="practice-mode" value={mode} onChange={event => setMode(event.target.value as PracticeMode)}>
                <option value="tema">Estudiar tema completo</option>
                <option value="mixto">Mixto · entrevista</option>
                <option value="test">Tipo test</option>
                <option value="codigo">Leer y revisar código</option>
                <option value="abiertas">Explicar y aplicar</option>
                <option value="casos">Casos prácticos</option>
                <option value="errores">Repasar mis errores</option>
              </select>
            </label>
            {!completeTopic && <label htmlFor="practice-amount">Duración
              <select id="practice-amount" value={amount} onChange={event => setAmount(Number(event.target.value))}>
                <option value="10">10 ejercicios</option><option value="20">20 ejercicios</option><option value="40">40 ejercicios</option>
              </select>
            </label>}
          </div>
          {!completeTopic && mode !== "errores" && <label className="practice-unseen">
            <input type="checkbox" checked={unseenOnly} onChange={event => setUnseenOnly(event.target.checked)} />
            Solo ejercicios no vistos, sin repetir entre rondas
          </label>}
          {!completeTopic && unseenOnly && mode !== "errores" && <p className="practice-unseen-note">Las preguntas contestadas no se repiten en este recorrido. Los fallos siguen disponibles en «Repasar mis errores».</p>}
          {completeTopic && <p className="practice-topic-note">
            {sector === "todos" ? "Selecciona un sector concreto para estudiar el tema entero." :
              "Responderás todas las preguntas de este sector en orden aleatorio, incluidas las ya practicadas y todos los formatos."}
          </p>}
          <div className="practice-start">
            <span>{candidates.length.toLocaleString("es-ES")} {completeTopic ? "preguntas del tema completo" : unseenOnly && mode !== "errores" ? "ejercicios distintos sin responder" : "disponibles con estos filtros"}</span>
            <button type="button" onClick={start} disabled={!candidates.length}>{completeTopic ? "Empezar tema completo" : "Empezar ronda"} <ArrowRight aria-hidden="true" /></button>
          </div>
          {mode === "errores" && candidates.length === 0 &&
            <p className="practice-empty">Todavía no hay errores pendientes en este sector. Puedes empezar una ronda mixta.</p>}
          {!completeTopic && unseenOnly && mode !== "errores" && candidates.length === 0 &&
            <p className="practice-empty">Ya has visto todos los ejercicios distintos con estos filtros. Puedes repasar errores o desactivar esta opción para practicar de nuevo.</p>}
        </section>
        </>}

        {studying && <header className="practice-session-heading">
          <Image
            className="practice-scene-image"
            src="/observation-deck.webp"
            alt="Estación de observación en un planeta remoto, representada en pixel art"
            fill
            priority
            sizes="(max-width: 780px) calc(100vw - 28px), 1100px"
          />
          <div className="practice-scene-content">
            <span className="practice-eyebrow">{completeTopic ? "ESTUDIO DEL TEMA COMPLETO" : "SESIÓN DE PRÁCTICA"}</span>
            <h1>{selectedSector ? `${selectedSector.id} · ${selectedSector.title}` : "Todos los sectores"}</h1>
            <p>{session.length} preguntas · Responde y revisa cada ejercicio antes de continuar.</p>
          </div>
        </header>}

        {active && <section className="practice-panel practice-question" aria-labelledby="practice-prompt" key={active.id}>
          <div className="practice-question-meta">
            <span>{active.lessonId} · {lessonNames.get(active.lessonId)}</span>
            <strong>{index + 1} / {session.length}</strong>
          </div>
          <div className="practice-progress"><span style={{ width: ((index + 1) / session.length * 100) + "%" }} /></div>
          <span className="practice-eyebrow">{active.kind === "choice" ? active.category === "calculo" ? "CÁLCULO RAZONADO" : active.category === "lectura-codigo" ? "LEE EL CÓDIGO" : active.category === "revisar-codigo" ? "REVISA Y CORRIGE" : "PREGUNTA TIPO TEST" : active.category === "caso" ? "CASO DE ENTREVISTA" : active.category === "codigo" ? "CÓDIGO Y DEPURACIÓN" : "EXPLICA Y APLICA"}</span>
          <h2 id="practice-prompt" ref={promptRef} tabIndex={-1}>{active.prompt}</h2>
          {active.kind === "choice" && active.code && <pre className="practice-code"><code>{active.code}</code></pre>}

          {active.kind === "choice" ? <>
            <fieldset className="practice-options" disabled={revealed}>
              <legend className="sr-only">Elige una respuesta</legend>
              {active.options.map((option, optionIndex) => {
                const result = revealed ? optionIndex === active.correctIndex ? "correct" : optionIndex === answer ? "wrong" : undefined : undefined;
                return <label key={optionIndex} data-result={result}>
                  <input type="radio" name={"answer-" + active.id} checked={answer === optionIndex} onChange={() => setAnswer(optionIndex)} />
                  <span className="practice-option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                  <span>{option}</span>
                </label>;
              })}
            </fieldset>
            {revealed && answer !== null && <div className="practice-feedback" role="status">
              {answer !== active.correctIndex && <div className="practice-why-wrong">
                <span><XCircle aria-hidden="true" /> Por qué tu respuesta no encaja</span>
                <p>«{active.options[answer]}»: {active.feedback[answer]}</p>
              </div>}
              <div className="practice-why-right">
                <span><CheckCircle2 aria-hidden="true" /> {answer === active.correctIndex ? "Por qué has acertado" : "Por qué esta es la respuesta correcta"}</span>
                <p><strong>{active.options[active.correctIndex]}.</strong> {active.feedback[active.correctIndex]}</p>
              </div>
            </div>}
            {!revealed && <button className="practice-primary" type="button" onClick={checkChoice} disabled={answer === null}>Comprobar respuesta</button>}
          </> : <>
            <label className="practice-draft-label" htmlFor="practice-draft">Tu razonamiento (se mantiene durante esta pregunta)</label>
            <textarea id="practice-draft" rows={7} value={draft} onChange={event => setDraft(event.target.value)}
              disabled={revealed} placeholder="Explica la decisión, tus supuestos y cómo la comprobarías..." />
            {!revealed && <button className="practice-primary" type="button" onClick={() => setRevealed(true)} disabled={!draft.trim()}>
              Comparar con la solución orientativa
            </button>}
            {revealed && <div className="practice-feedback" role="status">
              <div className="practice-why-right"><span><BookOpen aria-hidden="true" /> Solución orientativa</span><p className="practice-solution">{active.solution}</p></div>
              <div className="practice-rubric"><strong>Comprueba si has incluido:</strong><ul>{active.rubric.map(point => <li key={point}>{point}</li>)}</ul></div>
              <p className="practice-honesty">Las respuestas abiertas se revisan contigo; la aplicación no interpreta tu texto ni finge corregirlo automáticamente.</p>
              {!evaluated && <div className="practice-self-check">
                <button type="button" onClick={() => assessOpen(false)}><RotateCcw aria-hidden="true" /> Necesito repasarlo</button>
                <button type="button" onClick={() => assessOpen(true)}><CheckCircle2 aria-hidden="true" /> Lo he razonado bien</button>
              </div>}
              {evaluated && <p className="practice-assessed">Valoración guardada para tus próximas rondas.</p>}
            </div>}
          </>}
          {(active.kind === "choice" ? revealed : evaluated) &&
            <button className="practice-next" type="button" onClick={next}>{index + 1 === session.length ? "Ver resultado" : "Siguiente ejercicio"} <ArrowRight aria-hidden="true" /></button>}
        </section>}

        {finished && <section className="practice-panel practice-finish" aria-live="polite">
          <span className="practice-eyebrow">{completeTopic ? "TEMA COMPLETADO" : "RONDA COMPLETADA"}</span>
          <h2 ref={finishRef} tabIndex={-1}>{score} / {session.length} razonados correctamente</h2>
          <p>Los fallos quedan en «Repasar mis errores» hasta que los resuelvas de nuevo. Los casos abiertos dependen de tu propia valoración tras comparar con la pauta.</p>
          <div className="practice-finish-actions">
            <button className="practice-primary" type="button" onClick={start} disabled={!candidates.length}>{completeTopic ? "Repetir tema" : "Otra ronda"} <ArrowRight aria-hidden="true" /></button>
            <button className="practice-primary practice-secondary" type="button" onClick={configure}>Configurar otra sesión</button>
          </div>
        </section>}
        </>}
      </div>
    </main>
  );
}
