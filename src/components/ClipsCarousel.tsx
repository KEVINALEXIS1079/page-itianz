"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { TiltCard } from "./TiltCard";

export function ClipsCarousel({ clips }: { clips: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!clips || clips.length === 0) return null;

  const nextClip = () => setCurrentIndex((prev) => (prev + 1) % clips.length);
  const prevClip = () => setCurrentIndex((prev) => (prev - 1 + clips.length) % clips.length);

  const current = clips[currentIndex];

  const isYoutube = current.videoUrl?.includes("youtube.com") || current.videoUrl?.includes("youtu.be");
  let embedUrl = current.videoUrl;
  
  if (isYoutube) {
    const ytMatch = current.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
  } else if (current.videoUrl?.includes("tiktok.com")) {
    const tkMatch = current.videoUrl.match(/video\/(\d+)/);
    if (tkMatch && tkMatch[1]) {
      embedUrl = `https://www.tiktok.com/embed/v2/${tkMatch[1]}`;
    }
  }

  return (
    <section className="py-32 px-5 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground tracking-tight">
            Edición, Clips & Gaming
          </h2>
          <p className="text-default-500 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Una mezcla de ritmo, efectos puros y acción. Desde edición dinámica de videos hasta montajes y jugadas clave.
          </p>
          <div className="flex justify-center gap-6 text-default-400">
            <svg className="w-8 h-8 hover:text-white transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            <svg className="w-8 h-8 hover:text-white transition-colors cursor-pointer" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </div>
        </div>

        <div className="relative flex items-center">
          <button onClick={prevClip} className="absolute left-0 sm:-left-12 z-20 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center backdrop-blur transition-all">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className="w-full overflow-hidden px-10 sm:px-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-center"
              >
                <div className="text-center lg:text-right order-2 lg:order-1">
                  <span className="text-primary text-sm font-bold tracking-widest uppercase mb-4 block">Montaje</span>
                  <h3 className="text-3xl sm:text-4xl font-semibold mb-6 text-white">{current.title}</h3>
                  <p className="text-default-500 leading-relaxed text-lg">
                    {current.description}
                  </p>
                </div>
                
                <div className="order-1 lg:order-2">
                  <TiltCard>
                    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/5 relative group">
                       <iframe 
                          src={embedUrl} 
                          className="w-full h-full border-0 absolute inset-0 z-10"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        />
                    </div>
                  </TiltCard>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button onClick={nextClip} className="absolute right-0 sm:-right-12 z-20 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center backdrop-blur transition-all">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {clips.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-white/20 hover:bg-white/40'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
