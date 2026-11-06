import { allLessons } from "@/app/course-map";
import { practiceChallenges } from "@/app/practice-challenges";
import { numericalPractice } from "@/app/practice-numerical";
import { curatedPractice } from "@/app/practice-curated";
import { codePractice } from "@/app/practice-code-choice";
import { reasoningPrompts } from "@/app/practice-reasoning";
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

const oralPractice: PracticeOpen[] = allLessons.flatMap((lesson) => {
  const prompts = reasoningPrompts[lesson.id];
  if (!prompts || prompts.length !== lesson.sections.length + 1) {
    throw new Error(`Preguntas de razonamiento incompletas para la misión ${lesson.id}.`);
  }
  const [prompt, ...sectionPrompts] = prompts;
  return [
    {
      kind: "open" as const, id: `oral-${lesson.id}`, lessonId: lesson.id,
      category: "razonamiento" as const,
      prompt,
      solution: [
        lesson.keyIdea,
        ...lesson.sections.map((section) => `${section.title}: ${section.paragraphs.join(" ")}`),
      ].join("\n\n"),
      rubric: ["Responde a cada parte del enunciado.", "Relaciona los conceptos de la misión con los ejemplos y convenciones de la solución."],
    },
    ...lesson.sections.map((section, index) => ({
      kind: "open" as const,
      id: `section-${lesson.id}-${index + 1}`, lessonId: lesson.id,
      category: "razonamiento" as const,
      prompt: sectionPrompts[index],
      solution: section.paragraphs.join(" "),
      rubric: ["Responde a cada parte del enunciado.", "Justifica la respuesta con el mecanismo, ejemplo o convención descritos en la solución."],
    })),
  ];
});

const transferCases: PracticeOpen[] = Object.entries(practiceChallenges).map(([lessonId, challenge]) => ({
  kind: "open", id: `case-${lessonId}`, lessonId, category: "caso",
  prompt: challenge.prompt,
  solution: challenge.check,
  rubric: ["Declara los supuestos necesarios.", "Resuelve el caso con unidades y criterio de evaluación.", "Contrasta tu razonamiento con la pauta; admite soluciones alternativas justificadas."],
}));

export const practiceItems: PracticeItem[] = [
  ...courseChoices, ...numericalPractice, ...oralPractice, ...transferCases, ...curatedPractice, ...codePractice,
];

export const practiceCounts = {
  courseChoices: courseChoices.length,
  numericalVariants: numericalPractice.length,
  oral: oralPractice.length,
  cases: transferCases.length,
  curated: curatedPractice.length,
  codeChoices: codePractice.length,
  total: practiceItems.length,
};
