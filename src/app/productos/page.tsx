import { PrismaClient } from '@prisma/client'
import { ProductList } from '@/components/ProductList'

export const dynamic = "force-dynamic";

const prisma = new PrismaClient()

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

export default async function ProductosPage() {
  const rawProducts = await prisma.product.findMany({
    where: { isHidden: false },
    orderBy: { orderIndex: 'desc' }
  });

  const products = await Promise.all(rawProducts.map(async (p) => ({
    ...p,
    resolvedImage: await getProductImage(p)
  })));

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="min-h-screen py-32 px-5 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-4 text-center">Todos los Productos</h1>
      <p className="text-default-500 text-center mb-16 text-lg">Explora la lista completa de productos recomendados.</p>
      
      {products.length === 0 ? (
        <p className="text-center text-default-500">No hay productos registrados aún.</p>
      ) : (
        <ProductList products={products} categories={categories} />
      )}
    </div>
  );
}
