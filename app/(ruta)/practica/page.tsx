import { stages } from "@/app/etapas/curriculum";
import { PracticeStation } from "./practice-station";

export default async function PracticePage({ searchParams }: {
  searchParams: Promise<{ etapa?: string | string[] }>;
}) {
  const { etapa } = await searchParams;
  const stage = stages.find(item => item.id === etapa);
  return <PracticeStation initialStage={stage?.id ?? stages[0].id} unknownStage={etapa !== undefined && !stage} />;
}
