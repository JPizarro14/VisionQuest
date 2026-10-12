"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, RotateCcw, Target, XCircle } from "lucide-react";
import { allLessons, availableSectors } from "@/app/course-map";
import { practiceCounts, practiceItems } from "@/app/practice-bank";
import type { PracticeItem } from "@/app/practice-types";
import "./practice.css";

type PracticeMode = "mixto" | "test" | "codigo" | "abiertas" | "casos" | "errores";
type HistoryEntry = { attempts: number; mistakes: number; needsReview: boolean };
type History = Record<string, HistoryEntry>;
const historyKey = "visionquest-practice-history-v1";
const lessonNames = new Map(allLessons.map(lesson => [lesson.id, lesson.navTitle]));

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function chooseSession(items: PracticeItem[], count: number): PracticeItem[] {
  const groups = new Map<string, PracticeItem[]>();
  for (const item of items) {
    const key = item.kind === "choice" ? item.code ? "codigo" : item.category :
      item.category === "codigo" || item.category === "caso" ? "caso" : "abierta";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  for (const [key, group] of groups) groups.set(key, shuffled(group));
  const selected: PracticeItem[] = [], usedFamilies = new Set<string>();
  const usedIds = new Set<string>();
  const pattern = ["concepto", "calculo", "codigo", "abierta", "caso", "concepto", "calculo", "codigo", "abierta", "abierta"];
  // First pass: at most one numerical variant of each family.
  while (selected.length < count) {
    let added = false;
    for (const key of pattern) {
      const group = groups.get(key) ?? [];
      const index = group.findIndex(item => !usedIds.has(item.id) &&
        (item.kind !== "choice" || !item.family || !usedFamilies.has(item.family)));
      if (index < 0) continue;
      const [item] = group.splice(index, 1);
      selected.push(item);
      usedIds.add(item.id);
      if (item.kind === "choice" && item.family) usedFamilies.add(item.family);
      added = true;
      if (selected.length === count) break;
    }
    if (!added) break;
  }
  if (selected.length < count) {
    const remaining = shuffled([...groups.values()].flat().filter(item => !usedIds.has(item.id)));
    selected.push(...remaining.slice(0, count - selected.length));
  }
  return selected;
}

export default function PracticePage() {
  const [history, setHistory] = useState<History>({});
  const [loaded, setLoaded] = useState(false);
  const [sector, setSector] = useState("todos");
  const [mode, setMode] = useState<PracticeMode>("mixto");
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [amount, setAmount] = useState(10);
  const [session, setSession] = useState<PracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(historyKey) ?? "{}");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) setHistory(stored);
    } catch { /* A damaged browser record must not block practice. */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) window.localStorage.setItem(historyKey, JSON.stringify(history));
  }, [history, loaded]);

  const candidates = useMemo(() => {
    const practicedFamilies = new Set(practiceItems.flatMap(item =>
      item.kind === "choice" && item.family && history[item.id]?.attempts ? [item.family] : []));
    const offeredFamilies = new Set<string>();
    return practiceItems.filter(item => {
      if (sector !== "todos" && !item.lessonId.startsWith(sector + ".")) return false;
      if (!(mode === "mixto" || mode === "errores" ||
        (mode === "test" && item.kind === "choice") ||
        (mode === "codigo" && item.kind === "choice" && !!item.code) ||
        (mode === "abiertas" && item.kind === "open" && item.category !== "caso") ||
        (mode === "casos" && item.kind === "open" && item.category === "caso"))) return false;
      if (mode === "errores" && !history[item.id]?.needsReview) return false;
      if (unseenOnly && mode !== "errores") {
        if (history[item.id]?.attempts) return false;
        // Forty variants of one calculation are one skill in a sector pass.
        if (item.kind === "choice" && item.family) {
          if (practicedFamilies.has(item.family) || offeredFamilies.has(item.family)) return false;
          offeredFamilies.add(item.family);
        }
      }
      return true;
    });
  }, [sector, mode, history, unseenOnly]);
  const pending = Object.values(history).filter(entry => entry?.needsReview).length;
  const practiced = Object.values(history).filter(entry => entry?.attempts > 0).length;
  const active = session[index];
  const finished = session.length > 0 && index >= session.length;

  function start() {
    if (!candidates.length) return;
    setSession(chooseSession(candidates, Math.min(amount, candidates.length)));
    setIndex(0);
    setScore(0);
    setAnswer(null);
    setDraft("");
    setRevealed(false);
    setEvaluated(false);
  }
  function record(item: PracticeItem, mastered: boolean) {
    setHistory(current => {
      const old = current[item.id] ?? { attempts: 0, mistakes: 0, needsReview: false };
      return { ...current, [item.id]: {
        attempts: old.attempts + 1,
        mistakes: old.mistakes + Number(!mastered),
        needsReview: !mastered,
      } };
    });
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
    setIndex(current => current + 1);
    setAnswer(null);
    setDraft("");
    setRevealed(false);
    setEvaluated(false);
  }

  return (
    <main className="practice-shell">
      <header className="practice-topbar">
        <a className="practice-brand" href="/"><span className="brand-glyph">VQ</span><strong>VISIONQUEST</strong></a>
        <a className="practice-back" href="/"><ArrowLeft aria-hidden="true" /> Volver al temario</a>
      </header>
      <div className="practice-frame">
        <div className="practice-heading">
          <span className="practice-eyebrow"><Target aria-hidden="true" /> ESTACIÓN DE ENTRENAMIENTO</span>
          <h1>Practica hasta poder explicarlo.</h1>
          <p>Preguntas de todo el curso, cálculos con datos cambiantes, lectura y revisión de código, y casos para defender tus decisiones. Tu respuesta importa tanto como el acierto.</p>
        </div>
        <div className="practice-stats" aria-label="Contenido y progreso">
          <div><strong>{practiceCounts.total.toLocaleString("es-ES")}</strong><span>ejercicios disponibles</span></div>
          <div><strong>{practiceCounts.numericalVariants.toLocaleString("es-ES")}</strong><span>variantes de 36 problemas calculados</span></div>
          <div><strong>{practiced}</strong><span>practicados en este navegador</span></div>
          <div><strong>{pending}</strong><span>por repasar</span></div>
        </div>

        <section className="practice-panel practice-config" aria-labelledby="practice-setup">
          <div>
            <span className="practice-eyebrow">CONFIGURA UNA RONDA</span>
            <h2 id="practice-setup">Tu sesión de práctica</h2>
            <p>Las variantes numéricas cambian los datos. También hay {practiceCounts.codeChoices} retos de código con cuatro opciones; en una ronda se priorizan problemas diferentes antes de repetir una familia.</p>
          </div>
          <div className="practice-filters">
            <label htmlFor="practice-sector">Sector
              <select id="practice-sector" value={sector} onChange={event => setSector(event.target.value)}>
                <option value="todos">Todos los sectores</option>
                {availableSectors.map(item => <option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}
              </select>
            </label>
            <label htmlFor="practice-mode">Formato
              <select id="practice-mode" value={mode} onChange={event => setMode(event.target.value as PracticeMode)}>
                <option value="mixto">Mixto · entrevista</option>
                <option value="test">Tipo test</option>
                <option value="codigo">Leer y revisar código</option>
                <option value="abiertas">Explicar y aplicar</option>
                <option value="casos">Casos prácticos</option>
                <option value="errores">Repasar mis errores</option>
              </select>
            </label>
            <label htmlFor="practice-amount">Duración
              <select id="practice-amount" value={amount} onChange={event => setAmount(Number(event.target.value))}>
                <option value="10">10 ejercicios</option><option value="20">20 ejercicios</option><option value="40">40 ejercicios</option>
              </select>
            </label>
          </div>
          {mode !== "errores" && <label className="practice-unseen">
            <input type="checkbox" checked={unseenOnly} onChange={event => setUnseenOnly(event.target.checked)} />
            Solo ejercicios no vistos, sin repetir entre rondas
          </label>}
          {unseenOnly && mode !== "errores" && <p className="practice-unseen-note">Cada familia de cálculo cuenta una vez en este recorrido. Puedes desactivar esta opción para practicar otras variantes.</p>}
          <div className="practice-start">
            <span>{candidates.length.toLocaleString("es-ES")} {unseenOnly && mode !== "errores" ? "ejercicios distintos sin responder" : "disponibles"} con estos filtros</span>
            <button type="button" onClick={start} disabled={!candidates.length}>Empezar ronda <ArrowRight aria-hidden="true" /></button>
          </div>
          {mode === "errores" && candidates.length === 0 &&
            <p className="practice-empty">Todavía no hay errores pendientes en este sector. Puedes empezar una ronda mixta.</p>}
          {unseenOnly && mode !== "errores" && candidates.length === 0 &&
            <p className="practice-empty">Ya has visto todos los ejercicios distintos con estos filtros. Puedes repasar errores o desactivar esta opción para practicar de nuevo.</p>}
        </section>

        {active && <section className="practice-panel practice-question" aria-labelledby="practice-prompt" key={active.id}>
          <div className="practice-question-meta">
            <span>{active.lessonId} · {lessonNames.get(active.lessonId)}</span>
            <strong>{index + 1} / {session.length}</strong>
          </div>
          <div className="practice-progress"><span style={{ width: ((index + 1) / session.length * 100) + "%" }} /></div>
          <span className="practice-eyebrow">{active.kind === "choice" ? active.category === "calculo" ? "CÁLCULO RAZONADO" : active.category === "lectura-codigo" ? "LEE EL CÓDIGO" : active.category === "revisar-codigo" ? "REVISA Y CORRIGE" : "PREGUNTA TIPO TEST" : active.category === "caso" ? "CASO DE ENTREVISTA" : active.category === "codigo" ? "CÓDIGO Y DEPURACIÓN" : "EXPLICA Y APLICA"}</span>
          <h2 id="practice-prompt">{active.prompt}</h2>
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
              <div className="practice-why-right"><span><BookOpen aria-hidden="true" /> Solución orientativa</span><p>{active.solution}</p></div>
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
          <span className="practice-eyebrow">RONDA COMPLETADA</span>
          <h2>{score} / {session.length} razonados correctamente</h2>
          <p>Los fallos quedan en «Repasar mis errores» hasta que los resuelvas de nuevo. Los casos abiertos dependen de tu propia valoración tras comparar con la pauta.</p>
          <button className="practice-primary" type="button" onClick={start}>Otra ronda <ArrowRight aria-hidden="true" /></button>
        </section>}
      </div>
    </main>
  );
}
