"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "@/components/document-link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, RotateCcw, Target, XCircle } from "lucide-react";
import { stages, type StageId } from "@/app/etapas/curriculum";
import { StationBanner } from "@/app/etapas/station-banner";
import { practiceCounts, practiceItems } from "@/app/practice-bank";
import {
  createPracticeSession, getPracticeCandidates, PracticeHistoryError, restorePracticeHistory,
  type PracticeHistory, type PracticeMode,
} from "@/app/practice-session";
import type { PracticeDepth, StageExercise } from "@/app/practice-types";
import "./practice.css";

type StoredProgress = { history: PracticeHistory; canSave: boolean; notice: string | null };
const historyKey = "visionquest-practice-history-v1";
const stageLabels = new Map(stages.map((stage, i) => [stage.id, `${String(i + 1).padStart(2, "0")} · ${stage.title}`]));
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

export function PracticeStation({ initialStage, unknownStage }: { initialStage: StageId; unknownStage: boolean }) {
  const [progress, setProgress] = useState<StoredProgress>(readStoredProgress);
  const loaded = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  const history = progress.history;
  const [stageId, setStageId] = useState<StageId | "todas">(initialStage);
  const [depth, setDepth] = useState<PracticeDepth | "todo">("todo");
  const [mode, setMode] = useState<PracticeMode>("tema");
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [amount, setAmount] = useState(10);
  const [session, setSession] = useState<StageExercise[]>([]);
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
    () => getPracticeCandidates(practiceItems, stageId, mode, history, unseenOnly, depth),
    [stageId, mode, history, unseenOnly, depth],
  );
  const pending = practiceItems.filter(item => history[item.id]?.needsReview).length;
  const practiced = practiceItems.filter(item => history[item.id]?.attempts > 0).length;
  const active = session[index];
  const activeId = active?.id;
  const finished = session.length > 0 && index >= session.length;
  const studying = session.length > 0;
  const completeTopic = mode === "tema";
  const selectedStage = stages.find(item => item.id === stageId);

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
  function record(item: StageExercise, mastered: boolean) {
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
    <main id="cuaderno" className="fb-wrap practice-frame">
        <nav className="fb-crumb" aria-label="Ubicación">
          {studying ? <button className="practice-back" type="button" onClick={configure}><ArrowLeft /> Configurar otra sesión</button>
            : <Link href="/"><ArrowLeft /> Mapa de etapas</Link>}
          {selectedStage && <><span aria-hidden="true">/</span><Link href={`/etapas/${selectedStage.id}`}>Lectura de la etapa</Link></>}
        </nav>
        <StationBanner code={selectedStage ? String(stages.indexOf(selectedStage) + 1).padStart(2, "0") : "CV"}
          eyebrow={<><Target /> {studying ? "Ronda en curso" : "Estación de práctica"}</>}
          title={studying ? selectedStage?.title ?? "Entrevista transversal" : "Practica hasta poder explicarlo."}>
          <p>{studying ? `${session.length} ejercicios · Responde antes de consultar la explicación.`
            : "Del píxel a la decisión: repasa lo que acabas de estudiar o defiende una solución ante una pregunta de entrevista."}</p>
        </StationBanner>
        {!loaded ? <p role="status">Cargando tu historial de práctica…</p> : <>
        {progress.notice && <p className="practice-storage-notice" role="alert">{progress.notice}</p>}
        {!studying && <>
        {unknownStage && <p className="fb-notice" role="status">La etapa del enlace no existe. Elige una de las siete etapas para practicar.</p>}
        <div className="practice-stats" aria-label="Contenido y progreso">
          <div><strong>{practiceCounts.choices}</strong><span>preguntas tipo test</span></div>
          <div><strong>{practiceCounts.open}</strong><span>preguntas abiertas</span></div>
          <div><strong>{practiced}</strong><span>practicados en este navegador</span></div>
          <div><strong>{pending}</strong><span>por repasar</span></div>
        </div>

        <section className="practice-panel practice-config" aria-labelledby="practice-setup">
          <div>
            <span className="practice-eyebrow">Cuaderno de campo / Entrenamiento</span>
            <h2 id="practice-setup" ref={setupRef} tabIndex={-1}>Prepara tu sesión</h2>
            <p><strong>Lo estudiado</strong> se resuelve con la lectura y el caso de la etapa. <strong>Ampliación de entrevista</strong> profundiza con otras técnicas, problemas y decisiones. Este repaso es independiente del test corto que desbloquea la siguiente lectura.</p>
          </div>
          <div className="practice-filters">
            <label htmlFor="practice-stage">Etapa
              <select id="practice-stage" value={stageId} onChange={event => {
                const id = event.target.value as StageId | "todas";
                setStageId(id);
                if (id === "todas" && completeTopic) setMode("mixto");
              }}>
                {stages.map(item => <option key={item.id} value={item.id}>{stageLabels.get(item.id)}</option>)}
                <option value="todas">Todas las etapas · entrevista transversal</option>
              </select>
            </label>
            {mode !== "errores" && <label htmlFor="practice-depth">Contenido
              <select id="practice-depth" value={depth} onChange={event => setDepth(event.target.value as PracticeDepth | "todo")}>
                <option value="etapa">Lo estudiado</option><option value="ampliacion">Ampliación de entrevista</option>
                <option value="todo">Lo estudiado + ampliación</option>
              </select>
            </label>}
            <label htmlFor="practice-mode">Formato
              <select id="practice-mode" value={mode} onChange={event => setMode(event.target.value as PracticeMode)}>
                <option value="tema" disabled={!selectedStage}>Estudiar la selección completa</option>
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
            Responderás todas las preguntas de esta etapa y del contenido elegido, en orden aleatorio. Incluye todos los formatos y las ya practicadas.
          </p>}
          <div className="practice-start">
            <span aria-live="polite">{candidates.length.toLocaleString("es-ES")} {completeTopic ? "ejercicios en la selección" : unseenOnly && mode !== "errores" ? "ejercicios distintos sin responder" : "disponibles con estos filtros"}</span>
            <button type="button" onClick={start} disabled={!candidates.length}>{completeTopic ? "Empezar selección completa" : "Empezar ronda"} <ArrowRight aria-hidden="true" /></button>
          </div>
          {mode === "errores" && <p className="practice-topic-note">Incluye los errores de lo estudiado y de ampliación {selectedStage ? "en esta etapa" : "en todas las etapas"}.</p>}
          {mode === "errores" && candidates.length === 0 &&
            <p className="practice-empty">No hay errores pendientes en esta selección.</p>}
          {mode !== "errores" && !unseenOnly && !candidates.length &&
            <p className="practice-empty">No hay ejercicios con esta combinación. Prueba otro formato o incluye la ampliación.</p>}
          {!completeTopic && unseenOnly && mode !== "errores" && candidates.length === 0 &&
            <p className="practice-empty">Ya has visto todos los ejercicios distintos con estos filtros. Puedes repasar errores o desactivar esta opción para practicar de nuevo.</p>}
        </section>
        </>}

        {active && <section className="practice-panel practice-question" aria-labelledby="practice-prompt" key={active.id}>
          <div className="practice-question-meta">
            <span>Etapa {stageLabels.get(active.stageId)}<br />{active.depth === "etapa" ? "Lo estudiado" : "Ampliación de entrevista"}</span>
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
                <p><strong>{active.options[active.correctIndex]}</strong></p>
                <p>{active.feedback[active.correctIndex]}</p>
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
              {active.rubric && <div className="practice-rubric"><strong>Comprueba si has incluido:</strong><ul>{active.rubric.map(point => <li key={point}>{point}</li>)}</ul></div>}
              <p className="practice-honesty">Las respuestas abiertas se revisan contigo; la aplicación no interpreta tu texto ni finge corregirlo automáticamente.</p>
              {!evaluated && <div className="practice-self-check">
                <button type="button" onClick={() => assessOpen(false)}><RotateCcw aria-hidden="true" /> Necesito repasarlo</button>
                <button type="button" onClick={() => assessOpen(true)}><CheckCircle2 aria-hidden="true" /> Lo he razonado bien</button>
              </div>}
              {evaluated && <p className="practice-assessed">Valoración guardada para tus próximas rondas.</p>}
            </div>}
          </>}
          {revealed && <p className="practice-reading"><Link className="fb-inline" href={`/biblioteca?leccion=${active.lessonId}`} target="_blank" rel="noreferrer">Ampliar el concepto en la biblioteca ↗</Link> <small>(otra pestaña)</small></p>}
          {(active.kind === "choice" ? revealed : evaluated) &&
            <button className="practice-next" type="button" onClick={next}>{index + 1 === session.length ? "Ver resultado" : "Siguiente ejercicio"} <ArrowRight aria-hidden="true" /></button>}
        </section>}

        {finished && <section className="practice-panel practice-finish" aria-live="polite">
          <span className="practice-eyebrow">{completeTopic ? "SELECCIÓN COMPLETADA" : "RONDA COMPLETADA"}</span>
          <h2 ref={finishRef} tabIndex={-1}>{score} / {session.length} resueltos o autoevaluados como correctos</h2>
          <p>Los fallos quedan en «Repasar mis errores» hasta que los resuelvas de nuevo. Los casos abiertos dependen de tu propia valoración tras comparar con la pauta.</p>
          <div className="practice-finish-actions">
            <button className="practice-primary" type="button" onClick={start} disabled={!candidates.length}>{completeTopic ? "Repetir selección" : "Otra ronda"} <ArrowRight aria-hidden="true" /></button>
            <button className="practice-primary practice-secondary" type="button" onClick={configure}>Configurar otra sesión</button>
          </div>
        </section>}
        </>}
    </main>
  );
}
