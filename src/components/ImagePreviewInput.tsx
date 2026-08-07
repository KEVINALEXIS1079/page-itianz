"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export function ImagePreviewInput({ name, multiple = false }: { name: string, multiple?: boolean }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generar URLs de previsualización cada vez que cambia el estado de files
  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      // Limpiar URLs para evitar memory leaks
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [files]);

  // Sincronizar el estado de React con el elemento input nativo para que el formulario se envíe correctamente
  useEffect(() => {
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (multiple) {
        // Acumular archivos si es múltiple
        setFiles(prev => [...prev, ...newFiles]);
      } else {
        // Reemplazar si es único
        setFiles(newFiles);
      }
      
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo si se borró
      e.target.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Botón personalizado para subir */}
      <button 
        type="button" 
        onClick={() => inputRef.current?.click()}
        className="bg-[#2a2a30] hover:bg-[#35353d] border border-white/10 rounded-lg p-2 text-sm text-center font-medium text-foreground transition-colors"
      >
        Seleccionar imagen{multiple ? 'es' : ''}...
      </button>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Previsualizaciones */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2 p-3 bg-black/50 rounded-lg border border-white/5">
          {previews.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 group">
              <Image src={url} alt={`Preview ${i}`} fill className="object-cover" />
              {/* Botón de eliminar (X) */}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 bg-black/70 hover:bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs font-bold"
                title="Eliminar foto"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
