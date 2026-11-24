import Image from "next/image";
import type { ReactNode } from "react";

type BannerProps = {
  variant?: "portada" | "etapa";
  code: string;
  eyebrow: ReactNode;
  title: ReactNode;
  children: ReactNode;
};

export function StationBanner({ variant = "etapa", code, eyebrow, title, children }: BannerProps) {
  return (
    <header className="fb-bay" data-variant={variant}>
      <figure className="fb-viewport">
        <Image src="/observation-deck.webp" width={1672} height={941} unoptimized priority
          alt="Estación pixel art: una persona estudia una imagen en su consola frente a montañas y planetas." />
        <figcaption><span>Observatorio</span><b>VQ / {code}</b></figcaption>
      </figure>
      <div className="fb-brief">
        <span className="fb-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        {children}
      </div>
    </header>
  );
}
