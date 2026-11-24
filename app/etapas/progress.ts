import type { Stage } from "./curriculum";

export type NotebookPage = { note: string; explained: boolean; done: boolean };
export const blankPage: NotebookPage = { note: "", explained: false, done: false };

export function firstPending(stages: Pick<Stage, "id">[], pages: Record<string, NotebookPage>) {
  const index = stages.findIndex(stage => !pages[stage.id]?.done);
  return index === -1 ? stages.length : index;
}

export function assess(stage: Stage, answers: (number | undefined)[], explained: boolean) {
  const answered = stage.quiz.filter((q, i) => q.choices.some((_, j) => answers[i] === j)).length;
  const score = stage.quiz.filter((q, i) => answers[i] === q.correct).length;
  return { answered, score, mastered: explained && score === stage.quiz.length };
}
