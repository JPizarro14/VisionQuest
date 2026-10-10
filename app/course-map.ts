import { sectorOneLessons, type SectorLesson } from "@/app/course-data";
import { sectorTwoLessons } from "@/app/sector-two-data";
import { sectorThreeLessons } from "@/app/sector-three-data";
import { sectorFourLessons } from "@/app/sector-four-data";
import { sectorFiveLessons } from "@/app/sector-five-data";
import { sectorSixLessons } from "@/app/sector-six-data";
import { sectorSevenLessons } from "@/app/sector-seven-data";
import { sectorEightLessons } from "@/app/sector-eight-data";
import { sectorNineLessons } from "@/app/sector-nine-data";
import { sectorTenLessons } from "@/app/sector-ten-data";
import { sectorElevenLessons } from "@/app/sector-eleven-data";
import { sectorTwelveLessons } from "@/app/sector-twelve-data";
import { sectorThirteenLessons } from "@/app/sector-thirteen-data";
import { sectorFourteenLessons } from "@/app/sector-fourteen-data";
import { sectorFifteenLessons } from "@/app/sector-fifteen-data";
import { sectorSixteenLessons } from "@/app/sector-sixteen-data";
import { sectorSeventeenLessons } from "@/app/sector-seventeen-data";
import { sectorEighteenLessons } from "@/app/sector-eighteen-data";

export type CourseSector = {
  id: string;
  title: string;
  shortTitle: string;
  lessons: SectorLesson[];
};

export const sectorTitles = [
  "La imagen como dato",
  "Matemáticas necesarias",
  "Operaciones sobre imágenes",
  "Morfología e histogramas",
  "Geometría y visión clásica",
  "Machine learning",
  "Redes neuronales",
  "Entrenamiento",
  "CNN y arquitecturas",
  "Clasificación",
  "Detección",
  "Segmentación, pose y OCR",
  "Transformers y modelos base",
  "Vídeo y visión 3D",
  "Datos y diagnóstico",
  "Producción",
  "Arquitectura de sistemas CV",
  "Entrevistas técnicas",
];

export const availableSectors: CourseSector[] = [
  {
    id: "01",
    title: sectorTitles[0],
    shortTitle: "IMAGEN COMO DATO",
    lessons: sectorOneLessons,
  },
  {
    id: "02",
    title: sectorTitles[1],
    shortTitle: "MATEMÁTICAS NECESARIAS",
    lessons: sectorTwoLessons,
  },
  {
    id: "03",
    title: sectorTitles[2],
    shortTitle: "OPERACIONES Y FILTROS",
    lessons: sectorThreeLessons,
  },
  {
    id: "04",
    title: sectorTitles[3],
    shortTitle: "MORFOLOGÍA E HISTOGRAMAS",
    lessons: sectorFourLessons,
  },
  {
    id: "05",
    title: sectorTitles[4],
    shortTitle: "GEOMETRÍA Y VISIÓN CLÁSICA",
    lessons: sectorFiveLessons,
  },
  {
    id: "06",
    title: sectorTitles[5],
    shortTitle: "MACHINE LEARNING",
    lessons: sectorSixLessons,
  },
  {
    id: "07",
    title: sectorTitles[6],
    shortTitle: "REDES NEURONALES",
    lessons: sectorSevenLessons,
  },
  {
    id: "08",
    title: sectorTitles[7],
    shortTitle: "ENTRENAMIENTO",
    lessons: sectorEightLessons,
  },
  {
    id: "09",
    title: sectorTitles[8],
    shortTitle: "CNN Y ARQUITECTURAS",
    lessons: sectorNineLessons,
  },
  {
    id: "10",
    title: sectorTitles[9],
    shortTitle: "CLASIFICACIÓN",
    lessons: sectorTenLessons,
  },
  { id: "11", title: sectorTitles[10], shortTitle: "DETECCIÓN", lessons: sectorElevenLessons },
  { id: "12", title: sectorTitles[11], shortTitle: "SEGMENTACIÓN, POSE Y OCR", lessons: sectorTwelveLessons },
  { id: "13", title: sectorTitles[12], shortTitle: "TRANSFORMERS Y MODELOS BASE", lessons: sectorThirteenLessons },
  { id: "14", title: sectorTitles[13], shortTitle: "VÍDEO Y VISIÓN 3D", lessons: sectorFourteenLessons },
  { id: "15", title: sectorTitles[14], shortTitle: "DATOS Y DIAGNÓSTICO", lessons: sectorFifteenLessons },
  { id: "16", title: sectorTitles[15], shortTitle: "PRODUCCIÓN", lessons: sectorSixteenLessons },
  { id: "17", title: sectorTitles[16], shortTitle: "ARQUITECTURA DE SISTEMAS CV", lessons: sectorSeventeenLessons },
  { id: "18", title: sectorTitles[17], shortTitle: "ENTREVISTAS TÉCNICAS", lessons: sectorEighteenLessons },
];

export const allLessons = availableSectors.flatMap((sector) => sector.lessons);

export function findSectorForLesson(lessonId: string) {
  return availableSectors.find((sector) =>
    sector.lessons.some((lesson) => lesson.id === lessonId),
  );
}

export function sectorStartIndex(sectorId: string) {
  const index = availableSectors.findIndex((sector) => sector.id === sectorId);
  if (index < 0) return -1;
  return availableSectors
    .slice(0, index)
    .reduce((total, sector) => total + sector.lessons.length, 0);
}
