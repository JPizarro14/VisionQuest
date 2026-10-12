import { allLessons } from "@/app/course-map";
import { practiceChallenges } from "@/app/practice-challenges";
import { numericalPractice } from "@/app/practice-numerical";
import { curatedPractice } from "@/app/practice-curated";
import type { PracticeChoice, PracticeItem, PracticeOpen } from "@/app/practice-types";

const courseChoices: PracticeChoice[] = allLessons.flatMap((lesson) =>
  lesson.questions.map((question) => ({
    kind: "choice" as const,
    id: `course-${question.id}`,
    lessonId: lesson.id,
    category: "concepto" as const,
    prompt: question.prompt,
    options: question.options,
    correctIndex: question.correctIndex,
    feedback: question.feedback.map((message, index) =>
      index === question.correctIndex && message.length < 55
        ? message + " Idea clave: " + lesson.keyIdea
        : message),
  })),
);

const oralPractice: PracticeOpen[] = allLessons.flatMap((lesson) => [
  {
    kind: "open" as const, id: `oral-${lesson.id}`, lessonId: lesson.id,
    category: "razonamiento" as const,
    prompt: `Entrevista: explica «${lesson.navTitle}» con tus palabras. Después, responde a este objetivo: ${lesson.objective}`,
    solution: `${lesson.keyIdea} ${lesson.takeaways.join(" ")}`,
    rubric: ["Define la idea central sin leer el temario.", "Usa al menos un ejemplo o límite relevante.", "Justifica tu elección con las ideas de la solución orientativa."],
  },
  ...lesson.sections.map((section, index) => ({
    kind: "open" as const,
    id: `section-${lesson.id}-${index + 1}`, lessonId: lesson.id,
    category: "razonamiento" as const,
    prompt: `En el tema ${lesson.id} («${lesson.navTitle}»), explica «${section.title}». ¿Qué ocurre, por qué importa y qué matiz comprobarías antes de aplicarlo?`,
    solution: section.paragraphs.join(" "),
    rubric: ["Explica el mecanismo o criterio central.", "Aporta una consecuencia práctica.", "Menciona una condición, supuesto o límite cuando proceda."],
  })),
]);

const transferCases: PracticeOpen[] = Object.entries(practiceChallenges).map(([lessonId, challenge]) => ({
  kind: "open", id: `case-${lessonId}`, lessonId, category: "caso",
  prompt: challenge.prompt,
  solution: challenge.check,
  rubric: ["Declara los supuestos necesarios.", "Resuelve el caso con unidades y criterio de evaluación.", "Contrasta tu razonamiento con la pauta; admite soluciones alternativas justificadas."],
}));

export const practiceItems: PracticeItem[] = [
  ...courseChoices, ...numericalPractice, ...oralPractice, ...transferCases, ...curatedPractice,
];

export const practiceCounts = {
  courseChoices: courseChoices.length,
  numericalVariants: numericalPractice.length,
  oral: oralPractice.length,
  cases: transferCases.length,
  curated: curatedPractice.length,
  total: practiceItems.length,
};
