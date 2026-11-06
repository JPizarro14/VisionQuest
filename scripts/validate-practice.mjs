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
const reasoningUrl = dataUrl(file("app/practice-reasoning.ts"));
const { reasoningPrompts } = await import(reasoningUrl);
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
  .replace('"@/app/practice-reasoning"', '"' + reasoningUrl + '"')
  .replace('"@/app/practice-types"', '"' + typesUrl + '"');
const { practiceItems, practiceCounts } = await import(dataUrl(bankSource));
const ids = new Set(), prompts = new Set(), familyCounts = new Map();
const errors = [];
const numbers = (prompt, pattern) => {
  const match = prompt.match(pattern);
  if (!match) throw new Error("No se reconocen los datos del cálculo: " + prompt);
  return match.slice(1).map(value => Number(value.replace(",", ".")));
};
const tuple = values => "(" + values.join(", ") + ")";
const fraction = (numerator, denominator) => numerator + "/" + denominator;
const calculationAnswers = {
  pixels: prompt => {
    const [h, w] = numbers(prompt, /H = (\d+).*W = (\d+)/);
    return h * w;
  },
  "rgb-bytes": prompt => {
    const [h, w, c] = numbers(prompt, /H = (\d+), W = (\d+), C = (\d+)/);
    return h * w * c;
  },
  broadcast: prompt => {
    const [h, w, c] = numbers(prompt, /= \((\d+), (\d+), (\d+)\)/);
    return tuple([h, w, c]);
  },
  l2: prompt => {
    const [x1, y1, x2, y2] = numbers(prompt, /Entre \((\d+), (\d+)\) y \((\d+), (\d+)\)/);
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  },
  "mean-kernel": prompt => {
    const values = numbers(prompt, /son (\d+), (\d+) y (\d+)/);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  },
  "uint8-wrap": prompt => {
    const [value, increment] = numbers(prompt, /el valor (\d+) se suma a (\d+)/);
    return (value + increment) % 256;
  },
  "erode-run": prompt => {
    const [length] = numbers(prompt, /de (\d+) unos/);
    return Math.max(0, length - 2);
  },
  "dilate-run": prompt => {
    const [length] = numbers(prompt, /de (\d+) unos/);
    return length + 2;
  },
  translation: prompt => {
    const [dx, dy, x, y] = numbers(prompt, /traslación \((-?\d+), (-?\d+)\) al punto \((-?\d+), (-?\d+)\)/);
    return tuple([x + dx, y + dy]);
  },
  "tiles-count": prompt => {
    const [length, size, stride] = numbers(prompt, /Eje de (\d+) px: tiles de (\d+) px, paso (\d+) px/);
    let count = 0, last = -1;
    for (let start = 0; start + size <= length; start += stride) {
      count++;
      last = start;
    }
    return count + Number(last !== length - size);
  },
  "split-groups": prompt => numbers(prompt, /^(\d+) pacientes aportan/)[0],
  "knn-l1": prompt => {
    const [x1, y1, x2, y2] = numbers(prompt, /entre \((\d+), (\d+)\) y \((\d+), (\d+)\)/);
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  },
  "dense-params": prompt => {
    const [inputs, outputs] = numbers(prompt, /con (\d+) entradas, (\d+) salidas/);
    return inputs * outputs + outputs;
  },
  relu: prompt => tuple(numbers(prompt, /ReLU aplicada a \((-?\d+), (-?\d+), (-?\d+)\)/)
    .map(value => Math.max(0, value))),
  "steps-epoch": prompt => {
    const [samples, batch] = numbers(prompt, /^(\d+) ejemplos, batch size (\d+)/);
    return Math.ceil(samples / batch);
  },
  "validation-count": prompt => {
    const [percentage, samples] = numbers(prompt, /el (\d+)% de (\d+) muestras/);
    return samples * percentage / 100;
  },
  "conv-output": prompt => {
    const [size, kernel, padding, stride] = numbers(prompt, /tamaño (\d+), kernel (\d+), padding (\d+) y stride (\d+)/);
    let positions = 0;
    for (let start = 0; start + kernel <= size + 2 * padding; start += stride) positions++;
    return positions;
  },
  "conv-params": prompt => {
    const [kh, kw, inputs, outputs] = numbers(prompt, /Convolución (\d+)×(\d+) de (\d+) canales de entrada a (\d+) filtros/);
    return kh * kw * inputs * outputs + outputs;
  },
  precision: prompt => {
    const [tp, fp] = numbers(prompt, /TP = (\d+), FP = (\d+) y FN = (\d+)/);
    return fraction(tp, tp + fp);
  },
  recall: prompt => {
    const [tp, , fn] = numbers(prompt, /TP = (\d+), FP = (\d+) y FN = (\d+)/);
    return fraction(tp, tp + fn);
  },
  "box-iou": prompt => {
    const [side, shift] = numbers(prompt, /lado (\d+) px se desplazan (\d+) px solo en x/);
    const intersection = Math.max(0, side - shift) * side;
    return fraction(intersection, 2 * side * side - intersection);
  },
  "tile-global": prompt => {
    const [ox, oy, x1, y1, x2, y2] = numbers(prompt, /origen \((\d+), (\d+)\); caja xyxy local \((\d+), (\d+), (\d+), (\d+)\)/);
    return tuple([ox + x1, oy + y1, ox + x2, oy + y2]);
  },
  "mask-iou": prompt => {
    const [tp, fp, fn] = numbers(prompt, /TP = (\d+), FP = (\d+), FN = (\d+)/);
    return fraction(tp, tp + fp + fn);
  },
  cer: prompt => {
    const [length, substitutions] = numbers(prompt, /de (\d+) caracteres: hay (\d+) sustituciones/);
    return fraction(substitutions, length);
  },
  "vit-patches": prompt => {
    const [side, h, w] = numbers(prompt, /lado (\d+) px con parches (\d+)×(\d+)/);
    return (side / h) * (side / w);
  },
  "attention-pairs": prompt => numbers(prompt, /sobre (\d+) tokens/)[0] ** 2,
  "video-frames": prompt => {
    const [seconds, fps] = numbers(prompt, /Vídeo de (\d+) s a (\d+) fps/);
    return seconds * fps;
  },
  "stereo-depth": prompt => {
    const [focal, baseline, disparity] = numbers(prompt, /focal (\d+) px, baseline (\d+(?:[.,]\d+)?) m, disparidad (\d+) px/);
    return (focal * baseline / disparity).toFixed(3) + " m";
  },
  "independent-units": prompt => numbers(prompt, /^(\d+) pacientes tienen/)[0],
  "label-agreement": prompt => {
    const [agreed, total] = numbers(prompt, /coinciden en (\d+) de (\d+) imágenes/);
    return fraction(agreed, total);
  },
  "request-latency": prompt => numbers(prompt, /tarda (\d+) ms en captura, (\d+) ms en preproceso, (\d+) ms en inferencia y (\d+) ms en postproceso/)
    .reduce((sum, value) => sum + value, 0),
  "batch-throughput": prompt => {
    const [batch, seconds] = numbers(prompt, /Un batch de (\d+) imágenes tarda (\d+(?:[.,]\d+)?) s/);
    return batch / seconds + " imágenes/s";
  },
  "crack-resolution": prompt => {
    const [fov, pixels, crack] = numbers(prompt, /ve (\d+) mm en (\d+) px de ancho\. Una grieta mide (\d+(?:[.,]\d+)?) mm/);
    return (crack * pixels / fov).toFixed(2) + " px";
  },
  "false-alarms": prompt => {
    const [good, rate] = numbers(prompt, /inspeccionan (\d+) piezas buenas.*del (\d+)%/);
    return good * rate / 100;
  },
  "missed-defects": prompt => {
    const [pieces, prevalence, recall] = numbers(prompt, /^(\d+) piezas\/día, (\d+)% defectuosas y recall de defectos del (\d+)%/);
    return pieces * prevalence * (100 - recall) / 10000;
  },
  "resize-object": prompt => {
    const [object, width, resized] = numbers(prompt, /de (\d+) px de ancho en una imagen de (\d+) px se redimensiona a (\d+) px de ancho/);
    return (object * resized / width).toFixed(2) + " px";
  },
};
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
        !item.feedback[item.correctIndex].startsWith("Correcto:") ||
        item.feedback.some((message, index) => index !== item.correctIndex && message.startsWith("Correcto:")))
      errors.push("Invalid choice/feedback " + item.id + ": " + item.options.join(" | "));
    if (item.family) {
      familyCounts.set(item.family, (familyCounts.get(item.family) ?? 0) + 1);
      const calculate = calculationAnswers[item.family];
      if (!calculate || item.options[item.correctIndex] !== String(calculate(item.prompt)))
        errors.push("Incorrect calculated answer " + item.id);
    }
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
  if (/Después, responde a este objetivo:|Qué ocurre, por qué importa y qué matiz/.test(item.prompt))
    errors.push("Generic reasoning template " + item.id);
}
const byId = new Map(practiceItems.map(item => [item.id, item]));
for (const lesson of lessons) {
  const authored = reasoningPrompts[lesson.id];
  if (!authored || authored.length !== lesson.sections.length + 1 ||
      authored.some(prompt => !prompt.trim() || !prompt.includes("¿")))
    errors.push("Missing explicit reasoning questions " + lesson.id);
  const oral = byId.get("oral-" + lesson.id);
  if (oral?.kind !== "open" || oral.prompt !== authored?.[0] ||
      !oral.solution.includes(lesson.keyIdea) ||
      lesson.sections.some(section => section.paragraphs.some(paragraph => !oral.solution.includes(paragraph))))
    errors.push("Incomplete oral question/solution " + lesson.id);
  for (const [index, section] of lesson.sections.entries()) {
    const item = byId.get(`section-${lesson.id}-${index + 1}`);
    if (item?.kind !== "open" || item.prompt !== authored?.[index + 1] ||
        item.solution !== section.paragraphs.join(" "))
      errors.push("Mismatched section question/solution " + lesson.id + "-" + (index + 1));
  }
}
for (const lessonId of Object.keys(reasoningPrompts)) {
  if (!lessons.some(lesson => lesson.id === lessonId))
    errors.push("Orphan reasoning questions " + lessonId);
}
const coordinateQuestion = byId.get("oral-01.02");
if (coordinateQuestion?.kind !== "open" ||
    !/640.*480/.test(coordinateQuestion.prompt) ||
    !coordinateQuestion.prompt.includes("(x=5, y=2)") ||
    ["(480, 640, 3)", "imagen[2, 5]", "(639, 479)"].some(answer => !coordinateQuestion.solution.includes(answer)))
  errors.push("Coordinate interview must ask and answer shape, indexing and final coordinate");
