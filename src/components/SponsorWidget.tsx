"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function SponsorWidget() {
  const pathname = usePathname();
  if (pathname?.startsWith("/portal-secreto-itianz")) return null;

  return (
    <motion.a
      href="https://www.wngstore.com"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }} // Aparece después de que carga la página
      className="fixed bottom-6 left-6 z-[90] bg-[#0f0f0f] border border-[#2a2a2a] hover:border-primary/50 shadow-2xl rounded-2xl p-3 flex items-center gap-3 group transition-all"
    >
      <div className="w-16 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center overflow-hidden relative px-1.5">
        <Image src="/logos/wingsstore.png" alt="Wings Store" fill className="object-contain p-1" />
      </div>
      <div className="flex flex-col pr-2">
        <span className="text-sm font-bold text-white leading-tight">Wings Store</span>
        <span className="text-[10px] font-bold text-primary tracking-wider uppercase mt-0.5">Código ITIANZ 5% OFF</span>
      </div>
    </motion.a>
  );
}
