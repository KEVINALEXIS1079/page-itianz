"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export function ProductCard({ item, resolvedImage }: { item: any, resolvedImage?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);
  
  let galleryImages: string[] = [];
  try {
    if (item.gallery) galleryImages = JSON.parse(item.gallery);
  } catch(e) {}
  
  const mainImage = resolvedImage || item.imageUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600";
  const allImages = [mainImage, ...galleryImages].filter(Boolean) as string[];

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="bg-content1 border border-white/5 rounded-xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(230,57,70,0.15)] transition-all duration-300 group block cursor-pointer">
        <div className="relative aspect-square bg-white/5">
          <Image 
            src={mainImage} 
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {item.discountCode && (
            <div className="absolute top-3 right-3 bg-primary text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-lg z-10">
              Código: {item.discountCode}
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold mb-2 text-foreground truncate">{item.name}</h3>
          <p className="text-sm text-default-500 mb-4 line-clamp-2 min-h-[40px]">{item.description}</p>
          <div className="flex justify-between items-end">
            <span className="text-primary font-black text-xl">{item.price ? `$${item.price}` : 'Consultar'}</span>
          </div>
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" 
              onClick={() => setIsOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="bg-content1 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col sm:flex-row" 
                onClick={e => e.stopPropagation()}
              >
                
                {/* Galería de imágenes en el Modal */}
                <div className="w-full sm:w-1/2 bg-black/50 p-6 flex flex-col justify-center items-center">
                  {allImages.length > 0 ? (
                    <>
                      <div className="relative w-full aspect-square bg-white/5 rounded-xl overflow-hidden mb-4 shadow-xl border border-white/5">
                        <Image src={allImages[currentImageIndex]} alt={item.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                      </div>
                      {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto py-2 w-full">
                          {allImages.map((img, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${currentImageIndex === idx ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                              <Image src={img} alt={`${item.name} thumb ${idx}`} fill sizes="64px" className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full aspect-square bg-white/5 flex items-center justify-center rounded-xl">
                      <span className="text-default-500">Sin imagen</span>
                    </div>
                  )}
                </div>

                {/* Detalles del Producto */}
                <div className="w-full sm:w-1/2 p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-bold text-foreground">{item.name}</h2>
                    <button onClick={() => setIsOpen(false)} className="text-default-500 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex justify-center items-center transition-colors">
                      &times;
                    </button>
                  </div>
                  
                  <div className="flex gap-2 mb-6">
                    {item.isPeripheral ? (
                      <span className="bg-secondary/20 text-secondary text-xs font-bold px-3 py-1 rounded-full">PERIFÉRICO</span>
                    ) : (
                      <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">PRODUCTO</span>
                    )}
                  </div>

                  <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                    <p className="text-lg text-default-500 mb-4">{item.description}</p>
                    {item.details && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Más detalles</h3>
                        <p className="text-default-400 whitespace-pre-wrap text-sm leading-relaxed">{item.details}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-sm text-default-500 uppercase font-bold">Precio</span>
                        <span className="text-3xl font-black text-white">{item.price ? `$${item.price}` : 'Consultar'}</span>
                      </div>
                      {item.referralCode && (
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-default-500 uppercase font-bold">Código Descuento</span>
                          <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">{item.referralCode}</span>
                        </div>
                      )}
                    </div>
                    
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full text-center bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-lg shadow-primary/25 mt-2">
                        Ver en Tienda
                      </a>
                    )}
                  </div>

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
