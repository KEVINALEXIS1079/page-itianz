const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.project.findMany({ orderBy: { id: 'desc' }, take: 3 });
  console.log(JSON.stringify(p, null, 2));
}
main().catch(console.error).finally(() => prisma.());
