import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function AdminDashboard() {
  const projectsCount = await prisma.project.count();
  const productsCount = await prisma.product.count({ where: { isPeripheral: false } });
  const peripheralsCount = await prisma.product.count({ where: { isPeripheral: true } });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Resumen</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-content1 border border-white/5 rounded-xl shadow-md overflow-hidden">
          <div className="pb-0 pt-6 px-6 flex flex-col items-start">
            <p className="text-xs uppercase font-bold text-default-500">Proyectos</p>
            <h4 className="font-bold text-4xl mt-2">{projectsCount}</h4>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-default-400">Proyectos en el portafolio</p>
          </div>
        </div>
        
        <div className="bg-content1 border border-white/5 rounded-xl shadow-md overflow-hidden">
          <div className="pb-0 pt-6 px-6 flex flex-col items-start">
            <p className="text-xs uppercase font-bold text-default-500">Productos</p>
            <h4 className="font-bold text-4xl mt-2">{productsCount}</h4>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-default-400">Productos recomendados</p>
          </div>
        </div>
        
        <div className="bg-content1 border border-white/5 rounded-xl shadow-md overflow-hidden">
          <div className="pb-0 pt-6 px-6 flex flex-col items-start">
            <p className="text-xs uppercase font-bold text-default-500">Periféricos</p>
            <h4 className="font-bold text-4xl mt-2">{peripheralsCount}</h4>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-default-400">Periféricos del setup</p>
          </div>
        </div>
      </div>
    </div>
  );
}
