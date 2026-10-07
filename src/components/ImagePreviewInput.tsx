"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function ImagePreviewInput({ name, multiple = false }: { name: string, multiple?: boolean }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      let hasError = false;

      for (const file of selectedFiles) {
        if (!file.type.startsWith("image/")) {
          setErrorMsg(`El archivo "${file.name}" no es una imagen válida. Solo se permiten imágenes.`);
          hasError = true;
          break;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          setErrorMsg(`La imagen "${file.name}" excede el límite de ${MAX_FILE_SIZE_MB}MB.`);
          hasError = true;
          break;
        }
        validFiles.push(file);
      }

      if (!hasError) {
        if (multiple) {
          if (files.length + validFiles.length > MAX_FILES) {
            setErrorMsg(`Solo puedes subir un máximo de ${MAX_FILES} imágenes en la galería.`);
          } else {
            setFiles(prev => [...prev, ...validFiles]);
          }
        } else {
          setFiles(validFiles.slice(0, 1));
        }
      }
      
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo si se borró
      e.target.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setErrorMsg(null); // Limpiar errores al borrar
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

      {/* Mensaje de error */}
      {errorMsg && (
        <div className="text-red-400 text-sm mt-1 bg-red-950/30 p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
          <span>⚠️</span> {errorMsg}
        </div>
      )}
      
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
