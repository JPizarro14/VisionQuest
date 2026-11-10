import type { PracticeItem } from "@/app/practice-types";

export type PracticeMode = "mixto" | "test" | "codigo" | "abiertas" | "casos" | "errores" | "tema";
export type PracticeHistoryEntry = { attempts: number; mistakes: number; needsReview: boolean };
export type PracticeHistory = Record<string, PracticeHistoryEntry>;

export class PracticeHistoryError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHistoryEntry(value: unknown): value is PracticeHistoryEntry {
  return isRecord(value) &&
    typeof value.attempts === "number" && Number.isSafeInteger(value.attempts) && value.attempts >= 0 &&
    typeof value.mistakes === "number" && Number.isSafeInteger(value.mistakes) &&
    value.mistakes >= 0 && value.mistakes <= value.attempts &&
    typeof value.needsReview === "boolean";
}

export function restorePracticeHistory(stored: unknown, items: readonly PracticeItem[]): PracticeHistory {
  if (!isRecord(stored)) throw new PracticeHistoryError("El historial no tiene el formato esperado.");
  const entries: [string, PracticeHistoryEntry][] = [];
  for (const [id, entry] of Object.entries(stored)) {
    if (!isHistoryEntry(entry)) throw new PracticeHistoryError("Hay un registro de práctica inválido.");
    entries.push([id, entry]);
  }
  const history = Object.fromEntries(entries);
  for (const item of items) {
    if (item.kind !== "choice" || !item.family) continue;
    const prefix = `calc-${item.family}-`;
    const previousIds = Object.keys(history).filter(id => {
      if (!id.startsWith(prefix)) return false;
      const variant = id.slice(prefix.length);
      return /^[1-9]\d*$/.test(variant) && Number(variant) <= 40;
    });
    if (!previousIds.some(id => id !== item.id)) continue;
    history[item.id] = previousIds.reduce<PracticeHistoryEntry>((merged, id) => ({
      attempts: merged.attempts + history[id].attempts,
      mistakes: merged.mistakes + history[id].mistakes,
      needsReview: merged.needsReview || history[id].needsReview,
    }), { attempts: 0, mistakes: 0, needsReview: false });
    for (const id of previousIds) {
      if (id !== item.id) delete history[id];
    }
  }
  return history;
}

export function getPracticeCandidates(
  items: readonly PracticeItem[],
  sector: string,
  mode: PracticeMode,
  history: PracticeHistory,
  unseenOnly: boolean,
): PracticeItem[] {
  if (mode === "tema" && sector === "todos") return [];
  return items.filter(item => {
    if (sector !== "todos" && !item.lessonId.startsWith(sector + ".")) return false;
    if (mode === "tema") return true;
    if (!(mode === "mixto" || mode === "errores" ||
      (mode === "test" && item.kind === "choice") ||
      (mode === "codigo" && item.kind === "choice" && !!item.code) ||
      (mode === "abiertas" && item.kind === "open" && item.category !== "caso") ||
      (mode === "casos" && item.kind === "open" && item.category === "caso"))) return false;
    if (mode === "errores") return !!history[item.id]?.needsReview;
    return !unseenOnly || !history[item.id]?.attempts;
  });
}

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createPracticeSession(
  items: readonly PracticeItem[],
  mode: PracticeMode,
  amount: number,
): PracticeItem[] {
  if (mode === "tema") return shuffled(items);
  const groups = new Map<string, PracticeItem[]>();
  for (const item of items) {
    const key = item.kind === "choice" ? item.code ? "codigo" : item.category :
      item.category === "codigo" || item.category === "caso" ? "caso" : "abierta";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  for (const [key, group] of groups) groups.set(key, shuffled(group));
  const selected: PracticeItem[] = [];
  const pattern = ["concepto", "calculo", "codigo", "abierta", "caso", "concepto", "calculo", "codigo", "abierta", "abierta"];
  while (selected.length < amount) {
    let added = false;
    for (const key of pattern) {
      const item = groups.get(key)?.shift();
      if (!item) continue;
      selected.push(item);
      added = true;
      if (selected.length === amount) break;
    }
    if (!added) break;
  }
  return selected;
}
