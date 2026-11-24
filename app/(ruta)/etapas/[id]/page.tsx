import { notFound } from "next/navigation";
import { stages } from "@/app/etapas/curriculum";
import { StageReader } from "@/app/etapas/stage-reader";

export default async function StagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = stages.findIndex(stage => stage.id === id);
  if (index === -1) notFound();
  return <StageReader key={id} index={index} />;
}
