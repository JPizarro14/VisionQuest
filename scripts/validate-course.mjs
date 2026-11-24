import fs from "node:fs";
import ts from "typescript";

const opt = {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}};
const dataUrl = source => "data:text/javascript;base64,"+Buffer.from(ts.transpileModule(source,opt).outputText).toString("base64");
const builderUrl = dataUrl(fs.readFileSync("app/sector-builder.ts","utf8"));
const names = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen"];
const expected = [7,12,12,12,10,8,8,8,8,8,8,6,6,6,6,6,6,6];
const challenges = (await import(dataUrl(fs.readFileSync("app/practice-challenges.ts","utf8")))).practiceChallenges;
const studyWeeks = (await import(dataUrl(fs.readFileSync("app/study-plan.ts","utf8")))).studyWeeks;
const advanced = (await import(dataUrl(fs.readFileSync("app/advanced-probes.ts","utf8")))).advancedProbes;
const final = (await import(dataUrl(fs.readFileSync("app/final-probes.ts","utf8")))).finalProbes;
const studySource = fs.readFileSync("app/study-labs.tsx","utf8").replace(/\r\n/g, "\n");
const localProbeCode = studySource.slice(studySource.indexOf("const probes:"),studySource.indexOf("\n\nexport function StudyLab"))
  .replace("const probes: Record<string, Probe> =", "export const localProbes =")
  .replace(/  \.\.\.(advancedProbes|finalProbes),\n/g, "");
const localProbes = (await import(dataUrl(localProbeCode))).localProbes;
const probes = {...localProbes,...advanced,...final};
const labSources = ["lesson-labs", "math-labs", "filter-labs", "morphology-labs", "geometry-labs", "detection-labs", "mask-iou-lab"]
  .map(name=>fs.readFileSync(`app/${name}.tsx`,"utf8")).join("\n");
const ids = new Set(), orderedIds = [], questionIds = new Set(), errors = [];
let questions = 0, labs = 0;
for (let sector=0; sector<names.length; sector++) {
  const name=names[sector], number=sector+1;
  const source=fs.readFileSync(sector===0?"app/course-data.ts":`app/sector-${name}-data.ts`,"utf8")
    .replace(/import \{ buildSector, type DraftLesson \} from "@\/app\/sector-builder";/,
      'import { buildSector } from "'+builderUrl+'";');
  const mod=await import(dataUrl(source));
  const lessons=mod[`sector${name[0].toUpperCase()+name.slice(1)}Lessons`];
  if (!lessons || lessons.length!==expected[sector]) {errors.push(`sector ${number}: expected ${expected[sector]} lessons`);continue;}
  for(const [index,l] of lessons.entries()) {
    const id=`${String(number).padStart(2,"0")}.${String(index+1).padStart(2,"0")}`;
    if(l.id!==id || ids.has(l.id)) errors.push(`${id}: wrong order or duplicate ID`);
    ids.add(l.id);
    orderedIds.push(l.id);
    for(const key of ["title","navTitle","objective","lead","keyIdea","labTitle","labInstruction"])
      if(typeof l[key]!=="string" || !l[key].trim()) errors.push(`${id}: missing ${key}`);
    if(!Array.isArray(l.sections) || l.sections.length<3 || l.sections.some(s=>!s.title || s.paragraphs?.length<1 || s.paragraphs.some(p=>!p.trim())) ||
       l.takeaways?.length<3 || l.sources?.length<1 || l.sources.some(s=>!s.label || !s.url.startsWith("https://")))
      errors.push(`${id}: incomplete lesson`);
    if(number>=11 && (!challenges[id]?.prompt || !challenges[id]?.check)) errors.push(`${id}: missing open case`);
    if(l.lab==="study-simulation") {
      if(!probes[id]) errors.push(`${id}: no live study probe`);
    } else if(!labSources.includes(`"${l.lab}"`)) errors.push(`${id}: unknown lab ${l.lab}`);
    labs++;
    if(l.questions?.length!==3) {errors.push(`${id}: question count`);continue;}
    for(const q of l.questions) {
      questions++;
      if(questionIds.has(q.id) || (number>=6 && q.id!==`q-${id}-${questions%3 || 3}`)) errors.push(`${id}: duplicate or wrong question ID ${q.id}`);
      questionIds.add(q.id);
      if(!q.prompt?.trim() || q.options?.length!==4 || new Set(q.options).size!==4 ||
        q.feedback?.length!==4 || !Number.isInteger(q.correctIndex) || q.correctIndex<0 || q.correctIndex>3 ||
        !q.feedback[q.correctIndex].startsWith("Correcto:") ||
        q.feedback.some((f,i)=>!f.trim() || (i!==q.correctIndex && f.startsWith("Correcto:"))))
        errors.push(`${q.id}: answers/feedback`);
    }
  }
}
for(const [id,p] of Object.entries(probes)) {
  if(!ids.has(id)) errors.push(`${id}: orphan probe`);
  if(p.min>=p.max || p.initial<p.min || p.initial>p.max ||
    (p.initial-p.min)%(p.step??1)!==0) errors.push(`${id}: invalid slider`);
  for(let n=p.min;n<=p.max;n+=(p.step??1)) {
    const output=p.output(n);
    if(!output.values?.length || !output.observation || /NaN|Infinity|undefined/.test(JSON.stringify(output)))
      errors.push(`${id}: invalid calculation at ${n}`);
  }
}
for(const id of Object.keys(challenges)) if(!ids.has(id) || Number(id.slice(0,2))<11) errors.push(`${id}: orphan case`);
let nextPlanIndex = 0;
if(studyWeeks.length!==13) errors.push("Study plan: expected 13 teaching weeks");
for(const [index,week] of studyWeeks.entries()) {
  const start=orderedIds.indexOf(week.from), end=orderedIds.indexOf(week.to);
  if(start!==nextPlanIndex || end<start || !week.dates || !week.hours || !week.apartados)
    errors.push(`Study plan week ${index+1}: missing, out of order or incomplete`);
  nextPlanIndex=end+1;
}
if(nextPlanIndex!==orderedIds.length) errors.push(`Study plan ends after ${nextPlanIndex}/${orderedIds.length} lessons`);
if(ids.size!==143 || questions!==429 || labs!==143 || Object.keys(challenges).length!==50)
  errors.push(`Unexpected totals ${ids.size} lessons / ${questions} questions / ${labs} labs / ${Object.keys(challenges).length} cases`);
