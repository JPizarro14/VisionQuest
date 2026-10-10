import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisionQuest · Aprende Computer Vision",
  description:
    "Ruta interactiva y progresiva para comprender Computer Vision desde sus fundamentos.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
