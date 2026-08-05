"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";

export function PeripheralsCarousel({ peripherals }: { peripherals: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!peripherals || peripherals.length === 0) return null;

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.scrollWidth / peripherals.length;
      const newIndex = Math.round(scrollPosition / itemWidth);
      setActiveIndex(newIndex);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.scrollWidth / peripherals.length;
      scrollRef.current.scrollBy({ left: direction === "left" ? -itemWidth : itemWidth, behavior: "smooth" });
    }
  };

  const scrollToItem = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.scrollWidth / peripherals.length;
      scrollRef.current.scrollTo({ left: itemWidth * index, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 px-5 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-4">
        <div className="w-full relative group/accordion">
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-full flex items-center justify-between p-6 bg-[#0f0f0f] hover:bg-[#161616] border border-white/5 transition-all duration-300 z-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${isOpen ? 'rounded-t-2xl border-b-primary/50' : 'rounded-2xl'}`}
          >
            <div className="flex-1 text-center">
              <span className="text-xl font-bold text-white tracking-[0.2em] uppercase">Mis Periféricos</span>
            </div>
            <div className="w-6 flex justify-end">
              <motion.svg 
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-6 h-6 text-primary" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </div>
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden bg-[#0f0f0f] border-x border-b border-white/5 rounded-b-2xl relative z-10"
              >
                <div className="p-8 relative group/carousel">
                  
                  {/* Botones de navegación (PC) */}
                  <button 
                    onClick={() => scroll("left")}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary/90 backdrop-blur-md p-3 rounded-full border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all hidden sm:block shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  <button 
                    onClick={() => scroll("right")}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary/90 backdrop-blur-md p-3 rounded-full border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all hidden sm:block shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </button>

                  {/* Contenedor del Carrusel */}
                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto gap-6 pb-4 custom-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {peripherals.map((item) => (
                      <div 
                        key={item.id} 
                        className="w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] shrink-0 snap-center sm:snap-start"
                      >
                        <ProductCard item={item} resolvedImage={item.resolvedImage} />
                      </div>
                    ))}
                  </div>

                  {/* Puntos de Paginación */}
                  <div className="flex justify-center gap-3 mt-4">
                    {peripherals.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToItem(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-primary w-8' : 'bg-white/20 hover:bg-white/50'}`}
                        aria-label={`Ir al slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Botones de navegación (Móvil) */}
                  <div className="flex justify-center gap-6 mt-6 sm:hidden">
                    <button onClick={() => scroll("left")} className="p-4 bg-white/5 border border-white/10 rounded-full active:bg-primary/50 transition-colors"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
                    <button onClick={() => scroll("right")} className="p-4 bg-white/5 border border-white/10 rounded-full active:bg-primary/50 transition-colors"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
