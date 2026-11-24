import { stages, type StageId } from "@/app/etapas/curriculum";
import type { PracticeItem, StageExercise } from "@/app/practice-types";

// La lección identifica la lectura de origen, no el filtro que ve el estudiante.
// Cuando una pregunta toma otra decisión, prevalece su asignación individual.
function indexByStage(groups: Record<StageId, string>) {
  const index = new Map<string, StageId>();
  for (const { id } of stages) {
    for (const key of groups[id].trim().split(/\s+/)) {
      if (index.has(key)) throw new Error(`Asignación de práctica duplicada: ${key}`);
      index.set(key, id);
    }
  }
  return index;
}

const lessons = indexByStage({
  captura: `01.01 01.02 01.03 01.04 01.05 01.06 02.01 05.05 14.01 14.04 14.05 17.02`,
  datos: `02.06 02.07 02.11 04.08 04.09 06.02 06.03 15.01 15.02 18.03`,
  preparacion: `01.07 02.02 03.01 03.02 03.03 03.04 03.05 03.06 03.07 03.08 03.09 03.10 03.11 03.12
    04.01 04.02 04.03 04.04 04.05 04.06 04.07 04.10 04.11 04.12 05.01 05.02 05.03 05.04 05.09 05.10
    08.03 08.04 11.01 11.08 17.03 18.01 18.04`,
  prediccion: `02.03 02.04 02.05 05.06 05.07 05.08 06.01 06.04 06.05 06.06 07.01 07.02 07.03
    09.01 09.02 09.03 09.04 09.05 09.07 09.08 10.01 11.04 11.05 11.06 12.01 12.04 13.01 13.02
    13.03 13.04 13.05 14.02 14.03`,
  entrenamiento: `02.08 02.09 02.12 06.07 07.04 07.05 07.06 07.07 07.08 08.01 08.02 08.05
    08.06 08.07 08.08 09.06 12.03 13.06`,
  evaluacion: `02.10 06.08 10.02 10.03 10.04 10.05 10.06 10.07 10.08 11.02 11.03 11.07 12.02
    12.05 12.06 15.03 15.05 15.06 17.01 17.04 18.02`,
  despliegue: `14.06 15.04 16.01 16.02 16.03 16.04 16.05 16.06 17.05 17.06 18.05 18.06`,
});

export const individualPlacements = indexByStage({
  captura: `section-02.02-1 section-02.02-2 course-q-18.06-2 section-17.06-1`,
  datos: `course-q-06.01-2 section-06.01-2 course-q-06.04-3
    calc-validation-count-1 course-q-08.04-2 section-08.04-2 course-q-08.08-2
    course-q-11.08-3 course-q-12.04-2 section-12.04-2 course-q-13.04-3 section-13.04-3 case-13.04
    course-q-14.01-2 section-14.01-3 course-q-14.06-3 section-14.06-3 course-q-17.01-3
    interview-06-case interview-17-case course-q-18.06-3`,
  preparacion: `course-downsample-filter section-01.06-3 course-s2-reshape-transpose section-02.05-3
    interview-01-code snippet-01-review section-01.02-3 course-q-09.06-2 snippet-09-review
    course-q-12.01-2 section-12.04-1 case-12.04 course-q-12.04-1 snippet-12-review section-12.05-1
    course-q-15.03-2 course-q-17.06-1`,
  prediccion: `course-s2-embedding-shape section-02.01-3 course-s2-prob-sum
    course-s2-softmax-shift section-02.12-2 course-q-07.08-2 section-12.06-1 section-17.04-1`,
  entrenamiento: `course-q-06.03-1 course-q-06.06-2 section-07.02-3 section-09.05-2
    course-q-13.03-2 section-13.03-2 case-13.06`,
  evaluacion: `course-q-06.03-2 section-06.03-3 course-q-07.02-3 section-07.04-3
    course-q-08.02-3 section-08.02-3 course-q-09.08-2 section-11.06-3 course-q-11.06-3
    case-12.03 course-q-12.03-1 course-q-12.04-3 section-12.04-3
    course-q-13.02-3 case-13.02 course-q-13.04-2 section-13.04-2 course-q-13.05-3 section-13.05-3
    course-q-13.06-2 section-13.06-2 case-14.03 section-14.03-3 course-q-15.01-3
    calc-false-alarms-1 course-q-17.06-2 section-17.06-2
    course-q-18.03-2 course-q-18.03-3 section-18.03-2 section-18.03-3 interview-18-code snippet-18-review
    calc-missed-defects-1 section-18.06-2 section-12.03-3 section-10.01-3`,
  despliegue: `course-q-09.07-3 section-09.07-2 course-q-09.08-3 section-09.08-3 interview-09-case
    section-12.06-3 course-q-13.06-3 course-q-14.01-3 section-14.01-2
    course-q-17.01-2 section-17.01-3 course-q-18.04-3 section-18.04-3`,
});

