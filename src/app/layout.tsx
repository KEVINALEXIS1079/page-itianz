import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navbar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SponsorWidget } from "@/components/SponsorWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "itianz. - 3D & VFX Artist",
  description: "Portafolio oficial de itianz. Especialista en 3D, VFX y edición cinemática.",
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
