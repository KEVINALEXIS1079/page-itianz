import { PrismaClient } from "@prisma/client";
import { createProject } from "@/app/actions";
import { AdminProjectItem } from "@/components/AdminProjectItem";
import { ImagePreviewInput } from "@/components/ImagePreviewInput";

const prisma = new PrismaClient();

export default async function AdminProyectos() {
  const projects = await prisma.project.findMany({ orderBy: { orderIndex: 'desc' } });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Administrar Proyectos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Proyecto</h2>
          <form action={createProject} className="flex flex-col gap-4 bg-content1 p-6 rounded-xl border border-white/5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Título</label>
              <input type="text" name="title" required className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Descripción</label>
              <textarea name="description" required className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm min-h-[100px] text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Tipo (ej. Edición, 3D)</label>
              <input type="text" name="type" className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">URL del Video (YouTube o TikTok)</label>
              <input type="text" name="videoUrl" className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">URL de Imagen Principal</label>
                <input type="text" name="imageUrl" className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">o Subir Archivo</label>
                <ImagePreviewInput name="imageFile" />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium">Subir Galería de Proyecto (Múltiples fotos)</label>
                <ImagePreviewInput name="galleryFiles" multiple={true} />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center mt-2 bg-default-100 p-4 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" className="w-4 h-4 rounded text-primary bg-background border-none" />
                <span className="text-sm">Destacado (Inicio)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isHidden" className="w-4 h-4 rounded text-danger bg-background border-none" />
                <span className="text-sm">Oculto</span>
              </label>
              <div className="flex items-center gap-2 text-sm ml-auto">
                <label>Orden (mayor=primero):</label>
                <input type="number" name="orderIndex" defaultValue="0" className="bg-[#2a2a30] border border-white/10 focus:ring-2 focus:ring-primary focus:outline-none w-16 p-1 rounded text-center" />
              </div>
            </div>
            
            <button type="submit" className="mt-4 bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors">Crear Proyecto</button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Proyectos Existentes</h2>
          <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 pb-10">
            {projects.map((project) => (
              <AdminProjectItem key={project.id} project={project} />
            ))}
            {projects.length === 0 && <p className="text-default-500">No hay proyectos.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
