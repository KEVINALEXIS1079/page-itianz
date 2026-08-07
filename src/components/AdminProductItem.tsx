"use client";

import { useState } from "react";
import { updateProduct, deleteProduct } from "@/app/actions";
import { ImagePreviewInput } from "@/components/ImagePreviewInput";

export function AdminProductItem({ product, categories = [] }: { product: any, categories?: any[] }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="bg-content2 p-4 rounded-xl border border-primary/50">
        <form action={updateProduct.bind(null, product.id)} onSubmit={() => setIsEditing(false)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre</label>
            <input type="text" name="name" defaultValue={product.name} required className="bg-default-100 border-none rounded-lg p-2 text-sm text-foreground" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Categoría (Opcional)</label>
            <select name="categoryId" defaultValue={product.categoryId || ""} className="bg-default-100 border-none rounded-lg p-2 text-sm text-foreground">
              <option value="">-- Sin Categoría --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Link Compra</label>
              <input type="text" name="url" defaultValue={product.url || ""} className="bg-default-100 border-none rounded-lg p-2 text-sm text-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Precio</label>
              <input type="number" step="0.01" name="price" defaultValue={product.price || ""} className="bg-default-100 border-none rounded-lg p-2 text-sm text-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Descripción</label>
            <textarea name="description" defaultValue={product.description || ""} required className="bg-default-100 border-none rounded-lg p-2 text-sm min-h-[60px] text-foreground" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Detalles Extra</label>
            <textarea name="details" defaultValue={product.details || ""} className="bg-default-100 border-none rounded-lg p-2 text-sm min-h-[60px] text-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs">URL de la Imagen</label>
              <input type="text" name="imageUrl" defaultValue={product.imageUrl || ""} className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs">Subir Imagen</label>
              <ImagePreviewInput name="imageFile" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs">Subir Galería Múltiple</label>
            <ImagePreviewInput name="galleryFiles" multiple={true} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Código Referido</label>
            <input type="text" name="referralCode" defaultValue={product.referralCode || ""} className="bg-default-100 border-none rounded-lg p-2 text-sm text-foreground" />
          </div>

          <div className="flex flex-wrap gap-4 items-center bg-default-100 p-3 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isPeripheral" defaultChecked={product.isPeripheral} className="w-4 h-4 rounded text-primary bg-background border-none" />
              <span className="text-sm">Periférico</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" defaultChecked={product.featured} className="w-4 h-4 rounded text-primary bg-background border-none" />
              <span className="text-sm">Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isHidden" defaultChecked={product.isHidden} className="w-4 h-4 rounded text-danger bg-background border-none" />
              <span className="text-sm">Oculto</span>
            </label>
            <div className="flex items-center gap-2 text-sm ml-auto">
              <label>Orden:</label>
              <input type="number" name="orderIndex" defaultValue={product.orderIndex} className="bg-background w-16 p-1 rounded text-center border-none" />
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-default-500 hover:text-white transition-colors">Cancelar</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90">Guardar</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-content1 border ${product.isHidden ? 'border-danger/30 opacity-60' : 'border-white/5'} rounded-xl`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
        <div>
          <div className="flex gap-2 items-center flex-wrap">
            <h3 className="font-bold">{product.name}</h3>
            {product.isHidden && <span className="text-[10px] bg-danger/20 text-danger px-2 py-0.5 rounded-full font-bold">OCULTO</span>}
            {product.isPeripheral ? (
              <span className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">Periférico</span>
            ) : (
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Producto</span>
            )}
            <span className="text-[10px] bg-default-200 px-2 py-0.5 rounded-full text-default-600">Orden: {product.orderIndex}</span>
          </div>
          <p className="text-sm text-default-500 line-clamp-1">{product.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setIsEditing(true)} className="text-foreground bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
            Editar
          </button>
          <form action={async () => { await deleteProduct(product.id); }}>
            <button type="submit" className="text-danger bg-danger/10 hover:bg-danger/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Eliminar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