// Solo entra en «Lo estudiado» lo que se puede responder con la lectura, las
// fichas y el caso de la etapa. El resto sigue disponible para profundizar.
export const readingPractice = new Set(`
  course-shape-rgb course-brighter-pixel course-gray-shape course-numpy-coordinate course-last-coordinate course-rows-shape
  course-levels-eight-bit course-float-range course-sixteen-to-eight course-split-red course-resolution-detail
  course-s2-rgb-structure section-01.01-1 section-01.01-2 section-01.02-1 section-01.02-2 section-01.03-1
  section-01.03-2 section-01.06-1 section-01.06-2 course-q-17.02-1 course-q-17.02-2 case-17.02 calc-crack-resolution-1 calc-pixels-1
  course-s2-pca-limit section-02.07-3 course-s2-leakage-stats course-q-06.01-2 section-06.01-2
  course-q-06.02-1 course-q-06.02-2 course-q-06.02-3 section-06.02-1 section-06.02-2 section-06.03-1
  course-s4-hist-spatial section-04.08-3 course-q-08.04-2 section-08.04-2 course-q-11.08-3
  course-q-14.01-2 section-14.01-3 case-15.01 course-q-15.01-1 course-q-15.01-2 course-q-15.02-1
  course-q-15.02-2 case-15.02 course-q-17.01-3 calc-split-groups-1 calc-validation-count-1 snippet-06-read
  snippet-06-review snippet-15-read snippet-15-review course-q-18.03-1
  course-downsample-filter course-permute-hwc course-input-contract course-s2-broadcast-rgb course-s2-reshape-transpose
  section-01.07-1 section-02.05-3 calc-broadcast-1 course-s3-saturated-addition course-s3-global-threshold-fail
  course-s3-otsu-global course-s3-box-vs-gaussian course-s3-salt-pepper-filter course-s3-bilateral-weights
  course-s3-tiny-defect-blur course-s3-pipeline-evidence course-s4-equalize-rgb course-s4-clahe-purpose
  course-s5-02-1 course-s5-02-2 course-s5-02-3 course-s5-10-2 course-q-12.01-2 snippet-02-read
  snippet-02-review snippet-03-review snippet-09-review snippet-12-review interview-01-case interview-02-code
  interview-04-case case-18.04 calc-resize-object-1
  course-q-06.01-1 section-06.01-1 course-q-07.01-1 course-q-07.01-2 course-q-07.01-3
  course-q-07.02-1 course-q-07.02-2 section-07.02-1 section-07.02-2 calc-relu-1 snippet-07-read
  course-q-09.01-2 course-q-09.01-3 course-q-09.04-1 course-q-09.04-3
  course-q-10.01-1 course-q-10.01-2 course-q-10.01-3 course-s2-prob-sum course-s2-softmax-shift
  course-q-12.01-3 course-q-17.02-3
  course-s2-branch-gradient course-s2-backward-update section-02.09-2 section-02.09-3
  course-q-07.04-1 course-q-07.04-2 section-07.02-3 course-q-07.05-1 course-q-07.05-2 course-q-07.05-3
  course-q-07.06-1 course-q-07.06-2 course-q-07.06-3 course-q-07.07-3 course-q-08.01-1
  course-q-08.01-2 course-q-08.01-3 course-q-08.06-1 course-q-08.06-3 course-q-09.06-1
  course-q-09.06-3 section-09.06-1 calc-steps-epoch-1 snippet-07-review snippet-08-read interview-07-case interview-08-code interview-08-case
  section-02.10-1 section-02.10-2 section-02.10-3 course-s2-sensitivity-meaning course-s2-base-rate
  course-q-10.02-1 course-q-10.02-2 course-q-10.02-3 course-q-10.03-1 course-q-10.03-2 course-q-10.03-3
  course-q-10.04-1 course-q-10.04-2 course-q-10.06-1 course-q-10.06-3 course-q-10.07-1 course-q-10.07-2
  course-q-10.07-3 calc-precision-1 calc-recall-1 calc-mask-iou-1 case-11.02 case-12.02
  course-q-11.02-2 course-q-11.02-3 course-q-12.02-3 snippet-10-read snippet-11-read snippet-12-read
  case-18.02 calc-false-alarms-1 calc-missed-defects-1
  case-15.04 course-q-15.04-1 course-q-15.04-2 case-16.01 course-q-16.01-1 course-q-16.01-2
  course-q-16.02-1 course-q-16.02-2 course-q-16.02-3 case-16.02 case-16.03 course-q-16.03-1 course-q-16.03-2
  course-q-16.04-1 course-q-16.04-2 course-q-16.04-3 case-16.04 case-16.06
  course-q-16.06-1 course-q-16.06-2 course-q-17.05-1 course-q-17.05-2 course-q-17.05-3 case-17.05
  snippet-16-read snippet-16-review snippet-17-review interview-16-code interview-16-case calc-request-latency-1 calc-batch-throughput-1
`.trim().split(/\s+/));

export function placePractice(item: PracticeItem): StageExercise {
  const stageId = individualPlacements.get(item.id) ?? lessons.get(item.lessonId);
  if (!stageId) throw new Error(`Falta la etapa de práctica para ${item.id} (${item.lessonId})`);
  return { ...item, stageId, depth: readingPractice.has(item.id) ? "etapa" : "ampliacion" };
}
