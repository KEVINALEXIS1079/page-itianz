"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Inicio", href: "/#hero" },
    { name: "Sobre Mí", href: "/#about" },
    { name: "Proyectos", href: "/proyectos" },
    { name: "Destacados", href: "/#clips" },
    { name: "Contacto", href: "https://mail.google.com/mail/?view=cm&fs=1&to=itianz.business@gmail.com" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
      {/* 1. Logo a la izquierda */}
      <Link href="/" className="font-bold text-2xl text-foreground tracking-tight">
        itianz<span className="text-primary">.</span>
      </Link>

      {/* 2. Enlaces en el centro */}
      <div className="hidden sm:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        {menuItems.map((item, index) => (
          item.href.startsWith("http") ? (
            <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition-all text-sm font-medium text-default-500">
              {item.name}
            </a>
          ) : (
            <Link key={index} href={item.href} className="hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition-all text-sm font-medium text-default-500">
              {item.name}
            </Link>
          )
        ))}
        <div className="w-px h-4 bg-white/20 mx-2"></div>
        <Link href="/productos" className="hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition-all text-sm font-medium text-primary">
          Productos
        </Link>
        <Link href="/perifericos" className="hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-full transition-all text-sm font-medium text-primary">
          Periféricos
        </Link>
      </div>

      {/* 3. Íconos sociales a la derecha */}
      <div className="hidden sm:flex items-center gap-5">
        <Link href="https://www.tiktok.com/@itianz_?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors" aria-label="TikTok">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-[18px] h-[18px]"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
        </Link>
        <Link href="https://www.instagram.com/itianz_/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-[18px] h-[18px]"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
        </Link>
        <Link href="https://youtube.com/@itianz23?si=RsGzykk1MJAMiJFO" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors" aria-label="YouTube">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="w-[20px] h-[20px]"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="sm:hidden text-foreground hover:text-primary"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl flex flex-col p-6 gap-4 border-b border-white/5 sm:hidden"
          >
            {menuItems.map((item, index) => (
              item.href.startsWith("http") ? (
                <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="text-xl text-default-500 hover:text-white transition-colors">
                  {item.name}
                </a>
              ) : (
                <Link key={index} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-xl text-default-500 hover:text-white transition-colors">
                  {item.name}
                </Link>
              )
            ))}
            <Link href="/productos" onClick={() => setIsMenuOpen(false)} className="text-xl text-primary font-medium hover:text-white transition-colors">Productos</Link>
            <Link href="/perifericos" onClick={() => setIsMenuOpen(false)} className="text-xl text-primary font-medium hover:text-white transition-colors">Periféricos</Link>
            
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
              <Link href="https://www.tiktok.com/@itianz_?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-default-500 hover:text-white transition-colors" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-[20px] h-[20px]"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
              </Link>
              <Link href="https://www.instagram.com/itianz_/" target="_blank" rel="noopener noreferrer" className="text-default-500 hover:text-white transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-[20px] h-[20px]"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
              </Link>
              <Link href="https://youtube.com/@itianz23?si=RsGzykk1MJAMiJFO" target="_blank" rel="noopener noreferrer" className="text-default-500 hover:text-white transition-colors" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="w-[22px] h-[22px]"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
