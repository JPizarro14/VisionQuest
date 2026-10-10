"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleCheckBig,
  ExternalLink,
  Focus,
  LockKeyhole,
  Map,
  Moon,
  PencilLine,
  Save,
  ScanLine,
  Sun,
  Terminal,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import {
  allLessons,
  availableSectors,
  sectorStartIndex,
  sectorTitles,
} from "@/app/course-map";
import { LessonLab } from "@/app/lesson-labs";
import { practiceChallenges } from "@/app/practice-challenges";
import { studyWeeks } from "@/app/study-plan";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";

type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown | Promise<unknown>;
};

declare global {
  interface Document {
    modelContext?: {
      registerTool: (
        tool: WebMcpTool,
        options?: { signal?: AbortSignal },
      ) => void | Promise<void>;
    };
  }
}

const completionKey = "visionquest-completed-lessons";
const legacySectorOneCompletionKey = "visionquest-completed-sector-01";
const activeLessonKey = "visionquest-active-lesson";

function notesKey(lessonId: string) {
  return `visionquest-notes-${lessonId}`;
}

function readCompletedLessons() {
  try {
    const currentProgress = window.localStorage.getItem(completionKey);
    const previousProgress = window.localStorage.getItem(legacySectorOneCompletionKey);
    let stored = JSON.parse(currentProgress ?? previousProgress ?? "[]");
    if (!Array.isArray(stored)) stored = [];
    if (
      stored.length === 0 &&
      window.localStorage.getItem("visionquest-complete-01-01") === "true"
    ) {
      stored = [allLessons[0].id];
    }

    const sequential: string[] = [];
    for (const lesson of allLessons) {
      if (!stored.includes(lesson.id)) break;
      sequential.push(lesson.id);
    }
    window.localStorage.setItem(completionKey, JSON.stringify(sequential));
    return sequential;
  } catch {
    return [];
  }
}

