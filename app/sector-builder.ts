import type { SectorLesson } from "@/app/course-data";

export type DraftQuestion = [prompt: string, options: [string, string, string, string], correctIndex: number, feedback: [string, string, string, string]];
export type DraftSection = [title: string, first: string, second: string];
export type DraftLesson = {
  id: string; navTitle: string; title: string; objective: string; lead: string; keyIdea: string;
  sections: [DraftSection, DraftSection, DraftSection];
  takeaways: [string, string, string]; questions: [DraftQuestion, DraftQuestion, DraftQuestion];
  lab?: SectorLesson["lab"]; labTitle: string; labInstruction: string; source: [label: string, url: string];
};

export function buildSector(drafts: DraftLesson[]): SectorLesson[] {
  return drafts.map((d) => ({
    id: d.id, navTitle: d.navTitle, title: d.title, objective: d.objective,
    lead: d.lead, keyIdea: d.keyIdea,
    sections: d.sections.map(([title, first, second]) => ({ title, paragraphs: [first, second] })),
    takeaways: d.takeaways,
    questions: d.questions.map(([prompt, options, correctIndex, feedback], i) => {
      const shift = (Number(d.id.slice(3)) * 3 + i) % options.length;
      const rotate = <T,>(xs: T[]) => xs.map((_, n) => xs[(n - shift + xs.length) % xs.length]);
      const diagnosed = feedback.map((message, index) => {
        if (index === correctIndex || !/^(No\.|No basta\.|No corresponde\.|No depende\.)$/.test(message)) return message;
        return `La opción «${options[index]}» no resuelve este caso. ${d.keyIdea}`;
      });
      return { id: `q-${d.id}-${i + 1}`, prompt, options: rotate(options), correctIndex: (correctIndex + shift) % options.length, feedback: rotate(diagnosed) };
    }),
    lab: d.lab ?? "study-simulation", labTitle: d.labTitle, labInstruction: d.labInstruction,
    sources: [{ label: d.source[0], url: d.source[1] }],
  }));
}
