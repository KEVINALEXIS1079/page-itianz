import { PrismaClient } from "@prisma/client";
import { createProduct, createCategory, deleteCategory } from "@/app/actions";
import { AdminProductItem } from "@/components/AdminProductItem";

const prisma = new PrismaClient();

export default async function AdminProductos() {
  const products = await prisma.product.findMany({ orderBy: { orderIndex: 'desc' }, include: { category: true } });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Administrar Productos y Periféricos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          {/* Formulario de Categorías */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Administrar Categorías</h2>
            <div className="bg-content1 p-6 rounded-xl border border-white/5">
              <form action={createCategory} className="flex gap-4 items-end mb-6">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-sm font-medium">Nueva Categoría</label>
                  <input type="text" name="name" required className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Ej. Monitores, Sillas..." />
                </div>
                <button type="submit" className="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">Crear</button>
              </form>
              
              <div className="flex flex-wrap gap-2">
                {categories.length === 0 ? <p className="text-default-500 text-sm">No hay categorías</p> : null}
                {categories.map(cat => (
                  <div key={cat.id} className="bg-default-100 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm">
                    {cat.name}
                    <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                      <button type="submit" className="text-danger hover:text-danger/80 font-bold ml-1">&times;</button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Elemento</h2>
            <form action={createProduct} className="flex flex-col gap-4 bg-content1 p-6 rounded-xl border border-white/5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nombre del Producto</label>
                <input type="text" name="name" required className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Categoría (Opcional)</label>
                <select name="categoryId" className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none">
                  <option value="">-- Sin Categoría --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Link de Compra</label>
                <input type="text" name="url" className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Precio (opcional)</label>
                <input type="number" step="0.01" name="price" className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Descripción Corta</label>
              <textarea name="description" required className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm min-h-[60px] text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Detalles (para el Modal)</label>
              <textarea name="details" className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm min-h-[100px] text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">URL de Imagen</label>
                <input type="text" name="imageUrl" className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">o Subir Archivo</label>
                <input type="file" name="imageFile" accept="image/*" className="bg-[#2a2a30] border border-white/10 rounded-lg p-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Subir Galería Múltiple</label>
              <input type="file" name="galleryFiles" multiple accept="image/*" className="bg-[#2a2a30] border border-white/10 rounded-lg p-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Código de Referido (opcional)</label>
              <input type="text" name="referralCode" className="bg-[#2a2a30] border border-white/10 rounded-lg p-3 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>

            <div className="flex flex-wrap gap-4 items-center mt-2 bg-default-100 p-4 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isPeripheral" className="w-4 h-4 rounded text-primary bg-background border-none" />
                <span className="text-sm">Periférico de mi setup</span>
              </label>
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
            
            <button type="submit" className="mt-4 bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors">Crear Elemento</button>
          </form>
        </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Elementos Existentes</h2>
          <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 pb-10">
            {products.map((product) => (
              <AdminProductItem key={product.id} product={product} categories={categories} />
            ))}
            {products.length === 0 && <p className="text-default-500">No hay productos.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
