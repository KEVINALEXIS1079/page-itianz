"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Placeholder data for logos. When the user provides the real ones, we can just replace the paths in a config or pass them as props.
// Logos of the brands the user has collaborated with.
const LOGOS = [
  { id: 1, name: "Blood Strike", src: "/logos/bloodstrike logo (3).png" },
  { id: 2, name: "Delta Force", src: "/logos/deltaforce.png" },
  { id: 3, name: "TopUp", src: "/logos/topupblack.png" },
  { id: 4, name: "Bonoxs", src: "/logos/bonox.png" },
];

export function Collaborations() {
  return (
    <section className="py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 mb-12 text-center">
        <h3 className="text-sm font-bold tracking-[3px] text-default-500 uppercase">Marcas & Colaboraciones</h3>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-12 md:gap-24 px-5">
        {LOGOS.map((logo) => (
          <div key={logo.id} className="relative w-40 h-20 md:w-48 md:h-24 flex items-center justify-center transition-transform hover:scale-105">
            <Image src={logo.src} alt={logo.name} fill className="object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
}
