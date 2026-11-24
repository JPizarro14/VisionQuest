import { allLessons } from "@/app/course-map";
import { practiceChallenges } from "@/app/practice-challenges";
import { numericalPractice } from "@/app/practice-numerical";
import { curatedPractice } from "@/app/practice-curated";
import { codePractice } from "@/app/practice-code-choice";
import { reasoningPrompts } from "@/app/practice-reasoning";
import { fieldbookPractice } from "@/app/practice-fieldbook";
import { placePractice } from "@/app/practice-placement";
import type { PracticeChoice, PracticeOpen, StageExercise } from "@/app/practice-types";

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

const reasoning: PracticeOpen[] = allLessons.flatMap((lesson) => {
  const prompts = reasoningPrompts[lesson.id];
  if (!prompts || prompts.length !== lesson.sections.length) {
    throw new Error(`Preguntas de razonamiento incompletas para la misión ${lesson.id}.`);
  }
  return lesson.sections.map((section, index) => ({
      kind: "open" as const,
      id: `section-${lesson.id}-${index + 1}`, lessonId: lesson.id,
      category: "razonamiento" as const,
      prompt: prompts[index],
      solution: section.paragraphs.join(" "),
      rubric: ["Responde a cada parte sin consultar las opciones.", "Contrasta el mecanismo, el ejemplo o la convención con la solución."],
  }));
});

const transferCases: PracticeOpen[] = Object.entries(practiceChallenges).map(([lessonId, challenge]) => ({
  kind: "open", id: `case-${lessonId}`, lessonId, category: "caso",
  prompt: challenge.prompt,
  solution: challenge.check,
  rubric: ["Declara los supuestos necesarios.", "Resuelve el caso con unidades y criterio de evaluación.", "Contrasta tu razonamiento con la pauta; admite soluciones alternativas justificadas."],
}));

// Permanecen en la biblioteca de origen; en una ronda su contenido ya lo cubre
// una pregunta más concreta (o un caso que sí exige aplicar el concepto).
export const retiredPractice = new Set([
  "section-18.01-3", "case-17.06", "course-q-17.03-2", "course-q-18.02-3",
  "course-q-18.01-3", "course-q-18.06-1", "course-q-13.02-1",
]);
export const practiceItems: StageExercise[] = [
  ...[...courseChoices, ...numericalPractice, ...reasoning, ...transferCases, ...curatedPractice, ...codePractice]
    .filter(item => !retiredPractice.has(item.id)).map(placePractice),
  ...fieldbookPractice,
];

export const practiceCounts = {
  choices: practiceItems.filter(item => item.kind === "choice").length,
  open: practiceItems.filter(item => item.kind === "open").length,
  total: practiceItems.length,
};
