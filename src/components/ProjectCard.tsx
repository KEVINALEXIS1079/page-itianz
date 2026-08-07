"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export function ProjectCard({ project, index, imageSrc }: { project: any, index: number, imageSrc: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  const isYoutube = project.videoUrl?.includes("youtube.com") || project.videoUrl?.includes("youtu.be");
  const isTiktok = project.videoUrl?.includes("tiktok.com");
  
  let embedUrl = "";
  if (isYoutube) {
    const ytMatch = project.videoUrl.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([^&?\/]{11})/);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
  } else if (isTiktok) {
    const tkMatch = project.videoUrl.match(/video\/(\d+)/);
    if (tkMatch && tkMatch[1]) {
      embedUrl = `https://www.tiktok.com/embed/v2/${tkMatch[1]}`;
    } else {
      embedUrl = project.videoUrl;
    }
  }

  const mediaItems: { type: 'video' | 'image', url: string, isTiktok?: boolean }[] = [];
  
  if (embedUrl) {
    mediaItems.push({ type: 'video', url: embedUrl, isTiktok });
  }

  if (project.gallery && JSON.parse(project.gallery).length > 0) {
    const gallery = JSON.parse(project.gallery);
    gallery.forEach((url: string) => mediaItems.push({ type: 'image', url }));
  } else if (project.imageUrl) {
    mediaItems.push({ type: 'image', url: project.imageUrl });
  } else if (!embedUrl) {
    mediaItems.push({ type: 'image', url: imageSrc });
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-14 items-center ${index % 2 !== 0 ? 'md:[&>div:first-child]:order-2 md:[&>div:last-child]:text-right' : ''}`}>
        <div onClick={() => setIsOpen(true)} className="relative rounded-2xl overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-video group bg-white/5">
          <Image 
            src={imageSrc} 
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 group-hover:brightness-50 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {project.videoUrl && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_10px_30px_rgba(230,57,70,0.5)] scale-75 group-hover:scale-100">
               <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
            </div>
          )}
        </div>
        <div>
          <span className="text-primary text-lg font-semibold uppercase tracking-widest block mb-4">{project.type || "Proyecto"}</span>
          <h3 className="text-4xl font-medium mb-6 text-foreground leading-tight">{project.title}</h3>
          <p className="text-lg text-default-500 leading-relaxed font-light">{project.description}</p>
          <button onClick={() => setIsOpen(true)} className="mt-6 text-white hover:text-primary transition-colors uppercase font-bold tracking-widest text-sm flex items-center gap-2 group">
            Ver Proyecto 
            <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" 
              onClick={() => setIsOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="bg-content1 border border-white/10 rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col relative shadow-[0_20px_70px_rgba(0,0,0,0.8)]" 
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-white/20 w-10 h-10 rounded-full flex justify-center items-center transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className={`w-full bg-black flex items-center justify-center relative ${mediaItems[currentImageIndex]?.isTiktok ? 'h-[70vh] sm:h-[80vh]' : 'aspect-video'}`}>
                  {mediaItems[currentImageIndex]?.type === 'video' ? (
                    mediaItems[currentImageIndex].isTiktok && !mediaItems[currentImageIndex].url.includes("embed/v2") ? (
                      <div className="text-center p-8">
                         <p className="mb-4 text-default-500">Este video de TikTok no se puede previsualizar directamente (formato de enlace no soportado para embed).</p>
                         <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">Ver en TikTok</a>
                      </div>
                    ) : (
                      <iframe 
                        src={mediaItems[currentImageIndex].url} 
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    )
                  ) : (
                    <Image src={mediaItems[currentImageIndex]?.url || imageSrc} alt={project.title} fill sizes="(max-width: 768px) 100vw, 80vw" className="object-contain transition-opacity duration-300" />
                  )}
                  
                  {mediaItems.length > 1 && (
                    <>
                      <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors z-10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors z-10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {mediaItems.map((_: any, i: number) => (
                          <button 
                            key={i} 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                    <div>
                      <span className="text-primary text-sm font-bold uppercase tracking-widest">{project.type || "Proyecto"}</span>
                      <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">{project.title}</h2>
                    </div>
                    {project.videoUrl && (
                      <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        Abrir enlace original
                      </a>
                    )}
                  </div>
                  <p className="text-lg text-default-500 mb-6 break-words leading-relaxed">{project.description}</p>

                  {project.details && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Detalles técnicos / Información extra</h3>
                      <p className="text-default-400 whitespace-pre-wrap break-words leading-relaxed">{project.details}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
