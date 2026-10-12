export type PracticeChoice = {
  kind: "choice";
  id: string;
  lessonId: string;
  family?: string;
  category: "concepto" | "calculo";
  prompt: string;
  options: string[];
  correctIndex: number;
  feedback: string[];
};

export type PracticeOpen = {
  kind: "open";
  id: string;
  lessonId: string;
  category: "razonamiento" | "laboratorio" | "codigo" | "caso";
  prompt: string;
  solution: string;
  rubric: string[];
};

export type PracticeItem = PracticeChoice | PracticeOpen;

export function calculatedChoice(
  family: string,
  lessonId: string,
  variant: number,
  prompt: string,
  answer: [string, string],
  distractors: [[string, string], [string, string], [string, string]],
): PracticeChoice {
  const initial = [answer, ...distractors];
  // Rotate the position so a learner cannot infer the answer from its position.
  const shift = (variant + Number(lessonId.slice(0, 2))) % 4;
  const rotated = initial.map((_, index) => initial[(index - shift + 4) % 4]);
  return {
    kind: "choice", id: `calc-${family}-${variant}`, lessonId, family,
    category: "calculo", prompt,
    options: rotated.map(([option]) => option) as PracticeChoice["options"],
    correctIndex: shift,
    feedback: rotated.map(([, explanation]) => explanation) as PracticeChoice["feedback"],
  };
}
