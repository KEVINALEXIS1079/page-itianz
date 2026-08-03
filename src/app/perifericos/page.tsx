import { PrismaClient } from '@prisma/client'
import { ProductCard } from '@/components/ProductCard'

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

export default async function PerifericosPage() {
  const rawPeripherals = await prisma.product.findMany({
    where: { isPeripheral: true, isHidden: false },
    orderBy: { orderIndex: 'desc' }
  });

  const peripherals = await Promise.all(rawPeripherals.map(async (p) => ({
    ...p,
    resolvedImage: await getProductImage(p)
  })));

  return (
    <div className="min-h-screen py-32 px-5 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold mb-4 text-center">Mis Periféricos</h1>
      <p className="text-default-500 text-center mb-16 text-lg">El equipo exacto que utilizo a diario para trabajar y jugar.</p>
      
      {peripherals.length === 0 ? (
        <p className="text-center text-default-500">No hay periféricos registrados aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {peripherals.map(item => (
            <ProductCard key={item.id} item={item} resolvedImage={item.resolvedImage} />
          ))}
        </div>
      )}
    </div>
  );
}