const { stages } = await import(dataUrl(fs.readFileSync("app/etapas/curriculum.ts", "utf8")));
const { assess, firstPending } = await import(dataUrl(fs.readFileSync("app/etapas/progress.ts", "utf8")));
const pages = {};
if (new Set(stages.map(stage => stage.id)).size !== stages.length) errors.push("Hay identificadores de etapa duplicados");
for (const [i, stage] of stages.entries()) {
  if (firstPending(stages, pages) !== i) errors.push(`Etapa inaccesible: ${stage.id}`);
  for (const [lesson] of stage.further) if (!ids.has(lesson)) errors.push(`${stage.id}: referencia desconocida ${lesson}`);
  if (!stage.pieces.length || stage.pieces.some(card => card.length !== 5 || card.some(value => !value.trim())))
    errors.push(`${stage.id}: ficha de decisión incompleta`);
  if (stage.quiz.length !== 3 || stage.quiz.some(q => !q.choices[q.correct] || q.choices.some(([choice, reason]) => !choice || !reason)))
    errors.push(`${stage.id}: test incompleto`);
  const correct = stage.quiz.map(q => q.correct);
  if (assess(stage, correct, false).mastered || assess(stage, correct.slice(1), true).mastered ||
      assess(stage, [-1, ...correct.slice(1)], true).mastered || !assess(stage, correct, true).mastered)
    errors.push(`${stage.id}: el dominio debe exigir el caso explicado y todas las respuestas correctas`);
  pages[stage.id] = { done: true };
}
if (firstPending(stages, pages) !== stages.length || firstPending(stages, { [stages[1].id]: { done: true } }) !== 0)
  errors.push("El desbloqueo debe respetar la primera etapa pendiente");
if(errors.length) {console.error(errors.join("\n"));process.exitCode=1;}
else console.log(`Validación OK: ${stages.length} etapas, casos, tests, referencias y desbloqueos; 18 sectores, 143 misiones, 429 preguntas, 143 laboratorios y 50 casos abiertos.`);
