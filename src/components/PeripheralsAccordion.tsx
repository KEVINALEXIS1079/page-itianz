"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";

export function PeripheralsAccordion({ peripherals }: { peripherals: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!peripherals || peripherals.length === 0) return null;

  return (
    <section className="py-12 px-5 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-4">
        <div className="w-full relative group">
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-full flex items-center justify-between p-6 bg-[#0f0f0f] hover:bg-[#161616] border border-white/5 transition-all duration-300 z-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${isOpen ? 'rounded-t-2xl border-b-primary/50' : 'rounded-2xl'}`}
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
                className="overflow-hidden bg-[#0f0f0f] border-x border-b border-white/5 rounded-b-2xl relative z-0"
              >
                <div className="p-8">
                  <div className="flex overflow-x-auto gap-8 pb-6 custom-scrollbar snap-x snap-mandatory">
                    {peripherals.map((item, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        key={item.id} 
                        className="w-[280px] sm:w-[320px] shrink-0 snap-start"
                      >
                        <ProductCard item={item} resolvedImage={item.resolvedImage} />
                      </motion.div>
                    ))}
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
