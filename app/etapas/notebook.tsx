"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "@/components/document-link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Eclipse, Library, ListChecks } from "lucide-react";
import { stages } from "./curriculum";
import { blankPage, firstPending, type NotebookPage } from "./progress";

const prefix = "visionquest-etapas-v1:";
const subscribeHydration = () => () => {};
type Book = { pages: Record<string, NotebookPage>; dark: boolean; notice: string };
const emptyBook: Book = { pages: {}, dark: false, notice: "" };
const storageNotice = "El navegador no permite guardar o leer el cuaderno. Copia tus apuntes antes de cambiar de página; habilita el almacenamiento para conservarlos y avanzar.";

function readBook(): Book {
  if (typeof window === "undefined") return emptyBook;
  try {
    const pages: Record<string, NotebookPage> = {};
    for (const { id } of stages) {
      pages[id] = {
        note: localStorage.getItem(`${prefix}${id}:note`) ?? "",
        explained: localStorage.getItem(`${prefix}${id}:explained`) === "true",
        done: localStorage.getItem(`${prefix}${id}:done`) === "true",
      };
    }
    return { pages, dark: localStorage.getItem(`${prefix}theme`) === "dark", notice: "" };
  } catch (error) {
    if (!(error instanceof DOMException)) throw error;
    return { ...emptyBook, notice: storageNotice };
  }
}

const Notebook = createContext<null | {
  book: Book; ready: boolean; pending: number;
  write: <K extends keyof NotebookPage>(id: string, field: K, value: NotebookPage[K]) => void;
}>(null);

export function useNotebook() {
  const book = useContext(Notebook);
  if (!book) throw new Error("La ruta de estudio necesita su cuaderno.");
  return book;
}

export function NotebookShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [book, setBook] = useState(readBook);
  const ready = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const visible = ready ? book : emptyBook;
  const pending = firstPending(stages, visible.pages);

  useEffect(() => {
    const refresh = (event: StorageEvent) => {
      if (!book.notice && (event.key === null || event.key.startsWith(prefix))) setBook(readBook());
    };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted && !book.notice) setBook(readBook());
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("pageshow", restore);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("pageshow", restore);
    };
  }, [book.notice]);

  function persist(key: string, value: string) {
    try {
      localStorage.setItem(prefix + key, value);
    } catch (error) {
      if (!(error instanceof DOMException)) throw error;
      setBook(current => ({ ...current, notice: storageNotice }));
    }
  }
  function write<K extends keyof NotebookPage>(id: string, field: K, value: NotebookPage[K]) {
    persist(`${id}:${field}`, String(value));
    setBook(current => ({
      ...current, pages: { ...current.pages, [id]: { ...(current.pages[id] ?? blankPage), [field]: value } },
    }));
  }
  function toggleTheme() {
    persist("theme", book.dark ? "light" : "dark");
    setBook(current => ({ ...current, dark: !current.dark }));
  }
  return <Notebook.Provider value={{ book: visible, pending, ready, write }}>
    <div className="fieldbook" data-theme={visible.dark ? "dark" : "light"}>
      <a href="#cuaderno" className="fb-skip">Saltar al contenido</a>
      <header className="fb-top"><div className="fb-wrap fb-top-inner">
        <Link href="/" className="fb-brand" aria-label="VisionQuest · Portada"><span aria-hidden="true" className="brand-glyph">VQ</span><span>VisionQuest<small>Cuaderno de campo</small></span></Link>
        <nav aria-label="Navegación principal">
          <Link href="/" aria-current={pathname === "/" ? "page" : pathname?.startsWith("/etapas/") ? "location" : undefined}><Compass /> <span>Etapas</span></Link>
          <Link href="/biblioteca"><Library /> <span>Biblioteca</span></Link>
          <Link href="/practica" aria-current={pathname === "/practica" ? "page" : undefined}><ListChecks /> <span>Práctica</span></Link>
          <button type="button" onClick={toggleTheme} disabled={!ready} aria-label={visible.dark ? "Activar lectura clara" : "Activar lectura oscura"} title="Cambiar tema de lectura"><Eclipse /></button>
        </nav>
      </div></header>
      {visible.notice && <p className="fb-wrap fb-notice" role="alert">{visible.notice}</p>}
      {children}
      <footer className="fb-footer"><div className="fb-wrap"><span><BookOpen /> VisionQuest · Cuaderno de campo</span><span>Apuntes y progreso en este navegador</span></div></footer>
    </div>
  </Notebook.Provider>;
}
