"use client";

import Link from "@/components/document-link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, ClipboardCheck, FlaskConical, Layers3, LockKeyhole, NotebookPen, PencilLine } from "lucide-react";
import { stages } from "./curriculum";
import { useNotebook } from "./notebook";
import { assess, blankPage } from "./progress";
import { folio, stageIcons } from "./route-map";
import { FilterExample, OutputExample } from "./visual-examples";
import { StationBanner } from "./station-banner";

const panels = [
  { name: "Estudiar", icon: BookOpen },
  { name: "Comprender", icon: FlaskConical },
  { name: "Mis apuntes", icon: NotebookPen },
  { name: "Test", icon: ClipboardCheck },
];

export function StageReader({ index }: { index: number }) {
  const stage = stages[index];
  const Icon = stageIcons[index];
  const { ready, book, pending, write } = useNotebook();
  const page = book.pages[stage.id] ?? blankPage;
  const [panel, setPanel] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const result = assess(stage, answers, page.explained);
  const panelHead = useRef<HTMLHeadingElement>(null);
  const lastPanel = useRef(panel);
  useEffect(() => {
    if (lastPanel.current !== panel) {
      panelHead.current?.focus({ preventScroll: true });
      panelHead.current?.scrollIntoView({ block: "start" });
      lastPanel.current = panel;
    }
  }, [panel]);

  if (!ready || index > pending) {
    return <main id="cuaderno" className="fb-wrap fb-gate">
      <StationBanner code={folio(index)} eyebrow={<><LockKeyhole /> Etapa {folio(index)} / {stage.title}</>} title={!ready ? stage.title : "Primero, la etapa anterior"}>
        {!ready ? <p role="status">Abriendo tu cuaderno…</p> : <>
          <p>Completa el caso y el test de la etapa pendiente antes de abrir esta lectura. La biblioteca se puede consultar libremente.</p>
          <div className="fb-actions"><Link className="fb-primary" href={`/etapas/${stages[pending].id}`}>Ir a {stages[pending].title} <ArrowRight /></Link>
          <Link className="fb-text-link" href="/">Volver al mapa</Link></div>
        </>}
      </StationBanner></main>;
  }

  function grade() {
    if (result.answered !== stage.quiz.length) return;
    setSubmitted(true);
    if (result.mastered && !page.done) write(stage.id, "done", true);
  }
  return <main id="cuaderno" className="fb-wrap fb-reader">
    <nav className="fb-crumb" aria-label="Ubicación"><Link href="/"><ArrowLeft /> Mapa de etapas</Link><ChevronRight /> Etapa {folio(index)}</nav>
    <StationBanner code={folio(index)} eyebrow={<><Icon /> Etapa {folio(index)} de {folio(stages.length - 1)} {page.done && "· Superada"}</>} title={stage.title}>
      <p>{stage.question}</p>
    </StationBanner>
    <div className="fb-workspace">
      <aside className="fb-directory">
        <span className="fb-kicker">En esta etapa</span>
        <nav aria-label="Pasos de estudio">{panels.map(({name, icon: StepIcon}, i) =>
          <button type="button" key={name} aria-current={panel === i ? "step" : undefined} onClick={() => setPanel(i)}><StepIcon /><span>{name}</span><small>0{i + 1}</small></button>)}</nav>
        <div className="fb-aim"><span className="fb-kicker">Al terminar podrás</span><p>{stage.goal}</p></div>
        <Link className="fb-practice-link" href={`/practica?etapa=${stage.id}`}><ClipboardCheck /> Practicar esta etapa <ChevronRight /></Link>
        <details className="fb-refs"><summary>Ampliar en la biblioteca</summary>{stage.further.map(([id, name]) => <Link key={id} href={`/biblioteca?leccion=${id}`}>{name} <ChevronRight /></Link>)}</details>
      </aside>
      <article className="fb-paper">
        <header className="fb-panel-head"><span className="fb-kicker">Paso 0{panel + 1} / 04</span>
          <h2 tabIndex={-1} ref={panelHead}>{["Estudiar la etapa", "Comprender con un caso", "Mis apuntes de esta etapa", "Comprobar lo aprendido"][panel]}</h2></header>
        {panel === 0 && <>
          {stage.lesson.map(([title, text, formula], i) => <section className="fb-passage" key={title}>
            <h3><span>{folio(i)}</span>{title}</h3><p>{text}</p>
            {formula && <pre className="fb-formula">{formula}</pre>}
          </section>)}
          {stage.id === "preparacion" && <FilterExample />}
          {stage.id === "prediccion" && <OutputExample />}
          <section className="fb-pieces"><span className="fb-kicker"><Layers3 /> Mesa de decisiones</span><h3>¿Qué pieza elegirías?</h3>
            <p>Abre dos alternativas. Compara qué resuelven, qué puedes perder y qué medirías antes de elegir.</p>
            {stage.pieces.map(([name, mechanism, example, limit, verify]) => <details key={name} className="fb-choice-card">
              <summary>{name}<ChevronDown /></summary><dl>
                <dt>Qué hace</dt><dd>{mechanism}</dd><dt>Cuándo la usaría</dt><dd>{example}</dd>
                <dt>Qué puede salir mal</dt><dd>{limit}</dd><dt>Cómo lo comprobaría</dt><dd>{verify}</dd>
              </dl></details>)}
          </section>
          <section className="fb-glossary"><span className="fb-kicker">Glosario de bolsillo</span><dl>{stage.glossary.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl></section>
          <button type="button" className="fb-primary" onClick={() => setPanel(1)}>Resolver el caso <ArrowRight /></button>
        </>}
        {panel === 1 && <>
          <section className="fb-worked"><span className="fb-kicker">Ejemplo resuelto</span><h3>{stage.worked.title}</h3><p>{stage.worked.given}</p>
            <ol>{stage.worked.steps.map(step => <li key={step}>{step}</li>)}</ol>
            <p className="fb-conclusion"><strong>Qué nos dice el resultado.</strong> {stage.worked.conclusion}</p></section>
          <section className="fb-transfer"><span className="fb-kicker">Ahora cambia una condición</span><h3>Resuélvelo sin opciones</h3>
            <p>{stage.transfer[0]}</p><details><summary>Contrastar mi razonamiento</summary><p>{stage.transfer[1]}</p></details>
            <label className="fb-check"><input type="checkbox" checked={page.explained} onChange={e => {
              write(stage.id, "explained", e.target.checked); setSubmitted(false);
            }} /> Puedo justificar mi decisión con mis palabras.</label>
            <small>Es una autoevaluación, no una corrección automática de tu explicación.</small></section>
          <button type="button" className="fb-primary" onClick={() => setPanel(2)}>Pasar a mis apuntes <ArrowRight /></button>
        </>}
        {panel === 2 && <>
          <p className="fb-intro">Escribe para que tu yo de mañana pueda resolver un caso distinto. Los apuntes son tuyos: no se puntúan ni se exige una longitud mínima.</p>
          <aside className="fb-prompt"><PencilLine /><div><strong>Una ficha útil</strong><p>Qué significa → cuándo lo usaría → un ejemplo mío → con qué no confundirlo.</p></div></aside>
          <label className="fb-label" htmlFor="fb-notes">Cuaderno personal · {stage.title}</label>
          <textarea id="fb-notes" className="fb-notes" value={page.note} onChange={e => write(stage.id, "note", e.target.value)} placeholder="En mis palabras…&#10;&#10;Por ejemplo…&#10;&#10;Elegiría esta pieza en vez de… porque…" />
          <small className="fb-save-state">{book.notice ? "No se ha confirmado el guardado; copia el texto antes de salir." : "Guardado automático en este navegador. Tus notas clásicas se conservan en la biblioteca."}</small>
          <button type="button" className="fb-primary" onClick={() => setPanel(3)}>Ir al test de la etapa <ArrowRight /></button>
        </>}
        {panel === 3 && <>
          <p className="fb-intro">Elige una respuesta por caso. Para abrir la siguiente etapa necesitas resolver el test completo y haber explicado el caso del paso «Comprender». Puedes reintentar sin penalización.</p>
          {stage.quiz.map((q, qi) => <fieldset className="fb-quiz" key={q.prompt}>
            <legend><span>{folio(qi)}</span>{q.prompt}</legend>
            {q.choices.map(([choice], j) => <label key={choice} className="fb-option" data-selected={answers[qi] === j}>
              <input type="radio" name={`case-${qi}`} checked={answers[qi] === j} onChange={() => {
                setAnswers(previous => { const next = [...previous]; next[qi] = j; return next; }); setSubmitted(false);
              }} />{choice}</label>)}
            {submitted && answers[qi] !== undefined && <div className="fb-diagnosis" data-ok={answers[qi] === q.correct}>
              <strong>{answers[qi] === q.correct ? "Correcto. " : "Revisa tu decisión. "}</strong>{q.choices[answers[qi]][1]}
              {answers[qi] !== q.correct && <p><strong>Alternativa: {q.choices[q.correct][0]}.</strong> {q.choices[q.correct][1]}</p>}</div>}
          </fieldset>)}
          <div className="fb-actions"><button type="button" className="fb-primary" disabled={result.answered !== stage.quiz.length} onClick={grade}>Comprobar test <ClipboardCheck /></button><small>{result.answered} / {stage.quiz.length} respondidas</small></div>
          {submitted && <div className="fb-result" role="status"><strong>{result.score} / {stage.quiz.length} aciertos.</strong>{" "}
            {result.mastered ? "Has aplicado las decisiones de esta etapa." : result.score === stage.quiz.length
              ? <>Falta el caso: <button className="fb-inline" type="button" onClick={() => setPanel(1)}>volver a Comprender</button> y después comprobar el test.</>
              : <>Lee el diagnóstico, <button className="fb-inline" type="button" onClick={() => setPanel(0)}>repasa las piezas</button> y vuelve a intentarlo.</>}
          </div>}
          {page.done && <div className="fb-passed"><Check /><strong>Etapa superada</strong>{index < stages.length - 1
            ? <Link className="fb-inline" href={`/etapas/${stages[index + 1].id}`}>Abrir etapa {folio(index + 1)} →</Link>
            : <Link className="fb-inline" href="/">Recorrido completo · Volver al mapa →</Link>}</div>}
          <aside className="fb-transfer"><span className="fb-kicker"><ClipboardCheck /> Práctica de entrevista</span>
            <h3>¿Podrías defender la decisión sin opciones?</h3><p>Estas tres preguntas cierran la lectura. En el banco de esta etapa puedes alternar teoría, cálculos, código y casos con solución explicada.</p>
            <Link className="fb-inline" href={`/practica?etapa=${stage.id}`}>Abrir el banco de esta etapa →</Link></aside>
        </>}
      </article>
    </div>
  </main>;
}
