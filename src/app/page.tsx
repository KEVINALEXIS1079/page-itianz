import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from '@prisma/client'
import { TiltCard } from "@/components/TiltCard";
import { NebulaBackground } from "@/components/NebulaBackground";
import { ProductCard } from "@/components/ProductCard";
import { ProjectCard } from "@/components/ProjectCard";
import { PeripheralsCarousel } from "@/components/PeripheralsCarousel";
import { FadeInView } from "@/components/FadeInView";
import { ClipsCarousel } from "@/components/ClipsCarousel";
import { Collaborations } from "@/components/Collaborations";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient()

async function getProjectImage(project: any) {
  if (project.imageUrl) return project.imageUrl;
  if (project.gallery) {
    try {
      const gallery = JSON.parse(project.gallery);
      if (gallery && gallery.length > 0) return gallery[0];
    } catch(e) {}
  }
  if (project.videoUrl) {
    if (project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be')) {
      const match = project.videoUrl.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([^&?\/]{11})/);
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
      }
    } else if (project.videoUrl.includes('artstation.com') || project.videoUrl.includes('instagram.com')) {
      try {
        const res = await fetch(project.videoUrl, { 
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          signal: AbortSignal.timeout(3000)
        });
        if (res.ok) {
          const html = await res.text();
          const match = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
          if (match && match[1]) return match[1];
        }
      } catch(e) {}
    } else if (project.videoUrl.includes('tiktok.com')) {
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

  const clips = await prisma.clip.findMany({
    where: { isHidden: false },
    take: 6,
    orderBy: { orderIndex: 'desc' }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <section id="hero" className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden z-10 pointer-events-none">
        <NebulaBackground />
        <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
        <div className="absolute bottom-[15vh] flex flex-col items-center z-20 w-full px-5 pointer-events-none">
          <FadeInView delay={0.2} direction="up">
            <p className="text-[clamp(1rem,2vw,1.4rem)] font-normal text-default-500 max-w-[600px] tracking-[1px] mb-8">
              VFX, Edición Dinámica & Highlights Gaming.
            </p>
          </FadeInView>
          <FadeInView delay={0.4} direction="up">
            <div className="flex justify-center gap-5 pointer-events-auto">
              <Link href="#portfolio" className="bg-primary text-white px-8 py-4 rounded-xl font-semibold shadow-[0_8px_25px_rgba(230,57,70,0.3)] hover:shadow-[0_10px_30px_rgba(230,57,70,0.5)] transition-all">
                Ver mis trabajos
              </Link>
              <Link href="#contacto" className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                Contactar
              </Link>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-5 bg-background overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-16 items-center">
          <FadeInView direction="left">
            <TiltCard>
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
            </TiltCard>
          </FadeInView>
          
          <FadeInView direction="right" delay={0.2}>
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
          </FadeInView>
        </div>
      </section>

      {/* Peripherals Carousel */}
      {featuredPeripherals.length > 0 && (
        <FadeInView direction="up">
          <PeripheralsCarousel peripherals={featuredPeripherals} />
        </FadeInView>
      )}

      {/* Projects Portfolio */}
      <section id="portfolio" className="py-24 px-5 max-w-7xl mx-auto w-full">
        <FadeInView direction="up">
          <h2 className="text-center text-4xl font-bold mb-20">Proyectos & Visual Frames</h2>
        </FadeInView>
        
        {featuredProjects.length === 0 ? (
          <p className="text-center text-default-500">No hay proyectos destacados aún.</p>
        ) : (
          <>
            <div className="flex flex-col gap-28">
              {featuredProjects.map((project, index) => (
                <FadeInView key={project.id} direction="up" delay={0.1}>
                  <ProjectCard project={project} index={index} imageSrc={project.resolvedImage} />
                </FadeInView>
              ))}
            </div>
            <FadeInView direction="up">
              <div className="mt-20 text-center">
                <Link href="/proyectos" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)]">
                  Ver todos los proyectos
                </Link>
              </div>
            </FadeInView>
          </>
        )}
      </section>

      <div className="neon-divider" />

      {/* Featured Products & Peripherals */}
      <section id="featured-products" className="py-24 px-5 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeInView direction="up">
            <h2 className="text-center text-4xl font-bold mb-6">Setup & Productos</h2>
            <p className="text-center text-default-500 mb-16 text-lg max-w-2xl mx-auto">
              El equipo que utilizo a diario y productos recomendados.
            </p>
          </FadeInView>

          {featuredPeripherals.length > 0 && (
            <div className="mb-20">
              <FadeInView direction="left">
                <h3 className="text-2xl font-bold mb-8 text-primary border-l-4 border-primary pl-4">Periféricos Destacados</h3>
              </FadeInView>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPeripherals.map((item, i) => (
                  <FadeInView key={item.id} direction="up" delay={i * 0.1}>
                    <ProductCard item={item} resolvedImage={item.resolvedImage} />
                  </FadeInView>
                ))}
              </div>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div>
              <FadeInView direction="right">
                <h3 className="text-2xl font-bold mb-8 text-primary border-l-4 border-primary pl-4">Productos Destacados</h3>
              </FadeInView>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((item, i) => (
                  <FadeInView key={item.id} direction="up" delay={i * 0.1}>
                    <ProductCard item={item} resolvedImage={item.resolvedImage} />
                  </FadeInView>
                ))}
              </div>
            </div>
          )}
          
          <FadeInView direction="up" delay={0.2}>
            <div className="mt-12 text-center flex flex-wrap gap-4 justify-center">
              <Link href="/perifericos" className="bg-primary/20 text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/30 transition-colors">Ver todos los periféricos</Link>
              <Link href="/productos" className="bg-secondary/20 text-secondary px-6 py-3 rounded-lg font-medium hover:bg-secondary/30 transition-colors">Ver todos los productos</Link>
            </div>
          </FadeInView>
        </div>
      </section>
      
      {/* Edición, Clips & Gaming Section */}
      <ClipsCarousel clips={clips} />

      {/* Contact Section / Footer */}
      <footer id="contacto" className="pt-32 pb-8 px-5 bg-[#050505] text-center flex flex-col items-center justify-center overflow-hidden">
        <div className="mb-20">
            <h2 className="text-[clamp(3rem,8vw,8rem)] font-semibold tracking-[-2px] text-white uppercase leading-tight mb-5 transition-all duration-500 hover:[text-shadow:0_0_30px_rgba(255,255,255,0.4)]">¿CREAMOS ALGO?</h2>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=itianz.business@gmail.com" target="_blank" rel="noopener noreferrer" className="inline-block text-[clamp(1.2rem,3vw,2.5rem)] text-default-500 hover:text-white font-light relative group transition-colors">
                itianz.business@gmail.com
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
        </div>

        <div className="w-full mb-20">
          <Collaborations />
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

