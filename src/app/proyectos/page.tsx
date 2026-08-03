import { PrismaClient } from '@prisma/client';
import { ProjectCard } from "@/components/ProjectCard";

const prisma = new PrismaClient();

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