const rgbQuestion = byId.get("section-01.05-1");
if (rgbQuestion?.kind !== "open" || !/RGB.*mostrar.*detectar.*iluminación/.test(rgbQuestion.prompt) ||
    !rgbQuestion.solution.includes("brillo y color") || !rgbQuestion.solution.includes("tono"))
  errors.push("RGB question must explain display versus selection under changing light");
for (const [id, expected] of [
  ["case-11.01", ["(112,47,132,57)", "(124,54,164,74)"]],
  ["case-12.06", ["72%", "textos reales", "falsos positivos"]],
  ["interview-12-case", ["72%", "condicional"]],
  ["case-16.02", ["600 imágenes", "cola sigue creciendo"]],
  ["case-18.01", ["(10,20)", "(x+30,y+10)"]],
]) {
  const item = byId.get(id);
  if (item?.kind !== "open" || expected.some(answer => !item.solution.includes(answer)))
    errors.push("Incomplete worked answer " + id);
}
if (familyCounts.size !== 36 || [...familyCounts.values()].some(count => count !== 40))
  errors.push("Expected 36 numerical families with 40 variants each");
if (practiceCounts.total !== practiceItems.length || practiceCounts.courseChoices !== 429 ||
    practiceCounts.numericalVariants !== 1440 || practiceCounts.cases !== 50 ||
    practiceCounts.curated !== 36 || practiceCounts.codeChoices !== 36 ||
    practiceCounts.oral !== lessons.length + lessons.reduce((count, lesson) => count + lesson.sections.length, 0))
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
  " familias numéricas con respuestas comprobadas, " + practiceCounts.oral + " preguntas de razonamiento, " +
  practiceCounts.codeChoices + " retos de código, " + lessons.length + " lecciones cubiertas.");
