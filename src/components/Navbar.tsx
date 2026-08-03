"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Inicio", href: "/#hero" },
    { name: "Sobre Mí", href: "/#about" },
    { name: "Proyectos", href: "/proyectos" },
    { name: "Destacados", href: "/#clips" },
    { name: "Contacto", href: "/#contacto" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-2xl text-foreground tracking-tight">
        itianz<span className="text-primary">.</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden sm:flex gap-6">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} className="hover:text-primary transition-colors text-sm font-medium">
            {item.name}
          </Link>
        ))}
      </div>

      <div className="hidden sm:flex gap-4">
        <Link href="/productos" className="hover:text-primary transition-colors text-sm font-medium">
          Productos
        </Link>
        <Link href="/perifericos" className="hover:text-primary transition-colors text-sm font-medium">
          Periféricos
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
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl flex flex-col p-6 gap-4 border-b border-white/5 sm:hidden">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-xl">
              {item.name}
            </Link>
          ))}
          <Link href="/productos" onClick={() => setIsMenuOpen(false)} className="text-xl text-primary">Productos</Link>
          <Link href="/perifericos" onClick={() => setIsMenuOpen(false)} className="text-xl text-primary">Periféricos</Link>
        </div>
      )}
    </nav>
  );
}
