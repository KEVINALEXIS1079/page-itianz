import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navbar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SponsorWidget } from "@/components/SponsorWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://itianz.online"),
  title: "itianz. - 3D & VFX Artist",
  description: "Portafolio oficial de itianz. Especialista en 3D, VFX y edición cinemática.",
  openGraph: {
    title: "itianz. - 3D & VFX Artist",
    description: "Portafolio oficial de itianz. Especialista en 3D, VFX y edición cinemática.",
    url: "https://itianz.online",
    siteName: "itianz. Portfolio",
    images: [
      {
        url: "/img/img_perfil.png",
        width: 800,
        height: 1000,
        alt: "itianz. - 3D & VFX Artist",
      }
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "itianz. - 3D & VFX Artist",
    description: "Portafolio oficial de itianz. Especialista en 3D, VFX y edición cinemática.",
    images: ["/img/img_perfil.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col text-foreground bg-background antialiased`}>
        <LoadingScreen />
        <SponsorWidget />
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
