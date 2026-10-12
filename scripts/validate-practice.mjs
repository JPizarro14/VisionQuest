import fs from "node:fs";
import ts from "typescript";

const options = { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } };
const dataUrl = (source) => "data:text/javascript;base64," +
  Buffer.from(ts.transpileModule(source, options).outputText).toString("base64");
const file = (path) => fs.readFileSync(path, "utf8");
const typesUrl = dataUrl(file("app/practice-types.ts"));
const numericalUrl = dataUrl(file("app/practice-numerical.ts")
  .replace('"@/app/practice-types"', '"' + typesUrl + '"'));
const challengesUrl = dataUrl(file("app/practice-challenges.ts"));
const curatedUrl = dataUrl(file("app/practice-curated.ts")
  .replace('"@/app/practice-types"', '"' + typesUrl + '"'));
const codeUrl = dataUrl(file("app/practice-code-choice.ts")
  .replace('"@/app/practice-types"', '"' + typesUrl + '"'));
const builderUrl = dataUrl(file("app/sector-builder.ts"));
const names = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen"];
const lessons = [];
for (const name of names) {
  const source = file(name === "one" ? "app/course-data.ts" : "app/sector-" + name + "-data.ts")
    .replace(/import \{ buildSector, type DraftLesson \} from "@\/app\/sector-builder";/,
      'import { buildSector } from "' + builderUrl + '";');
  const mod = await import(dataUrl(source));
  lessons.push(...mod["sector" + name[0].toUpperCase() + name.slice(1) + "Lessons"]);
}
const lessonsUrl = dataUrl("export const allLessons = " + JSON.stringify(lessons) + ";");
const bankSource = file("app/practice-bank.ts")
  .replace('"@/app/course-map"', '"' + lessonsUrl + '"')
  .replace('"@/app/practice-challenges"', '"' + challengesUrl + '"')
  .replace('"@/app/practice-numerical"', '"' + numericalUrl + '"')
  .replace('"@/app/practice-curated"', '"' + curatedUrl + '"')
  .replace('"@/app/practice-code-choice"', '"' + codeUrl + '"')
  .replace('"@/app/practice-types"', '"' + typesUrl + '"');
const { practiceItems, practiceCounts } = await import(dataUrl(bankSource));
const ids = new Set(), prompts = new Set(), familyCounts = new Map();
const errors = [];
for (const item of practiceItems) {
  if (ids.has(item.id)) errors.push("Duplicate ID " + item.id);
  ids.add(item.id);
  if (prompts.has(item.prompt)) errors.push("Duplicate prompt " + item.id);
  prompts.add(item.prompt);
  if (!lessons.some(l => l.id === item.lessonId) || !item.prompt.trim())
    errors.push("Orphan or empty prompt " + item.id);
  if (item.kind === "choice") {
    if (item.options.length !== 4 || new Set(item.options).size !== 4 ||
        item.feedback.length !== 4 || item.feedback.some(f => !f.trim()) ||
        item.correctIndex < 0 || item.correctIndex > 3 ||
        !item.feedback[item.correctIndex].startsWith("Correcto:"))
      errors.push("Invalid choice/feedback " + item.id + ": " + item.options.join(" | "));
    if (item.family) familyCounts.set(item.family, (familyCounts.get(item.family) ?? 0) + 1);
    if (item.feedback.some((f, i) => i !== item.correctIndex &&
      /^(No\.|No corresponde\.|Insuficiente\.|Fuga\.|Es otro modelo\.)$/.test(f)))
      errors.push("Unexplained wrong answer " + item.id);
    if (item.category === "lectura-codigo" || item.category === "revisar-codigo") {
      if (!item.code?.trim() || item.code.trim().length < 10 ||
          item.feedback.some((f, i) => i !== item.correctIndex && f.trim().length < 25))
        errors.push("Incomplete code exercise " + item.id);
    }
  } else if (!item.solution.trim() || item.rubric.length < 2 || item.rubric.some(r => !r.trim())) {
    errors.push("Missing solution/rubric " + item.id);
  }
}
if (familyCounts.size !== 36 || [...familyCounts.values()].some(count => count !== 40))
  errors.push("Expected 36 numerical families with 40 variants each");
if (practiceCounts.total !== practiceItems.length || practiceCounts.courseChoices !== 429 ||
    practiceCounts.numericalVariants !== 1440 || practiceCounts.cases !== 50 ||
    practiceCounts.curated !== 36 || practiceCounts.codeChoices !== 36)
  errors.push("Unexpected practice counts " + JSON.stringify(practiceCounts));
for (let n = 1; n <= 18; n++) {
  const prefix = String(n).padStart(2, "0") + ".";
  for (const category of ["lectura-codigo", "revisar-codigo"]) {
    if (practiceItems.filter(item => item.lessonId.startsWith(prefix) && item.category === category).length !== 1)
      errors.push("Missing or duplicate code format " + prefix + category);
  }
}
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log("Práctica OK: " + practiceCounts.total + " ejercicios, " + familyCounts.size +
  " familias numéricas, " + practiceCounts.codeChoices + " retos de código, " + lessons.length + " lecciones cubiertas.");