export default function Home() {
  const [readingTheme, setReadingTheme] = useState<"warm" | "dark">("warm");
  const [fontScale, setFontScale] = useState(100);
  const [focusMode, setFocusMode] = useState(false);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"lesson" | "notes">("lesson");
  const [routeOpen, setRouteOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(true);

  const lesson = allLessons[activeLessonIndex];
  const challenge = practiceChallenges[lesson.id];
  const activeSectorIndex = availableSectors.findIndex((item) =>
    item.lessons.some((candidate) => candidate.id === lesson.id),
  );
  const activeSector = availableSectors[activeSectorIndex];
  const activeSectorStart = sectorStartIndex(activeSector.id);
  const lessonIndexInSector = activeSector.lessons.findIndex((item) => item.id === lesson.id);
  const sectorCompletedCount = activeSector.lessons.filter((item) =>
    completedIds.includes(item.id),
  ).length;
  const lessonComplete = completedIds.includes(lesson.id);
  const sectorProgress = Math.round(
    (sectorCompletedCount / activeSector.lessons.length) * 100,
  );
  const sectorQuestionCount = activeSector.lessons.reduce(
    (total, item) => total + item.questions.length,
    0,
  );
  const isLastLessonInSector = lessonIndexInSector === activeSector.lessons.length - 1;
  const hasNextLesson = activeLessonIndex < allLessons.length - 1;
  const nextLesson = hasNextLesson ? allLessons[activeLessonIndex + 1] : null;
  const nextLessonChangesSector =
    nextLesson !== null && !activeSector.lessons.some((item) => item.id === nextLesson.id);
  const allAnswered = lesson.questions.every((question) => answers[question.id] !== undefined);
  const score = lesson.questions.reduce(
    (total, question) => total + (Number(answers[question.id]) === question.correctIndex ? 1 : 0),
    0,
  );
  const perfectScore = submitted && score === lesson.questions.length;

  const studyStyle = useMemo(
    () => ({ "--study-scale": fontScale / 100 } as CSSProperties),
    [fontScale],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const legacyNotes = window.localStorage.getItem("visionquest-notes-image-matrix");
      if (legacyNotes !== null && window.localStorage.getItem(notesKey("01.01")) === null) {
        window.localStorage.setItem(notesKey("01.01"), legacyNotes);
      }

      const storedCompleted = readCompletedLessons();
      const storedTheme = window.localStorage.getItem("visionquest-reading-theme");
      const storedActive = window.localStorage.getItem(activeLessonKey);
      const storedIndex = allLessons.findIndex((item) => item.id === storedActive);
      const furthestUnlocked = Math.min(storedCompleted.length, allLessons.length - 1);
      const nextIndex =
        storedIndex >= 0 && storedIndex <= furthestUnlocked ? storedIndex : furthestUnlocked;

      setCompletedIds(storedCompleted);
      if (storedTheme === "dark" || storedTheme === "warm") setReadingTheme(storedTheme);
      setActiveLessonIndex(nextIndex);
      setNotes(window.localStorage.getItem(notesKey(allLessons[nextIndex].id)) ?? "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    const registration = context.registerTool(
      {
        name: "save_personal_notes",
        title: "Guardar apuntes personales",
        description: `Guarda los apuntes personales de la misión ${lesson.id}.`,
        inputSchema: {
          type: "object",
          properties: { notes: { type: "string", maxLength: 20000 } },
          required: ["notes"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        execute(input) {
          const candidate = input as { notes?: unknown };
          if (typeof candidate?.notes !== "string" || candidate.notes.length > 20000) {
            throw new Error("Los apuntes deben ser texto y no superar 20.000 caracteres.");
          }
          setNotes(candidate.notes);
          setSaved(true);
          window.localStorage.setItem(notesKey(lesson.id), candidate.notes);
          return { saved: true, characters: candidate.notes.length, lesson: lesson.id };
        },
      },
      { signal: lifecycle.signal },
    );

    void Promise.resolve(registration).catch(() => undefined);
    return () => lifecycle.abort();
  }, [lesson.id]);

  function toggleTheme() {
    const next = readingTheme === "warm" ? "dark" : "warm";
    setReadingTheme(next);
    window.localStorage.setItem("visionquest-reading-theme", next);
  }

  function selectLesson(index: number, scroll = true) {
    const unlocked = index <= completedIds.length;
    if (!unlocked || index < 0 || index >= allLessons.length) return;

    setActiveLessonIndex(index);
    setActiveTab("lesson");
    setNotes(window.localStorage.getItem(notesKey(allLessons[index].id)) ?? "");
    setSaved(true);
    setAnswers({});
    setSubmitted(false);
    window.localStorage.setItem(activeLessonKey, allLessons[index].id);
    if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectSector(index: number) {
    const sector = availableSectors[index];
    if (!sector) return;
    const start = sectorStartIndex(sector.id);
    if (start > completedIds.length) return;

    const firstPending = sector.lessons.findIndex((item) => !completedIds.includes(item.id));
    const localIndex = firstPending >= 0 ? firstPending : sector.lessons.length - 1;
    setRouteOpen(false);
    selectLesson(start + localIndex);
  }

  function saveNotes() {
    window.localStorage.setItem(notesKey(lesson.id), notes);
    setSaved(true);
  }

  function checkMastery() {
    if (!allAnswered) return;
    setSubmitted(true);

    if (score === lesson.questions.length) {
      setCompletedIds((current) => {
        const completedThrough = Math.max(current.length, activeLessonIndex + 1);
        const next = allLessons.slice(0, completedThrough).map((item) => item.id);
        window.localStorage.setItem(completionKey, JSON.stringify(next));
        return next;
      });
    }
  }

  function goToNextLesson() {
    selectLesson(activeLessonIndex + 1);
  }

  return (
    <main
      className={`vision-shell ${focusMode ? "is-focus" : ""}`}
      data-reading-theme={readingTheme}
      style={studyStyle}
    >
      <header className="command-bar">
        <div className="brand" aria-label="VisionQuest">
          <span className="brand-glyph" aria-hidden="true">VQ</span>
          <span className="brand-name">VISIONQUEST</span>
          <span className="brand-edition">FIELD NOTES / {activeSector.id}</span>
        </div>

        <div className="course-progress" aria-label="Progreso del sector">
          <div className="progress-copy">
            <span>SECTOR {activeSector.id} · {activeSector.shortTitle}</span>
            <strong>{sectorCompletedCount} / {activeSector.lessons.length} LECCIONES</strong>
          </div>
          <Progress value={sectorProgress} />
        </div>

        <div className="display-controls" aria-label="Controles de lectura">
          <Sheet open={routeOpen} onOpenChange={setRouteOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="route-trigger">
                <Map aria-hidden="true" /> <span>Ruta</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="route-sheet">
              <SheetHeader className="route-header">
                <span className="route-kicker">PLAN MAESTRO</span>
                <SheetTitle>Ruta de Computer Vision</SheetTitle>
                <SheetDescription>
                  De los píxeles a la arquitectura de sistemas y las entrevistas técnicas.
                </SheetDescription>
              </SheetHeader>
              <div className="route-meter">
                <span>Sector {activeSector.id} · {sectorCompletedCount}/{activeSector.lessons.length} lecciones</span>
                <strong>{activeSector.id} / 18</strong>
                <Progress value={sectorProgress} />
              </div>
              <details className="route-study-plan">
                <summary>Plan semanal hasta diciembre</summary>
                <p><strong>Meta completa:</strong> 143 misiones hasta el 27 de diciembre; del 28 al 31, repaso y casos. Las semanas incluyen 9–14 misiones según dificultad y unas 9–14 horas de trabajo. Es un objetivo exigente, no una obligación diaria rígida.</p>
                <p>La primera cifra es el sector: <strong>3.4</strong> significa sector 3, misión 4. «Completo» indica todas las misiones de ese sector.</p>
                <ol className="weekly-study-plan">
                  {studyWeeks.map((week, index) => (
                    <li key={week.from}>
                      <strong>Semana {index + 1} · {week.dates}</strong>
                      <span>Apartados: {week.apartados}</span>
                      <small>Misiones {week.from}–{week.to} · {week.hours}</small>
                    </li>
                  ))}
                </ol>
                <p><strong>28–31 dic:</strong> vuelve a resolver el caso 18.06 sin pauta, repasa errores y explica tres decisiones de diseño con números.</p>
                <p>Reserva el domingo para recuperar ideas sin mirar y revisa cada misión a los 2–3 días, una semana y un mes. El 3/3 desbloquea; el caso abierto y el repaso muestran si lo has retenido. Si el tiempo real supera el previsto, desplaza la fecha antes que saltarte prácticas.</p>
              </details>
              <nav className="sector-list" aria-label="Sectores del curso">
                {sectorTitles.map((sectorTitle, index) => {
                  const availableSector = availableSectors[index];
                  const start = availableSector ? sectorStartIndex(availableSector.id) : -1;
                  const unlocked = availableSector !== undefined && start <= completedIds.length;
                  const complete =
                    availableSector !== undefined &&
                    availableSector.lessons.every((item) => completedIds.includes(item.id));
                  const active = index === activeSectorIndex;
                  const status = complete
                    ? "DOMINADO"
                    : active
                      ? "EN CURSO"
                      : unlocked
                        ? "DISPONIBLE"
                      : "BLOQUEADO";
                  return (
                    <button
                      key={sectorTitle}
                      type="button"
                      className={`sector-node ${active ? "is-active" : ""} ${complete ? "is-complete" : ""}`}
                      aria-current={active ? "step" : undefined}
                      disabled={!unlocked}
                      onClick={() => selectSector(index)}
                    >
                      <span className="sector-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="sector-copy">
                        <strong>{sectorTitle}</strong>
                        <small>{status}</small>
                      </span>
                      {complete ? <CircleCheckBig aria-hidden="true" /> : unlocked ? <ChevronRight aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
                    </button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="type-controls">
            <Button variant="ghost" size="icon-sm" onClick={() => setFontScale((value) => Math.max(90, value - 10))} aria-label="Reducir tamaño del texto"><ZoomOut /></Button>
            <span className="font-meter" aria-live="polite">{fontScale}%</span>
            <Button variant="ghost" size="icon-sm" onClick={() => setFontScale((value) => Math.min(130, value + 10))} aria-label="Aumentar tamaño del texto"><ZoomIn /></Button>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label={readingTheme === "warm" ? "Activar tema oscuro" : "Activar tema claro"}>{readingTheme === "warm" ? <Moon /> : <Sun />}</Button>
          <Toggle pressed={focusMode} onPressedChange={setFocusMode} variant="outline" size="sm" aria-label="Alternar modo concentración" className="focus-toggle"><Focus /><span>Foco</span></Toggle>
        </div>
      </header>

      <div className="journey-frame">
        <section className="mission-header" aria-labelledby="mission-title">
          <div className="world-frame">
            <Image
              src="/observation-deck.webp"
              alt="Estación de observación en un planeta remoto, representada en pixel art"
              fill
              priority
              sizes="(max-width: 1320px) 100vw, 1320px"
            />
          </div>
          <div className="mission-intro">
            <div className="scene-copy">
              <span className="scene-kicker">ESTACIÓN DE OBSERVACIÓN · MISIÓN {lesson.id}</span>
              <h1 id="mission-title">{lesson.navTitle}</h1>
              <p>Objetivo: {lesson.objective}</p>
            </div>
            <div className="scene-signal" aria-hidden="true"><span /> SEÑAL ESTABLE</div>
          </div>
        </section>

        <nav className="lesson-route" aria-label={`Misiones del sector ${activeSector.id}`}>
          <div
            className="lesson-route-track"
            style={{
              gridTemplateColumns: `repeat(${activeSector.lessons.length}, minmax(148px, 1fr))`,
              minWidth: `${activeSector.lessons.length * 150}px`,
            }}
          >
            {activeSector.lessons.map((item, index) => {
              const globalIndex = activeSectorStart + index;
              const complete = completedIds.includes(item.id);
              const current = item.id === lesson.id;
              const unlocked = globalIndex <= completedIds.length;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`lesson-node ${current ? "is-current" : ""} ${complete ? "is-complete" : ""} ${!unlocked ? "is-locked" : ""}`}
                  aria-current={current ? "step" : undefined}
                  aria-label={`${item.id}: ${item.navTitle}${complete ? ", superada" : !unlocked ? ", bloqueada" : ""}`}
                  disabled={!unlocked}
                  onClick={() => selectLesson(globalIndex, false)}
                >
                  <span className="lesson-node-marker">
                    {complete ? <Check aria-hidden="true" /> : !unlocked ? <LockKeyhole aria-hidden="true" /> : String(index + 1).padStart(2, "0")}
                  </span>
                  <span><small>{item.id}</small><strong>{item.navTitle}</strong></span>
                </button>
              );
            })}
          </div>
        </nav>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "lesson" | "notes")} className="mission-tabs">
          <div className="mission-nav">
            <TabsList variant="line">
              <TabsTrigger value="lesson"><BookOpen /> Lección</TabsTrigger>
              <TabsTrigger value="notes"><PencilLine /> Mis apuntes</TabsTrigger>
            </TabsList>
            <div className="lesson-meta">
              {lessonComplete ? <span className="completion-label"><CircleCheckBig /> SUPERADA</span> : <span>LECTURA + PRÁCTICA · A TU RITMO</span>}
            </div>
          </div>

          <TabsContent value="lesson" className="study-surface">
            <div className="lesson-workspace">
              <article className="study-copy">
                <header className="lesson-heading">
                  <span className="lesson-code">{lesson.id} / {activeSector.id === "02" ? "MATEMÁTICAS PARA CV" : "FUNDAMENTOS"}</span>
                  <h2>{lesson.title}</h2>
                  <p className="lesson-lead">{lesson.lead}</p>
                </header>

                <section className="key-idea">
                  <Terminal aria-hidden="true" />
                  <div><strong>EN UNA FRASE</strong><p>{lesson.keyIdea}</p></div>
                </section>

                {lesson.sections.map((section, index) => (
                  <section key={section.title}>
                    <span className="section-number">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{section.title}</h3>
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.formula && (
                      <div className="tensor-card" aria-label={section.formula.label}>
                        <span>{section.formula.label}</span>
                        <strong>{section.formula.value}</strong>
                        <div>{section.formula.parts.map((part) => <span key={part}>{part}</span>)}</div>
                      </div>
                    )}
                  </section>
                ))}

                <section className="takeaway-block">
                  <span className="section-number">{String(lesson.sections.length + 1).padStart(2, "0")}</span>
                  <h3>Lo que debes llevarte</h3>
                  <ul>
                    {lesson.takeaways.map((takeaway) => <li key={takeaway}><Check aria-hidden="true" /> {takeaway}</li>)}
                  </ul>
                </section>

                <section className="sources-block">
                  <span className="section-number">{String(lesson.sections.length + 2).padStart(2, "0")}</span>
                  <h3>Fuentes para comprobarlo</h3>
                  <p>La explicación está escrita para estudiar; estos enlaces llevan a la documentación técnica utilizada para verificarla.</p>
                  <div className="source-links">
                    {lesson.sources.map((source) => (
                      <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                        {source.label}<ExternalLink aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </section>
              </article>

              <aside className="instrument-column" aria-label="Laboratorio interactivo">
                <LessonLab id={lesson.id} lab={lesson.lab} labTitle={lesson.labTitle} labInstruction={lesson.labInstruction} />
                <div className="field-note">
                  <ScanLine aria-hidden="true" />
                  <p><strong>Qué debes observar:</strong> {lesson.keyIdea}</p>
                </div>
              </aside>
            </div>

            <section className="mastery-checkpoint" aria-labelledby="quiz-title">
              <div className="checkpoint-intro">
                <span className="eyebrow">PRUEBA DE DOMINIO · {lesson.id}</span>
                <h2 id="quiz-title">Demuestra que puedes razonarlo</h2>
                <p>No basta con reconocer una frase. Responde las tres preguntas correctamente para desbloquear la siguiente misión.</p>
                <div className="mastery-rule">
                  <span>CRITERIO</span><strong>3 / 3</strong><small>puedes repetir sin penalización</small>
                </div>
                {lessonComplete && <div className="already-complete"><CircleCheckBig aria-hidden="true" /> Esta misión ya está superada.</div>}
              </div>

              <div className="question-stack">
                {lesson.questions.map((question, questionIndex) => {
                  const selected = answers[question.id];
                  const chosenIndex = selected === undefined ? undefined : Number(selected);
                  const correct = chosenIndex === question.correctIndex;
                  return (
                    <fieldset className="question-card" key={question.id}>
                      <legend><span>{String(questionIndex + 1).padStart(2, "0")}</span>{question.prompt}</legend>
                      <RadioGroup
                        value={selected ?? ""}
                        onValueChange={(value) => {
                          setAnswers((current) => ({ ...current, [question.id]: value }));
                          setSubmitted(false);
                        }}
                        className="question-options"
                      >
                        {question.options.map((option, optionIndex) => {
                          const result = submitted
                            ? optionIndex === question.correctIndex
                              ? "correct"
                              : chosenIndex === optionIndex
                                ? "wrong"
                                : undefined
                            : undefined;
                          return (
                            <Label
                              key={option}
                              htmlFor={`${question.id}-${optionIndex}`}
                              className="question-option"
                              data-result={result}
                            >
                              <RadioGroupItem value={String(optionIndex)} id={`${question.id}-${optionIndex}`} />
                              <span>{option}</span>
                            </Label>
                          );
                        })}
                      </RadioGroup>
                      {submitted && chosenIndex !== undefined && (
                        <div className={`question-feedback ${correct ? "is-correct" : "is-wrong"}`} role="status">
                          <strong>{correct ? "Bien razonado." : "Revisa la idea."}</strong> {question.feedback[chosenIndex]}
                        </div>
                      )}
                    </fieldset>
                  );
                })}

                <div className="mastery-actions">
                  <Button type="button" disabled={!allAnswered} onClick={checkMastery} className="check-button">
                    Comprobar las tres
                  </Button>
                  <span>{allAnswered ? "Listo para comprobar" : `${Object.keys(answers).length} / ${lesson.questions.length} respondidas`}</span>
                </div>

                {submitted && !perfectScore && (
                  <div className="mastery-result is-retry" role="status">
                    <strong>{score} / {lesson.questions.length}</strong>
                    <span>Lee las explicaciones, cambia lo necesario y vuelve a comprobar.</span>
                  </div>
                )}

                {perfectScore && (
                  <div className="mastery-result is-passed" role="status">
                    <CircleCheckBig aria-hidden="true" />
                    <div>
                      <strong>{isLastLessonInSector ? `Sector ${activeSector.id} dominado` : "Misión superada"}</strong>
                      <span>{isLastLessonInSector ? `Has completado sus ${sectorQuestionCount} preguntas y las ${activeSector.lessons.length} misiones.` : "La siguiente misión ya está disponible en la ruta."}</span>
                    </div>
                    {hasNextLesson && (
                      <Button type="button" onClick={goToNextLesson}>{nextLessonChangesSector ? `Entrar en Sector ${nextLesson?.id.slice(0, 2)}` : "Siguiente misión"} <ArrowRight /></Button>
                    )}
                  </div>
                )}

                {!submitted && lessonComplete && hasNextLesson && nextLesson && (
                  <Button type="button" variant="outline" onClick={goToNextLesson} className="continue-button">
                    Continuar con {nextLesson.id} <ArrowRight />
                  </Button>
                )}

                {challenge && (
                  <div className="transfer-challenge">
                    <span className="eyebrow">CASO DE TRANSFERENCIA · A TU RITMO</span>
                    <h3>Resuélvelo sin opciones</h3>
                    <p>{challenge.prompt}</p>
                    <details>
                      <summary>Ver pauta para autocorregirte</summary>
                      <p>{challenge.check}</p>
                    </details>
                    <small>Escribe tu razonamiento en el cuaderno antes de abrir la pauta. Este caso no se corrige automáticamente.</small>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="notes" className="study-surface notes-surface">
            <div className="notes-heading">
              <div>
                <span className="lesson-code">CUADERNO PERSONAL / {lesson.id}</span>
                <h2>Explícatelo con tus palabras</h2>
                <p>Tus notas no sustituyen la explicación verificada. Viven al lado de ella para que traduzcas cada concepto a tu manera de pensar.</p>
              </div>
              <span className={`save-state ${saved ? "is-saved" : ""}`}>{saved ? "GUARDADO EN ESTE DISPOSITIVO" : "CAMBIOS SIN GUARDAR"}</span>
            </div>
            <div className="notes-prompt"><strong>Prueba esto:</strong> {challenge ? challenge.prompt : `Explica «${lesson.navTitle.toLowerCase()}» sin copiar ninguna frase de la lección y añade un ejemplo propio.`}</div>
            <Label htmlFor="personal-notes" className="notes-label">MIS APUNTES · {lesson.id}</Label>
            <Textarea id="personal-notes" value={notes} onChange={(event) => { setNotes(event.target.value); setSaved(false); }} placeholder={`Para mí, ${lesson.navTitle.toLowerCase()} significa...`} className="notes-editor" />
            <div className="notes-actions">
              <p>Se guarda solo en este navegador. La lección original nunca se modifica.</p>
              <Button type="button" onClick={saveNotes} disabled={saved}><Save /> Guardar apuntes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
