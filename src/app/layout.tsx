import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "itianz | Portafolio Visual, 3D & VFX",
  description: "Portafolio de itianz. Artista 3D y VFX colombiano especializado en edición de cine y creación de contenido.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen flex flex-col text-foreground bg-background">
        <Providers>
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
