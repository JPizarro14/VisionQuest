import type { ReactNode } from "react";
import { NotebookShell } from "@/app/etapas/notebook";
import "@/app/etapas/fieldbook.css";

export default function StudyLayout({ children }: { children: ReactNode }) {
  return <NotebookShell>{children}</NotebookShell>;
}
