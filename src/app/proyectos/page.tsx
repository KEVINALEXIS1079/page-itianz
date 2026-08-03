import { PrismaClient } from '@prisma/client';
import { ProjectCard } from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

async function getProjectImage(project: any) {
  if (project.imageUrl) return project.imageUrl;
  if (project.videoUrl) {
    if (project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be')) {
      const match = project.videoUrl.match(/[?&]v=([^&]+)/) || project.videoUrl.match(/youtu\.be\/([^?]+)/);
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

export default async function ProyectosPage() {
  const rawProjects = await prisma.project.findMany({
    where: { isHidden: false },
    orderBy: { orderIndex: 'desc' }
  });

  const projects = await Promise.all(rawProjects.map(async (p) => ({
    ...p,
    resolvedImage: await getProjectImage(p)
  })));

  return (
    <div className="min-h-screen py-32 px-5 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-4 text-center">Todos los Proyectos</h1>
      <p className="text-default-500 text-center mb-16 text-lg">Explora la galería completa de mis trabajos, VFX y edición.</p>
      
      {projects.length === 0 ? (
        <p className="text-center text-default-500">No hay proyectos registrados aún.</p>
      ) : (
        <div className="flex flex-col gap-28 mt-20">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} imageSrc={project.resolvedImage} />
          ))}
        </div>
      )}
    </div>
  );
}
