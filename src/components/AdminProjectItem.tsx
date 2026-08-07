"use client";

import { useState } from "react";
import { updateProject, deleteProject } from "@/app/actions";
import { ImagePreviewInput } from "@/components/ImagePreviewInput";

export function AdminProjectItem({ project }: { project: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="bg-content1 border border-white/5 p-6 rounded-xl">
        <h3 className="font-bold mb-4">Editar Proyecto</h3>
        <form action={async (formData) => {
          await updateProject(project.id, formData);
          setIsEditing(false);
        }} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs">Título</label>
              <input type="text" name="title" defaultValue={project.title} required className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Tipo (VFX, 3D...)</label>
              <input type="text" name="type" defaultValue={project.type || ""} className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs">Descripción</label>
            <textarea name="description" defaultValue={project.description || ""} required className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm min-h-[80px] text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs">URL del Video (Youtube/TikTok)</label>
            <input type="text" name="videoUrl" defaultValue={project.videoUrl || ""} className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs">URL de la Imagen (Alternativa)</label>
              <input type="text" name="imageUrl" defaultValue={project.imageUrl || ""} className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Subir Imagen Principal</label>
              <ImagePreviewInput name="imageFile" />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs">Subir Galería de Proyecto (Múltiples fotos)</label>
              <ImagePreviewInput name="galleryFiles" multiple={true} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center bg-default-100 p-3 rounded">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" name="featured" defaultChecked={project.featured} className="rounded text-primary" />
              Destacado
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" name="isHidden" defaultChecked={project.isHidden} className="rounded text-danger" />
              Ocultar (Borrado Lógico)
            </label>
            <div className="flex items-center gap-2 text-sm ml-auto">
              <label>Orden:</label>
              <input type="number" name="orderIndex" defaultValue={project.orderIndex} className="bg-[#2a2a30] border border-white/10 focus:ring-2 focus:ring-primary focus:outline-none w-16 p-1 rounded text-center" />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-default-200 rounded-lg text-sm font-medium">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">Guardar Cambios</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-content1 border ${project.isHidden ? 'border-danger/30 opacity-60' : 'border-white/5'} rounded-xl`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
        <div>
          <div className="flex gap-2 items-center flex-wrap">
            <h3 className="font-bold">{project.title}</h3>
            {project.isHidden && <span className="text-[10px] bg-danger/20 text-danger px-2 py-0.5 rounded-full font-bold">OCULTO</span>}
            {project.featured && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Destacado</span>}
            <span className="text-[10px] bg-default-200 px-2 py-0.5 rounded-full text-default-600">Orden: {project.orderIndex}</span>
          </div>
          <p className="text-sm text-default-500 line-clamp-1">{project.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setIsEditing(true)} className="text-foreground bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            Editar
          </button>
          <form action={async () => { await deleteProject(project.id); }}>
            <button type="submit" className="text-danger bg-danger/10 hover:bg-danger/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Eliminar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
