import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from '@prisma/client'
import { ProductCard } from "@/components/ProductCard";
import { ProjectCard } from "@/components/ProjectCard";
import { PeripheralsAccordion } from "@/components/PeripheralsAccordion";

const prisma = new PrismaClient()

async function getProjectImage(project: any) {
  if (project.imageUrl) return project.imageUrl;
  if (project.videoUrl) {
    const ytMatch = project.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
    }
    if (project.videoUrl.includes('tiktok.com')) {
      try {
        const res = await fetch(`https://www.tiktok.com/oembed?url=${project.videoUrl}`);
        if (res.ok) {
          const data = await res.json();
          if (data.thumbnail_url) return data.thumbnail_url;
        }
      } catch (e) {}
    }
  }
  return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200";
}

async function getProductImage(product: any) {
  if (product.imageUrl) return product.imageUrl;
  if (product.url) {
    try {
      const res = await fetch(product.url, { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const html = await res.text();
        const match = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
        if (match && match[1]) return match[1];
      }
    } catch(e) {}
  }
  return undefined;
}

export default async function Home() {
  const rawFeaturedProjects = await prisma.project.findMany({
    where: { featured: true, isHidden: false },
    take: 6,
    orderBy: { orderIndex: 'desc' }
  });

  const featuredProjects = await Promise.all(rawFeaturedProjects.map(async (p) => ({
    ...p,
    resolvedImage: await getProjectImage(p)
  })));

  const rawFeaturedProducts = await prisma.product.findMany({
    where: { featured: true, isPeripheral: false, isHidden: false },
    take: 4,
    orderBy: { orderIndex: 'desc' }
  });
  const featuredProducts = await Promise.all(rawFeaturedProducts.map(async (p) => ({
    ...p,
    resolvedImage: await getProductImage(p)
  })));

  const rawFeaturedPeripherals = await prisma.product.findMany({
    where: { featured: true, isPeripheral: true, isHidden: false },
    take: 4,
    orderBy: { orderIndex: 'desc' }
  });
  const featuredPeripherals = await Promise.all(rawFeaturedPeripherals.map(async (p) => ({
    ...p,
    resolvedImage: await getProductImage(p)
  })));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden z-10">
        <div className="absolute inset-0 z-[-1] opacity-95 hero-bg-animation">
           {/* Fallback dark overlay, the real animation comes from globals.css driftRealSpace if we apply it */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
           <div className="absolute inset-0 bg-cover bg-center drift-bg" style={{backgroundImage: "url('/img/imagefondo.png')"}} />
        </div>
        
        <h1 className="text-[clamp(4rem,8vw,9rem)] font-bold uppercase tracking-[-4px] mb-0 opacity-0 animate-[slideUpFade_1.2s_cubic-bezier(0.2,0.8,0.2,1)_forwards] text-white">
          ITIANZ<span className="text-primary">.</span>
        </h1>
        <p className="text-[clamp(1rem,2vw,1.4rem)] font-normal text-default-500 max-w-[600px] mt-2 tracking-[1px] opacity-0 animate-[slideUpFade_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.2s_forwards]">
          VFX, Edición Dinámica & Highlights Gaming.
        </p>
        <div className="flex justify-center gap-5 mt-10 opacity-0 animate-[slideUpFade_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.4s_forwards]">
          <Link href="#portfolio" className="bg-primary text-white px-8 py-4 rounded-xl font-semibold shadow-[0_8px_25px_rgba(230,57,70,0.3)] hover:shadow-[0_10px_30px_rgba(230,57,70,0.5)] transition-all">
            Ver mis trabajos
          </Link>
          <Link href="#contacto" className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
            Contactar
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-5 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Image 
              src="/img/img_perfil.png" 
              alt="Perfil itianz" 
              width={600} 
              height={750} 
              className="w-full h-auto object-cover aspect-[4/5] contrast-110 brightness-90"
            />
            <div className="absolute bottom-8 right-0 bg-primary py-6 px-8 rounded-l-xl flex items-center gap-4 shadow-[-10px_15px_30px_rgba(230,57,70,0.4)]">
              <span className="text-5xl font-black text-white leading-none">3+</span>
              <span className="text-sm text-white/90 font-semibold uppercase leading-tight">Años de<br/>Experiencia</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-4">Sobre Mí</h2>
            <h3 className="text-primary text-lg mb-6 tracking-[3px] uppercase font-semibold">3D · VFX Artist | Film Editing</h3>
            <p className="text-default-500 text-lg leading-relaxed mb-8">
              Soy <strong className="text-foreground">itianz</strong>, un artista visual colombiano de 21 años, especializado en postproducción técnica, creación de contenido freelance y efectos visuales de alto impacto (VFX). Transformo ideas en piezas visuales inmersivas combinando diseño 3D y una edición con ritmo cinemático.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-content1 border border-white/5 p-5 rounded-xl flex items-center gap-4 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-2xl text-primary">⚡</div>
                <div>
                  <h4 className="text-foreground text-lg mb-1">Blender 3D</h4>
                  <span className="text-default-500 text-sm">3 Años de Exp.</span>
                </div>
              </div>
              <div className="bg-content1 border border-white/5 p-5 rounded-xl flex items-center gap-4 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-2xl text-primary">🎬</div>
                <div>
                  <h4 className="text-foreground text-lg mb-1">DaVinci Resolve</h4>
                  <span className="text-default-500 text-sm">2 Años de Exp.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Peripherals Accordion */}
      {featuredPeripherals.length > 0 && (
        <PeripheralsAccordion peripherals={featuredPeripherals} />
      )}

      {/* Projects Portfolio */}
      <section id="portfolio" className="py-24 px-5 max-w-7xl mx-auto w-full">
        <h2 className="text-center text-4xl font-bold mb-20">Proyectos & Visual Frames</h2>
        
        {featuredProjects.length === 0 ? (
          <p className="text-center text-default-500">No hay proyectos destacados aún.</p>
        ) : (
          <>
            <div className="flex flex-col gap-28">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} imageSrc={project.resolvedImage} />
              ))}
            </div>
            <div className="mt-20 text-center">
              <Link href="/proyectos" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
                Ver todos los proyectos
              </Link>
            </div>
          </>
        )}
      </section>

      <div className="neon-divider" />

      {/* Featured Products & Peripherals */}
      <section id="featured-products" className="py-24 px-5 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl font-bold mb-6">Setup & Productos</h2>
          <p className="text-center text-default-500 mb-16 text-lg max-w-2xl mx-auto">
            El equipo que utilizo a diario y productos recomendados.
          </p>

          {featuredPeripherals.length > 0 && (
            <div className="mb-20">
              <h3 className="text-2xl font-bold mb-8 text-primary border-l-4 border-primary pl-4">Periféricos Destacados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPeripherals.map(item => (
                  <ProductCard key={item.id} item={item} resolvedImage={item.resolvedImage} />
                ))}
              </div>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-8 text-primary border-l-4 border-primary pl-4">Productos Destacados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(item => (
                  <ProductCard key={item.id} item={item} resolvedImage={item.resolvedImage} />
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-12 text-center flex gap-4 justify-center">
            <Link href="/perifericos" className="bg-primary/20 text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/30 transition-colors">Ver todos los periféricos</Link>
            <Link href="/productos" className="bg-secondary/20 text-secondary px-6 py-3 rounded-lg font-medium hover:bg-secondary/30 transition-colors">Ver todos los productos</Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer id="contacto" className="py-32 px-5 bg-[#050505] text-center flex flex-col items-center justify-center">
        <div className="mb-32">
            <h2 className="text-[clamp(3rem,8vw,8rem)] font-semibold tracking-[-2px] text-white uppercase leading-tight mb-5 hover:scale-105 transition-transform duration-500">¿CREAMOS ALGO?</h2>
            <a href="mailto:itianz.business@gmail.com" className="inline-block text-[clamp(1.2rem,3vw,2.5rem)] text-default-500 hover:text-white font-light relative group transition-colors">
                itianz.business@gmail.com
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
        </div>
        
        <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center border-t border-white/10 pt-8 gap-8">
            <div className="text-2xl font-black">itianz<span className="text-primary">.</span></div>
            <div className="text-sm text-default-600">
                &copy; 2026 itianz. 3D & VFX Artist.
            </div>
        </div>
      </footer>
    </div>
  );
}

