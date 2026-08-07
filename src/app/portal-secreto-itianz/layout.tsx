"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Si estamos en la página de login, no mostrar la UI del dashboard
  if (pathname === "/portal-secreto-itianz/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    // Middleware redirects unauthenticated users, but just in case:
    return null; 
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-content1 border-r border-white/5 p-6 flex flex-col gap-8">
        <div>
          <Link href="/portal-secreto-itianz" className="font-bold text-2xl text-foreground">
            Admin<span className="text-primary">.</span>
          </Link>
          <p className="text-xs text-default-500 mt-2 truncate">{session.user?.email}</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-grow">
          <Link href="/portal-secreto-itianz" className={`font-medium px-4 py-2 rounded-lg transition-colors ${pathname === "/portal-secreto-itianz" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-default-100"}`}>
            Dashboard
          </Link>
          <Link href="/portal-secreto-itianz/proyectos" className={`font-medium px-4 py-2 rounded-lg transition-colors ${pathname === "/portal-secreto-itianz/proyectos" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-default-100"}`}>
            Proyectos
          </Link>
          <Link href="/portal-secreto-itianz/productos" className={`font-medium px-4 py-2 rounded-lg transition-colors ${pathname === "/portal-secreto-itianz/productos" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-default-100"}`}>
            Productos & Periféricos
          </Link>
          <Link href="/portal-secreto-itianz/clips" className={`font-medium px-4 py-2 rounded-lg transition-colors ${pathname === "/portal-secreto-itianz/clips" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-default-100"}`}>
            Clips & Gaming
          </Link>
          <Link href="/" className="mt-8 px-4 opacity-70 hover:opacity-100 text-foreground">
            &larr; Volver a la web
          </Link>
        </nav>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-danger/10 text-danger hover:bg-danger/20 font-medium py-2 rounded-lg transition-colors w-full"
        >
          Cerrar Sesión
        </button>
      </aside>
      
      <main className="flex-grow p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
